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

export const metadata: SliderDirectionMetadata = {
  description: 'A projected-film carousel with square image cues and palette wipes.',
  id: 'chromatic-filmstrip',
  name: 'Chromatic Filmstrip',
  skill: {
    name: 'ui-animation',
    url: 'https://www.skills.sh/mblode/agent-skills/ui-animation',
  },
}

type LabStyle = CSSProperties & {
  '--accent': string
  '--background': string
  '--foreground': string
  '--surface': string
}

function LoadingState() {
  return (
    <section aria-busy="true" aria-label="Loading projects" className={styles.stateShell}>
      <div aria-hidden="true" className={styles.loadingTabs}>
        {Array.from({ length: 6 }, (_, index) => (
          <span className={styles.loadingTab} key={index} />
        ))}
      </div>
      <div aria-hidden="true" className={styles.loadingStage}>
        <span className={styles.loadingImage} />
        <span className={styles.loadingCopy}>
          <i />
          <i />
          <i />
        </span>
      </div>
      <span className={styles.srOnly}>Project filmstrip is loading.</span>
    </section>
  )
}

function EmptyState() {
  return (
    <section className={styles.emptyState}>
      <p>Project film · 000</p>
      <h2>The next frame is still being developed.</h2>
      <span>Add a project to begin the filmstrip.</span>
    </section>
  )
}

