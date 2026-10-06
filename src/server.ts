import handler, {
  createServerEntry,
} from '@tanstack/react-start/server-entry'

import { handleFeedback, handlePublicFeedback } from './feedback-server'

function createContentSecurityPolicy(nonce: string) {
  return [
    "default-src 'self'",
    "base-uri 'none'",
    "connect-src 'self'",
    "font-src 'self'",
    "form-action 'self'",
    "frame-ancestors 'none'",
    "frame-src 'none'",
    "img-src 'self' data:",
    "manifest-src 'self'",
    "media-src 'self'",
    "object-src 'none'",
    `script-src 'self' 'nonce-${nonce}' 'strict-dynamic'`,
    "script-src-attr 'none'",
    "style-src 'self'",
    `style-src-elem 'self' 'nonce-${nonce}'`,
    "style-src-attr 'unsafe-inline'",
    "worker-src 'self'",
    'upgrade-insecure-requests',
  ].join('; ')
}

export default createServerEntry({
  async fetch(request) {
    const pathname = new URL(request.url).pathname
    if (pathname === '/api/feedback' || pathname === '/api/feedback/public') {
      try {
        const { env } = await import(/* @vite-ignore */ 'cloudflare:workers')
        return pathname === '/api/feedback/public'
          ? handlePublicFeedback(request, env)
          : handleFeedback(request, env)
      } catch (error) {
        console.error('Feedback runtime unavailable', error)
        return Response.json(
          { error: 'The mailbox is unavailable. Please try again shortly.' },
          { status: 503, headers: { 'Cache-Control': 'no-store' } },
        )
      }
    }

    if (process.env.NODE_ENV !== 'production') {
      return handler.fetch(request)
    }

    const nonce = crypto.randomUUID().replaceAll('-', '')
    const requestHeaders = new Headers(request.headers)
    requestHeaders.set('x-csp-nonce', nonce)
    const response = await handler.fetch(
      new Request(request, { headers: requestHeaders }),
    )
    const contentType = response.headers.get('content-type')

    if (!contentType?.toLowerCase().startsWith('text/html')) {
      return response
    }

    const headers = new Headers(response.headers)
    headers.set(
      'Content-Security-Policy',
      createContentSecurityPolicy(nonce),
    )

    return new Response(response.body, {
      headers,
      status: response.status,
      statusText: response.statusText,
    })
  },
})
