import { type ComponentType, useEffect, useState } from 'react'
import { MotionConfig } from 'motion/react'

import { AnimatedLogo } from '#/components/brand/AnimatedLogo'
import { CutCornerButton } from '../project-lab/shared/CutCornerButton'
import {
  ChromaticFilmstripDirection,
  metadata as chromaticFilmstripMetadata,
} from './directions/01-chromatic-filmstrip'
import {
  ArchitecturalViewfinderDirection,
  metadata as architecturalViewfinderMetadata,
} from './directions/02-architectural-viewfinder'
import {
  KineticContactSheetDirection,
  metadata as kineticContactSheetMetadata,
} from './directions/03-kinetic-contact-sheet'
import {
  SolarApertureDirection,
  metadata as solarApertureMetadata,
} from './directions/04-solar-aperture'
import {
  EditorialSplitRailDirection,
  metadata as editorialSplitRailMetadata,
} from './directions/05-editorial-split-rail'
import {
  AmbientCanvasDirection,
  metadata as ambientCanvasMetadata,
} from './directions/06-ambient-canvas'
import {
  DimensionalSlideStackDirection,
  metadata as dimensionalSlideStackMetadata,
} from './directions/07-dimensional-slide-stack'
import {
  GalleryDrawerDirection,
  metadata as galleryDrawerMetadata,
} from './directions/08-gallery-drawer'
import {
  CinematicStageDirection,
  metadata as cinematicStageMetadata,
} from './directions/09-cinematic-stage'
import {
  TechnicalSwitcherDirection,
  metadata as technicalSwitcherMetadata,
} from './directions/10-technical-switcher'
import { sliderProjects } from './shared/projects'
import type {
  SliderDirectionMetadata,
  SliderDirectionProps,
  SliderLabState,
} from './shared/types'

import baseStyles from '../project-lab/ProjectLab.module.css'
import styles from './ProjectSliderLab.module.css'

interface Direction {
  Component: ComponentType<SliderDirectionProps>
  metadata: SliderDirectionMetadata
}

const DIRECTIONS: readonly Direction[] = [
  { Component: ChromaticFilmstripDirection, metadata: chromaticFilmstripMetadata },
  { Component: ArchitecturalViewfinderDirection, metadata: architecturalViewfinderMetadata },
  { Component: KineticContactSheetDirection, metadata: kineticContactSheetMetadata },
  { Component: SolarApertureDirection, metadata: solarApertureMetadata },
  { Component: EditorialSplitRailDirection, metadata: editorialSplitRailMetadata },
  { Component: AmbientCanvasDirection, metadata: ambientCanvasMetadata },
  { Component: DimensionalSlideStackDirection, metadata: dimensionalSlideStackMetadata },
  { Component: GalleryDrawerDirection, metadata: galleryDrawerMetadata },
  { Component: CinematicStageDirection, metadata: cinematicStageMetadata },
  { Component: TechnicalSwitcherDirection, metadata: technicalSwitcherMetadata },
]

const VIEW_STATES: readonly SliderLabState[] = ['ready', 'loading', 'empty']

function stateLabel(state: SliderLabState) {
  if (state === 'ready') return 'Ready'
  if (state === 'loading') return 'Loading'
  return 'Empty'
}

