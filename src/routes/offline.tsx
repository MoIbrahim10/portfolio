import { createFileRoute } from '@tanstack/react-router'
import { OfflinePage } from '#/components/recovery/OfflinePage'

export const Route = createFileRoute('/offline')({
  component: OfflinePage,
  head: () => ({ meta: [{ title: 'No internet — MO' }, { name: 'robots', content: 'noindex, nofollow' }] }),
})
