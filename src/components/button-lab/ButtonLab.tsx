import type { ComponentType } from 'react'

import { AnimatedLogo } from '#/components/brand/AnimatedLogo'
import {
  StepPylonSystem,
  stepPylonMetadata,
} from '#/components/button-lab/concepts/01-step-pylon'
import {
  SolarApertureSystem,
  solarApertureMetadata,
} from '#/components/button-lab/concepts/02-solar-aperture'
import {
  CartoucheRailSystem,
  cartoucheRailMetadata,
} from '#/components/button-lab/concepts/03-cartouche-rail'
import {
  GildedReliefSystem,
  gildedReliefMetadata,
} from '#/components/button-lab/concepts/04-gilded-relief'
import {
  PressedSealSystem,
  pressedSealMetadata,
} from '#/components/button-lab/concepts/05-pressed-seal'

import styles from './ButtonLab.module.css'

interface Concept {
  Component: ComponentType
  direction: string
  id: string
  name: string
}

const CONCEPTS: Concept[] = [
  {
    Component: StepPylonSystem,
    direction: stepPylonMetadata.direction,
    id: stepPylonMetadata.id,
    name: stepPylonMetadata.name,
  },
  {
    Component: SolarApertureSystem,
    direction: solarApertureMetadata.direction,
    id: solarApertureMetadata.id,
    name: solarApertureMetadata.name,
  },
  {
    Component: CartoucheRailSystem,
    direction: cartoucheRailMetadata.direction,
    id: cartoucheRailMetadata.id,
    name: cartoucheRailMetadata.name,
  },
  {
    Component: GildedReliefSystem,
    direction: gildedReliefMetadata.direction,
    id: gildedReliefMetadata.id,
    name: gildedReliefMetadata.name,
  },
  {
    Component: PressedSealSystem,
    direction: pressedSealMetadata.direction,
    id: pressedSealMetadata.id,
    name: pressedSealMetadata.name,
  },
]

export function ButtonLab() {
  return (
    <main className={styles.lab}>
      <a className={styles.skipLink} href="#concepts">
        Skip to button systems
      </a>

      <header className={styles.hero}>
        <div className={styles.heroCopy}>
          <p className={styles.eyebrow}>MO portfolio · button laboratory</p>
          <h1>Five finalists. One final system.</h1>
          <p className={styles.intro}>
            Three flat systems and two dimensional evolutions remain in review.
            No final system has been selected.
          </p>
          <div className={styles.reviewStatus}>
            <span>Review status</span>
            <strong>Five finalists · decision pending</strong>
          </div>
        </div>

        <div className={styles.brandSelection}>
          <div className={styles.selectionLabel}>
            <span>Selected brand interaction</span>
            <strong>Glyph Spark + Solar Pulse</strong>
          </div>
          <AnimatedLogo
            animateOnMount={false}
            className={styles.brandMark}
            label="Selected MO Glyph Spark logo interaction"
            mHoverEffect="glyph-spark"
          />
          <p>Hover or activate the mark to replay the preserved interaction.</p>
        </div>
      </header>

      <section
        aria-labelledby="comparison-index-title"
        className={styles.index}
        id="lab-index"
      >
        <div className={styles.indexHeading}>
          <div>
            <p className={styles.eyebrow}>Comparison index</p>
            <h2 id="comparison-index-title">Compare the practical details</h2>
          </div>
          <p>
            Review structure, color, states, and interaction details before we
            refine the finalists and choose one.
          </p>
        </div>

        <nav aria-label="Button system index" className={styles.conceptGrid}>
          {CONCEPTS.map(({ direction, id, name }, index) => (
            <article className={styles.conceptCard} key={id}>
              <a className={styles.conceptLink} href={`#${id}`}>
                <span>{String(index + 1).padStart(2, '0')}</span>
                <strong>{name}</strong>
                <small>View system ↓</small>
              </a>
              <p>{direction}</p>
            </article>
          ))}
        </nav>
      </section>

      <div className={styles.systems} id="concepts">
        {CONCEPTS.map(({ Component, id, name }, index) => (
          <section
            aria-label={`${name} button system`}
            className={styles.systemFrame}
            id={id}
            key={id}
          >
            <div className={styles.systemRail}>
              <span>
                Candidate {String(index + 1).padStart(2, '0')} / {name}
              </span>
              <span>{index === 0 ? 'Kept unchanged' : 'Finalist'}</span>
              <a href="#lab-index">Back to index ↑</a>
            </div>
            <Component />
          </section>
        ))}
      </div>
    </main>
  )
}
