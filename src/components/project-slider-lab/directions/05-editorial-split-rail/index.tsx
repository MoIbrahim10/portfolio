import {
  type CSSProperties,
  type KeyboardEvent,
  useCallback,
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
    'A quiet editorial folio: a narrow image rail selects horizontally snapping image-and-copy spreads while solid paper, ink, and baseline fields recompose around each project.',
  id: '05-editorial-split-rail',
  name: 'Editorial Split Rail',
  skill: {
    name: 'web-typography',
    url: 'https://www.skills.sh/wondelai/skills/web-typography',
  },
} satisfies SliderDirectionMetadata

type Direction = -1 | 1

type RailStyle = CSSProperties & {
  '--rail-accent': string
  '--rail-background': string
  '--rail-foreground': string
  '--rail-surface': string
}

function LoadingState() {
  return (
    <section
      aria-busy="true"
      aria-label="Editorial Split Rail projects are loading"
      className={`${styles.root} ${styles.loading}`}
    >
      <header className={styles.loadingHeader}>
        <span className={`${styles.skeleton} ${styles.loadingEyebrow}`} />
        <span className={`${styles.skeleton} ${styles.loadingCounter}`} />
      </header>
      <div className={styles.loadingLayout}>
        <div aria-hidden="true" className={styles.loadingRail}>
          {Array.from({ length: 6 }, (_, index) => (
            <span className={`${styles.skeleton} ${styles.loadingTab}`} key={index} />
          ))}
        </div>
        <article className={styles.loadingSpread}>
          <span className={`${styles.skeleton} ${styles.loadingImage}`} />
          <div className={styles.loadingCopy}>
            <span className={`${styles.skeleton} ${styles.loadingTitle}`} />
            <span className={`${styles.skeleton} ${styles.loadingLine}`} />
            <span className={`${styles.skeleton} ${styles.loadingLine}`} />
            <span className={`${styles.skeleton} ${styles.loadingShortLine}`} />
          </div>
        </article>
      </div>
      <span className={styles.srOnly} role="status">
        Loading projects
      </span>
    </section>
  )
}

function EmptyState() {
  return (
    <section className={`${styles.root} ${styles.empty}`}>
      <span aria-hidden="true" className={styles.emptyRule} />
      <p className={styles.eyebrow}>Selected work</p>
      <h2>The folio is ready for its first project.</h2>
      <p>Add work to start the editorial rail.</p>
    </section>
  )
}

