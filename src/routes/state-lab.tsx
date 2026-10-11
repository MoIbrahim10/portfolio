import { createFileRoute, notFound } from '@tanstack/react-router'

import { StateExplorationLab } from '#/components/state-lab/StateExplorationLab'

export const Route = createFileRoute('/state-lab')({
  beforeLoad: () => {
    if (!import.meta.env.DEV) throw notFound({ routeId: '__root__' })
  },
  component: import.meta.env.DEV ? StateExplorationLab : undefined,
  head: () => ({
    meta: [
      { title: 'The art of the detour — MO state explorations' },
      { name: 'robots', content: 'noindex, nofollow' },
    ],
  }),
})
