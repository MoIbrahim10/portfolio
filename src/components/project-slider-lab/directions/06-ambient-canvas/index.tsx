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
  SliderProjectPalette,
} from '../../shared/types'

import styles from './styles.module.css'

export const metadata = {
  description:
    'A quiet split carousel floats above project-reactive color fields, solar geometry, and a stepped horizon selected through miniature image windows.',
  id: '06-ambient-canvas',
  name: 'Ambient Canvas',
  skill: {
    name: 'ui-animation',
    url: 'https://www.skills.sh/mblode/agent-skills/ui-animation',
  },
} satisfies SliderDirectionMetadata

type ChangeSource = 'keyboard' | 'pointer' | 'scroll'

type CanvasStyle = CSSProperties & {
  '--canvas-accent': string
  '--canvas-background': string
  '--canvas-foreground': string
  '--canvas-surface': string
}

const getCanvasStyle = (palette: SliderProjectPalette): CanvasStyle => ({
  '--canvas-accent': palette.accent,
  '--canvas-background': palette.background,
  '--canvas-foreground': palette.foreground,
  '--canvas-surface': palette.surface,
})

const getNextIndex = (key: string, index: number, count: number) => {
  if (key === 'ArrowLeft') return Math.max(0, index - 1)
  if (key === 'ArrowRight') return Math.min(count - 1, index + 1)
  if (key === 'Home') return 0
  if (key === 'End') return count - 1
  return null
}

function LoadingState() {
  return (
    <section
      aria-busy="true"
      aria-label="Ambient Canvas projects are loading"
      className={`${styles.root} ${styles.loading}`}
    >
      <div aria-hidden="true" className={styles.loadingGlow} />
      <header className={styles.loadingHeader}>
        <span className={`${styles.skeleton} ${styles.loadingHeading}`} />
        <div className={styles.loadingTabs}>
          {Array.from({ length: 6 }, (_, index) => (
            <span className={`${styles.skeleton} ${styles.loadingTab}`} key={index} />
          ))}
        </div>
      </header>
      <div aria-hidden="true" className={styles.loadingSlide}>
        <span className={`${styles.skeleton} ${styles.loadingImage}`} />
        <span className={styles.loadingCopy}>
          <i className={`${styles.skeleton} ${styles.loadingName}`} />
          <i className={`${styles.skeleton} ${styles.loadingLine}`} />
          <i className={`${styles.skeleton} ${styles.loadingLineShort}`} />
        </span>
      </div>
      <span className={styles.srOnly} role="status">
        Loading project canvas
      </span>
    </section>
  )
}

function EmptyState() {
  return (
    <section className={`${styles.root} ${styles.empty}`}>
      <div aria-hidden="true" className={styles.emptySun} />
      <p>Ambient Canvas</p>
      <h2>A clear horizon, ready for work.</h2>
      <span>Add a project to begin the sequence.</span>
    </section>
  )
}