export function EditorialSplitRailDirection({
  projects,
  state = 'ready',
}: SliderDirectionProps) {
  const reduceMotion = useReducedMotion()
  const viewportRef = useRef<HTMLDivElement>(null)
  const panelRefs = useRef<Array<HTMLElement | null>>([])
  const tabRefs = useRef<Array<HTMLButtonElement | null>>([])
  const scrollFrameRef = useRef<number | null>(null)
  const [activeIndex, setActiveIndex] = useState(0)
  const [direction, setDirection] = useState<Direction>(1)

  const projectCount = projects.length
  const safeIndex = Math.min(activeIndex, Math.max(projectCount - 1, 0))
  const activeProject = projects[safeIndex]

  useEffect(() => {
    if (projectCount > 0 && activeIndex >= projectCount) {
      setActiveIndex(projectCount - 1)
    }
  }, [activeIndex, projectCount])

  useEffect(
    () => () => {
      if (scrollFrameRef.current !== null) cancelAnimationFrame(scrollFrameRef.current)
    },
    [],
  )

  const selectProject = useCallback(
    (index: number, behavior: ScrollBehavior = 'smooth') => {
      if (!projectCount) return

      const nextIndex = Math.max(0, Math.min(index, projectCount - 1))
      setDirection(nextIndex >= safeIndex ? 1 : -1)
      setActiveIndex(nextIndex)

      const viewport = viewportRef.current
      const panel = panelRefs.current[nextIndex]
      if (!viewport || !panel) return

      viewport.scrollTo({
        behavior: reduceMotion ? 'auto' : behavior,
        left: panel.offsetLeft,
      })
    },
    [projectCount, reduceMotion, safeIndex],
  )

  const handleKeyDown = (
    event: KeyboardEvent<HTMLButtonElement | HTMLDivElement>,
  ) => {
    let nextIndex: number | null = null

    if (event.key === 'ArrowRight' || event.key === 'ArrowDown') nextIndex = safeIndex + 1
    if (event.key === 'ArrowLeft' || event.key === 'ArrowUp') nextIndex = safeIndex - 1
    if (event.key === 'Home') nextIndex = 0
    if (event.key === 'End') nextIndex = projectCount - 1
    if (nextIndex === null) return

    event.preventDefault()
    const boundedIndex = Math.max(0, Math.min(nextIndex, projectCount - 1))
    selectProject(boundedIndex, 'auto')
    tabRefs.current[boundedIndex]?.focus()
  }

  const syncActiveProject = () => {
    scrollFrameRef.current = null
    const viewport = viewportRef.current
    if (!viewport) return

    const viewportCenter = viewport.getBoundingClientRect().left + viewport.clientWidth / 2
    let nearestIndex = safeIndex
    let nearestDistance = Number.POSITIVE_INFINITY

    panelRefs.current.forEach((panel, index) => {
      if (!panel) return
      const rect = panel.getBoundingClientRect()
      const distance = Math.abs(rect.left + rect.width / 2 - viewportCenter)
      if (distance < nearestDistance) {
        nearestDistance = distance
        nearestIndex = index
      }
    })

    if (nearestIndex !== safeIndex) {
      setDirection(nearestIndex > safeIndex ? 1 : -1)
      setActiveIndex(nearestIndex)
    }
  }

  const handleScroll = () => {
    if (scrollFrameRef.current !== null) return
    scrollFrameRef.current = requestAnimationFrame(syncActiveProject)
  }

  if (state === 'loading') return <LoadingState />
  if (state === 'empty' || !activeProject) return <EmptyState />

  const style: RailStyle = {
    '--rail-accent': activeProject.palette.accent,
    '--rail-background': activeProject.palette.background,
    '--rail-foreground': activeProject.palette.foreground,
    '--rail-surface': activeProject.palette.surface,
  }
  const motionDuration = reduceMotion ? 0 : 0.46

  return (
    <section className={styles.root} style={style}>
      <div aria-hidden="true" className={styles.paperStage}>
        <AnimatePresence custom={direction} initial={false} mode="sync">
          <motion.div
            animate={{ opacity: 1, x: 0 }}
            className={styles.paperField}
            custom={direction}
            exit={{ opacity: 0, x: reduceMotion ? 0 : direction * -20 }}
            initial={{ opacity: reduceMotion ? 1 : 0, x: reduceMotion ? 0 : direction * 20 }}
            key={activeProject.slug}
            style={{ backgroundColor: activeProject.palette.background }}
            transition={{ duration: motionDuration, ease: [0.22, 1, 0.36, 1] }}
          >
            <motion.span
              animate={{ scaleX: 1 }}
              className={styles.inkBlock}
              initial={{ scaleX: reduceMotion ? 1 : 0.72 }}
              style={{ backgroundColor: activeProject.palette.surface }}
              transition={{ duration: motionDuration, ease: [0.22, 1, 0.36, 1] }}
            />
            <motion.span
              animate={{ scaleY: 1 }}
              className={styles.accentBlock}
              initial={{ scaleY: reduceMotion ? 1 : 0.25 }}
              style={{ backgroundColor: activeProject.palette.accent }}
              transition={{ delay: reduceMotion ? 0 : 0.06, duration: motionDuration }}
            />
          </motion.div>
        </AnimatePresence>
        <span className={styles.baselines} />
      </div>

      <header className={styles.header}>
        <div>
          <p className={styles.eyebrow}>Selected work</p>
          <h2>Editorial Split Rail</h2>
        </div>
        <p aria-live="polite" className={styles.counter}>
          <span>{String(safeIndex + 1).padStart(2, '0')}</span>
          <span aria-hidden="true"> / </span>
          {String(projectCount).padStart(2, '0')}
        </p>
      </header>

      <div className={styles.layout}>
        <div
          aria-label="Choose a project"
          className={styles.rail}
          role="tablist"
        >
          {projects.map((project, index) => {
            const selected = index === safeIndex
            return (
              <button
                aria-controls={`editorial-panel-${project.slug}`}
                aria-label={`Show ${project.name}`}
                aria-selected={selected}
                className={styles.tab}
                id={`editorial-tab-${project.slug}`}
                key={project.slug}
                onClick={() => selectProject(index)}
                onKeyDown={handleKeyDown}
                ref={(node) => {
                  tabRefs.current[index] = node
                }}
                role="tab"
                tabIndex={selected ? 0 : -1}
                type="button"
              >
                <ProjectImage aria-hidden="true" className={styles.tabImage} project={project} />
                <span aria-hidden="true" className={styles.tabNumber}>
                  {String(index + 1).padStart(2, '0')}
                </span>
              </button>
            )
          })}
        </div>

        <div
          aria-label="Projects. Scroll horizontally or use arrow keys to change project."
          className={styles.viewport}
          onKeyDown={handleKeyDown}
          onScroll={handleScroll}
          ref={viewportRef}
          role="region"
          tabIndex={0}
        >
          <div className={styles.track}>
            {projects.map((project, index) => {
              const isActive = index === safeIndex
              const titleId = `editorial-title-${project.slug}`
              const descriptionId = `editorial-description-${project.slug}`

              return (
                <article
                  aria-describedby={descriptionId}
                  aria-labelledby={titleId}
                  className={styles.project}
                  id={`editorial-panel-${project.slug}`}
                  key={project.slug}
                  ref={(node) => {
                    panelRefs.current[index] = node
                  }}
                  role="tabpanel"
                >
                  <figure className={styles.imageFrame}>
                    <ProjectImage
                      className={styles.projectImage}
                      eager={index === 0}
                      project={project}
                    />
                    <figcaption>
                      Project {String(index + 1).padStart(2, '0')}
                    </figcaption>
                  </figure>

                  <motion.div
                    animate={{ opacity: isActive ? 1 : 0.38, y: isActive ? 0 : 12 }}
                    className={styles.copy}
                    transition={{ duration: reduceMotion ? 0 : 0.28, ease: [0.22, 1, 0.36, 1] }}
                  >
                    <div>
                      <p className={styles.projectNumber}>
                        {String(index + 1).padStart(2, '0')} — {String(projectCount).padStart(2, '0')}
                      </p>
                      <h3 id={titleId}>{project.name}</h3>
                      <p className={styles.description} id={descriptionId}>
                        {project.description}
                      </p>
                    </div>

                    <div className={styles.details}>
                      {project.collaborators.length > 0 ? (
                        <div className={styles.collaborators}>
                          <p>In collaboration with</p>
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
                          tabIndex={isActive ? 0 : -1}
                          variant="gold"
                        >
                          View project <span aria-hidden="true">↗</span>
                        </CutCornerButton>
                      ) : null}
                    </div>
                  </motion.div>
                </article>
              )
            })}
          </div>
        </div>
      </div>

      <footer className={styles.footer}>
        <p>Swipe or scroll horizontally</p>
        <span aria-hidden="true" />
        <p>Arrow keys · Home · End</p>
      </footer>
    </section>
  )
}
