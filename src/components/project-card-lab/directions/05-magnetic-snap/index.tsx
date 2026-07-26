import {
  type KeyboardEvent,
  type PointerEvent,
  useEffect,
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
import type { SliderProject } from '../../../project-slider-lab/shared/types'

import styles from './styles.module.css'

export const metadata = {
  description:
    'A quiet image rail whose cards lean a few pixels toward a fine pointer, then settle precisely before opening a calm side sheet.',
  id: '05-magnetic-snap',
  motion:
    'Pointer-local Motion values with critically damped springs, a tactile press scale, and a transform-only side-sheet reveal.',
  name: 'Magnetic Snap',
  skill: {
    name: 'design-motion-principles',
    url: 'https://www.skills.sh/kylezantos/design-motion-principles/design-motion-principles',
  },
} satisfies CardDirectionMetadata

const focusableSelector =
  'a[href], button:not([disabled]), [tabindex]:not([tabindex="-1"])'

const getNextIndex = (key: string, current: number, count: number) => {
  if (key === 'Home') return 0
  if (key === 'End') return count - 1
  if (key === 'ArrowRight') return Math.min(current + 1, count - 1)
  if (key === 'ArrowLeft') return Math.max(current - 1, 0)
  return null
}

function LoadingState() {
  return (
    <section
      aria-busy="true"
      aria-label="Magnetic Snap projects are loading"
      className={`${styles.root} ${styles.loading}`}
    >
      <header className={styles.header}>
        <div>
          <p className={styles.eyebrow}>Selected work</p>
          <h2>Magnetic Snap</h2>
        </div>
        <p className={styles.instruction}>Loading projects</p>
      </header>
      <div aria-hidden="true" className={styles.rail}>
        {Array.from({ length: 6 }, (_, index) => (
          <span className={styles.skeletonCard} key={index}>
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
    <section className={`${styles.root} ${styles.empty}`}>
      <header className={styles.header}>
        <div>
          <p className={styles.eyebrow}>Selected work</p>
          <h2>Magnetic Snap</h2>
        </div>
      </header>
      <div className={styles.emptyRail}>
        <p>No projects yet.</p>
        <span>Add the first image to start the rail.</span>
      </div>
    </section>
  )
}

interface MagneticCardProps {
  eager: boolean
  index: number
  onKeyDown: (event: KeyboardEvent<HTMLButtonElement>, index: number) => void
  onOpen: (index: number, opener: HTMLButtonElement) => void
  project: SliderProject
  reduceMotion: boolean
  registerButton: (index: number, node: HTMLButtonElement | null) => void
}

function MagneticCard({
  eager,
  index,
  onKeyDown,
  onOpen,
  project,
  reduceMotion,
  registerButton,
}: MagneticCardProps) {
  const rawX = useMotionValue(0)
  const rawY = useMotionValue(0)
  const rawRotateX = useMotionValue(0)
  const rawRotateY = useMotionValue(0)
  const spring = { damping: 34, mass: 0.42, stiffness: 430 }
  const x = useSpring(rawX, spring)
  const y = useSpring(rawY, spring)
  const rotateX = useSpring(rawRotateX, spring)
  const rotateY = useSpring(rawRotateY, spring)

  const resetMagnet = () => {
    rawX.set(0)
    rawY.set(0)
    rawRotateX.set(0)
    rawRotateY.set(0)
  }

  const handlePointerMove = (event: PointerEvent<HTMLButtonElement>) => {
    if (
      reduceMotion ||
      event.pointerType !== 'mouse' ||
      !window.matchMedia('(hover: hover) and (pointer: fine)').matches
    ) {
      return
    }

    const bounds = event.currentTarget.getBoundingClientRect()
    const localX = (event.clientX - bounds.left) / bounds.width - 0.5
    const localY = (event.clientY - bounds.top) / bounds.height - 0.5

    rawX.set(localX * 12)
    rawY.set(localY * 8)
    rawRotateX.set(localY * -1.4)
    rawRotateY.set(localX * 1.8)
  }

  const titleId = `magnetic-card-title-${project.slug}`

  return (
    <article aria-labelledby={titleId} className={styles.card}>
      <h3 className={styles.srOnly} id={titleId}>
        {project.name}
      </h3>
      <button
        aria-label={`Open details for ${project.name}`}
        className={styles.cardButton}
        onBlur={resetMagnet}
        onClick={(event) => onOpen(index, event.currentTarget)}
        onKeyDown={(event) => onKeyDown(event, index)}
        onPointerCancel={resetMagnet}
        onPointerLeave={resetMagnet}
        onPointerMove={handlePointerMove}
        ref={(node) => registerButton(index, node)}
        type="button"
      >
        <motion.span
          className={styles.magneticPlane}
          style={{ rotateX, rotateY, x, y }}
        >
          <ProjectCardImage
            aria-hidden="true"
            eager={eager}
            project={project}
          />
        </motion.span>
      </button>
    </article>
  )
}

export function MagneticSnapDirection({
  projects,
  state = 'ready',
}: CardDirectionProps) {
  const reduceMotion = Boolean(useReducedMotion())
  const buttonRefs = useRef<Array<HTMLButtonElement | null>>([])
  const drawerRef = useRef<HTMLElement>(null)
  const openerRef = useRef<HTMLButtonElement | null>(null)
  const [drawerIndex, setDrawerIndex] = useState<number | null>(null)
  const [galleryIndex, setGalleryIndex] = useState(0)

  useEffect(() => {
    if (drawerIndex === null) return

    const opener = openerRef.current
    const previousOverflow = document.body.style.overflow
    const focusFrame = requestAnimationFrame(() => {
      drawerRef.current
        ?.querySelector<HTMLElement>(focusableSelector)
        ?.focus()
    })
    const handleEscape = (event: globalThis.KeyboardEvent) => {
      if (event.key === 'Escape') setDrawerIndex(null)
    }

    document.body.style.overflow = 'hidden'
    document.addEventListener('keydown', handleEscape)

    return () => {
      cancelAnimationFrame(focusFrame)
      document.body.style.overflow = previousOverflow
      document.removeEventListener('keydown', handleEscape)
      requestAnimationFrame(() => opener?.focus())
    }
  }, [drawerIndex])

  if (state === 'loading') return <LoadingState />
  if (state === 'empty' || projects.length === 0) return <EmptyState />

  const drawerProject =
    drawerIndex === null ? null : (projects[drawerIndex] ?? null)

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

  const openDrawer = (index: number, opener: HTMLButtonElement) => {
    openerRef.current = opener
    setGalleryIndex(0)
    setDrawerIndex(index)
  }

  const handleDrawerKeyDown = (event: KeyboardEvent<HTMLElement>) => {
    if (!drawerProject) return

    if (
      drawerProject.gallery.length > 1 &&
      (event.key === 'ArrowLeft' || event.key === 'ArrowRight')
    ) {
      event.preventDefault()
      const step = event.key === 'ArrowRight' ? 1 : -1
      setGalleryIndex(
        (current) =>
          (current + step + drawerProject.gallery.length) %
          drawerProject.gallery.length,
      )
      return
    }

    if (event.key !== 'Tab') return
    const focusable = Array.from(
      drawerRef.current?.querySelectorAll<HTMLElement>(focusableSelector) ?? [],
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

  return (
    <section
      aria-labelledby="magnetic-snap-heading"
      className={styles.root}
    >
      <header className={styles.header}>
        <div>
          <p className={styles.eyebrow}>Selected work</p>
          <h2 id="magnetic-snap-heading">Magnetic Snap</h2>
        </div>
        <p className={styles.instruction}>
          Scroll, swipe, or use arrow keys
        </p>
      </header>

      <div
        aria-label="Project images. Scroll horizontally or use arrow keys."
        className={styles.rail}
        role="region"
      >
        {projects.map((project, index) => (
          <MagneticCard
            eager={index < 2}
            index={index}
            key={project.slug}
            onKeyDown={handleCardKeyDown}
            onOpen={openDrawer}
            project={project}
            reduceMotion={reduceMotion}
            registerButton={(buttonIndex, node) => {
              buttonRefs.current[buttonIndex] = node
            }}
          />
        ))}
      </div>

      <footer className={styles.footer}>
        <span>{String(projects.length).padStart(2, '0')} projects</span>
        <span aria-hidden="true">Drag the rail →</span>
      </footer>

      <AnimatePresence initial={false}>
        {drawerProject ? (
          <div className={styles.drawerLayer}>
            <motion.button
              animate={{ opacity: 1 }}
              aria-label="Close project details"
              className={styles.backdrop}
              exit={{ opacity: 0 }}
              initial={{ opacity: reduceMotion ? 1 : 0 }}
              onClick={() => setDrawerIndex(null)}
              transition={{ duration: reduceMotion ? 0 : 0.16 }}
              type="button"
            />
            <motion.aside
              animate={{ opacity: 1, x: 0 }}
              aria-describedby={`magnetic-description-${drawerProject.slug}`}
              aria-labelledby={`magnetic-title-${drawerProject.slug}`}
              aria-modal="true"
              className={styles.drawer}
              exit={{
                opacity: reduceMotion ? 0 : 1,
                x: reduceMotion ? 0 : '100%',
              }}
              initial={{
                opacity: reduceMotion ? 1 : 0.98,
                x: reduceMotion ? 0 : '100%',
              }}
              onKeyDown={handleDrawerKeyDown}
              ref={drawerRef}
              role="dialog"
              transition={{
                duration: reduceMotion ? 0 : 0.32,
                ease: [0.32, 0.72, 0, 1],
              }}
            >
              <header className={styles.drawerHeader}>
                <div>
                  <p className={styles.eyebrow}>Project details</p>
                  <h3 id={`magnetic-title-${drawerProject.slug}`}>
                    {drawerProject.name}
                  </h3>
                </div>
                <CutCornerButton
                  onClick={() => setDrawerIndex(null)}
                  variant="paper"
                >
                  Close <span aria-hidden="true">×</span>
                </CutCornerButton>
              </header>

              <div className={styles.drawerBody}>
                <figure className={styles.gallery}>
                  <AnimatePresence initial={false} mode="wait">
                    <motion.img
                      alt={`${drawerProject.name}, gallery image ${galleryIndex + 1}`}
                      animate={{ opacity: 1, x: 0 }}
                      decoding="async"
                      exit={{
                        opacity: 0,
                        x: reduceMotion ? 0 : -8,
                      }}
                      height={1498}
                      initial={{
                        opacity: reduceMotion ? 1 : 0,
                        x: reduceMotion ? 0 : 8,
                      }}
                      key={`${drawerProject.slug}-${galleryIndex}`}
                      loading="lazy"
                      src={
                        drawerProject.gallery[galleryIndex] ??
                        drawerProject.image
                      }
                      transition={{
                        duration: reduceMotion ? 0 : 0.18,
                        ease: [0.25, 1, 0.5, 1],
                      }}
                      width={3018}
                    />
                  </AnimatePresence>
                  <figcaption>
                    {String(galleryIndex + 1).padStart(2, '0')} /{' '}
                    {String(drawerProject.gallery.length).padStart(2, '0')}
                  </figcaption>
                </figure>

                {drawerProject.gallery.length > 1 ? (
                  <div
                    aria-label="Choose gallery image"
                    className={styles.galleryTabs}
                    role="tablist"
                  >
                    {drawerProject.gallery.map((image, index) => (
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

                <p
                  className={styles.description}
                  id={`magnetic-description-${drawerProject.slug}`}
                >
                  {drawerProject.description}
                </p>

                {drawerProject.collaborators.length > 0 ? (
                  <div className={styles.collaborators}>
                    <p>Collaboration</p>
                    <ul>
                      {drawerProject.collaborators.map((collaborator) => (
                        <li key={collaborator}>{collaborator}</li>
                      ))}
                    </ul>
                  </div>
                ) : null}
              </div>

              <footer className={styles.drawerFooter}>
                {drawerProject.href ? (
                  <CutCornerButton
                    href={drawerProject.href}
                    variant="gold"
                  >
                    View project <span aria-hidden="true">↗</span>
                  </CutCornerButton>
                ) : (
                  <p>Case study available on request.</p>
                )}
              </footer>
            </motion.aside>
          </div>
        ) : null}
      </AnimatePresence>
    </section>
  )
}
