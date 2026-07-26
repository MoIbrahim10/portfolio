import {
  type KeyboardEvent,
  useRef,
  useState,
} from 'react'
import { AnimatePresence, motion, useReducedMotion } from 'motion/react'

import { CutCornerButton } from '../../shared/CutCornerButton'
import { ProjectMedia } from '../../shared/ProjectMedia'
import { projects as sharedProjects } from '../../shared/projects'
import type { PortfolioProject } from '../../shared/projects'
import type {
  ProjectDirectionMetadata,
  ProjectDirectionProps,
} from '../../shared/types'

import styles from './styles.module.css'

export const cinematicFeatureMetadata = {
  description:
    'A 16:10 feature stage with layered project credits and a selectable six-frame programme that keeps every supporting work in view.',
  id: '09-cinematic-feature',
  name: 'Cinematic Feature',
  skill: {
    name: 'design-motion-principles',
    url: 'https://skills.sh/kylezantos/design-motion-principles',
  },
} satisfies ProjectDirectionMetadata

type CinematicFeatureDirectionProps = Omit<ProjectDirectionProps, 'projects'> & {
  projects?: ProjectDirectionProps['projects']
}

const getNextIndex = (
  key: string,
  currentIndex: number,
  projectCount: number,
) => {
  if (key === 'Home') return 0
  if (key === 'End') return projectCount - 1
  if (key === 'ArrowRight' || key === 'ArrowDown') {
    return (currentIndex + 1) % projectCount
  }
  if (key === 'ArrowLeft' || key === 'ArrowUp') {
    return (currentIndex - 1 + projectCount) % projectCount
  }
  return null
}

function ProjectFacts({ project }: { project: PortfolioProject }) {
  return (
    <dl className={styles.facts}>
      <div>
        <dt>Released</dt>
        <dd><time dateTime={project.year}>{project.year}</time></dd>
      </div>
      <div>
        <dt>Role</dt>
        <dd>{project.role}</dd>
      </div>
    </dl>
  )
}

function ProjectActions({ project }: { project: PortfolioProject }) {
  return (
    <div className={styles.actions}>
      <CutCornerButton
        aria-label={`View the ${project.title} case study`}
        href={project.caseStudyHref}
        variant="gold"
      >
        View case study <span aria-hidden="true">→</span>
      </CutCornerButton>
      {project.liveHref ? (
        <CutCornerButton
          aria-label={`Visit the live ${project.title} project`}
          href={project.liveHref}
          variant="quiet"
        >
          Live project <span aria-hidden="true">↗</span>
        </CutCornerButton>
      ) : null}
    </div>
  )
}

function LoadingState() {
  return (
    <section
      aria-busy="true"
      aria-label="Cinematic project feature is loading"
      className={`${styles.root} ${styles.stateRoot}`}
    >
      <div aria-hidden="true" className={styles.loadingHeader}>
        <span className={`${styles.skeleton} ${styles.skeletonKicker}`} />
        <span className={`${styles.skeleton} ${styles.skeletonHeading}`} />
        <span className={`${styles.skeleton} ${styles.skeletonIntro}`} />
      </div>
      <div aria-hidden="true" className={styles.loadingScene}>
        <span className={`${styles.skeleton} ${styles.skeletonCredit}`} />
        <span className={`${styles.skeleton} ${styles.skeletonTitle}`} />
      </div>
      <div className={styles.loadingBrief}>
        <div aria-hidden="true" className={styles.loadingCopy}>
          <span className={`${styles.skeleton} ${styles.skeletonLine}`} />
          <span className={`${styles.skeleton} ${styles.skeletonLineShort}`} />
        </div>
        <CutCornerButton loading variant="gold">Loading feature</CutCornerButton>
      </div>
      <div aria-hidden="true" className={styles.loadingStrip}>
        {Array.from({ length: 6 }, (_, index) => (
          <span className={styles.skeletonFrame} key={index} />
        ))}
      </div>
      <p className={styles.srOnly} role="status">Loading the six-project programme</p>
    </section>
  )
}

function EmptyState() {
  return (
    <section
      aria-labelledby="cinematic-feature-empty-title"
      className={`${styles.root} ${styles.stateRoot} ${styles.emptyState}`}
    >
      <p className={styles.eyebrow}>Programme / 00</p>
      <h2 id="cinematic-feature-empty-title">The screen is ready for its first project.</h2>
      <p>No work is queued yet. Add a project to begin the programme.</p>
      <CutCornerButton href="#project-lab" variant="gold">Return to project lab</CutCornerButton>
    </section>
  )
}

