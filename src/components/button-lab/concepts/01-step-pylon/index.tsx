import { motion, useReducedMotion } from 'motion/react'
import {
  type ComponentPropsWithoutRef,
  type ReactNode,
  useEffect,
  useRef,
  useState,
} from 'react'

import styles from './StepPylonSystem.module.css'

export const stepPylonMetadata = {
  id: '01-step-pylon',
  name: 'Monumental Step Pylon',
  direction:
    'Pixel-stepped Egyptian gateway silhouettes with navy planes, gold light edges, and a restrained red pressed-depth edge.',
  skill: {
    name: 'none',
    reason:
      'The relevant skills.sh installer writes to shared agent-skill directories, which would violate this agent’s isolated-folder constraint.',
    searchedCandidate: {
      name: 'frontend-design-system',
      url: 'https://www.skills.sh/supercent-io/skills-template/frontend-design-system',
    },
  },
} as const

type ButtonVariant = 'primary' | 'secondary' | 'outline' | 'ghost' | 'cta'
type DemoState = 'hover' | 'focus' | 'pressed'

interface PylonButtonProps
  extends Omit<ComponentPropsWithoutRef<typeof motion.button>, 'children'> {
  children: ReactNode
  demoState?: DemoState
  icon?: ReactNode
  loading?: boolean
  loadingLabel?: string
  variant?: ButtonVariant
}

function PylonButton({
  children,
  className = '',
  demoState,
  disabled = false,
  icon,
  loading = false,
  loadingLabel = 'Working…',
  type = 'button',
  variant = 'primary',
  ...props
}: PylonButtonProps) {
  const reduceMotion = useReducedMotion()
  const isUnavailable = disabled || loading

  return (
    <motion.button
      {...props}
      aria-busy={loading || undefined}
      className={`${styles.pylonButton} ${styles[variant]} ${className}`}
      data-demo-state={demoState}
      disabled={isUnavailable}
      type={type}
      whileHover={
        isUnavailable || reduceMotion || demoState ? undefined : { y: -2 }
      }
      whileTap={
        isUnavailable || reduceMotion || demoState ? undefined : { y: 1 }
      }
    >
      <span className={styles.surface}>
        <span className={loading ? styles.hiddenContent : styles.content}>
          {icon ? <span className={styles.leadingIcon}>{icon}</span> : null}
          <span>{children}</span>
        </span>
        {loading ? (
          <span className={styles.loadingContent}>
            <span aria-hidden="true" className={styles.spinner} />
            <span>{loadingLabel}</span>
          </span>
        ) : null}
      </span>
    </motion.button>
  )
}

interface PylonLinkProps
  extends Omit<ComponentPropsWithoutRef<typeof motion.a>, 'children'> {
  children: ReactNode
  iconOnly?: boolean
  variant?: ButtonVariant
}

function PylonLink({
  children,
  className = '',
  iconOnly = false,
  variant = 'outline',
  ...props
}: PylonLinkProps) {
  const reduceMotion = useReducedMotion()

  return (
    <motion.a
      {...props}
      className={`${styles.pylonButton} ${styles[variant]} ${
        iconOnly ? styles.iconOnly : ''
      } ${className}`}
      whileHover={reduceMotion ? undefined : { y: -2 }}
      whileTap={reduceMotion ? undefined : { y: 1 }}
    >
      <span className={styles.surface}>
        <span className={styles.content}>{children}</span>
      </span>
    </motion.a>
  )
}

interface IconProps {
  name: 'arrow' | 'calendar' | 'download' | 'email' | 'github' | 'spark' | 'x'
}

function Icon({ name }: IconProps) {
  const common = {
    'aria-hidden': true,
    className: styles.icon,
    fill: 'none',
    viewBox: '0 0 24 24',
  } as const

  switch (name) {
    case 'arrow':
      return (
        <svg {...common}>
          <path d="M5 12h13M13 6l6 6-6 6" />
        </svg>
      )
    case 'calendar':
      return (
        <svg {...common}>
          <path d="M5 4.5h14v15H5zM8 2.5v4M16 2.5v4M5 9h14" />
          <path d="m10 14 1.5 1.5L15 12" />
        </svg>
      )
    case 'download':
      return (
        <svg {...common}>
          <path d="M12 3v11m-4-4 4 4 4-4M5 19h14" />
        </svg>
      )
    case 'email':
      return (
        <svg {...common}>
          <path d="M3.5 6.5h17v12h-17zM4 7l8 6 8-6" />
        </svg>
      )
    case 'github':
      return (
        <svg {...common}>
          <path d="M8.5 19.5c-4 1.2-4-2-5.5-2.5m11 4v-3.1c0-.9.3-1.6.9-2.1 3-.3 6.1-1.5 6.1-6.7A5.2 5.2 0 0 0 19.6 5c.1-.9 0-2.1-.5-3.5 0 0-1.1-.4-4.2 1.6a14.7 14.7 0 0 0-7.7 0C4.1 1.1 3 1.5 3 1.5A5.8 5.8 0 0 0 2.5 5a5.2 5.2 0 0 0-1.4 4.1c0 5.2 3.1 6.4 6.1 6.7.5.4.8 1 .8 1.8v3.3" />
        </svg>
      )
    case 'spark':
      return (
        <svg {...common}>
          <path d="m12 2 1.6 6.4L20 10l-6.4 1.6L12 18l-1.6-6.4L4 10l6.4-1.6L12 2Z" />
        </svg>
      )
    case 'x':
      return (
        <svg {...common}>
          <path d="m5 4 14 16M19 4 5 20" />
        </svg>
      )
  }
}

