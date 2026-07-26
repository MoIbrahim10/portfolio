import { MotionConfig, motion, useReducedMotion } from 'motion/react'
import { useEffect, useState } from 'react'

import { AnimatedLogo } from '#/components/brand/AnimatedLogo'
import { GlyphWorkshop } from '#/components/intro-lab/IntroLab'
import { CutCornerButton } from '#/components/project-lab/shared/CutCornerButton'

import styles from './V14IdleGapLab.module.css'

const LINKS = {
  cal: 'https://cal.com/mo-c0de/30min',
  email: 'mailto:dev.mo.ibrahim@gmail.com',
  github: 'https://github.com/MoIbrahim10',
  x: 'https://x.com/m0code',
}

const AVATARS = [
  '/avatar/mo-avatar-portrait-01.png',
  '/avatar/mo-avatar-portrait-02.png',
  '/avatar/mo-avatar-portrait-03.png',
  '/avatar/mo-avatar-portrait-04.png',
  '/avatar/mo-avatar-portrait-05.png',
  '/avatar/mo-avatar-portrait-06.png',
]

const PROJECT_SNIPPETS = [
  {
    label: 'Good Invoice',
    src: '/portfolio/projects/good-invoice/hero.png',
  },
  {
    label: 'Bitsnpixels',
    src: '/portfolio/projects/bitsnpixels/hero.png',
  },
  {
    label: 'Bitsnpixels',
    src: '/portfolio/projects/bitsnpixels/detail-01.webp',
  },
  {
    label: 'Bitsnpixels',
    src: '/portfolio/projects/bitsnpixels/detail-02.webp',
  },
  {
    label: 'Calm AI Studio',
    src: '/portfolio/projects/calm-ai-studio/hero.png',
  },
  {
    label: 'Calm AI Studio',
    src: '/portfolio/projects/calm-ai-studio.png',
  },
  {
    label: 'Glazed',
    src: '/portfolio/projects/glazed/hero.webp',
  },
  {
    label: 'Glazed',
    src: '/portfolio/projects/glazed/detail-01.webp',
  },
  {
    label: 'Glazed',
    src: '/portfolio/projects/glazed/detail-02.webp',
  },
  {
    label: 'Orgo',
    src: '/portfolio/projects/orgo/hero.png',
  },
  {
    label: 'Orgo',
    src: '/portfolio/projects/orgo/detail-01.png',
  },
  {
    label: 'Orgo',
    src: '/portfolio/projects/orgo/detail-02.png',
  },
  {
    label: 'Stepper',
    src: '/portfolio/projects/stepper/hero.png',
  },
  {
    label: 'Stepper',
    src: '/portfolio/projects/stepper/detail-01.png',
  },
  {
    label: 'Stepper',
    src: '/portfolio/projects/stepper/detail-02.png',
  },
]

const CONCEPTS = [
  {
    id: 'contact-sheet',
    name: 'Contact sheet',
    note: `All ${AVATARS.length} portraits become a quiet visual index.`,
  },
  {
    id: 'paper-stack',
    name: 'Paper stack',
    note: 'A physical archive waits in the gap before revealing itself.',
  },
  {
    id: 'film-strip',
    name: 'Film strip',
    note: 'A compact strip hints at the range without taking over.',
  },
  {
    id: 'index-fan',
    name: 'Index fan',
    note: `${AVATARS.length} numbered edges make the hidden collection tangible.`,
  },
  {
    id: 'crop-window',
    name: 'Crop window',
    note: 'One restrained crop creates presence without another headline.',
  },
] as const

type ConceptId = (typeof CONCEPTS)[number]['id']

