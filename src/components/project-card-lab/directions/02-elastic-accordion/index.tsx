import {
  type KeyboardEvent,
  useEffect,
  useId,
  useRef,
  useState,
} from 'react'
import { AnimatePresence, motion, useReducedMotion } from 'motion/react'

import { CutCornerButton } from '../../../project-lab/shared/CutCornerButton'
import { ProjectCardImage } from '../../shared/ProjectCardImage'
import type {
  CardDirectionMetadata,
  CardDirectionProps,
} from '../../shared/types'
import type { SliderProject } from '../../../project-slider-lab/shared/types'

import styles from './styles.module.css'

export const metadata = {
  description:
    'An image-only rail that gently redistributes space around the active project before opening a focused bottom sheet.',
  id: '02-elastic-accordion',
  motion:
    'Motion layout springs reweight the rail; a critically damped transform spring opens the detail sheet.',
  name: 'Elastic Accordion',
  skill: {
    name: 'ui-animation',
    url: 'https://www.skills.sh/mblode/agent-skills/ui-animation',
  },
} satisfies CardDirectionMetadata

const FOCUSABLE =
  'a[href], button:not([disabled]), [tabindex]:not([tabindex="-1"])'

function LoadingState() {
  return (
    <section
      aria-busy="true"
      aria-label="Projects are loading"
      className={styles.root}
    >
      <div aria-hidden="true" className={styles.loadingRail}>
        {Array.from({ length: 5 }, (_, index) => (
          <div className={styles.skeleton} key={index} />
        ))}
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
      <div aria-hidden="true" className={styles.emptyMark}>
        <span />
        <span />
        <span />
      </div>
      <h2>No projects yet</h2>
      <p>The horizontal rail is ready for its first image.</p>
    </section>
  )
}

interface ProjectSheetProps {
  onClose: () => void
  project: SliderProject
}

function ProjectSheet({ onClose, project }: ProjectSheetProps) {
  const panelRef = useRef<HTMLElement>(null)
  const reduceMotion = useReducedMotion()
  const titleId = useId()
  const descriptionId = useId()

  useEffect(() => {
    const panel = panelRef.current
    if (!panel) return

    const previousOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'

    const focusables = Array.from(
      panel.querySelectorAll<HTMLElement>(FOCUSABLE),
    )
    focusables[0]?.focus()

    const handleKeyDown = (event: globalThis.KeyboardEvent) => {
      if (event.key === 'Escape') {
        event.preventDefault()
        onClose()
        return
      }

      if (event.key !== 'Tab') return

      const currentFocusables = Array.from(
        panel.querySelectorAll<HTMLElement>(FOCUSABLE),
      )
      const first = currentFocusables[0]
      const last = currentFocusables.at(-1)
      if (!first || !last) {
        event.preventDefault()
        return
      }

      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault()
        last.focus()
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault()
        first.focus()
      }
    }

    document.addEventListener('keydown', handleKeyDown)
    return () => {
      document.body.style.overflow = previousOverflow
      document.removeEventListener('keydown', handleKeyDown)
    }
  }, [onClose])

  return (
    <motion.div
      animate={{ opacity: 1 }}
      className={styles.backdrop}
      exit={{ opacity: 0 }}
      initial={{ opacity: 0 }}
      onClick={onClose}
      transition={{ duration: reduceMotion ? 0 : 0.18 }}
    >
      <motion.aside
        animate={{ y: 0 }}
        aria-describedby={descriptionId}
        aria-labelledby={titleId}
        aria-modal="true"
        className={styles.sheet}
        exit={{ y: '100%' }}
        initial={{ y: reduceMotion ? 0 : '100%' }}
        onClick={(event) => event.stopPropagation()}
        ref={panelRef}
        role="dialog"
        transition={{
          bounce: 0,
          duration: reduceMotion ? 0 : 0.38,
          type: 'spring',
        }}
      >
        <div aria-hidden="true" className={styles.sheetHandle} />
        <div className={styles.sheetTopline}>
          <p>Project details</p>
          <button
            aria-label={`Close ${project.name} details`}
            className={styles.close}
            onClick={onClose}
            type="button"
          >
            <span aria-hidden="true">×</span>
          </button>
        </div>

        <div className={styles.sheetGrid}>
          <div className={styles.copy}>
            <h2 id={titleId}>{project.name}</h2>
            <p id={descriptionId}>{project.description}</p>

            {project.collaborators.length > 0 ? (
              <div className={styles.collaborators}>
                <h3>Collaboration</h3>
                <ul>
                  {project.collaborators.map((collaborator) => (
                    <li key={collaborator}>{collaborator}</li>
                  ))}
                </ul>
              </div>
            ) : null}

            {project.href ? (
              <CutCornerButton href={project.href} variant="navy">
                Visit project <span aria-hidden="true">↗</span>
              </CutCornerButton>
            ) : null}
          </div>

          <div aria-label={`${project.name} gallery`} className={styles.gallery}>
            {project.gallery.map((image, index) => (
              <figure className={styles.galleryFrame} key={`${image}-${index}`}>
                <img
                  alt={`${project.name} gallery view ${index + 1}`}
                  decoding="async"
                  height={1498}
                  loading="lazy"
                  src={image}
                  width={3018}
                />
              </figure>
            ))}
          </div>
        </div>
      </motion.aside>
    </motion.div>
  )
}

