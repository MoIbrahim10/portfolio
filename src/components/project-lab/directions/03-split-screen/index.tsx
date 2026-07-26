import {
  type KeyboardEvent,
  useRef,
  useState,
} from 'react'
import { AnimatePresence, motion, useReducedMotion } from 'motion/react'

import { CutCornerButton } from '../../shared/CutCornerButton'
import { ProjectMedia } from '../../shared/ProjectMedia'
import { projects as sharedProjects } from '../../shared/projects'
import type {
  ProjectDirectionMetadata,
  ProjectDirectionProps,
} from '../../shared/types'

import styles from './styles.module.css'

export const splitScreenMetadata = {
  description:
    'A persistent project register drives a cinematic media-and-story pane, keeping every project one click, focus, or arrow key away.',
  id: '03-split-screen',
  name: 'Split-Screen Register',
  skill: {
    name: 'interaction-design',
    url: 'https://www.skills.sh/wshobson/agents/interaction-design',
  },
} satisfies ProjectDirectionMetadata

type SplitScreenDirectionProps = Omit<ProjectDirectionProps, 'projects'> & {
  projects?: ProjectDirectionProps['projects']
}

const getNextIndex = (
  key: string,
  currentIndex: number,
  projectCount: number,
) => {
  if (key === 'Home') return 0
  if (key === 'End') return projectCount - 1
  if (key === 'ArrowDown' || key === 'ArrowRight') {
    return (currentIndex + 1) % projectCount
  }
  if (key === 'ArrowUp' || key === 'ArrowLeft') {
    return (currentIndex - 1 + projectCount) % projectCount
  }
  return null
}

function LoadingState() {
  return (
    <section
      aria-busy="true"
      aria-label="Projects are loading"
      className={`${styles.root} ${styles.stateRoot}`}
    >
      <div className={styles.split}>
        <div className={styles.indexPane}>
          <div className={`${styles.skeleton} ${styles.skeletonKicker}`} />
          <div className={`${styles.skeleton} ${styles.skeletonHeading}`} />
          <div className={styles.skeletonList}>
            {Array.from({ length: 6 }, (_, index) => (
              <div className={styles.skeletonRow} key={index}>
                <span className={`${styles.skeleton} ${styles.skeletonNumber}`} />
                <span className={`${styles.skeleton} ${styles.skeletonTitle}`} />
              </div>
            ))}
          </div>
        </div>
        <div className={styles.storyPane}>
          <div className={`${styles.skeleton} ${styles.skeletonMedia}`} />
          <div className={styles.skeletonStory}>
            <div className={`${styles.skeleton} ${styles.skeletonMeta}`} />
            <div className={`${styles.skeleton} ${styles.skeletonStoryTitle}`} />
            <div className={`${styles.skeleton} ${styles.skeletonCopy}`} />
            <CutCornerButton loading variant="navy">
              View case study
            </CutCornerButton>
          </div>
        </div>
      </div>
      <span className={styles.srOnly} role="status">
        Loading the project register
      </span>
    </section>
  )
}

function EmptyState() {
  return (
    <section className={`${styles.root} ${styles.emptyState}`}>
      <span aria-hidden="true" className={styles.emptyGlyph}>00</span>
      <p className={styles.eyebrow}>Project register</p>
      <h2>No projects are on view</h2>
      <p>
        The exhibition index is ready. Add a project to open the first story.
      </p>
      <CutCornerButton href="#project-lab" variant="paper">
        Return to laboratory
      </CutCornerButton>
    </section>
  )
}

