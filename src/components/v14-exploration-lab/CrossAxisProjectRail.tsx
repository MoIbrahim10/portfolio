import {
  type CSSProperties,
  type KeyboardEvent,
  type UIEvent,
  useEffect,
  useRef,
  useState,
} from 'react'
import { AnimatePresence, motion, useReducedMotion } from 'motion/react'

import {
  PORTFOLIO_PROJECTS,
  type PortfolioMedia,
  type PortfolioProject,
} from '#/components/portfolio-lab/shared/portfolio-data'

import styles from './CrossAxisProjectRail.module.css'

type ChangeSource = 'keyboard' | 'pointer' | 'scroll'
type TravelDirection = -1 | 1

interface StoryChapter {
  caption: string
  contain?: boolean
  media: PortfolioMedia
  objectPosition?: string
  project?: PortfolioProject
  videoSrc?: string
}

interface ProjectStory {
  accent: string
  background: string
  description: string
  foreground: string
  id: 'orgo' | 'good-invoice' | 'others'
  projects: PortfolioProject[]
  title: string
  chapters: StoryChapter[]
}

const projectById = (id: string) => {
  const project = PORTFOLIO_PROJECTS.find((item) => item.id === id)
  if (!project) throw new Error(`Missing portfolio project: ${id}`)
  return project
}

const orgo = projectById('orgo')
const goodInvoice = projectById('good-invoice')
const glazed = projectById('glazed')
const calmAi = projectById('calm-ai-studio')
const stepper = projectById('stepper')

const STORIES: ProjectStory[] = [
  {
    accent: '#d79d40',
    background: '#102b43',
    chapters: [
      {
        caption: 'Interaction and theme walkthrough',
        contain: true,
        media: {
          ...orgo.media[0],
          height: 1080,
          width: 1620,
        },
        project: orgo,
        videoSrc: '/portfolio/projects/orgo/walkthrough.mp4',
      },
      ...orgo.media.map((media, index) => ({
        caption:
          index === 0
            ? 'Responsive landing composition'
            : index === 1
              ? 'Integration surface and navigation'
              : index === 2
                ? 'Reusable pricing card system'
                : 'Feature grid across responsive breakpoints',
        contain: true,
        media,
        project: orgo,
      })),
    ],
    description: orgo.description,
    foreground: '#fffaf0',
    id: 'orgo',
    projects: [orgo],
    title: 'Orgo',
  },
  {
    accent: '#ffb1a7',
    background: '#9f3732',
    chapters: [
      {
        caption: 'Editor and invoice, always in sync',
        media: goodInvoice.media[0],
        objectPosition: 'center',
        project: goodInvoice,
      },
      {
        caption: 'The form stays focused while the document takes shape',
        media: goodInvoice.media[0],
        objectPosition: '15% center',
        project: goodInvoice,
      },
      {
        caption: 'A print-ready result without leaving the flow',
        media: goodInvoice.media[0],
        objectPosition: '82% center',
        project: goodInvoice,
      },
    ],
    description: goodInvoice.description,
    foreground: '#fffaf0',
    id: 'good-invoice',
    projects: [goodInvoice],
    title: 'The Good Invoice',
  },
  {
    accent: '#9f3732',
    background: '#d79d40',
    chapters: [
      {
        caption: 'Glazed — visual product craft',
        media: glazed.media[0],
        project: glazed,
      },
      {
        caption: 'Calm AI Studio — quieter tools for thinking',
        media: calmAi.media[0],
        project: calmAi,
      },
      {
        caption: 'Stepper — progress you can feel',
        media: stepper.media[0],
        project: stepper,
      },
    ],
    description: 'Three smaller experiments in calm AI, visual craft, and tactile progress.',
    foreground: '#102b43',
    id: 'others',
    projects: [glazed, calmAi, stepper],
    title: 'Others',
  },
]

const EASE = [0.22, 1, 0.36, 1] as const

function storyStyle(story: ProjectStory) {
  return {
    '--story-accent': story.accent,
    '--story-background': story.background,
    '--story-foreground': story.foreground,
  } as CSSProperties
}

