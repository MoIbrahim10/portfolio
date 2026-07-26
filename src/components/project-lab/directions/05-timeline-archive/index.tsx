import { motion, useReducedMotion } from 'motion/react'

import { CutCornerButton } from '../../shared/CutCornerButton'
import { ProjectMedia } from '../../shared/ProjectMedia'
import { projects as sharedProjects } from '../../shared/projects'
import type { PortfolioProject } from '../../shared/projects'
import type {
  ProjectDirectionMetadata,
  ProjectDirectionProps,
} from '../../shared/types'

import styles from './styles.module.css'

export const metadata = {
  description:
    'A current-to-past career continuum with a featured present, a navigable year rail, and alternating media-led archive records.',
  id: '05-timeline-archive',
  name: 'Timeline Archive',
  skill: {
    name: 'ui-design',
    url: 'https://www.skills.sh/mblode/agent-skills/ui-design',
  },
} satisfies ProjectDirectionMetadata

type TimelineArchiveDirectionProps = Omit<ProjectDirectionProps, 'projects'> & {
  projects?: ProjectDirectionProps['projects']
}

function Services({ project }: { project: PortfolioProject }) {
  return (
    <ul aria-label={`Services for ${project.title}`} className={styles.services} role="list">
      {project.services.map((service) => (
        <li key={service}>{service}</li>
      ))}
    </ul>
  )
}

