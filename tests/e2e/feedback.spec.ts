import { expect, test } from '@playwright/test'

test('postcard controls wait for hydration before accepting input', async ({ page }) => {
  let resume = () => {}
  const hydration = new Promise<void>((resolve) => { resume = resolve })
  await page.route('**/*', async (route) => {
    if (route.request().resourceType() === 'script') await hydration
    await route.continue()
  })
  await page.goto('/feedback', { waitUntil: 'commit' })
  const write = page.getByRole('button', { name: 'Write a note', exact: true })
  const stamp = page.getByRole('radio', { name: 'Loved it', exact: true })
  try {
    await expect(write).toBeDisabled()
    await expect(stamp).toBeDisabled()
  } finally {
    resume()
  }
  await expect(write).toBeEnabled()
  await expect(stamp).toBeEnabled()
  await write.press('Enter')
  await expect(page.getByRole('textbox', { name: 'Your feedback' })).toBeFocused()
})

test('retired postcard studios return the portfolio 404 page', async ({ page }) => {
  for (const path of ['/postcard-studio', '/postcard-back-studio', '/postcard-front-studio']) {
    const response = await page.goto(path)
    expect(response?.status()).toBe(404)
    await expect(page.getByRole('heading', { name: 'Page not found', exact: true })).toBeVisible()
    await expect(page.getByRole('link', { name: 'Return home', exact: true })).toHaveAttribute('href', '/')
  }
})

test('writing controls activate after the postcard finishes turning', async ({ page }) => {
  await page.emulateMedia({ reducedMotion: 'no-preference' })
  await page.goto('/feedback')
  const write = page.getByRole('button', { name: 'Write a note', exact: true })
  await expect(write).toBeEnabled()
  const turning = page.locator('#feedback-postcard').evaluate((card) => new Promise<boolean[]>((resolve) => {
    const form = card.querySelector('form')!
    const send = form.querySelector<HTMLButtonElement>('button[type="submit"]')!
    const samples: boolean[] = []
    const observer = new MutationObserver(() => {
      const angle = Number((card as HTMLElement).style.transform.match(/rotateY\(([\d.]+)deg\)/)?.[1] ?? 0)
      if (angle > 0 && angle < 180) samples.push(form.inert && send.disabled)
      if (angle === 180 && !form.inert) {
        observer.disconnect()
        resolve(samples)
      }
    })
    observer.observe(card, { attributes: true, subtree: true, attributeFilter: ['style', 'inert'] })
  }))
  await write.click()
  const samples = await turning
  expect(samples.length).toBeGreaterThan(0)
  expect(samples.every(Boolean)).toBe(true)
  await expect(page.getByRole('textbox', { name: 'Your feedback' })).toBeFocused()
  await expect(page.getByRole('button', { name: 'Send postcard', exact: true })).toBeEnabled()
})

test('the homepage note button opens the postcard and the flip control keeps a draft', async ({ page }, testInfo) => {
  await page.emulateMedia({ reducedMotion: 'reduce' })
  await page.goto('/')
  const entry = page.getByRole('link', { name: 'Leave a note', exact: true })
  await expect(entry).toHaveAttribute('href', '/feedback')
  await expect(page.getByRole('link', { name: /Send a postcard/ })).toHaveCount(0)
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true)
  await page.screenshot({ path: `.playwright-mcp/home-note-entry-${testInfo.project.name}.png`, fullPage: true })
  await entry.press('Enter')
  await expect(page).toHaveURL(/\/feedback$/)
  await expect(page.getByText('Picture side', { exact: true })).toHaveCount(0)
  await expect(page.getByText('Writing side', { exact: true })).toHaveCount(0)
  const write = page.getByRole('button', { name: 'Write a note', exact: true })
  await expect(page.locator('[data-postcard-front]').locator('..').locator('..').locator('..').locator('..')).toHaveCSS('opacity', '1')
  if (testInfo.project.name === 'desktop-chromium') {
    await page.emulateMedia({ reducedMotion: 'no-preference' })
    await write.hover()
    await write.screenshot({ path: '.playwright-mcp/postcard-turn-hover.png', animations: 'disabled' })
    await page.emulateMedia({ reducedMotion: 'reduce' })
  }
  const initialBounds = (await write.boundingBox())!
  await expect(write).toHaveAttribute('aria-controls', 'feedback-postcard')
  await write.press('Enter')
  const note = page.getByRole('textbox', { name: 'Your feedback' })
  await expect(note).toBeFocused()
  await note.fill('A thought worth keeping while I look at the artwork.')
  const artwork = page.getByRole('button', { name: 'View artwork', exact: true })
  const artworkBounds = (await artwork.boundingBox())!
  expect(artworkBounds.width).toBe(initialBounds.width)
  expect(artworkBounds.height).toBe(initialBounds.height)
  await page.screenshot({ path: `.playwright-mcp/postcard-turn-writing-${testInfo.project.name}.png`, fullPage: true })
  await artwork.press('Enter')
  const resume = page.getByRole('button', { name: 'Back to your note', exact: true })
  await expect(resume).toBeFocused()
  await page.screenshot({ path: `.playwright-mcp/postcard-turn-front-${testInfo.project.name}.png`, fullPage: true })
  await resume.press('Enter')
  await expect(note).toBeFocused()
  await expect(note).toHaveValue('A thought worth keeping while I look at the artwork.')
})

