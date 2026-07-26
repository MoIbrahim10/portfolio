export interface PortfolioProject {
  alt: string
  caseStudyHref: string
  image: string
  liveHref?: string
  role: string
  services: readonly string[]
  slug: string
  summary: string
  title: string
  year: string
}

export const projects: readonly PortfolioProject[] = [
  {
    alt: 'Deep navy transit interface with a warm gold route crossing a stepped red station marker',
    caseStudyHref: '#case-study-sahra',
    image: '/projects/sahra-mobility.svg',
    liveHref: '#live-sahra',
    role: 'Product design lead',
    services: ['Strategy', 'Product design', 'Design system'],
    slug: 'sahra-mobility',
    summary: 'A unified rider experience that makes regional journeys easier to plan, understand, and trust.',
    title: 'Sahra Mobility',
    year: '2026',
  },
  {
    alt: 'Calm clinical dashboard composed of navy panels, gold measures, and a red vital signal',
    caseStudyHref: '#case-study-northstar',
    image: '/projects/northstar-health.svg',
    role: 'Experience director',
    services: ['Research', 'Service design', 'Prototype'],
    slug: 'northstar-health',
    summary: 'A clearer care-coordination workspace for clinical teams handling complex patient journeys.',
    title: 'Northstar Health',
    year: '2025',
  },
  {
    alt: 'Editorial field journal with layered cream pages, desert-red annotations, and a golden index rail',
    caseStudyHref: '#case-study-field-notes',
    image: '/projects/field-notes.svg',
    liveHref: '#live-field-notes',
    role: 'Design and direction',
    services: ['Identity', 'Editorial', 'Web design'],
    slug: 'field-notes',
    summary: 'An identity and publishing system for stories gathered from makers working across the region.',
    title: 'Field Notes',
    year: '2025',
  },
  {
    alt: 'Layered coastal map in midnight blue with gold contours and a stepped coral-red waypoint',
    caseStudyHref: '#case-study-aqaba',
    image: '/projects/aqaba-atlas.svg',
    role: 'Creative technologist',
    services: ['Data design', 'Mapping', 'Interaction'],
    slug: 'aqaba-atlas',
    summary: 'An exploratory coastal atlas that turns environmental data into an approachable public resource.',
    title: 'Aqaba Atlas',
    year: '2024',
  },
  {
    alt: 'Gold modular forms moving through a navy creative workspace with one restrained red block',
    caseStudyHref: '#case-study-current',
    image: '/projects/studio-current.svg',
    liveHref: '#live-current',
    role: 'Brand and digital lead',
    services: ['Positioning', 'Identity', 'Digital'],
    slug: 'studio-current',
    summary: 'A flexible identity and portfolio platform built for an interdisciplinary architecture practice.',
    title: 'Studio Current',
    year: '2024',
  },
  {
    alt: 'Civic service flow diagram with accessible cream nodes connected across navy and muted red planes',
    caseStudyHref: '#case-study-relay',
    image: '/projects/civic-relay.svg',
    role: 'Service design lead',
    services: ['Discovery', 'UX architecture', 'Accessibility'],
    slug: 'civic-relay',
    summary: 'A shared service pattern library that helps residents complete essential tasks with less friction.',
    title: 'Civic Relay',
    year: '2023',
  },
] as const

export const featuredProject = projects[0]
export const supportingProjects = projects.slice(1)

