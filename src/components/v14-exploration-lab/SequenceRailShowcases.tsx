import {
  type CSSProperties,
  type KeyboardEvent,
  type PointerEvent,
  type UIEvent,
  useEffect,
  useRef,
  useState,
} from 'react'
import {
  AnimatePresence,
  LayoutGroup,
  motion,
  useMotionValue,
  useReducedMotion,
  useSpring,
} from 'motion/react'

import {
  PORTFOLIO_PROJECTS,
  type PortfolioMedia,
  type PortfolioProject,
} from '#/components/portfolio-lab/shared/portfolio-data'

import styles from './SequenceRailShowcases.module.css'

export const SEQUENCE_DIRECTIONS = [
  {
    id: 'sequence-board',
    name: 'Sequence Procession',
    note: 'The selected board becomes a native horizontal route with three image-led chapters.',
  },
  {
    id: 'editorial-procession',
    name: 'Editorial Procession',
    note: 'Slim visual folios move as one continuous rail, with project notes kept behind a reveal.',
  },
  {
    id: 'folded-index',
    name: 'Folded Index',
    note: 'Three angled leaves trade space like a physical index instead of a standard accordion.',
  },
  {
    id: 'ambient-sequence',
    name: 'Ambient Sequence',
    note: 'Project color changes the material field while a compact sequence remains image-first.',
  },
  {
    id: 'gallery-drawer',
    name: 'Gallery Drawer',
    note: 'A dense contact board opens a calm, project-colored drawer only when requested.',
  },
  {
    id: 'layout-morph',
    name: 'Layout Morph',
    note: 'A small image board unfolds into its own larger case-study surface with shared geometry.',
  },
  {
    id: 'aperture-atlas',
    name: 'Aperture Atlas',
    note: 'Small cut apertures expand into a full visual atlas without losing the selected image.',
  },
  {
    id: 'magnetic-snapline',
    name: 'Magnetic Snapline',
    note: 'Fine-pointer cards lean toward attention, then settle exactly onto a scroll-snap line.',
  },
  {
    id: 'name-conveyor',
    name: 'Name Conveyor',
    note: 'Project names travel through a typographic gate while the image sequence changes in place.',
  },
  {
    id: 'living-blueprint',
    name: 'Living Blueprint',
    note: 'A stepped drafting index unfolds one visual plan through a more structural accordion.',
  },
] as const

export type SequenceDirectionId = (typeof SEQUENCE_DIRECTIONS)[number]['id']
type ChangeSource = 'keyboard' | 'pointer' | 'scroll'

interface ProjectGroup {
  accent: string
  background: string
  description: string
  foreground: string
  id: 'orgo' | 'good-invoice' | 'others'
  media: PortfolioMedia[]
  projects: PortfolioProject[]
  surface: string
  title: string
}

const projectById = (id: string) => {
  const project = PORTFOLIO_PROJECTS.find((item) => item.id === id)
  if (!project) throw new Error(`Missing portfolio project: ${id}`)
  return project
}

const orgo = projectById('orgo')
const goodInvoice = projectById('good-invoice')
const others = [
  projectById('glazed'),
  projectById('calm-ai-studio'),
  projectById('stepper'),
]

const GROUPS: ProjectGroup[] = [
  {
    accent: orgo.accent,
    background: '#211631',
    description: orgo.description,
    foreground: '#fff8ef',
    id: 'orgo',
    media: orgo.media,
    projects: [orgo],
    surface: '#342047',
    title: 'Orgo',
  },
  {
    accent: goodInvoice.accent,
    background: '#eee5d8',
    description: goodInvoice.description,
    foreground: '#102b43',
    id: 'good-invoice',
    media: [
      goodInvoice.media[0],
      goodInvoice.media[0],
      goodInvoice.media[0],
    ],
    projects: [goodInvoice],
    surface: '#fffaf0',
    title: 'The Good Invoice',
  },
  {
    accent: '#77a7ff',
    background: '#dce7f0',
    description: 'Three smaller experiments in calm AI, visual craft, and tactile progress.',
    foreground: '#102b43',
    id: 'others',
    media: others.map((project) => project.media[0]),
    projects: others,
    surface: '#f8f3e9',
    title: 'Others',
  },
]