test('the feedback desk fits both card faces and adapts to small screens', async ({ page }, testInfo) => {
  await page.emulateMedia({ reducedMotion: 'reduce' })
  await page.goto('/feedback')
  const front = page.locator('[data-postcard-front]')
  await expect(front).toBeVisible()
  await expect(front.locator('..').locator('..').locator('..').locator('..')).toHaveCSS('opacity', '1')
  await expect(page.getByRole('link', { name: 'Explore the writing side' })).toHaveCount(0)
  const frontSize = (await front.boundingBox())!
  await page.screenshot({ path: `.playwright-mcp/feedback-layout-front-${testInfo.project.name}.png`, fullPage: true })
  await page.getByRole('button', { name: /^(Write a note|Back to your note)$/ }).press('Enter')
  const note = page.getByRole('textbox', { name: 'Your feedback' })
  await expect(note).toBeFocused()
  const backSize = (await page.locator('[data-letter-kind] > div').boundingBox())!
  expect(Math.abs(frontSize.width - backSize.width)).toBeLessThan(1)
  expect(Math.abs(frontSize.height - backSize.height)).toBeLessThan(1)
  await page.screenshot({ path: `.playwright-mcp/feedback-layout-back-${testInfo.project.name}.png`, fullPage: true })
  await page.setViewportSize({ width: 320, height: 760 })
  await note.fill('A small note from a small screen.')
  await expect(note).toHaveValue('A small note from a small screen.')
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true)
  await expect(page.getByRole('button', { name: 'Send postcard', exact: true })).toBeVisible()
  await page.screenshot({ path: `.playwright-mcp/feedback-layout-320-${testInfo.project.name}.png`, fullPage: true })
  await page.setViewportSize({ width: 1024, height: 900 })
  await page.getByRole('button', { name: 'View artwork', exact: true }).press('Enter')
  const tabletFront = (await front.boundingBox())!
  const stamps = (await page.getByRole('complementary', { name: 'Postcard stamps' }).boundingBox())!
  expect(stamps.y).toBeGreaterThan(tabletFront.y + tabletFront.height)
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true)
  await page.screenshot({ path: `.playwright-mcp/feedback-layout-tablet-${testInfo.project.name}.png`, fullPage: true })
})

test('postcard stamps work with a keyboard and fit the viewport', async ({ page }) => {
  const errors: string[] = []
  page.on('pageerror', (error) => errors.push(error.message))
  await page.goto('/feedback')
  await expect(page).toHaveTitle('Send a postcard — Mo Ibrahim')
  await page.getByRole('button', { name: /^(Write a note|Back to your note)$/ }).click()
  const loved = page.getByRole('radio', { name: 'Loved it', exact: true })
  await loved.focus()
  await loved.press('ArrowRight')
  await expect(page.getByRole('radio', { name: 'An idea', exact: true })).toBeChecked()
  await expect(page.getByRole('textbox', { name: 'Your feedback' })).toHaveAttribute('placeholder', /What would you change or add/)
  await page.getByRole('radio', { name: 'An idea', exact: true }).press('ArrowRight')
  await expect(page.getByRole('radio', { name: 'Something broke', exact: true })).toBeChecked()
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true)
  await expect(page.locator('link[rel="canonical"]')).toHaveCount(1)
  await expect(page.locator('link[rel="canonical"]')).toHaveAttribute('href', 'https://m0code.com/feedback')
  expect(errors).toEqual([])
})

test('delivery waits for a saved response and offers a fresh postcard', async ({ page }) => {
  let release: () => void = () => {}
  const delivery = new Promise<void>((resolve) => { release = resolve })
  await page.route('**/api/feedback', async (route) => {
    await delivery
    await route.fulfill({ status: 201, json: { id: '12345678-1234-4567-89ab-123456789abc' } })
  })
  await page.goto('/feedback')
  await page.getByRole('button', { name: /^(Write a note|Back to your note)$/ }).click()
  const note = page.getByRole('textbox', { name: 'Your feedback' })
  await note.fill('The postcard interaction is lovely.')
  await page.getByRole('button', { name: 'Send postcard' }).click()
  await expect(page.getByRole('button', { name: 'Sending…' })).toBeDisabled()
  await expect(note).toBeDisabled()
  await expect(page.getByRole('radio', { name: 'Loved it', exact: true })).toBeDisabled()
  await expect(note).toHaveValue('The postcard interaction is lovely.')
  await expect(page.getByRole('heading', { name: 'Thanks for the postcard.' })).toHaveCount(0)
  release()
  await expect(page.getByRole('heading', { name: 'Thanks for the postcard.' })).toBeFocused()
  await expect(page.getByText('POSTCARD NO. 12345678')).toBeVisible()
  await page.getByRole('button', { name: 'Write another postcard' }).click()
  await expect(note).toHaveValue('')
})

