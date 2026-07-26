import {
  type KeyboardEvent as ReactKeyboardEvent,
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
    'Image-only cards share their geometry with a quiet centered project sheet, making opening a project feel like unfolding the card itself.',
  id: '01-layout-morph',
  motion:
    'Motion React LayoutGroup, layoutId, and AnimatePresence with a restrained spring and instant keyboard or reduced-motion fallbacks.',
  name: 'Layout Morph',
  skill: {
    name: 'nextjs-framer-motion-animations',
    url: 'https://www.skills.sh/tristanmanchester/agent-skills/nextjs-framer-motion-animations',
  },
} satisfies CardDirectionMetadata

type InteractionSource = 'keyboard' | 'pointer'

const spring = {
  damping: 30,
  mass: 0.85,
  stiffness: 300,
  type: 'spring',
} as const

const instant = { duration: 0 } as const
const loadingPlaceholders = ['one', 'two', 'three', 'four', 'five'] as const

function LoadingState() {
  return (
    <section
      aria-busy="true"
      aria-label="Layout Morph projects are loading"
      className={`${styles.root} ${styles.loading}`}
    >
      <div aria-hidden="true" className={styles.loadingRail}>
        {loadingPlaceholders.map((placeholder) => (
          <span className={styles.skeletonCard} key={placeholder} />
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
        <p>The rail is ready for its first image.</p>
      </div>
    </section>
  )
}

export function LayoutMorphDirection({
  projects,
  state = 'ready',
}: CardDirectionProps) {
  const reduceMotion = useReducedMotion()
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
  const shouldAnimate = !reduceMotion && interactionSource !== 'keyboard'
  const layoutTransition = shouldAnimate ? spring : instant

  useEffect(() => {
    if (selectedIndex === null) return

    const previousOverflow = document.body.style.overflow
    const focusFrame = requestAnimationFrame(() => {
      dialogRef.current
        ?.querySelector<HTMLButtonElement>('[data-dialog-close]')
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

  const openDetails = (
    index: number,
    opener: HTMLButtonElement,
    source: InteractionSource,
  ) => {
    openerRef.current = opener
    setInteractionSource(source)
    setGalleryIndex(0)
    setSelectedIndex(index)
  }

  const closeDetails = (source: InteractionSource) => {
    setInteractionSource(source)
    setSelectedIndex(null)
  }

  const handleCardKeyDown = (
    event: ReactKeyboardEvent<HTMLButtonElement>,
    index: number,
  ) => {
    if (event.key !== 'Enter' && event.key !== ' ') return

    event.preventDefault()
    openDetails(index, event.currentTarget, 'keyboard')
  }

  const handleDialogKeyDown = (
    event: ReactKeyboardEvent<HTMLElement>,
  ) => {
    if (event.key === 'Escape') {
      event.preventDefault()
      closeDetails('keyboard')
      return
    }

    if (event.key !== 'Tab') return

    const focusable = Array.from(
      dialogRef.current?.querySelectorAll<HTMLElement>(
        'a[href], button:not([disabled]), [tabindex]:not([tabindex="-1"])',
      ) ?? [],
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
      <LayoutGroup id="project-card-layout-morph">
        <section className={styles.root}>
          <div
            aria-label="Projects"
            className={styles.rail}
            role="list"
          >
            {projects.map((project, index) => (
              <motion.article
                className={styles.card}
                key={project.slug}
                role="listitem"
                transition={{ duration: reduceMotion ? 0 : 0.16 }}
                whileHover={reduceMotion ? undefined : { y: -3 }}
              >
                <h3 className={styles.srOnly}>{project.name}</h3>
                <button
                  aria-haspopup="dialog"
                  aria-label={`Open ${project.name} project details`}
                  className={styles.cardButton}
                  onClick={(event) =>
                    openDetails(index, event.currentTarget, 'pointer')
                  }
                  onKeyDown={(event) => handleCardKeyDown(event, index)}
                  type="button"
                >
                  <motion.div
                    className={styles.cardImage}
                    layoutId={`layout-morph-image-${project.slug}`}
                    transition={layoutTransition}
                  >
                    <ProjectCardImage
                      eager={index < 3}
                      project={project}
                    />
                  </motion.div>
                </button>
              </motion.article>
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
                  onClick={() => closeDetails('pointer')}
                  tabIndex={-1}
                  type="button"
                />

                <motion.aside
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
                    className={styles.dialogMedia}
                    layoutId={`layout-morph-image-${selectedProject.slug}`}
                    transition={layoutTransition}
                  >
                    {(
                      selectedProject.gallery[galleryIndex] ??
                      selectedProject.image
                    ) === selectedProject.image ? (
                      <ProjectCardImage
                        eager
                        project={selectedProject}
                      />
                    ) : (
                      <img
                        alt={`${selectedProject.name} gallery view ${galleryIndex + 1}`}
                        decoding="async"
                        height={1498}
                        src={selectedProject.gallery[galleryIndex]}
                        width={3018}
                      />
                    )}
                  </motion.figure>

                  <motion.div
                    animate={{ opacity: 1, y: 0 }}
                    className={styles.details}
                    initial={{
                      opacity: shouldAnimate ? 0 : 1,
                      y: shouldAnimate ? 12 : 0,
                    }}
                    transition={{
                      delay: shouldAnimate ? 0.16 : 0,
                      duration: shouldAnimate ? 0.25 : 0,
                    }}
                  >
                    <button
                      aria-label="Close project details"
                      className={styles.closeButton}
                      data-dialog-close
                      onClick={() => closeDetails('pointer')}
                      type="button"
                    >
                      <span aria-hidden="true">×</span>
                    </button>

                    <div>
                      <h2 id={titleId}>{selectedProject.name}</h2>
                      <p className={styles.description} id={descriptionId}>
                        {selectedProject.description}
                      </p>
                    </div>

                    {selectedProject.gallery.length > 1 ? (
                      <div
                        aria-label={`${selectedProject.name} gallery`}
                        className={styles.gallery}
                        role="group"
                      >
                        {selectedProject.gallery.map((image, index) => (
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

                    <div className={styles.detailsFooter}>
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
                </motion.aside>
              </motion.div>
            ) : null}
          </AnimatePresence>
        </section>
      </LayoutGroup>
    </MotionConfig>
  )
}
