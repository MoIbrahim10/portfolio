import { projects as sourceProjects } from '../../project-lab/shared/projects'

import type { SliderProject, SliderProjectPalette } from './types'

const PLACEHOLDER = '/projects/invoice-builder-placeholder.png'

const palettes: readonly SliderProjectPalette[] = [
  { accent: '#9c7737', background: '#f6f5f2', foreground: '#242424', surface: '#fff' },
  { accent: '#9a5751', background: '#f4f3f1', foreground: '#252525', surface: '#fff' },
  { accent: '#786985', background: '#f5f2f5', foreground: '#29262b', surface: '#fff' },
  { accent: '#47736f', background: '#f1f5f4', foreground: '#24302f', surface: '#fff' },
  { accent: '#746b54', background: '#f4f3f0', foreground: '#24231f', surface: '#fff' },
  { accent: '#86664c', background: '#f5f1ed', foreground: '#2b2723', surface: '#fff' },
]

const collaborators = [
  ['Product partner', 'Engineering partner'],
  ['Clinical partner', 'Research partner'],
  ['Editorial partner', 'Photography partner'],
  ['Data partner', 'Mapping partner'],
  ['Architecture partner', 'Development partner'],
  ['Service partner', 'Accessibility partner'],
] as const

export const sliderProjects: readonly SliderProject[] = sourceProjects.map((project, index) => ({
  alt: `Placeholder project preview for ${project.title}: a light invoice-builder interface shown beside a large document preview`,
  collaborators: collaborators[index] ?? [],
  description: project.summary,
  gallery: [PLACEHOLDER],
  href: project.liveHref ?? project.caseStudyHref,
  image: PLACEHOLDER,
  name: project.title,
  palette: palettes[index] ?? palettes[0],
  slug: project.slug,
}))