function StoryLinks({
  active,
  projects,
}: {
  active: boolean
  projects: PortfolioProject[]
}) {
  return (
    <div className={styles.storyLinks}>
      {projects.map((project) => {
        const primaryHref = project.liveHref ?? project.repositoryHref
        const secondaryHref =
          project.liveHref && project.repositoryHref
            ? project.repositoryHref
            : undefined

        return (
          <div key={project.id}>
            <span>{project.title}</span>
            {primaryHref ? (
              <a
                href={primaryHref}
                rel="noreferrer"
                tabIndex={active ? 0 : -1}
                target="_blank"
              >
                {project.liveHref ? 'Open project' : 'View source'}
                <span aria-hidden="true">↗</span>
              </a>
            ) : (
              <span>Case study soon</span>
            )}
            {secondaryHref ? (
              <a
                href={secondaryHref}
                rel="noreferrer"
                tabIndex={active ? 0 : -1}
                target="_blank"
              >
                Source <span aria-hidden="true">↗</span>
              </a>
            ) : null}
          </div>
        )
      })}
    </div>
  )
}

function BackgroundWipe({
  direction,
  instant,
  story,
}: {
  direction: TravelDirection
  instant: boolean
  story: ProjectStory
}) {
  return (
    <AnimatePresence custom={direction} initial={false} mode="sync">
      <motion.div
        animate={{
          clipPath: 'polygon(0 0, 100% 0, 100% 100%, 0 100%)',
          opacity: 1,
        }}
        aria-hidden="true"
        className={styles.backgroundLayer}
        custom={direction}
        exit={{
          opacity: 0,
          transition: {
            duration: instant ? 0 : 0.18,
            ease: EASE,
          },
        }}
        initial={
          instant
            ? false
            : {
                clipPath:
                  direction > 0
                    ? 'polygon(100% 0, 100% 0, 100% 100%, 92% 100%)'
                    : 'polygon(0 0, 0 0, 8% 100%, 0 100%)',
                opacity: 1,
              }
        }
        key={story.id}
        style={storyStyle(story)}
        transition={{
          duration: instant ? 0 : 0.44,
          ease: EASE,
        }}
      />
    </AnimatePresence>
  )
}

function StoryTitle({ story }: { story: ProjectStory }) {
  const hasDescription = story.id === 'orgo'

  return (
    <div
      className={`${styles.titleDock} ${
        hasDescription ? styles.titleDockWithDescription : ''
      }`}
      style={storyStyle(story)}
    >
      <div className={styles.titleMask}>
        <h2>{story.title}</h2>
      </div>
      {hasDescription ? (
        <>
          <p className={styles.titleDescription}>{story.description}</p>
          <ul aria-label="Orgo frontend focus" className={styles.titleMeta}>
            <li>Astro frontend</li>
            <li>English / Arabic</li>
            <li>RTL</li>
            <li>Light / dark</li>
            <li>Responsive</li>
          </ul>
        </>
      ) : null}
    </div>
  )
}

function ProjectControls({
  activeIndex,
  onSelect,
}: {
  activeIndex: number
  onSelect: (index: number, source: ChangeSource) => void
}) {
  return (
    <nav aria-label="Project controls" className={styles.controls}>
      <div aria-label="Choose a project" className={styles.projectDots}>
        {STORIES.map((story, index) => (
          <button
            aria-label={`Show ${story.title}`}
            aria-pressed={activeIndex === index}
            key={story.id}
            onClick={(event) =>
              onSelect(
                index,
                event.detail === 0 ? 'keyboard' : 'pointer',
              )
            }
            style={{ '--dot-color': story.accent } as CSSProperties}
            type="button"
          >
            <span />
          </button>
        ))}
      </div>
    </nav>
  )
}

