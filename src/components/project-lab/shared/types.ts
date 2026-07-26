import type { PortfolioProject } from './projects'

export type ProjectLabState = 'empty' | 'loading' | 'ready'

export interface ProjectDirectionProps {
  projects: readonly PortfolioProject[]
  state?: ProjectLabState
}

export interface ProjectDirectionMetadata {
  description: string
  id: string
  name: string
  skill: {
    name: string
    url: string
  }
}

