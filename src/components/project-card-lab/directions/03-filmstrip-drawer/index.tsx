import {
  type KeyboardEvent,
  useEffect,
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

import styles from './styles.module.css'

export const metadata = {
  description:
    'Equal image frames form a restrained contact strip, then the chosen frame opens a focused project drawer through a right-origin clip reveal.',
  id: '03-filmstrip-drawer',
  motion:
    'Native scroll snap with restrained card lift and an interruptible clip-path side-drawer reveal.',
  name: 'Filmstrip Drawer',
  skill: {
    name: 'design-motion-principles',
    url: 'https://www.skills.sh/kylezantos/design-motion-principles/design-motion-principles',
  },
} satisfies CardDirectionMetadata

type InteractionSource = 'keyboard' | 'pointer'

const getNextIndex = (key: string, current: number, count: number) => {
  if (key === 'Home') return 0
  if (key === 'End') return count - 1
  if (key === 'ArrowRight') return (current + 1) % count
  if (key === 'ArrowLeft') return (current - 1 + count) % count
  return null
}

function LoadingState() {
  return (
    <section
      aria-busy="true"
      aria-label="Filmstrip projects are loading"
      className={`${styles.root} ${styles.loadingRoot}`}
    >
      <div className={styles.header}>
        <span className={`${styles.skeleton} ${styles.loadingLabel}`} />
        <span className={`${styles.skeleton} ${styles.loadingHint}`} />
      </div>
      <div aria-hidden="true" className={styles.loadingViewport}>
        <div className={styles.loadingTrack}>
          {Array.from({ length: 6 }, (_, index) => (
            <span className={`${styles.skeleton} ${styles.loadingFrame}`} key={index} />
          ))}
        </div>
      </div>
      <span className={styles.srOnly} role="status">
        Loading the project filmstrip
      </span>
    </section>
  )
}

function EmptyState() {
  return (
    <section className={`${styles.root} ${styles.emptyRoot}`}>
      <p className={styles.stripLabel}>
        <span>03</span>
        Project film
      </p>
      <div className={styles.emptyFrame} aria-hidden="true" />
      <h2>The first frame is waiting.</h2>
      <p>Add a project to start the strip.</p>
    </section>
  )
}

export function FilmstripDrawerDirection({
  projects,
  state = 'ready',
}: CardDirectionProps) {
  const reduceMotion = useReducedMotion()
  const cardRefs = useRef<Array<HTMLButtonElement | null>>([])
  const drawerRef = useRef<HTMLElement>(null)
  const openerRef = useRef<HTMLButtonElement | null>(null)
  const interactionRef = useRef<InteractionSource>('keyboard')
  const [drawerIndex, setDrawerIndex] = useState<number | null>(null)
  const [galleryIndex, setGalleryIndex] = useState(0)

  const drawerProject =
    drawerIndex === null ? null : (projects[drawerIndex] ?? null)

  useEffect(() => {
    if (state === 'ready' && drawerProject) return
    if (drawerIndex !== null) setDrawerIndex(null)
  }, [drawerIndex, drawerProject, state])

  useEffect(() => {
    if (!drawerProject) return

    const opener = openerRef.current
    const previousOverflow = document.body.style.overflow
    const focusFrame = requestAnimationFrame(() => {
      drawerRef.current?.querySelector<HTMLElement>('button, a[href]')?.focus()
    })
    const closeOnEscape = (event: globalThis.KeyboardEvent) => {
      if (event.key === 'Escape') setDrawerIndex(null)
    }

    document.body.style.overflow = 'hidden'
    document.addEventListener('keydown', closeOnEscape)

    return () => {
      cancelAnimationFrame(focusFrame)
      document.body.style.overflow = previousOverflow
      document.removeEventListener('keydown', closeOnEscape)
      requestAnimationFrame(() => opener?.focus())
    }
  }, [drawerProject])

  if (state === 'loading') return <LoadingState />
  if (state === 'empty' || projects.length === 0) return <EmptyState />

  const openDrawer = (index: number, opener: HTMLButtonElement) => {
    openerRef.current = opener
    setGalleryIndex(0)
    setDrawerIndex(index)
  }

  const handleCardKeyDown = (
    event: KeyboardEvent<HTMLButtonElement>,
    index: number,
  ) => {
    interactionRef.current = 'keyboard'
    const nextIndex = getNextIndex(event.key, index, projects.length)
    if (nextIndex === null) return

    event.preventDefault()
    const nextCard = cardRefs.current[nextIndex]
    nextCard?.focus()
    nextCard?.scrollIntoView({
      behavior: 'auto',
      block: 'nearest',
      inline: 'center',
    })
  }

  const handleDrawerKeyDown = (event: KeyboardEvent<HTMLElement>) => {
    if (event.key !== 'Tab') return

    const focusable = Array.from(
      drawerRef.current?.querySelectorAll<HTMLElement>(
        'a[href], button:not([disabled]), [tabindex]:not([tabindex="-1"])',
      ) ?? [],
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

  const animateDrawer =
    !reduceMotion && interactionRef.current === 'pointer'
  const galleryImages = drawerProject
    ? drawerProject.gallery.length > 0
      ? drawerProject.gallery
      : [drawerProject.image]
    : []

  return (
    <section className={styles.root}>
      <header className={styles.header}>
        <p className={styles.stripLabel}>
          <span>03</span>
          Project film
        </p>
        <p className={styles.hint}>Swipe, scroll, or use arrow keys</p>
      </header>

      <div
        aria-label="Project filmstrip. Scroll horizontally or use arrow keys between project images."
        className={styles.viewport}
        role="region"
      >
        <ol className={styles.track}>
          {projects.map((project, index) => (
            <li className={styles.frame} key={project.slug}>
              <motion.button
                aria-expanded={drawerIndex === index}
                aria-haspopup="dialog"
                aria-label={`Open details for ${project.name}, project ${index + 1} of ${projects.length}`}
                className={styles.card}
                onClick={(event) => openDrawer(index, event.currentTarget)}
                onKeyDown={(event) => handleCardKeyDown(event, index)}
                onPointerDown={() => {
                  interactionRef.current = 'pointer'
                }}
                ref={(node) => {
                  cardRefs.current[index] = node
                }}
                transition={{ bounce: 0, duration: 0.24, type: 'spring' }}
                type="button"
                whileHover={reduceMotion ? undefined : { y: -6 }}
                whileTap={reduceMotion ? undefined : { scale: 0.985 }}
              >
                <ProjectCardImage
                  eager={index === 0}
                  project={project}
                />
              </motion.button>
            </li>
          ))}
        </ol>
      </div>

      <p className={styles.counter} aria-hidden="true">
        {String(projects.length).padStart(2, '0')} frames
      </p>

      <AnimatePresence>
        {drawerProject ? (
          <div className={styles.drawerLayer}>
            <motion.button
              animate={{ opacity: 1 }}
              aria-label="Close project details"
              className={styles.backdrop}
              exit={{ opacity: 0 }}
              initial={{ opacity: animateDrawer ? 0 : 1 }}
              onClick={() => setDrawerIndex(null)}
              transition={{ duration: animateDrawer ? 0.18 : 0 }}
              type="button"
            />

            <motion.aside
              animate={{ clipPath: 'inset(0 0 0 0%)', opacity: 1 }}
              aria-describedby={`filmstrip-description-${drawerProject.slug}`}
              aria-labelledby={`filmstrip-title-${drawerProject.slug}`}
              aria-modal="true"
              className={styles.drawer}
              exit={{
                clipPath: animateDrawer
                  ? 'inset(0 0 0 8%)'
                  : 'inset(0 0 0 0%)',
                opacity: animateDrawer ? 0 : 1,
              }}
              initial={{
                clipPath: animateDrawer
                  ? 'inset(0 0 0 100%)'
                  : 'inset(0 0 0 0%)',
                opacity: animateDrawer ? 0.94 : 1,
              }}
              onKeyDown={handleDrawerKeyDown}
              ref={drawerRef}
              role="dialog"
              transition={{
                clipPath: {
                  duration: animateDrawer ? 0.42 : 0,
                  ease: [0.32, 0.72, 0, 1],
                },
                opacity: {
                  duration: animateDrawer ? 0.18 : 0,
                },
              }}
            >
              <header className={styles.drawerHeader}>
                <p>
                  Project {String(drawerIndex! + 1).padStart(2, '0')} /
                  {' '}
                  {String(projects.length).padStart(2, '0')}
                </p>
                <button
                  aria-label="Close project details"
                  className={styles.closeButton}
                  onClick={() => setDrawerIndex(null)}
                  type="button"
                >
                  <span aria-hidden="true">×</span>
                </button>
              </header>

              <div className={styles.drawerBody}>
                <div className={styles.drawerCopy}>
                  <h2 id={`filmstrip-title-${drawerProject.slug}`}>
                    {drawerProject.name}
                  </h2>
                  <p
                    className={styles.description}
                    id={`filmstrip-description-${drawerProject.slug}`}
                  >
                    {drawerProject.description}
                  </p>

                  {drawerProject.collaborators.length > 0 ? (
                    <div className={styles.collaborators}>
                      <p>In collaboration with</p>
                      <ul>
                        {drawerProject.collaborators.map((collaborator) => (
                          <li key={collaborator}>{collaborator}</li>
                        ))}
                      </ul>
                    </div>
                  ) : null}

                  {drawerProject.href ? (
                    <CutCornerButton
                      className={styles.projectLink}
                      href={drawerProject.href}
                      variant="navy"
                    >
                      Visit project <span aria-hidden="true">↗</span>
                    </CutCornerButton>
                  ) : null}
                </div>

                <figure className={styles.gallery}>
                  <AnimatePresence initial={false} mode="wait">
                    <motion.img
                      alt={`${drawerProject.name}, gallery image ${galleryIndex + 1}`}
                      animate={{ opacity: 1 }}
                      decoding="async"
                      exit={{ opacity: 0 }}
                      height={1498}
                      initial={{ opacity: reduceMotion ? 1 : 0.35 }}
                      key={`${drawerProject.slug}-${galleryIndex}`}
                      loading="lazy"
                      src={galleryImages[galleryIndex] ?? drawerProject.image}
                      transition={{
                        duration: reduceMotion ? 0 : 0.18,
                        ease: [0.22, 1, 0.36, 1],
                      }}
                      width={3018}
                    />
                  </AnimatePresence>
                  <figcaption>
                    Image {String(galleryIndex + 1).padStart(2, '0')} /
                    {' '}
                    {String(galleryImages.length).padStart(2, '0')}
                  </figcaption>
                </figure>
              </div>

              {galleryImages.length > 1 ? (
                <div
                  aria-label="Choose a project image"
                  className={styles.galleryTabs}
                  role="tablist"
                >
                  {galleryImages.map((image, index) => (
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
            </motion.aside>
          </div>
        ) : null}
      </AnimatePresence>
    </section>
  )
}
