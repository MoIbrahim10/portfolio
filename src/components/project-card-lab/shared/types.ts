import type {
  SliderLabState,
  SliderProject,
} from '../../project-slider-lab/shared/types'

export type CardLabState = SliderLabState

export interface CardDirectionProps {
  projects: readonly SliderProject[]
  state?: CardLabState
}

export interface CardDirectionMetadata {
  description: string
  id: string
  motion: string
  name: string
  skill: {
    name: string
    url: string
  }
}