export function ChromaticFilmstripDirection({
  projects,
  state = 'ready',
}: SliderDirectionProps) {
  const shouldReduceMotion = useReducedMotion()
  const viewportRef = useRef<HTMLDivElement>(null)
  const panelRefs = useRef<Array<HTMLElement | null>>([])
  const tabRefs = useRef<Array<HTMLButtonElement | null>>([])
  const animationFrameRef = useRef<number | null>(null)
  const [activeIndex, setActiveIndex] = useState(0)
  const [direction, setDirection] = useState(1)
  const [animateChange, setAnimateChange] = useState(true)

  const projectCount = projects.length
  const safeIndex = Math.min(activeIndex, Math.max(projectCount - 1, 0))
  const activeProject = projects[safeIndex]

  const selectProject = useCallback((nextIndex: number, animate: boolean) => {
    if (!projectCount) return

    const boundedIndex = Math.min(Math.max(nextIndex, 0), projectCount - 1)
    setDirection(boundedIndex >= safeIndex ? 1 : -1)
    setAnimateChange(animate)
    setActiveIndex(boundedIndex)

    const viewport = viewportRef.current
    const panel = panelRefs.current[boundedIndex]
    if (!viewport || !panel) return

    viewport.scrollTo({
      behavior: animate && !shouldReduceMotion ? 'smooth' : 'auto',
      left: panel.offsetLeft - viewport.offsetLeft,
    })
  }, [projectCount, safeIndex, shouldReduceMotion])

  const syncActivePanel = useCallback(() => {
    animationFrameRef.current = null
    const viewport = viewportRef.current
    if (!viewport) return

    const viewportCenter = viewport.getBoundingClientRect().left + viewport.clientWidth / 2
    let closestIndex = safeIndex
    let closestDistance = Number.POSITIVE_INFINITY

    panelRefs.current.forEach((panel, index) => {
      if (!panel) return
      const rect = panel.getBoundingClientRect()
      const distance = Math.abs(rect.left + rect.width / 2 - viewportCenter)
      if (distance < closestDistance) {
        closestDistance = distance
        closestIndex = index
      }
    })

    if (closestIndex !== safeIndex) {
      setDirection(closestIndex > safeIndex ? 1 : -1)
      setActiveIndex(closestIndex)
    }
  }, [safeIndex])

  const handleScroll = () => {
    if (animationFrameRef.current !== null) return
    animationFrameRef.current = window.requestAnimationFrame(syncActivePanel)
  }

  const handleTabKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
    let nextIndex: number | null = null

    if (event.key === 'ArrowRight') nextIndex = Math.min(safeIndex + 1, projectCount - 1)
    if (event.key === 'ArrowLeft') nextIndex = Math.max(safeIndex - 1, 0)
    if (event.key === 'Home') nextIndex = 0
    if (event.key === 'End') nextIndex = projectCount - 1
    if (nextIndex === null) return

    event.preventDefault()
    selectProject(nextIndex, false)
    tabRefs.current[nextIndex]?.focus()
  }

  useEffect(() => () => {
    if (animationFrameRef.current !== null) {
      window.cancelAnimationFrame(animationFrameRef.current)
    }
  }, [])

  useEffect(() => {
    if (activeIndex >= projectCount && projectCount > 0) setActiveIndex(projectCount - 1)
  }, [activeIndex, projectCount])

  if (state === 'loading') return <LoadingState />
  if (state === 'empty' || !activeProject) return <EmptyState />

  const paletteStyle: LabStyle = {
    '--accent': activeProject.palette.accent,
    '--background': activeProject.palette.background,
    '--foreground': activeProject.palette.foreground,
    '--surface': activeProject.palette.surface,
  }
  const instantTransition = shouldReduceMotion || !animateChange

  return (
    <section className={styles.lab} data-instant={instantTransition} style={paletteStyle}>
      <div aria-hidden="true" className={styles.backgrounds}>
        <AnimatePresence custom={direction} initial={false} mode="sync">
          <motion.div
            animate={{ clipPath: 'inset(0 0 0 0)', opacity: 1 }}
            className={styles.background}
            custom={direction}
            exit={{ opacity: instantTransition ? 0 : 0.14 }}
            initial={{
              clipPath: instantTransition
                ? 'inset(0 0 0 0)'
                : direction > 0
                  ? 'inset(0 0 0 100%)'
                  : 'inset(0 100% 0 0)',
              opacity: instantTransition ? 1 : 0.3,
            }}
            key={activeProject.slug}
            style={{
              background: `linear-gradient(135deg, ${activeProject.palette.background}, ${activeProject.palette.surface})`,
            }}
            transition={{
              clipPath: { duration: instantTransition ? 0 : 0.46, ease: [0.22, 1, 0.36, 1] },
              opacity: { duration: instantTransition ? 0 : 0.24 },
            }}
          />
        </AnimatePresence>
        <div className={styles.projectorGlow} />
        <div className={styles.frameLines} />
      </div>

      <header className={styles.header}>
        <div>
          <p className={styles.kicker}>Selected work · frame {String(safeIndex + 1).padStart(2, '0')}</p>
          <h2>Projects in motion.</h2>
        </div>
        <p className={styles.instruction}>Swipe, scroll, or use the arrow keys.</p>
      </header>

      <div
        aria-label="Choose a project"
        className={styles.tabs}
        onKeyDown={handleTabKeyDown}
        role="tablist"
      >
        {projects.map((project, index) => {
          const selected = index === safeIndex
          return (
            <button
              aria-controls={`chromatic-panel-${project.slug}`}
              aria-label={`Show ${project.name}`}
              aria-selected={selected}
              className={styles.tab}
              key={project.slug}
              onClick={() => selectProject(index, true)}
              ref={(node) => { tabRefs.current[index] = node }}
              role="tab"
              tabIndex={selected ? 0 : -1}
              type="button"
            >
              <ProjectImage aria-hidden="true" eager={index === 0} project={project} />
              <span aria-hidden="true">{String(index + 1).padStart(2, '0')}</span>
            </button>
          )
        })}
      </div>

      <div
        className={styles.viewport}
        onPointerDown={() => setAnimateChange(true)}
        onScroll={handleScroll}
        onWheel={() => setAnimateChange(true)}
        ref={viewportRef}
      >
        <div className={styles.track}>
          {projects.map((project, index) => (
            <article
              aria-hidden={index !== safeIndex}
              aria-labelledby={`chromatic-title-${project.slug}`}
              className={styles.panel}
              id={`chromatic-panel-${project.slug}`}
              key={project.slug}
              ref={(node) => { panelRefs.current[index] = node }}
              role="tabpanel"
              tabIndex={index === safeIndex ? 0 : -1}
            >
              <div className={styles.imageFrame}>
                <ProjectImage eager={index === 0} project={project} />
                <span aria-hidden="true" className={styles.frameNumber}>
                  {String(index + 1).padStart(2, '0')}
                </span>
              </div>

              <div className={styles.projectInfo}>
                <p className={styles.projectCounter}>{String(index + 1).padStart(2, '0')} / {String(projectCount).padStart(2, '0')}</p>
                <h3 id={`chromatic-title-${project.slug}`}>{project.name}</h3>
                <p className={styles.description}>{project.description}</p>
                {project.collaborators.length ? (
                  <p className={styles.collaborators}>
                    <span>In collaboration with</span>
                    {project.collaborators.join(' · ')}
                  </p>
                ) : null}
                {project.href ? (
                  <CutCornerButton
                    className={styles.projectLink}
                    href={project.href}
                    tabIndex={index === safeIndex ? 0 : -1}
                    variant="paper"
                  >
                    View project <span aria-hidden="true">↗</span>
                  </CutCornerButton>
                ) : null}
              </div>
            </article>
          ))}
        </div>
      </div>

      <footer className={styles.footer}>
        <span>{activeProject.name}</span>
        <span aria-hidden="true" className={styles.progress}>
          <i style={{ transform: `scaleX(${(safeIndex + 1) / projectCount})` }} />
        </span>
        <span>{String(safeIndex + 1).padStart(2, '0')} — {String(projectCount).padStart(2, '0')}</span>
      </footer>
    </section>
  )
}
