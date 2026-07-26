import { createFileRoute } from '@tanstack/react-router'

import { V14IdleGapLab } from '#/components/v14-idle-gap-lab/V14IdleGapLab'

export const Route = createFileRoute('/v14-idle-gap-lab')({
  component: V14IdleGapLab,
})
