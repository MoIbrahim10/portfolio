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
    'A native horizontal snap gallery where projects occupy shallow architectural planes, image tabs act as depth chips, and the background horizon shifts with each selection.',
  id: '07-dimensional-slide-stack',
  name: 'Dimensional Slide Stack',
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
      aria-label="Dimensional Slide Stack projects are loading"
      className={`${styles.root} ${styles.loading}`}
    >
      <div className={styles.loadingHeader}>
        <span className={`${styles.skeleton} ${styles.loadingLabel}`} />
        <div className={styles.loadingTabs}>
          {Array.from({ length: 6 }, (_, index) => (
            <span className={`${styles.skeleton} ${styles.loadingTab}`} key={index} />
          ))}
        </div>
      </div>
      <article className={styles.loadingPlane}>
        <div className={`${styles.skeleton} ${styles.loadingImage}`} />
        <div className={styles.loadingCopy}>
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
      <span aria-hidden="true" className={styles.emptyPlane} />
      <p className={styles.eyebrow}>Dimensional Slide Stack</p>
      <h2>No planes in view.</h2>
      <p>Add a project to begin the sequence.</p>
    </section>
  )
}

export function DimensionalSlideStackDirection({
  projects,
  state = 'ready',
}: SliderDirectionProps) {
  const [activeIndex, setActiveIndex] = useState(0)
  const [direction, setDirection] = useState(1)
  const [navigationMode, setNavigationMode] =
    useState<NavigationMode>('scroll')
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
    '--stack-accent': activeProject.palette.accent,
    '--stack-background': activeProject.palette.background,
    '--stack-foreground': activeProject.palette.foreground,
    '--stack-surface': activeProject.palette.surface,
  } as CSSProperties

  const updateActive = (nextIndex: number, mode: NavigationMode) => {
    const boundedIndex = Math.max(0, Math.min(nextIndex, projects.length - 1))
    setDirection(boundedIndex >= resolvedIndex ? 1 : -1)
    setNavigationMode(mode)
    setActiveIndex(boundedIndex)
    return boundedIndex
  }

  const goToProject = (nextIndex: number, mode: NavigationMode) => {
    const boundedIndex = updateActive(nextIndex, mode)
    const viewport = viewportRef.current
    const project = projectRefs.current[boundedIndex]

    if (!viewport || !project) return

    viewport.scrollTo({
      behavior: reduceMotion || mode === 'keyboard' ? 'auto' : 'smooth',
      left:
        project.offsetLeft -
        Math.max(0, (viewport.clientWidth - project.offsetWidth) / 2),
    })
  }

  const navigateFromKey = (
    event: KeyboardEvent<HTMLElement>,
    focusTab: boolean,
  ) => {
    let nextIndex: number | null = null

    if (event.key === 'ArrowRight') nextIndex = resolvedIndex + 1
    if (event.key === 'ArrowLeft') nextIndex = resolvedIndex - 1
    if (event.key === 'Home') nextIndex = 0
    if (event.key === 'End') nextIndex = projects.length - 1
    if (nextIndex === null) return

    event.preventDefault()
    const boundedIndex = Math.max(0, Math.min(nextIndex, projects.length - 1))
    goToProject(boundedIndex, 'keyboard')
    if (focusTab) tabRefs.current[boundedIndex]?.focus()
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

      if (nearestIndex !== resolvedIndex) updateActive(nearestIndex, 'scroll')
      scrollFrameRef.current = null
    })
  }

  return (
    <section
      className={styles.root}
      data-motion={motionIsOff ? 'off' : 'on'}
      style={rootStyle}
    >
      <div aria-hidden="true" className={styles.backgroundStage}>
        <AnimatePresence initial={false} mode="sync">
          <motion.div
            animate={{ opacity: 1, x: 0 }}
            className={styles.backgroundWash}
            exit={{ opacity: 0, x: motionIsOff ? 0 : direction * -26 }}
            initial={{ opacity: motionIsOff ? 1 : 0, x: motionIsOff ? 0 : direction * 26 }}
            key={activeProject.slug}
            style={{
              background: `linear-gradient(118deg, ${activeProject.palette.background}, ${activeProject.palette.surface} 74%)`,
            }}
            transition={{
              duration: motionIsOff ? 0 : navigationMode === 'scroll' ? 0.24 : 0.42,
              ease: [0.25, 1, 0.5, 1],
            }}
          />
        </AnimatePresence>
        <motion.span
          animate={{ rotate: resolvedIndex % 2 === 0 ? -1.25 : 1.25, y: (resolvedIndex - 2.5) * 4 }}
          className={styles.horizon}
          transition={{ duration: motionIsOff ? 0 : 0.42, ease: [0.25, 1, 0.5, 1] }}
        />
        <span className={styles.sunLine} />
      </div>

      <header className={styles.header}>
        <div>
          <p className={styles.eyebrow}>Selected work</p>
          <h2>Dimensional Slide Stack</h2>
        </div>

        <div
          aria-label="Choose a project"
          className={styles.projectTabs}
          role="tablist"
        >
          {projects.map((project, index) => (
            <button
              aria-controls={`dimensional-panel-${project.slug}`}
              aria-label={`Show ${project.name}`}
              aria-selected={index === resolvedIndex}
              className={styles.projectTab}
              id={`dimensional-tab-${project.slug}`}
              key={project.slug}
              onClick={() => goToProject(index, 'pointer')}
              onKeyDown={(event) => navigateFromKey(event, true)}
              ref={(node) => {
                tabRefs.current[index] = node
              }}
              role="tab"
              tabIndex={index === resolvedIndex ? 0 : -1}
              type="button"
            >
              <span aria-hidden="true" className={styles.tabImage}>
                <ProjectImage eager={index === 0} project={project} />
              </span>
            </button>
          ))}
        </div>

        <p aria-live="polite" className={styles.position}>
          <span>{String(resolvedIndex + 1).padStart(2, '0')}</span>
          <span aria-hidden="true"> / </span>
          <span className={styles.srOnly}>of </span>
          {String(projects.length).padStart(2, '0')}
        </p>
      </header>

      <div
        aria-label="Project carousel"
        className={styles.viewport}
        onKeyDown={(event) => navigateFromKey(event, false)}
        onScroll={handleScroll}
        ref={viewportRef}
        tabIndex={0}
      >
        <div className={styles.track}>
          {projects.map((project, index) => {
            const distance = Math.abs(index - resolvedIndex)
            const side = index < resolvedIndex ? -1 : 1
            const isActive = index === resolvedIndex

            return (
              <article
                aria-labelledby={`dimensional-title-${project.slug}`}
                aria-roledescription="slide"
                className={styles.project}
                data-active={isActive}
                id={`dimensional-panel-${project.slug}`}
                key={project.slug}
                ref={(node) => {
                  projectRefs.current[index] = node
                }}
                role="tabpanel"
              >
                <motion.div
                  animate={{
                    opacity: distance > 1 ? 0.68 : 1,
                    rotateY: isActive ? 0 : side * -1.8,
                    scale: isActive ? 1 : 0.965,
                    y: isActive ? 0 : Math.min(distance, 2) * 10,
                  }}
                  className={styles.planeShell}
                  transition={{
                    duration: motionIsOff ? 0 : 0.28,
                    ease: [0.25, 1, 0.5, 1],
                  }}
                >
                  <span aria-hidden="true" className={styles.edgeFar} />
                  <span aria-hidden="true" className={styles.edgeNear} />
                  <div className={styles.plane}>
                    <div className={styles.mediaFrame}>
                      <ProjectImage eager={index === 0} project={project} />
                    </div>

                    <div className={styles.projectInfo}>
                      <h3 id={`dimensional-title-${project.slug}`}>
                        {project.name}
                      </h3>
                      <p className={styles.description}>{project.description}</p>

                      {project.collaborators.length > 0 ? (
                        <p className={styles.collaborators}>
                          <span>With</span>
                          {project.collaborators.join(' · ')}
                        </p>
                      ) : null}

                      {project.href ? (
                        <CutCornerButton href={project.href}>View project</CutCornerButton>
                      ) : null}
                    </div>
                  </div>
                </motion.div>
              </article>
            )
          })}
        </div>
      </div>

      <footer className={styles.footer}>
        <span>Scroll or swipe</span>
        <span aria-hidden="true" className={styles.progressTrack}>
          <motion.span
            animate={{ scaleX: (resolvedIndex + 1) / projects.length }}
            className={styles.progress}
            transition={{ duration: motionIsOff ? 0 : 0.24, ease: [0.25, 1, 0.5, 1] }}
          />
        </span>
      </footer>
    </section>
  )
}