function SocialIcon({ name }: { name: 'email' | 'github' | 'x' }) {
  const props = {
    'aria-hidden': true,
    className: styles.socialIcon,
    fill: 'none',
    focusable: false,
    viewBox: '0 0 24 24',
  } as const

  if (name === 'email') {
    return (
      <svg {...props}>
        <path d="M3.5 6.5h17v12h-17zM4 7l8 6 8-6" />
      </svg>
    )
  }

  if (name === 'github') {
    return (
      <svg {...props}>
        <path
          d="M12 2.8a9.4 9.4 0 0 0-3 18.3c.47.1.64-.2.64-.45V19c-2.59.56-3.14-1.1-3.14-1.1-.42-1.08-1.03-1.37-1.03-1.37-.85-.58.06-.57.06-.57.94.07 1.43.96 1.43.96.84 1.44 2.2 1.02 2.73.78.09-.6.33-1.01.6-1.25-2.07-.24-4.24-1.04-4.24-4.63 0-1.02.36-1.86.96-2.51-.09-.24-.42-1.19.1-2.47 0 0 .78-.25 2.58.96A8.9 8.9 0 0 1 12 7.5a8.9 8.9 0 0 1 2.35.32c1.8-1.21 2.58-.96 2.58-.96.52 1.28.19 2.23.1 2.47.6.65.96 1.49.96 2.51 0 3.6-2.19 4.38-4.27 4.62.34.29.63.86.63 1.73v2.47c0 .25.17.54.65.45A9.4 9.4 0 0 0 12 2.8Z"
          fill="currentColor"
          stroke="none"
        />
      </svg>
    )
  }

  return (
    <svg {...props}>
      <path d="m5 4 14 16M19 4 5 20" />
    </svg>
  )
}

function ContactActions() {
  return (
    <div className={styles.contactActions}>
      <CutCornerButton
        className={styles.callButton}
        href={LINKS.cal}
        rel="noreferrer"
        target="_blank"
        variant="navy"
      >
        Schedule a call
      </CutCornerButton>
      <nav aria-label="Contact links" className={styles.socials}>
        {[
          { href: LINKS.x, label: 'X profile', name: 'x' as const },
          { href: LINKS.email, label: 'Email Mo', name: 'email' as const },
          {
            href: LINKS.github,
            label: 'GitHub profile',
            name: 'github' as const,
          },
        ].map(({ href, label, name }) => {
          const external = href.startsWith('https://')

          return (
            <CutCornerButton
              aria-label={label}
              className={styles.socialLink}
              href={href}
              key={name}
              rel={external ? 'noreferrer' : undefined}
              target={external ? '_blank' : undefined}
              variant="paper"
            >
              <SocialIcon name={name} />
            </CutCornerButton>
          )
        })}
      </nav>
    </div>
  )
}

function IdleTreatment({ concept }: { concept: ConceptId }) {
  if (concept === 'contact-sheet') {
    return (
      <div className={styles.contactSheet}>
        {AVATARS.map((src) => (
          <img
            alt=""
            aria-hidden="true"
            height="1254"
            key={src}
            loading="lazy"
            src={src}
            width="1254"
          />
        ))}
        <span>Portrait studies · {AVATARS.length}</span>
      </div>
    )
  }

  if (concept === 'paper-stack') {
    return (
      <div className={styles.paperStack}>
        {AVATARS.map((src, index) => (
          <span
            aria-hidden="true"
            className={styles.paperStackCard}
            key={src}
            style={{
              transform: `translate(${(index % 5) - 2}px, ${index * 0.55}px) rotate(${((index % 7) - 3) * 0.18}deg)`,
            }}
          />
        ))}
        <span className={styles.paperStackCover}>
          <strong>MO</strong>
          <small>{AVATARS.length} portrait studies</small>
        </span>
      </div>
    )
  }

  if (concept === 'film-strip') {
    return (
      <div className={styles.filmStrip}>
        <span className={styles.filmTrack}>
          {PROJECT_SNIPPETS.map(({ label, src }) => (
            <span className={styles.filmFrame} key={src}>
              <img
                alt=""
                aria-hidden="true"
                height="1254"
                loading="lazy"
                src={src}
                width="1254"
              />
              <span>{label}</span>
            </span>
          ))}
        </span>
      </div>
    )
  }

  if (concept === 'index-fan') {
    return (
      <div className={styles.indexFan}>
        {AVATARS.map((src, index) => (
          <span
            aria-hidden="true"
            className={styles.indexCard}
            key={src}
            style={{
              transform: `translateX(${index * 2.25}px) rotate(${(index - 9.5) * 0.45}deg)`,
            }}
          >
            {String(index + 1).padStart(2, '0')}
          </span>
        ))}
        <small>{AVATARS.length} ways of showing up.</small>
      </div>
    )
  }

  return (
    <div className={styles.cropWindow}>
      <img
        alt=""
        aria-hidden="true"
        height="1254"
        loading="lazy"
        src={AVATARS[1]}
        width="1254"
      />
      <span>
        <strong>{AVATARS.length}</strong>
        <small>portraits / one Mo</small>
      </span>
    </div>
  )
}

