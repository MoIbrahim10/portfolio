import {
  type KeyboardEvent,
  useEffect,
  useId,
  useRef,
  useState,
} from 'react'
import {
  AnimatePresence,
  LayoutGroup,
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
    'A quiet row of image-only covers opens through an aperture-like shared zoom into a wide project gallery and detail panel.',
  id: '08-aperture-zoom',
  motion:
    'Motion React LayoutGroup, layoutId, and AnimatePresence preserve image continuity, with staged details and instant keyboard or reduced-motion paths.',
  name: 'Aperture Zoom',
  skill: {
    name: 'nextjs-framer-motion-animations',
    url: 'https://www.skills.sh/tristanmanchester/agent-skills/nextjs-framer-motion-animations',
  },
} satisfies CardDirectionMetadata

type InteractionSource = 'keyboard' | 'pointer'

const focusableSelector =
  'a[href], button:not([disabled]), [tabindex]:not([tabindex="-1"])'

const apertureSpring = {
  damping: 31,
  mass: 0.9,
  stiffness: 285,
  type: 'spring',
} as const

const instant = { duration: 0 } as const

const getDestinationIndex = (
  key: string,
  index: number,
  count: number,
) => {
  if (key === 'ArrowRight') return Math.min(index + 1, count - 1)
  if (key === 'ArrowLeft') return Math.max(index - 1, 0)
  if (key === 'Home') return 0
  if (key === 'End') return count - 1
  return null
}

function LoadingState() {
  return (
    <section
      aria-busy="true"
      aria-label="Aperture Zoom projects are loading"
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
        <h2>No projects yet</h2>
        <p>The gallery is ready for its first image.</p>
      </div>
    </section>
  )
}

