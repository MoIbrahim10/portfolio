import { AnimatePresence, motion, useReducedMotion } from 'motion/react'
import {
  type CSSProperties,
  type KeyboardEvent as ReactKeyboardEvent,
  type MouseEvent as ReactMouseEvent,
  useEffect,
  useId,
  useRef,
  useState,
} from 'react'

import { AnimatedLogo } from '../../../brand/AnimatedLogo'
import { CutCornerButton } from '../../../project-lab/shared/CutCornerButton'
import {
  PORTFOLIO_BIO,
  PORTFOLIO_LINKS,
  PORTFOLIO_PROJECTS,
  type PortfolioMedia,
  type PortfolioProject,
} from '../../shared/portfolio-data'

import styles from './styles.module.css'

const EASE = [0.22, 1, 0.36, 1] as const

type ImageState = 'error' | 'loaded' | 'loading'
type ViewName = 'desktop' | 'mobile'

interface PaneStyle extends CSSProperties {
  '--project-accent': string
  '--queue-row'?: number
}

interface ProjectPaneProps {
  active: boolean
  buttonRef: (button: HTMLButtonElement | null) => void
  detailId: string
  failedImages: Set<string>
  galleryIndex: number
  index: number
  instantLayout: boolean
  loadedImages: Set<string>
  onGallerySelect: (index: number) => void
  onImageError: (src: string) => void
  onImageLoad: (src: string) => void
  onKeyDown: (
    event: ReactKeyboardEvent<HTMLButtonElement>,
    index: number,
    view: ViewName,
  ) => void
  onSelect: (
    index: number,
    trigger: HTMLButtonElement,
    instant: boolean,
  ) => void
  project: PortfolioProject
  queueRow?: number
  slot: number
  view: ViewName
}

interface ProjectImageProps {
  eager?: boolean
  failedImages: Set<string>
  loadedImages: Set<string>
  media: PortfolioMedia
  onError: (src: string) => void
  onLoad: (src: string) => void
  transitionKey?: string
}

function ProjectImage({
  eager = false,
  failedImages,
  loadedImages,
  media,
  onError,
  onLoad,
  transitionKey = media.src,
}: ProjectImageProps) {
  const shouldReduceMotion = useReducedMotion()
  const state: ImageState = failedImages.has(media.src)
    ? 'error'
    : loadedImages.has(media.src)
      ? 'loaded'
      : 'loading'

  return (
    <div
      className={styles.media}
      data-image-state={state}
      style={{ aspectRatio: `${media.width} / ${media.height}` }}
    >
      <AnimatePresence initial={false} mode="wait">
        {!failedImages.has(media.src) ? (
          <motion.img
            alt={media.alt}
            animate={{ opacity: loadedImages.has(media.src) ? 1 : 0 }}
            className={styles.mediaImage}
            decoding="async"
            exit={{ opacity: 0 }}
            height={media.height}
            initial={{ opacity: 0 }}
            key={transitionKey}
            loading={eager ? 'eager' : 'lazy'}
            onError={() => onError(media.src)}
            onLoad={() => onLoad(media.src)}
            src={media.src}
            transition={{ duration: shouldReduceMotion ? 0 : 0.14 }}
            width={media.width}
          />
        ) : (
          <p className={styles.imageError} key={`${transitionKey}-error`}>
            Preview unavailable.
          </p>
        )}
      </AnimatePresence>
      {state === 'loading' ? (
        <span className={styles.loadingLabel} aria-hidden="true">
          Loading preview…
        </span>
      ) : null}
    </div>
  )
}