const EASE = [0.22, 1, 0.36, 1] as const
const SPRING = { bounce: 0, duration: 0.46, type: 'spring' } as const

function groupStyle(group: ProjectGroup) {
  return {
    '--group-accent': group.accent,
    '--group-background': group.background,
    '--group-foreground': group.foreground,
    '--group-surface': group.surface,
  } as CSSProperties
}

function MediaImage({
  crop = true,
  eager = false,
  media,
  position,
}: {
  crop?: boolean
  eager?: boolean
  media: PortfolioMedia
  position?: string
}) {
  return (
    <img
      alt={media.alt}
      className={crop ? styles.cropImage : styles.containImage}
      decoding="async"
      fetchPriority={eager ? 'high' : 'auto'}
      height={media.height}
      loading={eager ? 'eager' : 'lazy'}
      src={media.src}
      style={position ? { objectPosition: position } : undefined}
      width={media.width}
    />
  )
}

function GroupMosaic({
  eager = false,
  group,
  label = true,
}: {
  eager?: boolean
  group: ProjectGroup
  label?: boolean
}) {
  return (
    <div className={styles.mosaic}>
      {group.media.slice(0, 3).map((media, index) => (
        <figure key={`${group.id}-${media.src}-${index}`}>
          <MediaImage
            eager={eager && index === 0}
            media={media}
            position={
              group.id === 'good-invoice'
                ? index === 0
                  ? '72% center'
                  : index === 1
                    ? '18% center'
                    : 'center'
                : undefined
            }
          />
          {label ? (
            <figcaption>
              {group.id === 'others'
                ? group.projects[index]?.title
                : index === 0
                  ? 'Overview'
                  : `Detail ${index}`}
            </figcaption>
          ) : null}
        </figure>
      ))}
    </div>
  )
}

function ProjectLinks({ group }: { group: ProjectGroup }) {
  return (
    <div className={styles.projectLinks}>
      {group.projects.map((project) => {
        const href = project.liveHref ?? project.repositoryHref
        if (!href) return <span key={project.id}>{project.title} — soon</span>

        return (
          <a href={href} key={project.id} rel="noreferrer" target="_blank">
            {project.title} <span aria-hidden="true">↗</span>
          </a>
        )
      })}
    </div>
  )
}

function GroupDetails({
  className,
  group,
  onClose,
}: {
  className?: string
  group: ProjectGroup
  onClose?: () => void
}) {
  return (
    <aside
      aria-label={`${group.title} project details`}
      className={className ? `${styles.details} ${className}` : styles.details}
      style={groupStyle(group)}
    >
      <div>
        <p>Project notes</p>
        <h3>{group.title}</h3>
      </div>
      <p>{group.description}</p>
      <ProjectLinks group={group} />
      {onClose ? (
        <button aria-label="Close project details" onClick={onClose} type="button">
          Close
        </button>
      ) : null}
    </aside>
  )
}

function GroupTabs({
  activeIndex,
  className,
  onSelect,
}: {
  activeIndex: number
  className?: string
  onSelect: (index: number, source: ChangeSource) => void
}) {
  return (
    <nav
      aria-label="Choose a project group"
      className={className ? `${styles.groupTabs} ${className}` : styles.groupTabs}
    >
      {GROUPS.map((group, index) => (
        <button
          aria-pressed={activeIndex === index}
          key={group.id}
          onClick={(event) =>
            onSelect(index, event.detail === 0 ? 'keyboard' : 'pointer')
          }
          type="button"
        >
          <span aria-hidden="true" style={{ background: group.accent }} />
          {group.title}
        </button>
      ))}
    </nav>
  )
}

function useGroupSelection(initialIndex = 0) {
  const [activeIndex, setActiveIndex] = useState(initialIndex)
  const [source, setSource] = useState<ChangeSource>('pointer')
  const [detailsOpen, setDetailsOpen] = useState(false)

  function select(index: number, nextSource: ChangeSource) {
    setSource(nextSource)
    setActiveIndex(Math.max(0, Math.min(GROUPS.length - 1, index)))
    setDetailsOpen(false)
  }

  return {
    activeIndex,
    detailsOpen,
    group: GROUPS[activeIndex],
    select,
    setDetailsOpen,
    source,
  }
}

