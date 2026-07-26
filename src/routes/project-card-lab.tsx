import { createFileRoute } from '@tanstack/react-router'

import { ProjectCardLab } from '#/components/project-card-lab/ProjectCardLab'

export const Route = createFileRoute('/project-card-lab')({
  component: ProjectCardLab,
})
