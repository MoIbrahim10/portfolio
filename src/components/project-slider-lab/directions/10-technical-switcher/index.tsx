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
    'A precise image switcher: instrument-like thumbnail cells control a native horizontal snap rail while the palette resolves as a pixel scan behind each minimal project spread.',
  id: '10-technical-switcher',
  name: 'Technical Switcher',
  skill: {
    name: 'ui-animation',
    url: 'https://www.skills.sh/mblode/agent-skills/ui-animation',
  },
} satisfies SliderDirectionMetadata

type Direction = -1 | 1

type SwitcherStyle = CSSProperties & {
  '--switch-accent': string
  '--switch-background': string
  '--switch-foreground': string
  '--switch-surface': string
}

function LoadingState() {
  return (
    <section
      aria-busy="true"
      aria-label="Technical Switcher projects are loading"
      className={`${styles.root} ${styles.loading}`}
    >
      <header className={styles.loadingHeader}>
        <span className={`${styles.skeleton} ${styles.loadingLabel}`} />
        <span className={`${styles.skeleton} ${styles.loadingCount}`} />
      </header>
      <div aria-hidden="true" className={styles.loadingTabs}>
        {Array.from({ length: 6 }, (_, index) => (
          <span className={`${styles.skeleton} ${styles.loadingTab}`} key={index} />
        ))}
      </div>
      <article className={styles.loadingProject}>
        <span className={`${styles.skeleton} ${styles.loadingMedia}`} />
        <div className={styles.loadingCopy}>
          <span className={`${styles.skeleton} ${styles.loadingTitle}`} />
          <span className={`${styles.skeleton} ${styles.loadingLine}`} />
          <span className={`${styles.skeleton} ${styles.loadingLine}`} />
          <span className={`${styles.skeleton} ${styles.loadingShortLine}`} />
          <CutCornerButton loading variant="gold">
            Open project
          </CutCornerButton>
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
      <span aria-hidden="true" className={styles.emptyCursor} />
      <p className={styles.systemLabel}>Project channel / 00</p>
      <h2>No signal yet.</h2>
      <p>Add a project to activate the switcher.</p>
    </section>
  )
}

