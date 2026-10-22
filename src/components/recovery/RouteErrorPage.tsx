import { lazy, Suspense, useCallback } from 'react'
import { useRouter } from '@tanstack/react-router'
import type { ErrorComponentProps } from '@tanstack/react-router'

const ErrorPage = lazy(() => import('./ErrorPage').then(module => ({ default: module.ErrorPage })))

export function RouteErrorPage({ reset }: ErrorComponentProps) {
  const router = useRouter()
  const retry = useCallback(async () => { await router.invalidate(); reset() }, [router, reset])
  return <Suspense fallback={<p role="status">Something went wrong. Loading recovery…</p>}><ErrorPage onRetry={retry} /></Suspense>
}