function railDestination(key: string, current: number) {
  if (key === 'ArrowRight') return Math.min(current + 1, GROUPS.length - 1)
  if (key === 'ArrowLeft') return Math.max(current - 1, 0)
  if (key === 'Home') return 0
  if (key === 'End') return GROUPS.length - 1
  return null
}

function SequenceProcession() {
  const { activeIndex, detailsOpen, select, setDetailsOpen } =
    useGroupSelection()
  const viewportRef = useRef<HTMLDivElement>(null)
  const slideRefs = useRef<Array<HTMLLIElement | null>>([])
  const frameRef = useRef<number | null>(null)
  const reducedMotion = useReducedMotion()

  function goTo(index: number, source: ChangeSource) {
    select(index, source)
    const slide = slideRefs.current[index]
    if (!slide) return
    viewportRef.current?.scrollTo({
      behavior: reducedMotion || source === 'keyboard' ? 'auto' : 'smooth',
      left: slide.offsetLeft,
    })
  }

  function onScroll(event: UIEvent<HTMLDivElement>) {
    if (frameRef.current !== null) cancelAnimationFrame(frameRef.current)
    const viewport = event.currentTarget
    frameRef.current = requestAnimationFrame(() => {
      const center = viewport.scrollLeft + viewport.clientWidth / 2
      let nearest = activeIndex
      let distance = Number.POSITIVE_INFINITY
      slideRefs.current.forEach((slide, index) => {
        if (!slide) return
        const nextDistance = Math.abs(
          slide.offsetLeft + slide.offsetWidth / 2 - center,
        )
        if (nextDistance < distance) {
          nearest = index
          distance = nextDistance
        }
      })
      if (nearest !== activeIndex) select(nearest, 'scroll')
      frameRef.current = null
    })
  }

  function onKeyDown(event: KeyboardEvent<HTMLDivElement>) {
    if (event.target !== event.currentTarget) return
    const destination = railDestination(event.key, activeIndex)
    if (destination === null) return
    event.preventDefault()
    goTo(destination, 'keyboard')
  }

  return (
    <section className={styles.sequenceProcession}>
      <header className={styles.sequenceHeader}>
        <div>
          <p>Selected work / three chapters</p>
          <h2>Sequence Procession</h2>
        </div>
        <GroupTabs activeIndex={activeIndex} onSelect={goTo} />
      </header>

      <div
        aria-label="Project sequence. Scroll horizontally or use arrow keys."
        className={styles.sequenceViewport}
        onKeyDown={onKeyDown}
        onScroll={onScroll}
        ref={viewportRef}
        role="region"
        tabIndex={0}
      >
        <ol className={styles.sequenceTrack}>
          {GROUPS.map((item, index) => (
            <li
              className={styles.sequenceStop}
              key={item.id}
              ref={(node) => {
                slideRefs.current[index] = node
              }}
            >
              <article style={groupStyle(item)}>
                <div className={styles.sequenceMeta}>
                  <span>{item.title}</span>
                  <button
                    aria-expanded={activeIndex === index && detailsOpen}
                    onClick={() => {
                      select(index, 'pointer')
                      setDetailsOpen(activeIndex === index ? !detailsOpen : true)
                    }}
                    type="button"
                  >
                    {activeIndex === index && detailsOpen
                      ? 'Hide details'
                      : 'Project details'}
                  </button>
                </div>
                <GroupMosaic eager={index === 0} group={item} />
                <AnimatePresence initial={false}>
                  {activeIndex === index && detailsOpen ? (
                    <motion.div
                      animate={{ opacity: 1, y: 0 }}
                      className={styles.sequenceDetail}
                      exit={{ opacity: 0, y: 8 }}
                      initial={
                        reducedMotion ? false : { opacity: 0, y: 10 }
                      }
                      transition={{
                        duration: reducedMotion ? 0 : 0.28,
                        ease: EASE,
                      }}
                    >
                      <p>{item.description}</p>
                      <ProjectLinks group={item} />
                    </motion.div>
                  ) : null}
                </AnimatePresence>
              </article>
            </li>
          ))}
        </ol>
      </div>
    </section>
  )
}

