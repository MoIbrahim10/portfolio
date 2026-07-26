import { motion, useReducedMotion } from 'motion/react'

import { CutCornerButton } from '../../shared/CutCornerButton'
import { ProjectMedia } from '../../shared/ProjectMedia'
import { projects as sharedProjects } from '../../shared/projects'
import type { ProjectDirectionMetadata, ProjectDirectionProps } from '../../shared/types'

import styles from './styles.module.css'

type Project = (typeof sharedProjects)[number]

type ModularMosaicDirectionProps = Omit<ProjectDirectionProps, 'projects'> & {
  projects?: ProjectDirectionProps['projects']
}

export const metadata = {
  description:
    'A variable-span project mosaic built from stepped architectural blocks, dimensional edges, and restrained solar geometry.',
  id: '06-modular-mosaic',
  name: 'Modular Mosaic',
  skill: {
    name: 'flex-grid-flow',
    url: 'https://www.skills.sh/oerlellijk/design-system-skill/flex-grid-flow',
  },
} satisfies ProjectDirectionMetadata

const supportClasses = [
  styles.tileOne,
  styles.tileTwo,
  styles.tileThree,
  styles.tileFour,
  styles.tileFive,
] as const

function ProjectFacts({ project }: { project: Project }) {
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

function ProjectServices({ project }: { project: Project }) {
  return (
    <ul aria-label={`Services for ${project.title}`} className={styles.services} role="list">
      {project.services.map((service) => (
        <li key={service}>{service}</li>
      ))}
    </ul>
  )
}

function ProjectActions({ inverse = false, project }: { inverse?: boolean; project: Project }) {
  return (
    <div className={styles.actions}>
      <CutCornerButton
        aria-label={`Read the ${project.title} case study`}
        href={project.caseStudyHref}
        variant={inverse ? 'gold' : 'navy'}
      >
        Case study <span aria-hidden="true">→</span>
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

function ProjectBody({
  featured = false,
  inverse = false,
  number,
  project,
}: {
  featured?: boolean
  inverse?: boolean
  number: number
  project: Project
}) {
  return (
    <div className={styles.projectBody}>
      <p className={styles.sequence}>
        <span>{String(number).padStart(2, '0')}</span>
        <span>{featured ? 'Keystone project' : 'Selected work'}</span>
      </p>
      <h2 id={`${project.slug}-mosaic-title`}>{project.title}</h2>
      <p className={styles.summary}>{project.summary}</p>
      <ProjectFacts project={project} />
      <ProjectServices project={project} />
      <ProjectActions inverse={inverse} project={project} />
    </div>
  )
}

function MosaicLoading() {
  return (
    <section
      aria-busy="true"
      aria-label="Loading modular project mosaic"
      className={`${styles.root} ${styles.stateRoot}`}
    >
      <div className={styles.stateHeader}>
        <span className={`${styles.skeleton} ${styles.skeletonEyebrow}`} />
        <span className={`${styles.skeleton} ${styles.skeletonHeading}`} />
        <span className={`${styles.skeleton} ${styles.skeletonIntro}`} />
      </div>
      <div aria-hidden="true" className={`${styles.mosaic} ${styles.loadingMosaic}`}>
        <span className={`${styles.skeletonTile} ${styles.skeletonFeatured}`} />
        <span className={`${styles.skeletonTile} ${styles.skeletonOne}`} />
        <span className={`${styles.skeletonTile} ${styles.skeletonTwo}`} />
        <span className={`${styles.skeletonTile} ${styles.skeletonThree}`} />
        <span className={`${styles.skeletonTile} ${styles.skeletonFour}`} />
        <span className={`${styles.skeletonTile} ${styles.skeletonFive}`} />
      </div>
      <div className={styles.loadingAction}>
        <CutCornerButton loading variant="navy">
          Loading projects
        </CutCornerButton>
      </div>
      <p className={styles.srOnly} role="status">Loading six selected projects…</p>
    </section>
  )
}

function MosaicEmpty() {
  return (
    <section
      aria-labelledby="modular-mosaic-empty-title"
      className={`${styles.root} ${styles.stateRoot} ${styles.empty}`}
    >
      <div aria-hidden="true" className={styles.emptySteps}>
        <span />
        <span />
        <span />
      </div>
      <div className={styles.emptyCopy}>
        <p className={styles.eyebrow}>Project field / 00</p>
        <h1 id="modular-mosaic-empty-title">The first block is ready to be placed.</h1>
        <p>No projects are available yet. Start a conversation and we can shape what comes next.</p>
        <CutCornerButton href="#contact" variant="navy">
          Start a project <span aria-hidden="true">→</span>
        </CutCornerButton>
      </div>
    </section>
  )
}

export function ModularMosaicDirection({
  projects: projectData = sharedProjects,
  state = 'ready',
}: ModularMosaicDirectionProps = {}) {
  const reduceMotion = useReducedMotion()

  if (state === 'loading') {
    return <MosaicLoading />
  }

  if (state === 'empty' || projectData.length === 0) {
    return <MosaicEmpty />
  }

  const [featured, ...supporting] = projectData.slice(0, 6)

  return (
    <section aria-labelledby="modular-mosaic-title" className={styles.root}>
      <header className={styles.header}>
        <div className={styles.headerIndex}>
          <span>Selected work</span>
          <span>06 / 06</span>
        </div>
        <h1 id="modular-mosaic-title">Built to hold weight.</h1>
        <p className={styles.intro}>
          Six digital systems assembled through strategy, design, and durable collaboration.
        </p>
      </header>

      <div className={styles.mosaic}>
        {featured ? (
          <motion.article
            aria-labelledby={`${featured.slug}-mosaic-title`}
            className={`${styles.tile} ${styles.featured}`}
            initial={reduceMotion ? false : { opacity: 0, y: 20 }}
            transition={{ duration: 0.62, ease: [0.32, 0.72, 0, 1] }}
            viewport={{ amount: 0.12, once: true }}
            whileInView={{ opacity: 1, y: 0 }}
          >
            <div className={styles.mediaFrame}>
              <ProjectMedia className={styles.projectImage} eager project={featured} />
            </div>
            <ProjectBody featured number={1} project={featured} />
          </motion.article>
        ) : null}

        {supporting.map((project, index) => {
          const inverse = index === 1 || index === 4

          return (
            <motion.article
              aria-labelledby={`${project.slug}-mosaic-title`}
              className={`${styles.tile} ${supportClasses[index] ?? styles.tileFive}`}
              initial={reduceMotion ? false : { opacity: 0, y: 16 }}
              key={project.slug}
              transition={{ delay: index * 0.045, duration: 0.56, ease: [0.32, 0.72, 0, 1] }}
              viewport={{ amount: 0.1, once: true }}
              whileInView={{ opacity: 1, y: 0 }}
            >
              <div className={styles.mediaFrame}>
                <ProjectMedia className={styles.projectImage} project={project} />
              </div>
              <ProjectBody inverse={inverse} number={index + 2} project={project} />
            </motion.article>
          )
        })}
      </div>

      <footer className={styles.footer}>
        <span>Six projects</span>
        <span aria-hidden="true">◆</span>
        <span>2023—2026</span>
      </footer>
    </section>
  )
}

export default ModularMosaicDirection
