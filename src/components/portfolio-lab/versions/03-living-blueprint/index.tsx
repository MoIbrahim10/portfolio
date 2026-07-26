import { AnimatePresence, motion, useReducedMotion } from 'motion/react'
import {
  type CSSProperties,
  type KeyboardEvent as ReactKeyboardEvent,
  useCallback,
  useEffect,
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
const STEP_PATTERN = [0, 7, 14, 21, 14, 7]

interface ProjectImageProps {
  eager?: boolean
  failedImages: Set<string>
  loadedImages: Set<string>
  media: PortfolioMedia
  onError: (src: string) => void
  onLoad: (src: string) => void
}

function ProjectImage({
  eager = false,
  failedImages,
  loadedImages,
  media,
  onError,
  onLoad,
}: ProjectImageProps) {
  const hasFailed = failedImages.has(media.src)
  const hasLoaded = loadedImages.has(media.src)

  return (
    <span className={styles.imageFrame}>
      {!hasLoaded && !hasFailed ? (
        <span className={styles.imageSkeleton} aria-hidden="true">
          <span />
          <span />
        </span>
      ) : null}
      {hasFailed ? (
        <span className={styles.imageFallback} role="img" aria-label={media.alt}>
          <span aria-hidden="true">×</span>
          Image unavailable
        </span>
      ) : (
        <img
          alt={media.alt}
          decoding="async"
          height={media.height}
          loading={eager ? 'eager' : 'lazy'}
          onError={() => onError(media.src)}
          onLoad={() => onLoad(media.src)}
          src={media.src}
          width={media.width}
        />
      )}
    </span>
  )
}

function projectStyle(project: PortfolioProject, index: number) {
  return {
    '--project-accent': project.accent,
    '--sheet-step': `${STEP_PATTERN[index] ?? 0}%`,
  } as CSSProperties
}

export function PortfolioLivingBlueprint() {
  const shouldReduceMotion = useReducedMotion()
  const projects = PORTFOLIO_PROJECTS
  const [openIndex, setOpenIndex] = useState<number | null>(null)
  const [selectedMedia, setSelectedMedia] = useState(0)
  const [instantTransition, setInstantTransition] = useState(false)
  const [loadedImages, setLoadedImages] = useState<Set<string>>(() => new Set())
  const [failedImages, setFailedImages] = useState<Set<string>>(() => new Set())
  const projectButtons = useRef<Array<HTMLButtonElement | null>>([])
  const detailHeadings = useRef<Array<HTMLHeadingElement | null>>([])
  const detailLayers = useRef<Array<HTMLElement | null>>([])
  const restoreFocusIndex = useRef<number | null>(null)

  const markLoaded = useCallback((src: string) => {
    setLoadedImages((current) => new Set(current).add(src))
  }, [])

  const markFailed = useCallback((src: string) => {
    setFailedImages((current) => new Set(current).add(src))
  }, [])

  const closeProject = useCallback((instant = false) => {
    setInstantTransition(instant)
    setOpenIndex(null)

    const index = restoreFocusIndex.current
    if (index !== null) {
      requestAnimationFrame(() => projectButtons.current[index]?.focus())
    }
  }, [])

  useEffect(() => {
    if (openIndex === null) return

    const frame = requestAnimationFrame(() => {
      detailHeadings.current[openIndex]?.focus({ preventScroll: true })
      detailLayers.current[openIndex]?.scrollIntoView({
        behavior:
          shouldReduceMotion || instantTransition ? 'auto' : 'smooth',
        block: 'nearest',
      })
    })

    function onEscape(event: KeyboardEvent) {
      if (event.key !== 'Escape') return
      event.preventDefault()
      closeProject(true)
    }

    document.addEventListener('keydown', onEscape)
    return () => {
      cancelAnimationFrame(frame)
      document.removeEventListener('keydown', onEscape)
    }
  }, [closeProject, instantTransition, openIndex, shouldReduceMotion])

  function openProject(index: number, instant = false) {
    restoreFocusIndex.current = index
    setSelectedMedia(0)
    setInstantTransition(instant)
    setOpenIndex(index)
  }

  function toggleProject(index: number, instant = false) {
    if (openIndex === index) {
      closeProject(instant)
      return
    }
    openProject(index, instant)
  }

  function focusProject(index: number) {
    const nextIndex = Math.max(0, Math.min(projects.length - 1, index))
    projectButtons.current[nextIndex]?.focus()
    projectButtons.current[nextIndex]?.scrollIntoView({
      behavior: 'auto',
      block: 'center',
    })
  }

  function onProjectKeyDown(
    event: ReactKeyboardEvent<HTMLButtonElement>,
    index: number,
  ) {
    const destinations: Record<string, number> = {
      ArrowDown: index + 1,
      ArrowLeft: index - 1,
      ArrowRight: index + 1,
      ArrowUp: index - 1,
      End: projects.length - 1,
      Home: 0,
    }

    if (event.key in destinations) {
      event.preventDefault()
      focusProject(destinations[event.key])
      return
    }

    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault()
      toggleProject(index, true)
    }
  }

  const motionEnabled = !shouldReduceMotion && !instantTransition

  return (
    <div className={styles.page}>
      <header className={styles.header}>
        <a className={styles.logoLink} href="/" aria-label="Go to portfolio home">
          <AnimatedLogo
            animateOnMount={false}
            className={styles.logo}
            label="MO portfolio mark"
          />
        </a>

        <nav className={styles.headerNav} aria-label="Primary">
          <a href={PORTFOLIO_LINKS.x}>X</a>
          <a href={PORTFOLIO_LINKS.github}>GitHub</a>
          <CutCornerButton href={PORTFOLIO_LINKS.cal} variant="navy">
            Schedule
          </CutCornerButton>
        </nav>
      </header>

      <main>
        <section className={styles.hero} aria-labelledby="living-blueprint-title">
          <div>
            <p className={styles.eyebrow}>03 / Living Blueprint</p>
            <h1 id="living-blueprint-title">Built carefully. Read clearly.</h1>
          </div>
          <div className={styles.heroCopy}>
            <p>{PORTFOLIO_BIO}</p>
            <CutCornerButton href={PORTFOLIO_LINKS.cal} variant="paper">
              Schedule a call
            </CutCornerButton>
          </div>
        </section>

        <section className={styles.projects} aria-labelledby="selected-work-title">
          <div className={styles.sectionHeading}>
            <div>
              <p className={styles.sectionNumber}>01 / 03</p>
              <h2 id="selected-work-title">Selected work</h2>
            </div>
            <p>Choose a project to unfold its plan.</p>
          </div>

          {projects.length === 0 ? (
            <div className={styles.emptyState}>
              <span aria-hidden="true" />
              <p>Projects are being prepared.</p>
            </div>
          ) : (
            <div className={styles.plan}>
              <span className={styles.datumLine} aria-hidden="true" />
              {projects.map((project, index) => {
                const isOpen = openIndex === index
                const activeMedia = project.media[selectedMedia] ?? project.media[0]
                const primaryHref = project.liveHref ?? project.repositoryHref
                const secondaryHref =
                  project.liveHref && project.repositoryHref
                    ? project.repositoryHref
                    : undefined

                return (
                  <motion.article
                    className={styles.project}
                    key={project.id}
                    layout={motionEnabled ? 'position' : false}
                    style={projectStyle(project, index)}
                  >
                    <motion.div
                      className={styles.sheetPosition}
                      initial={
                        shouldReduceMotion
                          ? false
                          : { opacity: 0, transform: 'translateY(12px)' }
                      }
                      whileInView={{ opacity: 1, transform: 'translateY(0px)' }}
                      viewport={{ amount: 0.18, once: true }}
                      transition={{
                        delay: Math.min(index * 0.024, 0.12),
                        duration: 0.32,
                        ease: EASE,
                      }}
                    >
                      <button
                        aria-controls={`project-plan-${project.id}`}
                        aria-expanded={isOpen}
                        aria-label={`${isOpen ? 'Close' : 'Open'} ${project.title} project details`}
                        className={styles.projectButton}
                        onClick={() => toggleProject(index)}
                        onKeyDown={(event) => onProjectKeyDown(event, index)}
                        ref={(element) => {
                          projectButtons.current[index] = element
                        }}
                        type="button"
                      >
                        <ProjectImage
                          eager={index === 0}
                          failedImages={failedImages}
                          loadedImages={loadedImages}
                          media={project.media[0]}
                          onError={markFailed}
                          onLoad={markLoaded}
                        />
                        <span className={styles.activeEdge} aria-hidden="true" />
                      </button>

                      <div className={styles.sheetCaption}>
                        <span>{String(index + 1).padStart(2, '0')}</span>
                        <h3>{project.title}</h3>
                        <span>{isOpen ? 'Plan open' : 'View plan'}</span>
                      </div>
                    </motion.div>

                    <AnimatePresence initial={false}>
                      {isOpen ? (
                        <motion.section
                          animate={{ opacity: 1, transform: 'translateY(0px)' }}
                          aria-labelledby={`project-plan-title-${project.id}`}
                          className={styles.detailLayer}
                          exit={
                            motionEnabled
                              ? {
                                  opacity: 0,
                                  transform: 'translateY(-4px)',
                                }
                              : undefined
                          }
                          id={`project-plan-${project.id}`}
                          initial={
                            motionEnabled
                              ? {
                                  opacity: 0,
                                  transform: 'translateY(8px)',
                                }
                              : false
                          }
                          key={`${project.id}-detail`}
                          ref={(element) => {
                            detailLayers.current[index] = element
                          }}
                          transition={{ duration: 0.28, ease: EASE }}
                        >
                          <div className={styles.detailRule} aria-hidden="true" />
                          <div className={styles.detailHeader}>
                            <div>
                              <p>
                                Project plan / {String(index + 1).padStart(2, '0')}
                              </p>
                              <h4
                                id={`project-plan-title-${project.id}`}
                                ref={(element) => {
                                  detailHeadings.current[index] = element
                                }}
                                tabIndex={-1}
                              >
                                {project.title}
                              </h4>
                            </div>
                            <button
                              aria-label={`Close ${project.title} project details`}
                              className={styles.closeButton}
                              onClick={() => closeProject()}
                              type="button"
                            >
                              <span aria-hidden="true">×</span>
                              Close
                            </button>
                          </div>

                          <div className={styles.detailGrid}>
                            <div className={styles.gallery}>
                              <ProjectImage
                                failedImages={failedImages}
                                loadedImages={loadedImages}
                                media={activeMedia}
                                onError={markFailed}
                                onLoad={markLoaded}
                              />

                              {project.media.length > 1 ? (
                                <div
                                  className={styles.thumbnailGrid}
                                  aria-label={`${project.title} gallery`}
                                  role="group"
                                >
                                  {project.media.map((media, mediaIndex) => (
                                    <button
                                      aria-label={`Show image ${mediaIndex + 1} of ${project.media.length}: ${media.alt}`}
                                      aria-pressed={selectedMedia === mediaIndex}
                                      className={styles.thumbnail}
                                      key={media.src}
                                      onClick={() => setSelectedMedia(mediaIndex)}
                                      type="button"
                                    >
                                      <img
                                        alt=""
                                        decoding="async"
                                        height={media.height}
                                        loading="lazy"
                                        onError={() => markFailed(media.src)}
                                        src={media.src}
                                        width={media.width}
                                      />
                                      <span>
                                        {String(mediaIndex + 1).padStart(2, '0')}
                                      </span>
                                    </button>
                                  ))}
                                </div>
                              ) : null}
                            </div>

                            <div className={styles.projectNotes}>
                              <p className={styles.description}>
                                {project.description}
                              </p>

                              {project.collaborators.length > 0 ? (
                                <div className={styles.noteBlock}>
                                  <h5>Collaborators</h5>
                                  <ul>
                                    {project.collaborators.map((collaborator) => (
                                      <li key={collaborator}>{collaborator}</li>
                                    ))}
                                  </ul>
                                </div>
                              ) : null}

                              {primaryHref ? (
                                <div className={styles.actions}>
                                  <CutCornerButton
                                    href={primaryHref}
                                    variant="navy"
                                  >
                                    {project.liveHref
                                      ? 'View live project'
                                      : 'View repository'}
                                  </CutCornerButton>
                                  {secondaryHref ? (
                                    <a
                                      className={styles.secondaryLink}
                                      href={secondaryHref}
                                    >
                                      View repository
                                    </a>
                                  ) : null}
                                </div>
                              ) : null}
                            </div>
                          </div>
                        </motion.section>
                      ) : null}
                    </AnimatePresence>
                  </motion.article>
                )
              })}
            </div>
          )}
        </section>

        <section className={styles.contact} aria-labelledby="contact-title">
          <div>
            <p className={styles.sectionNumber}>02 / 03</p>
            <h2 id="contact-title">
              Available for thoughtful product collaborations.
            </h2>
          </div>
          <div className={styles.contactActions}>
            <a href={PORTFOLIO_LINKS.x}>X</a>
            <a href={PORTFOLIO_LINKS.github}>GitHub</a>
            <CutCornerButton href={PORTFOLIO_LINKS.cal} variant="navy">
              Schedule
            </CutCornerButton>
          </div>
        </section>
      </main>

      <footer className={styles.footer}>
        <div className={styles.footerBrand}>
          <AnimatedLogo
            animateOnMount={false}
            className={styles.footerLogo}
            label="MO portfolio mark"
          />
          <span>Mo Ibrahim · Design and code with care.</span>
        </div>
        <span>{new Date().getFullYear()} · Cairo, Egypt</span>
        <a href="#living-blueprint-title">Back to start</a>
      </footer>
    </div>
  )
}
