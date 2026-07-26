import { motion, useReducedMotion } from 'motion/react'

import { CutCornerButton } from '../../shared/CutCornerButton'
import { ProjectMedia } from '../../shared/ProjectMedia'
import { projects as sharedProjects } from '../../shared/projects'
import type { PortfolioProject } from '../../shared/projects'
import type { ProjectDirectionMetadata, ProjectDirectionProps } from '../../shared/types'

import styles from './styles.module.css'

export const metadata = {
  description:
    'A tactile project deck with one foreground plane and five offset sheets that disclose complete project records in reading order.',
  id: '08-dimensional-stack',
  name: 'Dimensional Stack',
  skill: {
    name: 'design-motion-principles',
    url: 'https://www.skills.sh/kylezantos/design-motion-principles/design-motion-principles',
  },
} satisfies ProjectDirectionMetadata

type DimensionalStackDirectionProps = Omit<ProjectDirectionProps, 'projects'> & {
  projects?: ProjectDirectionProps['projects']
}

const layerClasses = [
  styles.layerOne,
  styles.layerTwo,
  styles.layerThree,
  styles.layerFour,
  styles.layerFive,
] as const

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

function ProjectServices({ project }: { project: PortfolioProject }) {
  return (
    <div className={styles.serviceBlock}>
      <p>Services / tags</p>
      <ul aria-label={`Services for ${project.title}`} className={styles.services} role="list">
        {project.services.map((service) => <li key={service}>{service}</li>)}
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

function ProjectDetails({ project }: { project: PortfolioProject }) {
  return (
    <div className={styles.projectDetails}>
      <p className={styles.summary}>{project.summary}</p>
      <ProjectFacts project={project} />
      <ProjectServices project={project} />
      <ProjectActions project={project} />
    </div>
  )
}

function StackLoading() {
  return (
    <section
      aria-busy="true"
      aria-label="Loading dimensional project stack"
      className={`${styles.root} ${styles.stateRoot}`}
    >
      <div aria-hidden="true" className={styles.loadingHeader}>
        <span className={`${styles.skeleton} ${styles.skeletonKicker}`} />
        <span className={`${styles.skeleton} ${styles.skeletonTitle}`} />
        <span className={`${styles.skeleton} ${styles.skeletonIntro}`} />
      </div>
      <div aria-hidden="true" className={styles.loadingDeck}>
        <span className={`${styles.skeleton} ${styles.skeletonMedia}`} />
        <span className={`${styles.skeleton} ${styles.skeletonBody}`} />
      </div>
      <div aria-hidden="true" className={styles.loadingSheets}>
        {Array.from({ length: 5 }, (_, index) => <span key={index} />)}
      </div>
      <CutCornerButton loading variant="navy">Loading projects</CutCornerButton>
      <p className={styles.srOnly} role="status">Loading six selected projects…</p>
    </section>
  )
}

function StackEmpty() {
  return (
    <section
      aria-labelledby="dimensional-stack-empty-title"
      className={`${styles.root} ${styles.stateRoot} ${styles.empty}`}
    >
      <div aria-hidden="true" className={styles.emptyDeck}>
        <span /><span /><span />
      </div>
      <div className={styles.emptyCopy}>
        <p className={styles.eyebrow}>Project stack / 00 planes</p>
        <h1 id="dimensional-stack-empty-title">Space is held for the first layer.</h1>
        <p>No projects are available yet. Begin a conversation and we can build the stack together.</p>
        <CutCornerButton href="#contact" variant="navy">
          Start a project <span aria-hidden="true">→</span>
        </CutCornerButton>
      </div>
    </section>
  )
}

export function DimensionalStackDirection({
  projects: projectList = sharedProjects,
  state = 'ready',
}: DimensionalStackDirectionProps = {}) {
  const reduceMotion = useReducedMotion()

  if (state === 'loading') return <StackLoading />
  if (state === 'empty' || projectList.length === 0) return <StackEmpty />

  const [featured, ...supporting] = projectList.slice(0, 6)

  if (!featured) return <StackEmpty />

  return (
    <section aria-labelledby="dimensional-stack-title" className={styles.root}>
      <header className={styles.header}>
        <div className={styles.headerIndex}>
          <span>Selected work</span>
          <span>Direction 08 / six planes</span>
        </div>
        <div className={styles.headerCopy}>
          <h1 id="dimensional-stack-title">Work with dimension.</h1>
          <p>One project in the foreground. Five more held close, ready to unfold in order.</p>
        </div>
      </header>

      <div className={styles.featureStage}>
        <motion.article
          aria-labelledby={`dimensional-title-${featured.slug}`}
          className={styles.featuredPlane}
          initial={reduceMotion ? false : { filter: 'blur(3px)', opacity: 0, y: 12 }}
          transition={{ duration: reduceMotion ? 0 : 0.44, ease: [0.22, 1, 0.36, 1] }}
          viewport={{ amount: 0.16, once: true }}
          whileInView={{ filter: 'blur(0px)', opacity: 1, y: 0 }}
        >
          <div className={styles.featureMedia}>
            <div className={styles.planeLabel}>
              <span>Front plane / 01</span>
              <span>{featured.year}</span>
            </div>
            <figure>
              <ProjectMedia className={styles.projectImage} eager project={featured} />
              <figcaption>Primary view / {featured.title}</figcaption>
            </figure>
          </div>

          <div className={styles.featureBody}>
            <p className={styles.eyebrow}>Featured project</p>
            <h2 id={`dimensional-title-${featured.slug}`}>{featured.title}</h2>
            <ProjectDetails project={featured} />
          </div>
        </motion.article>
      </div>

      <section aria-labelledby="supporting-stack-title" className={styles.supportingSection}>
        <div className={styles.sectionHeading}>
          <div>
            <p className={styles.eyebrow}>Supporting planes / 02—06</p>
            <h2 id="supporting-stack-title">Lift a layer.</h2>
          </div>
          <p>Each sheet opens in place, preserving a direct top-to-bottom reading path.</p>
        </div>

        <div className={styles.sheetStack}>
          {supporting.map((project, index) => {
            const number = String(index + 2).padStart(2, '0')

            return (
              <motion.article
                aria-labelledby={`dimensional-title-${project.slug}`}
                className={styles.sheetArticle}
                initial={reduceMotion ? false : { filter: 'blur(2px)', opacity: 0, y: 8 }}
                key={project.slug}
                transition={{
                  delay: reduceMotion ? 0 : Math.min(index * 0.035, 0.14),
                  duration: reduceMotion ? 0 : 0.32,
                  ease: [0.22, 1, 0.36, 1],
                }}
                viewport={{ amount: 0.18, once: true }}
                whileInView={{ filter: 'blur(0px)', opacity: 1, y: 0 }}
              >
                <details className={`${styles.sheet} ${layerClasses[index] ?? styles.layerFive}`}>
                  <summary>
                    <span className={styles.sheetNumber}>Plane {number}</span>
                    <h3 id={`dimensional-title-${project.slug}`}>{project.title}</h3>
                    <span className={styles.sheetRole}>{project.role}</span>
                    <time dateTime={project.year}>{project.year}</time>
                    <span aria-hidden="true" className={styles.disclosure}>
                      <span>+</span><span>−</span>
                    </span>
                  </summary>

                  <div className={styles.sheetBody}>
                    <figure className={styles.sheetMedia}>
                      <ProjectMedia className={styles.projectImage} project={project} />
                      <figcaption>Project view / {project.title}</figcaption>
                    </figure>
                    <ProjectDetails project={project} />
                  </div>
                </details>
              </motion.article>
            )
          })}
        </div>
      </section>

      <footer className={styles.footer}>
        <span>01 foreground</span>
        <span aria-hidden="true">◇</span>
        <span>{String(supporting.length).padStart(2, '0')} supporting layers</span>
      </footer>
    </section>
  )
}

export default DimensionalStackDirection
