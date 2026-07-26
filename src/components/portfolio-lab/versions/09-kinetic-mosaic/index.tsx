import {
  AnimatePresence,
  LayoutGroup,
  motion,
  useReducedMotion,
} from 'motion/react'
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
} from '../../shared/portfolio-data'

import styles from './styles.module.css'

const EASE = [0.22, 1, 0.36, 1] as const
const SPRING = {
  damping: 38,
  mass: 0.8,
  stiffness: 390,
  type: 'spring',
} as const
const REST_POSITIONS = [
  [2, 2],
  [6, 1.5],
  [10, 2],
  [1.5, 6.5],
  [5.5, 6],
  [10, 6.5],
] as const

interface ProjectImageProps {
  eager?: boolean
  failed: Set<string>
  loaded: Set<string>
  media: PortfolioMedia
  natural?: boolean
  onError: (src: string) => void
  onLoad: (src: string) => void
  title: string
}

function ProjectImage({
  eager = false,
  failed,
  loaded,
  media,
  natural = false,
  onError,
  onLoad,
  title,
}: ProjectImageProps) {
  const hasFailed = failed.has(media.src)
  const hasLoaded = loaded.has(media.src)

  return (
    <div
      className={styles.imageFrame}
      style={natural ? { aspectRatio: `${media.width} / ${media.height}` } : undefined}
    >
      {!hasLoaded && !hasFailed ? (
        <span className={styles.imageStatus}>Loading preview</span>
      ) : null}
      {hasFailed ? (
        <span className={styles.imageError}>
          <strong>{title}</strong>
          Preview unavailable.
        </span>
      ) : (
        <img
          alt={media.alt}
          decoding="async"
          fetchPriority={eager ? 'high' : 'auto'}
          height={media.height}
          loading={eager ? 'eager' : 'lazy'}
          onError={() => onError(media.src)}
          onLoad={() => onLoad(media.src)}
          src={media.src}
          width={media.width}
        />
      )}
    </div>
  )
}

