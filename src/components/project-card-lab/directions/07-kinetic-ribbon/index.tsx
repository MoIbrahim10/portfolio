import {
  type KeyboardEvent,
  useEffect,
  useId,
  useRef,
  useState,
} from 'react'
import {
  AnimatePresence,
  motion,
  useMotionValue,
  useReducedMotion,
  useSpring,
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
    'A continuous row of image-only project covers that leans gently with scroll velocity, then opens details in a wide bottom drawer.',
  id: '07-kinetic-ribbon',
  motion:
    'A shared Motion spring maps native scroll velocity to a restrained transform-only skew; the bottom drawer uses an asymmetric translate reveal and instant keyboard path.',
  name: 'Kinetic Ribbon',
  skill: {
    name: 'ui-animation',
    url: 'https://www.skills.sh/mblode/agent-skills/ui-animation',
  },
} satisfies CardDirectionMetadata

const focusableSelector =
  'a[href], button:not([disabled]), [tabindex]:not([tabindex="-1"])'

const getNextIndex = (key: string, index: number, count: number) => {
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
      aria-label="Kinetic Ribbon projects are loading"
      className={`${styles.root} ${styles.loading}`}
    >
      <header className={styles.header}>
        <p>Selected work</p>
        <span>Loading</span>
      </header>
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
      <header className={styles.header}>
        <p>Selected work</p>
        <span>00</span>
      </header>
      <div className={styles.emptyMessage}>
        <h2>No projects yet</h2>
        <p>The ribbon is ready for its first image.</p>
      </div>
    </section>
  )
}

