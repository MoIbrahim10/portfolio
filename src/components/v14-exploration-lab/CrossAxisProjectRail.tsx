import {
  type ChangeEvent,
  type CSSProperties,
  type KeyboardEvent,
  type MouseEvent as ReactMouseEvent,
  type PointerEvent as ReactPointerEvent,
  type UIEvent,
  useCallback,
  useEffect,
  useRef,
  useState,
} from 'react'
import { createPortal } from 'react-dom'
import {
  AnimatePresence,
  LayoutGroup,
  motion,
  useInView,
  useMotionTemplate,
  useMotionValue,
  useReducedMotion,
  useSpring,
  useTransform,
} from 'motion/react'

import {
  PORTFOLIO_PROJECTS,
  type PortfolioMedia,
  type PortfolioProject,
} from './portfolio-data'
import { PORTFOLIO_PLACEHOLDERS } from './portfolio-placeholders'
import { CutCornerButton } from './CutCornerButton'

import styles from './CrossAxisProjectRail.module.css'

type ChangeSource = 'keyboard' | 'pointer' | 'scroll'
type TravelDirection = -1 | 1
type AssetStatus = 'error' | 'loading' | 'queued' | 'ready'
export type DetailPresentation =
  | 'archive'
  | 'blueprint'
  | 'catalog'
  | 'cinema'
  | 'editorial'
  | 'ledger'
  | 'mosaic'
  | 'poster'
  | 'split'
  | 'windows'

interface StoryChapter {
  caption: string
  contain?: boolean
  label?: string
  media: PortfolioMedia
  objectPosition?: string
  project?: PortfolioProject
  videoSrc?: string
}

interface MediaSelection {
  accent: string
  background: string
  chapter: StoryChapter
  foreground: string
  id: string
}

interface ProjectStory {
  accent: string
  background: string
  description: string
  foreground: string
  id: 'orgo' | 'good-invoice' | 'lumen' | 'others'
  projects: PortfolioProject[]
  title: string
  chapters: StoryChapter[]
}

function useHydrationSafeReducedMotion() {
  const reducedMotion = useReducedMotion()
  const [hydrated, setHydrated] = useState(false)

  useEffect(() => setHydrated(true), [])

  return hydrated ? Boolean(reducedMotion) : true
}

const projectById = (id: string) => {
  const project = PORTFOLIO_PROJECTS.find((item) => item.id === id)
  if (!project) throw new Error(`Missing portfolio project: ${id}`)
  return project
}

const orgo = projectById('orgo')
const goodInvoice = projectById('good-invoice')
const lumen = projectById('lumen')
const bitsnpixels = projectById('bitsnpixels')
const glazed = projectById('glazed')
const stepper = projectById('stepper')
const folders = projectById('folders')

