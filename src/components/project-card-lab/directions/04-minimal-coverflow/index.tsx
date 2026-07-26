import {
  type KeyboardEvent as ReactKeyboardEvent,
  type RefObject,
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
  useScroll,
  useTransform,
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
    'A quiet horizontal gallery whose images gain just enough perspective to clarify the centered project before opening a precise side sheet.',
  id: '04-minimal-coverflow',
  motion:
    'Motion useScroll and useTransform create restrained center-weighted depth; AnimatePresence drives a short pointer-only drawer transition.',
  name: 'Minimal Coverflow',
  skill: {
    name: 'ui-animation',
    url: 'https://www.skills.sh/mblode/agent-skills/ui-animation',
  },
} satisfies CardDirectionMetadata

type InteractionSource = 'keyboard' | 'pointer'

interface CoverCardProps {
  eager: boolean
  index: number
  onNavigate: (
    event: ReactKeyboardEvent<HTMLButtonElement>,
    index: number,
  ) => void
  onOpen: (
    index: number,
    opener: HTMLButtonElement,
    source: InteractionSource,
  ) => void
  project: SliderProject
  railRef: RefObject<HTMLDivElement | null>
  reduceMotion: boolean
}

const loadingCards = ['one', 'two', 'three', 'four', 'five'] as const
const drawerEase = [0.32, 0.72, 0, 1] as const

function CoverCard({
  eager,
  index,
  onNavigate,
  onOpen,
  project,
  railRef,
  reduceMotion,
}: CoverCardProps) {
  const cardRef = useRef<HTMLElement>(null)
  const { scrollXProgress } = useScroll({
    axis: 'x',
    container: railRef,
    offset: ['start end', 'end start'],
    target: cardRef,
  })
  const rotateY = useTransform(scrollXProgress, [0, 0.5, 1], [5, 0, -5])
  const scale = useTransform(scrollXProgress, [0, 0.5, 1], [0.965, 1, 0.965])
  const y = useTransform(scrollXProgress, [0, 0.5, 1], [7, 0, 7])
  const z = useTransform(scrollXProgress, [0, 0.5, 1], [-22, 0, -22])

  return (
    <motion.article
      className={styles.card}
      ref={cardRef}
      role="listitem"
      style={reduceMotion ? undefined : { rotateY, scale, y, z }}
    >
      <h3 className={styles.srOnly}>{project.name}</h3>
      <button
        aria-haspopup="dialog"
        aria-label={`Open ${project.name} project details`}
        className={styles.cardButton}
        data-project-card
        onClick={(event) =>
          onOpen(
            index,
            event.currentTarget,
            event.detail === 0 ? 'keyboard' : 'pointer',
          )
        }
        onKeyDown={(event) => onNavigate(event, index)}
        type="button"
      >
        <span className={styles.imageFrame}>
          <ProjectCardImage eager={eager} project={project} />
        </span>
      </button>
    </motion.article>
  )
}

function LoadingState() {
  return (
    <section
      aria-busy="true"
      aria-label="Minimal Coverflow projects are loading"
      className={styles.root}
    >
      <div aria-hidden="true" className={styles.loadingRail}>
        {loadingCards.map((card) => (
          <span className={styles.skeleton} key={card} />
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
        <p>This gallery is ready for its first project.</p>
      </div>
    </section>
  )
}

export function MinimalCoverflowDirection({
  projects,
  state = 'ready',
}: CardDirectionProps) {
  const reduceMotion = useReducedMotion()
  const railRef = useRef<HTMLDivElement>(null)
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

  const handleCardNavigation = (
    event: ReactKeyboardEvent<HTMLButtonElement>,
    index: number,
  ) => {
    let nextIndex: number | null = null

    if (event.key === 'ArrowRight') nextIndex = Math.min(index + 1, projects.length - 1)
    if (event.key === 'ArrowLeft') nextIndex = Math.max(index - 1, 0)
    if (event.key === 'Home') nextIndex = 0
    if (event.key === 'End') nextIndex = projects.length - 1
    if (nextIndex === null || nextIndex === index) return

    const nextButton =
      railRef.current?.querySelectorAll<HTMLButtonElement>(
        '[data-project-card]',
      )[nextIndex]
    if (!nextButton) return

    event.preventDefault()
    nextButton.focus()
    nextButton.scrollIntoView({
      behavior: 'auto',
      block: 'nearest',
      inline: 'center',
    })
  }

  const handleDialogKeyDown = (event: ReactKeyboardEvent<HTMLElement>) => {
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

  const gallery =
    selectedProject && selectedProject.gallery.length > 0
      ? selectedProject.gallery
      : selectedProject
        ? [selectedProject.image]
        : []
  const galleryImage = gallery[galleryIndex]

  return (
    <MotionConfig reducedMotion="user">
      <section className={styles.root}>
        <div
          aria-label="Minimal Coverflow projects. Use left and right arrow keys to move between projects."
          className={styles.rail}
          ref={railRef}
          role="list"
        >
          {projects.map((project, index) => (
            <CoverCard
              eager={index < 3}
              index={index}
              key={project.slug}
              onNavigate={handleCardNavigation}
              onOpen={openDetails}
              project={project}
              railRef={railRef}
              reduceMotion={Boolean(reduceMotion)}
            />
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
              exit={{ opacity: shouldAnimate ? 0 : 1 }}
              initial={{ opacity: shouldAnimate ? 0 : 1 }}
              key="minimal-coverflow-drawer"
              transition={{ duration: shouldAnimate ? 0.22 : 0 }}
            >
              <button
                aria-label="Close project details"
                className={styles.backdrop}
                onClick={() => closeDetails('pointer')}
                tabIndex={-1}
                type="button"
              />

              <motion.aside
                animate={{ x: 0 }}
                aria-describedby={descriptionId}
                aria-labelledby={titleId}
                aria-modal="true"
                className={styles.drawer}
                exit={{ x: shouldAnimate ? '100%' : 0 }}
                initial={{ x: shouldAnimate ? '100%' : 0 }}
                onKeyDown={handleDialogKeyDown}
                ref={dialogRef}
                role="dialog"
                tabIndex={-1}
                transition={{
                  duration: shouldAnimate ? 0.28 : 0,
                  ease: drawerEase,
                }}
              >
                <header className={styles.drawerHeader}>
                  <p>Project</p>
                  <button
                    aria-label="Close project details"
                    className={styles.closeButton}
                    data-dialog-close
                    onClick={() => closeDetails('pointer')}
                    type="button"
                  >
                    <span aria-hidden="true">×</span>
                  </button>
                </header>

                <figure
                  aria-label={`${selectedProject.name} gallery image ${galleryIndex + 1} of ${gallery.length}`}
                  className={styles.drawerMedia}
                >
                  {galleryImage === selectedProject.image ? (
                    <ProjectCardImage eager project={selectedProject} />
                  ) : (
                    <img
                      alt={`${selectedProject.name} gallery view ${galleryIndex + 1}`}
                      decoding="async"
                      height={1498}
                      src={galleryImage}
                      width={3018}
                    />
                  )}
                </figure>

                <div className={styles.details}>
                  <div>
                    <h2 id={titleId}>{selectedProject.name}</h2>
                    <p className={styles.description} id={descriptionId}>
                      {selectedProject.description}
                    </p>
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
                      <CutCornerButton href={selectedProject.href} variant="navy">
                        View project
                      </CutCornerButton>
                    ) : null}
                  </div>
                </div>
              </motion.aside>
            </motion.div>
          ) : null}
        </AnimatePresence>
      </section>
    </MotionConfig>
  )
}
