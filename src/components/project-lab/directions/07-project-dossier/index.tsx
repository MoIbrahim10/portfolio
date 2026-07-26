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
    'An investigative project dossier with one bound case file and five expandable evidence records organized as a working archive.',
  id: '07-project-dossier',
  name: 'Project Dossier',
  skill: {
    name: 'make-interfaces-feel-better',
    url: 'https://www.skills.sh/jakubkrehel/make-interfaces-feel-better',
  },
} satisfies ProjectDirectionMetadata

type ProjectDossierDirectionProps = Omit<ProjectDirectionProps, 'projects'> & {
  projects?: ProjectDirectionProps['projects']
}

function ProjectFacts({ project }: { project: PortfolioProject }) {
  return (
    <dl className={styles.facts}>
      <div>
        <dt>Filed</dt>
        <dd><time dateTime={project.year}>{project.year}</time></dd>
      </div>
      <div>
        <dt>Lead role</dt>
        <dd>{project.role}</dd>
      </div>
    </dl>
  )
}

function ServiceStamps({ project }: { project: PortfolioProject }) {
  return (
    <div className={styles.serviceBlock}>
      <p>Services / tags</p>
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
        Open case study <span aria-hidden="true">→</span>
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
      aria-label="Loading project dossier"
      className={`${styles.root} ${styles.stateRoot}`}
    >
      <div aria-hidden="true" className={styles.loadingHeading}>
        <span className={`${styles.skeleton} ${styles.skeletonKicker}`} />
        <span className={`${styles.skeleton} ${styles.skeletonTitle}`} />
        <span className={`${styles.skeleton} ${styles.skeletonIntro}`} />
      </div>
      <div aria-hidden="true" className={styles.loadingFeature}>
        <span className={`${styles.skeleton} ${styles.skeletonMedia}`} />
        <span className={`${styles.skeleton} ${styles.skeletonBrief}`} />
      </div>
      <div aria-hidden="true" className={styles.loadingRecords}>
        {Array.from({ length: 5 }, (_, index) => (
          <span className={`${styles.skeleton} ${styles.skeletonRecord}`} key={index} />
        ))}
      </div>
      <div className={styles.loadingAction}>
        <CutCornerButton loading variant="navy">Loading files</CutCornerButton>
      </div>
      <p className={styles.srOnly} role="status">Loading six project files…</p>
    </section>
  )
}

function EmptyState() {
  return (
    <section
      aria-labelledby="project-dossier-empty-title"
      className={`${styles.root} ${styles.stateRoot} ${styles.empty}`}
    >
      <div aria-hidden="true" className={styles.emptySeal}>00</div>
      <p className={styles.kicker}>Archive notice / no files entered</p>
      <h2 id="project-dossier-empty-title">This dossier is ready for its first case.</h2>
      <p>
        There are no project records on file yet. Begin a collaboration to open the archive.
      </p>
      <CutCornerButton href="#contact" variant="navy">
        Start a conversation <span aria-hidden="true">→</span>
      </CutCornerButton>
    </section>
  )
}