export function ApertureZoomDirection({
  projects,
  state = 'ready',
}: CardDirectionProps) {
  const reduceMotion = Boolean(useReducedMotion())
  const buttonRefs = useRef<Array<HTMLButtonElement | null>>([])
  const dialogRef = useRef<HTMLElement>(null)
  const openerRef = useRef<HTMLButtonElement | null>(null)
  const titleId = useId()
  const descriptionId = useId()
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null)
  const [galleryIndex, setGalleryIndex] = useState(0)
  const [interactionSource, setInteractionSource] =
    useState<InteractionSource>('pointer')

  const selectedProject =
    selectedIndex === null ? null : (projects[selectedIndex] ?? null)
  const shouldAnimate = !reduceMotion && interactionSource === 'pointer'
  const layoutTransition = shouldAnimate ? apertureSpring : instant

  useEffect(() => {
    if (selectedIndex === null) return

    const previousOverflow = document.body.style.overflow
    const focusFrame = requestAnimationFrame(() => {
      dialogRef.current
        ?.querySelector<HTMLElement>('[data-dialog-close]')
        ?.focus()
    })

    document.body.style.overflow = 'hidden'

    return () => {
      cancelAnimationFrame(focusFrame)
      document.body.style.overflow = previousOverflow
    }
  }, [selectedIndex])

  if (state === 'loading') return <LoadingState />
  if (state === 'empty' || projects.length === 0) return <EmptyState />

  const gallery =
    selectedProject && selectedProject.gallery.length > 0
      ? selectedProject.gallery
      : selectedProject
        ? [selectedProject.image]
        : []
  const currentGalleryImage =
    gallery[galleryIndex] ?? selectedProject?.image ?? ''

  const openProject = (
    index: number,
    opener: HTMLButtonElement,
    source: InteractionSource,
  ) => {
    openerRef.current = opener
    setGalleryIndex(0)
    setInteractionSource(source)
    setSelectedIndex(index)
  }

  const closeProject = (source: InteractionSource) => {
    setInteractionSource(source)
    setSelectedIndex(null)
  }

  const handleCardKeyDown = (
    event: KeyboardEvent<HTMLButtonElement>,
    index: number,
  ) => {
    const destination = getDestinationIndex(
      event.key,
      index,
      projects.length,
    )

    if (destination !== null) {
      event.preventDefault()
      const destinationButton = buttonRefs.current[destination]
      destinationButton?.focus()
      destinationButton?.scrollIntoView({
        behavior: 'auto',
        block: 'nearest',
        inline: 'center',
      })
      return
    }

    if (event.key !== 'Enter' && event.key !== ' ') return

    event.preventDefault()
    openProject(index, event.currentTarget, 'keyboard')
  }

  const handleDialogKeyDown = (event: KeyboardEvent<HTMLElement>) => {
    if (event.key === 'Escape') {
      event.preventDefault()
      closeProject('keyboard')
      return
    }

    if (event.key !== 'Tab') return

    const focusable = Array.from(
      dialogRef.current?.querySelectorAll<HTMLElement>(focusableSelector) ?? [],
    )

    if (focusable.length === 0) {
      event.preventDefault()
      dialogRef.current?.focus()
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

  return (
    <MotionConfig reducedMotion="user">
      <LayoutGroup id="project-card-aperture-zoom">
        <section className={styles.root}>
          <div
            aria-label="Projects"
            className={styles.rail}
            role="list"
          >
            {projects.map((project, index) => (
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
                  onClick={(event) =>
                    openProject(index, event.currentTarget, 'pointer')
                  }
                  onKeyDown={(event) => handleCardKeyDown(event, index)}
                  ref={(node) => {
                    buttonRefs.current[index] = node
                  }}
                  type="button"
                >
                  <motion.span
                    className={styles.cardMedia}
                    layoutId={`aperture-media-${project.slug}`}
                    transition={layoutTransition}
                  >
                    <ProjectCardImage
                      eager={index < 3}
                      project={project}
                    />
                  </motion.span>
                </button>
              </article>
            ))}
          </div>

          <AnimatePresence
            initial={false}
            onExitComplete={() => openerRef.current?.focus()}
          >
            {selectedProject ? (
              <motion.div
                animate={{ opacity: 1 }}
                className={styles.dialogLayer}
                exit={{ opacity: 0 }}
                initial={{ opacity: shouldAnimate ? 0 : 1 }}
                key={selectedProject.slug}
                transition={{ duration: shouldAnimate ? 0.18 : 0 }}
              >
                <button
                  aria-label="Close project details"
                  className={styles.backdrop}
                  onClick={() => closeProject('pointer')}
                  tabIndex={-1}
                  type="button"
                />

                <motion.section
                  aria-describedby={descriptionId}
                  aria-labelledby={titleId}
                  aria-modal="true"
                  className={styles.dialog}
                  onKeyDown={handleDialogKeyDown}
                  ref={dialogRef}
                  role="dialog"
                  tabIndex={-1}
                >
                  <motion.figure
                    className={styles.heroMedia}
                    layoutId={`aperture-media-${selectedProject.slug}`}
                    transition={layoutTransition}
                  >
                    {currentGalleryImage === selectedProject.image ? (
                      <ProjectCardImage
                        eager
                        project={selectedProject}
                      />
                    ) : (
                      <img
                        alt={`${selectedProject.name} gallery view ${galleryIndex + 1}`}
                        decoding="async"
                        height={1498}
                        src={currentGalleryImage}
                        width={3018}
                      />
                    )}
                  </motion.figure>

                  <motion.div
                    animate={{ opacity: 1, y: 0 }}
                    className={styles.details}
                    initial={{
                      opacity: shouldAnimate ? 0 : 1,
                      y: shouldAnimate ? 10 : 0,
                    }}
                    transition={{
                      delay: shouldAnimate ? 0.18 : 0,
                      duration: shouldAnimate ? 0.24 : 0,
                      ease: [0.22, 1, 0.36, 1],
                    }}
                  >
                    <button
                      aria-label="Close project details"
                      className={styles.closeButton}
                      data-dialog-close
                      onClick={() => closeProject('pointer')}
                      type="button"
                    >
                      <span aria-hidden="true">×</span>
                    </button>

                    <div className={styles.copy}>
                      <h2 id={titleId}>{selectedProject.name}</h2>
                      <p id={descriptionId}>{selectedProject.description}</p>
                    </div>

                    {gallery.length > 1 ? (
                      <div
                        aria-label={`${selectedProject.name} gallery`}
                        className={styles.gallery}
                        role="group"
                      >
                        {gallery.map((image, index) => (
                          <button
                            aria-label={`Show gallery image ${index + 1}`}
                            aria-pressed={galleryIndex === index}
                            className={styles.galleryButton}
                            key={`${image}-${index}`}
                            onClick={() => setGalleryIndex(index)}
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

                    <div className={styles.footer}>
                      <div>
                        <p className={styles.metaLabel}>Collaborators</p>
                        <ul className={styles.collaborators}>
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
                          Visit project
                        </CutCornerButton>
                      ) : null}
                    </div>
                  </motion.div>
                </motion.section>
              </motion.div>
            ) : null}
          </AnimatePresence>
        </section>
      </LayoutGroup>
    </MotionConfig>
  )
}
