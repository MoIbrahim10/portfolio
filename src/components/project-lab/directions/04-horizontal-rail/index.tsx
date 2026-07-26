import {
  type KeyboardEvent,
  type UIEvent,
  useEffect,
  useRef,
  useState,
} from 'react'
import { motion, useReducedMotion } from 'motion/react'

import { CutCornerButton } from '../../shared/CutCornerButton'
import { ProjectMedia } from '../../shared/ProjectMedia'
import { projects as sharedProjects } from '../../shared/projects'
import type {
  ProjectDirectionMetadata,
  ProjectDirectionProps,
} from '../../shared/types'

import styles from './styles.module.css'

export const horizontalRailMetadata = {
  description:
    'A processional project route: six cinematic chapters advance across a measured, scroll-snapped horizon with native touch and keyboard navigation.',
  id: '04-horizontal-rail',
  name: 'Processional Rail',
  skill: {
    name: 'web-design-guidelines',
    url: 'https://www.skills.sh/vercel-labs/agent-skills/web-design-guidelines',
  },
} satisfies ProjectDirectionMetadata

type HorizontalRailDirectionProps = Omit<ProjectDirectionProps, 'projects'> & {
  projects?: ProjectDirectionProps['projects']
}

function LoadingState() {
  return (
    <section
      aria-busy="true"
      aria-label="Projects are loading"
      className={`${styles.root} ${styles.loadingState}`}
    >
      <header className={styles.header}>
        <div>
          <div className={`${styles.skeleton} ${styles.skeletonEyebrow}`} />
          <div className={`${styles.skeleton} ${styles.skeletonHeading}`} />
        </div>
        <div className={`${styles.skeleton} ${styles.skeletonIndex}`} />
      </header>
      <div className={styles.loadingViewport}>
        <ol className={styles.loadingTrack}>
          {Array.from({ length: 3 }, (_, index) => (
            <li className={styles.loadingStop} key={index}>
              <article className={styles.loadingCard}>
                <div className={`${styles.skeleton} ${styles.skeletonMedia}`} />
                <div className={styles.loadingCopy}>
                  <div className={`${styles.skeleton} ${styles.skeletonMeta}`} />
                  <div className={`${styles.skeleton} ${styles.skeletonTitle}`} />
                  <div className={`${styles.skeleton} ${styles.skeletonBody}`} />
                  <CutCornerButton loading variant="navy">
                    View case study
                  </CutCornerButton>
                </div>
              </article>
            </li>
          ))}
        </ol>
      </div>
      <span className={styles.srOnly} role="status">
        Loading the project route
      </span>
    </section>
  )
}

function EmptyState() {
  return (
    <section className={`${styles.root} ${styles.emptyState}`}>
      <p className={styles.eyebrow}>Selected work / Route 00</p>
      <h2>The project route is waiting</h2>
      <p>
        There are no projects on the horizon yet. Return to the laboratory to
        choose another display system.
      </p>
      <CutCornerButton href="#project-lab" variant="paper">
        Return to laboratory
      </CutCornerButton>
    </section>
  )
}