export function AmbientCanvasDirection({
  projects,
  state = 'ready',
}: SliderDirectionProps) {
  const [activeIndex, setActiveIndex] = useState(0)
  const [changeSource, setChangeSource] = useState<ChangeSource>('pointer')
  const activeIndexRef = useRef(0)
  const viewportRef = useRef<HTMLDivElement>(null)
  const slideRefs = useRef<Array<HTMLLIElement | null>>([])
  const tabRefs = useRef<Array<HTMLButtonElement | null>>([])
  const scrollFrameRef = useRef<number | null>(null)
  const reduceMotion = useReducedMotion()

  useEffect(() => {
    if (projects.length > 0 && activeIndex >= projects.length) {
      activeIndexRef.current = projects.length - 1
      setActiveIndex(projects.length - 1)
    }
  }, [activeIndex, projects.length])

  useEffect(
    () => () => {
      if (scrollFrameRef.current !== null) {
        window.cancelAnimationFrame(scrollFrameRef.current)
      }
    },
    [],
  )

  if (state === 'loading') return <LoadingState />
  if (state === 'empty' || projects.length === 0) return <EmptyState />

  const resolvedIndex = Math.min(activeIndex, projects.length - 1)
  const activeProject = projects[resolvedIndex]!
  activeIndexRef.current = resolvedIndex
  const motionIsOff = Boolean(reduceMotion) || changeSource === 'keyboard'

  const selectProject = (requestedIndex: number, source: ChangeSource) => {
    const nextIndex = Math.max(0, Math.min(requestedIndex, projects.length - 1))
    activeIndexRef.current = nextIndex
    setChangeSource(source)
    setActiveIndex(nextIndex)

    const viewport = viewportRef.current
    const slide = slideRefs.current[nextIndex]
    if (!viewport || !slide) return

    viewport.scrollTo({
      behavior: reduceMotion || source === 'keyboard' ? 'auto' : 'smooth',
      left: slide.offsetLeft,
    })
  }

  const handleTabKeyDown = (
    event: KeyboardEvent<HTMLButtonElement>,
    index: number,
  ) => {
    const nextIndex = getNextIndex(event.key, index, projects.length)
    if (nextIndex === null) return

    event.preventDefault()
    selectProject(nextIndex, 'keyboard')
    tabRefs.current[nextIndex]?.focus()
  }

  const handleViewportKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
    if (event.target !== event.currentTarget) return
    const nextIndex = getNextIndex(event.key, resolvedIndex, projects.length)
    if (nextIndex === null) return

    event.preventDefault()
    selectProject(nextIndex, 'keyboard')
  }

  const syncToScroll = (event: UIEvent<HTMLDivElement>) => {
    const viewport = event.currentTarget
    if (scrollFrameRef.current !== null) return

    scrollFrameRef.current = window.requestAnimationFrame(() => {
      const viewportCenter = viewport.scrollLeft + viewport.clientWidth / 2
      let nearestIndex = activeIndexRef.current
      let nearestDistance = Number.POSITIVE_INFINITY

      slideRefs.current.forEach((slide, index) => {
        if (!slide) return
        const slideCenter = slide.offsetLeft + slide.offsetWidth / 2
        const distance = Math.abs(slideCenter - viewportCenter)
        if (distance < nearestDistance) {
          nearestDistance = distance
          nearestIndex = index
        }
      })

      if (nearestIndex !== activeIndexRef.current) {
        activeIndexRef.current = nearestIndex
        setChangeSource('scroll')
        setActiveIndex(nearestIndex)
        tabRefs.current[nearestIndex]?.scrollIntoView({
          behavior: 'auto',
          block: 'nearest',
          inline: 'nearest',
        })
      }
      scrollFrameRef.current = null
    })
  }

  const activeStyle = getCanvasStyle(activeProject.palette)

  return (
    <section className={styles.root} data-motion-off={motionIsOff} style={activeStyle}>
      <div aria-hidden="true" className={styles.ambientStage}>
        <AnimatePresence initial={false} mode="sync">
          <motion.div
            animate={{ opacity: 1, scale: 1, x: 0 }}
            className={styles.ambientPalette}
            exit={{ opacity: 0 }}
            initial={
              motionIsOff
                ? false
                : {
                    opacity: 0,
                    scale: 1.025,
                    x: resolvedIndex % 2 === 0 ? 18 : -18,
                  }
            }
            key={activeProject.slug}
            style={activeStyle}
            transition={{
              duration: motionIsOff ? 0 : 0.48,
              ease: [0.22, 1, 0.36, 1],
            }}
          >
            <span className={styles.colorCloud} />
            <span className={styles.solarDisc} />
            <span className={styles.pixelHorizon} />
          </motion.div>
        </AnimatePresence>
        <div className={styles.canvasGrain} />
      </div>

      <header className={styles.header}>
        <div className={styles.headingGroup}>
          <span aria-hidden="true" className={styles.mark} />
          <div>
            <p>Selected projects</p>
            <h2>Ambient Canvas</h2>
          </div>
        </div>

        <nav aria-label="Choose a project" className={styles.projectNav}>
          <div className={styles.tabs} role="tablist">
            {projects.map((project, index) => {
              const isActive = index === resolvedIndex
              return (
                <button
                  aria-controls={`ambient-project-${project.slug}`}
                  aria-label={`Show ${project.name}`}
                  aria-selected={isActive}
                  className={styles.tab}
                  key={project.slug}
                  onClick={() => selectProject(index, 'pointer')}
                  onKeyDown={(event) => handleTabKeyDown(event, index)}
                  ref={(node) => {
                    tabRefs.current[index] = node
                  }}
                  role="tab"
                  style={{ '--tab-accent': project.palette.accent } as CSSProperties}
                  tabIndex={isActive ? 0 : -1}
                  type="button"
                >
                  <ProjectImage
                    aria-hidden="true"
                    className={styles.tabImage}
                    eager={index === 0}
                    project={project}
                  />
                  <span aria-hidden="true" className={styles.tabTint} />
                </button>
              )
            })}
          </div>
        </nav>
      </header>

      <div
        aria-label="Project carousel. Scroll horizontally or use the arrow keys."
        className={styles.viewport}
        onKeyDown={handleViewportKeyDown}
        onScroll={syncToScroll}
        ref={viewportRef}
        role="region"
        tabIndex={0}
      >
        <ol className={styles.track}>
          {projects.map((project, index) => {
            const titleId = `ambient-title-${project.slug}`
            const descriptionId = `ambient-description-${project.slug}`
            const isActive = index === resolvedIndex

            return (
              <li
                className={styles.slide}
                key={project.slug}
                ref={(node) => {
                  slideRefs.current[index] = node
                }}
              >
                <article
                  aria-describedby={descriptionId}
                  aria-labelledby={titleId}
                  className={styles.project}
                  id={`ambient-project-${project.slug}`}
                  role="tabpanel"
                  style={getCanvasStyle(project.palette)}
                >
                  <figure className={styles.mediaFrame}>
                    <ProjectImage
                      className={styles.projectImage}
                      eager={index === 0}
                      project={project}
                    />
                    <span aria-hidden="true" className={styles.mediaEdge} />
                  </figure>

                  <div className={styles.projectInfo}>
                    <p className={styles.position}>
                      {String(index + 1).padStart(2, '0')}
                      <span aria-hidden="true"> / </span>
                      {String(projects.length).padStart(2, '0')}
                    </p>
                    <h3 id={titleId}>{project.name}</h3>
                    <p className={styles.description} id={descriptionId}>
                      {project.description}
                    </p>

                    <div className={styles.projectFooter}>
                      {project.collaborators.length > 0 ? (
                        <p className={styles.collaborators}>
                          <span>With</span>
                          {project.collaborators.join(' · ')}
                        </p>
                      ) : null}
                      {project.href ? (
                        <CutCornerButton
                          className={styles.projectLink}
                          href={project.href}
                          tabIndex={isActive ? 0 : -1}
                          variant="paper"
                        >
                          View project <span aria-hidden="true">↗</span>
                        </CutCornerButton>
                      ) : null}
                    </div>
                  </div>
                </article>
              </li>
            )
          })}
        </ol>
      </div>

      <footer className={styles.footer}>
        <p aria-live="polite">
          <span className={styles.srOnly}>Showing </span>
          {activeProject.name}
        </p>
        <span aria-hidden="true" className={styles.progress}>
          <i style={{ transform: `scaleX(${(resolvedIndex + 1) / projects.length})` }} />
        </span>
        <p>Scroll / drag</p>
      </footer>
    </section>
  )
}
