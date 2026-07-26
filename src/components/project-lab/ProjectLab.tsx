import { type ComponentType, useEffect, useState } from 'react'
import { MotionConfig } from 'motion/react'

import { AnimatedLogo } from '#/components/brand/AnimatedLogo'
import {
  EditorialGridDirection,
  metadata as editorialGridMetadata,
} from './directions/01-editorial-grid'
import {
  MuseumCatalogDirection,
  metadata as museumCatalogMetadata,
} from './directions/02-museum-catalog'
import {
  SplitScreenDirection,
  splitScreenMetadata,
} from './directions/03-split-screen'
import {
  HorizontalRailDirection,
  horizontalRailMetadata,
} from './directions/04-horizontal-rail'
import {
  TimelineArchiveDirection,
  metadata as timelineArchiveMetadata,
} from './directions/05-timeline-archive'
import {
  ModularMosaicDirection,
  metadata as modularMosaicMetadata,
} from './directions/06-modular-mosaic'
import {
  ProjectDossierDirection,
  metadata as projectDossierMetadata,
} from './directions/07-project-dossier'
import {
  DimensionalStackDirection,
  metadata as dimensionalStackMetadata,
} from './directions/08-dimensional-stack'
import {
  CinematicFeatureDirection,
  cinematicFeatureMetadata,
} from './directions/09-cinematic-feature'
import {
  TechnicalIndexDirection,
  metadata as technicalIndexMetadata,
} from './directions/10-technical-index'
import { CutCornerButton } from './shared/CutCornerButton'
import { projects } from './shared/projects'
import type {
  ProjectDirectionMetadata,
  ProjectDirectionProps,
  ProjectLabState,
} from './shared/types'

import styles from './ProjectLab.module.css'

interface Direction {
  Component: ComponentType<ProjectDirectionProps>
  metadata: ProjectDirectionMetadata
}

const DIRECTIONS: readonly Direction[] = [
  { Component: EditorialGridDirection, metadata: editorialGridMetadata },
  { Component: MuseumCatalogDirection, metadata: museumCatalogMetadata },
  { Component: SplitScreenDirection, metadata: splitScreenMetadata },
  { Component: HorizontalRailDirection, metadata: horizontalRailMetadata },
  { Component: TimelineArchiveDirection, metadata: timelineArchiveMetadata },
  { Component: ModularMosaicDirection, metadata: modularMosaicMetadata },
  { Component: ProjectDossierDirection, metadata: projectDossierMetadata },
  { Component: DimensionalStackDirection, metadata: dimensionalStackMetadata },
  { Component: CinematicFeatureDirection, metadata: cinematicFeatureMetadata },
  { Component: TechnicalIndexDirection, metadata: technicalIndexMetadata },
]

const VIEW_STATES: readonly ProjectLabState[] = ['ready', 'loading', 'empty']

function stateLabel(state: ProjectLabState) {
  if (state === 'ready') return 'Ready'
  if (state === 'loading') return 'Loading'
  return 'Empty'
}

