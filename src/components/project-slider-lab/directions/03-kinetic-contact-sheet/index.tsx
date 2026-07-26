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
    'A compact image contact sheet drives a horizontal split-screen carousel while project palettes pass through a shifting pixel field.',
  id: '03-kinetic-contact-sheet',
  name: 'Kinetic Contact Sheet',
  skill: {
    name: 'design-motion-principles',
    url: 'https://www.skills.sh/kylezantos/design-motion-principles/design-motion-principles',
  },
} satisfies SliderDirectionMetadata

type PaletteStyle = CSSProperties & {
  '--slider-accent': string
  '--slider-background': string
  '--slider-foreground': string
  '--slider-surface': string
}

type ChangeSource = 'keyboard' | 'pointer' | 'scroll'

const paletteStyle = (palette: SliderProjectPalette): PaletteStyle => ({
  '--slider-accent': palette.accent,
  '--slider-background': palette.background,
  '--slider-foreground': palette.foreground,
  '--slider-surface': palette.surface,
})

const getNextIndex = (key: string, currentIndex: number, count: number) => {
  if (key === 'Home') return 0
  if (key === 'End') return count - 1
  if (key === 'ArrowRight') return (currentIndex + 1) % count
  if (key === 'ArrowLeft') return (currentIndex - 1 + count) % count
  return null
}

function LoadingState() {
  return (
    <section
      aria-busy="true"
      aria-label="Projects are loading"
      className={`${styles.root} ${styles.loadingRoot}`}
    >
      <div className={styles.loadingHeader}>
        <div className={`${styles.skeleton} ${styles.loadingTitle}`} />
        <div className={styles.loadingTabs}>
          {Array.from({ length: 6 }, (_, index) => (
            <span className={`${styles.skeleton} ${styles.loadingTab}`} key={index} />
          ))}
        </div>
      </div>
      <div className={styles.loadingProject}>
        <div className={`${styles.skeleton} ${styles.loadingMedia}`} />
        <div className={styles.loadingCopy}>
          <div className={`${styles.skeleton} ${styles.loadingKicker}`} />
          <div className={`${styles.skeleton} ${styles.loadingName}`} />
          <div className={`${styles.skeleton} ${styles.loadingDescription}`} />
          <CutCornerButton loading variant="gold">
            Open project
          </CutCornerButton>
        </div>
      </div>
      <span className={styles.srOnly} role="status">
        Loading the project contact sheet
      </span>
    </section>
  )
}

function EmptyState() {
  return (
    <section className={`${styles.root} ${styles.emptyRoot}`}>
      <div aria-hidden="true" className={styles.emptyGrid} />
      <p className={styles.kicker}>Contact sheet / 00</p>
      <h2>The sheet is ready for its first frame.</h2>
      <p>Add a project to begin the horizontal sequence.</p>
    </section>
  )
}