export function ProjectDossierDirection({
  projects: projectList = sharedProjects,
  state = 'ready',
}: ProjectDossierDirectionProps = {}) {
  const reduceMotion = useReducedMotion()

  if (state === 'loading') return <LoadingState />
  if (state === 'empty' || projectList.length === 0) return <EmptyState />

  const records = projectList.slice(0, 6)
  const featured = records[0]!
  const supporting = records.slice(1)

  return (
    <section aria-labelledby="project-dossier-title" className={styles.root}>
      <header className={styles.header}>
        <div>
          <p className={styles.kicker}>
            <span aria-hidden="true" className={styles.statusLight} />
            Selected work / evidence register
          </p>
          <h2 id="project-dossier-title">Cases worth reopening.</h2>
        </div>
        <div className={styles.headerNote}>
          <span aria-hidden="true">PD / 2023—26</span>
          <p>
            Six project files documenting the brief, the evidence, and the services behind each outcome.
          </p>
        </div>
      </header>

      <motion.article
        aria-labelledby={`dossier-title-${featured.slug}`}
        className={styles.featured}
        initial={reduceMotion ? false : { opacity: 0, y: 16 }}
        transition={{ duration: reduceMotion ? 0 : 0.48, ease: [0.22, 1, 0.36, 1] }}
        viewport={{ amount: 0.15, once: true }}
        whileInView={{ opacity: 1, y: 0 }}
      >
        <div aria-hidden="true" className={styles.binding}>
          {Array.from({ length: 5 }, (_, index) => <span key={index} />)}
        </div>

        <div className={styles.featuredEvidence}>
          <div className={styles.fileBar}>
            <span>Case file / 01</span>
            <strong>Priority evidence</strong>
            <span>{featured.year}</span>
          </div>
          <figure className={styles.featuredMedia}>
            <ProjectMedia className={styles.media} eager project={featured} />
            <figcaption>
              Exhibit A — primary project view / ref. {featured.slug.replaceAll('-', ' ')}
            </figcaption>
          </figure>
        </div>

        <div className={styles.featuredBrief}>
          <p className={styles.classification}>Open file / verified</p>
          <h3 id={`dossier-title-${featured.slug}`}>{featured.title}</h3>
          <div className={styles.briefLabel}>Executive brief</div>
          <p className={styles.summary}>{featured.summary}</p>
          <ProjectFacts project={featured} />
          <ServiceStamps project={featured} />
          <ProjectActions project={featured} />
          <p aria-hidden="true" className={styles.signed}>Reviewed / 01</p>
        </div>
      </motion.article>

      <div className={styles.registerHeading}>
        <div>
          <p className={styles.kicker}>Supporting records / 02—06</p>
          <h2>Evidence register</h2>
        </div>
        <p>Choose a file name to disclose the complete record.</p>
      </div>

      <div className={styles.records}>
        {supporting.map((project, index) => {
          const recordNumber = String(index + 2).padStart(2, '0')

          return (
            <motion.article
              aria-labelledby={`dossier-title-${project.slug}`}
              className={styles.record}
              initial={reduceMotion ? false : { opacity: 0, y: 12 }}
              key={project.slug}
              transition={{
                delay: reduceMotion ? 0 : Math.min(index * 0.04, 0.16),
                duration: reduceMotion ? 0 : 0.36,
                ease: [0.22, 1, 0.36, 1],
              }}
              viewport={{ amount: 0.2, once: true }}
              whileInView={{ opacity: 1, y: 0 }}
            >
              <details className={styles.recordFile} open={index === 0 ? true : undefined}>
                <summary>
                  <h3 id={`dossier-title-${project.slug}`}>
                    <span className={styles.recordNumber}>DF–{recordNumber}</span>
                    <span className={styles.recordTitle}>{project.title}</span>
                    <span className={styles.recordRole}>{project.role}</span>
                    <time className={styles.recordYear} dateTime={project.year}>{project.year}</time>
                    <span aria-hidden="true" className={styles.disclosure}>
                      <i>+</i><i>−</i>
                    </span>
                  </h3>
                </summary>

                <div className={styles.recordBody}>
                  <figure className={styles.recordMedia}>
                    <ProjectMedia className={styles.media} project={project} />
                    <figcaption>Exhibit {String.fromCharCode(66 + index)} / visual evidence</figcaption>
                  </figure>

                  <div className={styles.recordBrief}>
                    <div className={styles.briefLabel}>Record summary</div>
                    <p className={styles.summary}>{project.summary}</p>
                    <ProjectFacts project={project} />
                    <ServiceStamps project={project} />
                    <ProjectActions project={project} />
                  </div>
                </div>
              </details>
            </motion.article>
          )
        })}
      </div>

      <footer className={styles.footer}>
        <p><span aria-hidden="true" /> End of register / {String(records.length).padStart(2, '0')} files</p>
        <a href="#project-dossier-title">Return to dossier index ↑</a>
      </footer>
    </section>
  )
}

export default ProjectDossierDirection
