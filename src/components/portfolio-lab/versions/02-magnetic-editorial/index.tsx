import { AnimatePresence, motion, useReducedMotion } from 'motion/react'
import {
  type KeyboardEvent as ReactKeyboardEvent,
  type PointerEvent as ReactPointerEvent,
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
  type PortfolioProject,
} from '../../shared/portfolio-data'

import styles from './styles.module.css'

const EASE = [0.22, 1, 0.36, 1] as const

interface DragState {
  active: boolean
  moved: boolean
  pointerId: number
  scrollLeft: number
  x: number
}

export function PortfolioMagneticEditorial() {
  const shouldReduceMotion = useReducedMotion()
  const projects = PORTFOLIO_PROJECTS
  const [activeIndex, setActiveIndex] = useState(0)
  const [selectedProject, setSelectedProject] = useState<PortfolioProject>()
  const [selectedMedia, setSelectedMedia] = useState(0)
  const [hasInteracted, setHasInteracted] = useState(false)
  const [loadedImages, setLoadedImages] = useState<Set<string>>(() => new Set())
  const [failedImages, setFailedImages] = useState<Set<string>>(() => new Set())
  const railRef = useRef<HTMLDivElement>(null)
  const articleRefs = useRef<Array<HTMLElement | null>>([])
  const markerRefs = useRef<Array<HTMLSpanElement | null>>([])
  const buttonRefs = useRef<Array<HTMLButtonElement | null>>([])
  const thumbnailRefs = useRef<Array<HTMLButtonElement | null>>([])
  const drawerRef = useRef<HTMLElement>(null)
  const closeRef = useRef<HTMLButtonElement>(null)
  const triggerRef = useRef<HTMLButtonElement | null>(null)
  const magnetFrame = useRef<number | undefined>(undefined)
  const suppressClick = useRef(false)
  const dragState = useRef<DragState>({
    active: false,
    moved: false,
    pointerId: -1,
    scrollLeft: 0,
    x: 0,
  })

  const markLoaded = useCallback((src: string) => {
    setLoadedImages((current) => new Set(current).add(src))
  }, [])

  const markFailed = useCallback((src: string) => {
    setFailedImages((current) => new Set(current).add(src))
  }, [])

  const updateMagnetism = useCallback(() => {
    const rail = railRef.current
    if (!rail) return

    if (shouldReduceMotion) {
      articleRefs.current.forEach((article) => article?.style.removeProperty('transform'))
      return
    }

    const railRect = rail.getBoundingClientRect()
    const spine = railRect.left + rail.clientWidth / 2

    articleRefs.current.forEach((article) => {
      if (!article) return
      const rect = article.getBoundingClientRect()
      const distance = rect.left + rect.width / 2 - spine
      const strength = Math.max(0, 1 - Math.abs(distance) / 96)
      const x = Math.max(-10, Math.min(10, -distance * 0.08)) * strength
      const y = -8 * strength
      const scale = 1 + 0.012 * strength
      article.style.transform = `translate3d(${x}px, ${y}px, 0) scale(${scale})`
    })
  }, [shouldReduceMotion])

  const scheduleMagnetism = useCallback(() => {
    if (magnetFrame.current !== undefined) {
      cancelAnimationFrame(magnetFrame.current)
    }
    magnetFrame.current = requestAnimationFrame(updateMagnetism)
  }, [updateMagnetism])

  useEffect(() => {
    const rail = railRef.current
    if (!rail) return

    const observer = new IntersectionObserver(
      (entries) => {
        const centered = entries.find((entry) => entry.isIntersecting)
        if (!centered) return
        const index = markerRefs.current.indexOf(centered.target as HTMLSpanElement)
        if (index < 0) return
        setActiveIndex(index)
        window.history.replaceState(
          window.history.state,
          '',
          `#project-${projects[index].id}`,
        )
      },
      {
        root: rail,
        rootMargin: '0px -47% 0px -47%',
        threshold: 0,
      },
    )

    markerRefs.current.forEach((marker) => {
      if (marker) observer.observe(marker)
    })

    const resizeObserver = new ResizeObserver(scheduleMagnetism)
    resizeObserver.observe(rail)
    scheduleMagnetism()

    return () => {
      observer.disconnect()
      resizeObserver.disconnect()
      if (magnetFrame.current !== undefined) cancelAnimationFrame(magnetFrame.current)
    }
  }, [projects, scheduleMagnetism])

  useEffect(() => {
    if (!selectedProject) return

    const previousOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    closeRef.current?.focus()

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
      if (controls.length === 0) return

      const first = controls[0]
      const last = controls.at(-1)
      if (!drawerRef.current.contains(document.activeElement)) {
        event.preventDefault()
        first.focus()
      } else if (event.shiftKey && document.activeElement === first) {
        event.preventDefault()
        last?.focus()
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault()
        first.focus()
      }
    }

    function onPopState() {
      setSelectedProject(undefined)
    }

    document.addEventListener('keydown', onKeyDown)
    window.addEventListener('popstate', onPopState)
    return () => {
      document.body.style.overflow = previousOverflow
      document.removeEventListener('keydown', onKeyDown)
      window.removeEventListener('popstate', onPopState)
    }
  }, [selectedProject])

  function closeProject() {
    const state = window.history.state as
      | { magneticEditorialProject?: string }
      | null
    if (state?.magneticEditorialProject) {
      window.history.back()
    } else {
      setSelectedProject(undefined)
    }
  }

  function openProject(project: PortfolioProject, trigger: HTMLButtonElement) {
    triggerRef.current = trigger
    setSelectedMedia(0)
    setSelectedProject(project)
    window.history.pushState(
      {
        ...(window.history.state ?? {}),
        magneticEditorialProject: project.id,
      },
      '',
      `#project-${project.id}-details`,
    )
  }

  function focusProject(index: number) {
    const destination = Math.max(0, Math.min(projects.length - 1, index))
    setActiveIndex(destination)
    setHasInteracted(true)
    const button = buttonRefs.current[destination]
    button?.focus()
    button?.scrollIntoView({
      behavior: shouldReduceMotion ? 'auto' : 'smooth',
      block: 'nearest',
      inline: 'center',
    })
  }

  function onPosterKeyDown(
    event: ReactKeyboardEvent<HTMLButtonElement>,
    index: number,
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
    focusProject(destination)
  }

  function onRailScroll() {
    setHasInteracted(true)
    scheduleMagnetism()
  }

  function onRailPointerDown(event: ReactPointerEvent<HTMLDivElement>) {
    if (event.pointerType !== 'mouse' || event.button !== 0) return
    dragState.current = {
      active: true,
      moved: false,
      pointerId: event.pointerId,
      scrollLeft: event.currentTarget.scrollLeft,
      x: event.clientX,
    }
    event.currentTarget.setPointerCapture(event.pointerId)
    event.currentTarget.dataset.dragging = 'true'
  }

  function onRailPointerMove(event: ReactPointerEvent<HTMLDivElement>) {
    const drag = dragState.current
    if (!drag.active || drag.pointerId !== event.pointerId) return
    const distance = event.clientX - drag.x
    if (Math.abs(distance) > 4) {
      drag.moved = true
      setHasInteracted(true)
    }
    if (!drag.moved) return
    event.preventDefault()
    event.currentTarget.scrollLeft = drag.scrollLeft - distance
  }

  function finishRailDrag(event: ReactPointerEvent<HTMLDivElement>) {
    const drag = dragState.current
    if (!drag.active || drag.pointerId !== event.pointerId) return
    suppressClick.current = drag.moved
    drag.active = false
    event.currentTarget.dataset.dragging = 'false'
    if (event.currentTarget.hasPointerCapture(event.pointerId)) {
      event.currentTarget.releasePointerCapture(event.pointerId)
    }
    window.setTimeout(() => {
      suppressClick.current = false
    }, 0)
  }

  function onGalleryKeyDown(
    event: ReactKeyboardEvent<HTMLButtonElement>,
    index: number,
  ) {
    if (!selectedProject) return
    const destinations: Record<string, number> = {
      ArrowLeft: index - 1,
      ArrowRight: index + 1,
      End: selectedProject.media.length - 1,
      Home: 0,
    }
    const requested = destinations[event.key]
    if (requested === undefined) return
    event.preventDefault()
    const destination = Math.max(
      0,
      Math.min(selectedProject.media.length - 1, requested),
    )
    setSelectedMedia(destination)
    thumbnailRefs.current[destination]?.focus()
  }

  const activeProject = projects[activeIndex]
  const drawerMedia = selectedProject?.media[selectedMedia]
  const drawerProjectIndex = selectedProject
    ? projects.findIndex((project) => project.id === selectedProject.id)
    : -1

  return (
    <div className={styles.page}>
      <div
        className={styles.pageContent}
        aria-hidden={selectedProject ? true : undefined}
        inert={selectedProject ? true : undefined}
      >
        <header className={styles.masthead}>
          <a className={styles.logoLink} href="/" aria-label="Go to portfolio home">
            <AnimatedLogo animateOnMount={false} className={styles.logo} />
          </a>
          <p className={styles.identity}>
            Mo Ibrahim <span>/ design + code</span>
          </p>
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
          <section className={styles.hero} aria-labelledby="magnetic-title">
            <div className={styles.heroTopline}>
              <p>Independent design engineer · Cairo</p>
              <CutCornerButton href={PORTFOLIO_LINKS.cal} variant="navy">
                Schedule a call
              </CutCornerButton>
            </div>
            <h1 id="magnetic-title">
              <span>Make the useful</span>
              <motion.span
                initial={shouldReduceMotion ? false : { opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{
                  duration: shouldReduceMotion ? 0 : 0.44,
                  ease: EASE,
                }}
              >
                feel unmissable.<i aria-hidden="true" />
              </motion.span>
            </h1>
            <motion.p
              className={styles.bio}
              initial={shouldReduceMotion ? false : { opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{
                delay: shouldReduceMotion ? 0 : 0.06,
                duration: shouldReduceMotion ? 0 : 0.4,
                ease: EASE,
              }}
            >
              {PORTFOLIO_BIO}
            </motion.p>
          </section>

          <section className={styles.projects} aria-labelledby="projects-title">
            <div className={styles.projectsHeading}>
              <div>
                <p className={styles.sectionIndex}>01 / Selected work</p>
                <h2 id="projects-title">Selected projects</h2>
              </div>
              <AnimatePresence initial={false}>
                {!hasInteracted ? (
                  <motion.p
                    className={styles.instruction}
                    exit={{ opacity: 0, y: -4 }}
                    transition={{ duration: shouldReduceMotion ? 0 : 0.16 }}
                  >
                    Drag, scroll, or use arrows <span aria-hidden="true">→</span>
                  </motion.p>
                ) : null}
              </AnimatePresence>
            </div>

            {projects.length > 0 ? (
              <>
                <motion.div
                  className={styles.wall}
                  initial={shouldReduceMotion ? false : { opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{
                    duration: shouldReduceMotion ? 0 : 0.48,
                    ease: EASE,
                  }}
                >
                  <div className={styles.spine} aria-hidden="true" />
                  <div
                    ref={railRef}
                    className={styles.rail}
                    aria-label="Selected projects"
                    onScroll={onRailScroll}
                    onPointerDown={onRailPointerDown}
                    onPointerMove={onRailPointerMove}
                    onPointerUp={finishRailDrag}
                    onPointerCancel={finishRailDrag}
                  >
                    {projects.map((project, index) => {
                      const media = project.media[0]
                      const isLoaded = loadedImages.has(media.src)
                      const hasFailed = failedImages.has(media.src)

                      return (
                        <motion.div
                          className={styles.posterEntrance}
                          key={project.id}
                          initial={
                            shouldReduceMotion ? false : { opacity: 0, y: 14 }
                          }
                          animate={{ opacity: 1, y: 0 }}
                          transition={{
                            delay: shouldReduceMotion
                              ? 0
                              : Math.min(index * 0.035, 0.175),
                            duration: shouldReduceMotion ? 0 : 0.4,
                            ease: EASE,
                          }}
                        >
                          <article
                            ref={(node) => {
                              articleRefs.current[index] = node
                            }}
                            className={styles.poster}
                            data-active={activeIndex === index}
                          >
                            <h3 className={styles.srOnly}>{project.title}</h3>
                            <span
                              ref={(node) => {
                                markerRefs.current[index] = node
                              }}
                              className={styles.centerMarker}
                              aria-hidden="true"
                            />
                            <motion.button
                              ref={(node) => {
                                buttonRefs.current[index] = node
                              }}
                              className={styles.posterButton}
                              type="button"
                              aria-label={`Open ${project.title} project`}
                              onFocus={() => setActiveIndex(index)}
                              onKeyDown={(event) => onPosterKeyDown(event, index)}
                              onClick={(event) => {
                                if (suppressClick.current) {
                                  event.preventDefault()
                                  return
                                }
                                openProject(project, event.currentTarget)
                              }}
                              animate={
                                selectedProject?.id === project.id &&
                                !shouldReduceMotion
                                  ? { y: -10 }
                                  : { y: 0 }
                              }
                              whileHover={
                                shouldReduceMotion ? undefined : { y: -6 }
                              }
                              whileFocus={
                                shouldReduceMotion ? undefined : { y: -6 }
                              }
                              whileTap={
                                shouldReduceMotion ? undefined : { scale: 0.992 }
                              }
                              transition={{ duration: 0.22, ease: EASE }}
                            >
                              <span
                                className={`${styles.mediaFrame} ${
                                  isLoaded ? styles.isLoaded : ''
                                }`}
                              >
                                {hasFailed ? (
                                  <span className={styles.imageFallback}>
                                    <strong>{project.title}</strong>
                                    <span>Preview unavailable</span>
                                  </span>
                                ) : (
                                  <>
                                    <span
                                      className={styles.imageLoading}
                                      aria-hidden="true"
                                    />
                                    <img
                                      src={media.src}
                                      alt={media.alt}
                                      width={media.width}
                                      height={media.height}
                                      loading={index === 0 ? 'eager' : 'lazy'}
                                      onLoad={() => markLoaded(media.src)}
                                      onError={() => markFailed(media.src)}
                                    />
                                  </>
                                )}
                              </span>
                            </motion.button>
                          </article>
                        </motion.div>
                      )
                    })}
                  </div>
                </motion.div>

                {activeProject ? (
                  <div className={styles.caption}>
                    <span>{String(activeIndex + 1).padStart(2, '0')}</span>
                    <AnimatePresence initial={false} mode="wait">
                      <motion.strong
                        key={activeProject.id}
                        initial={
                          shouldReduceMotion ? false : { opacity: 0, y: 8 }
                        }
                        animate={{ opacity: 1, y: 0 }}
                        exit={
                          shouldReduceMotion
                            ? undefined
                            : { opacity: 0, y: -8 }
                        }
                        transition={{
                          duration: shouldReduceMotion ? 0 : 0.18,
                          ease: EASE,
                        }}
                      >
                        {activeProject.title}
                      </motion.strong>
                    </AnimatePresence>
                    <span>{String(projects.length).padStart(2, '0')}</span>
                  </div>
                ) : null}
                <div className={styles.progress} aria-hidden="true">
                  <motion.span
                    animate={{
                      scaleX: projects.length
                        ? (activeIndex + 1) / projects.length
                        : 0,
                    }}
                    transition={{
                      type: shouldReduceMotion ? 'tween' : 'spring',
                      stiffness: 260,
                      damping: 34,
                      mass: 0.85,
                      duration: shouldReduceMotion ? 0 : undefined,
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
              <p className={styles.sectionIndex}>02 / Contact</p>
              <h2 id="contact-title">
                Available for thoughtful product collaborations.
              </h2>
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
          <div className={styles.footerLogo}>
            <AnimatedLogo animateOnMount={false} />
          </div>
          <p>Mo Ibrahim · Design and code with care.</p>
          <p>{new Date().getFullYear()} · Cairo, Egypt</p>
          <a href="#magnetic-title">Back to top</a>
        </footer>
      </div>

      <p className={styles.srOnly} aria-live="polite" aria-atomic="true">
        {selectedProject
          ? `Opened ${selectedProject.title} project details`
          : activeProject
            ? `${String(activeIndex + 1).padStart(2, '0')} of ${String(
                projects.length,
              ).padStart(2, '0')}: ${activeProject.title}`
            : 'Projects are being prepared.'}
      </p>

      <AnimatePresence
        onExitComplete={() => triggerRef.current?.focus({ preventScroll: true })}
      >
        {selectedProject ? (
          <div className={styles.modalLayer}>
            <motion.button
              className={styles.scrim}
              type="button"
              aria-label="Close project details"
              onClick={closeProject}
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
              aria-labelledby="magnetic-drawer-title"
              initial={
                shouldReduceMotion
                  ? { opacity: 0 }
                  : { opacity: 0, x: 40 }
              }
              animate={{ opacity: 1, x: 0 }}
              exit={
                shouldReduceMotion
                  ? { opacity: 0 }
                  : { opacity: 0, x: 24 }
              }
              transition={{
                duration: shouldReduceMotion ? 0.1 : 0.38,
                ease: EASE,
              }}
            >
              <motion.header
                className={styles.drawerHeader}
                initial={
                  shouldReduceMotion ? false : { opacity: 0, y: 8 }
                }
                animate={{ opacity: 1, y: 0 }}
                transition={{
                  delay: shouldReduceMotion ? 0 : 0.06,
                  duration: shouldReduceMotion ? 0 : 0.28,
                  ease: EASE,
                }}
              >
                <div>
                  <p className={styles.sectionIndex}>
                    {String(drawerProjectIndex + 1).padStart(2, '0')} /{' '}
                    {String(projects.length).padStart(2, '0')}
                  </p>
                  <h2 id="magnetic-drawer-title" tabIndex={-1}>
                    {selectedProject.title}
                  </h2>
                </div>
                <button
                  ref={closeRef}
                  className={styles.closeButton}
                  type="button"
                  aria-label="Close project details"
                  onClick={closeProject}
                >
                  <span aria-hidden="true">×</span>
                </button>
              </motion.header>

              <motion.p
                className={styles.drawerDescription}
                initial={
                  shouldReduceMotion ? false : { opacity: 0, y: 8 }
                }
                animate={{ opacity: 1, y: 0 }}
                transition={{
                  delay: shouldReduceMotion ? 0 : 0.088,
                  duration: shouldReduceMotion ? 0 : 0.28,
                  ease: EASE,
                }}
              >
                {selectedProject.description}
              </motion.p>

              {drawerMedia ? (
                <motion.div
                  className={styles.drawerMedia}
                  initial={
                    shouldReduceMotion ? false : { opacity: 0, y: 8 }
                  }
                  animate={{ opacity: 1, y: 0 }}
                  transition={{
                    delay: shouldReduceMotion ? 0 : 0.116,
                    duration: shouldReduceMotion ? 0 : 0.28,
                    ease: EASE,
                  }}
                >
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
                        initial={
                          shouldReduceMotion ? false : { opacity: 0, x: 6 }
                        }
                        animate={{ opacity: 1, x: 0 }}
                        exit={
                          shouldReduceMotion
                            ? undefined
                            : { opacity: 0, x: -6 }
                        }
                        transition={{
                          duration: shouldReduceMotion ? 0 : 0.18,
                          ease: EASE,
                        }}
                      />
                    </AnimatePresence>
                  )}
                </motion.div>
              ) : null}

              {selectedProject.media.length > 1 ? (
                <motion.div
                  className={styles.gallery}
                  aria-label={`${selectedProject.title} gallery`}
                  initial={
                    shouldReduceMotion ? false : { opacity: 0, y: 8 }
                  }
                  animate={{ opacity: 1, y: 0 }}
                  transition={{
                    delay: shouldReduceMotion ? 0 : 0.144,
                    duration: shouldReduceMotion ? 0 : 0.28,
                    ease: EASE,
                  }}
                >
                  {selectedProject.media.map((media, index) => (
                    <button
                      ref={(node) => {
                        thumbnailRefs.current[index] = node
                      }}
                      className={styles.thumbnail}
                      type="button"
                      key={media.src}
                      aria-label={`Show image ${index + 1} of ${selectedProject.media.length}`}
                      aria-pressed={selectedMedia === index}
                      onClick={() => setSelectedMedia(index)}
                      onKeyDown={(event) => onGalleryKeyDown(event, index)}
                    >
                      {failedImages.has(media.src) ? (
                        <span>Unavailable</span>
                      ) : (
                        <img
                          src={media.src}
                          alt=""
                          width={media.width}
                          height={media.height}
                          loading="lazy"
                          onError={() => markFailed(media.src)}
                        />
                      )}
                    </button>
                  ))}
                </motion.div>
              ) : null}

              {selectedProject.collaborators.length > 0 ? (
                <section
                  className={styles.drawerSection}
                  aria-labelledby="magnetic-collaborators-title"
                >
                  <h3 id="magnetic-collaborators-title">
                    Collaborated with
                  </h3>
                  <ul>
                    {selectedProject.collaborators.map((collaborator) => (
                      <li key={collaborator}>{collaborator}</li>
                    ))}
                  </ul>
                </section>
              ) : null}

              {selectedProject.liveHref || selectedProject.repositoryHref ? (
                <motion.div
                  className={styles.drawerActions}
                  initial={
                    shouldReduceMotion ? false : { opacity: 0, y: 8 }
                  }
                  animate={{ opacity: 1, y: 0 }}
                  transition={{
                    delay: shouldReduceMotion ? 0 : 0.172,
                    duration: shouldReduceMotion ? 0 : 0.28,
                    ease: EASE,
                  }}
                >
                  <CutCornerButton
                    href={
                      selectedProject.liveHref ??
                      selectedProject.repositoryHref
                    }
                    variant="navy"
                  >
                    {selectedProject.liveHref
                      ? 'Visit live project'
                      : 'View repository'}
                  </CutCornerButton>
                  {selectedProject.liveHref &&
                  selectedProject.repositoryHref ? (
                    <a
                      className={styles.secondaryLink}
                      href={selectedProject.repositoryHref}
                    >
                      View repository
                    </a>
                  ) : null}
                </motion.div>
              ) : null}
            </motion.aside>
          </div>
        ) : null}
      </AnimatePresence>
    </div>
  )
}