test('failed delivery preserves the note and retry uses the same ID', async ({ page }) => {
  const ids: string[] = []
  await page.route('**/api/feedback', async (route) => {
    ids.push(route.request().postDataJSON().id)
    await route.fulfill(ids.length === 1
      ? { status: 503, json: { error: 'Mailbox temporarily unavailable.' } }
      : { status: 201, json: { id: ids[0] } })
  })
  await page.goto('/feedback')
  await page.getByRole('button', { name: /^(Write a note|Back to your note)$/ }).click()
  const note = page.getByRole('textbox', { name: 'Your feedback' })
  await note.fill('Please keep my note when delivery fails.')
  await page.getByRole('textbox', { name: 'Your name' }).fill('A visitor')
  await page.getByRole('button', { name: 'Send postcard' }).click()
  await expect(page.getByRole('alert')).toHaveText('Mailbox temporarily unavailable.')
  await expect(note).toHaveValue('Please keep my note when delivery fails.')
  await page.getByRole('button', { name: 'Send postcard' }).click()
  await expect(page.getByRole('heading', { name: 'Thanks for the postcard.' })).toBeVisible()
  expect(ids).toHaveLength(2)
  expect(ids[1]).toBe(ids[0])
})

test('flipping preserves the draft and works with reduced motion', async ({ page }) => {
  await page.emulateMedia({ reducedMotion: 'reduce' })
  await page.goto('/feedback')
  await expect(page.getByRole('textbox', { name: 'Your feedback' })).toHaveCount(0)
  const write = page.getByRole('button', { name: /^(Write a note|Back to your note)$/ })
  await expect(write).toBeEnabled()
  await write.press('Enter')
  const note = page.getByRole('textbox', { name: 'Your feedback' })
  await expect(note).toBeFocused()
  await note.fill('Keep this draft on the back of the postcard.')
  await page.getByRole('button', { name: 'View artwork' }).press('Enter')
  await expect(note).toHaveCount(0)
  await expect(page.getByRole('button', { name: /^(Write a note|Back to your note)$/ })).toBeVisible()
  await page.getByRole('button', { name: /^(Write a note|Back to your note)$/ }).press('Enter')
  await expect(note).toHaveValue('Keep this draft on the back of the postcard.')
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true)
})

test('postcards send privately with the chosen stamps and no public wall requests', async ({ page }) => {
  const payloads: Record<string, unknown>[] = []
  const publicRequests: string[] = []
  page.on('request', (request) => { if (request.url().includes('/api/feedback/public')) publicRequests.push(request.url()) })
  await page.route('**/api/feedback', (route) => {
    const payload = route.request().postDataJSON()
    payloads.push(payload)
    return route.fulfill({ status: 201, json: { id: payload.id } })
  })
  await page.goto('/feedback')
  await expect(page.getByRole('link', { name: 'MO portfolio home' })).toHaveText('')
  await expect(page.getByRole('heading', { name: 'The postcard wall' })).toHaveCount(0)
  await expect(page.getByRole('link', { name: 'The wall' })).toHaveCount(0)
  await page.getByRole('button', { name: /^(Write a note|Back to your note)$/ }).click()
  for (const [label, kind, title] of [['Loved it', 'love', 'FIRST LIGHT'], ['An idea', 'idea', 'NEW PATHS'], ['Something broke', 'issue', 'HELD TOGETHER']]) {
    await expect(page.getByRole('radio', { name: 'Private', exact: true })).toHaveCount(0)
    await expect(page.getByRole('radio', { name: 'Public', exact: true })).toHaveCount(0)
    await page.getByRole('radio', { name: label, exact: true }).check()
    await expect(page.locator('[data-affixed-kind]')).toContainText(title)
    await page.getByRole('textbox', { name: 'Your feedback' }).fill('  A note just for Mo.  ')
    await page.getByRole('textbox', { name: 'Your name' }).fill('  A visitor  ')
    await page.getByRole('button', { name: 'Send postcard' }).click()
    await expect(page.getByRole('heading', { name: 'Thanks for the postcard.' })).toBeVisible()
    expect(payloads.at(-1)).toMatchObject({ kind, visibility: 'private', message: 'A note just for Mo.', name: 'A visitor', website: '' })
    await page.getByRole('button', { name: 'Write another postcard' }).click()
    await expect(page.getByRole('textbox', { name: 'Your feedback' })).toHaveValue('')
  }
  expect(payloads).toHaveLength(3)
  expect(publicRequests).toEqual([])
})

