import { createFileRoute } from '@tanstack/react-router'

import {
  AnimatedLogo,
  type MHoverEffect,
} from '#/components/brand/AnimatedLogo'

interface EffectOption {
  effect: MHoverEffect
  label: string
}

const EFFECTS: EffectOption[] = [
  {
    effect: 'gold-sweep',
    label: 'Gold Inlay Sweep logo preview',
  },
  {
    effect: 'glyph-spark',
    label: 'Glyph Spark logo preview',
  },
]

export const Route = createFileRoute('/')({ component: Home })

function Home() {
  return (
    <main className="effect-lab">
      <header className="effect-lab__header">
        <p className="effect-lab__eyebrow">M hover study</p>
        <h1>Choose the final interaction</h1>
        <p>Each option includes the same Solar Pulse on the O.</p>
      </header>

      <section className="effect-grid" aria-label="M hover animation options">
        {EFFECTS.map(({ effect, label }) => (
          <article className="effect-card" key={effect}>
            <AnimatedLogo
              animateOnMount={false}
              className="effect-card__logo"
              label={label}
              mHoverEffect={effect}
            />
          </article>
        ))}
      </section>

      <p className="interaction-hint">Hover each logo to compare</p>
    </main>
  )
}
