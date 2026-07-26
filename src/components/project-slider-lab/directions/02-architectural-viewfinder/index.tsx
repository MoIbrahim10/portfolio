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
    'A quiet horizontal viewfinder where stepped image apertures select split project scenes and architectural geometry recomposes behind each snap.',
  id: '02-architectural-viewfinder',
  name: 'Architectural Viewfinder',
  skill: {
    name: 'design-motion-principles',
    url: 'https://www.skills.sh/kylezantos/design-motion-principles/design-motion-principles',
  },
} satisfies SliderDirectionMetadata

type NavigationMode = 'keyboard' | 'pointer' | 'scroll'

function LoadingState() {
  return (
    <section
      aria-busy="true"
      aria-label="Architectural Viewfinder projects are loading"
      className={`${styles.root} ${styles.loading}`}
    >
      <header className={styles.header}>
        <div className={`${styles.skeleton} ${styles.loadingLabel}`} />
        <div className={styles.loadingTabs}>
          {Array.from({ length: 6 }, (_, index) => (
            <span className={`${styles.skeleton} ${styles.loadingTab}`} key={index} />
          ))}
        </div>
      </header>
      <article className={styles.loadingProject}>
        <div className={`${styles.skeleton} ${styles.loadingImage}`} />
        <div className={styles.loadingCopy}>
          <div className={`${styles.skeleton} ${styles.loadingTitle}`} />
          <div className={`${styles.skeleton} ${styles.loadingLine}`} />
          <div className={`${styles.skeleton} ${styles.loadingLineShort}`} />
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
      <p className={styles.kicker}>Architectural Viewfinder</p>
      <h2>The aperture is open.</h2>
      <p>Add a project to begin the sequence.</p>
    </section>
  )
}