function ProjectActions({ project }: { project: PortfolioProject }) {
  return (
    <div className={styles.actions}>
      <CutCornerButton
        aria-label={`Read the ${project.title} case study`}
        href={project.caseStudyHref}
        variant="navy"
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

function ProjectFacts({ project }: { project: PortfolioProject }) {
  return (
    <dl className={styles.facts}>
      <div>
        <dt>Year</dt>
        <dd>{project.year}</dd>
      </div>
      <div>
        <dt>Role</dt>
        <dd>{project.role}</dd>
      </div>
    </dl>
  )
}

function TimelineLoading() {
  return (
    <section
      aria-busy="true"
      aria-label="Loading project timeline"
      className={`${styles.root} ${styles.stateRoot}`}
    >
      <div className={styles.loadingHeader}>
        <span className={`${styles.skeleton} ${styles.skeletonEyebrow}`} />
        <span className={`${styles.skeleton} ${styles.skeletonHeading}`} />
        <span className={`${styles.skeleton} ${styles.skeletonIntro}`} />
      </div>
      <div aria-hidden="true" className={styles.loadingRail}>
        {Array.from({ length: 6 }, (_, index) => (
          <span className={styles.skeletonYear} key={index} />
        ))}
      </div>
      <div aria-hidden="true" className={styles.loadingFeature}>
        <span className={`${styles.skeleton} ${styles.skeletonMedia}`} />
        <span className={`${styles.skeleton} ${styles.skeletonCopy}`} />
      </div>
      <div aria-hidden="true" className={styles.loadingEntries}>
        {Array.from({ length: 5 }, (_, index) => (
          <span className={`${styles.skeleton} ${styles.skeletonEntry}`} key={index} />
        ))}
      </div>
      <div className={styles.loadingAction}>
        <CutCornerButton loading variant="navy">
          Loading archive
        </CutCornerButton>
      </div>
      <p className={styles.srOnly} role="status">Loading the project timeline…</p>
    </section>
  )
}

function TimelineEmpty() {
  return (
    <section
      aria-labelledby="timeline-empty-title"
      className={`${styles.root} ${styles.stateRoot} ${styles.empty}`}
    >
      <div aria-hidden="true" className={styles.emptyRail}>
        <span />
        <strong>00</strong>
        <span />
      </div>
      <p className={styles.eyebrow}>Archive status / awaiting first record</p>
      <h2 id="timeline-empty-title">The timeline begins with the next collaboration.</h2>
      <p className={styles.emptyCopy}>
        No project records are on view yet. Start a conversation to make the first mark.
      </p>
      <CutCornerButton href="#contact" variant="navy">
        Start a conversation <span aria-hidden="true">→</span>
      </CutCornerButton>
    </section>
  )
}

export function TimelineArchiveDirection({
  projects: projectList = sharedProjects,
  state = 'ready',
}: TimelineArchiveDirectionProps = {}) {
  const reduceMotion = useReducedMotion()

  if (state === 'loading') return <TimelineLoading />
  if (state === 'empty' || projectList.length === 0) return <TimelineEmpty />

  const [featured, ...supporting] = projectList.slice(0, 6)

  return (
    <section aria-labelledby="timeline-archive-title" className={styles.root}>
      <header className={styles.header}>
        <div className={styles.headingGroup}>
          <p className={styles.eyebrow}>
            <span aria-hidden="true" className={styles.sunMark} />
            Selected work / current to 2023
          </p>
          <h2 id="timeline-archive-title">A continuum of useful work.</h2>
        </div>
        <p className={styles.intro}>
          Six collaborations traced through time—each one a shift in scale, medium, and responsibility.
        </p>
      </header>

      <nav aria-label="Project timeline" className={styles.yearNavigation}>
        <ol role="list">
          {projectList.slice(0, 6).map((project, index) => (
            <li key={project.slug}>
              <a
                aria-current={index === 0 ? 'true' : undefined}
                href={`#timeline-${project.slug}`}
              >
                <time dateTime={project.year}>{project.year}</time>
                <span>{project.title}</span>
                <i aria-hidden="true" />
              </a>
            </li>
          ))}
        </ol>
      </nav>

      <motion.article
        aria-labelledby={`timeline-title-${featured.slug}`}
        className={styles.featured}
        id={`timeline-${featured.slug}`}
        initial={reduceMotion ? false : { opacity: 0, y: 20 }}
        transition={{ duration: reduceMotion ? 0 : 0.56, ease: [0.22, 1, 0.36, 1] }}
        viewport={{ amount: 0.18, once: true }}
        whileInView={{ opacity: 1, y: 0 }}
      >
        <div className={styles.featuredMedia}>
          <ProjectMedia className={styles.media} eager project={featured} />
          <p aria-hidden="true" className={styles.mediaIndex}>01 / 06</p>
        </div>
        <div className={styles.featuredStory}>
          <div className={styles.currentMarker}>
            <span aria-hidden="true" />
            Current project
          </div>
          <h3 id={`timeline-title-${featured.slug}`}>{featured.title}</h3>
          <p className={styles.summary}>{featured.summary}</p>
          <ProjectFacts project={featured} />
          <Services project={featured} />
          <ProjectActions project={featured} />
        </div>
      </motion.article>

      <div className={styles.archiveHeading}>
        <p>Earlier records</p>
        <span>Follow the datum toward the beginning</span>
      </div>

      <ol className={styles.entries} role="list" start={2}>
        {supporting.map((project, index) => {
          const reverse = index % 2 === 1

          return (
            <li key={project.slug}>
              <motion.article
                aria-labelledby={`timeline-title-${project.slug}`}
                className={`${styles.entry} ${reverse ? styles.entryReverse : ''}`}
                id={`timeline-${project.slug}`}
                initial={reduceMotion ? false : { opacity: 0, x: reverse ? 24 : -24 }}
                transition={{ duration: reduceMotion ? 0 : 0.48, ease: [0.22, 1, 0.36, 1] }}
                viewport={{ amount: 0.2, once: true }}
                whileInView={{ opacity: 1, x: 0 }}
              >
                <figure className={styles.entryMedia}>
                  <ProjectMedia className={styles.media} project={project} />
                  <figcaption>
                    Record {String(index + 2).padStart(2, '0')} / {String(projectList.slice(0, 6).length).padStart(2, '0')}
                  </figcaption>
                </figure>

                <div className={styles.yearMarker}>
                  <span aria-hidden="true" />
                  <time dateTime={project.year}>{project.year}</time>
                </div>

                <div className={styles.entryStory}>
                  <p className={styles.recordLabel}>Archive record {String(index + 2).padStart(2, '0')}</p>
                  <h3 id={`timeline-title-${project.slug}`}>{project.title}</h3>
                  <p className={styles.summary}>{project.summary}</p>
                  <ProjectFacts project={project} />
                  <Services project={project} />
                  <ProjectActions project={project} />
                </div>
              </motion.article>
            </li>
          )
        })}
      </ol>

      <footer className={styles.footer}>
        <span aria-hidden="true" className={styles.footerMark} />
        <p>2023 / first record in this working archive</p>
        <a href="#timeline-archive-title">Return to the present ↑</a>
      </footer>
    </section>
  )
}

export default TimelineArchiveDirection
