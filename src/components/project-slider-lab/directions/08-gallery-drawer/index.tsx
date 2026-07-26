import {
  type CSSProperties,
  type KeyboardEvent,
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
} from '../../shared/types'

import styles from './styles.module.css'

export const metadata = {
  description:
    'A minimal split carousel with image tabs and sliding material fields, where project media opens into a focused gallery drawer without losing the active work.',
  id: '08-gallery-drawer',
  name: 'Gallery Drawer',
  skill: {
    name: 'ui-animation',
    url: 'https://www.skills.sh/mblode/agent-skills/ui-animation',
  },
} satisfies SliderDirectionMetadata

type ChangeSource = 'keyboard' | 'pointer' | 'scroll'
type TravelDirection = -1 | 1

type GalleryStyle = CSSProperties & {
  '--gallery-accent': string
  '--gallery-background': string
  '--gallery-foreground': string
  '--gallery-surface': string
}

function LoadingState() {
  return (
    <section
      aria-busy="true"
      aria-label="Gallery Drawer projects are loading"
      className={`${styles.root} ${styles.loading}`}
    >
      <div aria-hidden="true" className={styles.loadingTabs}>
        {Array.from({ length: 6 }, (_, index) => (
          <span className={`${styles.skeleton} ${styles.loadingTab}`} key={index} />
        ))}
      </div>
      <article className={styles.loadingProject}>
        <span className={`${styles.skeleton} ${styles.loadingMedia}`} />
        <div className={styles.loadingCopy}>
          <span className={`${styles.skeleton} ${styles.loadingTitle}`} />
          <span className={`${styles.skeleton} ${styles.loadingLine}`} />
          <span className={`${styles.skeleton} ${styles.loadingLineShort}`} />
          <CutCornerButton loading variant="paper">
            View project
          </CutCornerButton>
        </div>
      </article>
      <span className={styles.srOnly} role="status">
        Loading projects
      </span>
    </section>
  )
}

function EmptyState() {
  return (
    <section className={`${styles.root} ${styles.empty}`}>
      <span aria-hidden="true" className={styles.emptyPanel} />
      <p className={styles.eyebrow}>Selected work</p>
      <h2>The gallery is ready for its first project.</h2>
      <p>Add work to begin the sequence.</p>
    </section>
  )
}

const getNextIndex = (key: string, current: number, count: number) => {
  if (key === 'Home') return 0
  if (key === 'End') return count - 1
  if (key === 'ArrowRight') return (current + 1) % count
  if (key === 'ArrowLeft') return (current - 1 + count) % count
  return null
}