export function CinematicFeatureDirection({
  projects: projectData = sharedProjects,
  state = 'ready',
}: CinematicFeatureDirectionProps = {}) {
  const [activeIndex, setActiveIndex] = useState(0)
  const [animateScene, setAnimateScene] = useState(true)
  const pointerSelection = useRef(false)
  const projectButtonRefs = useRef<Array<HTMLButtonElement | null>>([])
  const reduceMotion = useReducedMotion()

  if (state === 'loading') return <LoadingState />
  if (state === 'empty' || projectData.length === 0) return <EmptyState />

  const programme = projectData.slice(0, 6)
  const resolvedIndex = activeIndex < programme.length ? activeIndex : 0
  const activeProject = programme[resolvedIndex]!
  const sceneIsInstant = Boolean(reduceMotion) || !animateScene

  const selectProject = (index: number, animate: boolean) => {
    setAnimateScene(animate)
    setActiveIndex(index)
  }

  const handleProjectKeyDown = (
    event: KeyboardEvent<HTMLButtonElement>,
    index: number,
  ) => {
    const nextIndex = getNextIndex(event.key, index, programme.length)
    if (nextIndex === null) return

    event.preventDefault()
    pointerSelection.current = false
    selectProject(nextIndex, false)
    projectButtonRefs.current[nextIndex]?.focus()
  }

  return (
    <section aria-labelledby="cinematic-feature-title" className={styles.root}>
      <header className={styles.header}>
        <p className={styles.eyebrow}>
          <span aria-hidden="true">Feature presentation</span>
          <span>{String(programme.length).padStart(2, '0')} projects / 2023—26</span>
        </p>
        <div className={styles.headerCopy}>
          <h2 id="cinematic-feature-title">The work takes the whole screen.</h2>
          <p>
            One project plays at full scale while the complete programme stays
            within reach below.
          </p>
        </div>
      </header>

      <div className={styles.featureShell}>
        <AnimatePresence initial={false} mode="wait">
          <motion.article
            animate={sceneIsInstant ? { opacity: 1 } : { filter: 'blur(0px)', opacity: 1, y: 0 }}
            aria-labelledby={`cinematic-title-${activeProject.slug}`}
            className={styles.feature}
            exit={sceneIsInstant ? { opacity: 1 } : { filter: 'blur(3px)', opacity: 0, y: -7 }}
            id="cinematic-active-project"
            initial={sceneIsInstant ? false : { filter: 'blur(6px)', opacity: 0, y: 14 }}
            key={activeProject.slug}
            transition={{
              bounce: 0,
              duration: sceneIsInstant ? 0 : 0.44,
              type: 'spring',
            }}
          >
            <figure className={styles.stage}>
              <ProjectMedia
                className={styles.stageMedia}
                eager={resolvedIndex === 0}
                project={activeProject}
              />
              <figcaption className={styles.stageCredits}>
                <div className={styles.topCredits}>
                  <span>Feature {String(resolvedIndex + 1).padStart(2, '0')}</span>
                  <span>{activeProject.year}</span>
                  <span>{activeProject.role}</span>
                </div>
                <div className={styles.titleCard}>
                  <p>Now showing</p>
                  <h3 id={`cinematic-title-${activeProject.slug}`}>{activeProject.title}</h3>
                </div>
              </figcaption>
            </figure>

            <div className={styles.projectBrief}>
              <div className={styles.synopsis}>
                <p className={styles.briefLabel}>Project synopsis</p>
                <p>{activeProject.summary}</p>
              </div>
              <ProjectFacts project={activeProject} />
              <div className={styles.serviceBlock}>
                <p>Services / tags</p>
                <ul aria-label={`Services for ${activeProject.title}`} className={styles.services}>
                  {activeProject.services.map((service) => (
                    <li key={service}>{service}</li>
                  ))}
                </ul>
              </div>
              <ProjectActions project={activeProject} />
            </div>
          </motion.article>
        </AnimatePresence>
        <p aria-live="polite" className={styles.srOnly}>
          Now showing {activeProject.title}, project {resolvedIndex + 1} of {programme.length}
        </p>
      </div>

      <section aria-labelledby="cinematic-programme-title" className={styles.programme}>
        <header className={styles.programmeHeader}>
          <div>
            <p className={styles.programmeKicker}>Full programme / five supporting works</p>
            <h3 id="cinematic-programme-title">Choose the next scene.</h3>
          </div>
          <p>Focus a frame or use the arrow keys to change the feature.</p>
        </header>

        <nav aria-label="Select a project for the feature stage" className={styles.programmeNav}>
          <ol className={styles.filmStrip}>
            {programme.map((project, index) => {
              const isActive = index === resolvedIndex

              return (
                <li key={project.slug}>
                  <button
                    aria-controls="cinematic-active-project"
                    aria-label={`Show ${project.title} in the feature stage`}
                    aria-pressed={isActive}
                    className={`${styles.frame} ${isActive ? styles.frameActive : ''}`}
                    onClick={() => selectProject(index, true)}
                    onFocus={() => selectProject(index, pointerSelection.current)}
                    onKeyDown={(event) => handleProjectKeyDown(event, index)}
                    onPointerCancel={() => {
                      pointerSelection.current = false
                    }}
                    onPointerDown={() => {
                      pointerSelection.current = true
                    }}
                    onPointerUp={() => {
                      pointerSelection.current = false
                    }}
                    ref={(node) => {
                      projectButtonRefs.current[index] = node
                    }}
                    type="button"
                  >
                    <span className={styles.frameMedia}>
                      <ProjectMedia className={styles.frameImage} project={project} />
                      <span className={styles.frameNumber}>
                        {String(index + 1).padStart(2, '0')}
                      </span>
                    </span>
                    <span className={styles.frameCopy}>
                      <strong>{project.title}</strong>
                      <span>{isActive ? 'Now showing' : project.year}</span>
                    </span>
                  </button>
                </li>
              )
            })}
          </ol>
        </nav>
      </section>
    </section>
  )
}

export default CinematicFeatureDirection
