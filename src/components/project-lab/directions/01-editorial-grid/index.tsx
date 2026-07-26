import { motion, useReducedMotion } from 'motion/react'

import { CutCornerButton } from '../../shared/CutCornerButton'
import { ProjectMedia } from '../../shared/ProjectMedia'
import { projects as sharedProjects } from '../../shared/projects'
import type { ProjectDirectionProps } from '../../shared/types'

import styles from './styles.module.css'

type Project = (typeof sharedProjects)[number]

export const metadata = {
  description:
    'A magazine-led grid that treats the featured project as a cover story and the archive as a deliberately uneven sequence of editorial modules.',
  id: '01-editorial-grid',
  name: 'Editorial Grid',
  skill: {
    name: 'high-end-visual-design',
    url: 'https://www.skills.sh/leonxlnx/taste-skill/high-end-visual-design',
  },
} as const

const moduleClasses = [
  styles.moduleOne,
  styles.moduleTwo,
  styles.moduleThree,
  styles.moduleFour,
  styles.moduleFive,
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

function ProjectTags({ project }: { project: Project }) {
  return (
    <ul aria-label={`Services for ${project.title}`} className={styles.tags}>
      {project.services.map((service) => (
        <li key={service}>{service}</li>
      ))}
    </ul>
  )
}

function ProjectActions({ project }: { project: Project }) {
  return (
    <div className={styles.actions}>
      <CutCornerButton
        aria-label={`Read the ${project.title} case study`}
        href={project.caseStudyHref}
        variant="navy"
      >
        Read case study <span aria-hidden="true">→</span>
      </CutCornerButton>
      {project.liveHref ? (
        <CutCornerButton
          aria-label={`Visit the live ${project.title} project`}
          href={project.liveHref}
          variant="quiet"
        >
          Visit live project <span aria-hidden="true">↗</span>
        </CutCornerButton>
      ) : null}
    </div>
  )
}

function LoadingIssue() {
  return (
    <section aria-busy="true" aria-label="Loading project stories" className={`${styles.root} ${styles.loading}`}>
      <div className={styles.loadingMasthead}>
        <span className={`${styles.skeleton} ${styles.skeletonKicker}`} />
        <span className={`${styles.skeleton} ${styles.skeletonHeadline}`} />
        <CutCornerButton loading variant="paper">
          Loading projects
        </CutCornerButton>
      </div>
      <p className={styles.srOnly}>Loading project stories…</p>
      <div aria-hidden="true" className={styles.loadingGrid}>
        <span className={`${styles.skeleton} ${styles.skeletonFeature}`} />
        {moduleClasses.map((className, index) => (
          <span className={`${styles.skeleton} ${styles.skeletonModule} ${className}`} key={index} />
        ))}
      </div>
    </section>
  )
}

function EmptyIssue() {
  return (
    <section aria-labelledby="editorial-empty-title" className={`${styles.root} ${styles.empty}`}>
      <div aria-hidden="true" className={styles.emptyMark}>
        <span>00</span>
        <span>PROJECT INDEX</span>
      </div>
      <div className={styles.emptyCopy}>
        <p className={styles.kicker}>Portfolio journal / awaiting stories</p>
        <h2 id="editorial-empty-title">The next issue is in production.</h2>
        <p>Projects will appear here as soon as the editorial desk has material to publish.</p>
        <CutCornerButton href="#contact" variant="navy">
          Start a conversation <span aria-hidden="true">→</span>
        </CutCornerButton>
      </div>
    </section>
  )
}

export function EditorialGridDirection({
  projects: projectData = sharedProjects,
  state = 'ready',
}: ProjectDirectionProps = { projects: sharedProjects }) {
  const reduceMotion = useReducedMotion()

  if (state === 'loading') {
    return <LoadingIssue />
  }

  if (state === 'empty' || projectData.length === 0) {
    return <EmptyIssue />
  }

  const [featured, ...supporting] = projectData.slice(0, 6)

  return (
    <section aria-labelledby="editorial-grid-title" className={styles.root}>
      <header className={styles.masthead}>
        <p className={styles.kicker}>Selected work / Volume 01</p>
        <p className={styles.issue}>Portfolio Journal<br />2023—2026</p>
        <h1 id="editorial-grid-title">
          <span>Work with</span>
          <span>weight &amp; rhythm.</span>
        </h1>
        <p className={styles.standfirst}>
          Six collaborations shaped through research, systems thinking, and careful digital craft.
        </p>
      </header>

      {featured ? (
        <motion.article
          aria-labelledby={`${featured.slug}-title`}
          className={styles.feature}
          initial={reduceMotion ? false : { opacity: 0, y: 28 }}
          transition={{ duration: 0.78, ease: [0.32, 0.72, 0, 1] }}
          viewport={{ amount: 0.15, once: true }}
          whileInView={{ opacity: 1, y: 0 }}
        >
          <p aria-hidden="true" className={styles.featureNumber}>01 / Cover story</p>
          <div className={styles.featureMedia}>
            <ProjectMedia eager className={styles.image} project={featured} />
          </div>
          <div className={styles.featureCopy}>
            <p className={styles.featureLabel}>Featured project</p>
            <h2 id={`${featured.slug}-title`}>{featured.title}</h2>
            <p className={styles.summary}>{featured.summary}</p>
            <ProjectFacts project={featured} />
            <ProjectTags project={featured} />
            <ProjectActions project={featured} />
          </div>
        </motion.article>
      ) : null}

      <div className={styles.supporting}>
        {supporting.map((project, index) => (
          <motion.article
            aria-labelledby={`${project.slug}-title`}
            className={`${styles.module} ${moduleClasses[index] ?? styles.moduleFive}`}
            initial={reduceMotion ? false : { opacity: 0, y: 36 }}
            key={project.slug}
            transition={{ delay: index * 0.045, duration: 0.72, ease: [0.32, 0.72, 0, 1] }}
            viewport={{ amount: 0.14, once: true }}
            whileInView={{ opacity: 1, y: 0 }}
          >
            <div className={styles.mediaFrame}>
              <ProjectMedia className={styles.image} project={project} />
            </div>
            <div className={styles.moduleCopy}>
              <p aria-hidden="true" className={styles.sequence}>0{index + 2}</p>
              <h2 id={`${project.slug}-title`}>{project.title}</h2>
              <p className={styles.summary}>{project.summary}</p>
              <ProjectFacts project={project} />
              <ProjectTags project={project} />
              <ProjectActions project={project} />
            </div>
          </motion.article>
        ))}
      </div>

      <footer className={styles.colophon}>
        <span>Six projects</span>
        <span>One working archive</span>
        <span>Built with intention</span>
      </footer>
    </section>
  )
}

export default EditorialGridDirection
