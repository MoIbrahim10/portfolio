import {
  type CSSProperties,
  type KeyboardEvent,
  type UIEvent,
  useEffect,
  useRef,
  useState,
} from 'react'
import { AnimatePresence, motion, useReducedMotion } from 'motion/react'

import { CutCornerButton } from '../../../project-lab/shared/CutCornerButton'
import { ProjectImage } from '../../shared/ProjectImage'
import type {
  SliderDirectionMetadata,
  SliderDirectionProps,
} from '../../shared/types'

import styles from './styles.module.css'

export const metadata = {
  description:
    'A minimal snap-driven screening room: image-first project scenes, concise credits, a square projector cue strip, and restrained film-light palette transitions.',
  id: '09-cinematic-stage',
  name: 'Cinematic Stage',
  skill: {
    name: 'ui-animation',
    url: 'https://www.skills.sh/mblode/agent-skills/ui-animation',
  },
} satisfies SliderDirectionMetadata

type NavigationMode = 'keyboard' | 'pointer' | 'scroll'

function LoadingState() {
  return (
    <section
      aria-busy="true"
      aria-label="Cinematic Stage projects are loading"
      className={`${styles.root} ${styles.loading}`}
    >
      <header className={styles.loadingHeader}>
        <span className={`${styles.skeleton} ${styles.loadingLabel}`} />
        <div className={styles.loadingCues}>
          {Array.from({ length: 6 }, (_, index) => (
            <span className={`${styles.skeleton} ${styles.loadingCue}`} key={index} />
          ))}
        </div>
      </header>
      <article className={styles.loadingScene}>
        <span className={`${styles.skeleton} ${styles.loadingMedia}`} />
        <div className={styles.loadingCredits}>
          <span className={`${styles.skeleton} ${styles.loadingKicker}`} />
          <span className={`${styles.skeleton} ${styles.loadingTitle}`} />
          <span className={`${styles.skeleton} ${styles.loadingLine}`} />
          <span className={`${styles.skeleton} ${styles.loadingLineShort}`} />
        </div>
      </article>
      <span className={styles.srOnly} role="status">
        Loading projects
      </span>
    </section>
  )
}

function EmptyState() {
  return (
    <section className={`${styles.root} ${styles.empty}`}>
      <span aria-hidden="true" className={styles.emptySun} />
      <p className={styles.eyebrow}>Cinematic Stage</p>
      <h2>The screen is waiting.</h2>
      <p>Add a project to begin the first scene.</p>
    </section>
  )
}

