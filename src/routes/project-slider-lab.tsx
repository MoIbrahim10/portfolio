import { createFileRoute } from '@tanstack/react-router'

import { ProjectSliderLab } from '#/components/project-slider-lab/ProjectSliderLab'

export const Route = createFileRoute('/project-slider-lab')({
  component: ProjectSliderLab,
})
