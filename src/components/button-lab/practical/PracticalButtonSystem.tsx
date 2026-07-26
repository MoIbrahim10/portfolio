import {
  type AnchorHTMLAttributes,
  type ButtonHTMLAttributes,
  type ReactNode,
  useEffect,
  useRef,
  useState,
} from 'react'

import styles from './PracticalButtonSystem.module.css'

export type PracticalTheme =
  | 'gilded-relief'
  | 'obsidian-cut'
  | 'pressed-seal'
  | 'red-seal'

type ButtonVariant = 'primary' | 'secondary' | 'outline' | 'ghost' | 'cta'
type DemoState = 'default' | 'hover' | 'focus' | 'active' | 'disabled' | 'loading'
type IconName =
  | 'arrow'
  | 'calendar'
  | 'copy'
  | 'email'
  | 'github'
  | 'spark'
  | 'x'

interface PracticalButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  children: ReactNode
  demoState?: DemoState
  icon?: IconName
  iconOnly?: boolean
  loading?: boolean
  loadingLabel?: string
  variant?: ButtonVariant
}

interface PracticalLinkProps extends AnchorHTMLAttributes<HTMLAnchorElement> {
  children: ReactNode
  icon: IconName
}

interface PracticalButtonSystemProps {
  description: string
  name: string
  number: string
  theme: PracticalTheme
}

function Icon({ name }: { name: IconName }) {
  const props = {
    'aria-hidden': true,
    className: styles.icon,
    fill: 'none',
    focusable: false,
    viewBox: '0 0 24 24',
  } as const

  switch (name) {
    case 'arrow':
      return (
        <svg {...props}>
          <path d="M5 12h13M13 7l5 5-5 5" />
        </svg>
      )
    case 'calendar':
      return (
        <svg {...props}>
          <path d="M5 4.5h14v15H5zM8 2.5v4M16 2.5v4M5 9h14" />
          <path d="m9 14 2 2 4-4" />
        </svg>
      )
    case 'copy':
      return (
        <svg {...props}>
          <rect height="11" width="11" x="8" y="8" />
          <path d="M16 8V5H5v11h3" />
        </svg>
      )
    case 'email':
      return (
        <svg {...props}>
          <path d="M3.5 6.5h17v12h-17zM4 7l8 6 8-6" />
        </svg>
      )
    case 'github':
      return (
        <svg {...props}>
          <path
            d="M12 2.8a9.4 9.4 0 0 0-3 18.3c.47.1.64-.2.64-.45V19c-2.59.56-3.14-1.1-3.14-1.1-.42-1.08-1.03-1.37-1.03-1.37-.85-.58.06-.57.06-.57.94.07 1.43.96 1.43.96.84 1.44 2.2 1.02 2.73.78.09-.6.33-1.01.6-1.25-2.07-.24-4.24-1.04-4.24-4.63 0-1.02.36-1.86.96-2.51-.09-.24-.42-1.19.1-2.47 0 0 .78-.25 2.58.96A8.9 8.9 0 0 1 12 7.5a8.9 8.9 0 0 1 2.35.32c1.8-1.21 2.58-.96 2.58-.96.52 1.28.19 2.23.1 2.47.6.65.96 1.49.96 2.51 0 3.6-2.19 4.38-4.27 4.62.34.29.63.86.63 1.73v2.47c0 .25.17.54.65.45A9.4 9.4 0 0 0 12 2.8Z"
            fill="currentColor"
            stroke="none"
          />
        </svg>
      )
    case 'spark':
      return (
        <svg {...props}>
          <path d="m12 3 1.4 5.6L19 10l-5.6 1.4L12 17l-1.4-5.6L5 10l5.6-1.4L12 3Z" />
        </svg>
      )
    case 'x':
      return (
        <svg {...props}>
          <path d="m5 4 14 16M19 4 5 20" />
        </svg>
      )
  }
}

function PracticalButton({
  children,
  className,
  demoState = 'default',
  disabled,
  icon,
  iconOnly = false,
  loading = false,
  loadingLabel = 'Working',
  type = 'button',
  variant = 'primary',
  ...props
}: PracticalButtonProps) {
  const busy = loading || demoState === 'loading'
  const unavailable = disabled || demoState === 'disabled' || busy
  const classes = [
    styles.control,
    styles[variant],
    iconOnly ? styles.iconOnly : '',
    className ?? '',
  ]
    .filter(Boolean)
    .join(' ')

  return (
    <button
      {...props}
      aria-busy={busy || undefined}
      className={classes}
      data-state={demoState}
      disabled={unavailable}
      type={type}
    >
      <span className={styles.controlContent}>
        {icon ? <Icon name={icon} /> : null}
        {iconOnly ? <span className={styles.visuallyHidden}>{children}</span> : children}
      </span>
      {busy ? (
        <span aria-hidden="true" className={styles.loadingContent}>
          <span className={styles.loader} />
          {loadingLabel}
        </span>
      ) : null}
    </button>
  )
}

function PracticalLink({ children, className, icon, ...props }: PracticalLinkProps) {
  return (
    <a {...props} className={`${styles.control} ${styles.outline} ${styles.contact} ${className ?? ''}`}>
      <Icon name={icon} />
      <span>{children}</span>
    </a>
  )
}

