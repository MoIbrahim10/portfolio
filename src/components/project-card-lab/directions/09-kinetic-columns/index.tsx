import {
  type KeyboardEvent,
  type MouseEvent,
  useEffect,
  useRef,
  useState,
} from 'react'
import { AnimatePresence, motion, useReducedMotion } from 'motion/react'

import { CutCornerButton } from '../../../project-lab/shared/CutCornerButton'
import type { SliderProject } from '../../../project-slider-lab/shared/types'
import { ProjectCardImage } from '../../shared/ProjectCardImage'
import type {
  CardDirectionMetadata,
  CardDirectionProps,
} from '../../shared/types'

import styles from './styles.module.css'

export const metadata = {
  description:
    'A measured row of slender image columns that alternate baseline, settle upright on focus, and open into a quiet split detail panel.',
  id: '09-kinetic-columns',
  motion:
    'Transform-only column settling and image uncropping, followed by an origin-aware vertical panel unroll with instant keyboard and reduced-motion paths.',
  name: 'Kinetic Columns',
  skill: {
    name: 'ui-animation',
    url: 'https://www.skills.sh/mblode/agent-skills/ui-animation',
  },
} satisfies CardDirectionMetadata

const focusableSelector =
  'a[href], button:not([disabled]), [tabindex]:not([tabindex="-1"])'

