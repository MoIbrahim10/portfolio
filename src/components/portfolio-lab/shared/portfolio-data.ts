export const PORTFOLIO_BIO =
  "Hey, I'm Mo. I love building products where every detail matters, from the overall experience to the last pixel. I enjoy turning thoughtful design into clean, polished interfaces that feel as good as they look."

export const PORTFOLIO_LINKS = {
  cal: 'https://cal.com/mo-c0de/30min',
  github: 'https://github.com/MoIbrahim10',
  x: 'https://x.com/m0code',
} as const

export interface PortfolioMedia {
  alt: string
  fallbackSrc?: string
  height: number
  src: string
  width: number
}

export interface PortfolioProject {
  accent: string
  collaborators: string[]
  description: string
  id: string
  liveHref?: string
  media: PortfolioMedia[]
  repositoryHref?: string
  title: string
}

export const PORTFOLIO_PROJECTS: PortfolioProject[] = [
  {
    accent: '#e34d3d',
    collaborators: [],
    description: 'A focused invoice builder with live preview and a carefully tuned creation flow.',
    id: 'good-invoice',
    liveHref: 'https://thegoodinvoice.com/',
    media: [
      {
        alt: 'The Good Invoice editor beside a live invoice preview',
        height: 1498,
        src: '/portfolio/projects/good-invoice/hero.png',
        width: 3018,
      },
    ],
    repositoryHref: 'https://github.com/MoIbrahim10/the-good-invoice',
    title: 'The Good Invoice',
  },
  {
    accent: '#b7ff54',
    collaborators: [],
    description: 'An experimental AI workspace built around tactile controls and calm interaction.',
    id: 'calm-ai-studio',
    media: [
      {
        alt: 'Calm AI Studio prompt workspace with sculpted controls',
        height: 720,
        src: '/portfolio/projects/calm-ai-studio/hero.png',
        width: 1280,
      },
    ],
    repositoryHref: 'https://github.com/MoIbrahim10/calm-ai-studio',
    title: 'Calm AI Studio',
  },
  {
    accent: '#f1ede3',
    collaborators: [],
    description: 'A design and engineering studio site made to feel precise, quiet, and assured.',
    id: 'bitsnpixels',
    liveHref: 'https://bitsnpixels.co',
    media: [
      {
        alt: 'Bits n Pixels studio identity on a cloud-softened canvas',
        height: 630,
        src: '/portfolio/projects/bitsnpixels/hero.png',
        width: 1200,
      },
      {
        alt: 'Bits n Pixels project presentation in a desktop layout',
        height: 2496,
        src: '/portfolio/projects/bitsnpixels/detail-01.webp',
        width: 3840,
      },
      {
        alt: 'A second Bits n Pixels case-study interface',
        height: 2496,
        src: '/portfolio/projects/bitsnpixels/detail-02.webp',
        width: 3840,
      },
    ],
    repositoryHref: 'https://github.com/MoIbrahim10/bitsnpixels',
    title: 'Bits n Pixels',
  },
  {
    accent: '#77a7ff',
    collaborators: [],
    description: 'A visual design practice shaped around honest, useful, and polished product work.',
    id: 'glazed',
    liveHref: 'https://glaze.design/',
    media: [
      {
        alt: 'Glazed scheduling interface with calendar and time-slot controls',
        height: 2496,
        src: '/portfolio/projects/glazed/hero.webp',
        width: 3840,
      },
      {
        alt: 'Glazed product interface shown at desktop scale',
        height: 2496,
        src: '/portfolio/projects/glazed/detail-01.webp',
        width: 3840,
      },
      {
        alt: 'A second Glazed interface study',
        height: 2496,
        src: '/portfolio/projects/glazed/detail-02.webp',
        width: 3840,
      },
    ],
    repositoryHref: 'https://github.com/MoIbrahim10/glazed',
    title: 'Glazed',
  },
  {
    accent: '#cf49ff',
    collaborators: [],
    description: 'An Astro frontend concept for English and Arabic, built with RTL-aware layouts, light and dark themes, responsive components, and reusable design tokens.',
    id: 'orgo',
    media: [
      {
        alt: 'Orgo landing page introducing its unified planning and journaling workspace',
        fallbackSrc: '/portfolio/projects/orgo/overview.png',
        height: 1504,
        src: '/portfolio/projects/orgo/overview.webp',
        width: 3020,
      },
      {
        alt: 'Orgo connected-tools section showing integrations across everyday apps',
        fallbackSrc: '/portfolio/projects/orgo/integrations.png',
        height: 1504,
        src: '/portfolio/projects/orgo/integrations.webp',
        width: 3020,
      },
      {
        alt: 'Orgo pricing page comparing its Basic and Elevate plans',
        fallbackSrc: '/portfolio/projects/orgo/pricing.png',
        height: 1236,
        src: '/portfolio/projects/orgo/pricing.webp',
        width: 2076,
      },
      {
        alt: 'Orgo benefits grid presenting unified calendars and intuitive journaling',
        fallbackSrc: '/portfolio/projects/orgo/benefits.png',
        height: 1448,
        src: '/portfolio/projects/orgo/benefits.webp',
        width: 2076,
      },
    ],
    repositoryHref: 'https://github.com/MoIbrahim10/orgo',
    title: 'Orgo',
  },
  {
    accent: '#a8d900',
    collaborators: [],
    description: 'A flexible stepper and progress system explored through hands-on configurators.',
    id: 'stepper',
    media: [
      {
        alt: 'Stepper progress-bar configurator with live controls',
        height: 817,
        src: '/portfolio/projects/stepper/hero.png',
        width: 1512,
      },
      {
        alt: 'Stepper animation period controls and progress preview',
        height: 765,
        src: '/portfolio/projects/stepper/detail-01.png',
        width: 1512,
      },
      {
        alt: 'Stepper progress variants in a desktop test view',
        height: 691,
        src: '/portfolio/projects/stepper/detail-02.png',
        width: 1200,
      },
    ],
    title: 'Stepper',
  },
]
