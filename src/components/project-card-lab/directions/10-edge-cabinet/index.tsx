import {
  type KeyboardEvent,
  type MouseEvent,
  useEffect,
  useId,
  useRef,
  useState,
} from 'react'
import {
  AnimatePresence,
  MotionConfig,
  motion,
  useReducedMotion,
} from 'motion/react'

import { CutCornerButton } from '../../../project-lab/shared/CutCornerButton'
import { ProjectCardImage } from '../../shared/ProjectCardImage'
import type {
  CardDirectionMetadata,
  CardDirectionProps,
} from '../../shared/types'

import styles from './styles.module.css'

export const metadata = {
  description:
    'A compact image-only snap row whose selected cover hinges at its edge before resolving into a restrained project detail cabinet.',
  id: '10-edge-cabinet',
  motion:
    'Motion React drives a brief transform-only card hinge and side-cabinet reveal, with instant keyboard and reduced-motion paths.',
  name: 'Edge Cabinet',
  skill: {
    name: 'nextjs-framer-motion-animations',
    url: 'https://www.skills.sh/tristanmanchester/agent-skills/nextjs-framer-motion-animations',
  },
} satisfies CardDirectionMetadata

type InteractionSource = 'keyboard' | 'pointer'

const focusableSelector =
  'a[href], button:not([disabled]), [tabindex]:not([tabindex="-1"])'