export function KineticRibbonDirection({
  projects,
  state = 'ready',
}: CardDirectionProps) {
  const reduceMotion = Boolean(useReducedMotion())
  const railRef = useRef<HTMLDivElement>(null)
  const buttonRefs = useRef<Array<HTMLButtonElement | null>>([])
  const drawerRef = useRef<HTMLElement>(null)
  const openerRef = useRef<HTMLButtonElement | null>(null)
  const titleId = useId()
  const descriptionId = useId()
  const rawLean = useMotionValue(0)
  const lean = useSpring(rawLean, {
    damping: 30,
    mass: 0.45,
    stiffness: 270,
  })
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null)
  const [galleryIndex, setGalleryIndex] = useState(0)
  const [interactionSource, setInteractionSource] = useState<
    'keyboard' | 'pointer'
  >('pointer')

  const selectedProject =
    selectedIndex === null ? null : (projects[selectedIndex] ?? null)
  const shouldAnimate = !reduceMotion && interactionSource === 'pointer'

  useEffect(() => {
    const rail = railRef.current
    if (!rail || reduceMotion) {
      rawLean.set(0)
      return
    }

    let lastLeft = rail.scrollLeft
    let lastTime = performance.now()
    let settleTimer: number | undefined

    const handleScroll = () => {
      const now = performance.now()
      const elapsed = Math.max(now - lastTime, 16)
      const velocity = (rail.scrollLeft - lastLeft) / elapsed
      const nextLean = Math.max(-3.6, Math.min(3.6, velocity * 0.72))

      rawLean.set(nextLean)
      rail.dataset.moving = 'true'
      lastLeft = rail.scrollLeft
      lastTime = now
      window.clearTimeout(settleTimer)
      settleTimer = window.setTimeout(() => {
        rawLean.set(0)
        delete rail.dataset.moving
      }, 72)
    }

    rail.addEventListener('scroll', handleScroll, { passive: true })

    return () => {
      rail.removeEventListener('scroll', handleScroll)
      window.clearTimeout(settleTimer)
      rawLean.set(0)
      delete rail.dataset.moving
    }
  }, [rawLean, reduceMotion])

  useEffect(() => {
    if (selectedIndex === null) return

    const previousOverflow = document.body.style.overflow
    const focusFrame = requestAnimationFrame(() => {
      drawerRef.current
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
  const galleryImage = gallery[galleryIndex]

  const handleCardKeyDown = (
    event: KeyboardEvent<HTMLButtonElement>,
    index: number,
  ) => {
    const nextIndex = getNextIndex(event.key, index, projects.length)
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

  const openDetails = (
    index: number,
    opener: HTMLButtonElement,
    source: 'keyboard' | 'pointer',
  ) => {
    openerRef.current = opener
    setInteractionSource(source)
    setGalleryIndex(0)
    setSelectedIndex(index)
  }

  const closeDetails = (source: 'keyboard' | 'pointer') => {
    setInteractionSource(source)
    setSelectedIndex(null)
  }

  const handleDrawerKeyDown = (event: KeyboardEvent<HTMLElement>) => {
    if (event.key === 'Escape') {
      event.preventDefault()
      closeDetails('keyboard')
      return
    }

    if (event.key !== 'Tab') return

    const focusable = Array.from(
      drawerRef.current?.querySelectorAll<HTMLElement>(focusableSelector) ?? [],
    )

    if (focusable.length === 0) {
      event.preventDefault()
      drawerRef.current?.focus()
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
    <section
      aria-labelledby="kinetic-ribbon-heading"
      className={styles.root}
    >
      <header className={styles.header}>
        <div>
          <p>Selected work</p>
          <h2 id="kinetic-ribbon-heading">Kinetic Ribbon</h2>
        </div>
        <span>{String(projects.length).padStart(2, '0')}</span>
      </header>

      <div
        aria-label="Project images. Scroll horizontally or use arrow keys."
        className={styles.rail}
        ref={railRef}
        role="list"
      >
        {projects.map((project, index) => (
          <article className={styles.card} key={project.slug} role="listitem">
            <h3 className={styles.srOnly}>{project.name}</h3>
            <button
              aria-haspopup="dialog"
              aria-label={`Open ${project.name} project details`}
              className={styles.cardButton}
              onClick={(event) =>
                openDetails(
                  index,
                  event.currentTarget,
                  event.detail === 0 ? 'keyboard' : 'pointer',
                )
              }
              onKeyDown={(event) => handleCardKeyDown(event, index)}
              ref={(node) => {
                buttonRefs.current[index] = node
              }}
              type="button"
            >
              <motion.span className={styles.imagePlane} style={{ skewX: lean }}>
                <span className={styles.imageCrop}>
                  <ProjectCardImage eager={index < 2} project={project} />
                </span>
              </motion.span>
            </button>
          </article>
        ))}
      </div>

      <footer className={styles.footer}>
        <span>Swipe or scroll</span>
        <span aria-hidden="true">01—{String(projects.length).padStart(2, '0')}</span>
      </footer>

      <AnimatePresence
        initial={false}
        onExitComplete={() => openerRef.current?.focus()}
      >
        {selectedProject ? (
          <motion.div
            animate={{ opacity: 1 }}
            className={styles.drawerLayer}
            exit={{ opacity: shouldAnimate ? 0 : 1 }}
            initial={{ opacity: shouldAnimate ? 0 : 1 }}
            key="kinetic-ribbon-drawer"
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
              animate={{ y: 0 }}
              aria-describedby={descriptionId}
              aria-labelledby={titleId}
              aria-modal="true"
              className={styles.drawer}
              exit={{ y: shouldAnimate ? '100%' : 0 }}
              initial={{ y: shouldAnimate ? '100%' : 0 }}
              onKeyDown={handleDrawerKeyDown}
              ref={drawerRef}
              role="dialog"
              tabIndex={-1}
              transition={{
                duration: shouldAnimate ? 0.34 : 0,
                ease: [0.32, 0.72, 0, 1],
              }}
            >
              <header className={styles.drawerHeader}>
                <span aria-hidden="true" className={styles.drawerHandle} />
                <p>Project details</p>
                <CutCornerButton
                  className={styles.closeButton}
                  data-dialog-close
                  onClick={(event) =>
                    closeDetails(event.detail === 0 ? 'keyboard' : 'pointer')
                  }
                  variant="paper"
                >
                  Close <span aria-hidden="true">×</span>
                </CutCornerButton>
              </header>

              <div className={styles.drawerBody}>
                <div className={styles.mediaColumn}>
                  <figure className={styles.gallery}>
                    {galleryImage === selectedProject.image ? (
                      <ProjectCardImage project={selectedProject} />
                    ) : (
                      <img
                        alt={`${selectedProject.name} gallery view ${galleryIndex + 1}`}
                        decoding="async"
                        height={1498}
                        loading="lazy"
                        src={galleryImage}
                        width={3018}
                      />
                    )}
                    <figcaption>
                      Image {galleryIndex + 1} of {gallery.length}
                    </figcaption>
                  </figure>

                  {gallery.length > 1 ? (
                    <div
                      aria-label={`${selectedProject.name} gallery`}
                      className={styles.galleryControls}
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
                </div>

                <div className={styles.details}>
                  <div>
                    <p className={styles.eyebrow}>Selected project</p>
                    <h3 id={titleId}>{selectedProject.name}</h3>
                    <p className={styles.description} id={descriptionId}>
                      {selectedProject.description}
                    </p>
                  </div>

                  <div className={styles.meta}>
                    <p>Collaboration</p>
                    <ul>
                      {selectedProject.collaborators.map((collaborator) => (
                        <li key={collaborator}>{collaborator}</li>
                      ))}
                    </ul>
                  </div>

                  {selectedProject.href ? (
                    <CutCornerButton
                      className={styles.projectLink}
                      href={selectedProject.href}
                      variant="navy"
                    >
                      View project <span aria-hidden="true">↗</span>
                    </CutCornerButton>
                  ) : null}
                </div>
              </div>
            </motion.aside>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </section>
  )
}