function EditorialProcession() {
  const { activeIndex, detailsOpen, group, select, setDetailsOpen, source } =
    useGroupSelection()
  const reducedMotion = useReducedMotion()

  return (
    <section className={styles.editorialProcession} style={groupStyle(group)}>
      <header>
        <p>Images first.</p>
        <h2>Details on demand.</h2>
        <span>Drag the folios or choose a title.</span>
      </header>
      <div className={styles.editorialRail}>
        {GROUPS.map((item, index) => (
          <motion.article
            aria-label={item.title}
            className={styles.editorialFolio}
            data-active={activeIndex === index}
            key={item.id}
            onViewportEnter={() => select(index, 'scroll')}
            style={groupStyle(item)}
            transition={{ duration: reducedMotion ? 0 : 0.28, ease: EASE }}
            viewport={{ amount: 0.65 }}
            whileHover={reducedMotion ? undefined : { y: -5 }}
          >
            <button
              aria-expanded={activeIndex === index && detailsOpen}
              onClick={(event) => {
                select(
                  index,
                  event.detail === 0 ? 'keyboard' : 'pointer',
                )
                setDetailsOpen(activeIndex === index ? !detailsOpen : true)
              }}
              type="button"
            >
              <span>{item.title}</span>
              <span>Open folio</span>
            </button>
            <GroupMosaic eager={index === 0} group={item} label={false} />
          </motion.article>
        ))}
      </div>
      <AnimatePresence initial={false} mode="wait">
        {detailsOpen ? (
          <motion.div
            animate={{ clipPath: 'inset(0 0 0 0)', opacity: 1 }}
            className={styles.editorialNotes}
            exit={{ clipPath: 'inset(100% 0 0 0)', opacity: 0 }}
            initial={
              reducedMotion || source === 'keyboard'
                ? false
                : { clipPath: 'inset(100% 0 0 0)', opacity: 0 }
            }
            key={group.id}
            transition={{ duration: reducedMotion ? 0 : 0.36, ease: EASE }}
          >
            <GroupDetails group={group} />
          </motion.div>
        ) : null}
      </AnimatePresence>
    </section>
  )
}

function FoldedIndex() {
  const { activeIndex, detailsOpen, group, select, setDetailsOpen, source } =
    useGroupSelection()
  const reducedMotion = useReducedMotion()

  return (
    <LayoutGroup id="folded-project-index">
      <section className={styles.foldedIndex} style={groupStyle(group)}>
        <header>
          <p>Folded project index</p>
          <span>Open one leaf. Keep the others in reach.</span>
        </header>
        <div className={styles.foldedLeaves}>
          {GROUPS.map((item, index) => {
            const active = index === activeIndex
            return (
              <motion.article
                className={styles.foldedLeaf}
                data-active={active}
                key={item.id}
                layout={reducedMotion || source === 'keyboard' ? false : 'position'}
                style={groupStyle(item)}
                transition={
                  reducedMotion || source === 'keyboard'
                    ? { duration: 0 }
                    : SPRING
                }
              >
                <button
                  aria-expanded={active && detailsOpen}
                  onClick={(event) => {
                    select(
                      index,
                      event.detail === 0 ? 'keyboard' : 'pointer',
                    )
                    setDetailsOpen(active ? !detailsOpen : true)
                  }}
                  type="button"
                >
                  <span>{item.title}</span>
                  <span>{active ? 'Fold / unfold' : 'Open leaf'}</span>
                </button>
                <div className={styles.foldedMedia}>
                  <GroupMosaic eager={index === 0} group={item} label={false} />
                </div>
                {active ? (
                  <div className={styles.foldedCopy}>
                    <p>{item.description}</p>
                    {detailsOpen ? <ProjectLinks group={item} /> : null}
                  </div>
                ) : null}
              </motion.article>
            )
          })}
        </div>
      </section>
    </LayoutGroup>
  )
}

