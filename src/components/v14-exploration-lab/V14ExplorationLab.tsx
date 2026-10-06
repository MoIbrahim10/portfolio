import { MotionConfig, motion, useReducedMotion } from 'motion/react'
import { useEffect, useRef, useState } from 'react'

import { AnimatedLogo } from '#/components/brand/AnimatedLogo'

import { CrossAxisPresentationLab } from './CrossAxisPresentationLab'
import { CutCornerButton } from './CutCornerButton'
import styles from './V14ExplorationLab.module.css'

const LINKS = {
  cal: 'https://cal.com/mo-c0de/30min',
  email: 'mailto:dev.mo.ibrahim@gmail.com',
  github: 'https://github.com/MoIbrahim10',
  x: 'https://x.com/m0code',
}

const AVATARS = [
  '/avatar/mo-avatar-portrait-01-640.webp',
  '/avatar/mo-avatar-portrait-02-640.webp',
  '/avatar/mo-avatar-portrait-03-640.webp',
  '/avatar/mo-avatar-portrait-04-640.webp',
  '/avatar/mo-avatar-portrait-05-640.webp',
  '/avatar/mo-avatar-portrait-06-640.webp',
]

interface Direction {
  avatar: string
  id: 'wide-type'
  name: string
}

const DIRECTION: Direction = {
  avatar: '/avatar/mo-avatar-portrait-03-640.webp',
  id: 'wide-type',
  name: 'Wide Signal',
}

function SocialIcon({ name }: { name: 'email' | 'github' | 'x' }) {
  const props = {
    'aria-hidden': true,
    className: styles.socialIcon,
    'data-icon': name,
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
      <svg {...props} viewBox="0 0 1024 1024">
        <path
          clipRule="evenodd"
          d="M8 0C3.58 0 0 3.58 0 8C0 11.54 2.29 14.53 5.47 15.59C5.87 15.66 6.02 15.42 6.02 15.21C6.02 15.02 6.01 14.39 6.01 13.72C4 14.09 3.48 13.23 3.32 12.78C3.23 12.55 2.84 11.84 2.5 11.65C2.22 11.5 1.82 11.13 2.49 11.12C3.12 11.11 3.57 11.7 3.72 11.94C4.44 13.15 5.59 12.81 6.05 12.6C6.12 12.08 6.33 11.73 6.56 11.53C4.78 11.33 2.92 10.64 2.92 7.58C2.92 6.71 3.23 5.99 3.74 5.43C3.66 5.23 3.38 4.41 3.82 3.31C3.82 3.31 4.49 3.1 6.02 4.13C6.66 3.95 7.34 3.86 8.02 3.86C8.7 3.86 9.38 3.95 10.02 4.13C11.55 3.09 12.22 3.31 12.22 3.31C12.66 4.41 12.38 5.23 12.3 5.43C12.81 5.99 13.12 6.7 13.12 7.58C13.12 10.65 11.25 11.33 9.47 11.53C9.76 11.78 10.01 12.26 10.01 13.01C10.01 14.08 10 14.94 10 15.21C10 15.42 10.15 15.67 10.55 15.59C13.71 14.53 16 11.53 16 8C16 3.58 12.42 0 8 0Z"
          fill="currentColor"
          fillRule="evenodd"
          stroke="none"
          transform="scale(64)"
        />
      </svg>
    )
  }

  return (
    <svg {...props}>
      <path
        d="M14.234 10.162 22.977 0h-2.072l-7.591 8.824L7.251 0H.258l9.168 13.343L.258 24H2.33l8.016-9.318L16.749 24h6.993zm-2.837 3.299-.929-1.329L3.076 1.56h3.182l5.965 8.532.929 1.329 7.754 11.09h-3.182z"
        fill="currentColor"
        stroke="none"
      />
    </svg>
  )
}

function SocialLink({
  href,
  label,
  name,
}: {
  href: string
  label: string
  name: 'email' | 'github' | 'x'
}) {
  const external = href.startsWith('https://')

  return (
    <CutCornerButton
      aria-label={label}
      className={styles.socialLink}
      href={href}
      rel={external ? 'noreferrer' : undefined}
      target={external ? '_blank' : undefined}
      variant="paper"
    >
      <SocialIcon name={name} />
    </CutCornerButton>
  )
}

function ContactActions() {
  return (
    <div className={styles.contactActions}>
      <div className={styles.entranceItem}>
        <CutCornerButton
          className={styles.callButton}
          href={LINKS.cal}
          rel="noreferrer"
          target="_blank"
          variant="navy"
        >
          Schedule a call
        </CutCornerButton>
      </div>
      <nav
        aria-label="Contact links"
        className={`${styles.socials} ${styles.entranceItem}`}
      >
        <SocialLink href={LINKS.x} label="X profile" name="x" />
        <SocialLink href={LINKS.email} label="Email Mo" name="email" />
        <SocialLink href={LINKS.github} label="GitHub profile" name="github" />
        <CutCornerButton className={styles.feedbackLink} href="/feedback" variant="paper">
          <svg aria-hidden="true" viewBox="0 0 24 18" fill="none">
            <path d="M1 1h22v16H1zM15 4v10M4 6h7M4 9h7M4 12h4M18 4h2v3h-2z" />
          </svg>
          Leave a note
        </CutCornerButton>
      </nav>
    </div>
  )
}