const STATES: Array<{ label: string; state: DemoState }> = [
  { label: 'Default', state: 'default' },
  { label: 'Hover', state: 'hover' },
  { label: 'Focus', state: 'focus' },
  { label: 'Pressed', state: 'active' },
  { label: 'Disabled', state: 'disabled' },
  { label: 'Loading', state: 'loading' },
]

export function PracticalButtonSystem({
  description,
  name,
  number,
  theme,
}: PracticalButtonSystemProps) {
  const [loading, setLoading] = useState(false)
  const [status, setStatus] = useState('')
  const timer = useRef<number | undefined>(undefined)
  const titleId = `${theme}-title`
  const isCutFamily = theme === 'obsidian-cut' || theme === 'gilded-relief'
  const scheduleLabel = isCutFamily ? 'Schedule a Call' : 'Schedule a call'
  const ctaEyebrow = isCutFamily ? 'A clear next step' : 'Ready when you are'
  const ctaTitle = isCutFamily ? 'Make room for the right idea.' : 'Give the next move a clear signal.'
  const ctaCopy = isCutFamily
    ? 'A focused conversation for shaping a product, identity, or digital experience.'
    : 'A focused 30-minute conversation for products that need clarity and momentum.'

  useEffect(
    () => () => {
      if (timer.current !== undefined) window.clearTimeout(timer.current)
    },
    [],
  )

  function scheduleCall() {
    if (loading) return
    setLoading(true)
    setStatus('')
    timer.current = window.setTimeout(() => {
      setLoading(false)
      setStatus('Calendar ready.')
    }, 900)
  }

  return (
    <section className={styles.system} data-theme={theme} aria-labelledby={titleId}>
      <header className={styles.header}>
        <p className={styles.kicker}>Button study {number} · Finalist controls</p>
        <div className={styles.titleLockup}>
          <span aria-hidden="true" className={styles.themeMark} />
          <div>
            <h2 id={titleId}>{name}</h2>
            <p className={styles.description}>{description}</p>
          </div>
        </div>
      </header>

      <div className={styles.showcaseGrid}>
        <article aria-labelledby={`${theme}-set`} className={styles.panel}>
          <div className={styles.panelHeading}>
            <span>01</span>
            <div>
              <h3 id={`${theme}-set`}>Action hierarchy</h3>
              <p>Five weights, one clear family.</p>
            </div>
          </div>
          <div className={styles.actionRow}>
            <PracticalButton>Primary</PracticalButton>
            <PracticalButton variant="secondary">Secondary</PracticalButton>
            <PracticalButton variant="outline">Outline</PracticalButton>
            <PracticalButton variant="ghost">Ghost</PracticalButton>
            <PracticalButton aria-label="Open selected project" icon="arrow" iconOnly variant="outline">
              Open selected project
            </PracticalButton>
          </div>
          <div className={styles.socialBlock}>
            <p>Open channels</p>
            <div className={styles.contactRow}>
              <PracticalLink href="https://github.com/" icon="github" rel="noreferrer" target="_blank">GitHub</PracticalLink>
              <PracticalLink href="mailto:hello@example.com" icon="email">Email</PracticalLink>
              <PracticalLink href="https://x.com/" icon="x" rel="noreferrer" target="_blank">X</PracticalLink>
            </div>
          </div>
        </article>

        <article className={`${styles.panel} ${styles.ctaPanel}`}>
          <div className={styles.panelHeading}>
            <span>02</span>
            <div>
              <h3>Focused invitation</h3>
              <p>One decisive action, given room to breathe.</p>
            </div>
          </div>
          <div className={styles.ctaContent}>
            <span aria-hidden="true" className={styles.ctaGlyph} />
            <p className={styles.ctaEyebrow}>{ctaEyebrow}</p>
            <h3>{ctaTitle}</h3>
            <p className={styles.ctaCopy}>{ctaCopy}</p>
            <PracticalButton
              className={styles.schedule}
              icon="calendar"
              loading={loading}
              loadingLabel="Opening"
              onClick={scheduleCall}
              variant="cta"
            >
              {scheduleLabel}
            </PracticalButton>
            <p aria-live="polite" className={styles.status}>{status}</p>
          </div>
        </article>
      </div>

      <article aria-labelledby={`${theme}-states`} className={`${styles.panel} ${styles.statesPanel}`}>
        <div className={styles.panelHeading}>
          <span>03</span>
          <div>
            <h3 id={`${theme}-states`}>Interaction states</h3>
            <p>Every state keeps the same silhouette and footprint.</p>
          </div>
        </div>
        <div className={styles.stateGrid}>
          {STATES.map(({ label, state }) => (
            <div className={styles.state} key={state}>
              <span>{label}</span>
              <PracticalButton demoState={state} loadingLabel="Loading">
                Open project
              </PracticalButton>
            </div>
          ))}
        </div>
      </article>

      <footer className={styles.footer}>
        <span>Native controls</span>
        <span>44px minimum</span>
        <span>Reduced motion</span>
        <span>Stable loading</span>
      </footer>
    </section>
  )
}