function AmbientSequence() {
  const { activeIndex, detailsOpen, group, select, setDetailsOpen, source } =
    useGroupSelection()
  const reducedMotion = useReducedMotion()
  const motionOff = reducedMotion || source === 'keyboard'

  return (
    <section className={styles.ambientSequence} style={groupStyle(group)}>
      <AnimatePresence initial={false} mode="sync">
        <motion.div
          animate={{ opacity: 1, scale: 1 }}
          aria-hidden="true"
          className={styles.ambientField}
          exit={{ opacity: 0 }}
          initial={motionOff ? false : { opacity: 0, scale: 1.025 }}
          key={group.id}
          style={groupStyle(group)}
          transition={{ duration: motionOff ? 0 : 0.46, ease: EASE }}
        />
      </AnimatePresence>
      <header>
        <div>
          <p>Ambient sequence</p>
          <h2>{group.title}</h2>
        </div>
        <GroupTabs activeIndex={activeIndex} onSelect={select} />
      </header>
      <AnimatePresence initial={false} mode="wait">
        <motion.article
          animate={{ filter: 'blur(0px)', opacity: 1, y: 0 }}
          className={styles.ambientBoard}
          exit={{ filter: 'blur(4px)', opacity: 0, y: -6 }}
          initial={
            motionOff
              ? false
              : { filter: 'blur(5px)', opacity: 0, y: 12 }
          }
          key={group.id}
          transition={{ duration: motionOff ? 0 : 0.42, ease: EASE }}
        >
          <GroupMosaic eager group={group} />
          <button
            aria-expanded={detailsOpen}
            className={styles.detailsButton}
            onClick={() => setDetailsOpen(!detailsOpen)}
            type="button"
          >
            {detailsOpen ? 'Close notes' : 'View project notes'}
          </button>
        </motion.article>
      </AnimatePresence>
      <AnimatePresence initial={false}>
        {detailsOpen ? (
          <motion.div
            animate={{ opacity: 1, x: 0 }}
            className={styles.ambientNotes}
            exit={{ opacity: 0, x: 16 }}
            initial={motionOff ? false : { opacity: 0, x: 18 }}
            transition={{ duration: motionOff ? 0 : 0.3, ease: EASE }}
          >
            <GroupDetails group={group} />
          </motion.div>
        ) : null}
      </AnimatePresence>
    </section>
  )
}

function GalleryDrawer() {
  const { activeIndex, group, select, source } = useGroupSelection()
  const [drawerOpen, setDrawerOpen] = useState(false)
  const reducedMotion = useReducedMotion()
  const motionOff = reducedMotion || source === 'keyboard'

  function choose(index: number, nextSource: ChangeSource) {
    select(index, nextSource)
    setDrawerOpen(false)
  }

  return (
    <section className={styles.galleryDrawer} style={groupStyle(group)}>
      <AnimatePresence initial={false}>
        <motion.div
          animate={{ opacity: 1 }}
          aria-hidden="true"
          className={styles.drawerBackground}
          exit={{ opacity: 0 }}
          initial={motionOff ? false : { opacity: 0 }}
          key={group.id}
          style={groupStyle(group)}
          transition={{ duration: motionOff ? 0 : 0.34 }}
        />
      </AnimatePresence>
      <header>
        <div>
          <p>Visual archive</p>
          <h2>{group.title}</h2>
        </div>
        <GroupTabs activeIndex={activeIndex} onSelect={choose} />
      </header>
      <button
        aria-expanded={drawerOpen}
        aria-label={`Open ${group.title} gallery details`}
        className={styles.drawerBoard}
        onClick={(event) => {
          if (event.detail === 0) select(activeIndex, 'keyboard')
          setDrawerOpen(true)
        }}
        type="button"
      >
        <GroupMosaic eager group={group} />
        <span>Open project drawer</span>
      </button>
      <AnimatePresence initial={false}>
        {drawerOpen ? (
          <motion.div
            animate={{ opacity: 1, y: 0 }}
            className={styles.drawerSheet}
            exit={{ opacity: 0, y: '100%' }}
            initial={motionOff ? false : { opacity: 0, y: '100%' }}
            transition={{ duration: motionOff ? 0 : 0.46, ease: EASE }}
          >
            <GroupDetails group={group} onClose={() => setDrawerOpen(false)} />
          </motion.div>
        ) : null}
      </AnimatePresence>
    </section>
  )
}

