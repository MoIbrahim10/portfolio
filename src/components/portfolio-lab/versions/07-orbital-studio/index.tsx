import { AnimatePresence, motion, useReducedMotion } from 'motion/react'
import {
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

interface ProjectImageProps {
  eager?: boolean
  failedImages: Set<string>
  loadedImages: Set<string>
  media: PortfolioMedia
  onFailed: (src: string) => void
  onLoaded: (src: string) => void
  title: string
}

function ProjectImage({
  eager = false,
  failedImages,
  loadedImages,
  media,
  onFailed,
  onLoaded,
  title,
}: ProjectImageProps) {
  const failed = failedImages.has(media.src)
  const loaded = loadedImages.has(media.src)

  return (
    <div className={styles.imageFrame}>
      {!loaded && !failed ? (
        <span className={styles.mediaStatus}>Loading preview</span>
      ) : null}
      {failed ? (
        <span className={styles.mediaError}>
          <strong>{title}</strong>
          Preview unavailable
        </span>
      ) : (
        <img
          alt={media.alt}
          decoding="async"
          fetchPriority={eager ? 'high' : 'auto'}
          height={media.height}
          loading={eager ? 'eager' : 'lazy'}
          onError={() => onFailed(media.src)}
          onLoad={() => onLoaded(media.src)}
          src={media.src}
          width={media.width}
        />
      )}
    </div>
  )
}

export function PortfolioOrbitalStudio() {
  const reducedMotion = Boolean(useReducedMotion())
  const projects = PORTFOLIO_PROJECTS
  const [activeIndex, setActiveIndex] = useState(0)
  const [dialAngle, setDialAngle] = useState(-90)
  const [selectedProject, setSelectedProject] = useState<PortfolioProject>()
  const [selectedMedia, setSelectedMedia] = useState(0)
  const [loadedImages, setLoadedImages] = useState<Set<string>>(() => new Set())
  const [failedImages, setFailedImages] = useState<Set<string>>(() => new Set())
  const railRef = useRef<HTMLDivElement>(null)
  const cardRefs = useRef<Array<HTMLButtonElement | null>>([])
  const nodeRefs = useRef<Array<HTMLButtonElement | null>>([])
  const thumbRefs = useRef<Array<HTMLButtonElement | null>>([])
  const drawerRef = useRef<HTMLElement>(null)
  const closeRef = useRef<HTMLButtonElement>(null)
  const triggerRef = useRef<HTMLButtonElement | null>(null)
  const observerFrame = useRef<number | undefined>(undefined)

  const markLoaded = useCallback((src: string) => {
    setLoadedImages((current) => new Set(current).add(src))
  }, [])

  const markFailed = useCallback((src: string) => {
    setFailedImages((current) => new Set(current).add(src))
  }, [])

  useEffect(() => {
    const target = activeIndex * 60 - 90
    setDialAngle((current) => {
      const normalized = ((target - current + 540) % 360) - 180
      return current + normalized
    })
  }, [activeIndex])

  useEffect(() => {
    const rail = railRef.current
    if (!rail || projects.length === 0) return

    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((entry) => entry.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0]
        if (!visible) return
        const index = cardRefs.current.findIndex(
          (card) => card === visible.target,
        )
        if (index < 0) return
        if (observerFrame.current !== undefined) {
          cancelAnimationFrame(observerFrame.current)
        }
        observerFrame.current = requestAnimationFrame(() => {
          setActiveIndex(index)
          window.history.replaceState(
            window.history.state,
            '',
            `#project-${projects[index]?.id}`,
          )
        })
      },
      { root: rail, threshold: [0.35, 0.55, 0.75, 0.9] },
    )

    cardRefs.current.forEach((card) => {
      if (card) observer.observe(card)
    })

    const hashIndex = projects.findIndex(
      (project) => `#project-${project.id}` === window.location.hash,
    )
    const initialFrame = requestAnimationFrame(() => {
      if (hashIndex >= 0) scrollToProject(hashIndex)
    })

    return () => {
      observer.disconnect()
      cancelAnimationFrame(initialFrame)
      if (observerFrame.current !== undefined) {
        cancelAnimationFrame(observerFrame.current)
      }
    }
  }, [projects])

  useEffect(() => {
    if (!selectedProject) return

    const previousOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    const focusFrame = requestAnimationFrame(() => closeRef.current?.focus())

    function onKeyDown(event: KeyboardEvent) {
      if (event.key === 'Escape') {
        event.preventDefault()
        closeProject()
        return
      }
      if (event.key !== 'Tab' || !drawerRef.current) return

      const controls = Array.from(
        drawerRef.current.querySelectorAll<HTMLElement>(
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
      document.body.style.overflow = previousOverflow
      document.removeEventListener('keydown', onKeyDown)
    }
  }, [selectedProject])

  function scrollToProject(index: number, focus?: 'card' | 'node') {
    const destination = Math.max(0, Math.min(projects.length - 1, index))
    setActiveIndex(destination)
    cardRefs.current[destination]?.scrollIntoView({
      behavior: reducedMotion ? 'auto' : 'smooth',
      block: 'nearest',
      inline: 'center',
    })
    if (focus === 'card') cardRefs.current[destination]?.focus()
    if (focus === 'node') nodeRefs.current[destination]?.focus()
  }

  function onIndexKeyDown(
    event: ReactKeyboardEvent<HTMLButtonElement>,
    index: number,
    focus: 'card' | 'node',
  ) {
    let destination: number | undefined
    if (event.key === 'ArrowLeft') destination = index - 1
    if (event.key === 'ArrowRight') destination = index + 1
    if (event.key === 'Home') destination = 0
    if (event.key === 'End') destination = projects.length - 1
    if (destination === undefined) return
    event.preventDefault()
    scrollToProject(destination, focus)
  }

  function openProject(project: PortfolioProject, trigger: HTMLButtonElement) {
    triggerRef.current = trigger
    setSelectedMedia(0)
    setSelectedProject(project)
  }

  function closeProject() {
    const trigger = triggerRef.current
    setSelectedProject(undefined)
    window.setTimeout(() => trigger?.focus(), reducedMotion ? 0 : 230)
  }

  function onThumbnailKeyDown(
    event: ReactKeyboardEvent<HTMLButtonElement>,
    index: number,
  ) {
    if (!selectedProject) return
    let destination: number | undefined
    if (event.key === 'ArrowLeft') destination = index - 1
    if (event.key === 'ArrowRight') destination = index + 1
    if (event.key === 'Home') destination = 0
    if (event.key === 'End') destination = selectedProject.media.length - 1
    if (destination === undefined) return
    event.preventDefault()
    const bounded = Math.max(
      0,
      Math.min(selectedProject.media.length - 1, destination),
    )
    setSelectedMedia(bounded)
    thumbRefs.current[bounded]?.focus()
  }

  const activeProject = projects[activeIndex] ?? projects[0]
  const drawerMedia = selectedProject?.media[selectedMedia]
  const primaryHref =
    selectedProject?.liveHref ?? selectedProject?.repositoryHref
  const primaryLabel = selectedProject?.liveHref
    ? 'Visit live project'
    : 'View repository'
  const secondaryHref =
    selectedProject?.liveHref && selectedProject.repositoryHref
      ? selectedProject.repositoryHref
      : undefined
  const currentYear = new Date().getFullYear()

  return (
    <div className={styles.page}>
      <div
        aria-hidden={selectedProject ? true : undefined}
        className={styles.pageContent}
        inert={selectedProject ? true : undefined}
      >
        <header className={styles.header}>
          <a className={styles.logoLink} href="/" aria-label="Go to portfolio home">
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
          <motion.section
            animate={{ opacity: 1, y: 0 }}
            aria-labelledby="orbital-title"
            className={styles.hero}
            initial={reducedMotion ? false : { opacity: 0, y: 10 }}
            transition={{
              duration: reducedMotion ? 0.08 : 0.36,
              ease: EASE,
            }}
          >
            <div>
              <p className={styles.eyebrow}>Mo Ibrahim · Design engineer.</p>
              <h1 id="orbital-title">
                Products built with care, down to the last pixel.
              </h1>
            </div>
            <p className={styles.bio}>{PORTFOLIO_BIO}</p>
          </motion.section>

          <motion.section
            animate={{ opacity: 1, y: 0 }}
            aria-labelledby="orbital-work-title"
            className={styles.work}
            initial={reducedMotion ? false : { opacity: 0, y: 10 }}
            transition={{
              delay: reducedMotion ? 0 : 0.07,
              duration: reducedMotion ? 0.08 : 0.36,
              ease: EASE,
            }}
          >
            <div className={styles.workHeading}>
              <h2 id="orbital-work-title">Selected work</h2>
              <p aria-live="polite">
                <span>{activeProject?.title}</span>
                <span className={styles.count}>
                  {String(activeIndex + 1).padStart(2, '0')} /{' '}
                  {String(projects.length).padStart(2, '0')}
                </span>
              </p>
            </div>

            {projects.length > 0 ? (
              <div className={styles.workField}>
                <nav aria-label="Project orbit" className={styles.orbit}>
                  <div className={styles.orbitRing}>
                    <motion.span
                      animate={{ rotate: dialAngle }}
                      aria-hidden="true"
                      className={styles.ray}
                      transition={{
                        duration: reducedMotion ? 0 : 0.32,
                        ease: EASE,
                      }}
                    />
                    <motion.span
                      animate={{ rotate: dialAngle }}
                      aria-hidden="true"
                      className={styles.activeMarker}
                      transition={{
                        duration: reducedMotion ? 0 : 0.32,
                        ease: EASE,
                      }}
                    >
                      <span />
                    </motion.span>
                    {projects.map((project, index) => (
                      <button
                        aria-current={activeIndex === index ? 'true' : undefined}
                        aria-label={`Show ${project.title}`}
                        className={styles.orbitNode}
                        key={project.id}
                        onClick={() => scrollToProject(index)}
                        onKeyDown={(event) =>
                          onIndexKeyDown(event, index, 'node')
                        }
                        ref={(node) => {
                          nodeRefs.current[index] = node
                        }}
                        style={{
                          '--node-angle': `${index * 60}deg`,
                          '--node-counter-angle': `${index * -60}deg`,
                        } as React.CSSProperties}
                        type="button"
                      >
                        <span>{String(index + 1).padStart(2, '0')}</span>
                      </button>
                    ))}
                  </div>
                </nav>

                <div className={styles.railColumn}>
                  <div
                    aria-label="Selected projects"
                    className={styles.rail}
                    ref={railRef}
                  >
                    {projects.map((project, index) => {
                      const media = project.media[0]
                      if (!media) return null
                      const active = activeIndex === index
                      return (
                        <article className={styles.projectArticle} key={project.id}>
                          <motion.button
                            animate={{
                              opacity: active ? 1 : 0.72,
                              scale: active ? 1 : 0.985,
                            }}
                            aria-label={`Open ${project.title} project details`}
                            className={styles.projectCard}
                            onClick={(event) =>
                              openProject(project, event.currentTarget)
                            }
                            onFocus={() => setActiveIndex(index)}
                            onKeyDown={(event) =>
                              onIndexKeyDown(event, index, 'card')
                            }
                            ref={(node) => {
                              cardRefs.current[index] = node
                            }}
                            style={{
                              '--project-accent': project.accent,
                            } as React.CSSProperties}
                            transition={{
                              duration: reducedMotion ? 0 : 0.24,
                              ease: EASE,
                            }}
                            type="button"
                            whileFocus={reducedMotion ? undefined : { y: -5 }}
                            whileHover={reducedMotion ? undefined : { y: -5 }}
                            whileTap={reducedMotion ? undefined : { scale: 0.992 }}
                          >
                            <ProjectImage
                              eager={index === 0}
                              failedImages={failedImages}
                              loadedImages={loadedImages}
                              media={media}
                              onFailed={markFailed}
                              onLoaded={markLoaded}
                              title={project.title}
                            />
                          </motion.button>
                        </article>
                      )
                    })}
                  </div>
                  <div className={styles.projectCaption}>
                    <h3>{activeProject?.title}</h3>
                    <p>{activeProject?.description}</p>
                  </div>
                </div>
              </div>
            ) : (
              <p className={styles.empty}>Projects are being prepared</p>
            )}
          </motion.section>

          <section className={styles.contact} aria-labelledby="orbital-contact">
            <h2 id="orbital-contact">
              Available for thoughtful product and interface collaborations.
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
          <a className={styles.footerLogoLink} href="/" aria-label="Go to portfolio home">
            <AnimatedLogo
              animateOnMount={false}
              className={styles.footerLogo}
              label="MO portfolio mark"
            />
          </a>
          <p>Mo Ibrahim · Cairo, Egypt</p>
          <p>{currentYear}</p>
          <a href="#orbital-title">Back to top</a>
        </footer>
      </div>

      <AnimatePresence>
        {selectedProject && drawerMedia ? (
          <motion.div
            animate={{ opacity: 1 }}
            className={styles.scrim}
            exit={{ opacity: 0 }}
            initial={{ opacity: 0 }}
            key={selectedProject.id}
            transition={{ duration: reducedMotion ? 0.08 : 0.16 }}
          >
            <motion.aside
              animate={{ opacity: 1, x: 0, y: 0 }}
              aria-labelledby="orbital-drawer-title"
              aria-modal="true"
              className={styles.drawer}
              exit={{
                opacity: reducedMotion ? 0 : 1,
                x: reducedMotion ? 0 : 28,
                y: reducedMotion ? 0 : 28,
              }}
              initial={{
                opacity: 0,
                x: reducedMotion ? 0 : 28,
                y: reducedMotion ? 0 : 0,
              }}
              ref={drawerRef}
              role="dialog"
              transition={{
                duration: reducedMotion ? 0.08 : 0.34,
                ease: EASE,
              }}
            >
              <button
                aria-label={`Close ${selectedProject.title} project details`}
                className={styles.closeButton}
                onClick={closeProject}
                ref={closeRef}
                type="button"
              >
                Close
              </button>
              <div className={styles.drawerHeader}>
                <p>
                  {String(
                    projects.findIndex(
                      (project) => project.id === selectedProject.id,
                    ) + 1,
                  ).padStart(2, '0')}
                </p>
                <h2 id="orbital-drawer-title">{selectedProject.title}</h2>
                <p>{selectedProject.description}</p>
              </div>

              <AnimatePresence initial={false} mode="wait">
                <motion.div
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  initial={{ opacity: 0 }}
                  key={drawerMedia.src}
                  transition={{ duration: reducedMotion ? 0.08 : 0.16 }}
                >
                  <ProjectImage
                    failedImages={failedImages}
                    loadedImages={loadedImages}
                    media={drawerMedia}
                    onFailed={markFailed}
                    onLoaded={markLoaded}
                    title={selectedProject.title}
                  />
                </motion.div>
              </AnimatePresence>

              {selectedProject.media.length > 1 ? (
                <div className={styles.gallery}>
                  <p>Gallery</p>
                  <div>
                    {selectedProject.media.map((media, index) => (
                      <button
                        aria-label={`Show image ${index + 1} of ${selectedProject.media.length}: ${media.alt}`}
                        aria-pressed={selectedMedia === index}
                        key={media.src}
                        onClick={() => setSelectedMedia(index)}
                        onKeyDown={(event) =>
                          onThumbnailKeyDown(event, index)
                        }
                        ref={(node) => {
                          thumbRefs.current[index] = node
                        }}
                        type="button"
                      >
                        <img
                          alt=""
                          height={media.height}
                          loading="lazy"
                          src={media.src}
                          width={media.width}
                        />
                        <span>{String(index + 1).padStart(2, '0')}</span>
                      </button>
                    ))}
                  </div>
                </div>
              ) : null}

              {selectedProject.collaborators.length > 0 ? (
                <div className={styles.collaborators}>
                  <h3>Collaborators</h3>
                  <ul>
                    {selectedProject.collaborators.map((collaborator) => (
                      <li key={collaborator}>{collaborator}</li>
                    ))}
                  </ul>
                </div>
              ) : null}

              {primaryHref ? (
                <div className={styles.drawerActions}>
                  <CutCornerButton href={primaryHref} variant="gold">
                    {primaryLabel}
                  </CutCornerButton>
                  {secondaryHref ? (
                    <a href={secondaryHref}>View repository</a>
                  ) : null}
                </div>
              ) : null}
            </motion.aside>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </div>
  )
}