export function SplitScreenDirection({
  projects: projectList = sharedProjects,
  state = 'ready',
}: SplitScreenDirectionProps = {}) {
  const [activeIndex, setActiveIndex] = useState(0)
  const projectButtonRefs = useRef<Array<HTMLButtonElement | null>>([])
  const reduceMotion = useReducedMotion()

  if (state === 'loading') return <LoadingState />
  if (state === 'empty' || projectList.length === 0) return <EmptyState />

  const resolvedIndex = activeIndex < projectList.length ? activeIndex : 0
  const activeProject = projectList[resolvedIndex]!

  const selectProject = (index: number) => {
    setActiveIndex(index)
  }

  const handleProjectKeyDown = (
    event: KeyboardEvent<HTMLButtonElement>,
    index: number,
  ) => {
    const nextIndex = getNextIndex(event.key, index, projectList.length)
    if (nextIndex === null) return

    event.preventDefault()
    selectProject(nextIndex)
    projectButtonRefs.current[nextIndex]?.focus()
  }

  return (
    <section className={styles.root}>
      <div className={styles.split}>
        <aside className={styles.indexPane}>
          <header className={styles.indexHeader}>
            <p className={styles.eyebrow}>
              <span aria-hidden="true" className={styles.sunMark} />
              Selected work / 2023—26
            </p>
            <h2>Project register</h2>
            <p className={styles.indexIntro}>
              Choose a project to keep the index in place while its complete
              story opens alongside.
            </p>
          </header>

          <nav aria-label="Choose a project" className={styles.projectNav}>
            <ol className={styles.projectList}>
              {projectList.map((project, index) => {
                const isActive = index === resolvedIndex
                return (
                  <li key={project.slug}>
                    <button
                      aria-controls="split-screen-active-project"
                      aria-pressed={isActive}
                      className={`${styles.projectTab} ${
                        isActive ? styles.projectTabActive : ''
                      }`}
                      onClick={() => selectProject(index)}
                      onFocus={() => selectProject(index)}
                      onKeyDown={(event) => handleProjectKeyDown(event, index)}
                      ref={(node) => {
                        projectButtonRefs.current[index] = node
                      }}
                      type="button"
                    >
                      <span className={styles.projectNumber}>
                        {String(index + 1).padStart(2, '0')}
                      </span>
                      <span className={styles.projectTabMain}>
                        <strong>{project.title}</strong>
                        <span>{project.role}</span>
                      </span>
                      <span className={styles.projectYear}>{project.year}</span>
                    </button>
                  </li>
                )
              })}
            </ol>
          </nav>

          <p className={styles.keyHint}>
            <span aria-hidden="true">↑ ↓</span> Arrow keys move through the
            register
          </p>
        </aside>

        <div className={styles.storyStage}>
          <AnimatePresence initial={false} mode="wait">
            <motion.article
              animate={{ opacity: 1, x: 0 }}
              aria-labelledby={`split-title-${activeProject.slug}`}
              className={styles.storyPane}
              exit={reduceMotion ? { opacity: 1 } : { opacity: 0, x: -10 }}
              id="split-screen-active-project"
              initial={reduceMotion ? false : { opacity: 0, x: 14 }}
              key={activeProject.slug}
              transition={{ duration: reduceMotion ? 0 : 0.22, ease: [0.16, 1, 0.3, 1] }}
            >
              <figure className={styles.mediaFrame}>
                <ProjectMedia
                  className={styles.media}
                  eager={resolvedIndex === 0}
                  project={activeProject}
                />
                <figcaption>
                  <span>
                    Project {String(resolvedIndex + 1).padStart(2, '0')}
                  </span>
                  <span>{activeProject.services.join(' · ')}</span>
                </figcaption>
              </figure>

              <div className={styles.storyBody}>
                <div className={styles.storyHeading}>
                  <p className={styles.storyMeta}>
                    <span>{activeProject.year}</span>
                    <span>{activeProject.role}</span>
                  </p>
                  <h3 id={`split-title-${activeProject.slug}`}>
                    {activeProject.title}
                  </h3>
                </div>

                <div className={styles.storyCopy}>
                  <p>{activeProject.summary}</p>
                  <ul aria-label="Services" className={styles.services}>
                    {activeProject.services.map((service) => (
                      <li key={service}>{service}</li>
                    ))}
                  </ul>
                  <div className={styles.actions}>
                    <CutCornerButton
                      href={activeProject.caseStudyHref}
                      variant="navy"
                    >
                      View case study
                    </CutCornerButton>
                    {activeProject.liveHref ? (
                      <CutCornerButton
                        href={activeProject.liveHref}
                        variant="gold"
                      >
                        Visit live project ↗
                      </CutCornerButton>
                    ) : null}
                  </div>
                </div>
              </div>
            </motion.article>
          </AnimatePresence>
          <p aria-live="polite" className={styles.srOnly}>
            Showing {activeProject.title}, project {resolvedIndex + 1} of{' '}
            {projectList.length}
          </p>
        </div>
      </div>
    </section>
  )
}

export default SplitScreenDirection