function LayoutMorph() {
  const [selected, setSelected] = useState<number | null>(null)
  const [source, setSource] = useState<ChangeSource>('pointer')
  const dialogRef = useRef<HTMLElement>(null)
  const openerRef = useRef<HTMLButtonElement | null>(null)
  const reducedMotion = useReducedMotion()
  const active = selected === null ? null : GROUPS[selected]
  const transition =
    reducedMotion || source === 'keyboard'
      ? { duration: 0 }
      : { damping: 31, mass: 0.85, stiffness: 285, type: 'spring' as const }

  useEffect(() => {
    if (selected === null) return
    const opener = openerRef.current
    const frame = requestAnimationFrame(() => {
      dialogRef.current?.querySelector<HTMLButtonElement>('button')?.focus()
    })
    const closeOnEscape = (event: globalThis.KeyboardEvent) => {
      if (event.key === 'Escape') setSelected(null)
    }
    document.addEventListener('keydown', closeOnEscape)

    return () => {
      cancelAnimationFrame(frame)
      document.removeEventListener('keydown', closeOnEscape)
      requestAnimationFrame(() => opener?.focus())
    }
  }, [selected])

  return (
    <LayoutGroup id="sequence-layout-morph">
      <section className={styles.layoutMorph}>
        <header>
          <p>Selected work</p>
          <h2>Choose an image board.</h2>
        </header>
        <div className={styles.morphRail}>
          {GROUPS.map((group, index) => (
            <article key={group.id} style={groupStyle(group)}>
              <button
                aria-haspopup="dialog"
                aria-label={`Open ${group.title} project`}
                onClick={(event) => {
                  openerRef.current = event.currentTarget
                  setSource(event.detail === 0 ? 'keyboard' : 'pointer')
                  setSelected(index)
                }}
                type="button"
              >
                <motion.div
                  className={styles.morphImage}
                  layoutId={`morph-${group.id}`}
                  transition={transition}
                >
                  <MediaImage eager={index === 0} media={group.media[0]} />
                </motion.div>
                <span>{group.title}</span>
              </button>
            </article>
          ))}
        </div>
        <AnimatePresence initial={false}>
          {active ? (
            <motion.article
              animate={{ opacity: 1 }}
              aria-label={`${active.title} project details`}
              aria-modal="true"
              className={styles.morphSheet}
              exit={{ opacity: 0 }}
              initial={reducedMotion || source === 'keyboard' ? false : { opacity: 0 }}
              key={active.id}
              ref={dialogRef}
              role="dialog"
              style={groupStyle(active)}
              transition={{ duration: reducedMotion ? 0 : 0.2 }}
            >
              <motion.div
                className={styles.morphExpanded}
                layoutId={`morph-${active.id}`}
                transition={transition}
              >
                <GroupMosaic eager group={active} label={false} />
              </motion.div>
              <GroupDetails group={active} onClose={() => setSelected(null)} />
            </motion.article>
          ) : null}
        </AnimatePresence>
      </section>
    </LayoutGroup>
  )
}

function ApertureAtlas() {
  const { activeIndex, group, select, source } = useGroupSelection()
  const [open, setOpen] = useState(false)
  const reducedMotion = useReducedMotion()
  const motionOff = reducedMotion || source === 'keyboard'

  return (
    <section className={styles.apertureAtlas} style={groupStyle(group)}>
      <header>
        <p>Aperture atlas</p>
        <h2>Look closer.</h2>
      </header>
      <div className={styles.apertureRail}>
        {GROUPS.map((item, index) => (
          <button
            aria-expanded={open && index === activeIndex}
            aria-label={`Open ${item.title} atlas`}
            className={styles.apertureButton}
            data-active={index === activeIndex}
            key={item.id}
            onClick={(event) => {
              select(index, event.detail === 0 ? 'keyboard' : 'pointer')
              setOpen(index === activeIndex ? !open : true)
            }}
            style={groupStyle(item)}
            type="button"
          >
            <MediaImage eager={index === 0} media={item.media[0]} />
            <span>{item.title}</span>
          </button>
        ))}
      </div>
      <AnimatePresence initial={false} mode="wait">
        {open ? (
          <motion.article
            animate={{ clipPath: 'inset(0% 0% 0% 0%)', opacity: 1 }}
            className={styles.aperturePanel}
            exit={{ clipPath: 'inset(48% 48% 48% 48%)', opacity: 0 }}
            initial={
              motionOff
                ? false
                : { clipPath: 'inset(48% 48% 48% 48%)', opacity: 0 }
            }
            key={group.id}
            style={groupStyle(group)}
            transition={{ duration: motionOff ? 0 : 0.52, ease: EASE }}
          >
            <GroupMosaic eager group={group} label={false} />
            <GroupDetails group={group} onClose={() => setOpen(false)} />
          </motion.article>
        ) : (
          <p className={styles.apertureHint}>Choose an aperture to expand its visual sequence.</p>
        )}
      </AnimatePresence>
    </section>
  )
}