function ProjectDetails({
  detailId,
  failedImages,
  galleryIndex,
  loadedImages,
  onGallerySelect,
  onImageError,
  onImageLoad,
  project,
  shouldReduceMotion,
}: {
  detailId: string
  failedImages: Set<string>
  galleryIndex: number
  loadedImages: Set<string>
  onGallerySelect: (index: number) => void
  onImageError: (src: string) => void
  onImageLoad: (src: string) => void
  project: PortfolioProject
  shouldReduceMotion: boolean
}) {
  return (
    <motion.div
      animate={{ opacity: 1, scaleY: 1 }}
      className={styles.detailTray}
      exit={{ opacity: 0, scaleY: shouldReduceMotion ? 1 : 0.98 }}
      id={detailId}
      initial={{
        opacity: 0,
        scaleY: shouldReduceMotion ? 1 : 0.94,
      }}
      transition={{ duration: shouldReduceMotion ? 0 : 0.24, ease: EASE }}
    >
      <p className={styles.description}>{project.description}</p>

      {project.media.length > 1 ? (
        <div className={styles.gallery} aria-label={`${project.title} gallery`}>
          <p className={styles.trayLabel}>Gallery</p>
          <div className={styles.galleryRail}>
            {project.media.map((media, index) => (
              <button
                aria-label={`Show ${media.alt}`}
                aria-pressed={galleryIndex === index}
                className={styles.galleryButton}
                key={media.src}
                onClick={() => onGallerySelect(index)}
                type="button"
              >
                <ProjectImage
                  failedImages={failedImages}
                  loadedImages={loadedImages}
                  media={media}
                  onError={onImageError}
                  onLoad={onImageLoad}
                  transitionKey={`${project.id}-gallery-${index}`}
                />
              </button>
            ))}
          </div>
        </div>
      ) : null}

      {project.collaborators.length > 0 ? (
        <div className={styles.collaborators}>
          <p className={styles.trayLabel}>Collaborators</p>
          <p>{project.collaborators.join(', ')}</p>
        </div>
      ) : null}

      {project.liveHref || project.repositoryHref ? (
        <div className={styles.projectLinks}>
          {project.liveHref ? (
            <CutCornerButton href={project.liveHref} variant="gold">
              View live project
            </CutCornerButton>
          ) : null}
          {project.repositoryHref ? (
            <a className={styles.repositoryLink} href={project.repositoryHref}>
              View repository
            </a>
          ) : null}
        </div>
      ) : null}
    </motion.div>
  )
}

function ProjectPane({
  active,
  buttonRef,
  detailId,
  failedImages,
  galleryIndex,
  index,
  instantLayout,
  loadedImages,
  onGallerySelect,
  onImageError,
  onImageLoad,
  onKeyDown,
  onSelect,
  project,
  queueRow,
  slot,
  view,
}: ProjectPaneProps) {
  const shouldReduceMotion = useReducedMotion()
  const media = project.media[active ? galleryIndex : 0]
  const paneStyle: PaneStyle = {
    '--project-accent': project.accent,
    ...(queueRow === undefined ? {} : { '--queue-row': queueRow }),
  }
  const paneClasses = [
    styles.projectPane,
    styles[`slot${slot}`],
    active ? styles.isActive : '',
    queueRow === undefined ? '' : styles.isQueued,
  ]
    .filter(Boolean)
    .join(' ')

  return (
    <motion.article
      animate={{ opacity: 1, y: 0 }}
      className={paneClasses}
      initial={shouldReduceMotion ? false : { opacity: 0, y: 12 }}
      layout
      style={paneStyle}
      transition={{
        delay:
          shouldReduceMotion || instantLayout
            ? 0
            : Math.min(index * 0.022, 0.11),
        duration: shouldReduceMotion || instantLayout ? 0 : 0.36,
        ease: EASE,
      }}
    >
      <motion.button
        aria-controls={active ? detailId : undefined}
        aria-current={active ? 'true' : undefined}
        aria-expanded={active}
        aria-label={`Open details for ${project.title}`}
        className={styles.mediaButton}
        onClick={(event: ReactMouseEvent<HTMLButtonElement>) =>
          onSelect(index, event.currentTarget, event.detail === 0)
        }
        onKeyDown={(event) => onKeyDown(event, index, view)}
        ref={buttonRef}
        type="button"
        whileHover={shouldReduceMotion ? undefined : { y: -3 }}
        whileTap={shouldReduceMotion ? undefined : { scale: 0.992 }}
      >
        <ProjectImage
          eager={index === 0}
          failedImages={failedImages}
          loadedImages={loadedImages}
          media={media}
          onError={onImageError}
          onLoad={onImageLoad}
          transitionKey={`${view}-${project.id}-${galleryIndex}`}
        />
      </motion.button>

      <div className={styles.projectMeta}>
        <span>{String(index + 1).padStart(2, '0')}</span>
        <h3>{project.title}</h3>
      </div>

      <AnimatePresence initial={false}>
        {active ? (
          <ProjectDetails
            detailId={detailId}
            failedImages={failedImages}
            galleryIndex={galleryIndex}
            loadedImages={loadedImages}
            onGallerySelect={onGallerySelect}
            onImageError={onImageError}
            onImageLoad={onImageLoad}
            project={project}
            shouldReduceMotion={Boolean(shouldReduceMotion)}
          />
        ) : null}
      </AnimatePresence>
    </motion.article>
  )
}

