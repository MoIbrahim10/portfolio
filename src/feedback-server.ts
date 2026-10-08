const postcardIdPattern = /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i

type PublicPostcard = {
  id: string
  kind: 'love' | 'idea' | 'issue'
  message: string
  name: string
  created_at: string
}

type FeedbackEnv = Env & Partial<Record<'TELEGRAM_BOT_TOKEN' | 'TELEGRAM_CHAT_ID', string>>

async function notifyTelegram(env: FeedbackEnv, kind: string, name: string, message: string) {
  const token = env.TELEGRAM_BOT_TOKEN
  const chatId = env.TELEGRAM_CHAT_ID
  if (!token || !chatId) return

  try {
    const response = await fetch(`https://api.telegram.org/bot${token}/sendMessage`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        chat_id: chatId,
        text: `New portfolio feedback\nType: ${kind}\nFrom: ${name || 'Anonymous'}\n\n${message}`,
      }),
      signal: AbortSignal.timeout(5_000),
    })
    if (!response.ok) console.warn('Telegram feedback notification failed', response.status)
  } catch {
    console.warn('Telegram feedback notification failed')
  }
}

function reply(status: number, body: Record<string, unknown>) {
  return Response.json(body, {
    status,
    headers: { 'Cache-Control': 'no-store' },
  })
}

export async function handlePublicFeedback(request: Request, env: Env) {
  if (request.method !== 'GET') {
    const response = reply(405, { error: 'Use GET to view the postcard wall.' })
    response.headers.set('Allow', 'GET')
    return response
  }

  const cursor = new URL(request.url).searchParams.get('cursor')
  let before: { created_at: string; id: string } | undefined
  if (cursor !== null) {
    try {
      if (!/^[A-Za-z0-9_-]{82}$/.test(cursor)) throw new Error('Invalid cursor')
      const [created_at, id] = atob(cursor.replaceAll('-', '+').replaceAll('_', '/')).split('|')
      if (
        !/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}\.\d{3}Z$/.test(created_at) ||
        new Date(created_at).toISOString() !== created_at ||
        !postcardIdPattern.test(id)
      ) throw new Error('Invalid cursor')
      before = { created_at, id }
    } catch {
      return reply(400, { error: 'This postcard wall page is invalid. Please start again.' })
    }
  }

  try {
    const query = before
      ? env.FEEDBACK_DB.prepare(
        "SELECT id, kind, message, name, created_at FROM feedback WHERE visibility = 'public' AND (created_at, id) < (?, ?) ORDER BY created_at DESC, id DESC LIMIT ?",
      ).bind(before.created_at, before.id, 25)
      : env.FEEDBACK_DB.prepare(
        "SELECT id, kind, message, name, created_at FROM feedback WHERE visibility = 'public' ORDER BY created_at DESC, id DESC LIMIT ?",
      ).bind(25)
    const { results } = await query.all<PublicPostcard>()
    const postcards = results.slice(0, 24)
    const last = postcards.at(-1)
    const nextCursor = results.length > 24 && last
      ? btoa(`${last.created_at}|${last.id}`).replaceAll('+', '-').replaceAll('/', '_').replaceAll('=', '')
      : null

    return reply(200, { postcards, nextCursor })
  } catch (error) {
    console.error('Public feedback retrieval failed', error)
    return reply(503, { error: 'The postcard wall is temporarily unavailable. Please try again.' })
  }
}

export async function handleFeedback(request: Request, env: FeedbackEnv) {
  if (request.method !== 'POST') {
    const response = reply(405, { error: 'Use POST to send a postcard.' })
    response.headers.set('Allow', 'POST')
    return response
  }

  if (request.headers.get('origin') !== new URL(request.url).origin) {
    return reply(403, { error: 'Please send your postcard from this site.' })
  }

  if (!request.headers.get('content-type')?.startsWith('application/json')) {
    return reply(415, { error: 'Please send a valid postcard.' })
  }

  const reader = request.body?.getReader()
  if (!reader) return reply(400, { error: 'Your postcard is empty.' })

  const chunks: Uint8Array[] = []
  let size = 0
  while (true) {
    const { done, value } = await reader.read()
    if (done) break
    size += value.byteLength
    if (size > 12_000) {
      await reader.cancel()
      return reply(413, { error: 'Your postcard is too long.' })
    }
    chunks.push(value)
  }

  let postcard: unknown
  try {
    const bytes = new Uint8Array(size)
    let offset = 0
    for (const chunk of chunks) {
      bytes.set(chunk, offset)
      offset += chunk.byteLength
    }
    postcard = JSON.parse(new TextDecoder().decode(bytes))
  } catch {
    return reply(400, { error: 'Please send a valid postcard.' })
  }

  if (!postcard || typeof postcard !== 'object') {
    return reply(400, { error: 'Please send a valid postcard.' })
  }

  const { id, kind, message, name, website, visibility = 'private' } = postcard as Record<string, unknown>
  if (visibility !== 'private' && visibility !== 'public') {
    return reply(422, { error: 'Choose whether your postcard is private or public.' })
  }

  if (
    typeof id !== 'string' ||
    !postcardIdPattern.test(id) ||
    !['love', 'idea', 'issue'].includes(String(kind)) ||
    typeof message !== 'string' ||
    message.trim().length < 3 ||
    message.trim().length > 2000 ||
    typeof name !== 'string' ||
    name.trim().length > 80 ||
    website !== ''
  ) {
    return reply(422, { error: 'Add a note of 3–2,000 characters and a name under 80 characters.' })
  }

  try {
    const { success } = await env.FEEDBACK_RATE_LIMITER.limit({
      key: request.headers.get('CF-Connecting-IP') ?? 'local',
    })
    if (!success) {
      const response = reply(429, { error: 'A few too many postcards. Please try again in a minute.' })
      response.headers.set('Retry-After', '60')
      return response
    }

    const result = await env.FEEDBACK_DB.prepare(
      'INSERT INTO feedback (id, kind, message, name, visibility) VALUES (?, ?, ?, ?, ?) ON CONFLICT(id) DO NOTHING',
    ).bind(id, kind, message.trim(), name.trim(), visibility).run()

    if (result.meta.changes > 0) {
      await notifyTelegram(env, String(kind), name.trim(), message.trim())
    }

    return reply(201, { id })
  } catch (error) {
    console.error('Feedback storage failed', error)
    return reply(503, { error: 'The mailbox is temporarily unavailable. Your note is still here; please try again.' })
  }
}