export function ElasticAccordionDirection({
  projects,
  state = 'ready',
}: CardDirectionProps) {
  const [activeIndex, setActiveIndex] = useState(0)
  const [intentIndex, setIntentIndex] = useState<number | null>(null)
  const [selectedProject, setSelectedProject] =
    useState<SliderProject | null>(null)
  const reduceMotion = useReducedMotion()
  const buttonRefs = useRef<Array<HTMLButtonElement | null>>([])
  const triggerRef = useRef<HTMLButtonElement | null>(null)
  const keyboardNavigationRef = useRef(false)

  if (state === 'loading') return <LoadingState />
  if (state === 'empty' || projects.length === 0) return <EmptyState />

  const expandedIndex = intentIndex ?? Math.min(activeIndex, projects.length - 1)

  const openProject = (project: SliderProject, index: number) => {
    triggerRef.current = buttonRefs.current[index]
    setActiveIndex(index)
    setSelectedProject(project)
  }

  const closeProject = () => {
    setSelectedProject(null)
  }

  const handleCardKeyDown = (
    event: KeyboardEvent<HTMLButtonElement>,
    index: number,
  ) => {
    let nextIndex: number | null = null
    if (event.key === 'ArrowRight') {
      nextIndex = Math.min(index + 1, projects.length - 1)
    } else if (event.key === 'ArrowLeft') {
      nextIndex = Math.max(index - 1, 0)
    } else if (event.key === 'Home') {
      nextIndex = 0
    } else if (event.key === 'End') {
      nextIndex = projects.length - 1
    }

    if (nextIndex === null) return

    event.preventDefault()
    keyboardNavigationRef.current = true
    setActiveIndex(nextIndex)
    setIntentIndex(nextIndex)
    const nextButton = buttonRefs.current[nextIndex]
    nextButton?.focus()
    nextButton?.scrollIntoView({
      behavior: 'auto',
      block: 'nearest',
      inline: 'center',
    })
  }

  const shouldAnimateLayout = !reduceMotion && !keyboardNavigationRef.current

  return (
    <section className={styles.root}>
      <h2 className={styles.srOnly}>Elastic Accordion project gallery</h2>
      <div
        aria-label="Projects. Scroll horizontally or use left and right arrow keys."
        className={styles.viewport}
        onPointerDown={() => {
          keyboardNavigationRef.current = false
        }}
        role="region"
      >
        <ol className={styles.rail}>
          {projects.map((project, index) => {
            const isExpanded = index === expandedIndex
            return (
              <motion.li
                className={styles.cardItem}
                data-expanded={isExpanded || undefined}
                key={project.slug}
                layout
                transition={
                  shouldAnimateLayout
                    ? {
                        bounce: 0.08,
                        duration: 0.42,
                        type: 'spring',
                      }
                    : { duration: 0 }
                }
              >
                <button
                  aria-haspopup="dialog"
                  aria-label={`Open ${project.name} project details`}
                  className={styles.card}
                  onBlur={() => setIntentIndex(null)}
                  onClick={() => openProject(project, index)}
                  onFocus={() => {
                    setActiveIndex(index)
                    setIntentIndex(index)
                  }}
                  onKeyDown={(event) => handleCardKeyDown(event, index)}
                  onMouseEnter={() => {
                    keyboardNavigationRef.current = false
                    setIntentIndex(index)
                  }}
                  onMouseLeave={() => setIntentIndex(null)}
                  ref={(node) => {
                    buttonRefs.current[index] = node
                  }}
                  type="button"
                >
                  <ProjectCardImage
                    className={styles.image}
                    eager={index < 2}
                    project={project}
                  />
                </button>
              </motion.li>
            )
          })}
        </ol>
      </div>
      <p className={styles.hint}>
        <span aria-hidden="true">←</span> Scroll or swipe{' '}
        <span aria-hidden="true">→</span>
      </p>

      <AnimatePresence
        onExitComplete={() => {
          triggerRef.current?.focus()
        }}
      >
        {selectedProject ? (
          <ProjectSheet
            key={selectedProject.slug}
            onClose={closeProject}
            project={selectedProject}
          />
        ) : null}
      </AnimatePresence>
    </section>
  )
}

export default ElasticAccordionDirection