const STORIES: ProjectStory[] = [
  {
    accent: '#d79d40',
    background: '#0f2636',
    chapters: [
      {
        caption:
          'Entrance animation and interactive icon hovers',
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
            ? 'Dark-mode hero section'
            : index === 1
              ? 'Connected-tools section featuring Figma, X, Apple, Chrome, and Framer'
              : index === 2
                ? 'Dark-mode comparison of the Basic and Elevate plans'
                : 'Light-mode benefits grid for calendar, journaling, scheduling, and task features',
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
        caption: 'Desktop editor and live invoice preview in the default light theme',
        contain: true,
        media: goodInvoice.media[0],
        project: goodInvoice,
      },
      {
        caption:
          'Invoice details and theme changes updating the live preview in real time',
        contain: true,
        media: {
          alt: 'The Good Invoice editor updating a live invoice preview',
          fallbackSrc: goodInvoice.media[0].fallbackSrc,
          height: 1080,
          src: goodInvoice.media[0].src,
          width: 1896,
        },
        project: goodInvoice,
        videoSrc: '/portfolio/projects/good-invoice/editor-workflow.mp4',
      },
      {
        caption:
          'Responsive editor stacking input controls above the live invoice preview',
        contain: true,
        media: goodInvoice.media[1],
        project: goodInvoice,
      },
      {
        caption:
          'Dark-mode Display tab with layout styles and invoice accent colours',
        contain: true,
        media: goodInvoice.media[2],
        project: goodInvoice,
      },
      {
        caption:
          'In-product feedback animation and hover interactions',
        contain: true,
        media: {
          alt: 'The Good Invoice feedback panel linking Fay and Mo',
          fallbackSrc: goodInvoice.media[2].fallbackSrc,
          height: 1080,
          src: goodInvoice.media[2].src,
          width: 1056,
        },
        project: goodInvoice,
        videoSrc: '/portfolio/projects/good-invoice/feedback-links.mp4',
      },
    ],
    description: goodInvoice.description,
    foreground: '#fffaf0',
    id: 'good-invoice',
    projects: [goodInvoice],
    title: 'The Good Invoice',
  },
  {
    accent: '#35d07f',
    background: '#0d0f0e',
    chapters: [
      {
        caption: 'Dark workspace home and prompt composer',
        contain: true,
        media: lumen.media[0],
        project: lumen,
      },
      {
        caption: 'Model selector and keyboard navigation',
        contain: true,
        media: {
          alt: 'Lumen model selector open over the dark workspace',
          fallbackSrc: lumen.media[0].fallbackSrc,
          height: 1080,
          src: lumen.media[0].src,
          width: 1616,
        },
        project: lumen,
        videoSrc: '/portfolio/projects/lumen/model-selector.mp4',
      },
      {
        caption: 'Prompt shortcuts and hover feedback',
        contain: true,
        media: {
          alt: 'Lumen prompt shortcut interaction beneath the composer',
          fallbackSrc: lumen.media[0].fallbackSrc,
          height: 952,
          src: lumen.media[0].src,
          width: 1920,
        },
        project: lumen,
        videoSrc: '/portfolio/projects/lumen/prompt-shortcuts.mp4',
      },
      {
        caption: 'Composer controls and generation states',
        contain: true,
        media: {
          alt: 'Lumen composer controls and active generation state',
          fallbackSrc: lumen.media[0].fallbackSrc,
          height: 948,
          src: lumen.media[0].src,
          width: 1920,
        },
        project: lumen,
        videoSrc: '/portfolio/projects/lumen/composer-controls.mp4',
      },
      {
        caption: 'Mobile asset library',
        contain: true,
        media: lumen.media[1],
        project: lumen,
      },
      {
        caption: 'Theme customizer over the connectors workspace',
        contain: true,
        media: lumen.media[2],
        project: lumen,
      },
      {
        caption: 'Light-mode project conversation',
        contain: true,
        media: lumen.media[3],
        project: lumen,
      },
    ],
    description: lumen.description,
    foreground: '#f1e9d9',
    id: 'lumen',
    projects: [lumen],
    title: 'Lumen',
  },
  {
    accent: '#9f3732',
    background: '#d79d40',
    chapters: [
      {
        caption: 'Studio hero cursor exchange and selected-work rail',
        contain: true,
        media: bitsnpixels.media[0],
        project: bitsnpixels,
        videoSrc: '/portfolio/projects/bitsnpixels/studio-hero.mp4',
      },
      {
        caption:
          'Selected-work carousel moving between scheduling and network tools',
        contain: true,
        media: bitsnpixels.media[1],
        project: bitsnpixels,
        videoSrc: '/portfolio/projects/bitsnpixels/work-carousel.mp4',
      },
      {
        caption: 'Case-study focus transition across software systems',
        contain: true,
        media: bitsnpixels.media[2],
        project: bitsnpixels,
        videoSrc: '/portfolio/projects/bitsnpixels/case-study-focus.mp4',
      },
      {
        caption: 'Eight interaction states sharing one LED visual language',
        contain: true,
        media: stepper.media[0],
        project: stepper,
      },
      {
        caption:
          'Configurator for assembly, shell, display, progress, and arrow parts',
        contain: true,
        media: stepper.media[1],
        project: stepper,
      },
      {
        caption: 'Keyboard-driven sequence with active-state feedback',
        contain: true,
        media: stepper.media[2],
        project: stepper,
        videoSrc: '/portfolio/projects/stepper/interactive-sequence.mp4',
      },
      {
        caption: 'Directional arrow state and LED transition',
        contain: true,
        media: stepper.media[3],
        project: stepper,
        videoSrc: '/portfolio/projects/stepper/arrow-state.mp4',
      },
      {
        caption: 'Color-coded workspace library for folders and file cards',
        contain: true,
        media: folders.media[0],
        project: folders,
      },
      {
        caption: 'Drag-and-drop file organization across tactile folder cards',
        contain: true,
        media: folders.media[1],
        project: folders,
        videoSrc: '/portfolio/projects/folders/folder-organization.mp4',
      },
      {
        caption: 'Studio introduction beside selected product work',
        contain: true,
        media: glazed.media[0],
        project: glazed,
      },
      {
        caption:
          'Studio introduction scrolling through selected product interfaces',
        contain: true,
        media: glazed.media[1],
        project: glazed,
        videoSrc: '/portfolio/projects/glazed/studio-scroll.mp4',
      },
      {
        caption: 'Collaboration CTA revealing Fay inside the call button',
        contain: true,
        media: glazed.media[2],
        project: glazed,
        videoSrc: '/portfolio/projects/glazed/collaboration-cta.mp4',
      },
      {
        caption:
          'Mobile case-study scroll through monitoring agents and network checks',
        contain: true,
        media: glazed.media[3],
        project: glazed,
        videoSrc: '/portfolio/projects/glazed/mobile-case-study.mp4',
      },
      {
        caption: 'Pricing page moving from service plans into selected work',
        contain: true,
        media: glazed.media[4],
        project: glazed,
        videoSrc: '/portfolio/projects/glazed/pricing-scroll.mp4',
      },
      {
        caption: 'MO identity mark animation',
        contain: true,
        label: 'MO',
        media: {
          alt: 'Animated MO identity mark',
          height: 1080,
          src: '/portfolio/projects/identity/logo-animation-poster.webp',
          width: 1456,
        },
        videoSrc: '/portfolio/projects/identity/logo-animation.mp4',
      },
    ],
    description:
      'A rolling gallery of studio sites, interface systems, and interaction prototypes.',
    foreground: '#102b43',
    id: 'others',
    projects: [bitsnpixels, stepper, folders, glazed],
    title: 'Selected Experiments',
  },
]

const EASE = [0.22, 1, 0.36, 1] as const

interface ConnectionHint {
  downlink?: number
  effectiveType?: string
  rtt?: number
  saveData?: boolean
}

function hasConstrainedConnection() {
  if (typeof navigator === 'undefined') return false

  const connection = (
    navigator as Navigator & { connection?: ConnectionHint }
  ).connection

  return Boolean(
    connection?.saveData ||
      ['slow-2g', '2g', '3g'].includes(connection?.effectiveType ?? '') ||
      (typeof connection?.downlink === 'number' &&
        connection.downlink < 2) ||
      (typeof connection?.rtt === 'number' && connection.rtt > 500),
  )
}

function storyStyle(story: ProjectStory) {
  return {
    '--focus-ring': story.foreground,
    '--story-count': STORIES.length,
    '--story-accent': story.accent,
    '--story-background': story.background,
    '--story-foreground': story.foreground,
  } as CSSProperties
}