function PortraitDeck({ active, instant }: { active: boolean; instant: boolean }) {
  const reducedMotion = useReducedMotion()
  const [avatarIndex, setAvatarIndex] = useState(0)
  const [dealPhase, setDealPhase] = useState<'idle' | 'out' | 'under'>('idle')

  useEffect(() => {
    if (!active) {
      const resetTimer = window.setTimeout(() => setDealPhase('idle'), 520)
      return () => window.clearTimeout(resetTimer)
    }

    if (instant || reducedMotion) return

    const cycleTimer = window.setInterval(() => {
      setDealPhase((current) => (current === 'idle' ? 'out' : current))
    }, 4000)

    return () => window.clearInterval(cycleTimer)
  }, [active, instant, reducedMotion])

  const current = AVATARS[avatarIndex]
  const next = AVATARS[(avatarIndex + 1) % AVATARS.length]
  const nextIsPromoting = dealPhase !== 'idle'

  return (
    <motion.div
      animate={{
        filter: active ? 'blur(0px)' : 'blur(3px)',
        opacity: active ? 1 : 0,
        y: active ? 0 : 8,
      }}
      aria-hidden={!active}
      aria-label={`A physical stack containing ${AVATARS.length} rotating portraits of Mo`}
      className={styles.portraitDeck}
      initial={false}
      role="img"
      transition={{
        bounce: 0,
        duration: instant || reducedMotion ? 0 : 0.34,
        type: 'spring',
      }}
    >
      <span aria-hidden="true" className={styles.deckEdges}>
        {AVATARS.map((src, index) => (
          <span
            className={styles.deckEdge}
            key={src}
            style={{
              transform: `translate(${((index * 7) % 9) - 4}px, ${index * 0.78}px) rotate(${((index * 5) % 11 - 5) * 0.13}deg)`,
              zIndex: AVATARS.length - index,
            }}
          />
        ))}
      </span>
      <motion.img
        alt=""
        animate={{
          opacity: nextIsPromoting ? 1 : 0.94,
          rotate: nextIsPromoting ? -0.25 : -0.8,
          scale: nextIsPromoting ? 1 : 0.985,
          x: nextIsPromoting ? 0 : -2,
          y: nextIsPromoting ? 0 : 3,
        }}
        aria-hidden="true"
        className={styles.nextPortrait}
        height="1254"
        initial={false}
        loading="lazy"
        src={next}
        transition={{
          bounce: 0,
          duration: reducedMotion ? 0 : 0.58,
          type: 'spring',
        }}
        width="1254"
      />
      <motion.img
        alt=""
        animate={
          dealPhase === 'out'
            ? {
                opacity: 1,
                rotate: 3.6,
                scale: 1.005,
                x: '168%',
                y: -5,
              }
            : dealPhase === 'under'
              ? {
                  opacity: 1,
                  rotate: -1.1,
                  scale: 0.97,
                  x: 0,
                  y: 11,
                }
              : {
                opacity: 1,
                rotate: -0.25,
                scale: 1,
                x: 0,
                y: 0,
              }
        }
        aria-hidden="true"
        className={styles.topPortrait}
        height="1254"
        initial={false}
        key={current}
        loading="lazy"
        src={current}
        style={{ zIndex: dealPhase === 'under' ? 0 : 42 }}
        transition={
          dealPhase === 'out'
            ? {
                duration: reducedMotion ? 0 : 0.48,
                ease: [0.22, 1, 0.36, 1],
              }
            : dealPhase === 'under'
              ? {
                  duration: reducedMotion ? 0 : 0.54,
                  ease: [0.32, 0.72, 0, 1],
                }
              : { duration: 0 }
        }
        width="1254"
        onAnimationComplete={() => {
          if (!active) return

          if (dealPhase === 'out') {
            setDealPhase('under')
            return
          }

          if (dealPhase === 'under') {
            setAvatarIndex((index) => (index + 1) % AVATARS.length)
            setDealPhase('idle')
          }
        }}
      />
    </motion.div>
  )
}

