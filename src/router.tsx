import { createRouter as createTanStackRouter } from '@tanstack/react-router'
import { createIsomorphicFn } from '@tanstack/react-start'
import { getRequestHeader } from '@tanstack/react-start/server'

import { routeTree } from './routeTree.gen'

const getContentSecurityPolicyNonce = createIsomorphicFn()
  .client(() => undefined)
  .server(() => getRequestHeader('x-csp-nonce'))

export function getRouter() {
  return createTanStackRouter({
    routeTree,
    scrollRestoration: true,
    defaultPreload: 'intent',
    defaultPreloadStaleTime: 0,
    ssr: {
      nonce: getContentSecurityPolicyNonce(),
    },
  })
}

declare module '@tanstack/react-router' {
  interface Register {
    router: ReturnType<typeof getRouter>
  }
}
