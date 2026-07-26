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
      aria-busy={!hasLoaded && !hasFailed ? true : undefined}
      className={styles.imageFrame}
      data-natural={natural || undefined}
      style={
        natural
          ? ({ '--media-ratio': `${media.width} / ${media.height}` } as CSSProperties)
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

export function PortfolioQuietMonument() {
  const projects = PORTFOLIO_PROJECTS
  const reducedMotion = Boolean(useReducedMotion())
  const [selectedIndex, setSelectedIndex] = useState<number>()
  const [loadedImages, setLoadedImages] = useState<Set<string>>(() => new Set())
  const [failedImages, setFailedImages] = useState<Set<string>>(() => new Set())
  const projectRefs = useRef<Array<HTMLButtonElement | null>>([])

  const markLoaded = useCallback((src: string) => {
    setLoadedImages((current) => new Set(current).add(src))
  }, [])

  const markFailed = useCallback((src: string) => {
    setFailedImages((current) => new Set(current).add(src))
  }, [])

  useEffect(() => {
    const id = window.location.hash.replace('#project-', '')
    const index = projects.findIndex((project) => project.id === id)
    if (index >= 0) setSelectedIndex(index)
  }, [projects])

  useEffect(() => {
    const nextIndex = Math.min((selectedIndex ?? 0) + 1, projects.length - 1)
    const media = projects[nextIndex]?.media[0]
    if (!media) return

    const preload = document.createElement('link')
    preload.as = 'image'
    preload.href = media.src
    preload.rel = 'preload'
    document.head.append(preload)
    return () => preload.remove()
  }, [projects, selectedIndex])

  useEffect(() => {
    if (selectedIndex === undefined) return

    function closeOnEscape(event: KeyboardEvent) {
      if (event.key !== 'Escape') return
      event.preventDefault()
      closeProject(true)
    }

    document.addEventListener('keydown', closeOnEscape)
    return () => document.removeEventListener('keydown', closeOnEscape)
  }, [selectedIndex])

  function writeHash(index?: number) {
    const url = new URL(window.location.href)
    url.hash = index === undefined ? '' : `project-${projects[index]?.id ?? ''}`
    window.history.replaceState({}, '', url)
  }

  function toggleProject(index: number) {
    if (selectedIndex === index) {
      closeProject(false)
      return
    }

    setSelectedIndex(index)
    writeHash(index)
  }

  function closeProject(restoreFocus: boolean) {
    const previousIndex = selectedIndex
    setSelectedIndex(undefined)
    writeHash()
    if (restoreFocus && previousIndex !== undefined) {
      requestAnimationFrame(() => projectRefs.current[previousIndex]?.focus())
    }
  }

  function focusProject(index: number) {
    const boundedIndex = Math.max(0, Math.min(projects.length - 1, index))
    const project = projectRefs.current[boundedIndex]
    project?.focus()
    project?.scrollIntoView({
      behavior: reducedMotion ? 'instant' : 'smooth',
      block: 'center',
    })
  }

  function onProjectKeyDown(
    event: ReactKeyboardEvent<HTMLButtonElement>,
    index: number,
  ) {
    if (event.key === 'ArrowDown' || event.key === 'ArrowRight') {
      event.preventDefault()
      focusProject(index + 1)
    } else if (event.key === 'ArrowUp' || event.key === 'ArrowLeft') {
      event.preventDefault()
      focusProject(index - 1)
    } else if (event.key === 'Home') {
      event.preventDefault()
      focusProject(0)
    } else if (event.key === 'End') {
      event.preventDefault()
      focusProject(projects.length - 1)
    }
  }

  const currentYear = new Date().getFullYear()

  return (
    <LayoutGroup id="quiet-monument">
      <div className={styles.page}>
        <a className={styles.skipLink} href="#quiet-work">
          Skip to selected work
        </a>

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
            animate={{ opacity: 1 }}
            aria-labelledby="quiet-title"
            className={styles.hero}
            initial={reducedMotion ? false : { opacity: 0.98 }}
            transition={{ duration: reducedMotion ? 0.08 : 0.18 }}
          >
            <p className={styles.eyebrow}>Mo Ibrahim · Design engineer</p>
            <h1 id="quiet-title">Useful products, carefully made.</h1>
            <div className={styles.heroCopy}>
              <p>{PORTFOLIO_BIO}</p>
              <CutCornerButton href={PORTFOLIO_LINKS.cal} variant="navy">
                Schedule a call
              </CutCornerButton>
            </div>
          </motion.section>

          <motion.section
            animate={{ opacity: 1, y: 0 }}
            aria-labelledby="quiet-work"
            className={styles.work}
            initial={reducedMotion ? false : { opacity: 0.98, y: 6 }}
            transition={{ duration: reducedMotion ? 0.08 : 0.26, ease: EASE }}
          >
            <div className={styles.workHeading}>
              <div>
                <p>WORK</p>
                <h2 id="quiet-work">Selected projects</h2>
              </div>
              <p>Choose a window · use ↑ and ↓</p>
            </div>

            {projects.length > 0 ? (
              <div className={styles.wallLayout}>
                <nav aria-label="Project index" className={styles.projectIndex}>
                  <p>Index</p>
                  <ol>
                    {projects.map((project, index) => (
                      <li key={project.id}>
                        <button
                          aria-current={selectedIndex === index ? 'true' : undefined}
                          onClick={() => focusProject(index)}
                          type="button"
                        >
                          <span>{String(index + 1).padStart(2, '0')}</span>
                          <span>{project.title}</span>
                        </button>
                      </li>
                    ))}
                  </ol>
                </nav>

                <div className={styles.monumentList}>
                  {projects.map((project, index) => {
                    const heroMedia = project.media[0]
                    const selected = selectedIndex === index
                    if (!heroMedia) return null

                    return (
                      <motion.article
                        className={styles.project}
                        data-selected={selected || undefined}
                        id={`monument-${project.id}`}
                        key={project.id}
                        layout="position"
                        style={
                          {
                            '--project-accent': project.accent,
                          } as CSSProperties
                        }
                        transition={
                          reducedMotion
                            ? { layout: { duration: 0 } }
                            : {
                                layout: {
                                  damping: 35,
                                  stiffness: 330,
                                  type: 'spring',
                                },
                              }
                        }
                      >
                        <motion.button
                          aria-controls={`exhibit-${project.id}`}
                          aria-expanded={selected}
                          aria-label={`${selected ? 'Close' : 'Open'} ${project.title} project details`}
                          className={styles.projectButton}
                          onClick={() => toggleProject(index)}
                          onKeyDown={(event) => onProjectKeyDown(event, index)}
                          ref={(node) => {
                            projectRefs.current[index] = node
                          }}
                          type="button"
                          whileFocus={reducedMotion ? undefined : { y: -3 }}
                          whileHover={reducedMotion ? undefined : { y: -3 }}
                          whileTap={
                            reducedMotion
                              ? undefined
                              : { scale: 0.996, transition: { duration: 0.07 } }
                          }
                        >
                          <ProjectImage
                            eager={index === 0}
                            failed={failedImages}
                            loaded={loadedImages}
                            media={heroMedia}
                            onError={markFailed}
                            onLoad={markLoaded}
                            title={project.title}
                          />
                        </motion.button>

                        <div className={styles.caption}>
                          <span aria-hidden="true" className={styles.accentRule} />
                          <div>
                            <h3>{project.title}</h3>
                            <p>{project.description}</p>
                          </div>
                          <p className={styles.number}>
                            {String(index + 1).padStart(2, '0')} /{' '}
                            {String(projects.length).padStart(2, '0')}
                          </p>
                        </div>

                        <AnimatePresence initial={false}>
                          {selected ? (
                            <motion.div
                              animate={{ opacity: 1, y: 0 }}
                              className={styles.exhibit}
                              exit={{ opacity: 0, y: reducedMotion ? 0 : -4 }}
                              id={`exhibit-${project.id}`}
                              initial={{ opacity: 0, y: reducedMotion ? 0 : -8 }}
                              transition={{
                                duration: reducedMotion ? 0.08 : 0.24,
                                ease: EASE,
                              }}
                            >
                              <div className={styles.exhibitHeader}>
                                <div>
                                  <p className={styles.exhibitLabel}>Project details</p>
                                  <h4>{project.title}</h4>
                                  <p>{project.description}</p>
                                </div>
                                <button
                                  aria-label={`Close ${project.title} project details`}
                                  className={styles.closeButton}
                                  onClick={() => closeProject(true)}
                                  type="button"
                                >
                                  Close
                                </button>
                              </div>

                              {project.media.length > 1 ? (
                                <div
                                  aria-label={`${project.title} gallery`}
                                  className={styles.gallery}
                                  role="group"
                                >
                                  {project.media.slice(1).map((media) => (
                                    <ProjectImage
                                      failed={failedImages}
                                      key={media.src}
                                      loaded={loadedImages}
                                      media={media}
                                      natural
                                      onError={markFailed}
                                      onLoad={markLoaded}
                                      title={project.title}
                                    />
                                  ))}
                                </div>
                              ) : null}

                              {project.collaborators.length > 0 ? (
                                <section
                                  aria-labelledby={`collaborators-${project.id}`}
                                  className={styles.collaborators}
                                >
                                  <h4 id={`collaborators-${project.id}`}>
                                    Collaborators
                                  </h4>
                                  <ul>
                                    {project.collaborators.map((collaborator) => (
                                      <li key={collaborator}>{collaborator}</li>
                                    ))}
                                  </ul>
                                </section>
                              ) : null}

                              {project.liveHref || project.repositoryHref ? (
                                <div className={styles.projectActions}>
                                  {project.liveHref ? (
                                    <CutCornerButton href={project.liveHref} variant="gold">
                                      Visit live project
                                    </CutCornerButton>
                                  ) : null}
                                  {project.repositoryHref ? (
                                    <a href={project.repositoryHref}>View repository</a>
                                  ) : null}
                                </div>
                              ) : null}
                            </motion.div>
                          ) : null}
                        </AnimatePresence>
                      </motion.article>
                    )
                  })}
                </div>
              </div>
            ) : (
              <p className={styles.empty}>Projects are being prepared.</p>
            )}
          </motion.section>

          <section aria-labelledby="quiet-contact" className={styles.contact}>
            <h2 id="quiet-contact">
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
          <a href="#quiet-title">Back to top</a>
        </footer>
      </div>
    </LayoutGroup>
  )
}