export function KineticContactSheetDirection({
  projects,
  state = 'ready',
}: SliderDirectionProps) {
  const [activeIndex, setActiveIndex] = useState(0)
  const [rippleRevision, setRippleRevision] = useState(0)
  const activeIndexRef = useRef(0)
  const interactionRef = useRef<ChangeSource>('pointer')
  const scrollTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  const slideRefs = useRef<Array<HTMLLIElement | null>>([])
  const tabRefs = useRef<Array<HTMLButtonElement | null>>([])
  const viewportRef = useRef<HTMLDivElement>(null)
  const reduceMotion = useReducedMotion()

  useEffect(
    () => () => {
      if (scrollTimerRef.current !== null) clearTimeout(scrollTimerRef.current)
    },
    [],
  )

  if (state === 'loading') return <LoadingState />
  if (state === 'empty' || projects.length === 0) return <EmptyState />

  const resolvedIndex = Math.min(activeIndex, projects.length - 1)
  const activeProject = projects[resolvedIndex]!
  activeIndexRef.current = resolvedIndex

  const selectProject = (requestedIndex: number, source: ChangeSource) => {
    const nextIndex = Math.max(0, Math.min(requestedIndex, projects.length - 1))
    if (activeIndexRef.current === nextIndex) return

    activeIndexRef.current = nextIndex
    interactionRef.current = source
    setActiveIndex(nextIndex)

    if (source !== 'keyboard' && !reduceMotion) {
      setRippleRevision((revision) => revision + 1)
    }
  }

  const goToProject = (requestedIndex: number, source: ChangeSource) => {
    const nextIndex = Math.max(0, Math.min(requestedIndex, projects.length - 1))
    selectProject(nextIndex, source)

    const slide = slideRefs.current[nextIndex]
    if (!slide) return

    viewportRef.current?.scrollTo({
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
    goToProject(nextIndex, 'keyboard')
    tabRefs.current[nextIndex]?.focus()
  }

  const handleViewportKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
    if (event.target !== event.currentTarget) return

    const nextIndex = getNextIndex(event.key, resolvedIndex, projects.length)
    if (nextIndex === null) return

    event.preventDefault()
    goToProject(nextIndex, 'keyboard')
  }

  const handleScroll = (event: UIEvent<HTMLDivElement>) => {
    if (scrollTimerRef.current !== null) clearTimeout(scrollTimerRef.current)
    const viewport = event.currentTarget

    scrollTimerRef.current = setTimeout(() => {
      const viewportCenter = viewport.scrollLeft + viewport.clientWidth / 2
      let nearestIndex = 0
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

      selectProject(nearestIndex, 'scroll')
      tabRefs.current[nearestIndex]?.scrollIntoView({
        behavior: 'auto',
        block: 'nearest',
        inline: 'nearest',
      })
      scrollTimerRef.current = null
    }, 90)
  }

  const animateChange = !reduceMotion && interactionRef.current !== 'keyboard'

  return (
    <section className={styles.root} style={paletteStyle(activeProject.palette)}>
      <AnimatePresence initial={false}>
        <motion.div
          animate={{ clipPath: 'inset(0 0% 0 0)', opacity: 1 }}
          aria-hidden="true"
          className={styles.colorField}
          exit={{ opacity: 0 }}
          initial={
            animateChange
              ? { clipPath: 'inset(0 0% 0 9%)', opacity: 0 }
              : false
          }
          key={activeProject.slug}
          style={paletteStyle(activeProject.palette)}
          transition={{
            duration: animateChange ? 0.38 : 0,
            ease: [0.22, 1, 0.36, 1],
          }}
        />
      </AnimatePresence>

      <header className={styles.header}>
        <div>
          <p className={styles.kicker}>Selected work / Contact 03</p>
          <h2>Kinetic Contact Sheet</h2>
        </div>
        <p aria-live="polite" className={styles.counter}>
          <span>{String(resolvedIndex + 1).padStart(2, '0')}</span>
          <span aria-hidden="true"> / </span>
          <span>{String(projects.length).padStart(2, '0')}</span>
          <span className={styles.srOnly}>Showing {activeProject.name}</span>
        </p>
      </header>

      <nav aria-label="Choose a project" className={styles.contactSheet}>
        <ol className={styles.contactList}>
          {projects.map((project, index) => {
            const isActive = index === resolvedIndex
            const shouldRipple = rippleRevision > 0 && animateChange

            return (
              <li key={project.slug}>
                <button
                  aria-controls={`kinetic-project-${project.slug}`}
                  aria-label={`Show ${project.name}, project ${index + 1} of ${projects.length}`}
                  aria-pressed={isActive}
                  className={`${styles.projectTab} ${isActive ? styles.activeTab : ''}`}
                  onClick={() => goToProject(index, 'pointer')}
                  onKeyDown={(event) => handleTabKeyDown(event, index)}
                  ref={(node) => {
                    tabRefs.current[index] = node
                  }}
                  style={{ '--tab-accent': project.palette.accent } as CSSProperties}
                  type="button"
                >
                  <motion.span
                    animate={shouldRipple ? { y: [0, -5, 0] } : { y: 0 }}
                    className={styles.tabImageFrame}
                    initial={shouldRipple ? { y: 0 } : false}
                    key={`${project.slug}-${rippleRevision}`}
                    transition={{
                      delay: shouldRipple
                        ? Math.abs(index - resolvedIndex) * 0.025
                        : 0,
                      duration: shouldRipple ? 0.26 : 0,
                      ease: [0.22, 1, 0.36, 1],
                    }}
                  >
                    <ProjectImage
                      className={styles.tabImage}
                      eager={index === 0}
                      project={project}
                    />
                    <span aria-hidden="true" className={styles.tabNumber}>
                      {String(index + 1).padStart(2, '0')}
                    </span>
                  </motion.span>
                  {isActive ? (
                    <motion.span
                      aria-hidden="true"
                      className={styles.activeCursor}
                      layoutId="kinetic-contact-sheet-cursor"
                      transition={{
                        bounce: 0,
                        duration: animateChange ? 0.28 : 0,
                        type: 'spring',
                      }}
                    />
                  ) : null}
                </button>
              </li>
            )
          })}
        </ol>
      </nav>

      <div
        aria-label="Projects carousel. Use left and right arrow keys, a trackpad, or touch to move between projects."
        className={styles.viewport}
        onKeyDown={handleViewportKeyDown}
        onScroll={handleScroll}
        ref={viewportRef}
        role="region"
        tabIndex={0}
      >
        <ol className={styles.track}>
          {projects.map((project, index) => {
            const titleId = `kinetic-title-${project.slug}`
            const descriptionId = `kinetic-description-${project.slug}`

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
                  id={`kinetic-project-${project.slug}`}
                  style={paletteStyle(project.palette)}
                >
                  <figure className={styles.mediaFrame}>
                    <ProjectImage
                      className={styles.projectImage}
                      eager={index === 0}
                      project={project}
                    />
                    <figcaption>
                      Frame {String(index + 1).padStart(2, '0')}
                    </figcaption>
                  </figure>

                  <div className={styles.projectInfo}>
                    <div>
                      <p className={styles.projectIndex}>
                        {String(index + 1).padStart(2, '0')} /{' '}
                        {String(projects.length).padStart(2, '0')}
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
                          <ul aria-label={`Collaborators on ${project.name}`}>
                            {project.collaborators.map((collaborator) => (
                              <li key={collaborator}>{collaborator}</li>
                            ))}
                          </ul>
                        </div>
                      ) : null}
                      {project.href ? (
                        <CutCornerButton href={project.href} variant="gold">
                          Open project <span aria-hidden="true">↗</span>
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

      <footer className={styles.hint}>
        <span aria-hidden="true">← →</span>
        Scroll, swipe, or use arrow keys
      </footer>
    </section>
  )
}

export default KineticContactSheetDirection