export function PortfolioKineticMosaic() {
  const projects = PORTFOLIO_PROJECTS
  const reducedMotion = Boolean(useReducedMotion())
  const [selectedIndex, setSelectedIndex] = useState<number>()
  const [detailsOpen, setDetailsOpen] = useState(false)
  const [loadedImages, setLoadedImages] = useState<Set<string>>(() => new Set())
  const [failedImages, setFailedImages] = useState<Set<string>>(() => new Set())
  const tileRefs = useRef<Array<HTMLButtonElement | null>>([])
  const closeRef = useRef<HTMLButtonElement>(null)
  const detailRef = useRef<HTMLDivElement>(null)
  const detailsTriggerRef = useRef<HTMLButtonElement | null>(null)

  const selectedProject =
    selectedIndex === undefined ? undefined : projects[selectedIndex]

  const markLoaded = useCallback((src: string) => {
    setLoadedImages((current) => new Set(current).add(src))
  }, [])

  const markFailed = useCallback((src: string) => {
    setFailedImages((current) => new Set(current).add(src))
  }, [])

  useEffect(() => {
    const media = selectedProject?.media[1] ?? selectedProject?.media[0]
    if (!media) return
    const preload = document.createElement('link')
    preload.as = 'image'
    preload.href = media.src
    preload.rel = 'preload'
    document.head.append(preload)
    return () => preload.remove()
  }, [selectedProject])

  useEffect(() => {
    if (!detailsOpen) return
    const focusFrame = requestAnimationFrame(() => closeRef.current?.focus())

    function onKeyDown(event: KeyboardEvent) {
      if (event.key === 'Escape') {
        event.preventDefault()
        closeDetails()
        return
      }
      if (event.key !== 'Tab' || !detailRef.current) return

      const controls = Array.from(
        detailRef.current.querySelectorAll<HTMLElement>(
          'a[href], button:not([disabled]), [tabindex]:not([tabindex="-1"])',
        ),
      )
      const first = controls[0]
      const last = controls.at(-1)
      if (!first || !last) return

      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault()
        last.focus()
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault()
        first.focus()
      }
    }

    document.addEventListener('keydown', onKeyDown)
    return () => {
      cancelAnimationFrame(focusFrame)
      document.removeEventListener('keydown', onKeyDown)
    }
  }, [detailsOpen])

  function contactSlot(index: number) {
    if (selectedIndex === undefined || index === selectedIndex) return undefined
    return projects
      .map((_, projectIndex) => projectIndex)
      .filter((projectIndex) => projectIndex !== selectedIndex)
      .indexOf(index)
  }

  function motionDelay(index: number) {
    if (reducedMotion || selectedIndex === undefined) return 0
    const origin = REST_POSITIONS[selectedIndex]
    const destination = REST_POSITIONS[index]
    return Math.hypot(
      origin[0] - destination[0],
      origin[1] - destination[1],
    ) * 0.024
  }

  function selectProject(index: number) {
    setSelectedIndex(index)
  }

  function restoreMosaic() {
    const previous = selectedIndex
    setSelectedIndex(undefined)
    if (previous !== undefined) {
      requestAnimationFrame(() => tileRefs.current[previous]?.focus())
    }
  }

  function openDetails(trigger: HTMLButtonElement) {
    detailsTriggerRef.current = trigger
    setDetailsOpen(true)
  }

  function closeDetails() {
    const trigger = detailsTriggerRef.current
    setDetailsOpen(false)
    window.setTimeout(() => trigger?.focus(), reducedMotion ? 0 : 180)
  }

  function onTileKeyDown(
    event: ReactKeyboardEvent<HTMLButtonElement>,
    index: number,
  ) {
    if (event.key === 'Escape' && selectedIndex !== undefined) {
      event.preventDefault()
      restoreMosaic()
      return
    }
    if (event.key === 'Home' || event.key === 'End') {
      event.preventDefault()
      const destination = event.key === 'Home' ? 0 : projects.length - 1
      tileRefs.current[destination]?.focus()
      return
    }
    if (!event.key.startsWith('Arrow')) return

    const source = tileRefs.current[index]
    if (!source) return
    const sourceRect = source.getBoundingClientRect()
    const sourceX = sourceRect.left + sourceRect.width / 2
    const sourceY = sourceRect.top + sourceRect.height / 2
    const horizontal = event.key === 'ArrowLeft' || event.key === 'ArrowRight'
    const direction =
      event.key === 'ArrowLeft' || event.key === 'ArrowUp' ? -1 : 1

    const destination = tileRefs.current
      .map((node, projectIndex) => {
        if (!node || projectIndex === index) return undefined
        const rect = node.getBoundingClientRect()
        const x = rect.left + rect.width / 2 - sourceX
        const y = rect.top + rect.height / 2 - sourceY
        const primary = horizontal ? x : y
        if (Math.sign(primary) !== direction) return undefined
        return {
          index: projectIndex,
          score: Math.abs(primary) + Math.abs(horizontal ? y : x) * 0.35,
        }
      })
      .filter((candidate): candidate is { index: number; score: number } =>
        Boolean(candidate),
      )
      .sort((left, right) => left.score - right.score)[0]

    if (!destination) return
    event.preventDefault()
    tileRefs.current[destination.index]?.focus()
  }

  const currentYear = new Date().getFullYear()

  return (
    <LayoutGroup>
      <div className={styles.page}>
        <header className={styles.header}>
          <a aria-label="Go to portfolio home" className={styles.logoLink} href="/">
            <AnimatedLogo animateOnMount={false} className={styles.logo} />
          </a>
          <nav aria-label="Portfolio links" className={styles.headerNav}>
            <a href={PORTFOLIO_LINKS.x}>X</a>
            <a href={PORTFOLIO_LINKS.github}>GitHub</a>
            <CutCornerButton href={PORTFOLIO_LINKS.cal} variant="paper">
              Schedule
            </CutCornerButton>
          </nav>
        </header>

        <main>
          <section aria-labelledby="kinetic-title" className={styles.hero}>
            <p className={styles.eyebrow}>Mo Ibrahim · Design engineer</p>
            <h1 id="kinetic-title">Products, arranged with care.</h1>
            <div className={styles.heroAside}>
              <p>{PORTFOLIO_BIO}</p>
              <CutCornerButton href={PORTFOLIO_LINKS.cal} variant="navy">
                Schedule a call
              </CutCornerButton>
            </div>
          </section>

          <motion.section
            animate={{ opacity: 1, y: 0 }}
            aria-labelledby="kinetic-work-title"
            className={styles.work}
            initial={reducedMotion ? false : { opacity: 0.96, y: 6 }}
            transition={{ duration: reducedMotion ? 0.08 : 0.24, ease: EASE }}
          >
            <div className={styles.workHeading}>
              <h2 id="kinetic-work-title">Selected work</h2>
              <button
                className={styles.allProjects}
                disabled={selectedIndex === undefined}
                onClick={restoreMosaic}
                type="button"
              >
                All projects
              </button>
            </div>

            {projects.length > 0 ? (
              <>
                <div className={styles.stage}>
                  <div
                    aria-hidden={detailsOpen ? true : undefined}
                    className={styles.mosaic}
                    inert={detailsOpen ? true : undefined}
                  >
                    {projects.map((project, index) => {
                      const featured = selectedIndex === index
                      const slot = contactSlot(index)
                      const media = project.media[0]
                      if (!media) return null

                      return (
                        <motion.article
                          className={styles.projectArticle}
                          data-contact={slot !== undefined ? true : undefined}
                          data-featured={featured || undefined}
                          data-slot={slot}
                          key={project.id}
                          layout
                          style={
                            {
                              '--project-accent': project.accent,
                            } as CSSProperties
                          }
                          transition={
                            reducedMotion
                              ? { layout: { duration: 0 } }
                              : { layout: { ...SPRING, delay: motionDelay(index) } }
                          }
                        >
                          <motion.button
                            aria-current={featured ? 'true' : undefined}
                            aria-label={`Open ${project.title} project details`}
                            className={styles.projectButton}
                            onClick={(event) => {
                              if (featured) openDetails(event.currentTarget)
                              else selectProject(index)
                            }}
                            onKeyDown={(event) => onTileKeyDown(event, index)}
                            ref={(node) => {
                              tileRefs.current[index] = node
                            }}
                            type="button"
                            whileFocus={reducedMotion ? undefined : { y: -4 }}
                            whileHover={reducedMotion ? undefined : { y: -4 }}
                            whileTap={
                              reducedMotion
                                ? undefined
                                : { scale: 0.995, transition: { duration: 0.07 } }
                            }
                          >
                            <ProjectImage
                              eager={index === 0}
                              failed={failedImages}
                              loaded={loadedImages}
                              media={media}
                              onError={markFailed}
                              onLoad={markLoaded}
                              title={project.title}
                            />
                          </motion.button>
                          <div className={styles.tileCaption}>
                            <span aria-hidden="true" className={styles.accentTick} />
                            <h3>{project.title}</h3>
                            <span>
                              {String(index + 1).padStart(2, '0')}
                            </span>
                          </div>
                        </motion.article>
                      )
                    })}
                  </div>

                  <AnimatePresence>
                    {detailsOpen && selectedProject ? (
                      <motion.div
                        animate={{ opacity: 1 }}
                        aria-labelledby="kinetic-detail-title"
                        aria-modal="true"
                        className={styles.detailLayer}
                        exit={{ opacity: 0 }}
                        initial={{ opacity: 0 }}
                        ref={detailRef}
                        role="dialog"
                        transition={{ duration: reducedMotion ? 0.08 : 0.18 }}
                      >
                        <div className={styles.detailHeader}>
                          <p>
                            {String(projects.indexOf(selectedProject) + 1).padStart(
                              2,
                              '0',
                            )}{' '}
                            /{' '}
                            {String(projects.length).padStart(2, '0')}
                          </p>
                          <button
                            aria-label={`Close ${selectedProject.title} project details`}
                            className={styles.closeButton}
                            onClick={closeDetails}
                            ref={closeRef}
                            type="button"
                          >
                            Close
                          </button>
                          <h2 id="kinetic-detail-title">{selectedProject.title}</h2>
                          <p>{selectedProject.description}</p>
                        </div>

                        <div className={styles.detailMedia}>
                          {selectedProject.media.map((media, mediaIndex) => (
                            <motion.div
                              animate={{ opacity: 1 }}
                              className={styles.detailImage}
                              initial={{ opacity: 0 }}
                              key={media.src}
                              transition={{
                                delay: reducedMotion ? 0 : mediaIndex * 0.024,
                                duration: reducedMotion ? 0.08 : 0.18,
                              }}
                            >
                              <ProjectImage
                                eager={mediaIndex === 0}
                                failed={failedImages}
                                loaded={loadedImages}
                                media={media}
                                natural
                                onError={markFailed}
                                onLoad={markLoaded}
                                title={selectedProject.title}
                              />
                            </motion.div>
                          ))}
                        </div>

                        {selectedProject.collaborators.length > 0 ? (
                          <section className={styles.collaborators}>
                            <h3>Collaborators</h3>
                            <ul>
                              {selectedProject.collaborators.map((collaborator) => (
                                <li key={collaborator}>{collaborator}</li>
                              ))}
                            </ul>
                          </section>
                        ) : null}

                        {selectedProject.liveHref ||
                        selectedProject.repositoryHref ? (
                          <div className={styles.detailActions}>
                            {selectedProject.liveHref ? (
                              <CutCornerButton
                                href={selectedProject.liveHref}
                                variant="gold"
                              >
                                Visit live project
                              </CutCornerButton>
                            ) : null}
                            {selectedProject.repositoryHref ? (
                              <a href={selectedProject.repositoryHref}>
                                View repository
                              </a>
                            ) : null}
                          </div>
                        ) : null}
                      </motion.div>
                    ) : null}
                  </AnimatePresence>
                </div>

                <div className={styles.selectionCaption} aria-live="polite">
                  <div>
                    <span className={styles.locator} />
                    <h3>{selectedProject?.title ?? 'All projects'}</h3>
                    <p className={styles.count}>
                      {selectedIndex === undefined
                        ? `06 / ${String(projects.length).padStart(2, '0')}`
                        : `${String(selectedIndex + 1).padStart(2, '0')} / ${String(projects.length).padStart(2, '0')}`}
                    </p>
                  </div>
                  <p>
                    {selectedProject?.description ??
                      'Six products, composed as one working field.'}
                  </p>
                  {selectedProject ? (
                    <button
                      className={styles.detailsButton}
                      onClick={(event) => openDetails(event.currentTarget)}
                      type="button"
                    >
                      Details
                    </button>
                  ) : null}
                </div>
              </>
            ) : (
              <p className={styles.empty}>Projects are being prepared.</p>
            )}
          </motion.section>

          <section aria-labelledby="kinetic-contact-title" className={styles.contact}>
            <h2 id="kinetic-contact-title">
              Available for thoughtful product collaborations.
            </h2>
            <nav aria-label="Contact links">
              <a href={PORTFOLIO_LINKS.x}>X</a>
              <a href={PORTFOLIO_LINKS.github}>GitHub</a>
              <CutCornerButton href={PORTFOLIO_LINKS.cal} variant="navy">
                Schedule
              </CutCornerButton>
            </nav>
          </section>
        </main>

        <footer className={styles.footer}>
          <a aria-label="Go to portfolio home" className={styles.footerLogoLink} href="/">
            <AnimatedLogo
              animateOnMount={false}
              className={styles.footerLogo}
              label="MO portfolio mark"
            />
          </a>
          <p>Mo Ibrahim · Cairo, Egypt</p>
          <p>{currentYear}</p>
          <a href="#kinetic-title">Back to top</a>
        </footer>
      </div>
    </LayoutGroup>
  )
}
