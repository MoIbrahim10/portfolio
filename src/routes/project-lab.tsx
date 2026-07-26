import { createFileRoute } from '@tanstack/react-router'

import { ProjectLab } from '#/components/project-lab/ProjectLab'

export const Route = createFileRoute('/project-lab')({ component: ProjectLabPage })

function ProjectLabPage() {
  return <ProjectLab />
}

