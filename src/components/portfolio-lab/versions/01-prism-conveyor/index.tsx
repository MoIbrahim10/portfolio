import { AnimatePresence, motion, useReducedMotion } from 'motion/react'
import {
  type CSSProperties,
  type KeyboardEvent as ReactKeyboardEvent,
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
  type PortfolioProject,
} from '../../shared/portfolio-data'

import styles from './styles.module.css'

const EASE = [0.22, 1, 0.36, 1] as const

function projectStyle(project: PortfolioProject) {
  return { '--project-accent': project.accent } as CSSProperties
}

export function PortfolioPrismConveyor() {
  const shouldReduceMotion = useReducedMotion()
  const [activeIndex, setActiveIndex] = useState(0)
  const [selectedProject, setSelectedProject] = useState<PortfolioProject>()
  const [selectedMedia, setSelectedMedia] = useState(0)
  const [hasScrolled, setHasScrolled] = useState(false)
  const [loadedImages, setLoadedImages] = useState<Set<string>>(() => new Set())
  const [failedImages, setFailedImages] = useState<Set<string>>(() => new Set())
  const railRef = useRef<HTMLDivElement>(null)
  const cardRefs = useRef<Array<HTMLButtonElement | null>>([])
  const triggerRef = useRef<HTMLButtonElement | null>(null)
  const closeRef = useRef<HTMLButtonElement>(null)
  const drawerRef = useRef<HTMLElement>(null)
  const scrollFrame = useRef<number | undefined>(undefined)

  const projects = PORTFOLIO_PROJECTS
  const activeProject = projects[activeIndex]

  useEffect(() => {
    if (!selectedProject) return

    const previousOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    closeRef.current?.focus()

    function onKeyDown(event: KeyboardEvent) {
      if (event.key === 'Escape') {
        event.preventDefault()
        setSelectedProject(undefined)
        return
      }

      if (event.key !== 'Tab' || !drawerRef.current) return
      const controls = Array.from(
        drawerRef.current.querySelectorAll<HTMLElement>(
          'a[href], button:not([disabled]), [tabindex]:not([tabindex="-1"])',
        ),
      )
      if (controls.length === 0) return

      const first = controls[0]
      const last = controls.at(-1)
      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault()
        last?.focus()
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault()
        first.focus()
      }
    }

    document.addEventListener('keydown', onKeyDown)
    return () => {
      document.body.style.overflow = previousOverflow
      document.removeEventListener('keydown', onKeyDown)
    }
  }, [selectedProject])

  function markLoaded(src: string) {
    setLoadedImages((current) => new Set(current).add(src))
  }

  function markFailed(src: string) {
    setFailedImages((current) => new Set(current).add(src))
  }

  function updateActiveProject() {
    const rail = railRef.current
    if (!rail) return
    const center = rail.getBoundingClientRect().left + rail.clientWidth / 2
    let nearestIndex = 0
    let nearestDistance = Number.POSITIVE_INFINITY

    cardRefs.current.forEach((card, index) => {
      if (!card) return
      const rect = card.getBoundingClientRect()
      const distance = Math.abs(rect.left + rect.width / 2 - center)
      if (distance < nearestDistance) {
        nearestDistance = distance
        nearestIndex = index
      }
    })

    setActiveIndex(nearestIndex)
    window.history.replaceState(null, '', `#project-${projects[nearestIndex].id}`)
  }

  function onRailScroll() {
    setHasScrolled(true)
    if (scrollFrame.current) cancelAnimationFrame(scrollFrame.current)
    scrollFrame.current = requestAnimationFrame(updateActiveProject)
  }

  function focusProject(index: number) {
    const nextIndex = Math.max(0, Math.min(projects.length - 1, index))
    setActiveIndex(nextIndex)
    cardRefs.current[nextIndex]?.focus()
    cardRefs.current[nextIndex]?.scrollIntoView({
      behavior: shouldReduceMotion ? 'auto' : 'smooth',
      block: 'nearest',
      inline: 'start',
    })
  }

  function onCardKeyDown(event: ReactKeyboardEvent<HTMLButtonElement>, index: number) {
    const destinations: Record<string, number> = {
      ArrowLeft: index - 1,
      ArrowRight: index + 1,
      End: projects.length - 1,
      Home: 0,
    }
    const destination = destinations[event.key]
    if (destination === undefined) return
    event.preventDefault()
    focusProject(destination)
  }

  function openProject(project: PortfolioProject, trigger: HTMLButtonElement) {
    triggerRef.current = trigger
    setSelectedMedia(0)
    setSelectedProject(project)
  }

  const drawerMedia = selectedProject?.media[selectedMedia]

  return (
    <div className={styles.page}>
      <div
        className={styles.pageContent}
        aria-hidden={selectedProject ? true : undefined}
        inert={selectedProject ? true : undefined}
      >
        <header className={styles.header}>
          <a className={styles.logoLink} href="/" aria-label="Go to portfolio home">
            <AnimatedLogo animateOnMount={false} className={styles.logo} />
          </a>
          <span className={styles.headerLabel}>Selected work</span>
          <nav className={styles.desktopNav} aria-label="Portfolio links">
            <a href={PORTFOLIO_LINKS.x}>X</a>
            <a href={PORTFOLIO_LINKS.github}>GitHub</a>
            <CutCornerButton href={PORTFOLIO_LINKS.cal} variant="paper">
              Schedule
            </CutCornerButton>
          </nav>
          <CutCornerButton
            className={styles.mobileContact}
            href={PORTFOLIO_LINKS.cal}
            variant="paper"
          >
            Contact
          </CutCornerButton>
        </header>

        <main>
          <section className={styles.hero} aria-labelledby="prism-title">
            <p className={styles.eyebrow}>Design engineering · Cairo</p>
            <h1 id="prism-title">Thoughtful products, polished to the last pixel.</h1>
            <p className={styles.bio}>{PORTFOLIO_BIO}</p>
            <CutCornerButton href={PORTFOLIO_LINKS.cal} variant="navy">
              Schedule a call
            </CutCornerButton>
          </section>

          <section className={styles.projects} aria-labelledby="projects-title">
            <div className={styles.sectionHeading}>
              <div>
                <p className={styles.sectionNumber}>01 / Work</p>
                <h2 id="projects-title">Project conveyor</h2>
              </div>
              <AnimatePresence initial={false}>
                {!hasScrolled ? (
                  <motion.p
                    className={styles.instruction}
                    exit={{ opacity: 0, y: -4 }}
                    transition={{ duration: shouldReduceMotion ? 0 : 0.16 }}
                  >
                    Scroll or drag <span aria-hidden="true">→</span>
                  </motion.p>
                ) : null}
              </AnimatePresence>
            </div>

            {projects.length > 0 ? (
              <>
                <motion.div
                  className={styles.conveyorFrame}
                  initial={shouldReduceMotion ? false : { opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: shouldReduceMotion ? 0 : 0.42, ease: EASE }}
                >
                  <div className={styles.gate} aria-hidden="true">
                    {projects.map((project) => (
                      <span key={project.id} style={{ background: project.accent }} />
                    ))}
                  </div>
                  <div
                    ref={railRef}
                    className={styles.rail}
                    onScroll={onRailScroll}
                    aria-label="Selected projects"
                  >
                    {projects.map((project, index) => {
                      const media = project.media[0]
                      const isLoaded = loadedImages.has(media.src)
                      const hasFailed = failedImages.has(media.src)
                      return (
                        <motion.article
                          className={styles.project}
                          key={project.id}
                          style={projectStyle(project)}
                          initial={shouldReduceMotion ? false : { opacity: 0, y: 14 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{
                            delay: shouldReduceMotion ? 0 : Math.min(index * 0.035, 0.175),
                            duration: shouldReduceMotion ? 0 : 0.36,
                            ease: EASE,
                          }}
                        >
                          <motion.button
                            ref={(node) => {
                              cardRefs.current[index] = node
                            }}
                            className={styles.projectButton}
                            type="button"
                            aria-label={`Open ${project.title} project`}
                            onFocus={() => setActiveIndex(index)}
                            onPointerEnter={() => setActiveIndex(index)}
                            onKeyDown={(event) => onCardKeyDown(event, index)}
                            onClick={(event) => openProject(project, event.currentTarget)}
                            whileHover={shouldReduceMotion ? undefined : { y: -6 }}
                            whileFocus={shouldReduceMotion ? undefined : { y: -6 }}
                            whileTap={shouldReduceMotion ? undefined : { scale: 0.992 }}
                            transition={{ duration: 0.24, ease: EASE }}
                          >
                            <span
                              className={`${styles.mediaFrame} ${isLoaded ? styles.isLoaded : ''}`}
                            >
                              {hasFailed ? (
                                <span className={styles.imageFallback}>
                                  <strong>{project.title}</strong>
                                  <span>Preview unavailable</span>
                                </span>
                              ) : (
                                <img
                                  src={media.src}
                                  alt={media.alt}
                                  width={media.width}
                                  height={media.height}
                                  loading={index === 0 ? 'eager' : 'lazy'}
                                  onLoad={() => markLoaded(media.src)}
                                  onError={() => markFailed(media.src)}
                                />
                              )}
                            </span>
                          </motion.button>
                        </motion.article>
                      )
                    })}
                  </div>
                </motion.div>

                <div className={styles.projectIndex} aria-live="polite">
                  <span>{String(activeIndex + 1).padStart(2, '0')}</span>
                  <AnimatePresence initial={false} mode="wait">
                    <motion.strong
                      key={activeProject.id}
                      initial={shouldReduceMotion ? false : { opacity: 0, y: 6 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={shouldReduceMotion ? undefined : { opacity: 0, y: -6 }}
                      transition={{ duration: shouldReduceMotion ? 0 : 0.18, ease: EASE }}
                    >
                      {activeProject.title}
                    </motion.strong>
                  </AnimatePresence>
                  <span>{String(projects.length).padStart(2, '0')}</span>
                </div>
                <div className={styles.progress} aria-hidden="true">
                  <motion.span
                    animate={{ scaleX: (activeIndex + 1) / projects.length }}
                    transition={{
                      type: shouldReduceMotion ? 'tween' : 'spring',
                      bounce: 0,
                      duration: shouldReduceMotion ? 0 : 0.36,
                    }}
                  />
                </div>
              </>
            ) : (
              <div className={styles.emptyState}>
                <p>Projects are being prepared.</p>
              </div>
            )}
          </section>

          <section className={styles.contact} aria-labelledby="contact-title">
            <div>
              <p className={styles.sectionNumber}>02 / Contact</p>
              <h2 id="contact-title">Elsewhere / available for thoughtful collaborations.</h2>
            </div>
            <div className={styles.contactLinks}>
              <a href={PORTFOLIO_LINKS.x}>X</a>
              <a href={PORTFOLIO_LINKS.github}>GitHub</a>
              <CutCornerButton href={PORTFOLIO_LINKS.cal} variant="paper">
                Schedule
              </CutCornerButton>
            </div>
          </section>
        </main>

        <footer className={styles.footer}>
          <AnimatedLogo animateOnMount={false} className={styles.footerLogo} />
          <p>Mo Ibrahim · Design and code with care.</p>
          <p>{new Date().getFullYear()} · Cairo, Egypt.</p>
          <a href="#prism-title">Back to start</a>
        </footer>
      </div>

      <AnimatePresence
        onExitComplete={() => triggerRef.current?.focus()}
      >
        {selectedProject ? (
          <div className={styles.modalLayer}>
            <motion.button
              className={styles.scrim}
              type="button"
              aria-label="Close project details"
              onClick={() => setSelectedProject(undefined)}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: shouldReduceMotion ? 0.1 : 0.18 }}
            />
            <motion.aside
              ref={drawerRef}
              className={styles.drawer}
              role="dialog"
              aria-modal="true"
              aria-labelledby="drawer-title"
              style={projectStyle(selectedProject)}
              initial={shouldReduceMotion ? { opacity: 0 } : { opacity: 0, x: 32 }}
              animate={{ opacity: 1, x: 0 }}
              exit={shouldReduceMotion ? { opacity: 0 } : { opacity: 0, x: 20 }}
              transition={{ duration: shouldReduceMotion ? 0.1 : 0.36, ease: EASE }}
            >
              <header className={styles.drawerHeader}>
                <div>
                  <p className={styles.sectionNumber}>Project details</p>
                  <h2 id="drawer-title" tabIndex={-1}>{selectedProject.title}</h2>
                </div>
                <button
                  ref={closeRef}
                  className={styles.closeButton}
                  type="button"
                  onClick={() => setSelectedProject(undefined)}
                  aria-label="Close project details"
                >
                  <span aria-hidden="true">×</span>
                </button>
              </header>
              <p className={styles.drawerDescription}>{selectedProject.description}</p>

              {drawerMedia ? (
                <div className={styles.drawerMedia}>
                  {failedImages.has(drawerMedia.src) ? (
                    <div className={styles.imageFallback}>
                      <strong>{selectedProject.title}</strong>
                      <span>Preview unavailable</span>
                    </div>
                  ) : (
                    <AnimatePresence initial={false} mode="wait">
                      <motion.img
                        key={drawerMedia.src}
                        src={drawerMedia.src}
                        alt={drawerMedia.alt}
                        width={drawerMedia.width}
                        height={drawerMedia.height}
                        loading="lazy"
                        onLoad={() => markLoaded(drawerMedia.src)}
                        onError={() => markFailed(drawerMedia.src)}
                        initial={shouldReduceMotion ? false : { opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: shouldReduceMotion ? 0 : 0.18 }}
                      />
                    </AnimatePresence>
                  )}
                </div>
              ) : null}

              {selectedProject.media.length > 1 ? (
                <div className={styles.gallery} aria-label={`${selectedProject.title} gallery`}>
                  {selectedProject.media.map((media, index) => (
                    <button
                      type="button"
                      key={media.src}
                      className={styles.thumbnail}
                      aria-label={`Show image ${index + 1} of ${selectedProject.media.length}`}
                      aria-pressed={selectedMedia === index}
                      onClick={() => setSelectedMedia(index)}
                    >
                      <img
                        src={media.src}
                        alt=""
                        width={media.width}
                        height={media.height}
                        loading="lazy"
                        onError={() => markFailed(media.src)}
                      />
                    </button>
                  ))}
                </div>
              ) : null}

              {selectedProject.collaborators.length > 0 ? (
                <section className={styles.drawerSection} aria-labelledby="collaborators-title">
                  <h3 id="collaborators-title">Collaborators</h3>
                  <ul>
                    {selectedProject.collaborators.map((collaborator) => (
                      <li key={collaborator}>{collaborator}</li>
                    ))}
                  </ul>
                </section>
              ) : null}

              {selectedProject.liveHref || selectedProject.repositoryHref ? (
                <div className={styles.drawerActions}>
                  <CutCornerButton
                    href={selectedProject.liveHref ?? selectedProject.repositoryHref}
                    variant="navy"
                  >
                    {selectedProject.liveHref ? 'Visit live project' : 'View repository'}
                  </CutCornerButton>
                  {selectedProject.liveHref && selectedProject.repositoryHref ? (
                    <a className={styles.secondaryLink} href={selectedProject.repositoryHref}>
                      View repository
                    </a>
                  ) : null}
                </div>
              ) : null}
            </motion.aside>
          </div>
        ) : null}
      </AnimatePresence>
    </div>
  )
}
