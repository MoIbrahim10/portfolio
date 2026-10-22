import { createFileRoute } from '@tanstack/react-router'
import { ErrorPage } from '#/components/recovery/ErrorPage'

export const Route = createFileRoute('/error')({
  component: ErrorPage,
  head: () => ({ meta: [{ title: 'Something went wrong — MO' }, { name: 'robots', content: 'noindex, nofollow' }] }),
})
