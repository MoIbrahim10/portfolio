export type SliderLabState = 'empty' | 'loading' | 'ready'

export interface SliderProjectPalette {
  accent: string
  background: string
  foreground: string
  surface: string
}

export interface SliderProject {
  alt: string
  collaborators: readonly string[]
  description: string
  gallery: readonly string[]
  href?: string
  image: string
  name: string
  palette: SliderProjectPalette
  slug: string
}

export interface SliderDirectionProps {
  projects: readonly SliderProject[]
  state?: SliderLabState
}

export interface SliderDirectionMetadata {
  description: string
  id: string
  name: string
  skill: {
    name: string
    url: string
  }
}