function MagneticCard({
  active,
  group,
  index,
  onSelect,
}: {
  active: boolean
  group: ProjectGroup
  index: number
  onSelect: (index: number, source: ChangeSource) => void
}) {
  const reducedMotion = useReducedMotion()
  const rawX = useMotionValue(0)
  const rawY = useMotionValue(0)
  const x = useSpring(rawX, { damping: 34, mass: 0.4, stiffness: 420 })
  const y = useSpring(rawY, { damping: 34, mass: 0.4, stiffness: 420 })

  function reset() {
    rawX.set(0)
    rawY.set(0)
  }

  function onPointerMove(event: PointerEvent<HTMLButtonElement>) {
    if (
      reducedMotion ||
      event.pointerType !== 'mouse' ||
      !window.matchMedia('(hover: hover) and (pointer: fine)').matches
    ) {
      return
    }
    const bounds = event.currentTarget.getBoundingClientRect()
    rawX.set(((event.clientX - bounds.left) / bounds.width - 0.5) * 10)
    rawY.set(((event.clientY - bounds.top) / bounds.height - 0.5) * 7)
  }

  return (
    <article className={styles.magneticCard} style={groupStyle(group)}>
      <button
        aria-pressed={active}
        onBlur={reset}
        onClick={(event) =>
          onSelect(index, event.detail === 0 ? 'keyboard' : 'pointer')
        }
        onPointerCancel={reset}
        onPointerLeave={reset}
        onPointerMove={onPointerMove}
        type="button"
      >
        <motion.span className={styles.magneticPlane} style={{ x, y }}>
          <GroupMosaic eager={index === 0} group={group} label={false} />
          <span>{group.title}</span>
        </motion.span>
      </button>
    </article>
  )
}

function MagneticSnapline() {
  const { activeIndex, detailsOpen, group, select, setDetailsOpen, source } =
    useGroupSelection()
  const reducedMotion = useReducedMotion()

  return (
    <section className={styles.magneticSnapline} style={groupStyle(group)}>
      <header>
        <p>Magnetic snapline</p>
        <h2>Three works. One precise rail.</h2>
      </header>
      <div className={styles.magneticRail}>
        {GROUPS.map((item, index) => (
          <MagneticCard
            active={index === activeIndex}
            group={item}
            index={index}
            key={item.id}
            onSelect={(nextIndex, nextSource) => {
              select(nextIndex, nextSource)
              setDetailsOpen(nextIndex === activeIndex ? !detailsOpen : true)
            }}
          />
        ))}
      </div>
      <AnimatePresence initial={false} mode="wait">
        {detailsOpen ? (
          <motion.div
            animate={{ opacity: 1, y: 0 }}
            className={styles.magneticDetails}
            exit={{ opacity: 0, y: 8 }}
            initial={
              reducedMotion || source === 'keyboard'
                ? false
                : { opacity: 0, y: 10 }
            }
            key={group.id}
            transition={{ duration: reducedMotion ? 0 : 0.3, ease: EASE }}
          >
            <GroupDetails group={group} />
          </motion.div>
        ) : (
          <p className={styles.magneticHint}>Move over a board, then open it.</p>
        )}
      </AnimatePresence>
    </section>
  )
}

