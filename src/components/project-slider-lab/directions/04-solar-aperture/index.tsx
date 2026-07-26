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
    'A restrained solar aperture frames an image-first horizontal slider, with project thumbnails orbiting the control and each palette arriving through a radial reveal.',
  id: '04-solar-aperture',
  name: 'Solar Aperture',
  skill: {
    name: 'ui-animation',
    url: 'https://www.skills.sh/mblode/agent-skills/ui-animation',
  },
} satisfies SliderDirectionMetadata

type NavigationMode = 'keyboard' | 'pointer' | 'scroll'

const ORBIT_OFFSET = ['0.75rem', '0.24rem', '0', '0', '0.24rem', '0.75rem']

function LoadingState() {
  return (
    <section
      aria-busy="true"
      aria-label="Solar Aperture projects are loading"
      className={`${styles.root} ${styles.loading}`}
    >
      <div className={styles.loadingTabs}>
        {Array.from({ length: 6 }, (_, index) => (
          <span className={`${styles.skeleton} ${styles.loadingTab}`} key={index} />
        ))}
      </div>
      <article className={styles.loadingProject}>
        <div className={`${styles.skeleton} ${styles.loadingImage}`} />
        <div className={styles.loadingCopy}>
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
      <span aria-hidden="true" className={styles.emptyAperture} />
      <p className={styles.eyebrow}>Solar Aperture</p>
      <h2>The next project begins here.</h2>
      <p>Add work to bring the aperture into focus.</p>
    </section>
  )
}

export function SolarApertureDirection({
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
  const revealOrigin = `${((resolvedIndex + 0.5) / projects.length) * 100}% 12%`
  const rootStyle = {
    '--solar-accent': activeProject.palette.accent,
    '--solar-foreground': activeProject.palette.foreground,
    '--solar-surface': activeProject.palette.surface,
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

  const handleTabKeyDown = (event: KeyboardEvent<HTMLButtonElement>) => {
    let nextIndex: number | null = null

    if (event.key === 'ArrowRight') nextIndex = resolvedIndex + 1
    if (event.key === 'ArrowLeft') nextIndex = resolvedIndex - 1
    if (event.key === 'Home') nextIndex = 0
    if (event.key === 'End') nextIndex = projects.length - 1
    if (nextIndex === null) return

    event.preventDefault()
    const boundedIndex = Math.max(0, Math.min(nextIndex, projects.length - 1))
    goToProject(boundedIndex, 'keyboard')
    tabRefs.current[boundedIndex]?.focus()
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
    <section className={styles.root} style={rootStyle}>
      <div aria-hidden="true" className={styles.backgroundStage}>
        <AnimatePresence initial={false} mode="sync">
          <motion.div
            animate={{ clipPath: `circle(145% at ${revealOrigin})`, opacity: 1 }}
            className={styles.paletteWash}
            exit={{ opacity: motionIsOff ? 0 : 0.16 }}
            initial={{
              clipPath: motionIsOff
                ? `circle(145% at ${revealOrigin})`
                : `circle(0% at ${revealOrigin})`,
              opacity: 1,
            }}
            key={activeProject.slug}
            style={{
              background: `radial-gradient(circle at 76% 38%, ${activeProject.palette.accent}24 0 0.3%, transparent 0.45%), linear-gradient(118deg, ${activeProject.palette.surface}, ${activeProject.palette.background} 58%)`,
            }}
            transition={{
              clipPath: {
                duration: motionIsOff ? 0 : 0.56,
                ease: [0.22, 1, 0.36, 1],
              },
              opacity: { duration: motionIsOff ? 0 : 0.16 },
            }}
          />
        </AnimatePresence>
        <span className={styles.solarOrbit} />
        <span className={styles.horizon} />
      </div>

      <header className={styles.header}>
        <div className={styles.identity}>
          <span aria-hidden="true" className={styles.identityMark} />
          <div>
            <p className={styles.eyebrow}>Selected projects</p>
            <h2>Solar Aperture</h2>
          </div>
        </div>

        <div className={styles.apertureControl}>
          <span aria-hidden="true" className={styles.apertureCore} />
          <div aria-label="Choose a project" className={styles.projectTabs} role="tablist">
            {projects.map((project, index) => (
              <button
                aria-controls={`solar-aperture-panel-${project.slug}`}
                aria-label={`Show ${project.name}`}
                aria-selected={index === resolvedIndex}
                className={styles.projectTab}
                id={`solar-aperture-tab-${project.slug}`}
                key={project.slug}
                onClick={() => goToProject(index, 'pointer')}
                onKeyDown={handleTabKeyDown}
                ref={(node) => {
                  tabRefs.current[index] = node
                }}
                role="tab"
                style={{ '--orbit-offset': ORBIT_OFFSET[index] ?? '0' } as CSSProperties}
                tabIndex={index === resolvedIndex ? 0 : -1}
                type="button"
              >
                <ProjectImage eager={index === 0} project={project} />
                <span aria-hidden="true" className={styles.tabShade} />
              </button>
            ))}
          </div>
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
        onKeyDown={(event) => {
          if (event.key !== 'ArrowRight' && event.key !== 'ArrowLeft') return
          event.preventDefault()
          goToProject(
            resolvedIndex + (event.key === 'ArrowRight' ? 1 : -1),
            'keyboard',
          )
        }}
        onScroll={handleScroll}
        ref={viewportRef}
        tabIndex={0}
      >
        <div className={styles.track}>
          {projects.map((project, index) => (
            <article
              aria-labelledby={`solar-aperture-title-${project.slug}`}
              aria-roledescription="slide"
              className={styles.project}
              id={`solar-aperture-panel-${project.slug}`}
              key={project.slug}
              ref={(node) => {
                projectRefs.current[index] = node
              }}
              role="tabpanel"
            >
              <div className={styles.mediaFrame}>
                <ProjectImage eager={index === 0} project={project} />
                <span aria-hidden="true" className={styles.mediaIndex}>
                  {String(index + 1).padStart(2, '0')}
                </span>
              </div>

              <div className={styles.projectInfo}>
                <p className={styles.eyebrow}>Project {String(index + 1).padStart(2, '0')}</p>
                <h3 id={`solar-aperture-title-${project.slug}`}>{project.name}</h3>
                <p className={styles.description}>{project.description}</p>

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
                  <CutCornerButton href={project.href}>View project</CutCornerButton>
                ) : null}
              </div>
            </article>
          ))}
        </div>
      </div>

      <footer className={styles.footer}>
        <p>Scroll, swipe, or use arrow keys</p>
        <span aria-hidden="true" className={styles.progressTrack}>
          <motion.span
            animate={{ scaleX: (resolvedIndex + 1) / projects.length }}
            className={styles.progressFill}
            initial={false}
            transition={{ duration: motionIsOff ? 0 : 0.24, ease: [0.25, 1, 0.5, 1] }}
          />
        </span>
      </footer>
    </section>
  )
}
