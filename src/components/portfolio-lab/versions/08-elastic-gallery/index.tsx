import {
  AnimatePresence,
  LayoutGroup,
  motion,
  useReducedMotion,
} from 'motion/react'
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
const SPRING = { damping: 32, mass: 0.7, stiffness: 360, type: 'spring' } as const

interface ProjectImageProps {
  eager?: boolean
  failed: Set<string>
  loaded: Set<string>
  media: PortfolioMedia
  naturalRatio?: boolean
  onError: (src: string) => void
  onLoad: (src: string) => void
  title: string
}

function ProjectImage({
  eager = false,
  failed,
  loaded,
  media,
  naturalRatio = false,
  onError,
  onLoad,
  title,
}: ProjectImageProps) {
  const hasFailed = failed.has(media.src)
  const hasLoaded = loaded.has(media.src)

  return (
    <div
      className={styles.imageFrame}
      style={
        naturalRatio
          ? { aspectRatio: `${media.width} / ${media.height}` }
          : undefined
      }
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

export function PortfolioElasticGallery() {
  const projects = PORTFOLIO_PROJECTS
  const reducedMotion = Boolean(useReducedMotion())
  const [activeIndex, setActiveIndex] = useState(0)
  const [selectedProject, setSelectedProject] = useState<PortfolioProject>()
  const [loadedImages, setLoadedImages] = useState<Set<string>>(() => new Set())
  const [failedImages, setFailedImages] = useState<Set<string>>(() => new Set())
  const railRef = useRef<HTMLDivElement>(null)
  const cardRefs = useRef<Array<HTMLButtonElement | null>>([])
  const drawerRef = useRef<HTMLElement>(null)
  const closeRef = useRef<HTMLButtonElement>(null)
  const triggerRef = useRef<HTMLButtonElement | null>(null)

  const markLoaded = useCallback((src: string) => {
    setLoadedImages((current) => new Set(current).add(src))
  }, [])

  const markFailed = useCallback((src: string) => {
    setFailedImages((current) => new Set(current).add(src))
  }, [])

  useEffect(() => {
    const rail = railRef.current
    if (!rail || projects.length === 0) return

    const observer = new IntersectionObserver(
      (entries) => {
        const centered = entries
          .filter((entry) => entry.isIntersecting)
          .sort((left, right) => right.intersectionRatio - left.intersectionRatio)[0]
        if (!centered) return
        const nextIndex = cardRefs.current.findIndex(
          (card) => card === centered.target,
        )
        if (nextIndex < 0) return
        setActiveIndex(nextIndex)
        window.history.replaceState(
          window.history.state,
          '',
          `#project-${projects[nextIndex]?.id}`,
        )
      },
      {
        root: rail,
        rootMargin: '0px -46% 0px -46%',
        threshold: 0.01,
      },
    )

    cardRefs.current.forEach((card) => {
      if (card) observer.observe(card)
    })

    const hashIndex = projects.findIndex(
      (project) => window.location.hash === `#project-${project.id}`,
    )
    const frame = requestAnimationFrame(() => {
      if (hashIndex >= 0) moveToProject(hashIndex)
    })

    return () => {
      cancelAnimationFrame(frame)
      observer.disconnect()
    }
  }, [projects])

  useEffect(() => {
    const nextMedia = projects[activeIndex + 1]?.media[0]
    if (!nextMedia) return
    const preload = document.createElement('link')
    preload.rel = 'preload'
    preload.as = 'image'
    preload.href = nextMedia.src
    document.head.append(preload)
    return () => preload.remove()
  }, [activeIndex, projects])

  useEffect(() => {
    if (!selectedProject) return

    const previousOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    const frame = requestAnimationFrame(() => closeRef.current?.focus())

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
      cancelAnimationFrame(frame)
      document.body.style.overflow = previousOverflow
      document.removeEventListener('keydown', onKeyDown)
    }
  }, [selectedProject])

  function moveToProject(index: number, focus = false) {
    const nextIndex = Math.max(0, Math.min(projects.length - 1, index))
    setActiveIndex(nextIndex)
    cardRefs.current[nextIndex]?.scrollIntoView({
      behavior: reducedMotion ? 'auto' : 'smooth',
      block: 'nearest',
      inline: 'center',
    })
    if (focus) cardRefs.current[nextIndex]?.focus()
  }

  function onCardKeyDown(
    event: ReactKeyboardEvent<HTMLButtonElement>,
    index: number,
  ) {
    let nextIndex: number | undefined
    if (event.key === 'ArrowLeft') nextIndex = index - 1
    if (event.key === 'ArrowRight') nextIndex = index + 1
    if (event.key === 'Home') nextIndex = 0
    if (event.key === 'End') nextIndex = projects.length - 1
    if (nextIndex === undefined) return
    event.preventDefault()
    moveToProject(nextIndex, true)
  }

  function openProject(project: PortfolioProject, trigger: HTMLButtonElement) {
    triggerRef.current = trigger
    setSelectedProject(project)
  }

  function closeProject() {
    const trigger = triggerRef.current
    setSelectedProject(undefined)
    window.setTimeout(() => trigger?.focus(), reducedMotion ? 0 : 320)
  }

  const activeProject = projects[activeIndex] ?? projects[0]
  const currentYear = new Date().getFullYear()

  return (
    <LayoutGroup>
      <div className={styles.page}>
        <div
          aria-hidden={selectedProject ? true : undefined}
          className={styles.pageContent}
          inert={selectedProject ? true : undefined}
        >
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
            <motion.section
              animate={{ opacity: 1, y: 0 }}
              aria-labelledby="elastic-title"
              className={styles.hero}
              initial={reducedMotion ? false : { opacity: 0, y: 8 }}
              transition={{ duration: reducedMotion ? 0.08 : 0.3, ease: EASE }}
            >
              <p className={styles.eyebrow}>Mo Ibrahim · Design engineer</p>
              <h1 id="elastic-title">Small details. Better products.</h1>
              <p className={styles.bio}>{PORTFOLIO_BIO}</p>
              <CutCornerButton href={PORTFOLIO_LINKS.cal} variant="navy">
                Schedule a call
              </CutCornerButton>
            </motion.section>

            <motion.section
              animate={{ opacity: 1, y: 0 }}
              aria-labelledby="elastic-work-title"
              className={styles.work}
              initial={reducedMotion ? false : { opacity: 0, y: 8 }}
              transition={{
                delay: reducedMotion ? 0 : 0.06,
                duration: reducedMotion ? 0.08 : 0.3,
                ease: EASE,
              }}
            >
              <div className={styles.workHeading}>
                <h2 id="elastic-work-title">Selected work</h2>
                <p>Drag, scroll, or use arrows</p>
                <p aria-live="polite" className={styles.count}>
                  {String(activeIndex + 1).padStart(2, '0')} /{' '}
                  {String(projects.length).padStart(2, '0')}
                </p>
              </div>

              {projects.length > 0 ? (
                <>
                  <div
                    aria-label="Selected projects"
                    className={styles.contactSheet}
                    ref={railRef}
                  >
                    {projects.map((project, index) => {
                      const media = project.media[0]
                      if (!media) return null
                      const active = activeIndex === index
                      return (
                        <motion.article
                          className={styles.projectArticle}
                          data-active={active || undefined}
                          key={project.id}
                          layout
                          transition={reducedMotion ? { duration: 0 } : SPRING}
                        >
                          <motion.button
                            aria-current={active ? 'true' : undefined}
                            aria-label={`Open ${project.title} project details`}
                            className={styles.projectCard}
                            onClick={(event) =>
                              openProject(project, event.currentTarget)
                            }
                            onFocus={() => setActiveIndex(index)}
                            onKeyDown={(event) => onCardKeyDown(event, index)}
                            ref={(node) => {
                              cardRefs.current[index] = node
                            }}
                            style={{
                              '--project-accent': project.accent,
                            } as React.CSSProperties}
                            type="button"
                            whileFocus={reducedMotion ? undefined : { y: -6 }}
                            whileHover={reducedMotion ? undefined : { y: -6 }}
                            whileTap={reducedMotion ? undefined : { scale: 0.992 }}
                          >
                            <motion.div
                              className={styles.mediaShell}
                              layoutId={
                                reducedMotion
                                  ? undefined
                                  : `elastic-media-${project.id}`
                              }
                              transition={SPRING}
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
                            </motion.div>
                          </motion.button>
                        </motion.article>
                      )
                    })}
                  </div>
                  <div className={styles.caption}>
                    <h3>{activeProject?.title}</h3>
                    <p>{activeProject?.description}</p>
                  </div>
                </>
              ) : (
                <p className={styles.empty}>Projects are being prepared.</p>
              )}
            </motion.section>

            <section aria-labelledby="elastic-contact-title" className={styles.contact}>
              <h2 id="elastic-contact-title">
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
            <a href="#elastic-title">Back to top</a>
          </footer>
        </div>

        <AnimatePresence>
          {selectedProject ? (
            <motion.div
              animate={{ opacity: 1 }}
              className={styles.scrim}
              exit={{ opacity: 0 }}
              initial={{ opacity: 0 }}
              key={selectedProject.id}
              onMouseDown={(event) => {
                if (event.target === event.currentTarget) closeProject()
              }}
              transition={{ duration: reducedMotion ? 0.08 : 0.14 }}
            >
              <motion.aside
                animate={{ x: 0, y: 0 }}
                aria-labelledby="elastic-drawer-title"
                aria-modal="true"
                className={styles.drawer}
                exit={{
                  x: reducedMotion ? 0 : '100%',
                  y: reducedMotion ? 0 : '12%',
                }}
                initial={{
                  x: reducedMotion ? 0 : '100%',
                  y: reducedMotion ? 0 : 0,
                }}
                ref={drawerRef}
                role="dialog"
                transition={{
                  duration: reducedMotion ? 0.08 : 0.38,
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
                    ).padStart(2, '0')}{' '}
                    / {String(projects.length).padStart(2, '0')}
                  </p>
                  <h2 id="elastic-drawer-title">{selectedProject.title}</h2>
                  <p>{selectedProject.description}</p>
                </div>

                {selectedProject.media.map((media, index) => (
                  <motion.div
                    className={styles.drawerMedia}
                    key={media.src}
                    layoutId={
                      !reducedMotion && index === 0
                        ? `elastic-media-${selectedProject.id}`
                        : undefined
                    }
                    transition={SPRING}
                  >
                    <ProjectImage
                      eager={index === 0}
                      failed={failedImages}
                      loaded={loadedImages}
                      media={media}
                      naturalRatio
                      onError={markFailed}
                      onLoad={markLoaded}
                      title={selectedProject.title}
                    />
                  </motion.div>
                ))}

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

                {selectedProject.liveHref || selectedProject.repositoryHref ? (
                  <div className={styles.drawerActions}>
                    {selectedProject.liveHref ? (
                      <CutCornerButton
                        href={selectedProject.liveHref}
                        variant="gold"
                      >
                        Visit live project
                      </CutCornerButton>
                    ) : null}
                    {selectedProject.repositoryHref ? (
                      <a href={selectedProject.repositoryHref}>View repository</a>
                    ) : null}
                  </div>
                ) : null}
              </motion.aside>
            </motion.div>
          ) : null}
        </AnimatePresence>
      </div>
    </LayoutGroup>
  )
}