export function CinematicStageDirection({
  projects,
  state = 'ready',
}: SliderDirectionProps) {
  const [activeIndex, setActiveIndex] = useState(0)
  const [navigationMode, setNavigationMode] = useState<NavigationMode>('scroll')
  const viewportRef = useRef<HTMLDivElement>(null)
  const projectRefs = useRef<Array<HTMLElement | null>>([])
  const tabRefs = useRef<Array<HTMLButtonElement | null>>([])
  const scrollFrameRef = useRef<number | null>(null)
  const reduceMotion = useReducedMotion()

  useEffect(() => {
    if (projects.length > 0 && activeIndex >= projects.length) setActiveIndex(0)
  }, [activeIndex, projects.length])

  useEffect(
    () => () => {
      if (scrollFrameRef.current !== null) cancelAnimationFrame(scrollFrameRef.current)
    },
    [],
  )

  if (state === 'loading') return <LoadingState />
  if (state === 'empty' || projects.length === 0) return <EmptyState />

  const resolvedIndex = Math.min(activeIndex, projects.length - 1)
  const activeProject = projects[resolvedIndex]
  const motionIsOff = Boolean(reduceMotion) || navigationMode === 'keyboard'
  const rootStyle = {
    '--stage-accent': activeProject.palette.accent,
    '--stage-background': activeProject.palette.background,
    '--stage-foreground': activeProject.palette.foreground,
    '--stage-surface': activeProject.palette.surface,
  } as CSSProperties

  const goToProject = (index: number, mode: NavigationMode) => {
    const nextIndex = Math.max(0, Math.min(index, projects.length - 1))
    const viewport = viewportRef.current
    const project = projectRefs.current[nextIndex]

    setNavigationMode(mode)
    setActiveIndex(nextIndex)

    if (!viewport || !project) return
    viewport.scrollTo({
      behavior: reduceMotion || mode === 'keyboard' ? 'auto' : 'smooth',
      left: project.offsetLeft,
    })
  }

  const indexFromKey = (key: string) => {
    if (key === 'ArrowRight') return resolvedIndex + 1
    if (key === 'ArrowLeft') return resolvedIndex - 1
    if (key === 'Home') return 0
    if (key === 'End') return projects.length - 1
    return null
  }

  const handleTabKeyDown = (event: KeyboardEvent<HTMLButtonElement>) => {
    const requestedIndex = indexFromKey(event.key)
    if (requestedIndex === null) return

    event.preventDefault()
    const nextIndex = Math.max(0, Math.min(requestedIndex, projects.length - 1))
    goToProject(nextIndex, 'keyboard')
    tabRefs.current[nextIndex]?.focus()
  }

  const handleViewportKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
    const requestedIndex = indexFromKey(event.key)
    if (requestedIndex === null) return

    event.preventDefault()
    goToProject(requestedIndex, 'keyboard')
  }

  const handleScroll = (event: UIEvent<HTMLDivElement>) => {
    if (scrollFrameRef.current !== null) cancelAnimationFrame(scrollFrameRef.current)
    const viewport = event.currentTarget

    scrollFrameRef.current = requestAnimationFrame(() => {
      const viewportCenter = viewport.scrollLeft + viewport.clientWidth / 2
      let nearestIndex = 0
      let nearestDistance = Number.POSITIVE_INFINITY

      projectRefs.current.forEach((project, index) => {
        if (!project) return
        const projectCenter = project.offsetLeft + project.offsetWidth / 2
        const distance = Math.abs(viewportCenter - projectCenter)
        if (distance < nearestDistance) {
          nearestDistance = distance
          nearestIndex = index
        }
      })

      setNavigationMode('scroll')
      setActiveIndex(nearestIndex)
      scrollFrameRef.current = null
    })
  }

  return (
    <section className={styles.root} data-motion={motionIsOff ? 'off' : 'on'} style={rootStyle}>
      <div aria-hidden="true" className={styles.backgroundStage}>
        <AnimatePresence initial={false} mode="sync">
          <motion.div
            animate={{ clipPath: 'inset(0 0 0 0)', opacity: 1 }}
            className={styles.sceneWash}
            exit={{ opacity: motionIsOff ? 0 : 0.18 }}
            initial={{
              clipPath: motionIsOff ? 'inset(0 0 0 0)' : 'inset(0 0 0 100%)',
              opacity: 1,
            }}
            key={activeProject.slug}
            style={{
              background: `linear-gradient(112deg, ${activeProject.palette.background} 0 54%, ${activeProject.palette.surface} 100%)`,
            }}
            transition={{
              clipPath: {
                duration: motionIsOff ? 0 : 0.42,
                ease: [0.22, 1, 0.36, 1],
              },
              opacity: { duration: motionIsOff ? 0 : 0.14 },
            }}
          />
        </AnimatePresence>
        <AnimatePresence initial={false}>
          <motion.span
            animate={{ opacity: motionIsOff ? 0 : [0, 0.56, 0], x: '270%' }}
            className={styles.lightSweep}
            initial={{ opacity: 0, x: '-110%' }}
            key={`sweep-${activeProject.slug}`}
            transition={{ duration: motionIsOff ? 0 : 0.5, ease: [0.25, 1, 0.5, 1] }}
          />
        </AnimatePresence>
        <span className={styles.solarDisc} />
        <span className={styles.stageLines} />
      </div>

      <header className={styles.header}>
        <div className={styles.identity}>
          <span aria-hidden="true" className={styles.identityStep} />
          <div>
            <p className={styles.eyebrow}>Selected projects</p>
            <h2>Cinematic Stage</h2>
          </div>
        </div>

        <div aria-label="Choose a project" className={styles.cueStrip} role="tablist">
          {projects.map((project, index) => (
            <button
              aria-controls={`cinematic-stage-panel-${project.slug}`}
              aria-label={`Show ${project.name}`}
              aria-selected={index === resolvedIndex}
              className={styles.cue}
              id={`cinematic-stage-tab-${project.slug}`}
              key={project.slug}
              onClick={() => goToProject(index, 'pointer')}
              onKeyDown={handleTabKeyDown}
              ref={(node) => {
                tabRefs.current[index] = node
              }}
              role="tab"
              tabIndex={index === resolvedIndex ? 0 : -1}
              type="button"
            >
              <ProjectImage eager={index < 2} project={project} />
              <span aria-hidden="true" className={styles.cueTint} />
            </button>
          ))}
        </div>

        <p aria-live="polite" className={styles.counter}>
          <span>{String(resolvedIndex + 1).padStart(2, '0')}</span>
          <span aria-hidden="true"> / </span>
          <span className={styles.srOnly}>of </span>
          {String(projects.length).padStart(2, '0')}
        </p>
      </header>

      <div
        aria-label="Project scenes"
        aria-roledescription="carousel"
        className={styles.viewport}
        onKeyDown={handleViewportKeyDown}
        onScroll={handleScroll}
        ref={viewportRef}
        tabIndex={0}
      >
        <div className={styles.track}>
          {projects.map((project, index) => (
            <article
              aria-labelledby={`cinematic-stage-title-${project.slug}`}
              aria-roledescription="slide"
              className={styles.scene}
              id={`cinematic-stage-panel-${project.slug}`}
              key={project.slug}
              ref={(node) => {
                projectRefs.current[index] = node
              }}
              role="tabpanel"
            >
              <div className={styles.projection}>
                <div className={styles.projectionImage}>
                  <ProjectImage eager={index === 0} project={project} />
                </div>
                <span aria-hidden="true" className={styles.frameNumber}>
                  Scene {String(index + 1).padStart(2, '0')}
                </span>
              </div>

              <div className={styles.credits}>
                <p className={styles.sceneLabel}>Now showing</p>
                <h3 id={`cinematic-stage-title-${project.slug}`}>{project.name}</h3>
                <p className={styles.description}>{project.description}</p>

                {project.collaborators.length > 0 && (
                  <div className={styles.collaborators}>
                    <p>With</p>
                    <ul>
                      {project.collaborators.map((collaborator) => (
                        <li key={collaborator}>{collaborator}</li>
                      ))}
                    </ul>
                  </div>
                )}

                {project.href && (
                  <CutCornerButton href={project.href} variant="gold">
                    View project
                  </CutCornerButton>
                )}
              </div>
            </article>
          ))}
        </div>
      </div>

      <footer className={styles.footer}>
        <span>Scroll horizontally</span>
        <span aria-hidden="true" className={styles.progressTrack}>
          <motion.span
            animate={{ scaleX: (resolvedIndex + 1) / projects.length }}
            className={styles.progressValue}
            transition={{ duration: motionIsOff ? 0 : 0.24, ease: [0.25, 1, 0.5, 1] }}
          />
        </span>
        <span>Use arrows</span>
      </footer>
    </section>
  )
}
