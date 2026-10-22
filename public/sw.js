// The release build replaces these values with its exact asset list and digest.
const CACHE = 'mo-recovery-__VERSION__'
const ASSETS = __ASSETS__

self.addEventListener('install', event => {
  event.waitUntil(caches.open(CACHE).then(cache => cache.addAll(['/offline', ...ASSETS])))
})

self.addEventListener('activate', event => {
  event.waitUntil((async () => {
    const names = await caches.keys()
    await Promise.all(names.filter(name => name.startsWith('mo-recovery-') && name !== CACHE).map(name => caches.delete(name)))
    await self.clients.claim()
  })())
})

self.addEventListener('fetch', event => {
  const request = event.request
  const url = new URL(request.url)
  if (request.method !== 'GET' || url.origin !== self.location.origin || url.pathname.startsWith('/api/')) return
  if (request.mode === 'navigate') {
    event.respondWith((async () => {
      try { return await fetch(request) }
      catch {
        const cached = await caches.match('/offline', { cacheName: CACHE })
        if (!cached) return Response.error()
        if (url.pathname === '/offline') return cached
        return Response.redirect(new URL('/offline', self.location.origin), 302)
      }
    })())
  } else if (ASSETS.includes(url.pathname)) {
    event.respondWith(caches.match(request, { cacheName: CACHE }).then(cached => cached || fetch(request)))
  }
})
