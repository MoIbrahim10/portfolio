import { AnimatePresence, motion, useReducedMotion } from 'motion/react'
import {
  type CSSProperties,
  type KeyboardEvent as ReactKeyboardEvent,
  type RefObject,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react'

import { AnimatedLogo } from '../../../brand/AnimatedLogo'
import { CutCornerButton } from '../../../project-lab/shared/CutCornerButton'
import {
  PORTFOLIO_BIO,
  PORTFOLIO_LINKS,
  PORTFOLIO_PROJECTS,
  type PortfolioMedia,
  type PortfolioProject,
} from '../../shared/portfolio-data'

import styles from './styles.module.css'

const EASE = [0.22, 1, 0.36, 1] as const
const MOBILE_QUERY = '(max-width: 759px)'

interface MediaFrameProps {
  eager?: boolean
  failedImages: Set<string>
  loadedImages: Set<string>
  media: PortfolioMedia
  onFailed: (src: string) => void
  onLoaded: (src: string) => void
}

function MediaFrame({
  eager = false,
  failedImages,
  loadedImages,
  media,
  onFailed,
  onLoaded,
}: MediaFrameProps) {
  const failed = failedImages.has(media.src)
  const loaded = loadedImages.has(media.src)

  return (
    <span
      aria-busy={!loaded && !failed}
      className={styles.mediaFrame}
      style={{ '--media-ratio': `${media.width} / ${media.height}` } as CSSProperties}
    >
      {!loaded && !failed ? (
        <span aria-hidden="true" className={styles.skeleton} />
      ) : null}
      {failed ? (
        <span className={styles.mediaError}>Preview unavailable.</span>
      ) : (
        <img
          alt={media.alt}
          className={loaded ? styles.imageLoaded : undefined}
          decoding="async"
          height={media.height}
          loading={eager ? 'eager' : 'lazy'}
          onError={() => onFailed(media.src)}
          onLoad={() => onLoaded(media.src)}
          src={media.src}
          width={media.width}
        />
      )}
    </span>
  )
}

interface CoverProps {
  active: boolean
  buttonRef: (node: HTMLButtonElement | null) => void
  failedImages: Set<string>
  index: number
  loadedImages: Set<string>
  onFailed: (src: string) => void
  onFocus: () => void
  onKeyDown: (event: ReactKeyboardEvent<HTMLButtonElement>) => void
  onLoaded: (src: string) => void
  onOpen: (trigger: HTMLButtonElement) => void
  project: PortfolioProject
  reducedMotion: boolean
  selected: boolean
}

function Cover({
  active,
  buttonRef,
  failedImages,
  index,
  loadedImages,
  onFailed,
  onFocus,
  onKeyDown,
  onLoaded,
  onOpen,
  project,
  reducedMotion,
  selected,
}: CoverProps) {
  const hero = project.media[0]
  const folio = String(index + 1).padStart(2, '0')

  return (
    <motion.article
      className={styles.coverArticle}
      layout={!reducedMotion}
      style={{ '--project-accent': project.accent } as CSSProperties}
    >
      <motion.button
        ref={buttonRef}
        aria-controls={`folded-spread-${project.id}`}
        aria-expanded={selected}
        aria-label={`Open ${project.title} project`}
        className={styles.cover}
        onClick={(event) => onOpen(event.currentTarget)}
        onFocus={onFocus}
        onKeyDown={onKeyDown}
        tabIndex={active ? 0 : -1}
        type="button"
        whileFocus={reducedMotion ? undefined : { rotate: 0.6, y: -4 }}
        whileHover={reducedMotion ? undefined : { rotate: 0.6, y: -4 }}
        whileTap={reducedMotion ? undefined : { scale: 0.992 }}
        transition={{ duration: reducedMotion ? 0 : 0.16, ease: EASE }}
      >
        <motion.span
          className={styles.coverMedia}
          layoutId={
            !reducedMotion && !selected ? `folded-cover-${project.id}` : undefined
          }
        >
          {hero ? (
            <MediaFrame
              eager={index === 0}
              failedImages={failedImages}
              loadedImages={loadedImages}
              media={hero}
              onFailed={onFailed}
              onLoaded={onLoaded}
            />
          ) : (
            <span className={styles.mediaError}>Preview unavailable.</span>
          )}
        </motion.span>
        <span className={styles.accentTab} aria-hidden="true" />
        <span className={styles.coverFooter}>
          <span className={styles.folio}>
            {folio} / {String(PORTFOLIO_PROJECTS.length).padStart(2, '0')}
          </span>
          <span className={styles.coverTitle}>{project.title}</span>
          <span className={styles.openCue} aria-hidden="true">
            Open ↗
          </span>
        </span>
      </motion.button>
    </motion.article>
  )
}

interface BoundSpreadProps {
  closeRef: RefObject<HTMLButtonElement | null>
  failedImages: Set<string>
  loadedImages: Set<string>
  mediaIndex: number
  onClose: () => void
  onFailed: (src: string) => void
  onLoaded: (src: string) => void
  onMediaChange: (index: number) => void
  project: PortfolioProject
  reducedMotion: boolean
}

function BoundSpread({
  closeRef,
  failedImages,
  loadedImages,
  mediaIndex,
  onClose,
  onFailed,
  onLoaded,
  onMediaChange,
  project,
  reducedMotion,
}: BoundSpreadProps) {
  const activeMedia = project.media[mediaIndex] ?? project.media[0]
  const primaryHref = project.liveHref ?? project.repositoryHref
  const secondaryHref =
    project.liveHref && project.repositoryHref ? project.repositoryHref : undefined

  return (
    <motion.section
      id={`folded-spread-${project.id}`}
      aria-labelledby={`folded-title-${project.id}`}
      className={styles.spread}
      initial={
        reducedMotion
          ? false
          : {
              opacity: 0,
              scale: 0.99,
            }
      }
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: reducedMotion ? 1 : 0.98 }}
      transition={{ duration: reducedMotion ? 0 : 0.3, ease: EASE }}
    >
      <div className={styles.leftPage}>
        <div className={styles.pageTopline}>
          <span className={styles.folio}>Folio {String(mediaIndex + 1).padStart(2, '0')}</span>
          <span className={styles.folio}>
            {mediaIndex + 1} of {project.media.length}
          </span>
        </div>

        {activeMedia ? (
          <motion.div
            className={styles.spreadHero}
            layoutId={
              !reducedMotion && mediaIndex === 0
                ? `folded-cover-${project.id}`
                : undefined
            }
          >
            <AnimatePresence initial={false} mode="wait">
              <motion.div
                key={activeMedia.src}
                className={styles.leaf}
                initial={
                  reducedMotion ? false : { opacity: 0, rotateY: 3 }
                }
                animate={{ opacity: 1, rotateY: 0 }}
                exit={{ opacity: 0, rotateY: reducedMotion ? 0 : -3 }}
                transition={{
                  duration: reducedMotion ? 0 : 0.18,
                  ease: EASE,
                }}
              >
                <MediaFrame
                  eager
                  failedImages={failedImages}
                  loadedImages={loadedImages}
                  media={activeMedia}
                  onFailed={onFailed}
                  onLoaded={onLoaded}
                />
              </motion.div>
            </AnimatePresence>
          </motion.div>
        ) : (
          <span className={styles.mediaError}>Preview unavailable.</span>
        )}

        {project.media.length > 1 ? (
          <nav
            aria-label={`${project.title} gallery`}
            className={styles.gallery}
          >
            {project.media.map((media, index) => (
              <button
                key={media.src}
                aria-current={index === mediaIndex ? 'true' : undefined}
                aria-label={`Show image ${index + 1} of ${project.media.length}: ${media.alt}`}
                className={styles.thumbnail}
                onClick={() => onMediaChange(index)}
                type="button"
              >
                <img
                  alt=""
                  decoding="async"
                  height={media.height}
                  loading="lazy"
                  src={media.src}
                  width={media.width}
                />
                <span>{String(index + 1).padStart(2, '0')}</span>
              </button>
            ))}
          </nav>
        ) : null}
      </div>

      <motion.div
        className={styles.rightPage}
        initial={reducedMotion ? false : { opacity: 0, scaleX: 0.96 }}
        animate={{ opacity: 1, scaleX: 1 }}
        transition={{
          delay: reducedMotion ? 0 : 0.06,
          duration: reducedMotion ? 0 : 0.3,
          ease: EASE,
        }}
      >
        <div className={styles.detailHeader}>
          <span className={styles.folio}>Selected project</span>
          <button
            ref={closeRef}
            className={styles.closeButton}
            onClick={onClose}
            type="button"
          >
            <span aria-hidden="true">×</span>
            Close project
          </button>
        </div>

        <motion.div
          className={styles.detailCopy}
          initial={reducedMotion ? false : { opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{
            delay: reducedMotion ? 0 : 0.1,
            duration: reducedMotion ? 0 : 0.2,
          }}
        >
          <h3 id={`folded-title-${project.id}`}>{project.title}</h3>
          <p>{project.description}</p>

          {project.collaborators.length > 0 ? (
            <section className={styles.collaborators} aria-labelledby={`folded-collaborators-${project.id}`}>
              <h4 id={`folded-collaborators-${project.id}`}>Collaborators</h4>
              <ul>
                {project.collaborators.map((collaborator) => (
                  <li key={collaborator}>{collaborator}</li>
                ))}
              </ul>
            </section>
          ) : null}

          {primaryHref ? (
            <div className={styles.detailActions}>
              <CutCornerButton href={primaryHref} variant="gold">
                {project.liveHref ? 'Visit live project' : 'View repository'}
              </CutCornerButton>
              {secondaryHref ? (
                <a className={styles.secondaryLink} href={secondaryHref}>
                  View repository <span aria-hidden="true">↗</span>
                </a>
              ) : null}
            </div>
          ) : null}
        </motion.div>

        <p className={styles.bindingNote}>Designed and built with care.</p>
      </motion.div>
    </motion.section>
  )
}