function NameConveyor() {
  const { activeIndex, detailsOpen, group, select, setDetailsOpen, source } =
    useGroupSelection()
  const reducedMotion = useReducedMotion()
  const motionOff = reducedMotion || source === 'keyboard'

  return (
    <section className={styles.nameConveyor} style={groupStyle(group)}>
      <header>
        <p>Project conveyor</p>
        <GroupTabs activeIndex={activeIndex} onSelect={select} />
      </header>
      <div className={styles.conveyorGate} aria-live="polite">
        <AnimatePresence initial={false} mode="popLayout">
          <motion.h2
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -36 }}
            initial={motionOff ? false : { opacity: 0, y: 36 }}
            key={group.id}
            transition={{ duration: motionOff ? 0 : 0.38, ease: EASE }}
          >
            {group.title}
          </motion.h2>
        </AnimatePresence>
        <span aria-hidden="true">→</span>
      </div>
      <AnimatePresence initial={false} mode="wait">
        <motion.article
          animate={{ opacity: 1, x: 0 }}
          className={styles.conveyorBoard}
          exit={{ opacity: 0, x: -20 }}
          initial={motionOff ? false : { opacity: 0, x: 24 }}
          key={group.id}
          transition={{ duration: motionOff ? 0 : 0.4, ease: EASE }}
        >
          <GroupMosaic eager group={group} />
          <button
            aria-expanded={detailsOpen}
            className={styles.detailsButton}
            onClick={() => setDetailsOpen(!detailsOpen)}
            type="button"
          >
            {detailsOpen ? 'Close details' : 'Project details'}
          </button>
        </motion.article>
      </AnimatePresence>
      <AnimatePresence initial={false}>
        {detailsOpen ? (
          <motion.div
            animate={{ opacity: 1, y: 0 }}
            className={styles.conveyorDetails}
            exit={{ opacity: 0, y: 12 }}
            initial={motionOff ? false : { opacity: 0, y: 14 }}
            transition={{ duration: motionOff ? 0 : 0.3, ease: EASE }}
          >
            <GroupDetails group={group} />
          </motion.div>
        ) : null}
      </AnimatePresence>
    </section>
  )
}

function LivingBlueprint() {
  const { activeIndex, detailsOpen, group, select, setDetailsOpen, source } =
    useGroupSelection()
  const reducedMotion = useReducedMotion()
  const motionOff = reducedMotion || source === 'keyboard'

  return (
    <section className={styles.livingBlueprint}>
      <header>
        <div>
          <p>Project plans</p>
          <h2>Living Blueprint</h2>
        </div>
        <span>Open a sheet to expose its working layers.</span>
      </header>
      <div className={styles.blueprintIndex}>
        {GROUPS.map((item, index) => {
          const active = activeIndex === index
          return (
            <article
              className={styles.blueprintTab}
              data-active={active}
              key={item.id}
              style={groupStyle(item)}
            >
              <button
                aria-expanded={active && detailsOpen}
                onClick={(event) => {
                  select(
                    index,
                    event.detail === 0 ? 'keyboard' : 'pointer',
                  )
                  setDetailsOpen(active ? !detailsOpen : true)
                }}
                type="button"
              >
                <span>{item.title}</span>
                <span>{active && detailsOpen ? 'Close plan' : 'Unfold plan'}</span>
              </button>
              <MediaImage eager={index === 0} media={item.media[0]} />
            </article>
          )
        })}
      </div>
      <AnimatePresence initial={false} mode="wait">
        {detailsOpen ? (
          <motion.article
            animate={{ clipPath: 'inset(0 0 0 0)', opacity: 1 }}
            className={styles.blueprintPlan}
            exit={{ clipPath: 'inset(0 0 100% 0)', opacity: 0 }}
            initial={
              motionOff
                ? false
                : { clipPath: 'inset(0 0 100% 0)', opacity: 0 }
            }
            key={group.id}
            style={groupStyle(group)}
            transition={{ duration: motionOff ? 0 : 0.44, ease: EASE }}
          >
            <div className={styles.blueprintMedia}>
              <GroupMosaic eager group={group} label={false} />
            </div>
            <GroupDetails group={group} />
          </motion.article>
        ) : (
          <div className={styles.blueprintClosed}>
            <span aria-hidden="true" />
            <p>Select a project sheet to unfold the visual plan.</p>
          </div>
        )}
      </AnimatePresence>
    </section>
  )
}

export function SequenceRailShowcases({
  concept,
}: {
  concept: SequenceDirectionId
}) {
  switch (concept) {
    case 'sequence-board':
      return <SequenceProcession />
    case 'editorial-procession':
      return <EditorialProcession />
    case 'folded-index':
      return <FoldedIndex />
    case 'ambient-sequence':
      return <AmbientSequence />
    case 'gallery-drawer':
      return <GalleryDrawer />
    case 'layout-morph':
      return <LayoutMorph />
    case 'aperture-atlas':
      return <ApertureAtlas />
    case 'magnetic-snapline':
      return <MagneticSnapline />
    case 'name-conveyor':
      return <NameConveyor />
    case 'living-blueprint':
      return <LivingBlueprint />
  }
}
