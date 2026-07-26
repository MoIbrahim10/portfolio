import { motion, useReducedMotion } from 'motion/react'

import { CutCornerButton } from '../../shared/CutCornerButton'
import { ProjectMedia } from '../../shared/ProjectMedia'
import { projects as sharedProjects } from '../../shared/projects'
import type { PortfolioProject } from '../../shared/projects'
import type { ProjectDirectionMetadata, ProjectDirectionProps } from '../../shared/types'

import styles from './styles.module.css'

export const metadata: ProjectDirectionMetadata = {
  description:
    'A restrained collection catalog pairing a hero accession with numbered, scholarly project records.',
  id: '02-museum-catalog',
  name: 'Museum Catalog',
  skill: {
    name: 'frontend-design',
    url: 'https://www.skills.sh/block/agent-skills/frontend-design',
  },
}

function accessionNumber(index: number) {
  return `MO.${String(index + 1).padStart(3, '0')}`
}

function Services({ project }: { project: PortfolioProject }) {
  return (
    <ul aria-label={`Services for ${project.title}`} className={styles.services}>
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
        Case study <span aria-hidden="true">↗</span>
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

function CatalogLoading() {
  return (
    <section
      aria-busy="true"
      aria-label="Loading museum catalog"
      className={`${styles.catalog} ${styles.loading}`}
    >
      <div className={styles.loadingHeader}>
        <span className={styles.skeletonLine} />
        <span className={styles.skeletonTitle} />
      </div>
      <div className={styles.loadingFeature}>
        <span className={styles.skeletonMedia} />
        <span className={styles.skeletonLabel} />
      </div>
      <div className={styles.loadingRecords}>
        {Array.from({ length: 5 }, (_, index) => (
          <span className={styles.skeletonRecord} key={index} />
        ))}
      </div>
      <span className={styles.srOnly}>Project collection is loading.</span>
    </section>
  )
}

function CatalogEmpty() {
  return (
    <section aria-labelledby="museum-empty-title" className={`${styles.catalog} ${styles.empty}`}>
      <p className={styles.eyebrow}>Collection notice · 00</p>
      <h2 id="museum-empty-title">The gallery is between exhibitions.</h2>
      <p>
        No project records are available in this view. Return to the laboratory index to compare another
        presentation system.
      </p>
      <CutCornerButton href="#project-lab-index" variant="navy">
        Return to index
      </CutCornerButton>
    </section>
  )
}

export function MuseumCatalogDirection({
  projects = sharedProjects,
  state = 'ready',
}: ProjectDirectionProps) {
  const reduceMotion = useReducedMotion()

  if (state === 'loading') return <CatalogLoading />
  if (state === 'empty' || projects.length === 0) return <CatalogEmpty />

  const [featured, ...supporting] = projects

  return (
    <section aria-labelledby="museum-catalog-title" className={styles.catalog}>
      <header className={styles.masthead}>
        <div>
          <p className={styles.eyebrow}>Selected works · Collection 2023—2026</p>
          <h2 id="museum-catalog-title">The project collection</h2>
        </div>
        <p className={styles.introduction}>
          Six digital works catalogued by purpose, practice, and the people they were made to serve.
        </p>
        <div aria-label="Catalog issue 02" className={styles.issueMark}>
          <span>Collection</span>
          <strong>02</strong>
        </div>
      </header>

      <nav aria-label="Collection index" className={styles.collectionIndex}>
        <p>Accession index</p>
        <ol>
          {projects.map((project, index) => (
            <li key={project.slug}>
              <a href={`#museum-${project.slug}`}>
                <span>{accessionNumber(index)}</span>
                <strong>{project.title}</strong>
                <small>{project.year}</small>
              </a>
            </li>
          ))}
        </ol>
      </nav>

      <motion.article
        className={styles.featured}
        id={`museum-${featured.slug}`}
        initial={reduceMotion ? false : { opacity: 0, y: 16 }}
        transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
        viewport={{ amount: 0.2, once: true }}
        whileInView={{ opacity: 1, y: 0 }}
      >
        <figure className={styles.featuredFigure}>
          <div className={styles.featuredMediaFrame}>
            <ProjectMedia className={styles.projectMedia} eager project={featured} />
          </div>
          <figcaption>
            Digital experience, dimensions variable. Presented as the collection’s opening exhibit.
          </figcaption>
        </figure>

        <div className={styles.exhibitLabel}>
          <div className={styles.accessionHeading}>
            <span>{accessionNumber(0)}</span>
            <span>Featured acquisition</span>
          </div>
          <h3>{featured.title}</h3>
          <p className={styles.summary}>{featured.summary}</p>
          <dl className={styles.metadataList}>
            <div>
              <dt>Year</dt>
              <dd>{featured.year}</dd>
            </div>
            <div>
              <dt>Role</dt>
              <dd>{featured.role}</dd>
            </div>
            <div>
              <dt>Practice</dt>
              <dd>
                <Services project={featured} />
              </dd>
            </div>
          </dl>
          <ProjectActions project={featured} />
        </div>
      </motion.article>

      <div className={styles.recordsHeader}>
        <p>Works in the collection</p>
        <span>{String(supporting.length).padStart(2, '0')} records</span>
      </div>

      <ol className={styles.records} start={2}>
        {supporting.map((project, index) => (
          <li key={project.slug}>
            <motion.article
              className={styles.record}
              id={`museum-${project.slug}`}
              initial={reduceMotion ? false : { opacity: 0, y: 14 }}
              transition={{ delay: index * 0.035, duration: 0.42, ease: [0.22, 1, 0.36, 1] }}
              viewport={{ amount: 0.16, once: true }}
              whileInView={{ opacity: 1, y: 0 }}
            >
              <header className={styles.recordHeading}>
                <span>{accessionNumber(index + 1)}</span>
                <h3>{project.title}</h3>
                <time>{project.year}</time>
              </header>

              <figure className={styles.recordFigure}>
                <ProjectMedia className={styles.projectMedia} project={project} />
                <figcaption>{project.alt}</figcaption>
              </figure>

              <div className={styles.recordText}>
                <p className={styles.summary}>{project.summary}</p>
                <dl className={styles.compactMetadata}>
                  <div>
                    <dt>Role</dt>
                    <dd>{project.role}</dd>
                  </div>
                  <div>
                    <dt>Services</dt>
                    <dd>
                      <Services project={project} />
                    </dd>
                  </div>
                </dl>
                <ProjectActions project={project} />
              </div>
            </motion.article>
          </li>
        ))}
      </ol>

      <footer className={styles.catalogFooter}>
        <p>End of collection · All works documented in full</p>
        <a href="#museum-catalog-title">Return to catalog heading ↑</a>
      </footer>
    </section>
  )
}

export default MuseumCatalogDirection