function MoReveal({ direction }: { direction: Direction }) {
  const initialAvatarIndex = Math.max(0, AVATARS.indexOf(direction.avatar))
  const [avatarIndex, setAvatarIndex] = useState(initialAvatarIndex)
  const [dealPhase, setDealPhase] = useState<'idle' | 'out' | 'under'>('idle')
  const [instant, setInstant] = useState(false)
  const [visible, setVisible] = useState(false)
  const pointerInsideRef = useRef(false)
  const reducedMotion = useReducedMotion()

  function reveal(keyboardInitiated: boolean) {
    setInstant(keyboardInitiated)
    setVisible(true)
  }

  function hide() {
    setVisible(false)
  }

  function handlePointerEnter() {
    if (pointerInsideRef.current) return

    pointerInsideRef.current = true
    setAvatarIndex((index) => (index + 1) % AVATARS.length)
    setDealPhase('idle')
    reveal(false)
  }

  function handlePointerLeave() {
    pointerInsideRef.current = false
    hide()
  }

  useEffect(() => {
    if (!visible) {
      const resetTimer = window.setTimeout(() => setDealPhase('idle'), 520)
      return () => window.clearTimeout(resetTimer)
    }

    if (instant || reducedMotion) return

    const cycleTimer = window.setInterval(() => {
      setDealPhase((current) => (current === 'idle' ? 'out' : current))
    }, 4000)

    return () => window.clearInterval(cycleTimer)
  }, [instant, reducedMotion, visible])

  const current = AVATARS[avatarIndex]
  const next = AVATARS[(avatarIndex + 1) % AVATARS.length]
  const nextIsPromoting = dealPhase !== 'idle'

  return (
    <span className={styles.moWrap}>
      <button
        aria-expanded={visible}
        aria-label="Mo — reveal portrait"
        className={styles.moTrigger}
        onBlur={hide}
        onClick={(event) => reveal(event.detail === 0)}
        onFocus={(event) => {
          if (!event.currentTarget.matches(':hover')) reveal(true)
        }}
        onPointerEnter={handlePointerEnter}
        onPointerLeave={handlePointerLeave}
        type="button"
      >
        Mo
      </button>
      <motion.span
        animate={{
          filter: visible ? 'blur(0px)' : 'blur(3px)',
          opacity: visible ? 1 : 0,
          y: visible ? 0 : 8,
        }}
        aria-hidden={!visible}
        aria-label={`A physical stack containing ${AVATARS.length} rotating portraits of Mo`}
        className={styles.moPortrait}
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
        {visible ? (
          <>
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
              height="640"
              initial={false}
              src={next}
              transition={{
                bounce: 0,
                duration: reducedMotion ? 0 : 0.58,
                type: 'spring',
              }}
              width="640"
            />
            <motion.img
              alt=""
              animate={
                dealPhase === 'out'
                  ? {
                      opacity: 1,
                      rotate: 3.6,
                      scale: 1.005,
                      x: '128%',
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
              height="640"
              initial={false}
              key={current}
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
              width="640"
              onAnimationComplete={() => {
                if (!visible) return

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
          </>
        ) : null}
      </motion.span>
    </span>
  )
}

function HeroStage({
  direction,
}: {
  direction: Direction
}) {
  return (
    <article
      aria-label="Mo Ibrahim portfolio"
      className={styles.stage}
      data-direction={direction.id}
    >
      <div
        className={`${styles.leftPanel} ${styles.entrancePanel}`}
        data-direction={direction.id}
      >
        <a
          aria-label="MO portfolio home"
          className={`${styles.logoDock} ${styles.entranceLogo}`}
          href="/"
        >
          <AnimatedLogo className={styles.logo} />
        </a>

        <div className={styles.introduction}>
          <h1
            className={`${styles.role} ${styles.entranceItem}`}
          >
            <span className={styles.visuallyHidden}>Mo Ibrahim — </span>
            Product Engineer
          </h1>
          <p
            className={`${styles.bio} ${styles.entranceItem}`}
          >
            Hey, I&apos;m <MoReveal direction={direction} />. I love building
            products where every detail matters, from the overall experience to
            the last pixel. I enjoy turning thoughtful design into clean,
            polished interfaces that feel as good as they look.
          </p>
          <ContactActions />
        </div>
      </div>
      <div
        className={`${styles.showcasePanel} ${styles.entranceShowcase}`}
      >
        <CrossAxisPresentationLab />
      </div>
    </article>
  )
}

export function V14ExplorationLab() {
  return (
    <MotionConfig reducedMotion="user">
      <main className={styles.page}>
        <HeroStage direction={DIRECTION} />
      </main>
    </MotionConfig>
  )
}
