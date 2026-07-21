import {
  motion,
  stagger,
  useAnimate,
  useReducedMotion,
} from 'motion/react'
import { useCallback, useEffect, useId, useMemo, useRef, useState } from 'react'

import styles from './AnimatedLogo.module.css'

const LOGO_URL = '/brand/mo-mark-v3.svg'
const GOLD = '#d79d40'
const GOLD_GLOW = '#f4c35a'
const RED = '#9c1e1b'
const RED_GLOW = '#bd2a25'
const GOLD_FILLS = ['#d79d40', '#dfa744', '#c4862d', '#cd9235', '#e5b154']

let hasPlayedEntrance = false

export type MHoverEffect =
  | 'gold-sweep'
  | 'glyph-spark'

interface AnimatedLogoProps {
  animateOnMount?: boolean
  className?: string
  label?: string
  mHoverEffect?: MHoverEffect
}

function svgFillSelector(groups: string[], fills: string[]) {
  return groups
    .flatMap((group) => fills.map((fill) => `${group} [fill="${fill}"]`))
    .join(', ')
}

function namespaceSvg(source: string, prefix: string) {
  return source
    .replace(/^<\?xml[^>]*>\s*/, '')
    .replaceAll(/id="([^"]+)"/g, `id="${prefix}-$1"`)
    .replaceAll(/url\(#([^)]+)\)/g, `url(#${prefix}-$1)`)
    .replace('<svg ', '<svg aria-hidden="true" focusable="false" ')
}

export function AnimatedLogo({
  animateOnMount = true,
  className,
  label = 'MO portfolio mark',
  mHoverEffect = 'glyph-spark',
}: AnimatedLogoProps) {
  const reactId = useId()
  const prefix = useMemo(
    () => `brand-${reactId.replaceAll(/[^a-zA-Z0-9_-]/g, '')}`,
    [reactId],
  )
  const selectors = useMemo(
    () => {
      const left = `#${prefix}-logo-m-left`
      const right = `#${prefix}-logo-m-right`
      const base = `#${prefix}-logo-m-base`

      return {
        left,
        right,
        base,
        goldDetails: svgFillSelector([left, right, base], GOLD_FILLS),
        diagonals: `#${prefix}-logo-diagonals`,
        heavyDiagonal: `#${prefix}-logo-heavy-diagonal`,
        fineDiagonal: `#${prefix}-logo-fine-diagonal`,
        inscription: `#${prefix}-logo-inscription`,
        o: `#${prefix}-logo-o`,
        oRing: `#${prefix}-logo-o-ring`,
        oBridge: `#${prefix}-logo-o-bridge`,
        rays: `#${prefix}-logo-rays`,
        rayLines: `#${prefix}-logo-ray-lines`,
        rayTerminals: `#${prefix}-logo-ray-terminals`,
      }
    },
    [prefix],
  )
  const [markup, setMarkup] = useState<string>()
  const [loadFailed, setLoadFailed] = useState(false)
  const [scope, animate] = useAnimate()
  const shouldReduceMotion = useReducedMotion()
  const isPulsing = useRef(false)

  useEffect(() => {
    const controller = new AbortController()

    async function loadLogo() {
      try {
        const response = await fetch(LOGO_URL, { signal: controller.signal })
        if (!response.ok) throw new Error(`Logo request failed: ${response.status}`)

        const source = await response.text()
        setMarkup(namespaceSvg(source, prefix))
      } catch (error) {
        if (error instanceof DOMException && error.name === 'AbortError') return
        setLoadFailed(true)
      }
    }

    void loadLogo()
    return () => controller.abort()
  }, [prefix])

  useEffect(() => {
    if (!markup || !scope.current) return

    async function playEntrance() {
      if (!animateOnMount || shouldReduceMotion || hasPlayedEntrance) {
        await animate(scope.current, { opacity: 1 }, { duration: 0.18 })
        return
      }

      hasPlayedEntrance = true

      await Promise.all([
        animate(selectors.left, { opacity: 0, x: -10 }, { duration: 0 }),
        animate(selectors.right, { opacity: 0, x: 10 }, { duration: 0 }),
        animate(selectors.heavyDiagonal, { opacity: 0 }, { duration: 0 }),
        animate(
          selectors.fineDiagonal,
          { opacity: 0, pathLength: 0 },
          { duration: 0 },
        ),
        animate(selectors.o, { opacity: 0, scale: 0.94 }, { duration: 0 }),
        animate(selectors.rays, { opacity: 0, scale: 0.78 }, { duration: 0 }),
        animate(`${selectors.rayTerminals} > path`, { opacity: 0 }, { duration: 0 }),
      ])

      await animate(scope.current, { opacity: 1 }, { duration: 0.12 })
      await Promise.all([
        animate(
          selectors.left,
          { opacity: 1, x: 0 },
          { duration: 0.42, ease: [0.22, 1, 0.36, 1] },
        ),
        animate(
          selectors.right,
          { opacity: 1, x: 0 },
          { delay: 0.08, duration: 0.42, ease: [0.22, 1, 0.36, 1] },
        ),
      ])
      await Promise.all([
        animate(selectors.heavyDiagonal, { opacity: 1 }, { duration: 0.32 }),
        animate(
          selectors.fineDiagonal,
          { opacity: 1, pathLength: 1 },
          { duration: 0.5, ease: 'easeInOut' },
        ),
      ])
      await animate(
        selectors.o,
        { opacity: 1, scale: 1 },
        { duration: 0.42, ease: [0.22, 1, 0.36, 1] },
      )
      await Promise.all([
        animate(
          selectors.rays,
          { opacity: 1, scale: 1 },
          { duration: 0.42, ease: [0.16, 1, 0.3, 1] },
        ),
        animate(
          `${selectors.rayTerminals} > path`,
          { opacity: 1 },
          { delay: stagger(0.035), duration: 0.16 },
        ),
      ])
      await animate(
        `${selectors.inscription} > path`,
        { fill: [GOLD, GOLD_GLOW, GOLD] },
        { delay: stagger(0.025), duration: 0.4 },
      )
    }

    void playEntrance()
  }, [animate, animateOnMount, markup, scope, selectors, shouldReduceMotion])

  const playMHover = useCallback(async () => {
    switch (mHoverEffect) {
      case 'gold-sweep':
        await animate(
          selectors.goldDetails,
          { filter: ['brightness(1)', 'brightness(1.42)', 'brightness(1)'] },
          {
            delay: stagger(0.008, { from: 'last' }),
            duration: 0.3,
            ease: 'easeInOut',
          },
        )
        break
      case 'glyph-spark':
        await animate(
          `${selectors.inscription} > path:not(:first-child)`,
          {
            fill: [GOLD, GOLD_GLOW, GOLD],
            filter: ['brightness(1)', 'brightness(1.22)', 'brightness(1)'],
          },
          {
            delay: stagger(0.04),
            duration: 0.32,
            ease: [0.22, 1, 0.36, 1],
          },
        )
        break
    }
  }, [animate, mHoverEffect, selectors])

  const playSolarPulse = useCallback(async () => {
    if (!markup || !scope.current || isPulsing.current) return

    isPulsing.current = true

    try {
      const rayWave = animate(
        `${selectors.rayLines} path`,
        shouldReduceMotion
          ? { filter: ['brightness(1)', 'brightness(1.3)', 'brightness(1)'] }
          : {
              x: [0, 1.5, 0],
              filter: ['brightness(1)', 'brightness(1.36)', 'brightness(1)'],
            },
        {
          delay: stagger(0.035, { from: 'center' }),
          duration: 0.38,
          ease: 'easeInOut',
        },
      )
      const terminalWave = animate(
        `${selectors.rayTerminals} > path`,
        {
          fill: [GOLD, GOLD_GLOW, GOLD],
          filter: ['brightness(1)', 'brightness(1.18)', 'brightness(1)'],
        },
        {
          delay: stagger(0.035, { from: 'center', startDelay: 0.06 }),
          duration: 0.34,
          ease: [0.22, 1, 0.36, 1],
        },
      )

      if (shouldReduceMotion) {
        await Promise.all([
          rayWave,
          terminalWave,
          animate(
            selectors.oRing,
            { fill: [RED, RED_GLOW, RED] },
            { duration: 0.56, ease: 'easeInOut' },
          ),
          animate(
            `${selectors.oBridge} > path`,
            { fill: [GOLD, GOLD_GLOW, GOLD] },
            { delay: stagger(0.035, { from: 'center' }), duration: 0.42 },
          ),
        ])
        return
      }

      await Promise.all([
        rayWave,
        terminalWave,
        animate(
          selectors.o,
          { scale: [1, 1.01, 0.998, 1] },
          { duration: 0.64, ease: [0.22, 1, 0.36, 1] },
        ),
        animate(
          selectors.oRing,
          { fill: [RED, RED_GLOW, RED] },
          { duration: 0.64, ease: 'easeInOut' },
        ),
        animate(
          `${selectors.oBridge} > path`,
          { x: [0, 1, 0], fill: [GOLD, GOLD_GLOW, GOLD] },
          {
            delay: stagger(0.035, { from: 'center' }),
            duration: 0.42,
            ease: 'easeInOut',
          },
        ),
      ])
    } finally {
      isPulsing.current = false
    }
  }, [animate, markup, scope, selectors, shouldReduceMotion])

  const playLogoHover = useCallback(async () => {
    if (isPulsing.current) return
    await Promise.all([playSolarPulse(), playMHover()])
  }, [playMHover, playSolarPulse])

  const rootClassName = [styles.mark, className].filter(Boolean).join(' ')

  if (loadFailed) {
    return (
      <div className={rootClassName} role="img" aria-label={label} style={{ opacity: 1 }}>
        <img className={styles.fallback} src={LOGO_URL} alt="" />
      </div>
    )
  }

  if (!markup) return <div className={styles.placeholder} aria-hidden="true" />

  return (
    <motion.div
      ref={scope}
      className={rootClassName}
      role="img"
      aria-label={label}
      onHoverStart={() => void playLogoHover()}
      onClick={() => void playLogoHover()}
      dangerouslySetInnerHTML={{ __html: markup }}
    />
  )
}