export function ProjectLab() {
  const [selectedIndex, setSelectedIndex] = useState(0)
  const [previewState, setPreviewState] = useState<ProjectLabState>('ready')
  const activeDirection = DIRECTIONS[selectedIndex] ?? DIRECTIONS[0]
  const ActiveComponent = activeDirection.Component

  useEffect(() => {
    const requested = Number(new URLSearchParams(window.location.search).get('v'))
    if (Number.isInteger(requested) && requested >= 1 && requested <= DIRECTIONS.length) {
      setSelectedIndex(requested - 1)
    }
  }, [])

  function showDirection(index: number) {
    setSelectedIndex(index)
    const url = new URL(window.location.href)
    url.searchParams.set('v', String(index + 1).padStart(2, '0'))
    window.history.replaceState({}, '', url)
    window.requestAnimationFrame(() => {
      document.querySelector('#project-lab-preview')?.scrollIntoView({ block: 'start' })
    })
  }

  return (
    <MotionConfig reducedMotion="user">
      <main className={styles.lab} id="project-lab">
        <a className={styles.skipLink} href="#project-lab-index">
          Skip to project directions
        </a>

        <header className={styles.hero}>
          <div className={styles.heroCopy}>
            <p className={styles.eyebrow}>MO portfolio · project presentation laboratory</p>
            <h1>Ten complete systems. One fair comparison.</h1>
            <p className={styles.intro}>
              Every direction uses the same six projects, imagery, fields, and selected Cut Corner controls.
              No final project system has been chosen or integrated.
            </p>
            <dl className={styles.heroStats}>
              <div><dt>Directions</dt><dd>10</dd></div>
              <div><dt>Shared projects</dt><dd>6</dd></div>
              <div><dt>Decision</dt><dd>Pending review</dd></div>
            </dl>
            <CutCornerButton href="/button-lab" variant="paper">Return to button laboratory</CutCornerButton>
          </div>

          <div className={styles.brandPanel}>
            <div className={styles.brandLabel}>
              <span>Preserved brand interaction</span>
              <strong>Glyph Spark + Solar Pulse</strong>
            </div>
            <AnimatedLogo
              animateOnMount={false}
              className={styles.logo}
              label="MO Glyph Spark logo with Solar Pulse interaction"
              mHoverEffect="glyph-spark"
            />
            <p>Hover, tap, or click the mark to replay.</p>
          </div>
        </header>

        <section aria-labelledby="project-lab-index-title" className={styles.index} id="project-lab-index">
          <div className={styles.sectionHeading}>
            <div>
              <p className={styles.eyebrow}>Comparison index</p>
              <h2 id="project-lab-index-title">Structurally different by design.</h2>
            </div>
            <p>
              Each system was made in isolation by a different agent after a documented skills.sh search.
              Preview any direction below; the content source never changes.
            </p>
          </div>

          <ol className={styles.directionGrid}>
            {DIRECTIONS.map(({ metadata }, index) => {
              const isActive = selectedIndex === index
              return (
                <li className={isActive ? styles.directionActive : undefined} key={metadata.id}>
                  <article className={styles.directionCard}>
                    <div className={styles.directionNumber}>{String(index + 1).padStart(2, '0')}</div>
                    <h3>{metadata.name}</h3>
                    <p>{metadata.description}</p>
                    <div className={styles.directionFooter}>
                      <a href={metadata.skill.url} rel="noreferrer" target="_blank">
                        Skill: {metadata.skill.name} ↗
                      </a>
                      <CutCornerButton
                        aria-controls="project-lab-preview"
                        aria-pressed={isActive}
                        onClick={() => showDirection(index)}
                        variant={isActive ? 'gold' : 'navy'}
                      >
                        {isActive ? 'In preview' : 'Preview direction'}
                      </CutCornerButton>
                    </div>
                  </article>
                </li>
              )
            })}
          </ol>
        </section>

        <section aria-labelledby="preview-title" className={styles.preview} id="project-lab-preview">
          <header className={styles.previewBar}>
            <div className={styles.previewTitle}>
              <span>Preview {String(selectedIndex + 1).padStart(2, '0')} / 10</span>
              <h2 id="preview-title">{activeDirection.metadata.name}</h2>
            </div>

            <div aria-label="Preview data state" className={styles.stateControls} role="group">
              {VIEW_STATES.map((state) => (
                <CutCornerButton
                  aria-pressed={previewState === state}
                  key={state}
                  onClick={() => setPreviewState(state)}
                  variant={previewState === state ? 'gold' : 'quiet'}
                >
                  {stateLabel(state)}
                </CutCornerButton>
              ))}
            </div>

            <CutCornerButton href="#project-lab-index" variant="paper">All directions ↑</CutCornerButton>
          </header>

          <div className={styles.previewCanvas} key={activeDirection.metadata.id}>
            <ActiveComponent projects={projects} state={previewState} />
          </div>
        </section>

        <footer className={styles.footer}>
          <p>Comparison laboratory only · no finalist selected</p>
          <a href="#project-lab">Back to top ↑</a>
        </footer>
      </main>
    </MotionConfig>
  )
}
