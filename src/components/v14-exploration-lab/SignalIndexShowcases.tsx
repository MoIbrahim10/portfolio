import { AnimatePresence, motion, useReducedMotion } from 'motion/react'
import { useState } from 'react'

import {
  PORTFOLIO_PROJECTS,
  type PortfolioMedia,
  type PortfolioProject,
} from '#/components/portfolio-lab/shared/portfolio-data'

import styles from './SignalIndexShowcases.module.css'

export const SIGNAL_DIRECTIONS = [
  {
    id: 'signal-index',
    name: 'Open Signal',
    note: 'A medium project window surrounded by three visible neighboring works.',
  },
  {
    id: 'dual-channel',
    name: 'Dual Channel',
    note: 'Two projects share equal weight while a compact index controls the pair.',
  },
  {
    id: 'contact-index',
    name: 'Contact Index',
    note: 'All six projects appear together as a clean, image-led contact sheet.',
  },
  {
    id: 'band-archive',
    name: 'Band Archive',
    note: 'Six horizontal project crops read like an active visual contents page.',
  },
  {
    id: 'editorial-ledger',
    name: 'Editorial Ledger',
    note: 'A typographic ledger drives one medium view and two supporting previews.',
  },
  {
    id: 'open-rail',
    name: 'Open Rail',
    note: 'A borderless horizontal sequence keeps two and a half projects in view.',
  },
  {
    id: 'quadrant-signal',
    name: 'Quadrant Signal',
    note: 'Four simultaneous project windows create a controlled visual instrument.',
  },
  {
    id: 'proof-fan',
    name: 'Proof Fan',
    note: 'Three outlined project proofs overlap without shadows or heavy framing.',
  },
  {
    id: 'edge-index',
    name: 'Edge Index',
    note: 'A centered project view is flanked by the complete visual index.',
  },
  {
    id: 'sequence-board',
    name: 'Sequence Board',
    note: 'Multiple images from one project read as a concise visual case-study beat.',
  },
] as const

export type SignalDirectionId = (typeof SIGNAL_DIRECTIONS)[number]['id']

function projectHref(project: PortfolioProject) {
  return project.liveHref ?? project.repositoryHref
}

function MediaImage({
  crop = false,
  eager = false,
  media,
}: {
  crop?: boolean
  eager?: boolean
  media: PortfolioMedia
}) {
  return (
    <img
      alt={media.alt}
      className={crop ? `${styles.image} ${styles.crop}` : styles.image}
      decoding="async"
      fetchPriority={eager ? 'high' : 'auto'}
      height={media.height}
      loading={eager ? 'eager' : 'lazy'}
      src={media.src}
      width={media.width}
    />
  )
}

