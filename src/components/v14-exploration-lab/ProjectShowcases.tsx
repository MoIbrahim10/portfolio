import { AnimatePresence, motion, useReducedMotion } from 'motion/react'
import { useState } from 'react'

import {
  PORTFOLIO_PROJECTS,
  type PortfolioProject,
} from '#/components/portfolio-lab/shared/portfolio-data'

import styles from './ProjectShowcases.module.css'

export const SHOWCASE_DIRECTIONS = [
  {
    id: 'focus-frame',
    name: 'Focus Frame',
    note: 'One generous project stage with image selectors and concise context.',
  },
  {
    id: 'cut-rail',
    name: 'Cut Rail',
    note: 'A tactile horizontal sequence that gives every project room to breathe.',
  },
  {
    id: 'project-field',
    name: 'Project Field',
    note: 'A composed visual index that reveals the full range at once.',
  },
  {
    id: 'signal-index',
    name: 'Signal Index',
    note: 'A cinematic project image controlled by a quiet typographic index.',
  },
] as const

export type ShowcaseId = (typeof SHOWCASE_DIRECTIONS)[number]['id']

function projectHref(project: PortfolioProject) {
  return project.liveHref ?? project.repositoryHref
}

function ProjectImage({
  eager = false,
  project,
}: {
  eager?: boolean
  project: PortfolioProject
}) {
  const media = project.media[0]

  return (
    <img
      alt={media.alt}
      className={styles.projectImage}
      decoding="async"
      fetchPriority={eager ? 'high' : 'auto'}
      height={media.height}
      loading={eager ? 'eager' : 'lazy'}
      src={media.src}
      width={media.width}
    />
  )
}

function ProjectLink({
  className,
  project,
}: {
  className?: string
  project: PortfolioProject
}) {
  const href = projectHref(project)

  if (!href) {
    return <span className={className}>Case study soon</span>
  }

  return (
    <a
      className={className}
      href={href}
      rel="noreferrer"
      target="_blank"
    >
      View project <span aria-hidden="true">↗</span>
    </a>
  )
}

function DirectionHeader({
  kicker,
  title,
}: {
  kicker: string
  title: string
}) {
  return (
    <header className={styles.directionHeader}>
      <p>{kicker}</p>
      <h2>{title}</h2>
    </header>
  )
}

function FocusFrame() {
  const [activeIndex, setActiveIndex] = useState(0)
  const [instant, setInstant] = useState(false)
  const reducedMotion = useReducedMotion()
  const project = PORTFOLIO_PROJECTS[activeIndex]

  return (
    <section aria-label="Focus Frame project showcase" className={styles.focusFrame}>
      <DirectionHeader kicker="Selected work" title={project.title} />

      <div
        aria-labelledby={`focus-tab-${project.id}`}
        className={styles.focusVisual}
        id="focus-project-panel"
        role="tabpanel"
      >
        <AnimatePresence initial={false} mode="wait">
          <motion.div
            animate={{ filter: 'blur(0px)', opacity: 1, x: 0 }}
            className={styles.focusImage}
            exit={{ filter: 'blur(3px)', opacity: 0, x: -8 }}
            initial={
              instant || reducedMotion
                ? false
                : { filter: 'blur(4px)', opacity: 0, x: 18 }
            }
            key={project.id}
            transition={{
              bounce: 0,
              duration: instant || reducedMotion ? 0 : 0.44,
              type: 'spring',
            }}
          >
            <ProjectImage eager={activeIndex === 0} project={project} />
          </motion.div>
        </AnimatePresence>
      </div>

      <div className={styles.focusCaption}>
        <p>{project.description}</p>
        <ProjectLink className={styles.projectLink} project={project} />
      </div>

      <div
        aria-label="Choose a project"
        className={styles.focusTabs}
        role="tablist"
      >
        {PORTFOLIO_PROJECTS.map((item, index) => (
          <button
            aria-controls="focus-project-panel"
            aria-label={`Show ${item.title}`}
            aria-selected={activeIndex === index}
            id={`focus-tab-${item.id}`}
            key={item.id}
            onClick={(event) => {
              setInstant(event.detail === 0)
              setActiveIndex(index)
            }}
            role="tab"
            type="button"
          >
            <img
              alt=""
              aria-hidden="true"
              height={item.media[0].height}
              loading="lazy"
              src={item.media[0].src}
              width={item.media[0].width}
            />
            <span style={{ backgroundColor: item.accent }} />
          </button>
        ))}
      </div>
    </section>
  )
}