test('local Worker validates, persists, deduplicates and rate limits postcards', async ({ request, baseURL }) => {
  test.skip(!process.env.PLAYWRIGHT_FEEDBACK_STORAGE, 'Opt in only against an isolated local D1 database.')
  expect(new URL(baseURL!).hostname).toMatch(/^(localhost|127\.0\.0\.1)$/)
  const headers = { Origin: baseURL!, 'CF-Connecting-IP': `192.0.2.${Math.floor(Math.random() * 200) + 1}` }
  const data = { id: crypto.randomUUID(), kind: 'idea', name: 'Local integration test', message: 'Persist this test postcard once.', website: '' }
  expect((await request.get('/api/feedback')).status()).toBe(405)
  expect((await request.post('/api/feedback', { data, headers: { Origin: 'https://other.example' } })).status()).toBe(403)
  expect((await request.post('/api/feedback', { headers, data: { ...data, message: 'a' } })).status()).toBe(422)
  expect((await request.post('/api/feedback', { headers, data: { ...data, website: 'spam' } })).status()).toBe(422)
  expect((await request.post('/api/feedback', { headers, data: { ...data, message: 'x'.repeat(13_000) } })).status()).toBe(413)
  for (let attempt = 0; attempt < 5; attempt++) {
    const response = await request.post('/api/feedback', { headers, data })
    expect(response.status()).toBe(201)
    expect(await response.json()).toEqual({ id: data.id })
  }
  const limited = await request.post('/api/feedback', { headers, data })
  expect(limited.status()).toBe(429)
  expect(limited.headers()['retry-after']).toBe('60')
})

test('local Worker publishes only public postcards and validates visibility', async ({ request, baseURL }) => {
  test.skip(!process.env.PLAYWRIGHT_FEEDBACK_STORAGE, 'Opt in only against an isolated local D1 database.')
  expect(new URL(baseURL!).hostname).toMatch(/^(localhost|127\.0\.0\.1)$/)
  const headers = { Origin: baseURL!, 'CF-Connecting-IP': `198.51.100.${Math.floor(Math.random() * 200) + 1}` }
  const data = { kind: 'idea', name: 'Local visibility test', message: 'A visibility integration postcard.', website: '' }
  const omittedId = crypto.randomUUID()
  const privateId = crypto.randomUUID()
  const publicId = crypto.randomUUID()
  expect((await request.get('/api/feedback/public', { params: { cursor: 'invalid-cursor' } })).status()).toBe(400)
  expect((await request.post('/api/feedback', { headers, data: { ...data, id: crypto.randomUUID(), visibility: 'unlisted' } })).status()).toBe(422)
  for (const visibility of [null, false, 0]) {
    expect((await request.post('/api/feedback', { headers, data: { ...data, id: crypto.randomUUID(), visibility } })).status()).toBe(422)
  }
  expect((await request.post('/api/feedback', { headers, data: { ...data, id: omittedId } })).status()).toBe(201)
  expect((await request.post('/api/feedback', { headers, data: { ...data, id: privateId, visibility: 'private' } })).status()).toBe(201)
  expect((await request.post('/api/feedback', { headers, data: { ...data, id: publicId, visibility: 'public' } })).status()).toBe(201)
  expect((await request.post('/api/feedback', { headers, data: { ...data, id: omittedId, visibility: 'public' } })).status()).toBe(201)
  expect((await request.post('/api/feedback', { headers, data: { ...data, id: publicId, visibility: 'private' } })).status()).toBe(201)
  const postcards: Record<string, unknown>[] = []
  let cursor: string | null = null
  do {
    const response = await request.get('/api/feedback/public', { params: cursor ? { cursor } : {} })
    expect(response.status()).toBe(200)
    expect(response.headers()['cache-control']).toBe('no-store')
    const result = await response.json()
    expect(result.postcards.length).toBeLessThanOrEqual(24)
    expect(result).toHaveProperty('nextCursor')
    postcards.push(...result.postcards)
    cursor = result.nextCursor
  } while (cursor)
  expect(postcards.find((postcard) => postcard.id === publicId)).toEqual({
    id: publicId,
    kind: data.kind,
    name: data.name,
    message: data.message,
    created_at: expect.any(String),
  })
  expect(postcards.some((postcard) => postcard.id === omittedId || postcard.id === privateId)).toBe(false)
  expect(postcards.filter((postcard) => postcard.id === publicId)).toHaveLength(1)
  expect((await request.post('/api/feedback/public', { headers, data })).status()).toBe(405)
})
