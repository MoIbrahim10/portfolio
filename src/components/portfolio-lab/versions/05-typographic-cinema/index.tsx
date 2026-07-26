import { AnimatePresence, motion, useReducedMotion } from 'motion/react'
import {
  type CSSProperties,
  type KeyboardEvent as ReactKeyboardEvent,
  type RefObject,
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

const CUT_EASE = [0.22, 1, 0.36, 1] as const
const MOBILE_QUERY = '(max-width: 779px)'

interface ProjectImageProps {
  className?: string
  eager?: boolean
  failed: boolean
  loaded: boolean
  media: PortfolioMedia
  onError: () => void
  onLoad: () => void
}

function ProjectImage({
  className = '',
  eager = false,
  failed,
  loaded,
  media,
  onError,
  onLoad,
}: ProjectImageProps) {
  return (
    <div
      aria-busy={!loaded && !failed}
      className={`${styles.mediaFrame} ${className}`}
      style={{ '--media-ratio': `${media.width} / ${media.height}` } as CSSProperties}
    >
      {!loaded && !failed ? (
        <span aria-hidden="true" className={styles.mediaLoading} />
      ) : null}
      {failed ? (
        <p className={styles.mediaError}>
          <span aria-hidden="true">×</span>
          Preview unavailable.
        </p>
      ) : (
        <img
          alt={media.alt}
          className={loaded ? styles.imageLoaded : ''}
          decoding="async"
          height={media.height}
          loading={eager ? 'eager' : 'lazy'}
          onError={onError}
          onLoad={onLoad}
          src={media.src}
          width={media.width}
        />
      )}
    </div>
  )
}

interface IntermissionProps {
  closeRef: RefObject<HTMLButtonElement | null>
  detailsRef: RefObject<HTMLElement | null>
  failedImages: Set<string>
  loadedImages: Set<string>
  markFailed: (src: string) => void
  markLoaded: (src: string) => void
  mobile: boolean
  onClose: () => void
  project: PortfolioProject
  shouldReduceMotion: boolean
}

function Intermission({
  closeRef,
  detailsRef,
  failedImages,
  loadedImages,
  markFailed,
  markLoaded,
  mobile,
  onClose,
  project,
  shouldReduceMotion,
}: IntermissionProps) {
  const hero = project.media[0]
  const gallery = project.media.slice(1)

  return (
    <motion.section
      ref={detailsRef}
      aria-labelledby={`cinema-detail-${project.id}`}
      className={styles.intermission}
      initial={shouldReduceMotion ? false : { opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: shouldReduceMotion ? 0 : 0.14 }}
    >
      <div className={styles.intermissionHeader}>
        <p className={styles.credit}>Intermission · selected project</p>
        <button
          ref={closeRef}
          className={styles.closeButton}
          onClick={onClose}
          type="button"
        >
          <span aria-hidden="true">×</span>
          Close details
        </button>
      </div>

      <div className={styles.intermissionGrid}>
        {hero ? (
          <motion.div
            className={styles.intermissionHero}
            layoutId={mobile ? undefined : `cinema-frame-${project.id}`}
            transition={{
              duration: shouldReduceMotion ? 0 : undefined,
              type: shouldReduceMotion ? 'tween' : 'spring',
              stiffness: 320,
              damping: 34,
              mass: 0.8,
            }}
          >
            <ProjectImage
              className={styles.intermissionImage}
              eager
              failed={failedImages.has(hero.src)}
              loaded={loadedImages.has(hero.src)}
              media={hero}
              onError={() => markFailed(hero.src)}
              onLoad={() => markLoaded(hero.src)}
            />
          </motion.div>
        ) : null}

        <motion.div
          className={styles.intermissionCopy}
          initial={shouldReduceMotion ? false : { opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{
            delay: shouldReduceMotion ? 0 : 0.12,
            duration: shouldReduceMotion ? 0 : 0.24,
          }}
        >
          <h3 id={`cinema-detail-${project.id}`}>{project.title}</h3>
          <p>{project.description}</p>

          {project.collaborators.length > 0 ? (
            <div className={styles.detailBlock}>
              <h4>Collaborators</h4>
              <ul>
                {project.collaborators.map((collaborator) => (
                  <li key={collaborator}>{collaborator}</li>
                ))}
              </ul>
            </div>
          ) : null}

          {project.liveHref || project.repositoryHref ? (
            <div className={styles.detailActions}>
              {project.liveHref ? (
                <CutCornerButton href={project.liveHref} variant="gold">
                  Visit live project
                </CutCornerButton>
              ) : null}
              {project.repositoryHref ? (
                <a className={styles.repositoryLink} href={project.repositoryHref}>
                  View repository <span aria-hidden="true">↗</span>
                </a>
              ) : null}
            </div>
          ) : null}
        </motion.div>
      </div>

      {gallery.length > 0 ? (
        <div aria-label={`${project.title} gallery`} className={styles.gallery}>
          {gallery.map((media) => (
            <motion.figure
              key={media.src}
              initial={shouldReduceMotion ? false : { opacity: 0, y: 8 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: shouldReduceMotion ? 0 : 0.24 }}
              viewport={{ amount: 0.15, once: true }}
            >
              <ProjectImage
                failed={failedImages.has(media.src)}
                loaded={loadedImages.has(media.src)}
                media={media}
                onError={() => markFailed(media.src)}
                onLoad={() => markLoaded(media.src)}
              />
            </motion.figure>
          ))}
        </div>
      ) : null}
    </motion.section>
  )
}

function useMobileComposition() {
  const [isMobile, setIsMobile] = useState(false)

  useEffect(() => {
    const query = window.matchMedia(MOBILE_QUERY)
    const update = () => setIsMobile(query.matches)
    update()
    query.addEventListener('change', update)
    return () => query.removeEventListener('change', update)
  }, [])

  return isMobile
}

function projectStyle(project: PortfolioProject) {
  return { '--project-accent': project.accent } as CSSProperties
}

export function PortfolioTypographicCinema() {
  const shouldReduceMotion = useReducedMotion() ?? false
  const isMobile = useMobileComposition()
  const projects = PORTFOLIO_PROJECTS
  const [activeIndex, setActiveIndex] = useState(0)
  const [announcedProject, setAnnouncedProject] = useState(projects[0]?.title ?? '')
  const [selectedProject, setSelectedProject] = useState<PortfolioProject>()
  const [loadedImages, setLoadedImages] = useState<Set<string>>(() => new Set())
  const [failedImages, setFailedImages] = useState<Set<string>>(() => new Set())
  const [keyboardCut, setKeyboardCut] = useState(false)
  const chapterRefs = useRef<Array<HTMLElement | null>>([])
  const cueRefs = useRef<Array<HTMLButtonElement | null>>([])
  const triggerRef = useRef<HTMLButtonElement | null>(null)
  const closeRef = useRef<HTMLButtonElement>(null)
  const detailsRef = useRef<HTMLElement>(null)
  const openScrollRef = useRef(0)
  const restoreAfterExitRef = useRef(false)

  const activeProject = projects[activeIndex]
  const activeMedia = activeProject?.media[0]
  const adjacentMedia = projects[activeIndex + 1]?.media[0]

  useEffect(() => {
    if (selectedProject || projects.length === 0) return

    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((entry) => entry.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0]
        if (!visible) return

        const index = chapterRefs.current.findIndex(
          (chapter) => chapter === visible.target,
        )
        if (index < 0) return

        setActiveIndex(index)
        window.history.replaceState(null, '', `#work-${projects[index].id}`)
      },
      { rootMargin: '-45% 0px -45% 0px', threshold: [0, 0.5, 1] },
    )

    chapterRefs.current.forEach((chapter) => {
      if (chapter) observer.observe(chapter)
    })
    return () => observer.disconnect()
  }, [projects, selectedProject])

  useEffect(() => {
    if (!activeProject) return
    const timeout = window.setTimeout(
      () => setAnnouncedProject(activeProject.title),
      shouldReduceMotion || keyboardCut ? 0 : 380,
    )
    return () => window.clearTimeout(timeout)
  }, [activeProject, keyboardCut, shouldReduceMotion])

  useEffect(() => {
    if (!selectedProject) return

    closeRef.current?.focus({ preventScroll: true })
    detailsRef.current?.scrollIntoView({
      behavior: shouldReduceMotion ? 'auto' : 'smooth',
      block: 'start',
    })

    function closeOnEscape(event: KeyboardEvent) {
      if (event.key !== 'Escape') return
      event.preventDefault()
      closeProject()
    }

    document.addEventListener('keydown', closeOnEscape)
    return () => document.removeEventListener('keydown', closeOnEscape)
  }, [selectedProject, shouldReduceMotion])

  function markLoaded(src: string) {
    setLoadedImages((current) => {
      if (current.has(src)) return current
      return new Set(current).add(src)
    })
  }

  function markFailed(src: string) {
    setFailedImages((current) => {
      if (current.has(src)) return current
      return new Set(current).add(src)
    })
  }

  function focusChapter(index: number) {
    const nextIndex = Math.max(0, Math.min(projects.length - 1, index))
    setKeyboardCut(true)
    setActiveIndex(nextIndex)
    cueRefs.current[nextIndex]?.focus()
    chapterRefs.current[nextIndex]?.scrollIntoView({
      behavior: 'auto',
      block: 'center',
    })
    window.requestAnimationFrame(() => setKeyboardCut(false))
  }

  function onCueKeyDown(
    event: ReactKeyboardEvent<HTMLButtonElement>,
    index: number,
    project: PortfolioProject,
  ) {
    const destinations: Record<string, number> = {
      ArrowDown: index + 1,
      ArrowUp: index - 1,
      End: projects.length - 1,
      Home: 0,
    }
    const destination = destinations[event.key]
    if (destination !== undefined) {
      event.preventDefault()
      focusChapter(destination)
      return
    }
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault()
      openProject(project, event.currentTarget)
    }
  }

  function cueProject(index: number) {
    setActiveIndex(index)
    chapterRefs.current[index]?.scrollIntoView({
      behavior: shouldReduceMotion ? 'auto' : 'smooth',
      block: 'center',
    })
  }

  function openProject(project: PortfolioProject, trigger: HTMLButtonElement) {
    triggerRef.current = trigger
    openScrollRef.current = window.scrollY
    setSelectedProject(project)
    window.history.replaceState(null, '', `#project-${project.id}`)
  }

  function closeProject() {
    restoreAfterExitRef.current = true
    setSelectedProject(undefined)
    if (activeProject) {
      window.history.replaceState(null, '', `#work-${activeProject.id}`)
    }
  }

  function restoreAfterExit() {
    if (!restoreAfterExitRef.current) return
    restoreAfterExitRef.current = false
    window.scrollTo({ behavior: 'instant', top: openScrollRef.current })
    triggerRef.current?.focus({ preventScroll: true })
  }

  const intermission = selectedProject ? (
    <Intermission
      closeRef={closeRef}
      detailsRef={detailsRef}
      failedImages={failedImages}
      loadedImages={loadedImages}
      markFailed={markFailed}
      markLoaded={markLoaded}
      mobile={isMobile}
      onClose={closeProject}
      project={selectedProject}
      shouldReduceMotion={shouldReduceMotion}
    />
  ) : null

  return (
    <div className={styles.page}>
      <header className={styles.masthead}>
        <a aria-label="Go to portfolio home" className={styles.logoLink} href="/">
          <AnimatedLogo animateOnMount={false} className={styles.logo} />
        </a>
        <nav aria-label="Portfolio links" className={styles.primaryNav}>
          <a href={PORTFOLIO_LINKS.x}>X</a>
          <a href={PORTFOLIO_LINKS.github}>GitHub</a>
          <CutCornerButton href={PORTFOLIO_LINKS.cal} variant="paper">
            Schedule
          </CutCornerButton>
        </nav>
      </header>

      <main>
        <section aria-labelledby="cinema-title" className={styles.hero}>
          <div>
            <p className={styles.eyebrow}>Independent design engineer · Cairo</p>
            <h1 id="cinema-title">
              Thoughtful products,
              <br />
              cut clean.
            </h1>
          </div>
          <div className={styles.heroCopy}>
            <p>{PORTFOLIO_BIO}</p>
            <CutCornerButton href={PORTFOLIO_LINKS.cal} variant="navy">
              Schedule a call
            </CutCornerButton>
          </div>
        </section>

        <section aria-labelledby="selected-work-title" className={styles.work}>
          <div className={styles.workHeading}>
            <div>
              <p className={styles.credit}>Screening · 06 scenes</p>
              <h2 id="selected-work-title">Selected work</h2>
            </div>
            <p className={styles.instructions}>
              Scroll scenes · use arrows · Enter opens
            </p>
          </div>

          {projects.length === 0 ? (
            <p className={styles.emptyState}>Projects are being prepared.</p>
          ) : (
            <>
              <div
                className={`${styles.screening} ${
                  selectedProject ? styles.screeningDimmed : ''
                }`}
              >
                <div className={styles.stageColumn}>
                  <motion.div
                    className={styles.stage}
                    initial={shouldReduceMotion ? false : { opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{
                      duration: shouldReduceMotion ? 0 : 0.28,
                      ease: CUT_EASE,
                    }}
                  >
                    <div className={styles.screen}>
                      <AnimatePresence initial={false} mode="sync">
                        {!selectedProject && activeProject && activeMedia ? (
                          <motion.div
                            key={activeProject.id}
                            className={styles.screenCut}
                            layoutId={`cinema-frame-${activeProject.id}`}
                            initial={
                              shouldReduceMotion || keyboardCut
                                ? false
                                : { clipPath: 'inset(0 100% 0 0)', opacity: 0.98 }
                            }
                            animate={{
                              clipPath: 'inset(0 0% 0 0)',
                              opacity: 1,
                            }}
                            exit={{
                              opacity: shouldReduceMotion || keyboardCut ? 1 : 0,
                            }}
                            transition={{
                              clipPath: {
                                duration: shouldReduceMotion || keyboardCut ? 0 : 0.36,
                                ease: CUT_EASE,
                              },
                              opacity: {
                                delay: shouldReduceMotion || keyboardCut ? 0 : 0.24,
                                duration: shouldReduceMotion || keyboardCut ? 0 : 0.12,
                              },
                            }}
                          >
                            <ProjectImage
                              className={styles.stageImage}
                              eager={activeIndex === 0}
                              failed={failedImages.has(activeMedia.src)}
                              loaded={loadedImages.has(activeMedia.src)}
                              media={activeMedia}
                              onError={() => markFailed(activeMedia.src)}
                              onLoad={() => markLoaded(activeMedia.src)}
                            />
                          </motion.div>
                        ) : (
                          <div aria-hidden="true" className={styles.screenRest} />
                        )}
                      </AnimatePresence>
                    </div>

                    <div className={styles.stageCaption} aria-hidden="true">
                      <AnimatePresence initial={false} mode="wait">
                        {activeProject ? (
                          <motion.p
                            key={activeProject.id}
                            initial={
                              shouldReduceMotion || keyboardCut
                                ? false
                                : { opacity: 0 }
                            }
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            transition={{
                              duration: shouldReduceMotion || keyboardCut ? 0 : 0.14,
                            }}
                          >
                            <span>
                              {String(activeIndex + 1).padStart(2, '0')} /{' '}
                              {String(projects.length).padStart(2, '0')}
                            </span>
                            {activeProject.title}
                          </motion.p>
                        ) : null}
                      </AnimatePresence>
                    </div>

                    {adjacentMedia ? (
                      <img
                        alt=""
                        aria-hidden="true"
                        className={styles.preload}
                        decoding="async"
                        height={adjacentMedia.height}
                        loading="eager"
                        src={adjacentMedia.src}
                        width={adjacentMedia.width}
                      />
                    ) : null}
                  </motion.div>
                </div>

                <div className={styles.shotList}>
                  {projects.map((project, index) => {
                    const media = project.media[0]
                    const isActive = activeIndex === index
                    const isSelected = selectedProject?.id === project.id
                    const projectSummary = (
                      <>
                        {media ? (
                          <div className={styles.mobileMedia}>
                            <ProjectImage
                              eager={index === 0}
                              failed={failedImages.has(media.src)}
                              loaded={loadedImages.has(media.src)}
                              media={media}
                              onError={() => markFailed(media.src)}
                              onLoad={() => markLoaded(media.src)}
                            />
                          </div>
                        ) : null}

                        <div className={styles.chapterCue}>
                          <span className={styles.chapterMarker} aria-hidden="true" />
                          <span className={styles.chapterCount}>
                            {String(index + 1).padStart(2, '0')}
                          </span>
                          <span className={styles.chapterText}>
                            <h3>
                              <button
                                ref={(node) => {
                                  cueRefs.current[index] = node
                                }}
                                aria-current={isActive ? 'true' : undefined}
                                className={styles.chapterTitleButton}
                                onClick={() => cueProject(index)}
                                onKeyDown={(event) =>
                                  onCueKeyDown(event, index, project)
                                }
                                type="button"
                              >
                                {project.title}
                              </button>
                            </h3>
                            <span>{project.description}</span>
                          </span>
                        </div>

                        <button
                          className={styles.openButton}
                          onClick={(event) =>
                            openProject(project, event.currentTarget)
                          }
                          type="button"
                        >
                          Open project <span aria-hidden="true">↘</span>
                        </button>
                      </>
                    )

                    return (
                      <article
                        key={project.id}
                        ref={(node) => {
                          chapterRefs.current[index] = node
                        }}
                        className={`${styles.chapter} ${
                          isActive ? styles.chapterActive : ''
                        }`}
                        style={projectStyle(project)}
                      >
                        {isMobile ? (
                          <AnimatePresence mode="wait" onExitComplete={restoreAfterExit}>
                            {isSelected ? (
                              intermission
                            ) : (
                              <motion.div
                                key={`summary-${project.id}`}
                                className={styles.chapterSummary}
                              >
                                {projectSummary}
                              </motion.div>
                            )}
                          </AnimatePresence>
                        ) : (
                          projectSummary
                        )}
                      </article>
                    )
                  })}
                </div>
              </div>

              {!isMobile ? (
                <AnimatePresence mode="wait" onExitComplete={restoreAfterExit}>
                  {intermission}
                </AnimatePresence>
              ) : null}
            </>
          )}

          <p aria-live="polite" className={styles.srOnly}>
            Showing {announcedProject}
          </p>
        </section>

        <section aria-labelledby="cinema-contact" className={styles.contact}>
          <div>
            <p className={styles.credit}>Contact</p>
            <h2 id="cinema-contact">
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
        <div className={styles.footerIdentity}>
          <a aria-label="Go to portfolio home" className={styles.footerLogoLink} href="/">
            <AnimatedLogo animateOnMount={false} className={styles.footerLogo} />
          </a>
          <p>Mo Ibrahim · Design and code with care.</p>
        </div>
        <p>{new Date().getFullYear()} · Cairo, Egypt</p>
        <a href="#cinema-title">Back to start</a>
      </footer>
    </div>
  )
}