function ProjectImage({
  crop = false,
  eager = false,
  project,
}: {
  crop?: boolean
  eager?: boolean
  project: PortfolioProject
}) {
  return <MediaImage crop={crop} eager={eager} media={project.media[0]} />
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

function PanelHeading({
  eyebrow,
  title,
}: {
  eyebrow: string
  title: string
}) {
  return (
    <header className={styles.panelHeading}>
      <p>{eyebrow}</p>
      <h2>{title}</h2>
    </header>
  )
}

function useProjectSelection(initialIndex = 0) {
  const [activeIndex, setActiveIndex] = useState(initialIndex)
  const [instant, setInstant] = useState(false)

  function select(index: number, immediate: boolean) {
    setInstant(immediate)
    setActiveIndex(index)
  }

  return {
    activeIndex,
    instant,
    project: PORTFOLIO_PROJECTS[activeIndex],
    select,
  }
}

function ProjectIndex({
  activeIndex,
  className,
  onSelect,
}: {
  activeIndex: number
  className?: string
  onSelect: (index: number, immediate: boolean) => void
}) {
  return (
    <nav
      aria-label="Choose a project"
      className={className ? `${styles.projectIndex} ${className}` : styles.projectIndex}
    >
      {PORTFOLIO_PROJECTS.map((project, index) => (
        <button
          aria-pressed={activeIndex === index}
          key={project.id}
          onClick={(event) => onSelect(index, event.detail === 0)}
          onFocus={(event) => {
            if (!event.currentTarget.matches(':hover')) onSelect(index, true)
          }}
          onPointerEnter={() => onSelect(index, false)}
          type="button"
        >
          <span style={{ backgroundColor: project.accent }} />
          {project.title}
        </button>
      ))}
    </nav>
  )
}

function ChangingProject({
  crop = false,
  eager = false,
  immediate,
  project,
}: {
  crop?: boolean
  eager?: boolean
  immediate: boolean
  project: PortfolioProject
}) {
  const reducedMotion = useReducedMotion()

  return (
    <AnimatePresence initial={false} mode="wait">
      <motion.div
        animate={{ filter: 'blur(0px)', opacity: 1, x: 0 }}
        className={styles.changingProject}
        exit={{ filter: 'blur(3px)', opacity: 0, x: -6 }}
        initial={
          immediate || reducedMotion
            ? false
            : { filter: 'blur(4px)', opacity: 0, x: 12 }
        }
        key={project.id}
        transition={{
          bounce: 0,
          duration: immediate || reducedMotion ? 0 : 0.42,
          type: 'spring',
        }}
      >
        <ProjectImage crop={crop} eager={eager} project={project} />
      </motion.div>
    </AnimatePresence>
  )
}

function OpenSignal() {
  const { activeIndex, instant, project, select } = useProjectSelection()
  const neighbors = [1, 2, 3].map(
    (offset) => PORTFOLIO_PROJECTS[(activeIndex + offset) % PORTFOLIO_PROJECTS.length],
  )

  return (
    <section aria-label="Open Signal project showcase" className={styles.openSignal}>
      <div className={styles.openSignalTop}>
        <PanelHeading eyebrow="Selected work" title={project.title} />
        <ProjectLink className={styles.projectLink} project={project} />
      </div>

      <div className={styles.openSignalBody}>
        <div className={styles.openSignalMain}>
          <ChangingProject eager immediate={instant} project={project} />
        </div>
        <div className={styles.openSignalNeighbors}>
          {neighbors.map((item) => (
            <button
              aria-label={`Show ${item.title}`}
              key={item.id}
              onClick={(event) =>
                select(PORTFOLIO_PROJECTS.indexOf(item), event.detail === 0)
              }
              type="button"
            >
              <ProjectImage crop project={item} />
              <span>{item.title}</span>
            </button>
          ))}
        </div>
      </div>

      <ProjectIndex
        activeIndex={activeIndex}
        className={styles.openSignalIndex}
        onSelect={select}
      />
    </section>
  )
}

function DualChannel() {
  const { activeIndex, select } = useProjectSelection()
  const first = PORTFOLIO_PROJECTS[activeIndex]
  const second =
    PORTFOLIO_PROJECTS[(activeIndex + 1) % PORTFOLIO_PROJECTS.length]

  return (
    <section aria-label="Dual Channel project showcase" className={styles.dualChannel}>
      <PanelHeading eyebrow="Two signals" title="Side by side" />
      <div className={styles.dualWindows}>
        {[first, second].map((project, index) => (
          <article className={styles.dualWindow} key={project.id}>
            <ProjectImage eager={index === 0} project={project} />
            <div>
              <h2>{project.title}</h2>
              <ProjectLink className={styles.projectLink} project={project} />
            </div>
          </article>
        ))}
      </div>
      <ProjectIndex
        activeIndex={activeIndex}
        className={styles.dualIndex}
        onSelect={select}
      />
    </section>
  )
}

function ContactIndex() {
  return (
    <section aria-label="Contact Index project showcase" className={styles.contactIndex}>
      <PanelHeading eyebrow="Everything visible" title="Contact index" />
      <div className={styles.contactGrid}>
        {PORTFOLIO_PROJECTS.map((project, index) => (
          <article className={styles.contactTile} key={project.id}>
            <ProjectImage eager={index === 0} project={project} />
            <div>
              <h2>{project.title}</h2>
              <ProjectLink className={styles.projectLink} project={project} />
            </div>
          </article>
        ))}
      </div>
    </section>
  )
}

function BandArchive() {
  return (
    <section aria-label="Band Archive project showcase" className={styles.bandArchive}>
      <PanelHeading eyebrow="Visual contents" title="Band archive" />
      <div className={styles.bandList}>
        {PORTFOLIO_PROJECTS.map((project, index) => (
          <article className={styles.band} key={project.id}>
            <h2>{project.title}</h2>
            <div>
              <ProjectImage crop eager={index === 0} project={project} />
            </div>
            <ProjectLink className={styles.bandLink} project={project} />
          </article>
        ))}
      </div>
    </section>
  )
}

function EditorialLedger() {
  const { activeIndex, instant, project, select } = useProjectSelection()
  const supporting = [1, 2].map(
    (offset) => PORTFOLIO_PROJECTS[(activeIndex + offset) % PORTFOLIO_PROJECTS.length],
  )

  return (
    <section
      aria-label="Editorial Ledger project showcase"
      className={styles.editorialLedger}
    >
      <div className={styles.ledgerSidebar}>
        <PanelHeading eyebrow="Selected work" title="Editorial ledger" />
        <ProjectIndex activeIndex={activeIndex} onSelect={select} />
      </div>
      <div className={styles.ledgerVisuals}>
        <div className={styles.ledgerMain}>
          <ChangingProject eager immediate={instant} project={project} />
        </div>
        <div className={styles.ledgerSupport}>
          {supporting.map((item) => (
            <article key={item.id}>
              <ProjectImage crop project={item} />
              <span>{item.title}</span>
            </article>
          ))}
        </div>
        <div className={styles.ledgerCaption}>
          <p>{project.description}</p>
          <ProjectLink className={styles.projectLink} project={project} />
        </div>
      </div>
    </section>
  )
}

function OpenRail() {
  return (
    <section aria-label="Open Rail project showcase" className={styles.openRail}>
      <div className={styles.openRailHeading}>
        <PanelHeading eyebrow="Swipe the archive" title="Open rail" />
        <p>More than one project stays visible.</p>
      </div>
      <div className={styles.openRailTrack}>
        {PORTFOLIO_PROJECTS.map((project, index) => (
          <article className={styles.openRailItem} key={project.id}>
            <ProjectImage eager={index === 0} project={project} />
            <div>
              <h2>{project.title}</h2>
              <ProjectLink className={styles.projectLink} project={project} />
            </div>
          </article>
        ))}
      </div>
    </section>
  )
}

function QuadrantSignal() {
  const { activeIndex, select } = useProjectSelection()
  const visible = [0, 1, 2, 3].map(
    (offset) => PORTFOLIO_PROJECTS[(activeIndex + offset) % PORTFOLIO_PROJECTS.length],
  )

  return (
    <section
      aria-label="Quadrant Signal project showcase"
      className={styles.quadrantSignal}
    >
      <div className={styles.quadrantTop}>
        <PanelHeading eyebrow="Four live windows" title="Quadrant signal" />
        <ProjectIndex activeIndex={activeIndex} onSelect={select} />
      </div>
      <div className={styles.quadrantGrid}>
        {visible.map((project, index) => (
          <article className={styles.quadrantWindow} key={project.id}>
            <ProjectImage crop={index !== 0} eager={index === 0} project={project} />
            <div>
              <h2>{project.title}</h2>
              <ProjectLink className={styles.projectLink} project={project} />
            </div>
          </article>
        ))}
      </div>
    </section>
  )
}

function ProofFan() {
  const { activeIndex, select } = useProjectSelection()
  const proofs = [2, 1, 0].map(
    (offset) => PORTFOLIO_PROJECTS[(activeIndex + offset) % PORTFOLIO_PROJECTS.length],
  )

  return (
    <section aria-label="Proof Fan project showcase" className={styles.proofFan}>
      <div className={styles.proofTop}>
        <PanelHeading eyebrow="Three proofs open" title="Proof fan" />
        <ProjectIndex activeIndex={activeIndex} onSelect={select} />
      </div>
      <div className={styles.proofStage}>
        {proofs.map((project, index) => (
          <article className={styles.proof} data-slot={index} key={project.id}>
            <ProjectImage eager={index === 2} project={project} />
            <div>
              <h2>{project.title}</h2>
              <ProjectLink className={styles.projectLink} project={project} />
            </div>
          </article>
        ))}
      </div>
    </section>
  )
}

function EdgeIndex() {
  const { activeIndex, instant, project, select } = useProjectSelection()
  const left = PORTFOLIO_PROJECTS.slice(0, 3)
  const right = PORTFOLIO_PROJECTS.slice(3)

  function edgeButton(item: PortfolioProject) {
    const index = PORTFOLIO_PROJECTS.indexOf(item)

    return (
      <button
        aria-label={`Show ${item.title}`}
        aria-pressed={activeIndex === index}
        key={item.id}
        onClick={(event) => select(index, event.detail === 0)}
        onFocus={(event) => {
          if (!event.currentTarget.matches(':hover')) select(index, true)
        }}
        onPointerEnter={() => select(index, false)}
        type="button"
      >
        <ProjectImage crop project={item} />
        <span>{item.title}</span>
      </button>
    )
  }

  return (
    <section aria-label="Edge Index project showcase" className={styles.edgeIndex}>
      <div className={styles.edgeRail}>{left.map(edgeButton)}</div>
      <div className={styles.edgeCenter}>
        <PanelHeading eyebrow="Complete visual index" title={project.title} />
        <div className={styles.edgeMain}>
          <ChangingProject eager immediate={instant} project={project} />
        </div>
        <ProjectLink className={styles.projectLink} project={project} />
      </div>
      <div className={styles.edgeRail}>{right.map(edgeButton)}</div>
    </section>
  )
}

function SequenceBoard() {
  const { activeIndex, instant, project, select } = useProjectSelection()
  const fallbackMedia = PORTFOLIO_PROJECTS.flatMap((item) => item.media)
  const frames = [...project.media, ...fallbackMedia]
    .filter(
      (media, index, collection) =>
        collection.findIndex((item) => item.src === media.src) === index,
    )
    .slice(0, 3)
  const reducedMotion = useReducedMotion()

  return (
    <section
      aria-label="Sequence Board project showcase"
      className={styles.sequenceBoard}
    >
      <div className={styles.sequenceTop}>
        <PanelHeading eyebrow="A project in three beats" title={project.title} />
        <ProjectLink className={styles.projectLink} project={project} />
      </div>
      <AnimatePresence initial={false} mode="wait">
        <motion.div
          animate={{ filter: 'blur(0px)', opacity: 1, y: 0 }}
          className={styles.sequenceFrames}
          exit={{ filter: 'blur(3px)', opacity: 0, y: -5 }}
          initial={
            instant || reducedMotion
              ? false
              : { filter: 'blur(4px)', opacity: 0, y: 10 }
          }
          key={project.id}
          transition={{
            bounce: 0,
            duration: instant || reducedMotion ? 0 : 0.44,
            type: 'spring',
          }}
        >
          {frames.map((media, index) => (
            <figure key={media.src}>
              <MediaImage crop={index !== 0} eager={index === 0} media={media} />
            </figure>
          ))}
        </motion.div>
      </AnimatePresence>
      <ProjectIndex
        activeIndex={activeIndex}
        className={styles.sequenceIndex}
        onSelect={select}
      />
    </section>
  )
}

export function SignalIndexShowcases({
  concept,
}: {
  concept: SignalDirectionId
}) {
  switch (concept) {
    case 'signal-index':
      return <OpenSignal />
    case 'dual-channel':
      return <DualChannel />
    case 'contact-index':
      return <ContactIndex />
    case 'band-archive':
      return <BandArchive />
    case 'editorial-ledger':
      return <EditorialLedger />
    case 'open-rail':
      return <OpenRail />
    case 'quadrant-signal':
      return <QuadrantSignal />
    case 'proof-fan':
      return <ProofFan />
    case 'edge-index':
      return <EdgeIndex />
    case 'sequence-board':
      return <SequenceBoard />
  }
}