function StoryMedia({
  chapter,
  compact,
  eager,
  index,
}: {
  chapter: StoryChapter
  compact: boolean
  eager: boolean
  index: number
}) {
  const reducedMotion = useReducedMotion()
  const fallbackSrc = chapter.media.fallbackSrc ?? chapter.media.src

  return (
    <figure
      className={`${styles.storyChapter} ${
        compact ? styles.compactChapter : ''
      }`}
    >
      <div
        className={styles.mediaFrame}
        data-fit={chapter.contain ? 'contain' : 'cover'}
        style={
          chapter.contain
            ? {
                '--media-ratio': `${chapter.media.width} / ${chapter.media.height}`,
              } as CSSProperties
            : undefined
        }
      >
        {chapter.videoSrc ? (
          <video
            aria-label={chapter.media.alt}
            autoPlay={!reducedMotion}
            height={chapter.media.height}
            loop
            muted
            playsInline
            poster={chapter.media.src}
            preload={eager ? 'auto' : 'metadata'}
            width={chapter.media.width}
          >
            <source src={chapter.videoSrc} type="video/mp4" />
          </video>
        ) : (
          <picture>
            {chapter.media.fallbackSrc ? (
              <source srcSet={chapter.media.src} type="image/webp" />
            ) : null}
            <img
              alt={chapter.media.alt}
              decoding="async"
              fetchPriority={eager ? 'high' : 'auto'}
              height={chapter.media.height}
              loading={eager ? 'eager' : 'lazy'}
              src={fallbackSrc}
              style={
                chapter.objectPosition
                  ? { objectPosition: chapter.objectPosition }
                  : undefined
              }
              width={chapter.media.width}
            />
          </picture>
        )}
      </div>
      <figcaption>
        {compact ? (
          <>
            <span>{chapter.caption}</span>
            {chapter.project ? <span>{chapter.project.title}</span> : null}
          </>
        ) : (
          <>
            <span>{String(index + 1).padStart(2, '0')}</span>
            <span>{chapter.caption}</span>
            {chapter.project ? <span>{chapter.project.title}</span> : null}
          </>
        )}
      </figcaption>
    </figure>
  )
}

function ProjectStorySlide({
  active,
  activeIndex,
  index,
  onHorizontalKey,
  onProjectSelect,
  story,
  storyRef,
}: {
  active: boolean
  activeIndex: number
  index: number
  onHorizontalKey: (
    event: KeyboardEvent<HTMLDivElement>,
    index: number,
  ) => void
  onProjectSelect: (index: number, source: ChangeSource) => void
  story: ProjectStory
  storyRef: (node: HTMLDivElement | null) => void
}) {
  return (
    <article
      aria-label={`${story.title} project story`}
      className={styles.projectSlide}
      inert={!active}
      style={storyStyle(story)}
    >
      <div
        aria-label={`${story.title} vertical project story.`}
        className={styles.verticalStory}
        onKeyDown={(event) => onHorizontalKey(event, index)}
        ref={storyRef}
        role="region"
        tabIndex={active ? 0 : -1}
      >
        <div className={styles.storyHeader}>
          <StoryTitle story={story} />
          <ProjectControls
            activeIndex={activeIndex}
            onSelect={onProjectSelect}
          />
        </div>

        <div
          className={`${styles.storyChapters} ${
            story.id === 'orgo' ? styles.compactChapters : ''
          }`}
        >
          {story.chapters.map((chapter, chapterIndex) => (
            <StoryMedia
              chapter={chapter}
              compact={story.id === 'orgo'}
              eager={index === 0 && chapterIndex === 0}
              index={chapterIndex}
              key={`${story.id}-${chapter.media.src}-${chapterIndex}`}
            />
          ))}
        </div>

        <footer
          className={`${styles.storyEnd} ${
            story.id === 'orgo' ? styles.storyEndCompact : ''
          }`}
        >
          {story.id !== 'orgo' ? (
            <div>
              <p>Project notes</p>
              <h3>{story.title}</h3>
              <span>{story.description}</span>
            </div>
          ) : null}
          <StoryLinks active={active} projects={story.projects} />
          <p className={styles.nextCue}>
            {index < STORIES.length - 1
              ? 'Swipe right for the next project'
              : 'End of selected work'}
          </p>
        </footer>
      </div>
    </article>
  )
}

function destinationForKey(key: string, current: number) {
  if (key === 'ArrowRight') return Math.min(current + 1, STORIES.length - 1)
  if (key === 'ArrowLeft') return Math.max(current - 1, 0)
  if (key === 'Home') return 0
  if (key === 'End') return STORIES.length - 1
  return null
}