const nextIndexForKey = (key: string, index: number, count: number) => {
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
      aria-label="Kinetic Columns projects are loading"
      className={`${styles.root} ${styles.loading}`}
    >
      <Header />
      <div aria-hidden="true" className={styles.rail}>
        {Array.from({ length: 6 }, (_, index) => (
          <span className={styles.skeleton} key={index}>
            <span />
          </span>
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
    <section className={styles.root}>
      <Header />
      <div className={styles.empty}>
        <p>No project images yet.</p>
        <span>The column rail is ready for its first project.</span>
      </div>
    </section>
  )
}

function Header() {
  return (
    <header className={styles.header}>
      <div>
        <p className={styles.eyebrow}>Selected work</p>
        <h2 id="kinetic-columns-heading">Kinetic Columns</h2>
      </div>
      <p className={styles.hint}>Scroll, swipe, or use arrow keys</p>
    </header>
  )
}

interface ColumnCardProps {
  index: number
  onKeyDown: (event: KeyboardEvent<HTMLButtonElement>, index: number) => void
  onOpen: (
    index: number,
    opener: HTMLButtonElement,
    keyboardInitiated: boolean,
  ) => void
  project: SliderProject
  register: (index: number, button: HTMLButtonElement | null) => void
}

function ColumnCard({
  index,
  onKeyDown,
  onOpen,
  project,
  register,
}: ColumnCardProps) {
  return (
    <article className={styles.card}>
      <h3 className={styles.srOnly}>{project.name}</h3>
      <button
        aria-label={`Open details for ${project.name}`}
        className={styles.cardButton}
        onClick={(event: MouseEvent<HTMLButtonElement>) =>
          onOpen(index, event.currentTarget, event.detail === 0)
        }
        onKeyDown={(event) => onKeyDown(event, index)}
        ref={(button) => register(index, button)}
        type="button"
      >
        <span className={styles.imageFrame}>
          <ProjectCardImage
            aria-hidden="true"
            eager={index < 3}
            project={project}
          />
        </span>
      </button>
    </article>
  )
}

export function KineticColumnsDirection({
  projects,
  state = 'ready',
}: CardDirectionProps) {
  const reduceMotion = Boolean(useReducedMotion())
  const buttonRefs = useRef<Array<HTMLButtonElement | null>>([])
  const panelRef = useRef<HTMLElement>(null)
  const openerRef = useRef<HTMLButtonElement | null>(null)
  const [activeIndex, setActiveIndex] = useState<number | null>(null)
  const [galleryIndex, setGalleryIndex] = useState(0)
  const [instantTransition, setInstantTransition] = useState(false)

  useEffect(() => {
    if (activeIndex === null) return

    const opener = openerRef.current
    const previousOverflow = document.body.style.overflow
    const focusFrame = requestAnimationFrame(() => {
      panelRef.current
        ?.querySelector<HTMLElement>(focusableSelector)
        ?.focus()
    })
    const handleEscape = (event: globalThis.KeyboardEvent) => {
      if (event.key !== 'Escape') return
      setInstantTransition(true)
      setActiveIndex(null)
    }

    document.body.style.overflow = 'hidden'
    document.addEventListener('keydown', handleEscape)

    return () => {
      cancelAnimationFrame(focusFrame)
      document.body.style.overflow = previousOverflow
      document.removeEventListener('keydown', handleEscape)
      requestAnimationFrame(() => opener?.focus())
    }
  }, [activeIndex])

  if (state === 'loading') return <LoadingState />
  if (state === 'empty' || projects.length === 0) return <EmptyState />

  const activeProject =
    activeIndex === null ? null : (projects[activeIndex] ?? null)

  const handleRailKeyDown = (
    event: KeyboardEvent<HTMLButtonElement>,
    index: number,
  ) => {
    const nextIndex = nextIndexForKey(event.key, index, projects.length)
    if (nextIndex === null) return

    event.preventDefault()
    const nextButton = buttonRefs.current[nextIndex]
    nextButton?.focus()
    nextButton?.scrollIntoView({
      behavior: 'auto',
      block: 'nearest',
      inline: 'center',
    })
  }

  const openPanel = (
    index: number,
    opener: HTMLButtonElement,
    keyboardInitiated: boolean,
  ) => {
    openerRef.current = opener
    setGalleryIndex(0)
    setInstantTransition(keyboardInitiated)
    setActiveIndex(index)
  }

  const closePanel = (keyboardInitiated = false) => {
    setInstantTransition(keyboardInitiated)
    setActiveIndex(null)
  }

  const handlePanelKeyDown = (event: KeyboardEvent<HTMLElement>) => {
    if (event.key !== 'Tab') return

    const focusable = Array.from(
      panelRef.current?.querySelectorAll<HTMLElement>(focusableSelector) ?? [],
    )
    if (focusable.length === 0) return

    const first = focusable[0]
    const last = focusable[focusable.length - 1]
    if (event.shiftKey && document.activeElement === first) {
      event.preventDefault()
      last.focus()
    } else if (!event.shiftKey && document.activeElement === last) {
      event.preventDefault()
      first.focus()
    }
  }

  const transitionOff = reduceMotion || instantTransition

  return (
    <section
      aria-labelledby="kinetic-columns-heading"
      className={styles.root}
    >
      <Header />

      <div
        aria-label="Project image rail"
        className={styles.rail}
        role="region"
      >
        {projects.map((project, index) => (
          <ColumnCard
            index={index}
            key={project.slug}
            onKeyDown={handleRailKeyDown}
            onOpen={openPanel}
            project={project}
            register={(buttonIndex, button) => {
              buttonRefs.current[buttonIndex] = button
            }}
          />
        ))}
      </div>

      <footer className={styles.footer}>
        <span>{String(projects.length).padStart(2, '0')} projects</span>
        <span aria-hidden="true">Horizontal archive →</span>
      </footer>

      <AnimatePresence initial={false}>
        {activeProject ? (
          <div className={styles.layer}>
            <motion.button
              animate={{ opacity: 1 }}
              aria-label="Close project details"
              className={styles.backdrop}
              exit={{ opacity: 0 }}
              initial={{ opacity: transitionOff ? 1 : 0 }}
              onClick={() => closePanel()}
              transition={{ duration: transitionOff ? 0 : 0.16 }}
              type="button"
            />
            <motion.aside
              animate={{ opacity: 1, scaleY: 1, y: 0 }}
              aria-describedby={`kinetic-description-${activeProject.slug}`}
              aria-labelledby={`kinetic-title-${activeProject.slug}`}
              aria-modal="true"
              className={styles.panel}
              exit={{
                opacity: transitionOff ? 0 : 1,
                scaleY: transitionOff ? 1 : 0.96,
                y: transitionOff ? 0 : '100%',
              }}
              initial={{
                opacity: transitionOff ? 1 : 0.98,
                scaleY: transitionOff ? 1 : 0.96,
                y: transitionOff ? 0 : '100%',
              }}
              onKeyDown={handlePanelKeyDown}
              ref={panelRef}
              role="dialog"
              transition={{
                duration: transitionOff ? 0 : 0.32,
                ease: [0.32, 0.72, 0, 1],
              }}
            >
              <div className={styles.panelMedia}>
                <img
                  alt={`${activeProject.name}, gallery image ${galleryIndex + 1}`}
                  decoding="async"
                  height={1498}
                  loading="lazy"
                  src={
                    activeProject.gallery[galleryIndex] ?? activeProject.image
                  }
                  width={3018}
                />
                {activeProject.gallery.length > 1 ? (
                  <div
                    aria-label="Choose gallery image"
                    className={styles.galleryTabs}
                    role="tablist"
                  >
                    {activeProject.gallery.map((image, index) => (
                      <button
                        aria-label={`Show gallery image ${index + 1}`}
                        aria-selected={galleryIndex === index}
                        className={styles.galleryTab}
                        key={`${image}-${index}`}
                        onClick={() => setGalleryIndex(index)}
                        role="tab"
                        type="button"
                      >
                        <img
                          alt=""
                          aria-hidden="true"
                          decoding="async"
                          height={1498}
                          loading="lazy"
                          src={image}
                          width={3018}
                        />
                      </button>
                    ))}
                  </div>
                ) : null}
              </div>

              <div className={styles.panelDetails}>
                <header className={styles.panelHeader}>
                  <div>
                    <p className={styles.eyebrow}>Project details</p>
                    <h3 id={`kinetic-title-${activeProject.slug}`}>
                      {activeProject.name}
                    </h3>
                  </div>
                  <CutCornerButton
                    onClick={() => closePanel(true)}
                    variant="paper"
                  >
                    Close <span aria-hidden="true">×</span>
                  </CutCornerButton>
                </header>

                <p
                  className={styles.description}
                  id={`kinetic-description-${activeProject.slug}`}
                >
                  {activeProject.description}
                </p>

                {activeProject.collaborators.length > 0 ? (
                  <div className={styles.collaborators}>
                    <p>Collaboration</p>
                    <ul>
                      {activeProject.collaborators.map((collaborator) => (
                        <li key={collaborator}>{collaborator}</li>
                      ))}
                    </ul>
                  </div>
                ) : null}

                <div className={styles.panelFooter}>
                  {activeProject.href ? (
                    <CutCornerButton
                      href={activeProject.href}
                      variant="gold"
                    >
                      View project <span aria-hidden="true">↗</span>
                    </CutCornerButton>
                  ) : (
                    <p>Case study available on request.</p>
                  )}
                </div>
              </div>
            </motion.aside>
          </div>
        ) : null}
      </AnimatePresence>
    </section>
  )
}
