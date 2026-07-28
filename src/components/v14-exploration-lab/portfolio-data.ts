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

export interface PortfolioCollaborator {
  name: string
  socialHref?: string
  websiteHref: string
}

export interface PortfolioProject {
  accent: string
  collaborators: PortfolioCollaborator[]
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
    collaborators: [
      {
        name: 'Fay',
        socialHref: 'https://x.com/faydesignsstuff',
        websiteHref: 'https://faydakrouri.com/',
      },
    ],
    description: 'A focused invoice builder with live preview and a carefully tuned creation flow.',
    id: 'good-invoice',
    liveHref: 'https://thegoodinvoice.com/',
    media: [
      {
        alt: 'The Good Invoice desktop editor beside its live invoice preview',
        fallbackSrc: '/portfolio/projects/good-invoice/editor-and-preview.png',
        height: 1424,
        src: '/portfolio/projects/good-invoice/editor-and-preview.webp',
        width: 2212,
      },
      {
        alt: 'The Good Invoice responsive editor stacked above the invoice preview',
        fallbackSrc: '/portfolio/projects/good-invoice/responsive-editor.png',
        height: 1516,
        src: '/portfolio/projects/good-invoice/responsive-editor.webp',
        width: 1180,
      },
      {
        alt: 'The Good Invoice dark-mode Display tab with layout and colour controls',
        fallbackSrc: '/portfolio/projects/good-invoice/display-controls-dark.png',
        height: 1342,
        src: '/portfolio/projects/good-invoice/display-controls-dark.webp',
        width: 996,
      },
    ],
    repositoryHref: 'https://github.com/MoIbrahim10/the-good-invoice',
    title: 'The Good Invoice',
  },
  {
    accent: '#35d07f',
    collaborators: [],
    description: 'A frontend concept for a personal AI workspace with project-based chat, asset libraries, connectors, and deeply configurable themes.',
    id: 'lumen',
    liveHref: 'https://lumen.m0code.com/',
    media: [
      {
        alt: 'Lumen dark workspace home with project navigation and prompt composer',
        fallbackSrc: '/portfolio/projects/lumen/workspace-home.png',
        height: 1504,
        src: '/portfolio/projects/lumen/workspace-home.webp',
        width: 3016,
      },
      {
        alt: 'Lumen mobile asset library with search, filters, and file actions',
        fallbackSrc: '/portfolio/projects/lumen/mobile-library.png',
        height: 1318,
        src: '/portfolio/projects/lumen/mobile-library.webp',
        width: 602,
      },
      {
        alt: 'Lumen connector workspace with the theme customizer open',
        fallbackSrc: '/portfolio/projects/lumen/theme-customizer.png',
        height: 1492,
        src: '/portfolio/projects/lumen/theme-customizer.webp',
        width: 3016,
      },
      {
        alt: 'Lumen light-mode project conversation with its navigation sidebar',
        fallbackSrc: '/portfolio/projects/lumen/light-conversation.png',
        height: 1492,
        src: '/portfolio/projects/lumen/light-conversation.webp',
        width: 3016,
      },
    ],
    title: 'Lumen',
  },
  {
    accent: '#b7ff54',
    collaborators: [],
    description: 'An experimental AI workspace built around tactile controls and calm interaction.',
    id: 'calm-ai-studio',
    media: [
      {
        alt: 'Calm AI Studio prompt workspace with sculpted controls',
        fallbackSrc: '/portfolio/projects/calm-ai-studio/hero.png',
        height: 720,
        src: '/portfolio/projects/calm-ai-studio/hero.webp',
        width: 1280,
      },
    ],
    repositoryHref: 'https://github.com/MoIbrahim10/calm-ai-studio',
    title: 'Calm AI Studio',
  },
  {
    accent: '#f1ede3',
    collaborators: [
      {
        name: 'Fay',
        socialHref: 'https://x.com/faydesignsstuff',
        websiteHref: 'https://faydakrouri.com/',
      },
    ],
    description: 'A design and engineering studio site made to feel precise, quiet, and assured.',
    id: 'bitsnpixels',
    liveHref: 'https://bitsnpixels.co',
    media: [
      {
        alt: 'Bits n Pixels software studio hero with a selected-work rail',
        fallbackSrc: '/portfolio/projects/bitsnpixels/studio-hero-poster.png',
        height: 952,
        src: '/portfolio/projects/bitsnpixels/studio-hero-poster.webp',
        width: 1920,
      },
      {
        alt: 'Bits n Pixels selected-work carousel showing scheduling and network tools',
        fallbackSrc: '/portfolio/projects/bitsnpixels/work-carousel-poster.png',
        height: 956,
        src: '/portfolio/projects/bitsnpixels/work-carousel-poster.webp',
        width: 1920,
      },
      {
        alt: 'Bits n Pixels case-study focus transition over its studio hero',
        fallbackSrc: '/portfolio/projects/bitsnpixels/case-study-focus-poster.png',
        height: 936,
        src: '/portfolio/projects/bitsnpixels/case-study-focus-poster.webp',
        width: 1920,
      },
    ],
    repositoryHref: 'https://github.com/MoIbrahim10/bitsnpixels',
    title: 'Bits n Pixels',
  },
  {
    accent: '#77a7ff',
    collaborators: [
      {
        name: 'Fay',
        socialHref: 'https://x.com/faydesignsstuff',
        websiteHref: 'https://faydakrouri.com/',
      },
    ],
    description: 'A visual design practice shaped around honest, useful, and polished product work.',
    id: 'glazed',
    liveHref: 'https://glaze.design/',
    media: [
      {
        alt: 'Glaze studio introduction beside a column of selected product work',
        fallbackSrc: '/portfolio/projects/glazed/studio-overview.png',
        height: 1496,
        src: '/portfolio/projects/glazed/studio-overview.webp',
        width: 3018,
      },
      {
        alt: 'Glaze studio introduction scrolling through selected product interfaces',
        fallbackSrc: '/portfolio/projects/glazed/studio-scroll-poster.png',
        height: 944,
        src: '/portfolio/projects/glazed/studio-scroll-poster.webp',
        width: 1920,
      },
      {
        alt: 'Glaze collaboration call to action revealing Fay inside the button',
        fallbackSrc: '/portfolio/projects/glazed/collaboration-cta-poster.png',
        height: 1080,
        src: '/portfolio/projects/glazed/collaboration-cta-poster.webp',
        width: 1776,
      },
      {
        alt: 'Glaze mobile case study showing monitoring agents and network checks',
        fallbackSrc: '/portfolio/projects/glazed/mobile-case-study-poster.png',
        height: 1080,
        src: '/portfolio/projects/glazed/mobile-case-study-poster.webp',
        width: 664,
      },
      {
        alt: 'Glaze pricing page followed by selected product work',
        fallbackSrc: '/portfolio/projects/glazed/pricing-scroll-poster.png',
        height: 952,
        src: '/portfolio/projects/glazed/pricing-scroll-poster.webp',
        width: 1920,
      },
    ],
    repositoryHref: 'https://github.com/MoIbrahim10/glazed',
    title: 'Glazed',
  },
  {
    accent: '#5d72ff',
    collaborators: [],
    description:
      'A workspace library concept for organizing files into tactile, color-coded folders.',
    id: 'folders',
    media: [
      {
        alt: 'Workspace Library with color-coded folders and file cards',
        fallbackSrc: '/portfolio/projects/folders/workspace-library.jpeg',
        height: 1442,
        src: '/portfolio/projects/folders/workspace-library.webp',
        width: 1914,
      },
      {
        alt: 'Workspace Library interaction for organizing files across folders',
        fallbackSrc:
          '/portfolio/projects/folders/folder-organization-poster.png',
        height: 1302,
        src: '/portfolio/projects/folders/folder-organization-poster.webp',
        width: 2106,
      },
    ],
    title: 'Folders',
  },
  {
    accent: '#cf49ff',
    collaborators: [],
    description: 'An Astro frontend concept for English and Arabic, built with RTL-aware layouts, light and dark themes, responsive components, and reusable design tokens.',
    id: 'orgo',
    liveHref: 'https://orgo.m0code.com/en/',
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
        alt: 'Orgo light-mode benefits grid presenting calendar, journaling, scheduling, and task features',
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
        alt: 'Stepper system states for disabled, active, focus, error, info, hover, complete, and partial',
        fallbackSrc: '/portfolio/projects/stepper/system-states.png',
        height: 1380,
        src: '/portfolio/projects/stepper/system-states.webp',
        width: 2158,
      },
      {
        alt: 'Stepper component configurator with assembly, shell, display, progress, and arrow controls',
        fallbackSrc: '/portfolio/projects/stepper/configuration-panel.png',
        height: 1514,
        src: '/portfolio/projects/stepper/configuration-panel.webp',
        width: 664,
      },
      {
        alt: 'Stepper keyboard-driven sequence with four numbered LED stages',
        fallbackSrc: '/portfolio/projects/stepper/interactive-sequence-poster.png',
        height: 848,
        src: '/portfolio/projects/stepper/interactive-sequence-poster.webp',
        width: 1920,
      },
      {
        alt: 'Stepper directional arrow state rendered with an LED matrix',
        fallbackSrc: '/portfolio/projects/stepper/arrow-state-poster.png',
        height: 1080,
        src: '/portfolio/projects/stepper/arrow-state-poster.webp',
        width: 856,
      },
    ],
    title: 'Stepper',
  },
]