export function ArchitecturalViewfinderDirection({
  projects,
  state = 'ready',
}: SliderDirectionProps) {
  const [activeIndex, setActiveIndex] = useState(0)
  const [navigationMode, setNavigationMode] = useState<NavigationMode>('scroll')
  const viewportRef = useRef<HTMLDivElement>(null)
  const projectRefs = useRef<Array<HTMLElement | null>>([])
  const tabRefs = useRef<Array<HTMLButtonElement | null>>([])
  const scrollFrameRef = useRef<number | null>(null)
  const programmaticIndexRef = useRef<number | null>(null)
  const reduceMotion = useReducedMotion()

  useEffect(() => {
    if (activeIndex >= projects.length && projects.length > 0) setActiveIndex(0)
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
    '--viewfinder-accent': activeProject.palette.accent,
    '--viewfinder-background': activeProject.palette.background,
    '--viewfinder-foreground': activeProject.palette.foreground,
    '--viewfinder-surface': activeProject.palette.surface,
  } as CSSProperties

  const goToProject = (index: number, mode: NavigationMode) => {
    const nextIndex = Math.max(0, Math.min(index, projects.length - 1))
    const viewport = viewportRef.current
    const project = projectRefs.current[nextIndex]

    programmaticIndexRef.current = nextIndex
    setNavigationMode(mode)
    setActiveIndex(nextIndex)

    if (!viewport || !project) return
    viewport.scrollTo({
      behavior: reduceMotion || mode === 'keyboard' ? 'auto' : 'smooth',
      left: project.offsetLeft,
    })
  }

  const handleNavigationKeyDown = (
    event: KeyboardEvent<HTMLButtonElement | HTMLDivElement>,
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
    if (event.currentTarget instanceof HTMLButtonElement) {
      tabRefs.current[boundedIndex]?.focus()
    }
  }

  const handleScroll = (event: UIEvent<HTMLDivElement>) => {
    if (scrollFrameRef.current !== null) cancelAnimationFrame(scrollFrameRef.current)
    const viewport = event.currentTarget

    scrollFrameRef.current = requestAnimationFrame(() => {
      const targetIndex = programmaticIndexRef.current
      const targetProject = targetIndex === null ? null : projectRefs.current[targetIndex]
      if (targetProject) {
        const targetDistance = Math.abs(targetProject.offsetLeft - viewport.scrollLeft)
        if (targetDistance > Math.max(2, viewport.clientWidth * 0.015)) {
          scrollFrameRef.current = null
          return
        }
        programmaticIndexRef.current = null
      }

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

  const paletteBackground = `
    radial-gradient(circle at 78% 18%, ${activeProject.palette.accent}30 0 7.5%, transparent 7.8%),
    linear-gradient(112deg, ${activeProject.palette.surface} 0 31%, ${activeProject.palette.background} 31.2% 100%)
  `

  return (
    <section className={styles.root} style={rootStyle}>
      <div aria-hidden="true" className={styles.backgroundStage}>
        <AnimatePresence initial={false} mode="sync">
          <motion.div
            animate={{ opacity: 1 }}
            className={styles.paletteWash}
            exit={{
              opacity: 0,
              transition: {
                duration: motionIsOff ? 0 : 0.2,
                ease: [0.4, 0, 1, 1],
              },
            }}
            initial={{ opacity: motionIsOff ? 1 : 0 }}
            key={activeProject.slug}
            style={{ background: paletteBackground }}
            transition={{ duration: motionIsOff ? 0 : 0.42, ease: [0.16, 1, 0.3, 1] }}
          >
            <motion.span
              animate={{ opacity: 0.62, scaleX: 1 }}
              className={`${styles.architectureLine} ${styles.architectureLineTop}`}
              initial={{ opacity: motionIsOff ? 0.62 : 0, scaleX: motionIsOff ? 1 : 0.32 }}
              transition={{ duration: motionIsOff ? 0 : 0.34, ease: [0.16, 1, 0.3, 1] }}
            />
            <motion.span
              animate={{ opacity: 0.4, scaleY: 1 }}
              className={`${styles.architectureLine} ${styles.architectureLineSide}`}
              initial={{ opacity: motionIsOff ? 0.4 : 0, scaleY: motionIsOff ? 1 : 0.24 }}
              transition={{ delay: motionIsOff ? 0 : 0.04, duration: motionIsOff ? 0 : 0.38, ease: [0.16, 1, 0.3, 1] }}
            />
            <motion.span
              animate={{ opacity: 0.76, scale: 1, x: 0 }}
              className={styles.solarDisc}
              initial={{ opacity: motionIsOff ? 0.76 : 0, scale: motionIsOff ? 1 : 0.92, x: motionIsOff ? 0 : -14 }}
              transition={{ duration: motionIsOff ? 0 : 0.36, ease: [0.16, 1, 0.3, 1] }}
            />
            <motion.span
              animate={{ opacity: 0.52, x: 0, y: 0 }}
              className={styles.cornerCut}
              initial={{ opacity: motionIsOff ? 0.52 : 0, x: motionIsOff ? 0 : 12, y: motionIsOff ? 0 : -12 }}
              transition={{ duration: motionIsOff ? 0 : 0.3, ease: [0.16, 1, 0.3, 1] }}
            />
          </motion.div>
        </AnimatePresence>
      </div>

      <header className={styles.header}>
        <div className={styles.identity}>
          <span aria-hidden="true" className={styles.identityMark} />
          <div>
            <p className={styles.kicker}>Selected projects</p>
            <h2>Architectural Viewfinder</h2>
          </div>
        </div>

        <div
          aria-label="Choose a project"
          className={styles.apertureTabs}
          role="tablist"
        >
          {projects.map((project, index) => {
            const isActive = index === resolvedIndex
            return (
              <button
                aria-controls={`viewfinder-panel-${project.slug}`}
                aria-label={`Show ${project.name}`}
                aria-selected={isActive}
                className={styles.apertureTab}
                key={project.slug}
                onClick={() => goToProject(index, 'pointer')}
                onKeyDown={handleNavigationKeyDown}
                ref={(node) => {
                  tabRefs.current[index] = node
                }}
                role="tab"
                tabIndex={isActive ? 0 : -1}
                type="button"
              >
                <ProjectImage className={styles.tabImage} project={project} />
                <span aria-hidden="true" className={styles.tabGate} />
              </button>
            )
          })}
        </div>

        <p aria-live="polite" className={styles.position}>
          <span>{String(resolvedIndex + 1).padStart(2, '0')}</span>
          <span aria-hidden="true"> / </span>
          <span>{String(projects.length).padStart(2, '0')}</span>
        </p>
      </header>

      <div
        aria-label="Projects. Scroll horizontally or use arrow keys to move between projects."
        className={styles.viewport}
        onKeyDown={handleNavigationKeyDown}
        onPointerDown={() => {
          programmaticIndexRef.current = null
        }}
        onScroll={handleScroll}
        onWheel={() => {
          programmaticIndexRef.current = null
        }}
        ref={viewportRef}
        role="region"
        tabIndex={0}
      >
        <div className={styles.track}>
          {projects.map((project, index) => {
            const titleId = `viewfinder-title-${project.slug}`
            const descriptionId = `viewfinder-description-${project.slug}`

            return (
              <article
                aria-describedby={descriptionId}
                aria-labelledby={titleId}
                className={styles.project}
                id={`viewfinder-panel-${project.slug}`}
                key={project.slug}
                ref={(node) => {
                  projectRefs.current[index] = node
                }}
                role="tabpanel"
              >
                <figure className={styles.projectImageFrame}>
                  <ProjectImage
                    className={styles.projectImage}
                    eager={index === 0}
                    project={project}
                  />
                </figure>

                <div className={styles.projectCopy}>
                  <div>
                    <h3 id={titleId}>{project.name}</h3>
                    <p className={styles.description} id={descriptionId}>
                      {project.description}
                    </p>
                  </div>

                  <div className={styles.projectFooter}>
                    {project.collaborators.length > 0 ? (
                      <div className={styles.collaborators}>
                        <p>With</p>
                        <ul>
                          {project.collaborators.map((collaborator) => (
                            <li key={collaborator}>{collaborator}</li>
                          ))}
                        </ul>
                      </div>
                    ) : null}

                    {project.href ? (
                      <CutCornerButton
                        className={styles.projectLink}
                        href={project.href}
                        variant="gold"
                      >
                        Open project <span aria-hidden="true">↗</span>
                      </CutCornerButton>
                    ) : null}
                  </div>
                </div>
              </article>
            )
          })}
        </div>
      </div>

      <footer className={styles.footer}>
        <p>Swipe or scroll</p>
        <span aria-hidden="true" className={styles.footerRule} />
        <p>← &nbsp; →</p>
      </footer>
    </section>
  )
}
