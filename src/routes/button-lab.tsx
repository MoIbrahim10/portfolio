import { createFileRoute } from '@tanstack/react-router'

import { ButtonLab } from '#/components/button-lab/ButtonLab'

export const Route = createFileRoute('/button-lab')({
  component: ButtonLab,
})