export function CrossAxisProjectRail() {
  const [activeIndex, setActiveIndex] = useState(0)
  const [direction, setDirection] = useState<TravelDirection>(1)
  const [changeSource, setChangeSource] =
    useState<ChangeSource>('pointer')
  const activeIndexRef = useRef(0)
  const viewportRef = useRef<HTMLDivElement>(null)
  const slideRefs = useRef<Array<HTMLElement | null>>([])
  const storyRefs = useRef<Array<HTMLDivElement | null>>([])
  const frameRef = useRef<number | null>(null)
  const reducedMotion = useReducedMotion()

  useEffect(
    () => () => {
      if (frameRef.current !== null) cancelAnimationFrame(frameRef.current)
    },
    [],
  )

  useEffect(() => {
    let secondFrame: number | null = null
    const firstFrame = requestAnimationFrame(() => {
      secondFrame = requestAnimationFrame(() => {
        const viewport = viewportRef.current
        if (!viewport || viewport.clientWidth === 0) return
        const restoredIndex = Math.max(
          0,
          Math.min(
            STORIES.length - 1,
            Math.round(viewport.scrollLeft / viewport.clientWidth),
          ),
        )
        if (restoredIndex === activeIndexRef.current) return
        activeIndexRef.current = restoredIndex
        setDirection(restoredIndex > 0 ? 1 : -1)
        setChangeSource('scroll')
        setActiveIndex(restoredIndex)
      })
    })

    return () => {
      cancelAnimationFrame(firstFrame)
      if (secondFrame !== null) cancelAnimationFrame(secondFrame)
    }
  }, [])

  const activeStory = STORIES[activeIndex]
  const instant = Boolean(reducedMotion) || changeSource === 'keyboard'

  function updateActive(index: number, source: ChangeSource) {
    const nextIndex = Math.max(0, Math.min(STORIES.length - 1, index))
    const previous = activeIndexRef.current
    if (nextIndex === previous) return

    setDirection(nextIndex > previous ? 1 : -1)
    setChangeSource(source)
    activeIndexRef.current = nextIndex
    setActiveIndex(nextIndex)
  }

  function goTo(index: number, source: ChangeSource) {
    const nextIndex = Math.max(0, Math.min(STORIES.length - 1, index))
    const slide = slideRefs.current[nextIndex]
    if (!slide) return

    const viewport = viewportRef.current
    const alreadyAtTarget =
      viewport && Math.abs(viewport.scrollLeft - slide.offsetLeft) < 1

    if (reducedMotion || source === 'keyboard' || alreadyAtTarget) {
      updateActive(nextIndex, source)
    }

    viewport?.scrollTo({
      behavior: reducedMotion || source === 'keyboard' ? 'auto' : 'smooth',
      left: slide.offsetLeft,
    })
  }

  function handleHorizontalScroll(event: UIEvent<HTMLDivElement>) {
    if (frameRef.current !== null) cancelAnimationFrame(frameRef.current)
    const viewport = event.currentTarget

    frameRef.current = requestAnimationFrame(() => {
      const center = viewport.scrollLeft + viewport.clientWidth / 2
      let nearest = activeIndexRef.current
      let nearestDistance = Number.POSITIVE_INFINITY

      slideRefs.current.forEach((slide, index) => {
        if (!slide) return
        const distance = Math.abs(
          slide.offsetLeft + slide.offsetWidth / 2 - center,
        )
        if (distance < nearestDistance) {
          nearest = index
          nearestDistance = distance
        }
      })

      updateActive(nearest, 'scroll')
      frameRef.current = null
    })
  }

  function handleHorizontalKey(
    event: KeyboardEvent<HTMLDivElement>,
    currentIndex = activeIndexRef.current,
    allowEdgeKeys = true,
  ) {
    if (event.target !== event.currentTarget) return
    if (!allowEdgeKeys && event.key !== 'ArrowLeft' && event.key !== 'ArrowRight') {
      return
    }
    const destination = destinationForKey(event.key, currentIndex)
    if (destination === null) return
    event.preventDefault()
    goTo(destination, 'keyboard')
    storyRefs.current[destination]?.focus({ preventScroll: true })
  }

  return (
    <section
      aria-label="Selected projects"
      className={styles.root}
      style={storyStyle(activeStory)}
    >
      <BackgroundWipe
        direction={direction}
        instant={instant}
        story={activeStory}
      />

      <div
        aria-label="Projects. Swipe or scroll horizontally to change project."
        className={styles.horizontalViewport}
        onKeyDown={(event) => handleHorizontalKey(event)}
        onScroll={handleHorizontalScroll}
        ref={viewportRef}
        role="region"
        tabIndex={0}
      >
        <div className={styles.horizontalTrack}>
          {STORIES.map((story, index) => (
            <div
              className={styles.projectStop}
              key={story.id}
              ref={(node) => {
                slideRefs.current[index] = node
              }}
            >
              <ProjectStorySlide
                active={index === activeIndex}
                activeIndex={activeIndex}
                index={index}
                onHorizontalKey={(event, currentIndex) =>
                  handleHorizontalKey(event, currentIndex, false)
                }
                onProjectSelect={goTo}
                story={story}
                storyRef={(node) => {
                  storyRefs.current[index] = node
                }}
              />
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