function StoryTopLinks({
  projects,
}: {
  projects: PortfolioProject[]
}) {
  const project = projects[0]
  const primaryHref = project?.liveHref ?? project?.repositoryHref

  if (!project || !primaryHref) return null

  return (
    <div className={styles.titleLinks}>
      <CutCornerButton
        className={styles.projectLink}
        href={primaryHref}
        rel="noreferrer"
        target="_blank"
        variant="paper"
      >
        {project.liveHref ? 'Open project' : 'View source'}
      </CutCornerButton>
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

function StoryTitle({
  activeIndex,
  onProjectSelect,
  story,
}: {
  activeIndex: number
  onProjectSelect: (index: number, source: ChangeSource) => void
  story: ProjectStory
}) {
  return (
    <div
      className={`${styles.titleDock} ${styles.titleDockWithDescription}`}
      style={storyStyle(story)}
    >
      <div className={styles.titleRow}>
        <div className={styles.titleIdentity}>
          <div className={styles.titleMask}>
            <h2>{story.title}</h2>
          </div>
        </div>
        <ProjectControls
          activeIndex={activeIndex}
          onSelect={onProjectSelect}
        />
      </div>
      <p className={styles.titleDescription}>{story.description}</p>
      {story.id !== 'others'
        ? story.projects[0]?.collaborators.map((collaborator) => (
            <p className={styles.collaborationCredit} key={collaborator.name}>
              <span>In collaboration with</span>
              <a
                href={collaborator.websiteHref}
                rel="noreferrer"
                target="_blank"
              >
                {collaborator.name}
              </a>
              {collaborator.socialHref ? (
                <a
                  aria-label={`${collaborator.name} on X`}
                  className={styles.collaboratorSocial}
                  href={collaborator.socialHref}
                  rel="noreferrer"
                  target="_blank"
                >
                  X
                </a>
              ) : null}
            </p>
          ))
        : null}
      {story.id !== 'others' ? (
        <StoryTopLinks projects={story.projects} />
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
    <div aria-label="Choose a project" className={styles.controls} role="group">
      <div className={styles.projectDots}>
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
            style={{
              '--dot-color':
                story.id === 'others' ? story.foreground : story.accent,
            } as CSSProperties}
            type="button"
          >
            <span />
          </button>
        ))}
      </div>
    </div>
  )
}

function DeferredPicture({
  alt,
  load,
  loading = 'lazy',
  media,
  objectPosition,
  priority = 'auto',
}: {
  alt: string
  load: boolean
  loading?: 'eager' | 'lazy'
  media: PortfolioMedia
  objectPosition?: string
  priority?: 'auto' | 'high' | 'low'
}) {
  const [status, setStatus] = useState<AssetStatus>(
    load ? 'loading' : 'queued',
  )
  const fallbackSrc = media.fallbackSrc ?? media.src
  const placeholderSrc = PORTFOLIO_PLACEHOLDERS[media.src]

  useEffect(() => {
    if (load && status === 'queued') setStatus('loading')
  }, [load, status])

  return (
    <span
      aria-busy={status === 'loading'}
      className={styles.assetSurface}
      data-status={status}
    >
      {placeholderSrc ? (
        <img
          alt=""
          aria-hidden="true"
          className={styles.assetPlaceholder}
          draggable={false}
          height={media.height}
          src={placeholderSrc}
          style={objectPosition ? { objectPosition } : undefined}
          width={media.width}
        />
      ) : null}

      {load ? (
        <picture
          className={styles.assetPicture}
          data-ready={status === 'ready' || undefined}
        >
          {media.fallbackSrc ? (
            <source srcSet={media.src} type="image/webp" />
          ) : null}
          <img
            alt={alt}
            decoding="async"
            fetchPriority={priority}
            height={media.height}
            loading={loading}
            onError={() => setStatus('error')}
            onLoad={(event) => {
              const image = event.currentTarget
              void image
                .decode()
                .catch(() => undefined)
                .then(() => setStatus('ready'))
            }}
            src={fallbackSrc}
            style={objectPosition ? { objectPosition } : undefined}
            width={media.width}
          />
        </picture>
      ) : null}
    </span>
  )
}

function StoryMedia({
  active,
  chapter,
  compact,
  eager,
  mediaId,
  onOpen,
  prewarm,
  story,
}: {
  active: boolean
  chapter: StoryChapter
  compact: boolean
  eager: boolean
  mediaId: string
  onOpen: (
    selection: MediaSelection,
    trigger: HTMLButtonElement,
    instant: boolean,
  ) => void
  prewarm: boolean
  story: ProjectStory
}) {
  const reducedMotion = useHydrationSafeReducedMotion()
  const [focused, setFocused] = useState(false)
  const [requested, setRequested] = useState(eager)
  const mediaRef = useRef<HTMLDivElement>(null)
  const nearViewport = useInView(mediaRef, {
    amount: 'some',
    margin: '720px 0px',
    once: true,
  })
  const pointerX = useMotionValue(0)
  const pointerY = useMotionValue(0)
  const smoothX = useSpring(pointerX, {
    damping: 34,
    mass: 0.55,
    stiffness: 290,
  })
  const smoothY = useSpring(pointerY, {
    damping: 34,
    mass: 0.55,
    stiffness: 290,
  })
  const originX = useTransform(smoothX, [-1, 1], [34, 66])
  const originY = useTransform(smoothY, [-1, 1], [34, 66])
  const panX = useTransform(smoothX, [-1, 1], [12, -12])
  const panY = useTransform(smoothY, [-1, 1], [9, -9])
  const transformOrigin = useMotionTemplate`${originX}% ${originY}%`

  useEffect(() => {
    if (requested || !active || !nearViewport) return
    setRequested(true)
  }, [active, nearViewport, requested])

  useEffect(() => {
    if (requested || !prewarm || hasConstrainedConnection()) return

    const timer = window.setTimeout(() => setRequested(true), 1200)
    return () => window.clearTimeout(timer)
  }, [prewarm, requested])

  const handlePointerMove = (
    event: ReactPointerEvent<HTMLButtonElement>,
  ) => {
    if (reducedMotion || event.pointerType === 'touch') return
    const bounds = event.currentTarget.getBoundingClientRect()
    pointerX.set(((event.clientX - bounds.left) / bounds.width) * 2 - 1)
    pointerY.set(((event.clientY - bounds.top) / bounds.height) * 2 - 1)
    setFocused(true)
  }

  const resetFocus = () => {
    pointerX.set(0)
    pointerY.set(0)
    setFocused(false)
  }

  const mediaFrame = (
    <div
      className={styles.mediaFrame}
      data-fit={chapter.contain ? 'contain' : 'cover'}
      data-media-type={chapter.videoSrc ? 'video' : 'image'}
      ref={mediaRef}
      style={
        chapter.contain
          ? {
              '--media-ratio': `${chapter.media.width} / ${chapter.media.height}`,
            } as CSSProperties
          : undefined
      }
    >
      <motion.div
        animate={{ scale: focused && !reducedMotion ? 1.065 : 1 }}
        className={styles.mediaFocusPlane}
        style={
          !reducedMotion
            ? { transformOrigin, x: panX, y: panY }
            : undefined
        }
        transition={{ bounce: 0, duration: 0.45, type: 'spring' }}
      >
        {chapter.videoSrc ? (
          <ResilientVideo
            active={active}
            eager={eager}
            load={requested}
            media={chapter.media}
            src={chapter.videoSrc}
          />
        ) : (
          <DeferredPicture
            alt={chapter.media.alt}
            load={requested}
            loading={eager ? 'eager' : 'lazy'}
            media={chapter.media}
            objectPosition={chapter.objectPosition}
            priority={eager ? 'high' : active ? 'auto' : 'low'}
          />
        )}
      </motion.div>
    </div>
  )

  return (
    <figure
      className={`${styles.storyChapter} ${
        compact ? styles.compactChapter : ''
      }`}
    >
      <motion.button
        aria-label={`View ${chapter.caption} full screen`}
        className={styles.galleryMediaButton}
        data-focused={focused || undefined}
        layoutId={`project-media-${mediaId}`}
        onBlur={resetFocus}
        onClick={(event: ReactMouseEvent<HTMLButtonElement>) =>
          onOpen(
            {
              accent: story.accent,
              background: story.background,
              chapter,
              foreground: story.foreground,
              id: mediaId,
            },
            event.currentTarget,
            event.detail === 0,
          )
        }
        onFocus={() => setFocused(true)}
        onMouseLeave={resetFocus}
        onPointerEnter={handlePointerMove}
        onPointerLeave={resetFocus}
        onPointerMove={handlePointerMove}
        transition={{ duration: 0.34, ease: EASE }}
        type="button"
      >
        {mediaFrame}
        <span aria-hidden="true" className={styles.galleryViewCue}>
          <span>Open preview</span>
        </span>
      </motion.button>
      <figcaption>
        <span>{chapter.caption}</span>
        {chapter.label || chapter.project ? (
          <span>{chapter.label ?? chapter.project?.title}</span>
        ) : null}
      </figcaption>
      {story.id === 'others'
        ? chapter.project?.collaborators.map((collaborator) => (
            <p
              className={styles.cardCollaboration}
              key={collaborator.name}
            >
              <span>In collaboration with</span>
              <a
                href={collaborator.websiteHref}
                rel="noreferrer"
                target="_blank"
              >
                {collaborator.name}
              </a>
              {collaborator.socialHref ? (
                <a
                  aria-label={`${collaborator.name} on X`}
                  className={styles.collaboratorSocial}
                  href={collaborator.socialHref}
                  rel="noreferrer"
                  target="_blank"
                >
                  X
                </a>
              ) : null}
            </p>
          ))
        : null}
    </figure>
  )
}

function ResilientVideo({
  active,
  eager,
  load,
  media,
  src,
}: {
  active: boolean
  eager: boolean
  load: boolean
  media: PortfolioMedia
  src: string
}) {
  const reducedMotion = useHydrationSafeReducedMotion()
  const [inView, setInView] = useState(eager)
  const [playing, setPlaying] = useState(false)
  const [playbackBlocked, setPlaybackBlocked] = useState(false)
  const [failed, setFailed] = useState(false)
  const [videoReady, setVideoReady] = useState(false)
  const rootRef = useRef<HTMLDivElement>(null)
  const videoRef = useRef<HTMLVideoElement>(null)
  const posterSrc = src.replace(/\.mp4$/, '-poster.webp')
  const shouldPlay = load && active && inView && !reducedMotion && !failed
  const attemptPlayback = useCallback((video: HTMLVideoElement) => {
    video.muted = true
    video.defaultMuted = true

    void video.play().then(
      () => setPlaybackBlocked(false),
      (error: unknown) => {
        if (error instanceof DOMException && error.name === 'AbortError') return
        setPlaybackBlocked(true)
      },
    )
  }, [])

  useEffect(() => {
    const root = rootRef.current
    if (!root) return

    if (!('IntersectionObserver' in window)) {
      setInView(true)
      return
    }

    const observer = new IntersectionObserver(
      ([entry]) => setInView(entry.isIntersecting),
      { root: null, rootMargin: '96px 0px', threshold: 0.01 },
    )
    observer.observe(root)

    return () => observer.disconnect()
  }, [])

  useEffect(() => {
    setFailed(false)
    setPlaybackBlocked(false)
    setVideoReady(false)
  }, [src])

  useEffect(() => {
    const video = videoRef.current
    if (!video) return

    if (!shouldPlay) {
      video.pause()
      setPlaying(false)
      return
    }

    video.preload = 'auto'
    attemptPlayback(video)
  }, [attemptPlayback, shouldPlay])

  return (
    <div
      className={styles.videoStack}
      data-playback={
        failed
          ? 'failed'
          : playbackBlocked
            ? 'blocked'
            : playing
              ? 'playing'
              : 'idle'
      }
      data-ready={videoReady || undefined}
      ref={rootRef}
    >
      <img
        alt=""
        aria-hidden="true"
        className={styles.videoPoster}
        decoding="async"
        fetchPriority={eager ? 'high' : active ? 'auto' : 'low'}
        height={media.height}
        loading={eager ? 'eager' : 'lazy'}
        src={posterSrc}
        width={media.width}
      />

      {load && !failed ? (
        <video
          aria-label={media.alt}
          autoPlay={shouldPlay}
          className={styles.videoLayer}
          data-ready={videoReady || undefined}
          height={media.height}
          loop
          muted
          onCanPlay={(event) => {
            setVideoReady(true)
            if (shouldPlay && event.currentTarget.paused) {
              attemptPlayback(event.currentTarget)
            }
          }}
          onError={() => {
            setPlaying(false)
            setFailed(true)
            setVideoReady(false)
          }}
          onLoadedData={() => setVideoReady(true)}
          onPause={() => setPlaying(false)}
          onPlaying={() => setPlaying(true)}
          playsInline
          preload="metadata"
          ref={videoRef}
          src={src}
          width={media.width}
        />
      ) : null}
    </div>
  )
}

function formatVideoTime(value: number) {
  if (!Number.isFinite(value)) return '0:00'
  const minutes = Math.floor(value / 60)
  const seconds = Math.floor(value % 60)
  return `${minutes}:${seconds.toString().padStart(2, '0')}`
}

function ViewerVideo({
  media,
  src,
}: {
  media: PortfolioMedia
  src: string
}) {
  const reducedMotion = useHydrationSafeReducedMotion()
  const [currentTime, setCurrentTime] = useState(0)
  const [duration, setDuration] = useState(0)
  const [playing, setPlaying] = useState(false)
  const videoRef = useRef<HTMLVideoElement>(null)
  const progress = duration > 0 ? currentTime / duration : 0

  useEffect(() => {
    const video = videoRef.current
    if (!video) return

    setPlaying(!video.paused)
    setCurrentTime(video.currentTime)
    if (Number.isFinite(video.duration)) setDuration(video.duration)
    if (!reducedMotion) {
      void video.play().catch(() => setPlaying(false))
    }
  }, [reducedMotion])

  function togglePlayback() {
    const video = videoRef.current
    if (!video) return
    if (video.paused) {
      void video.play().catch(() => setPlaying(false))
    } else {
      video.pause()
    }
  }

  function seek(event: ChangeEvent<HTMLInputElement>) {
    const video = videoRef.current
    if (!video) return
    const nextTime = Number(event.currentTarget.value)
    video.currentTime = nextTime
    setCurrentTime(nextTime)
  }

  return (
    <div
      className={styles.viewerVideo}
      data-playing={playing || undefined}
      style={{ '--video-progress': progress } as CSSProperties}
    >
      <video
        aria-label={media.alt}
        className={styles.viewerVideoElement}
        height={media.height}
        loop
        muted
        onDurationChange={(event) => setDuration(event.currentTarget.duration)}
        onError={() => setPlaying(false)}
        onPause={() => setPlaying(false)}
        onPlaying={() => setPlaying(true)}
        onTimeUpdate={(event) =>
          setCurrentTime(event.currentTarget.currentTime)
        }
        playsInline
        preload="auto"
        ref={videoRef}
        src={src}
        width={media.width}
      />
      <div className={styles.viewerVideoControls}>
        <CutCornerButton
          aria-label={playing ? 'Pause video' : 'Play video'}
          className={styles.viewerPlayButton}
          onClick={togglePlayback}
          variant="paper"
        >
          {playing ? (
            <svg aria-hidden="true" viewBox="0 0 24 24">
              <path d="M7 5h3v14H7zm7 0h3v14h-3z" />
            </svg>
          ) : (
            <svg aria-hidden="true" viewBox="0 0 24 24">
              <path d="m8 5 11 7-11 7z" />
            </svg>
          )}
        </CutCornerButton>
        <div className={styles.viewerProgress}>
          <span aria-hidden="true" className={styles.viewerProgressTrack}>
            <span className={styles.viewerProgressFill} />
          </span>
          <input
            aria-label="Video progress"
            max={duration || 0}
            min={0}
            onChange={seek}
            step="0.01"
            type="range"
            value={Math.min(currentTime, duration || 0)}
          />
        </div>
        <span>
          {formatVideoTime(currentTime)} / {formatVideoTime(duration)}
        </span>
      </div>
    </div>
  )
}

function MediaViewerContent({
  instant,
  onClose,
  selection,
}: {
  instant: boolean
  onClose: (instant: boolean) => void
  selection: MediaSelection
}) {
  const viewerRef = useRef<HTMLDivElement>(null)
  const { chapter } = selection
  const titleId = `media-viewer-title-${selection.id}`
  const captionId = `media-viewer-caption-${selection.id}`

  useEffect(() => {
    const viewer = viewerRef.current
    if (!viewer) return

    const previousOverflow = document.body.style.overflow
    const siblings = Array.from(document.body.children)
      .filter((element) => element !== viewer)
      .map((element) => ({
        element,
        inert: element.hasAttribute('inert'),
      }))

    document.body.style.overflow = 'hidden'
    siblings.forEach(({ element }) => element.setAttribute('inert', ''))

    const handleDocumentKeyDown = (event: globalThis.KeyboardEvent) => {
      if (event.key === 'Escape') {
        event.preventDefault()
        onClose(true)
        return
      }

      if (event.key !== 'Tab') return

      const focusable = Array.from(
        viewer.querySelectorAll<HTMLElement>(
          'button:not([disabled]):not([tabindex="-1"]), input:not([disabled]):not([tabindex="-1"]), a[href]:not([tabindex="-1"]), [tabindex]:not([tabindex="-1"])',
        ),
      )
      if (focusable.length === 0) return

      const activeIndex = focusable.indexOf(document.activeElement as HTMLElement)
      const destination = event.shiftKey
        ? activeIndex <= 0
          ? focusable.length - 1
          : activeIndex - 1
        : activeIndex === -1 || activeIndex === focusable.length - 1
          ? 0
          : activeIndex + 1
      event.preventDefault()
      focusable[destination].focus()
    }
    document.addEventListener('keydown', handleDocumentKeyDown, true)

    return () => {
      document.removeEventListener('keydown', handleDocumentKeyDown, true)
      document.body.style.overflow = previousOverflow
      siblings.forEach(({ element, inert }) => {
        if (!inert) element.removeAttribute('inert')
      })
    }
  }, [])

  return (
    <div
      aria-describedby={captionId}
      aria-labelledby={titleId}
      aria-modal="true"
      className={styles.mediaViewer}
      data-media-viewer=""
      ref={viewerRef}
      role="dialog"
      style={{
        '--viewer-accent': selection.accent,
        '--viewer-background': selection.background,
        '--viewer-foreground': selection.foreground,
      } as CSSProperties}
    >
      <motion.button
        animate={{ opacity: 1 }}
        aria-hidden="true"
        aria-label="Close full-screen media"
        className={styles.viewerBackdrop}
        exit={{ opacity: 0 }}
        initial={{ opacity: 0 }}
        onClick={() => onClose(false)}
        tabIndex={-1}
        transition={{ duration: instant ? 0 : 0.2, ease: EASE }}
        type="button"
      />

      <div className={styles.viewerShell}>
        <motion.header
          animate={{ opacity: 1, y: 0 }}
          className={styles.viewerHeader}
          exit={{ opacity: 0, y: -6 }}
          initial={instant ? false : { opacity: 0, y: -6 }}
          transition={{ duration: instant ? 0 : 0.22, ease: EASE }}
        >
          <div>
            <span>Selected frame</span>
            <h2 id={titleId}>
              {chapter.label ?? chapter.project?.title ?? 'Project media'}
            </h2>
          </div>
          <CutCornerButton
            autoFocus
            className={styles.viewerClose}
            onClick={(event) => onClose(event.detail === 0)}
            variant="paper"
          >
            Close
          </CutCornerButton>
        </motion.header>

        <motion.div
          className={styles.viewerFrame}
          layoutId={`project-media-${selection.id}`}
          style={{
            '--media-ratio': `${chapter.media.width} / ${chapter.media.height}`,
          } as CSSProperties}
          transition={{
            duration: instant ? 0 : 0.38,
            ease: EASE,
          }}
        >
          <div
            className={`${styles.mediaFrame} ${styles.viewerMedia}`}
            data-fit="contain"
            data-media-type={chapter.videoSrc ? 'video' : 'image'}
            data-orientation={
              chapter.media.width >= chapter.media.height
                ? 'landscape'
                : 'portrait'
            }
            style={{
              '--media-ratio': `${chapter.media.width} / ${chapter.media.height}`,
            } as CSSProperties}
          >
            {chapter.videoSrc ? (
              <ViewerVideo
                media={chapter.media}
                src={chapter.videoSrc}
              />
            ) : (
              <DeferredPicture
                alt={chapter.media.alt}
                load
                loading="eager"
                media={chapter.media}
                priority="high"
              />
            )}
          </div>
        </motion.div>

        <motion.footer
          animate={{ opacity: 1, y: 0 }}
          className={styles.viewerCaption}
          exit={{ opacity: 0, y: 6 }}
          initial={instant ? false : { opacity: 0, y: 6 }}
          transition={{ duration: instant ? 0 : 0.22, ease: EASE }}
        >
          <p id={captionId}>{chapter.caption}</p>
        </motion.footer>
      </div>
    </div>
  )
}

function MediaViewer({
  instant,
  onClose,
  onExitComplete,
  selection,
}: {
  instant: boolean
  onClose: (instant: boolean) => void
  onExitComplete: () => void
  selection: MediaSelection | null
}) {
  if (typeof document === 'undefined') return null

  return createPortal(
    <AnimatePresence
      initial={false}
      mode="sync"
      onExitComplete={onExitComplete}
    >
      {selection ? (
        <MediaViewerContent
          instant={instant}
          key={selection.id}
          onClose={onClose}
          selection={selection}
        />
      ) : null}
    </AnimatePresence>,
    document.body,
  )
}

function ProjectStorySlide({
  active,
  activeIndex,
  index,
  onHorizontalKey,
  onMediaOpen,
  onProjectSelect,
  onVerticalScroll,
  presentation,
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
  onMediaOpen: (
    selection: MediaSelection,
    trigger: HTMLButtonElement,
    instant: boolean,
  ) => void
  onProjectSelect: (index: number, source: ChangeSource) => void
  onVerticalScroll: (event: UIEvent<HTMLDivElement>, index: number) => void
  presentation: DetailPresentation
  story: ProjectStory
  storyRef: (node: HTMLDivElement | null) => void
}) {
  return (
    <article
      aria-hidden={!active}
      aria-label={`${story.title} project story`}
      className={styles.projectSlide}
      inert={!active}
      style={storyStyle(story)}
    >
      <div
        aria-label={`${story.title} vertical project story.`}
        className={styles.verticalStory}
        data-presentation={presentation}
        data-story={story.id}
        id={`project-story-${story.id}`}
        onKeyDown={(event) => onHorizontalKey(event, index)}
        onScroll={(event) => onVerticalScroll(event, index)}
        ref={storyRef}
        role="region"
        tabIndex={active ? 0 : -1}
      >
        <div className={styles.storyHeader}>
          <StoryTitle
            activeIndex={activeIndex}
            onProjectSelect={onProjectSelect}
            story={story}
          />
        </div>

        <div
          className={`${styles.storyChapters} ${
            story.id === 'orgo' ? styles.compactChapters : ''
          }`}
        >
          {story.chapters.map((chapter, chapterIndex) => (
            <StoryMedia
              active={active}
              chapter={chapter}
              compact={story.id === 'orgo'}
              eager={index === 0 && chapterIndex === 0}
              mediaId={`${story.id}-${chapterIndex}`}
              onOpen={onMediaOpen}
              prewarm={
                chapterIndex === 0 &&
                Math.abs(index - activeIndex) === 1
              }
              key={`${story.id}-${chapter.media.src}-${chapterIndex}`}
              story={story}
            />
          ))}
        </div>

        <footer className={styles.storyEnd}>
          <p className={styles.nextCue}>
            {index < STORIES.length - 1
              ? 'Swipe left for the next project'
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

export function CrossAxisProjectRail({
  presentation,
}: {
  presentation: DetailPresentation
}) {
  const [activeIndex, setActiveIndex] = useState(0)
  const [direction, setDirection] = useState<TravelDirection>(1)
  const [changeSource, setChangeSource] =
    useState<ChangeSource>('pointer')
  const [mediaSelection, setMediaSelection] =
    useState<MediaSelection | null>(null)
  const [viewerInstant, setViewerInstant] = useState(false)
  const activeIndexRef = useRef(0)
  const viewerTriggerRef = useRef<HTMLButtonElement | null>(null)
  const rootRef = useRef<HTMLElement>(null)
  const viewportRef = useRef<HTMLDivElement>(null)
  const slideRefs = useRef<Array<HTMLElement | null>>([])
  const storyRefs = useRef<Array<HTMLDivElement | null>>([])
  const scrollbarRef = useRef<HTMLDivElement>(null)
  const scrollbarThumbRef = useRef<HTMLDivElement>(null)
  const scrollbarDragOffsetRef = useRef(0)
  const frameRef = useRef<number | null>(null)
  const snapTimerRef = useRef<number | null>(null)
  const settleFrameRef = useRef<number | null>(null)
  const mobileHeightFrameRef = useRef<number | null>(null)
  const horizontalScrollingRef = useRef(false)
  const settlingHorizontalScrollRef = useRef(false)
  const reducedMotion = useHydrationSafeReducedMotion()

  useEffect(
    () => () => {
      if (frameRef.current !== null) cancelAnimationFrame(frameRef.current)
      if (snapTimerRef.current !== null) window.clearTimeout(snapTimerRef.current)
      if (settleFrameRef.current !== null) {
        cancelAnimationFrame(settleFrameRef.current)
      }
      if (mobileHeightFrameRef.current !== null) {
        cancelAnimationFrame(mobileHeightFrameRef.current)
      }
    },
    [],
  )

  useEffect(() => {
    storyRefs.current.forEach((story) => {
      story?.scrollTo({ behavior: 'auto', top: 0 })
    })
    requestAnimationFrame(() => syncStableScrollbar(activeIndexRef.current))
  }, [presentation])

  useEffect(() => {
    const frame = requestAnimationFrame(() => syncStableScrollbar(activeIndex))
    return () => cancelAnimationFrame(frame)
  }, [activeIndex])

  useEffect(() => {
    const mediaQuery = window.matchMedia('(max-width: 768px)')
    const story = storyRefs.current[activeIndex]

    const requestHeightSync = () => {
      if (!mediaQuery.matches) {
        rootRef.current?.style.removeProperty('--mobile-story-height')
        return
      }
      if (horizontalScrollingRef.current) return
      syncMobileStoryHeight(activeIndexRef.current)
    }

    requestHeightSync()
    const observer = new ResizeObserver(requestHeightSync)
    if (story) observer.observe(story)
    mediaQuery.addEventListener('change', requestHeightSync)

    return () => {
      observer.disconnect()
      mediaQuery.removeEventListener('change', requestHeightSync)
    }
  }, [activeIndex, presentation])

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

  function syncStableScrollbar(index: number) {
    const story = storyRefs.current[index]
    const track = scrollbarRef.current
    const thumb = scrollbarThumbRef.current
    if (!story || !track || !thumb) return

    const maximum = Math.max(0, story.scrollHeight - story.clientHeight)
    const progress = maximum > 0 ? story.scrollTop / maximum : 0
    const thumbHeight =
      maximum > 0
        ? Math.max(40, track.clientHeight * (story.clientHeight / story.scrollHeight))
        : track.clientHeight
    const thumbTravel = Math.max(0, track.clientHeight - thumbHeight)

    thumb.style.height = `${thumbHeight}px`
    thumb.style.transform = `translateY(${progress * thumbTravel}px)`
    track.dataset.scrollable = String(maximum > 0)
    track.setAttribute('aria-valuenow', String(Math.round(progress * 100)))
    track.setAttribute(
      'aria-valuetext',
      maximum > 0 ? `${Math.round(progress * 100)}% scrolled` : 'No scrolling needed',
    )
  }

  function seekStableScrollbar(clientY: number) {
    const story = storyRefs.current[activeIndexRef.current]
    const track = scrollbarRef.current
    const thumb = scrollbarThumbRef.current
    if (!story || !track || !thumb) return

    const maximum = Math.max(0, story.scrollHeight - story.clientHeight)
    const trackBounds = track.getBoundingClientRect()
    const thumbHeight = thumb.getBoundingClientRect().height
    const thumbTravel = Math.max(0, trackBounds.height - thumbHeight)
    if (maximum === 0 || thumbTravel === 0) return

    const thumbTop = Math.max(
      0,
      Math.min(
        thumbTravel,
        clientY - trackBounds.top - scrollbarDragOffsetRef.current,
      ),
    )
    story.scrollTop = (thumbTop / thumbTravel) * maximum
  }

  function handleScrollbarPointerDown(event: ReactPointerEvent<HTMLDivElement>) {
    const thumb = scrollbarThumbRef.current
    if (!thumb || scrollbarRef.current?.dataset.scrollable !== 'true') return

    const thumbBounds = thumb.getBoundingClientRect()
    scrollbarDragOffsetRef.current =
      event.target === thumb
        ? event.clientY - thumbBounds.top
        : thumbBounds.height / 2
    event.currentTarget.setPointerCapture(event.pointerId)
    seekStableScrollbar(event.clientY)
  }

  function handleScrollbarPointerMove(event: ReactPointerEvent<HTMLDivElement>) {
    if (!event.currentTarget.hasPointerCapture(event.pointerId)) return
    seekStableScrollbar(event.clientY)
  }

  function handleScrollbarKey(event: KeyboardEvent<HTMLDivElement>) {
    const story = storyRefs.current[activeIndexRef.current]
    if (!story) return

    const page = story.clientHeight * 0.85
    const destinations: Record<string, number> = {
      ArrowDown: story.scrollTop + 48,
      ArrowUp: story.scrollTop - 48,
      End: story.scrollHeight,
      Home: 0,
      PageDown: story.scrollTop + page,
      PageUp: story.scrollTop - page,
    }
    const destination = destinations[event.key]
    if (destination === undefined) return

    event.preventDefault()
    story.scrollTo({ behavior: 'auto', top: destination })
  }

  function handleVerticalScroll(
    _event: UIEvent<HTMLDivElement>,
    index: number,
  ) {
    if (index === activeIndexRef.current) syncStableScrollbar(index)
  }

  function updateActive(index: number, source: ChangeSource) {
    const nextIndex = Math.max(0, Math.min(STORIES.length - 1, index))
    const previous = activeIndexRef.current
    if (nextIndex === previous) return

    setDirection(nextIndex > previous ? 1 : -1)
    setChangeSource(source)
    activeIndexRef.current = nextIndex
    setActiveIndex(nextIndex)
  }

  function syncMobileStoryHeight(index: number) {
    if (mobileHeightFrameRef.current !== null) {
      cancelAnimationFrame(mobileHeightFrameRef.current)
    }

    mobileHeightFrameRef.current = requestAnimationFrame(() => {
      mobileHeightFrameRef.current = null
      const root = rootRef.current
      if (!root) return
      if (!window.matchMedia('(max-width: 768px)').matches) {
        root.style.removeProperty('--mobile-story-height')
        return
      }
      if (horizontalScrollingRef.current) return

      const story = storyRefs.current[index]
      if (!story) return
      root.style.setProperty(
        '--mobile-story-height',
        `${Math.ceil(story.getBoundingClientRect().height)}px`,
      )
    })
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

    if (source === 'keyboard') {
      requestAnimationFrame(() => {
        storyRefs.current[nextIndex]?.focus({ preventScroll: true })
      })
    }
  }

  function nearestProjectIndex(viewport: HTMLDivElement) {
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

    return nearest
  }

  function settleHorizontalScroll(viewport: HTMLDivElement) {
    if (snapTimerRef.current !== null) {
      window.clearTimeout(snapTimerRef.current)
      snapTimerRef.current = null
    }
    if (settlingHorizontalScrollRef.current) return

    const nearest = nearestProjectIndex(viewport)
    const target = slideRefs.current[nearest]
    if (!target) return

    settlingHorizontalScrollRef.current = true
    if (Math.abs(viewport.scrollLeft - target.offsetLeft) > 0.5) {
      viewport.scrollTo({
        behavior: 'auto',
        left: target.offsetLeft,
      })
    }

    updateActive(nearest, 'scroll')
    settleFrameRef.current = requestAnimationFrame(() => {
      settleFrameRef.current = null
      settlingHorizontalScrollRef.current = false
      horizontalScrollingRef.current = false
      syncMobileStoryHeight(nearest)
    })
  }

  function handleHorizontalScroll(event: UIEvent<HTMLDivElement>) {
    if (settlingHorizontalScrollRef.current) return
    if (frameRef.current !== null) cancelAnimationFrame(frameRef.current)
    if (snapTimerRef.current !== null) window.clearTimeout(snapTimerRef.current)
    const viewport = event.currentTarget
    horizontalScrollingRef.current = true

    frameRef.current = requestAnimationFrame(() => {
      updateActive(nearestProjectIndex(viewport), 'scroll')
      frameRef.current = null
    })

    snapTimerRef.current = window.setTimeout(
      () => settleHorizontalScroll(viewport),
      120,
    )
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
  }

  function openMedia(
    selection: MediaSelection,
    trigger: HTMLButtonElement,
    keyboard: boolean,
  ) {
    viewerTriggerRef.current = trigger
    setViewerInstant(Boolean(reducedMotion) || keyboard)
    setMediaSelection(selection)
  }

  function closeMedia(keyboard: boolean) {
    setViewerInstant(Boolean(reducedMotion) || keyboard)
    setMediaSelection(null)
  }

  useEffect(() => {
    const viewport = viewportRef.current
    if (!viewport) return

    const handleScrollEnd = () => settleHorizontalScroll(viewport)
    viewport.addEventListener('scrollend', handleScrollEnd)
    return () => viewport.removeEventListener('scrollend', handleScrollEnd)
  }, [])

  return (
    <LayoutGroup id="project-media-viewer">
      <section
        aria-label="Selected projects"
        className={styles.root}
        data-presentation={presentation}
        ref={rootRef}
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
                  active={index === activeIndex && !mediaSelection}
                  activeIndex={activeIndex}
                  index={index}
                  onHorizontalKey={(event, currentIndex) =>
                    handleHorizontalKey(event, currentIndex, false)
                  }
                  onMediaOpen={openMedia}
                  onProjectSelect={goTo}
                  onVerticalScroll={handleVerticalScroll}
                  presentation={presentation}
                  story={story}
                  storyRef={(node) => {
                    storyRefs.current[index] = node
                  }}
                />
              </div>
            ))}
          </div>
        </div>

        <div
          aria-controls={`project-story-${activeStory.id}`}
          aria-label={`Scroll ${activeStory.title}`}
          aria-orientation="vertical"
          aria-valuemax={100}
          aria-valuemin={0}
          aria-valuenow={0}
          className={styles.stableScrollbar}
          onKeyDown={handleScrollbarKey}
          onPointerDown={handleScrollbarPointerDown}
          onPointerMove={handleScrollbarPointerMove}
          ref={scrollbarRef}
          role="scrollbar"
          tabIndex={mediaSelection ? -1 : 0}
        >
          <div className={styles.stableScrollbarThumb} ref={scrollbarThumbRef} />
        </div>
      </section>

      <MediaViewer
        instant={viewerInstant}
        onClose={closeMedia}
        onExitComplete={() => {
          const trigger = viewerTriggerRef.current
          const restoreFocus = () => {
            if (trigger?.closest('[inert]')) {
              requestAnimationFrame(restoreFocus)
              return
            }
            trigger?.focus({ preventScroll: true })
            viewerTriggerRef.current = null
          }
          requestAnimationFrame(restoreFocus)
        }}
        selection={mediaSelection}
      />
    </LayoutGroup>
  )
}