const destinationForKey = (
  key: string,
  index: number,
  count: number,
) => {
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
      aria-label="Edge Cabinet projects are loading"
      className={`${styles.root} ${styles.loading}`}
    >
      <div aria-hidden="true" className={styles.rail}>
        {Array.from({ length: 6 }, (_, index) => (
          <span className={styles.skeleton} key={index} />
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
      <div>
        <h2>No project covers yet</h2>
        <p>The cabinet is ready for its first project.</p>
      </div>
    </section>
  )
}

export function EdgeCabinetDirection({
  projects,
  state = 'ready',
}: CardDirectionProps) {
  const reduceMotion = Boolean(useReducedMotion())
  const cardRefs = useRef<Array<HTMLButtonElement | null>>([])
  const cabinetRef = useRef<HTMLElement>(null)
  const openerRef = useRef<HTMLButtonElement | null>(null)
  const titleId = useId()
  const descriptionId = useId()
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null)
  const [cabinetOpen, setCabinetOpen] = useState(false)
  const [galleryIndex, setGalleryIndex] = useState(0)
  const [source, setSource] = useState<InteractionSource>('pointer')

  const selectedProject =
    selectedIndex === null ? null : (projects[selectedIndex] ?? null)
  const instant = reduceMotion || source === 'keyboard'

  useEffect(() => {
    if (selectedIndex === null || cabinetOpen) return

    if (instant) {
      setCabinetOpen(true)
      return
    }

    const timer = window.setTimeout(() => setCabinetOpen(true), 170)
    return () => window.clearTimeout(timer)
  }, [cabinetOpen, instant, selectedIndex])

  useEffect(() => {
    if (!cabinetOpen) return

    const previousOverflow = document.body.style.overflow
    const focusFrame = requestAnimationFrame(() => {
      cabinetRef.current
        ?.querySelector<HTMLElement>('[data-cabinet-close]')
        ?.focus()
    })
    document.body.style.overflow = 'hidden'

    return () => {
      cancelAnimationFrame(focusFrame)
      document.body.style.overflow = previousOverflow
    }
  }, [cabinetOpen])

  if (state === 'loading') return <LoadingState />
  if (state === 'empty' || projects.length === 0) return <EmptyState />

  const openProject = (
    index: number,
    opener: HTMLButtonElement,
    interactionSource: InteractionSource,
  ) => {
    openerRef.current = opener
    setGalleryIndex(0)
    setSource(interactionSource)
    setCabinetOpen(false)
    setSelectedIndex(index)
  }

  const closeProject = (interactionSource: InteractionSource) => {
    setSource(interactionSource)
    setCabinetOpen(false)
    setSelectedIndex(null)
  }

  const handleCardKeyDown = (
    event: KeyboardEvent<HTMLButtonElement>,
    index: number,
  ) => {
    const destination = destinationForKey(
      event.key,
      index,
      projects.length,
    )
    if (destination === null) return

    event.preventDefault()
    const button = cardRefs.current[destination]
    button?.focus()
    button?.scrollIntoView({
      behavior: 'auto',
      block: 'nearest',
      inline: 'center',
    })
  }

  const handleCabinetKeyDown = (event: KeyboardEvent<HTMLElement>) => {
    if (event.key === 'Escape') {
      event.preventDefault()
      closeProject('keyboard')
      return
    }
    if (event.key !== 'Tab') return

    const focusable = Array.from(
      cabinetRef.current?.querySelectorAll<HTMLElement>(
        focusableSelector,
      ) ?? [],
    )
    if (focusable.length === 0) {
      event.preventDefault()
      cabinetRef.current?.focus()
      return
    }

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

  const gallery =
    selectedProject && selectedProject.gallery.length > 0
      ? selectedProject.gallery
      : selectedProject
        ? [selectedProject.image]
        : []
  const galleryImage =
    gallery[galleryIndex] ?? selectedProject?.image ?? ''

  return (
    <MotionConfig reducedMotion="user">
      <section
        aria-labelledby="edge-cabinet-heading"
        className={styles.root}
      >
        <header className={styles.header}>
          <h2 id="edge-cabinet-heading">Selected work</h2>
          <p>Scroll or use arrow keys</p>
        </header>

        <div
          aria-label="Project covers"
          className={styles.rail}
          role="list"
        >
          {projects.map((project, index) => {
            const isHinging =
              selectedIndex === index && !cabinetOpen && !instant

            return (
              <article
                className={styles.card}
                key={project.slug}
                role="listitem"
              >
                <h3 className={styles.srOnly}>{project.name}</h3>
                <button
                  aria-haspopup="dialog"
                  aria-label={`Open ${project.name} project details`}
                  className={styles.cardButton}
                  onClick={(event: MouseEvent<HTMLButtonElement>) =>
                    openProject(
                      index,
                      event.currentTarget,
                      event.detail === 0 ? 'keyboard' : 'pointer',
                    )
                  }
                  onKeyDown={(event) => handleCardKeyDown(event, index)}
                  ref={(button) => {
                    cardRefs.current[index] = button
                  }}
                  type="button"
                >
                  <motion.span
                    animate={{
                      rotateY: isHinging ? -9 : 0,
                      x: isHinging ? -3 : 0,
                    }}
                    className={styles.cardDoor}
                    transition={
                      isHinging
                        ? {
                            damping: 24,
                            mass: 0.7,
                            stiffness: 330,
                            type: 'spring',
                          }
                        : { duration: instant ? 0 : 0.16 }
                    }
                  >
                    <ProjectCardImage
                      eager={index < 3}
                      project={project}
                    />
                  </motion.span>
                </button>
              </article>
            )
          })}
        </div>

        <AnimatePresence
          initial={false}
          onExitComplete={() => openerRef.current?.focus()}
        >
          {cabinetOpen && selectedProject ? (
            <motion.div
              animate={{ opacity: 1 }}
              className={styles.layer}
              exit={{ opacity: 0 }}
              initial={{ opacity: instant ? 1 : 0 }}
              key={selectedProject.slug}
              transition={{ duration: instant ? 0 : 0.16 }}
            >
              <button
                aria-label="Close project details"
                className={styles.backdrop}
                onClick={() => closeProject('pointer')}
                tabIndex={-1}
                type="button"
              />

              <motion.aside
                animate={{ opacity: 1, rotateY: 0, x: 0 }}
                aria-describedby={descriptionId}
                aria-labelledby={titleId}
                aria-modal="true"
                className={styles.cabinet}
                exit={{
                  opacity: instant ? 0 : 1,
                  rotateY: instant ? 0 : -3,
                  x: instant ? 0 : '100%',
                }}
                initial={{
                  opacity: instant ? 1 : 0.98,
                  rotateY: instant ? 0 : -3,
                  x: instant ? 0 : '100%',
                }}
                onKeyDown={handleCabinetKeyDown}
                ref={cabinetRef}
                role="dialog"
                tabIndex={-1}
                transition={{
                  duration: instant ? 0 : 0.34,
                  ease: [0.32, 0.72, 0, 1],
                }}
              >
                <div className={styles.cabinetTop}>
                  <span aria-hidden="true" className={styles.edge} />
                  <button
                    aria-label="Close project details"
                    className={styles.closeButton}
                    data-cabinet-close
                    onClick={() => closeProject('pointer')}
                    type="button"
                  >
                    <span aria-hidden="true">×</span>
                  </button>
                </div>

                <figure className={styles.gallery}>
                  {galleryImage === selectedProject.image ? (
                    <ProjectCardImage
                      eager
                      project={selectedProject}
                    />
                  ) : (
                    <img
                      alt={`${selectedProject.name} gallery image ${galleryIndex + 1}`}
                      decoding="async"
                      height={1498}
                      loading="lazy"
                      src={galleryImage}
                      width={3018}
                    />
                  )}
                </figure>

                {gallery.length > 1 ? (
                  <div
                    aria-label={`${selectedProject.name} gallery`}
                    className={styles.galleryTabs}
                    role="tablist"
                  >
                    {gallery.map((image, index) => (
                      <button
                        aria-label={`Show gallery image ${index + 1}`}
                        aria-selected={galleryIndex === index}
                        className={styles.galleryTab}
                        key={image}
                        onClick={() => setGalleryIndex(index)}
                        role="tab"
                        type="button"
                      >
                        <img
                          alt=""
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

                <div className={styles.details}>
                  <h3 id={titleId}>{selectedProject.name}</h3>
                  <p id={descriptionId}>{selectedProject.description}</p>

                  <div className={styles.collaborators}>
                    <span>With</span>
                    <ul>
                      {selectedProject.collaborators.map((collaborator) => (
                        <li key={collaborator}>{collaborator}</li>
                      ))}
                    </ul>
                  </div>

                  {selectedProject.href ? (
                    <CutCornerButton
                      href={selectedProject.href}
                      rel="noreferrer"
                      target="_blank"
                      variant="navy"
                    >
                      View project
                    </CutCornerButton>
                  ) : null}
                </div>
              </motion.aside>
            </motion.div>
          ) : null}
        </AnimatePresence>
      </section>
    </MotionConfig>
  )
}