export function HorizontalRailDirection({
  projects: projectList = sharedProjects,
  state = 'ready',
}: HorizontalRailDirectionProps = {}) {
  const [activeIndex, setActiveIndex] = useState(0)
  const railRef = useRef<HTMLDivElement>(null)
  const stopRefs = useRef<Array<HTMLLIElement | null>>([])
  const frameRef = useRef<number | null>(null)
  const reduceMotion = useReducedMotion()

  useEffect(
    () => () => {
      if (frameRef.current !== null) cancelAnimationFrame(frameRef.current)
    },
    [],
  )

  if (state === 'loading') return <LoadingState />
  if (state === 'empty' || projectList.length === 0) return <EmptyState />

  const resolvedIndex = Math.min(activeIndex, projectList.length - 1)

  const goToProject = (requestedIndex: number) => {
    const nextIndex = Math.max(0, Math.min(requestedIndex, projectList.length - 1))
    const rail = railRef.current
    const stop = stopRefs.current[nextIndex]

    setActiveIndex(nextIndex)
    if (!rail || !stop) return

    rail.scrollTo({
      behavior: reduceMotion ? 'auto' : 'smooth',
      left: stop.offsetLeft,
    })
  }

  const handleRailKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
    if (event.target !== event.currentTarget) return

    let nextIndex: number | null = null

    if (event.key === 'ArrowRight') nextIndex = resolvedIndex + 1
    if (event.key === 'ArrowLeft') nextIndex = resolvedIndex - 1
    if (event.key === 'Home') nextIndex = 0
    if (event.key === 'End') nextIndex = projectList.length - 1
    if (nextIndex === null) return

    event.preventDefault()
    goToProject(nextIndex)
  }

  const handleRailScroll = (event: UIEvent<HTMLDivElement>) => {
    if (frameRef.current !== null) cancelAnimationFrame(frameRef.current)
    const rail = event.currentTarget

    frameRef.current = requestAnimationFrame(() => {
      const railCenter = rail.scrollLeft + rail.clientWidth / 2
      let nearestIndex = 0
      let nearestDistance = Number.POSITIVE_INFINITY

      stopRefs.current.forEach((stop, index) => {
        if (!stop) return
        const stopCenter = stop.offsetLeft + stop.offsetWidth / 2
        const distance = Math.abs(stopCenter - railCenter)
        if (distance < nearestDistance) {
          nearestDistance = distance
          nearestIndex = index
        }
      })

      setActiveIndex(nearestIndex)
      frameRef.current = null
    })
  }

  return (
    <section className={styles.root}>
      <header className={styles.header}>
        <div className={styles.headerCopy}>
          <p className={styles.eyebrow}>
            <span aria-hidden="true" className={styles.sunMark} />
            Selected work / 2023—26
          </p>
          <h2>Projects in Procession</h2>
          <p className={styles.intro}>
            Follow one continuous route through six projects. Each stop opens
            a complete piece of work; the first is today&rsquo;s featured study.
          </p>
        </div>

        <div className={styles.routeStatus}>
          <p aria-live="polite" className={styles.currentIndex}>
            <span>{String(resolvedIndex + 1).padStart(2, '0')}</span>
            <span aria-hidden="true"> / </span>
            <span>{String(projectList.length).padStart(2, '0')}</span>
          </p>
          <progress
            aria-label={`Project ${resolvedIndex + 1} of ${projectList.length}`}
            className={styles.progress}
            max={projectList.length}
            value={resolvedIndex + 1}
          />
          <div className={styles.controls}>
            <CutCornerButton
              aria-controls="horizontal-project-rail"
              aria-label="Show previous project"
              className={styles.control}
              disabled={resolvedIndex === 0}
              onClick={() => goToProject(resolvedIndex - 1)}
              variant="paper"
            >
              <span aria-hidden="true">←</span> Previous
            </CutCornerButton>
            <CutCornerButton
              aria-controls="horizontal-project-rail"
              aria-label="Show next project"
              className={styles.control}
              disabled={resolvedIndex === projectList.length - 1}
              onClick={() => goToProject(resolvedIndex + 1)}
              variant="gold"
            >
              Next <span aria-hidden="true">→</span>
            </CutCornerButton>
          </div>
        </div>
      </header>

      <div
        aria-label="Horizontal project route. Use left and right arrow keys to move between projects."
        className={styles.railViewport}
        id="horizontal-project-rail"
        onKeyDown={handleRailKeyDown}
        onScroll={handleRailScroll}
        ref={railRef}
        role="region"
        tabIndex={0}
      >
        <ol className={styles.track}>
          {projectList.map((project, index) => {
            const isFeatured = index === 0
            const isActive = index === resolvedIndex
            const titleId = `horizontal-title-${project.slug}`
            const summaryId = `horizontal-summary-${project.slug}`

            return (
              <li
                className={`${styles.stop} ${isFeatured ? styles.featuredStop : ''}`}
                key={project.slug}
                ref={(node) => {
                  stopRefs.current[index] = node
                }}
              >
                <div aria-hidden="true" className={styles.stationMarker}>
                  <span>{String(index + 1).padStart(2, '0')}</span>
                </div>

                <motion.article
                  aria-describedby={summaryId}
                  aria-labelledby={titleId}
                  className={`${styles.project} ${isFeatured ? styles.featuredProject : ''} ${isActive ? styles.activeProject : ''}`}
                  initial={reduceMotion ? false : { opacity: 0, y: 18 }}
                  transition={{ duration: reduceMotion ? 0 : 0.42, ease: [0.16, 1, 0.3, 1] }}
                  viewport={{ amount: 0.2, once: true }}
                  whileInView={{ opacity: 1, y: 0 }}
                >
                  <figure className={styles.mediaFrame}>
                    <ProjectMedia
                      className={styles.media}
                      eager={isFeatured}
                      project={project}
                    />
                    <figcaption>
                      <span>{isFeatured ? 'Featured project' : `Route stop ${String(index + 1).padStart(2, '0')}`}</span>
                      <span>{project.year}</span>
                    </figcaption>
                  </figure>

                  <div className={styles.projectBody}>
                    <div className={styles.projectHeading}>
                      <p className={styles.projectMeta}>
                        <span>{project.year}</span>
                        <span>{project.role}</span>
                      </p>
                      <h3 id={titleId}>{project.title}</h3>
                    </div>

                    <div className={styles.projectDetails}>
                      <p className={styles.summary} id={summaryId}>
                        {project.summary}
                      </p>
                      <ul aria-label={`Services for ${project.title}`} className={styles.services}>
                        {project.services.map((service) => (
                          <li key={service}>{service}</li>
                        ))}
                      </ul>
                      <div className={styles.actions}>
                        <CutCornerButton href={project.caseStudyHref} variant="navy">
                          View case study
                        </CutCornerButton>
                        {project.liveHref ? (
                          <CutCornerButton href={project.liveHref} variant="quiet">
                            Visit live project <span aria-hidden="true">↗</span>
                          </CutCornerButton>
                        ) : null}
                      </div>
                    </div>
                  </div>
                </motion.article>
              </li>
            )
          })}

          <li aria-hidden="true" className={styles.terminus}>
            <span>End of route</span>
          </li>
        </ol>
      </div>

      <footer className={styles.railFooter}>
        <p>
          <span aria-hidden="true">← →</span> Arrow keys, trackpad, or swipe to
          move along the route
        </p>
        <p>{projectList[resolvedIndex]?.title}</p>
      </footer>
    </section>
  )
}