function CutRail() {
  return (
    <section aria-label="Cut Rail project showcase" className={styles.cutRail}>
      <div className={styles.railHeader}>
        <DirectionHeader kicker="Selected work" title="Drag the work" />
        <p>Swipe, scroll, or tab through.</p>
      </div>

      <div className={styles.railTrack}>
        {PORTFOLIO_PROJECTS.map((project, index) => (
          <article className={styles.railCard} key={project.id}>
            <div className={styles.railImage}>
              <ProjectImage eager={index === 0} project={project} />
            </div>
            <div className={styles.railCardCopy}>
              <div>
                <span style={{ backgroundColor: project.accent }} />
                <h2>{project.title}</h2>
              </div>
              <ProjectLink className={styles.projectLink} project={project} />
            </div>
          </article>
        ))}
      </div>

      <p className={styles.railFooter}>The next project always stays within reach.</p>
    </section>
  )
}

function ProjectField() {
  return (
    <section
      aria-label="Project Field visual project index"
      className={styles.projectField}
    >
      <DirectionHeader kicker="The work, at once" title="Project field" />

      <div className={styles.mosaicGrid}>
        {PORTFOLIO_PROJECTS.map((project, index) => (
          <article className={styles.mosaicCard} key={project.id}>
            <ProjectImage eager={index === 0} project={project} />
            <div className={styles.mosaicCopy}>
              <h2>{project.title}</h2>
              <ProjectLink className={styles.mosaicLink} project={project} />
            </div>
          </article>
        ))}
      </div>
    </section>
  )
}

function SignalIndex() {
  const [activeIndex, setActiveIndex] = useState(0)
  const [instant, setInstant] = useState(false)
  const reducedMotion = useReducedMotion()
  const project = PORTFOLIO_PROJECTS[activeIndex]

  function select(index: number, immediate: boolean) {
    setInstant(immediate)
    setActiveIndex(index)
  }

  return (
    <section aria-label="Signal Index project showcase" className={styles.signalIndex}>
      <AnimatePresence initial={false} mode="wait">
        <motion.div
          animate={{ filter: 'blur(0px)', opacity: 1, scale: 1 }}
          className={styles.cinemaVisual}
          exit={{ filter: 'blur(3px)', opacity: 0, scale: 1.005 }}
          initial={
            instant || reducedMotion
              ? false
              : { filter: 'blur(5px)', opacity: 0, scale: 1.018 }
          }
          key={project.id}
          transition={{
            bounce: 0,
            duration: instant || reducedMotion ? 0 : 0.48,
            type: 'spring',
          }}
        >
          <ProjectImage eager={activeIndex === 0} project={project} />
        </motion.div>
      </AnimatePresence>

      <div className={styles.cinemaChrome}>
        <div>
          <p className={styles.cinemaKicker}>Selected work</p>
          <nav aria-label="Choose a project" className={styles.cinemaNav}>
            {PORTFOLIO_PROJECTS.map((item, index) => (
              <button
                aria-pressed={activeIndex === index}
                key={item.id}
                onClick={(event) => select(index, event.detail === 0)}
                onFocus={(event) => {
                  if (!event.currentTarget.matches(':hover')) select(index, true)
                }}
                onPointerEnter={() => select(index, false)}
                type="button"
              >
                <span style={{ backgroundColor: item.accent }} />
                {item.title}
              </button>
            ))}
          </nav>
        </div>

        <div className={styles.cinemaInfo}>
          <h2>{project.title}</h2>
          <p>{project.description}</p>
          <ProjectLink className={styles.cinemaLink} project={project} />
        </div>
      </div>
    </section>
  )
}

export function ProjectShowcases({ concept }: { concept: ShowcaseId }) {
  switch (concept) {
    case 'focus-frame':
      return <FocusFrame />
    case 'cut-rail':
      return <CutRail />
    case 'project-field':
      return <ProjectField />
    case 'signal-index':
      return <SignalIndex />
  }
}
