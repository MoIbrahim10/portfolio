import { lazy, Suspense, useEffect, useState } from 'react'
import type { ReactNode } from 'react'

const OfflinePage = lazy(() => import('./OfflinePage').then(module => ({ default: module.OfflinePage })))

export function OfflineRecovery({ children }: { children: ReactNode }) {
  const [offline, setOffline] = useState(false)
  useEffect(() => {
    const disconnected = () => setOffline(true)
    if (!navigator.onLine) disconnected()
    window.addEventListener('offline', disconnected)
    if (import.meta.env.PROD && 'serviceWorker' in navigator) {
      void navigator.serviceWorker.register('/sw.js', { updateViaCache: 'none' }).catch(error => console.warn('Offline recovery could not be saved', error))
    }
    return () => window.removeEventListener('offline', disconnected)
  }, [])
  return offline ? <Suspense fallback={<p role="status">No internet. Reconnecting…</p>}><OfflinePage /></Suspense> : children
}
