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
    'A compact technical register with a pinned featured record, five supporting index rows, and direct keyboard routes to every case.',
  id: '10-technical-index',
  name: 'Technical Index',
  skill: {
    name: 'interface-design',
    url: 'https://www.skills.sh/dammyjay93/interface-design/interface-design',
  },
} satisfies ProjectDirectionMetadata

type TechnicalIndexDirectionProps = Omit<ProjectDirectionProps, 'projects'> & {
  projects?: ProjectDirectionProps['projects']
}

function Services({ project }: { project: PortfolioProject }) {
  return (
    <div className={styles.serviceField}>
      <p>Services</p>
      <ul aria-label={`Services for ${project.title}`} className={styles.services} role="list">
        {project.services.map((service) => (
          <li key={service}>{service}</li>
        ))}
      </ul>
    </div>
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
        Case study <span aria-hidden="true">→</span>
      </CutCornerButton>
      {project.liveHref ? (
        <CutCornerButton
          aria-label={`Visit the live ${project.title} project`}
          href={project.liveHref}
          variant="quiet"
        >
          Live <span aria-hidden="true">↗</span>
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
        <dd><time dateTime={project.year}>{project.year}</time></dd>
      </div>
      <div>
        <dt>Role</dt>
        <dd>{project.role}</dd>
      </div>
    </dl>
  )
}

function LoadingState() {
  return (
    <section
      aria-busy="true"
      aria-label="Loading technical project index"
      className={`${styles.root} ${styles.stateRoot}`}
    >
      <div aria-hidden="true" className={styles.loadingHeader}>
        <span className={`${styles.skeleton} ${styles.skeletonKicker}`} />
        <span className={`${styles.skeleton} ${styles.skeletonTitle}`} />
        <span className={`${styles.skeleton} ${styles.skeletonIntro}`} />
      </div>
      <div aria-hidden="true" className={styles.loadingRoute}>
        {Array.from({ length: 6 }, (_, index) => (
          <span className={styles.skeletonRoute} key={index} />
        ))}
      </div>
      <div aria-hidden="true" className={styles.loadingFeatured}>
        <span className={`${styles.skeleton} ${styles.skeletonMedia}`} />
        <span className={`${styles.skeleton} ${styles.skeletonDetail}`} />
      </div>
      <div aria-hidden="true" className={styles.loadingRows}>
        {Array.from({ length: 5 }, (_, index) => (
          <span className={`${styles.skeleton} ${styles.skeletonRow}`} key={index} />
        ))}
      </div>
      <div className={styles.loadingAction}>
        <CutCornerButton loading variant="navy">Loading register</CutCornerButton>
      </div>
      <p className={styles.srOnly} role="status">Loading six project records…</p>
    </section>
  )
}

function EmptyState() {
  return (
    <section
      aria-labelledby="technical-index-empty-title"
      className={`${styles.root} ${styles.stateRoot} ${styles.empty}`}
    >
      <p aria-hidden="true" className={styles.emptyCode}>IDX / 00</p>
      <p className={styles.eyebrow}>Register status / no records</p>
      <h2 id="technical-index-empty-title">The index is open for its first entry.</h2>
      <p>No project records are logged yet. Start a collaboration to establish the register.</p>
      <CutCornerButton href="#contact" variant="navy">
        Start a conversation <span aria-hidden="true">→</span>
      </CutCornerButton>
    </section>
  )
}

export function TechnicalIndexDirection({
  projects: projectList = sharedProjects,
  state = 'ready',
}: TechnicalIndexDirectionProps = {}) {
  const reduceMotion = useReducedMotion()

  if (state === 'loading') return <LoadingState />
  if (state === 'empty' || projectList.length === 0) return <EmptyState />

  const records = projectList.slice(0, 6)
  const featured = records[0]!
  const supporting = records.slice(1)

  return (
    <section aria-labelledby="technical-index-title" className={styles.root}>
      <header className={styles.header}>
        <div className={styles.headingBlock}>
          <p className={styles.eyebrow}>
            <span aria-hidden="true" className={styles.registerMark} />
            Technical index / selected work
          </p>
          <h2 id="technical-index-title">Projects, precisely registered.</h2>
        </div>
        <div className={styles.headerBrief}>
          <p>IDX–26 / {String(records.length).padStart(2, '0')} records</p>
          <p>A compact ledger of roles, services, and outcomes. Follow any coordinate directly.</p>
        </div>
      </header>

      <nav aria-label="Project record shortcuts" className={styles.routeIndex}>
        <p>Jump to record</p>
        <ol role="list">
          {records.map((project, index) => (
            <li key={project.slug}>
              <a
                aria-label={`Go to record ${index + 1}, ${project.title}`}
                href={`#technical-record-${project.slug}`}
              >
                <span>{String(index + 1).padStart(2, '0')}</span>
                <span>{project.title}</span>
              </a>
            </li>
          ))}
        </ol>
      </nav>

      <div aria-hidden="true" className={styles.columnGuide}>
        <span>Ref / visual</span>
        <span>Project record</span>
        <span>Year / responsibility</span>
        <span>Route</span>
      </div>

      <motion.article
        aria-labelledby={`technical-title-${featured.slug}`}
        className={styles.featured}
        id={`technical-record-${featured.slug}`}
        initial={reduceMotion ? false : { opacity: 0, y: 8 }}
        transition={{ duration: reduceMotion ? 0 : 0.32, ease: [0.23, 1, 0.32, 1] }}
        viewport={{ amount: 0.2, once: true }}
        whileInView={{ opacity: 1, y: 0 }}
      >
        <div className={styles.featuredLabel}>
          <span>01</span>
          <strong>Pinned / primary</strong>
        </div>
        <figure className={styles.featuredMedia}>
          <ProjectMedia className={styles.media} eager project={featured} />
          <figcaption>Visual record / {featured.slug.replaceAll('-', ' ')}</figcaption>
        </figure>
        <div className={styles.featuredCopy}>
          <p className={styles.recordCode}>Record 01 / active file</p>
          <h3 id={`technical-title-${featured.slug}`}>
            <a href={featured.caseStudyHref}>{featured.title}</a>
          </h3>
          <p className={styles.summary}>{featured.summary}</p>
          <Services project={featured} />
        </div>
        <div className={styles.featuredMeta}>
          <ProjectFacts project={featured} />
          <ProjectActions project={featured} />
        </div>
      </motion.article>

      <section aria-labelledby="supporting-index-title" className={styles.supporting}>
        <div className={styles.supportingHeading}>
          <h2 id="supporting-index-title">Supporting register</h2>
          <p>Five complete records / ordered recent to earliest</p>
        </div>
        <ol className={styles.records} role="list" start={2}>
          {supporting.map((project, index) => {
            const recordNumber = String(index + 2).padStart(2, '0')

            return (
              <li key={project.slug}>
                <motion.article
                  aria-labelledby={`technical-title-${project.slug}`}
                  className={styles.record}
                  id={`technical-record-${project.slug}`}
                  initial={reduceMotion ? false : { opacity: 0, y: 6 }}
                  transition={{
                    delay: reduceMotion ? 0 : index * 0.035,
                    duration: reduceMotion ? 0 : 0.26,
                    ease: [0.23, 1, 0.32, 1],
                  }}
                  viewport={{ amount: 0.25, once: true }}
                  whileInView={{ opacity: 1, y: 0 }}
                >
                  <div className={styles.recordVisual}>
                    <p aria-hidden="true">{recordNumber}</p>
                    <figure>
                      <ProjectMedia className={styles.media} project={project} />
                      <figcaption className={styles.srOnly}>{project.alt}</figcaption>
                    </figure>
                  </div>
                  <div className={styles.recordCopy}>
                    <p className={styles.recordCode}>IDX–{recordNumber} / verified</p>
                    <h3 id={`technical-title-${project.slug}`}>
                      <a href={project.caseStudyHref}>{project.title}</a>
                    </h3>
                    <p className={styles.summary}>{project.summary}</p>
                    <Services project={project} />
                  </div>
                  <div className={styles.recordMeta}>
                    <ProjectFacts project={project} />
                    <ProjectActions project={project} />
                  </div>
                </motion.article>
              </li>
            )
          })}
        </ol>
      </section>

      <footer className={styles.footer}>
        <p><span aria-hidden="true" /> Register complete / {String(records.length).padStart(2, '0')} entries</p>
        <a href="#technical-index-title">Return to index <span aria-hidden="true">↑</span></a>
      </footer>
    </section>
  )
}

export default TechnicalIndexDirection