function useIndexColumns() {
  const [columns, setColumns] = useState(3)

  useEffect(() => {
    const query = window.matchMedia(MOBILE_QUERY)
    const update = () => setColumns(query.matches ? 1 : 3)
    update()
    query.addEventListener('change', update)
    return () => query.removeEventListener('change', update)
  }, [])

  return columns
}

export function PortfolioFoldedIndex() {
  const reducedMotion = Boolean(useReducedMotion())
  const columns = useIndexColumns()
  const [activeIndex, setActiveIndex] = useState(0)
  const [selectedProject, setSelectedProject] = useState<PortfolioProject>()
  const [selectedMedia, setSelectedMedia] = useState(0)
  const [announcement, setAnnouncement] = useState('')
  const [loadedImages, setLoadedImages] = useState<Set<string>>(() => new Set())
  const [failedImages, setFailedImages] = useState<Set<string>>(() => new Set())
  const coverRefs = useRef<Array<HTMLButtonElement | null>>([])
  const triggerRef = useRef<HTMLButtonElement | null>(null)
  const closeRef = useRef<HTMLButtonElement>(null)
  const scrollBeforeOpen = useRef(0)

  const rows = useMemo(() => {
    const result: PortfolioProject[][] = []
    for (let index = 0; index < PORTFOLIO_PROJECTS.length; index += columns) {
      result.push(PORTFOLIO_PROJECTS.slice(index, index + columns))
    }
    return result
  }, [columns])

  useEffect(() => {
    if (!selectedProject) return

    const focusFrame = requestAnimationFrame(() => closeRef.current?.focus())
    setAnnouncement(`${selectedProject.title} project opened.`)

    function closeOnEscape(event: KeyboardEvent) {
      if (event.key !== 'Escape') return
      event.preventDefault()
      closeProject()
    }

    document.addEventListener('keydown', closeOnEscape)
    return () => {
      cancelAnimationFrame(focusFrame)
      document.removeEventListener('keydown', closeOnEscape)
    }
  }, [selectedProject])

  useEffect(() => {
    if (!selectedProject || selectedProject.media.length < 2) return
    const nextIndex = (selectedMedia + 1) % selectedProject.media.length
    const nextMedia = selectedProject.media[nextIndex]
    if (!nextMedia) return
    const image = new Image()
    image.src = nextMedia.src
  }, [selectedMedia, selectedProject])

  function markLoaded(src: string) {
    setLoadedImages((current) => new Set(current).add(src))
  }

  function markFailed(src: string) {
    setFailedImages((current) => new Set(current).add(src))
  }

  function focusCover(index: number) {
    const boundedIndex = Math.max(
      0,
      Math.min(PORTFOLIO_PROJECTS.length - 1, index),
    )
    setActiveIndex(boundedIndex)
    coverRefs.current[boundedIndex]?.focus()
  }

  function onCoverKeyDown(
    event: ReactKeyboardEvent<HTMLButtonElement>,
    index: number,
  ) {
    let destination: number | undefined
    if (event.key === 'Home') destination = 0
    if (event.key === 'End') destination = PORTFOLIO_PROJECTS.length - 1
    if (event.key === 'ArrowLeft') destination = index - 1
    if (event.key === 'ArrowRight') destination = index + 1
    if (event.key === 'ArrowUp') destination = index - columns
    if (event.key === 'ArrowDown') destination = index + columns
    if (destination === undefined) return
    event.preventDefault()
    focusCover(destination)
  }

  function openProject(project: PortfolioProject, trigger: HTMLButtonElement) {
    if (!selectedProject) scrollBeforeOpen.current = window.scrollY
    triggerRef.current = trigger
    setSelectedMedia(0)
    setSelectedProject(project)
  }

  function closeProject() {
    const trigger = triggerRef.current
    setSelectedProject(undefined)
    setAnnouncement('Project closed.')
    window.setTimeout(
      () => {
        window.scrollTo({ behavior: 'auto', top: scrollBeforeOpen.current })
        trigger?.focus()
      },
      reducedMotion ? 0 : 310,
    )
  }

  function changeMedia(index: number) {
    if (!selectedProject || index === selectedMedia) return
    setSelectedMedia(index)
    setAnnouncement(
      `${selectedProject.title}, image ${index + 1} of ${selectedProject.media.length}.`,
    )
  }

  const currentYear = new Date().getFullYear()

  return (
    <div className={styles.page}>
      <header className={styles.masthead}>
        <a className={styles.logoLink} href="/" aria-label="Go to portfolio home">
          <AnimatedLogo animateOnMount={false} className={styles.logo} />
        </a>
        <nav aria-label="Portfolio links" className={styles.primaryNav}>
          <a href={PORTFOLIO_LINKS.x}>X</a>
          <a href={PORTFOLIO_LINKS.github}>GitHub</a>
          <CutCornerButton href={PORTFOLIO_LINKS.cal} variant="paper">
            Schedule
          </CutCornerButton>
        </nav>
      </header>

      <main>
        <section className={styles.hero} aria-labelledby="folded-page-title">
          <p className={styles.eyebrow}>Independent design engineer · Cairo</p>
          <h1 id="folded-page-title">Designed with care. Bound by detail.</h1>
          <p className={styles.bio}>{PORTFOLIO_BIO}</p>
          <CutCornerButton href={PORTFOLIO_LINKS.cal} variant="navy">
            Schedule a call
          </CutCornerButton>
        </section>

        <section className={styles.work} aria-labelledby="folded-work-title">
          <div className={styles.workHeader}>
            <h2 id="folded-work-title">Selected work</h2>
            <p>Choose a cover · Enter opens</p>
          </div>

          {PORTFOLIO_PROJECTS.length > 0 ? (
            <motion.div
              className={styles.index}
              initial={reducedMotion ? false : { opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: reducedMotion ? 0 : 0.24, ease: EASE }}
            >
              {rows.map((row) => {
                const rowSelected = row.find(
                  (project) => project.id === selectedProject?.id,
                )

                return (
                  <div className={styles.rowGroup} key={row[0]?.id}>
                    <motion.div className={styles.coverRow} layout={!reducedMotion}>
                      {row.map((project) => {
                        const index = PORTFOLIO_PROJECTS.findIndex(
                          (candidate) => candidate.id === project.id,
                        )
                        return (
                          <Cover
                            key={project.id}
                            active={activeIndex === index}
                            buttonRef={(node) => {
                              coverRefs.current[index] = node
                            }}
                            failedImages={failedImages}
                            index={index}
                            loadedImages={loadedImages}
                            onFailed={markFailed}
                            onFocus={() => setActiveIndex(index)}
                            onKeyDown={(event) => onCoverKeyDown(event, index)}
                            onLoaded={markLoaded}
                            onOpen={(trigger) => openProject(project, trigger)}
                            project={project}
                            reducedMotion={reducedMotion}
                            selected={selectedProject?.id === project.id}
                          />
                        )
                      })}
                    </motion.div>

                    <AnimatePresence initial={false}>
                      {rowSelected ? (
                        <BoundSpread
                          key={rowSelected.id}
                          closeRef={closeRef}
                          failedImages={failedImages}
                          loadedImages={loadedImages}
                          mediaIndex={selectedMedia}
                          onClose={closeProject}
                          onFailed={markFailed}
                          onLoaded={markLoaded}
                          onMediaChange={changeMedia}
                          project={rowSelected}
                          reducedMotion={reducedMotion}
                        />
                      ) : null}
                    </AnimatePresence>
                  </div>
                )
              })}
            </motion.div>
          ) : (
            <p className={styles.empty}>Projects are being prepared.</p>
          )}
        </section>

        <section className={styles.contact} aria-labelledby="folded-contact-title">
          <div>
            <p className={styles.eyebrow}>Have a project in mind?</p>
            <h2 id="folded-contact-title">
              Available for thoughtful product collaborations.
            </h2>
          </div>
          <nav aria-label="Contact links" className={styles.contactLinks}>
            <a href={PORTFOLIO_LINKS.x}>X</a>
            <a href={PORTFOLIO_LINKS.github}>GitHub</a>
            <CutCornerButton href={PORTFOLIO_LINKS.cal} variant="gold">
              Schedule
            </CutCornerButton>
          </nav>
        </section>
      </main>

      <footer className={styles.footer}>
        <a className={styles.footerLogoLink} href="/" aria-label="Go to portfolio home">
          <AnimatedLogo
            animateOnMount={false}
            className={styles.footerLogo}
            label="MO portfolio mark"
          />
        </a>
        <p>Mo Ibrahim · Design and code with care.</p>
        <p>{currentYear} · Cairo, Egypt</p>
        <a href="#folded-page-title">Back to start</a>
      </footer>

      <p className={styles.srOnly} aria-live="polite">
        {announcement}
      </p>
    </div>
  )
}