export function GalleryDrawerDirection({
  projects,
  state = 'ready',
}: SliderDirectionProps) {
  const reduceMotion = useReducedMotion()
  const viewportRef = useRef<HTMLDivElement>(null)
  const slideRefs = useRef<Array<HTMLElement | null>>([])
  const tabRefs = useRef<Array<HTMLButtonElement | null>>([])
  const scrollFrameRef = useRef<number | null>(null)
  const activeIndexRef = useRef(0)
  const interactionRef = useRef<ChangeSource>('pointer')
  const drawerRef = useRef<HTMLElement>(null)
  const openerRef = useRef<HTMLButtonElement | null>(null)
  const [activeIndex, setActiveIndex] = useState(0)
  const [travelDirection, setTravelDirection] = useState<TravelDirection>(1)
  const [drawerIndex, setDrawerIndex] = useState<number | null>(null)
  const [galleryIndex, setGalleryIndex] = useState(0)

  useEffect(() => {
    if (projects.length > 0 && activeIndexRef.current >= projects.length) {
      activeIndexRef.current = projects.length - 1
      setActiveIndex(projects.length - 1)
    }
  }, [projects.length])

  useEffect(
    () => () => {
      if (scrollFrameRef.current !== null) cancelAnimationFrame(scrollFrameRef.current)
    },
    [],
  )

  useEffect(() => {
    if (drawerIndex === null) return

    const opener = openerRef.current
    const previousOverflow = document.body.style.overflow
    const focusFrame = requestAnimationFrame(() =>
      drawerRef.current?.querySelector<HTMLElement>('button, a[href]')?.focus(),
    )
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
  }, [drawerIndex])

  if (state === 'loading') return <LoadingState />
  if (state === 'empty' || projects.length === 0) return <EmptyState />

  const safeIndex = Math.min(activeIndex, projects.length - 1)
  const activeProject = projects[safeIndex]
  const drawerProject = drawerIndex === null ? null : projects[drawerIndex]
  const animateChange = !reduceMotion && interactionRef.current !== 'keyboard'
  const rootStyle: GalleryStyle = {
    '--gallery-accent': activeProject.palette.accent,
    '--gallery-background': activeProject.palette.background,
    '--gallery-foreground': activeProject.palette.foreground,
    '--gallery-surface': activeProject.palette.surface,
  }

  const setCurrentProject = (index: number, source: ChangeSource) => {
    const nextIndex = Math.max(0, Math.min(index, projects.length - 1))
    const previousIndex = activeIndexRef.current

    interactionRef.current = source
    if (nextIndex !== previousIndex) {
      setTravelDirection(nextIndex > previousIndex ? 1 : -1)
      activeIndexRef.current = nextIndex
      setActiveIndex(nextIndex)
    }
  }

  const goToProject = (index: number, source: ChangeSource) => {
    const nextIndex = Math.max(0, Math.min(index, projects.length - 1))
    setCurrentProject(nextIndex, source)

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
    const nextIndex = getNextIndex(event.key, safeIndex, projects.length)
    if (nextIndex === null) return

    event.preventDefault()
    goToProject(nextIndex, 'keyboard')
  }

  const handleScroll = () => {
    if (scrollFrameRef.current !== null) return

    scrollFrameRef.current = requestAnimationFrame(() => {
      scrollFrameRef.current = null
      const viewport = viewportRef.current
      if (!viewport) return

      const center = viewport.scrollLeft + viewport.clientWidth / 2
      let nearestIndex = activeIndexRef.current
      let nearestDistance = Number.POSITIVE_INFINITY

      slideRefs.current.forEach((slide, index) => {
        if (!slide) return
        const distance = Math.abs(slide.offsetLeft + slide.offsetWidth / 2 - center)
        if (distance < nearestDistance) {
          nearestDistance = distance
          nearestIndex = index
        }
      })

      setCurrentProject(nearestIndex, 'scroll')
    })
  }

  const openGallery = (index: number, opener: HTMLButtonElement) => {
    openerRef.current = opener
    setGalleryIndex(0)
    setDrawerIndex(index)
  }

  const handleDrawerKeyDown = (event: KeyboardEvent<HTMLElement>) => {
    if (!drawerProject) return

    if (event.key === 'ArrowLeft' || event.key === 'ArrowRight') {
      event.preventDefault()
      const step = event.key === 'ArrowRight' ? 1 : -1
      setGalleryIndex((current) =>
        (current + step + drawerProject.gallery.length) % drawerProject.gallery.length,
      )
      return
    }

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

  return (
    <section className={styles.root} style={rootStyle}>
      <div aria-hidden="true" className={styles.materialStage}>
        <AnimatePresence custom={travelDirection} initial={false} mode="sync">
          <motion.div
            animate={{ opacity: 1, x: 0 }}
            className={styles.materialField}
            custom={travelDirection}
            exit={{
              opacity: animateChange ? 0.4 : 0,
              x: animateChange ? travelDirection * -80 : 0,
            }}
            initial={{
              opacity: animateChange ? 0.65 : 1,
              x: animateChange ? travelDirection * 80 : 0,
            }}
            key={activeProject.slug}
            style={{ backgroundColor: activeProject.palette.background }}
            transition={{
              duration: animateChange ? 0.42 : 0,
              ease: [0.25, 1, 0.5, 1],
            }}
          >
            <span
              className={styles.surfaceSlab}
              style={{ backgroundColor: activeProject.palette.surface }}
            />
            <span
              className={styles.accentSlab}
              style={{ backgroundColor: activeProject.palette.accent }}
            />
          </motion.div>
        </AnimatePresence>
      </div>

      <header className={styles.header}>
        <div>
          <p className={styles.eyebrow}>Selected work</p>
          <h2>Gallery Drawer</h2>
        </div>
        <p aria-live="polite" className={styles.counter}>
          <span>{String(safeIndex + 1).padStart(2, '0')}</span>
          <span aria-hidden="true"> / </span>
          {String(projects.length).padStart(2, '0')}
          <span className={styles.srOnly}> — {activeProject.name}</span>
        </p>
      </header>

      <div aria-label="Choose a project" className={styles.tabs} role="tablist">
        {projects.map((project, index) => {
          const selected = index === safeIndex
          return (
            <button
              aria-controls={`gallery-drawer-panel-${project.slug}`}
              aria-label={`Show ${project.name}`}
              aria-selected={selected}
              className={styles.tab}
              id={`gallery-drawer-tab-${project.slug}`}
              key={project.slug}
              onClick={() => goToProject(index, 'pointer')}
              onKeyDown={(event) => handleTabKeyDown(event, index)}
              ref={(node) => {
                tabRefs.current[index] = node
              }}
              role="tab"
              tabIndex={selected ? 0 : -1}
              type="button"
            >
              <ProjectImage aria-hidden="true" project={project} />
              <span aria-hidden="true" className={styles.tabVeil} />
            </button>
          )
        })}
      </div>

      <div
        aria-label="Projects. Swipe, scroll horizontally, or use arrow keys."
        className={styles.viewport}
        onKeyDown={handleViewportKeyDown}
        onScroll={handleScroll}
        ref={viewportRef}
        role="region"
        tabIndex={0}
      >
        <div className={styles.track}>
          {projects.map((project, index) => {
            const isActive = index === safeIndex
            const titleId = `gallery-drawer-title-${project.slug}`
            const descriptionId = `gallery-drawer-description-${project.slug}`
            return (
              <article
                aria-describedby={descriptionId}
                aria-hidden={!isActive}
                aria-labelledby={titleId}
                className={styles.project}
                id={`gallery-drawer-panel-${project.slug}`}
                key={project.slug}
                ref={(node) => {
                  slideRefs.current[index] = node
                }}
                role="tabpanel"
              >
                <figure className={styles.mediaFrame}>
                  <button
                    aria-label={`Open ${project.name} image gallery`}
                    className={styles.mediaButton}
                    onClick={(event) => openGallery(index, event.currentTarget)}
                    tabIndex={isActive && project.gallery.length > 0 ? 0 : -1}
                    type="button"
                  >
                    <ProjectImage eager={index === 0} project={project} />
                    <span aria-hidden="true" className={styles.galleryCue}>
                      <span>{String(project.gallery.length).padStart(2, '0')}</span>
                      Open gallery
                    </span>
                  </button>
                  <figcaption className={styles.srOnly}>
                    Preview of {project.name}
                  </figcaption>
                </figure>

                <div className={styles.projectInfo}>
                  <div>
                    <p className={styles.projectNumber}>
                      Project {String(index + 1).padStart(2, '0')}
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
                        <ul>
                          {project.collaborators.map((collaborator) => (
                            <li key={collaborator}>{collaborator}</li>
                          ))}
                        </ul>
                      </div>
                    ) : null}

                    {project.href ? (
                      <CutCornerButton
                        className={styles.projectLink}
                        href={project.href}
                        tabIndex={isActive ? 0 : -1}
                        variant="paper"
                      >
                        View project <span aria-hidden="true">↗</span>
                      </CutCornerButton>
                    ) : null}
                  </div>
                </div>
              </article>
            )
          })}
        </div>
      </div>

      <footer className={styles.footer}>
        <p>Swipe or scroll</p>
        <span aria-hidden="true" />
        <p>Arrow keys · Home · End</p>
      </footer>

      <AnimatePresence>
        {drawerProject ? (
          <div className={styles.drawerLayer}>
            <motion.button
              animate={{ opacity: 1 }}
              aria-label="Close image gallery"
              className={styles.backdrop}
              exit={{ opacity: 0 }}
              initial={{ opacity: reduceMotion ? 1 : 0 }}
              onClick={() => setDrawerIndex(null)}
              transition={{ duration: reduceMotion ? 0 : 0.18 }}
              type="button"
            />
            <motion.aside
              animate={{ opacity: 1, x: 0 }}
              aria-describedby={`gallery-dialog-description-${drawerProject.slug}`}
              aria-labelledby={`gallery-dialog-title-${drawerProject.slug}`}
              aria-modal="true"
              className={styles.drawer}
              exit={{ opacity: reduceMotion ? 0 : 1, x: reduceMotion ? 0 : '100%' }}
              initial={{ opacity: reduceMotion ? 1 : 0.92, x: reduceMotion ? 0 : '100%' }}
              onKeyDown={handleDrawerKeyDown}
              ref={drawerRef}
              role="dialog"
              transition={{
                duration: reduceMotion ? 0 : 0.3,
                ease: [0.32, 0.72, 0, 1],
              }}
            >
              <header className={styles.drawerHeader}>
                <div>
                  <p className={styles.eyebrow}>Project gallery</p>
                  <h3 id={`gallery-dialog-title-${drawerProject.slug}`}>
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

              <p className={styles.srOnly} id={`gallery-dialog-description-${drawerProject.slug}`}>
                Image {galleryIndex + 1} of {drawerProject.gallery.length}. Use left and right arrow keys to browse.
              </p>

              <div className={styles.drawerMedia}>
                <AnimatePresence initial={false} mode="wait">
                  <motion.img
                    alt={`${drawerProject.name}, gallery image ${galleryIndex + 1}`}
                    animate={{ opacity: 1, x: 0 }}
                    decoding="async"
                    exit={{ opacity: 0, x: reduceMotion ? 0 : -16 }}
                    height={1498}
                    initial={{ opacity: reduceMotion ? 1 : 0, x: reduceMotion ? 0 : 16 }}
                    key={`${drawerProject.slug}-${galleryIndex}`}
                    src={drawerProject.gallery[galleryIndex] ?? drawerProject.image}
                    transition={{ duration: reduceMotion ? 0 : 0.2, ease: [0.25, 1, 0.5, 1] }}
                    width={3018}
                  />
                </AnimatePresence>
              </div>

              {drawerProject.gallery.length > 1 ? (
                <div aria-label="Choose gallery image" className={styles.galleryTabs} role="tablist">
                  {drawerProject.gallery.map((image, index) => (
                    <button
                      aria-label={`Show gallery image ${index + 1}`}
                      aria-selected={index === galleryIndex}
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
              ) : (
                <p className={styles.drawerCount}>01 / 01</p>
              )}
            </motion.aside>
          </div>
        ) : null}
      </AnimatePresence>
    </section>
  )
}