function ConceptStage({ concept }: { concept: ConceptId }) {
  const [portraitActive, setPortraitActive] = useState(false)
  const [instant, setInstant] = useState(false)

  function reveal(keyboardInitiated: boolean) {
    setInstant(keyboardInitiated)
    setPortraitActive(true)
  }

  function hide() {
    setPortraitActive(false)
  }

  return (
    <article className={styles.stage}>
      <section className={styles.leftPanel}>
        <a aria-label="MO portfolio home" className={styles.logoDock} href="/">
          <AnimatedLogo animateOnMount={false} className={styles.logo} />
        </a>

        <div className={styles.gapStage}>
          <motion.div
            animate={{
              filter: portraitActive ? 'blur(2px)' : 'blur(0px)',
              opacity: portraitActive ? 0 : 1,
              scale: portraitActive ? 0.985 : 1,
            }}
            aria-hidden={portraitActive}
            className={styles.idleTreatment}
            initial={false}
            transition={{
              duration: instant ? 0 : 0.24,
              ease: [0.22, 1, 0.36, 1],
            }}
          >
            <IdleTreatment concept={concept} />
          </motion.div>
          <PortraitDeck active={portraitActive} instant={instant} />
        </div>

        <div className={styles.introduction}>
          <p className={styles.bio}>
            Hey, I&apos;m{' '}
            <button
              aria-expanded={portraitActive}
              aria-label={`Mo — reveal ${AVATARS.length} portrait cards`}
              className={styles.moTrigger}
              onBlur={hide}
              onClick={(event) => reveal(event.detail === 0)}
              onFocus={(event) => {
                if (!event.currentTarget.matches(':hover')) reveal(true)
              }}
              onPointerEnter={() => reveal(false)}
              onPointerLeave={hide}
              type="button"
            >
              Mo
            </button>
            . I love building products where every detail matters, from the
            overall experience to the last pixel. I enjoy turning thoughtful
            design into clean, polished interfaces that feel as good as they
            look.
          </p>
          <ContactActions />
        </div>
      </section>
      <section className={styles.workshopPanel}>
        <GlyphWorkshop />
      </section>
    </article>
  )
}

export function V14IdleGapLab() {
  const [concept, setConcept] = useState<ConceptId>('film-strip')
  const selected = CONCEPTS.find((item) => item.id === concept) ?? CONCEPTS[0]

  return (
    <MotionConfig reducedMotion="user">
      <main className={styles.page}>
        <header className={styles.labHeader}>
          <div>
            <a className={styles.backLink} href="/v14-exploration-lab">
              ← Original V14
            </a>
            <p>Idle-gap exploration</p>
            <h1>Give the pause a purpose.</h1>
          </div>
          <p>
            Five quiet treatments for the space between identity and
            introduction. Hover “Mo” in each to test the same {AVATARS.length}
            -card deck.
          </p>
        </header>

        <nav aria-label="Idle gap concepts" className={styles.conceptPicker}>
          {CONCEPTS.map((item) => (
            <button
              aria-pressed={concept === item.id}
              className={styles.conceptButton}
              key={item.id}
              onClick={() => setConcept(item.id)}
              type="button"
            >
              {item.name}
            </button>
          ))}
        </nav>

        <section
          aria-label={`${selected.name} preview`}
          className={styles.preview}
        >
          <ConceptStage concept={concept} key={concept} />
        </section>

        <footer className={styles.footer}>
          <div>
            <strong>{selected.name}</strong>
            <span>{selected.note}</span>
          </div>
          <a href="/v14-exploration-lab">Original remains unchanged ↗</a>
        </footer>
      </main>
    </MotionConfig>
  )
}
