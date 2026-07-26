import { type ComponentType, useEffect, useState } from 'react'
import { MotionConfig } from 'motion/react'

import { AnimatedLogo } from '#/components/brand/AnimatedLogo'
import {
  LayoutMorphDirection,
  metadata as layoutMorphMetadata,
} from './directions/01-layout-morph'
import {
  ElasticAccordionDirection,
  metadata as elasticAccordionMetadata,
} from './directions/02-elastic-accordion'
import {
  FilmstripDrawerDirection,
  metadata as filmstripDrawerMetadata,
} from './directions/03-filmstrip-drawer'
import {
  MinimalCoverflowDirection,
  metadata as minimalCoverflowMetadata,
} from './directions/04-minimal-coverflow'
import {
  MagneticSnapDirection,
  metadata as magneticSnapMetadata,
} from './directions/05-magnetic-snap'
import {
  StackedPeelDirection,
  metadata as stackedPeelMetadata,
} from './directions/06-stacked-peel'
import {
  KineticRibbonDirection,
  metadata as kineticRibbonMetadata,
} from './directions/07-kinetic-ribbon'
import {
  ApertureZoomDirection,
  metadata as apertureZoomMetadata,
} from './directions/08-aperture-zoom'
import {
  KineticColumnsDirection,
  metadata as kineticColumnsMetadata,
} from './directions/09-kinetic-columns'
import {
  EdgeCabinetDirection,
  metadata as edgeCabinetMetadata,
} from './directions/10-edge-cabinet'
import { cardProjects } from './shared/projects'
import type {
  CardDirectionMetadata,
  CardDirectionProps,
  CardLabState,
} from './shared/types'

import styles from './ProjectCardLab.module.css'

interface Direction {
  Component: ComponentType<CardDirectionProps>
  metadata: CardDirectionMetadata
}

const directions: readonly Direction[] = [
  { Component: LayoutMorphDirection, metadata: layoutMorphMetadata },
  { Component: ElasticAccordionDirection, metadata: elasticAccordionMetadata },
  { Component: FilmstripDrawerDirection, metadata: filmstripDrawerMetadata },
  { Component: MinimalCoverflowDirection, metadata: minimalCoverflowMetadata },
  { Component: MagneticSnapDirection, metadata: magneticSnapMetadata },
  { Component: StackedPeelDirection, metadata: stackedPeelMetadata },
  { Component: KineticRibbonDirection, metadata: kineticRibbonMetadata },
  { Component: ApertureZoomDirection, metadata: apertureZoomMetadata },
  { Component: KineticColumnsDirection, metadata: kineticColumnsMetadata },
  { Component: EdgeCabinetDirection, metadata: edgeCabinetMetadata },
]

const states: readonly CardLabState[] = ['ready', 'loading', 'empty']

export function ProjectCardLab() {
  const [directionIndex, setDirectionIndex] = useState(0)
  const [previewState, setPreviewState] = useState<CardLabState>('ready')
  const activeDirection = directions[directionIndex] ?? directions[0]
  const ActiveDirection = activeDirection.Component

  useEffect(() => {
    const requested = Number(new URLSearchParams(window.location.search).get('v'))
    if (Number.isInteger(requested) && requested >= 1 && requested <= directions.length) {
      setDirectionIndex(requested - 1)
    }
  }, [])

  const selectDirection = (index: number) => {
    setDirectionIndex(index)
    const url = new URL(window.location.href)
    url.searchParams.set('v', String(index + 1).padStart(2, '0'))
    window.history.replaceState({}, '', url)
    window.requestAnimationFrame(() => {
      document.querySelector('#project-card-preview')?.scrollIntoView({
        block: 'start',
      })
    })
  }

  return (
    <MotionConfig reducedMotion="user">
      <main className={styles.lab} id="project-card-lab">
        <a className={styles.skipLink} href="#project-card-directions">
          Skip to directions
        </a>

        <header className={styles.header}>
          <div>
            <p className={styles.eyebrow}>Project card laboratory · round 03</p>
            <h1>Images first. Details on demand.</h1>
            <p className={styles.intro}>
              Ten ways to keep several projects together in one horizontal row.
              Every closed card is only an image; select one to open the useful
              context.
            </p>
          </div>
          <AnimatedLogo
            animateOnMount={false}
            className={styles.mark}
            label="MO Glyph Spark logo"
            mHoverEffect="glyph-spark"
          />
        </header>

        <div className={styles.workspace}>
          <nav
            aria-labelledby="project-card-directions-title"
            className={styles.index}
            id="project-card-directions"
          >
            <div className={styles.indexHeader}>
              <h2 id="project-card-directions-title">Directions</h2>
              <span className={styles.counter}>10</span>
            </div>

            <ol className={styles.directionList}>
              {directions.map(({ metadata }, index) => (
                <li key={metadata.id}>
                  <button
                    aria-controls="project-card-preview"
                    aria-pressed={directionIndex === index}
                    className={styles.directionButton}
                    onClick={() => selectDirection(index)}
                    type="button"
                  >
                    <span className={styles.directionNumber}>
                      {String(index + 1).padStart(2, '0')}
                    </span>
                    <span className={styles.directionCopy}>
                      <strong>{metadata.name}</strong>
                      <span>{metadata.motion}</span>
                    </span>
                  </button>
                </li>
              ))}
            </ol>
          </nav>

          <section
            aria-labelledby="project-card-preview-title"
            className={styles.preview}
            id="project-card-preview"
          >
            <header className={styles.previewBar}>
              <div className={styles.previewTitle}>
                <p className={styles.eyebrow}>
                  Preview {String(directionIndex + 1).padStart(2, '0')} / 10
                </p>
                <h2 id="project-card-preview-title">
                  {activeDirection.metadata.name}
                </h2>
              </div>

              <div
                aria-label="Preview data state"
                className={styles.stateControls}
                role="group"
              >
                {states.map((state) => (
                  <button
                    aria-pressed={previewState === state}
                    className={styles.stateButton}
                    key={state}
                    onClick={() => setPreviewState(state)}
                    type="button"
                  >
                    {state[0].toUpperCase() + state.slice(1)}
                  </button>
                ))}
              </div>
            </header>

            <div className={styles.canvas} key={activeDirection.metadata.id}>
              <ActiveDirection projects={cardProjects} state={previewState} />
            </div>

            <a
              className={styles.skill}
              href={activeDirection.metadata.skill.url}
              rel="noreferrer"
              target="_blank"
            >
              Skill: {activeDirection.metadata.skill.name} ↗
            </a>
          </section>
        </div>

        <footer className={styles.footer}>
          <p>Comparison only · no direction selected for integration</p>
          <a href="#project-card-lab">Back to top ↑</a>
        </footer>
      </main>
    </MotionConfig>
  )
}
