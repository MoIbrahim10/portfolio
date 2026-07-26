import { createFileRoute } from '@tanstack/react-router'

import { ExplorationIndex } from '#/components/exploration-index/ExplorationIndex'

export const Route = createFileRoute('/')({ component: Home })

function Home() {
  return <ExplorationIndex />
}