const STATE_SPECIMENS: Array<{
  label: string
  props: Pick<PylonButtonProps, 'demoState' | 'disabled' | 'loading'>
}> = [
  { label: 'Default', props: {} },
  { label: 'Hover', props: { demoState: 'hover' } },
  { label: 'Focus-visible', props: { demoState: 'focus' } },
  { label: 'Pressed', props: { demoState: 'pressed' } },
  { label: 'Disabled', props: { disabled: true } },
  { label: 'Loading', props: { loading: true } },
]

export function StepPylonSystem() {
  const [isScheduling, setIsScheduling] = useState(false)
  const [status, setStatus] = useState('')
  const timerRef = useRef<number | undefined>(undefined)

  useEffect(
    () => () => {
      if (timerRef.current !== undefined) window.clearTimeout(timerRef.current)
    },
    [],
  )

  function scheduleCall() {
    if (isScheduling) return

    setStatus('')
    setIsScheduling(true)
    timerRef.current = window.setTimeout(() => {
      setIsScheduling(false)
      setStatus('Calendar ready. Choose a time that suits you.')
    }, 1100)
  }

  return (
    <section className={styles.lab} aria-labelledby="step-pylon-title">
      <div aria-hidden="true" className={styles.sunDisc}>
        <span />
      </div>

      <header className={styles.header}>
        <p className={styles.kicker}>Button study 01 · Architectural controls</p>
        <div className={styles.titleLockup}>
          <span aria-hidden="true" className={styles.pylonMark} />
          <div>
            <h2 id="step-pylon-title">Monumental Step Pylon</h2>
            <p>
              Clear actions shaped like gateways: calm navy mass, a lit gold
              threshold, and one red layer revealed under pressure.
            </p>
          </div>
        </div>
      </header>

      <div className={styles.demoGrid}>
        <article className={styles.panel}>
          <div className={styles.panelHeading}>
            <span>01</span>
            <div>
              <h3>Action hierarchy</h3>
              <p>Six weights, one silhouette.</p>
            </div>
          </div>

          <div className={styles.actionStack}>
            <PylonButton icon={<Icon name="arrow" />} variant="primary">
              View selected work
            </PylonButton>
            <PylonButton variant="secondary">Explore the archive</PylonButton>
            <PylonButton icon={<Icon name="download" />} variant="outline">
              Download résumé
            </PylonButton>
            <PylonButton variant="ghost">Copy project link</PylonButton>
          </div>

          <div className={styles.socialBlock}>
            <p>Open channels</p>
            <div className={styles.socials}>
              <PylonLink
                aria-label="Follow on X"
                href="https://x.com/"
                iconOnly
                rel="noreferrer"
                target="_blank"
              >
                <Icon name="x" />
              </PylonLink>
              <PylonLink
                aria-label="View GitHub profile"
                href="https://github.com/"
                iconOnly
                rel="noreferrer"
                target="_blank"
              >
                <Icon name="github" />
              </PylonLink>
              <PylonLink
                aria-label="Send an email"
                href="mailto:hello@example.com"
                iconOnly
              >
                <Icon name="email" />
              </PylonLink>
            </div>
          </div>
        </article>

        <article className={`${styles.panel} ${styles.ctaPanel}`}>
          <div className={styles.panelHeading}>
            <span>02</span>
            <div>
              <h3>Solar threshold</h3>
              <p>A decisive invitation, never a banner.</p>
            </div>
          </div>

          <div className={styles.ctaContent}>
            <div aria-hidden="true" className={styles.rayGlyph}>
              <span />
            </div>
            <p className={styles.ctaEyebrow}>Have a difficult idea?</p>
            <h3>Let’s give it a strong entrance.</h3>
            <p className={styles.ctaCopy}>
              A focused 30-minute conversation for products, identities, and
              digital experiences.
            </p>
            <PylonButton
              className={styles.scheduleButton}
              icon={<Icon name="calendar" />}
              loading={isScheduling}
              loadingLabel="Opening calendar…"
              onClick={scheduleCall}
              variant="cta"
            >
              Schedule a call
            </PylonButton>
            <p aria-live="polite" className={styles.status}>
              {status}
            </p>
          </div>
        </article>
      </div>

      <article className={`${styles.panel} ${styles.statesPanel}`}>
        <div className={styles.panelHeading}>
          <span>03</span>
          <div>
            <h3>Interaction strata</h3>
            <p>Every state remains legible and occupies the same footprint.</p>
          </div>
        </div>

        <div className={styles.stateGrid}>
          {STATE_SPECIMENS.map(({ label, props }) => (
            <div className={styles.specimen} key={label}>
              <span className={styles.stateLabel}>{label}</span>
              <PylonButton
                {...props}
                icon={label === 'Loading' ? <Icon name="spark" /> : undefined}
                loadingLabel="Carving…"
              >
                Create route
              </PylonButton>
            </div>
          ))}
        </div>
      </article>

      <p className={styles.note}>
        Native controls · 44px minimum targets · keyboard focus · reduced-motion
        aware
      </p>
    </section>
  )
}
