import { createFileRoute } from '@tanstack/react-router'

import { PortfolioLab } from '#/components/portfolio-lab/PortfolioLab'

export const Route = createFileRoute('/portfolio-lab')({
  component: PortfolioLab,
})
