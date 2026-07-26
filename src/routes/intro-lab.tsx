import { createFileRoute } from '@tanstack/react-router'

import { IntroLab } from '#/components/intro-lab/IntroLab'

export const Route = createFileRoute('/intro-lab')({
  component: IntroLab,
})