export function PortfolioChromaticDesktop() {
  const shouldReduceMotion = useReducedMotion()
  const detailsId = useId()
  const projects = PORTFOLIO_PROJECTS
  const [activeIndex, setActiveIndex] = useState<number | null>(null)
  const [galleryIndex, setGalleryIndex] = useState(0)
  const [instantLayout, setInstantLayout] = useState(false)
  const [loadedImages, setLoadedImages] = useState<Set<string>>(() => new Set())
  const [failedImages, setFailedImages] = useState<Set<string>>(() => new Set())
  const [announcement, setAnnouncement] = useState('Workspace overview.')
  const desktopButtonRefs = useRef<Array<HTMLButtonElement | null>>([])
  const mobileButtonRefs = useRef<Array<HTMLButtonElement | null>>([])
  const triggerRef = useRef<HTMLButtonElement | null>(null)

  const mobileActiveIndex = activeIndex ?? 0
  const mobileProject = projects[mobileActiveIndex]

  useEffect(() => {
    if (activeIndex === null) return

    function onEscape(event: KeyboardEvent) {
      if (event.key !== 'Escape') return
      event.preventDefault()
      returnToOverview()
    }

    document.addEventListener('keydown', onEscape)
    return () => document.removeEventListener('keydown', onEscape)
  }, [activeIndex])

  function markImageLoaded(src: string) {
    setLoadedImages((current) => new Set(current).add(src))
  }

  function markImageFailed(src: string) {
    setFailedImages((current) => new Set(current).add(src))
  }

  function selectProject(
    index: number,
    trigger: HTMLButtonElement,
    instant: boolean,
  ) {
    triggerRef.current = trigger
    setInstantLayout(instant)
    setGalleryIndex(0)
    setActiveIndex(index)
    setAnnouncement(`${projects[index].title} details opened.`)
  }

  function returnToOverview() {
    const focusTarget = triggerRef.current
    setInstantLayout(false)
    setActiveIndex(null)
    setGalleryIndex(0)
    setAnnouncement('Workspace overview restored.')
    window.setTimeout(
      () => focusTarget?.focus(),
      shouldReduceMotion ? 0 : 270,
    )
  }

  function focusProject(
    index: number,
    view: ViewName,
  ) {
    const destination = Math.max(0, Math.min(projects.length - 1, index))
    const refs = view === 'desktop' ? desktopButtonRefs : mobileButtonRefs
    refs.current[destination]?.focus()
  }

  function onProjectKeyDown(
    event: ReactKeyboardEvent<HTMLButtonElement>,
    index: number,
    view: ViewName,
  ) {
    const destinations: Record<string, number> = {
      ArrowLeft: index - 1,
      ArrowRight: index + 1,
      End: projects.length - 1,
      Home: 0,
    }
    const destination = destinations[event.key]
    if (destination === undefined) return
    event.preventDefault()
    focusProject(destination, view)
  }

  return (
    <div className={styles.page} id="chromatic-start">
      <header className={styles.masthead}>
        <div className={styles.shell}>
          <a className={styles.logoLink} href="/" aria-label="Homepage">
            <AnimatedLogo animateOnMount={false} className={styles.headerLogo} />
          </a>
          <nav className={styles.headerLinks} aria-label="Portfolio links">
            <a href={PORTFOLIO_LINKS.x}>X</a>
            <a href={PORTFOLIO_LINKS.github}>GitHub</a>
            <CutCornerButton href={PORTFOLIO_LINKS.cal} variant="paper">
              Schedule
            </CutCornerButton>
          </nav>
          <CutCornerButton
            className={styles.mobileSchedule}
            href={PORTFOLIO_LINKS.cal}
            variant="paper"
          >
            Schedule
          </CutCornerButton>
        </div>
      </header>

      <main>
        <section className={styles.introduction} aria-labelledby="chromatic-title">
          <div className={styles.shell}>
            <p className={styles.eyebrow}>Independent design engineer · Cairo</p>
            <h1 id="chromatic-title">Useful things, carefully made.</h1>
            <p className={styles.bio}>{PORTFOLIO_BIO}</p>
            <CutCornerButton href={PORTFOLIO_LINKS.cal} variant="navy">
              Schedule a call
            </CutCornerButton>
          </div>
        </section>

        <section className={styles.work} aria-labelledby="chromatic-work-title">
          <div className={styles.shell}>
            <div className={styles.workHeading}>
              <div>
                <p className={styles.sectionLabel}>01 / Portfolio</p>
                <h2 id="chromatic-work-title">Selected work</h2>
              </div>
              <p className={styles.instruction}>
                Choose a pane · arrows move · Enter opens
              </p>
              {activeIndex !== null ? (
                <button
                  className={styles.overviewButton}
                  onClick={returnToOverview}
                  type="button"
                >
                  Overview
                </button>
              ) : null}
            </div>

            {projects.length > 0 ? (
              <>
                <motion.div
                  animate={{ opacity: 1, y: 0 }}
                  className={`${styles.desktopWorkspace} ${
                    activeIndex === null ? '' : styles.hasFocus
                  }`}
                  initial={shouldReduceMotion ? false : { opacity: 0, y: 12 }}
                  transition={{
                    duration: shouldReduceMotion ? 0 : 0.32,
                    ease: EASE,
                  }}
                >
                  {projects.map((project, index) => {
                    const queueIndex =
                      activeIndex === null
                        ? undefined
                        : index < activeIndex
                          ? index
                          : index > activeIndex
                            ? index - 1
                            : undefined

                    return (
                      <ProjectPane
                        active={activeIndex === index}
                        buttonRef={(button) => {
                          desktopButtonRefs.current[index] = button
                        }}
                        detailId={`${detailsId}-desktop-${project.id}`}
                        failedImages={failedImages}
                        galleryIndex={galleryIndex}
                        index={index}
                        instantLayout={instantLayout}
                        key={project.id}
                        loadedImages={loadedImages}
                        onGallerySelect={setGalleryIndex}
                        onImageError={markImageFailed}
                        onImageLoad={markImageLoaded}
                        onKeyDown={onProjectKeyDown}
                        onSelect={selectProject}
                        project={project}
                        queueRow={
                          queueIndex === undefined ? undefined : queueIndex * 2 + 1
                        }
                        slot={index}
                        view="desktop"
                      />
                    )
                  })}
                </motion.div>

                <div className={styles.mobileWorkspace}>
                  <ProjectPane
                    active={activeIndex !== null}
                    buttonRef={(button) => {
                      mobileButtonRefs.current[mobileActiveIndex] = button
                    }}
                    detailId={`${detailsId}-mobile-${mobileProject.id}`}
                    failedImages={failedImages}
                    galleryIndex={galleryIndex}
                    index={mobileActiveIndex}
                    instantLayout={instantLayout}
                    loadedImages={loadedImages}
                    onGallerySelect={setGalleryIndex}
                    onImageError={markImageFailed}
                    onImageLoad={markImageLoaded}
                    onKeyDown={onProjectKeyDown}
                    onSelect={selectProject}
                    project={mobileProject}
                    slot={mobileActiveIndex}
                    view="mobile"
                  />
                  <nav
                    className={styles.mobileProjectRail}
                    aria-label="Choose a project"
                  >
                    {projects.map((project, index) => {
                      const media = project.media[0]
                      return (
                        <button
                          aria-current={mobileActiveIndex === index ? 'true' : undefined}
                          aria-label={`Open ${project.title}`}
                          className={styles.mobileThumbnail}
                          key={project.id}
                          onClick={(event) =>
                            selectProject(
                              index,
                              event.currentTarget,
                              event.detail === 0,
                            )
                          }
                          onKeyDown={(event) =>
                            onProjectKeyDown(event, index, 'mobile')
                          }
                          ref={(button) => {
                            mobileButtonRefs.current[index] = button
                          }}
                          style={
                            {
                              '--project-accent': project.accent,
                            } as PaneStyle
                          }
                          type="button"
                        >
                          <ProjectImage
                            failedImages={failedImages}
                            loadedImages={loadedImages}
                            media={media}
                            onError={markImageFailed}
                            onLoad={markImageLoaded}
                            transitionKey={`mobile-thumb-${project.id}`}
                          />
                          <span>{String(index + 1).padStart(2, '0')}</span>
                        </button>
                      )
                    })}
                  </nav>
                </div>
              </>
            ) : (
              <div className={styles.emptyState}>
                <p>Projects are being prepared.</p>
              </div>
            )}

            <p className={styles.liveRegion} aria-live="polite">
              {announcement}
            </p>
          </div>
        </section>

        <section className={styles.contact} aria-labelledby="chromatic-contact-title">
          <div className={styles.shell}>
            <div className={styles.contactLine}>
              <h2 id="chromatic-contact-title">
                Available for thoughtful product collaborations.
              </h2>
              <nav aria-label="Contact links">
                <a href={PORTFOLIO_LINKS.x}>X</a>
                <a href={PORTFOLIO_LINKS.github}>GitHub</a>
                <CutCornerButton href={PORTFOLIO_LINKS.cal} variant="navy">
                  Schedule
                </CutCornerButton>
              </nav>
            </div>
          </div>
        </section>
      </main>

      <footer className={styles.footer}>
        <div className={styles.shell}>
          <div className={styles.footerIdentity}>
            <AnimatedLogo
              animateOnMount={false}
              className={styles.footerLogo}
              label="MO portfolio mark"
            />
            <p>Mo Ibrahim · Design and code with care.</p>
          </div>
          <p>{new Date().getFullYear()} · Cairo, Egypt</p>
          <a href="#chromatic-start">Back to start</a>
        </div>
      </footer>
    </div>
  )
}