export function TechnicalSwitcherDirection({
  projects,
  state = 'ready',
}: SliderDirectionProps) {
  const reduceMotion = useReducedMotion()
  const viewportRef = useRef<HTMLDivElement>(null)
  const projectRefs = useRef<Array<HTMLElement | null>>([])
  const tabRefs = useRef<Array<HTMLButtonElement | null>>([])
  const frameRef = useRef<number | null>(null)
  const [activeIndex, setActiveIndex] = useState(0)
  const [direction, setDirection] = useState<Direction>(1)
  const [animateChange, setAnimateChange] = useState(true)

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
      if (frameRef.current !== null) cancelAnimationFrame(frameRef.current)
    },
    [],
  )

  const selectProject = useCallback(
    (index: number, behavior: ScrollBehavior, shouldAnimate: boolean) => {
      if (!projectCount) return

      const nextIndex = Math.max(0, Math.min(index, projectCount - 1))
      setDirection(nextIndex >= safeIndex ? 1 : -1)
      setAnimateChange(shouldAnimate && !reduceMotion)
      setActiveIndex(nextIndex)

      const viewport = viewportRef.current
      const project = projectRefs.current[nextIndex]
      if (!viewport || !project) return

      viewport.scrollTo({
        behavior: reduceMotion ? 'auto' : behavior,
        left: project.offsetLeft,
      })
    },
    [projectCount, reduceMotion, safeIndex],
  )

  const handleKeyDown = (
    event: KeyboardEvent<HTMLButtonElement | HTMLDivElement>,
  ) => {
    let nextIndex: number | null = null

    if (event.key === 'ArrowRight') nextIndex = safeIndex + 1
    if (event.key === 'ArrowLeft') nextIndex = safeIndex - 1
    if (event.key === 'Home') nextIndex = 0
    if (event.key === 'End') nextIndex = projectCount - 1
    if (nextIndex === null) return

    event.preventDefault()
    const boundedIndex = Math.max(0, Math.min(nextIndex, projectCount - 1))
    selectProject(boundedIndex, 'auto', false)
    tabRefs.current[boundedIndex]?.focus()
  }

  const syncFromScroll = () => {
    frameRef.current = null
    const viewport = viewportRef.current
    if (!viewport) return

    const viewportCenter = viewport.getBoundingClientRect().left + viewport.clientWidth / 2
    let nearestIndex = safeIndex
    let nearestDistance = Number.POSITIVE_INFINITY

    projectRefs.current.forEach((project, index) => {
      if (!project) return
      const rect = project.getBoundingClientRect()
      const distance = Math.abs(rect.left + rect.width / 2 - viewportCenter)
      if (distance < nearestDistance) {
        nearestIndex = index
        nearestDistance = distance
      }
    })

    if (nearestIndex !== safeIndex) {
      setDirection(nearestIndex > safeIndex ? 1 : -1)
      setAnimateChange(!reduceMotion)
      setActiveIndex(nearestIndex)
    }
  }

  const handleScroll = () => {
    if (frameRef.current !== null) return
    frameRef.current = requestAnimationFrame(syncFromScroll)
  }

  if (state === 'loading') return <LoadingState />
  if (state === 'empty' || !activeProject) return <EmptyState />

  const rootStyle: SwitcherStyle = {
    '--switch-accent': activeProject.palette.accent,
    '--switch-background': activeProject.palette.background,
    '--switch-foreground': activeProject.palette.foreground,
    '--switch-surface': activeProject.palette.surface,
  }
  const progress = (safeIndex + 1) / projectCount

  return (
    <section
      className={styles.root}
      data-motion={animateChange ? 'on' : 'off'}
      style={rootStyle}
    >
      <div aria-hidden="true" className={styles.background}>
        <div className={styles.grid} />
        <motion.div
          animate={{ scaleX: progress }}
          className={styles.progressField}
          initial={false}
          transition={{
            duration: animateChange ? 0.26 : 0,
            ease: [0.25, 1, 0.5, 1],
          }}
        />
        <AnimatePresence custom={direction} initial={false} mode="popLayout">
          <motion.div
            animate={{ opacity: 0.14, scaleX: 1, x: '0%' }}
            className={styles.channelScan}
            custom={direction}
            exit={{ opacity: 0, scaleX: 0.2, x: direction * -8 + '%' }}
            initial={{
              opacity: animateChange ? 0 : 1,
              scaleX: animateChange ? 0.2 : 1,
              x: animateChange ? direction * 8 + '%' : '0%',
            }}
            key={activeProject.slug}
            style={{ backgroundColor: activeProject.palette.accent }}
            transition={{
              duration: animateChange ? 0.34 : 0,
              ease: [0.22, 1, 0.36, 1],
            }}
          />
        </AnimatePresence>
        <motion.span
          animate={{ scaleX: progress }}
          className={styles.scanLine}
          initial={false}
          transition={{
            duration: animateChange ? 0.26 : 0,
            ease: [0.25, 1, 0.5, 1],
          }}
        />
      </div>

      <header className={styles.header}>
        <div className={styles.identity}>
          <span aria-hidden="true" className={styles.statusLight} />
          <div>
            <p className={styles.systemLabel}>Project switcher</p>
            <h2>Technical channel</h2>
          </div>
        </div>
        <p aria-live="polite" className={styles.counter}>
          <span>{String(safeIndex + 1).padStart(2, '0')}</span>
          <span aria-hidden="true"> / </span>
          {String(projectCount).padStart(2, '0')}
        </p>
      </header>

      <div className={styles.controls}>
        <div aria-label="Choose a project" className={styles.tabs} role="tablist">
          {projects.map((project, index) => {
            const selected = index === safeIndex
            return (
              <button
                aria-controls={`technical-panel-${project.slug}`}
                aria-label={`Show ${project.name}`}
                aria-selected={selected}
                className={styles.tab}
                id={`technical-tab-${project.slug}`}
                key={project.slug}
                onClick={() => selectProject(index, 'smooth', true)}
                onKeyDown={handleKeyDown}
                ref={(node) => {
                  tabRefs.current[index] = node
                }}
                role="tab"
                tabIndex={selected ? 0 : -1}
                type="button"
              >
                <ProjectImage aria-hidden="true" className={styles.tabImage} project={project} />
                <span aria-hidden="true" className={styles.tabCorners} />
              </button>
            )
          })}
        </div>
        <p className={styles.instruction}>Select / swipe / arrows</p>
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
            const titleId = `technical-title-${project.slug}`
            const descriptionId = `technical-description-${project.slug}`

            return (
              <article
                aria-describedby={descriptionId}
                aria-labelledby={titleId}
                className={styles.project}
                id={`technical-panel-${project.slug}`}
                key={project.slug}
                ref={(node) => {
                  projectRefs.current[index] = node
                }}
                role="tabpanel"
                tabIndex={isActive ? 0 : -1}
              >
                <figure className={styles.media}>
                  <ProjectImage
                    className={styles.projectImage}
                    eager={index === 0}
                    project={project}
                  />
                  <span aria-hidden="true" className={styles.mediaIndex}>
                    {String(index + 1).padStart(2, '0')}
                  </span>
                </figure>

                <motion.div
                  animate={{ opacity: isActive ? 1 : 0.42, x: isActive ? 0 : direction * 12 }}
                  className={styles.copy}
                  transition={{
                    duration: animateChange && isActive ? 0.24 : 0,
                    ease: [0.22, 1, 0.36, 1],
                  }}
                >
                  <div>
                    <p className={styles.projectChannel}>
                      Channel {String(index + 1).padStart(2, '0')}
                    </p>
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
                        tabIndex={isActive ? 0 : -1}
                        variant="gold"
                      >
                        Open project <span aria-hidden="true">↗</span>
                      </CutCornerButton>
                    ) : null}
                  </div>
                </motion.div>
              </article>
            )
          })}
        </div>
      </div>

      <footer className={styles.footer}>
        <span aria-hidden="true" className={styles.footerMark} />
        <p>Native horizontal snap</p>
        <span aria-hidden="true" className={styles.footerRule} />
        <p>← → / home / end</p>
      </footer>
    </section>
  )
}