export function ProjectSliderLab() {
  const [selectedIndex, setSelectedIndex] = useState(0)
  const [previewState, setPreviewState] = useState<SliderLabState>('ready')
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
      document.querySelector('#project-slider-lab-preview')?.scrollIntoView({ block: 'start' })
    })
  }

  return (
    <MotionConfig reducedMotion="user">
      <main className={`${baseStyles.lab} ${styles.lab}`} id="project-slider-lab">
        <a className={baseStyles.skipLink} href="#project-slider-lab-index">
          Skip to refined directions
        </a>

        <header className={`${baseStyles.hero} ${styles.hero}`}>
          <div className={baseStyles.heroCopy}>
            <p className={`${baseStyles.eyebrow} ${styles.eyebrow}`}>MO portfolio · quiet project studies</p>
            <h1>Less interface. More work.</h1>
            <p className={`${baseStyles.intro} ${styles.intro}`}>
              Ten restrained versions of the same project slider: small image controls, a calm snap rail,
              concise context, and only enough motion to preserve orientation.
            </p>
            <dl className={`${baseStyles.heroStats} ${styles.heroStats}`}>
              <div><dt>Directions</dt><dd>10</dd></div>
              <div><dt>Shared projects</dt><dd>6</dd></div>
              <div><dt>Decision</dt><dd>Pending review</dd></div>
            </dl>
            <CutCornerButton href="/project-lab" variant="paper">See the first laboratory</CutCornerButton>
          </div>

          <div className={`${baseStyles.brandPanel} ${styles.brandPanel}`}>
            <div className={baseStyles.brandLabel}>
              <span>Kept deliberately small</span>
              <strong>Image · title · context · link</strong>
            </div>
            <AnimatedLogo
              animateOnMount={false}
              className={`${baseStyles.logo} ${styles.logo}`}
              label="MO Glyph Spark logo with Solar Pulse interaction"
              mHoverEffect="glyph-spark"
            />
            <p>Square cues · snap rail · no visual theatre</p>
          </div>
        </header>

        <section aria-labelledby="project-slider-lab-index-title" className={`${baseStyles.index} ${styles.index}`} id="project-slider-lab-index">
          <div className={`${baseStyles.sectionHeading} ${styles.sectionHeading}`}>
            <div>
              <p className={`${baseStyles.eyebrow} ${styles.eyebrow}`}>Quiet comparison index</p>
              <h2 id="project-slider-lab-index-title">Small differences, not ten spectacles.</h2>
            </div>
            <p>
              Preview a direction, then swipe horizontally or use its square image controls.
              Decoration has been reduced so the work can carry the page.
            </p>
          </div>

          <ol className={`${baseStyles.directionGrid} ${styles.directionGrid}`}>
            {DIRECTIONS.map(({ metadata }, index) => {
              const isActive = selectedIndex === index
              return (
                <li className={isActive ? `${baseStyles.directionActive} ${styles.directionActive}` : undefined} key={metadata.id}>
                  <article className={`${baseStyles.directionCard} ${styles.directionCard}`}>
                    <div className={baseStyles.directionNumber}>{String(index + 1).padStart(2, '0')}</div>
                    <h3>{metadata.name}</h3>
                    <p>{metadata.description}</p>
                    <div className={baseStyles.directionFooter}>
                      <a href={metadata.skill.url} rel="noreferrer" target="_blank">
                        Skill: {metadata.skill.name} ↗
                      </a>
                      <CutCornerButton
                        aria-controls="project-slider-lab-preview"
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

        <section aria-labelledby="project-slider-preview-title" className={`${baseStyles.preview} ${styles.preview}`} id="project-slider-lab-preview">
          <header className={`${baseStyles.previewBar} ${styles.previewBar}`}>
            <div className={`${baseStyles.previewTitle} ${styles.previewTitle}`}>
              <span>Preview {String(selectedIndex + 1).padStart(2, '0')} / 10</span>
              <h2 id="project-slider-preview-title">{activeDirection.metadata.name}</h2>
            </div>

            <div aria-label="Preview data state" className={baseStyles.stateControls} role="group">
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

            <CutCornerButton href="#project-slider-lab-index" variant="paper">All directions ↑</CutCornerButton>
          </header>

          <div className={`${baseStyles.previewCanvas} ${styles.previewCanvas}`} key={activeDirection.metadata.id}>
            <div className={styles.directionFrame}>
              <ActiveComponent projects={sliderProjects} state={previewState} />
            </div>
          </div>
        </section>

        <footer className={`${baseStyles.footer} ${styles.footer}`}>
          <p>Refined comparison only · no finalist selected</p>
          <a href="#project-slider-lab">Back to top ↑</a>
        </footer>
      </main>
    </MotionConfig>
  )
}
