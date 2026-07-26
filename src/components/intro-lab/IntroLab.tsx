import { AnimatePresence, MotionConfig, motion, useReducedMotion } from 'motion/react'
import { type ComponentType, useEffect, useRef, useState } from 'react'

import { AnimatedLogo } from '#/components/brand/AnimatedLogo'
import { CutCornerButton } from '#/components/project-lab/shared/CutCornerButton'

import styles from './IntroLab.module.css'

const BIO =
  "Hey, I'm Mo. I love building products where every detail matters, from the overall experience to the last pixel. I enjoy turning thoughtful design into clean, polished interfaces that feel as good as they look."

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

interface Direction {
  Component: ComponentType
  description: string
  id: string
  name: string
}

function Logo({ className = '' }: { className?: string }) {
  return (
    <a aria-label="MO portfolio home" className={styles.logoLink} href="/">
      <AnimatedLogo
        animateOnMount={false}
        className={`${styles.logo} ${className}`}
      />
    </a>
  )
}

type HeaderIconName = 'email' | 'github' | 'x'

function HeaderIcon({ name }: { name: HeaderIconName }) {
  const props = {
    'aria-hidden': true,
    className: styles.headerIcon,
    fill: 'none',
    focusable: false,
    viewBox: '0 0 24 24',
  } as const

  switch (name) {
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
    case 'x':
      return (
        <svg {...props}>
          <path d="m5 4 14 16M19 4 5 20" />
        </svg>
      )
  }
}

interface HeaderActionProps {
  children?: string
  className?: string
  href: string
  icon?: HeaderIconName
  label: string
}

function HeaderAction({
  children,
  className = '',
  href,
  icon,
  label,
}: HeaderActionProps) {
  const external = href.startsWith('https://')
  const classes = `${styles.headerControl} ${children ? styles.scheduleControl : styles.iconControl} ${className}`
  const content = (
    <>
      {icon ? <HeaderIcon name={icon} /> : null}
      {children ? <span>{children}</span> : null}
    </>
  )

  return (
    <CutCornerButton
      aria-label={label}
      className={classes}
      href={href}
      rel={external ? 'noreferrer' : undefined}
      target={external ? '_blank' : undefined}
      variant="paper"
    >
      {content}
    </CutCornerButton>
  )
}

function HeaderActions({ className = '' }: { className?: string }) {
  return (
    <nav aria-label="Contact links" className={`${styles.headerActions} ${className}`}>
      <HeaderAction href={LINKS.x} icon="x" label="X profile" />
      <HeaderAction href={LINKS.email} icon="email" label="Email Mo" />
      <HeaderAction href={LINKS.github} icon="github" label="GitHub profile" />
      <HeaderAction
        href={LINKS.cal}
        label="Schedule a call"
      >
        Schedule a call
      </HeaderAction>
    </nav>
  )
}

function MinimalHeader({ className }: { className: string }) {
  return (
    <header className={`${styles.creativeHeader} ${styles.minimalHeader} ${className}`}>
      <Logo className={styles.navyLogo} />
      <HeaderActions />
    </header>
  )
}

function HeaderGalleryLine() {
  return <MinimalHeader className={styles.headerV01} />
}

function HeaderSplitLedger() {
  return <MinimalHeader className={styles.headerV02} />
}

function HeaderFloatingCapsule() {
  return <MinimalHeader className={styles.headerV03} />
}

function HeaderCornerIndex() {
  return <MinimalHeader className={styles.headerV04} />
}

function HeaderEditorialMasthead() {
  return <MinimalHeader className={styles.headerV05} />
}

function HeaderStatusTicker() {
  return <MinimalHeader className={styles.headerV06} />
}

function HeaderSolarOrbit() {
  return <MinimalHeader className={styles.headerV07} />
}

function HeaderFoldedRibbon() {
  return <MinimalHeader className={styles.headerV08} />
}

function HeaderCommandStrip() {
  return <MinimalHeader className={styles.headerV09} />
}

function HeaderAvatarSignature() {
  return <MinimalHeader className={styles.headerV10} />
}

function AvatarMoWord() {
  const [avatarIndex, setAvatarIndex] = useState(0)
  const [visible, setVisible] = useState(false)
  const reducedMotion = useReducedMotion()

  function showNext() {
    setAvatarIndex((current) => (current + 1) % AVATARS.length)
    setVisible(true)
  }

  return (
    <button
      aria-expanded={visible}
      aria-label="Mo — show another portrait"
      className={styles.avatarWord}
      onBlur={() => setVisible(false)}
      onClick={showNext}
      onFocus={showNext}
      onPointerEnter={showNext}
      onPointerLeave={() => setVisible(false)}
      type="button"
    >
      Mo
      <AnimatePresence mode="wait">
        {visible ? (
          <motion.span
            animate={{ opacity: 1, rotate: -3, scale: 1, y: 0 }}
            className={styles.avatarWordImage}
            exit={{ opacity: 0, rotate: 3, scale: 0.94, y: 8 }}
            initial={
              reducedMotion
                ? false
                : { opacity: 0, rotate: 5, scale: 0.92, y: 12 }
            }
            key={AVATARS[avatarIndex]}
            transition={{ duration: reducedMotion ? 0 : 0.2 }}
          >
            <img
              alt={`Voxel portrait of Mo, variation ${avatarIndex + 1}`}
              height="1256"
              loading="lazy"
              src={AVATARS[avatarIndex]}
              width="1256"
            />
            <small>{String(avatarIndex + 1).padStart(2, '0')} / 10</small>
          </motion.span>
        ) : null}
      </AnimatePresence>
    </button>
  )
}

function HeroHoverPortrait() {
  return (
    <section className={styles.hero01}>
      <p className={styles.heroRole}>Design engineer · Full-stack builder</p>
      <h2>Hey, I’m <AvatarMoWord />.</h2>
      <p className={styles.heroBio}>{BIO}</p>
      <div className={styles.heroActions}>
        <CutCornerButton href={LINKS.cal} variant="navy">
          Schedule a call
        </CutCornerButton>
        <span>Hover or tap “Mo”</span>
      </div>
    </section>
  )
}

function HeroSplitManifesto() {
  return (
    <section className={styles.hero02}>
      <div className={styles.splitRole}>
        <span>01</span>
        <p>Mo Ibrahim<br />Design engineer<br />Full-stack</p>
      </div>
      <div className={styles.splitCopy}>
        <p>{BIO}</p>
        <CutCornerButton href={LINKS.cal} variant="gold">
          Schedule a call
        </CutCornerButton>
      </div>
      <p aria-hidden="true" className={styles.splitWord}>DETAIL</p>
    </section>
  )
}

function HeroTypographicStack() {
  return (
    <section className={styles.hero03}>
      <div aria-hidden="true" className={styles.stackWords}>
        <span>DESIGN</span>
        <span>BUILD</span>
        <span>POLISH</span>
      </div>
      <div className={styles.stackCopy}>
        <p className={styles.heroRole}>Mo Ibrahim · Design engineer / Full-stack</p>
        <p>{BIO}</p>
        <CutCornerButton href={LINKS.cal} variant="paper">
          Schedule a call
        </CutCornerButton>
      </div>
    </section>
  )
}

function HeroContactSheet() {
  return (
    <section className={styles.hero04}>
      <div className={styles.contactCopy}>
        <p className={styles.heroRole}>Design engineer · Full-stack</p>
        <h2>Many angles.<br />One careful builder.</h2>
        <p>{BIO}</p>
        <CutCornerButton href={LINKS.cal} variant="navy">
          Schedule a call
        </CutCornerButton>
      </div>
      <div aria-label="Portrait studies of Mo" className={styles.avatarSheet}>
        {AVATARS.slice(0, 6).map((avatar, index) => (
          <motion.img
            alt={`Voxel portrait study of Mo, ${index + 1} of 6`}
            height="1256"
            key={avatar}
            loading="lazy"
            src={avatar}
            whileHover={{ scale: 1.08, rotate: index % 2 ? 2 : -2, zIndex: 2 }}
            width="1256"
          />
        ))}
      </div>
    </section>
  )
}

function HeroTerminal() {
  return (
    <section className={styles.hero05}>
      <div className={styles.terminalTop}>
        <span /><span /><span />
        <code>mo-profile.ts</code>
      </div>
      <div className={styles.terminalBody}>
        <code><span>const</span> mo = {'{'}</code>
        <p><b>role:</b> "Design engineer · Full-stack",</p>
        <p><b>about:</b> "{BIO}"</p>
        <code>{'}'}</code>
        <CutCornerButton href={LINKS.cal} variant="gold">
          run(schedule_call)
        </CutCornerButton>
      </div>
    </section>
  )
}

function HeroEditorialProfile() {
  return (
    <section className={styles.hero06}>
      <figure>
        <img
          alt="Voxel portrait of Mo in a black hoodie"
          height="1256"
          loading="lazy"
          src={AVATARS[2]}
          width="1256"
        />
        <figcaption>Mo Ibrahim · Cairo</figcaption>
      </figure>
      <div className={styles.editorialCopy}>
        <p className={styles.heroRole}>Profile 001 · Design engineer / Full-stack</p>
        <h2>Care is a technical skill.</h2>
        <p>{BIO}</p>
        <CutCornerButton href={LINKS.cal} variant="navy">
          Schedule a call
        </CutCornerButton>
      </div>
      <span aria-hidden="true" className={styles.editorialFolio}>MO—26</span>
    </section>
  )
}

function HeroSolarPortrait() {
  return (
    <section className={styles.hero07}>
      <div className={styles.solarPortrait}>
        <span aria-hidden="true" />
        <img
          alt="Voxel portrait of Mo wearing headphones"
          height="1256"
          loading="lazy"
          src={AVATARS[5]}
          width="1256"
        />
        <small>Design<br />Engineer</small>
      </div>
      <div className={styles.solarCopy}>
        <p className={styles.heroRole}>Full-stack product builder</p>
        <h2>From the whole experience to the last pixel.</h2>
        <p>{BIO}</p>
        <CutCornerButton href={LINKS.cal} variant="paper">
          Schedule a call
        </CutCornerButton>
      </div>
    </section>
  )
}

function HeroModularBlocks() {
  return (
    <section className={styles.hero08}>
      <div className={styles.moduleTitle}>
        <p className={styles.heroRole}>Mo Ibrahim</p>
        <h2>Thoughtful products.<br />Clean interfaces.</h2>
      </div>
      <div className={styles.moduleRole}>
        <span>Role</span>
        <strong>Design engineer<br />Full-stack</strong>
      </div>
      <p className={styles.moduleBio}>{BIO}</p>
      <div className={styles.moduleAvatar}>
        <img
          alt="Voxel portrait of Mo holding a notebook"
          height="1256"
          loading="lazy"
          src={AVATARS[1]}
          width="1256"
        />
      </div>
      <CutCornerButton
        className={styles.moduleCall}
        href={LINKS.cal}
        variant="gold"
      >
        Schedule a call
      </CutCornerButton>
    </section>
  )
}

function HeroLayeredCards() {
  return (
    <section className={styles.hero09}>
      <motion.figure
        className={styles.layerPortrait}
        initial={{ rotate: -4 }}
        whileHover={{ rotate: -7, x: -8, y: -5 }}
      >
        <img
          alt="Voxel portrait of Mo giving a thumbs up"
          height="1256"
          loading="lazy"
          src={AVATARS[4]}
          width="1256"
        />
      </motion.figure>
      <motion.div
        className={styles.layerCopy}
        initial={{ rotate: 2 }}
        whileHover={{ rotate: 0, x: 8, y: -5 }}
      >
        <p className={styles.heroRole}>Design engineer · Full-stack</p>
        <h2>Hey, I’m Mo.</h2>
        <p>{BIO}</p>
        <CutCornerButton href={LINKS.cal} variant="navy">
          Schedule a call
        </CutCornerButton>
      </motion.div>
      <span aria-hidden="true" className={styles.layerNote}>Built carefully ↘</span>
    </section>
  )
}

function HeroQuietSignal() {
  return (
    <section className={styles.hero10}>
      <p aria-hidden="true" className={styles.quietMonogram}>MO</p>
      <div className={styles.quietRole}>
        <span>Mo Ibrahim</span>
        <span>Design engineer · Full-stack</span>
      </div>
      <div className={styles.quietCopy}>
        <p>{BIO}</p>
        <CutCornerButton href={LINKS.cal} variant="navy">
          Schedule a call
        </CutCornerButton>
      </div>
    </section>
  )
}

function HeroManifestoPortrait() {
  return (
    <section className={styles.hero11}>
      <p className={styles.hero11Index}>11 / Design engineer</p>
      <div className={styles.hero11Title}>
        <span>The whole experience</span>
        <h2>Big picture.<br />Last pixel.<br />Hello, <AvatarMoWord />.</h2>
      </div>
      <div className={styles.hero11Copy}>
        <p>{BIO}</p>
        <CutCornerButton href={LINKS.cal} variant="navy">
          Schedule a call
        </CutCornerButton>
      </div>
      <span aria-hidden="true" className={styles.hero11Rule} />
    </section>
  )
}

function HeroCutType() {
  return (
    <section className={styles.hero12}>
      <h2 aria-label="Care, craft, code" className={styles.hero12Words}>
        <span>CARE</span>
        <span>CRAFT</span>
        <span>CODE</span>
      </h2>
      <figure className={styles.hero12Portrait}>
        <img
          alt="Voxel portrait of Mo wearing a dark hoodie"
          height="1256"
          loading="lazy"
          src={AVATARS[1]}
          width="1256"
        />
        <figcaption>Mo Ibrahim · Design engineer</figcaption>
      </figure>
      <div className={styles.hero12Copy}>
        <p>{BIO}</p>
        <CutCornerButton href={LINKS.cal} variant="paper">
          Schedule a call
        </CutCornerButton>
      </div>
    </section>
  )
}

function HeroFoldedIntroduction() {
  return (
    <section className={styles.hero13}>
      <div className={styles.hero13Intro}>
        <p className={styles.heroRole}>Independent design engineer</p>
        <h2>Ideas become<br />interfaces here.</h2>
      </div>
      <div className={styles.hero13Stack}>
        <motion.figure
          className={styles.hero13Portrait}
          whileHover={{ rotate: -5, x: -9, y: -6 }}
        >
          <img
            alt="Voxel portrait of Mo smiling"
            height="1256"
            loading="lazy"
            src={AVATARS[0]}
            width="1256"
          />
        </motion.figure>
        <motion.div
          className={styles.hero13Card}
          whileHover={{ rotate: 1, x: 8, y: -5 }}
        >
          <p>{BIO}</p>
          <CutCornerButton href={LINKS.cal} variant="navy">
            Schedule a call
          </CutCornerButton>
        </motion.div>
      </div>
    </section>
  )
}

const GLYPH_COMPOSITIONS = [
  [
    { rotate: 0, x: 0, y: 0 },
    { rotate: 0, x: 0, y: 0 },
    { rotate: 0, x: 0, y: 0 },
    { rotate: 0, x: 0, y: 0 },
  ],
  [
    { rotate: -7, x: -24, y: 18 },
    { rotate: 8, x: 30, y: -24 },
    { rotate: 12, x: -38, y: 30 },
    { rotate: -5, x: 40, y: 22 },
  ],
  [
    { rotate: 5, x: 30, y: -14 },
    { rotate: -6, x: -34, y: 25 },
    { rotate: -10, x: 28, y: 38 },
    { rotate: 7, x: -34, y: -30 },
  ],
] as const

const GLYPH_PIECES = [
  { className: 'hero14PieceM', label: 'Stepped M block' },
  { className: 'hero14PieceO', label: 'Solar O ring' },
  { className: 'hero14PieceSun', label: 'Red solar point' },
  { className: 'hero14PieceStep', label: 'Architectural step' },
] as const

export function GlyphWorkshop() {
  const [composition, setComposition] = useState(0)
  const [instant, setInstant] = useState(false)
  const reducedMotion = useReducedMotion()
  const stageRef = useRef<HTMLDivElement>(null)

  function recompose(keyboardInitiated: boolean) {
    setInstant(keyboardInitiated)
    setComposition((current) => (current + 1) % GLYPH_COMPOSITIONS.length)
  }

  return (
    <div className={styles.hero14Workshop}>
      <div className={styles.hero14WorkshopHeader}>
        <span>Glyph workshop</span>
        <button
          onClick={(event) => {
            if (event.detail !== 0) recompose(false)
          }}
          onKeyDown={(event) => {
            if (event.key === 'Enter' || event.key === ' ') {
              event.preventDefault()
              recompose(true)
            }
          }}
          type="button"
        >
          Recompose
        </button>
      </div>
      <div
        aria-label="Interactive MO logo pieces"
        className={styles.hero14Stage}
        ref={stageRef}
        role="group"
      >
        <span aria-hidden="true" className={styles.hero14Guide}>MO</span>
        {GLYPH_PIECES.map((piece, index) => (
          <motion.button
            animate={GLYPH_COMPOSITIONS[composition][index]}
            aria-label={`${piece.label}. Drag it, or activate to recompose the mark.`}
            className={`${styles.hero14Piece} ${styles[piece.className]}`}
            drag={reducedMotion ? false : true}
            dragConstraints={stageRef}
            dragElastic={0.08}
            dragMomentum={false}
            initial={false}
            key={piece.className}
            onClick={(event) => {
              if (event.detail !== 0) recompose(false)
            }}
            onKeyDown={(event) => {
              if (event.key === 'Enter' || event.key === ' ') {
                event.preventDefault()
                recompose(true)
              }
            }}
            transition={{
              bounce: 0,
              duration: instant || reducedMotion ? 0 : 0.42,
              type: 'spring',
            }}
            type="button"
          >
            <span>{String(index + 1).padStart(2, '0')}</span>
          </motion.button>
        ))}
      </div>
      <p aria-live="polite" className={styles.hero14WorkshopHint}>
        Drag a piece or tap to recompose · {composition + 1} / 3
      </p>
    </div>
  )
}

function Hero14Identity() {
  return (
    <div className={styles.hero14Identity}>
      <Logo className={styles.navyLogo} />
    </div>
  )
}

function Hero14SocialLinks() {
  return (
    <nav aria-label="Contact links" className={styles.hero14Socials}>
      <HeaderAction
        className={styles.hero14Social}
        href={LINKS.x}
        icon="x"
        label="X profile"
      />
      <HeaderAction
        className={styles.hero14Social}
        href={LINKS.email}
        icon="email"
        label="Email Mo"
      />
      <HeaderAction
        className={styles.hero14Social}
        href={LINKS.github}
        icon="github"
        label="GitHub profile"
      />
    </nav>
  )
}

function Hero14MoWord() {
  const [avatarIndex, setAvatarIndex] = useState(0)
  const [instant, setInstant] = useState(false)
  const [visible, setVisible] = useState(false)
  const reducedMotion = useReducedMotion()

  function reveal(keyboardInitiated: boolean) {
    setInstant(keyboardInitiated)
    if (!visible) {
      setAvatarIndex((current) => (current + 1) % AVATARS.length)
    }
    setVisible(true)
  }

  function shuffle(keyboardInitiated: boolean) {
    setInstant(keyboardInitiated)
    setAvatarIndex((current) => (current + 1) % AVATARS.length)
    setVisible(true)
  }

  const previousAvatar =
    AVATARS[(avatarIndex + AVATARS.length - 1) % AVATARS.length]
  const nextAvatar = AVATARS[(avatarIndex + 1) % AVATARS.length]
  const transitionDuration = instant || reducedMotion ? 0 : 0.42

  return (
    <button
      aria-expanded={visible}
      aria-label="Mo — reveal and shuffle portrait set"
      className={styles.hero14MoWord}
      onBlur={() => setVisible(false)}
      onClick={(event) => {
        if (event.detail !== 0) shuffle(false)
      }}
      onFocus={(event) => {
        if (!event.currentTarget.matches(':hover')) reveal(true)
      }}
      onKeyDown={(event) => {
        if (event.key === 'Enter' || event.key === ' ') {
          event.preventDefault()
          shuffle(true)
        }
      }}
      onPointerEnter={() => reveal(false)}
      onPointerLeave={() => setVisible(false)}
      type="button"
    >
      <span className={styles.hero14MoLabel}>Mo</span>
      <AnimatePresence>
        {visible ? (
          <motion.span
            animate={{
              filter: 'blur(0px)',
              opacity: 1,
              rotate: -2,
              scale: 1,
              y: 0,
            }}
            className={styles.hero14PortraitDeck}
            exit={{
              filter: 'blur(3px)',
              opacity: 0,
              rotate: 1,
              scale: 0.97,
              y: 6,
            }}
            initial={
              instant || reducedMotion
                ? false
                : {
                    filter: 'blur(4px)',
                    opacity: 0,
                    rotate: 4,
                    scale: 0.94,
                    y: 12,
                  }
            }
            key={AVATARS[avatarIndex]}
            transition={{
              bounce: 0,
              duration: transitionDuration,
              type: 'spring',
            }}
          >
            <img
              alt=""
              aria-hidden="true"
              className={styles.hero14PortraitBackLeft}
              height="1256"
              loading="lazy"
              src={previousAvatar}
              width="1256"
            />
            <img
              alt=""
              aria-hidden="true"
              className={styles.hero14PortraitBackRight}
              height="1256"
              loading="lazy"
              src={nextAvatar}
              width="1256"
            />
            <motion.img
              alt={`Voxel portrait of Mo, variation ${avatarIndex + 1}`}
              animate={{ clipPath: 'inset(0 0 0% 0)' }}
              className={styles.hero14PortraitFront}
              height="1256"
              initial={
                instant || reducedMotion
                  ? false
                  : { clipPath: 'inset(0 0 100% 0)' }
              }
              loading="lazy"
              src={AVATARS[avatarIndex]}
              transition={{
                duration: instant || reducedMotion ? 0 : 0.32,
                ease: [0.22, 1, 0.36, 1],
              }}
              width="1256"
            />
            <small>
              Portrait {String(avatarIndex + 1).padStart(2, '0')} /{' '}
              {AVATARS.length} · tap to shuffle
            </small>
          </motion.span>
        ) : null}
      </AnimatePresence>
    </button>
  )
}

function HeroWindowedMonogram() {
  return (
    <section className={styles.hero14}>
      <div className={styles.hero14Copy}>
        <Hero14Identity />
        <div className={styles.hero14CopyBody}>
          <p className={styles.heroRole}>Design engineer</p>
          <h2 className={styles.hero14Title}>Mo Ibrahim, design engineer</h2>
          <p>
            Hey, I'm <Hero14MoWord />. I love building products where every detail
            matters, from the overall experience to the last pixel. I enjoy turning
            thoughtful design into clean, polished interfaces that feel as good as
            they look.
          </p>
          <CutCornerButton
            className={styles.hero14Call}
            href={LINKS.cal}
            variant="navy"
          >
            Schedule a call
          </CutCornerButton>
          <Hero14SocialLinks />
        </div>
      </div>
      <div className={styles.hero14Heading}>
        <GlyphWorkshop />
      </div>
    </section>
  )
}

function HeroMarginNotes() {
  return (
    <section className={styles.hero15}>
      <aside className={styles.hero15Aside}>
        <span>MO—26</span>
        <p>Design engineer<br />Cairo · Worldwide</p>
      </aside>
      <div className={styles.hero15Center}>
        <p className={styles.heroRole}>Hello from the details</p>
        <h2>Thoughtful<br />by design.<br />Polished<br />by practice.</h2>
      </div>
      <div className={styles.hero15Copy}>
        <p>{BIO}</p>
        <CutCornerButton href={LINKS.cal} variant="navy">
          Schedule a call
        </CutCornerButton>
      </div>
      <figure className={styles.hero15Stamp}>
        <img
          alt="Voxel portrait stamp of Mo"
          height="1256"
          loading="lazy"
          src={AVATARS[0]}
          width="1256"
        />
      </figure>
    </section>
  )
}

function HeroPrecisionLine() {
  return (
    <section className={styles.hero16}>
      <div className={styles.hero16Heading}>
        <p>Design engineer · 001</p>
        <h2>
          Designing the feel.<br />
          Engineering the finish.
        </h2>
      </div>
      <figure className={styles.hero16Portrait}>
        <img
          alt="Voxel portrait of Mo holding a camera"
          height="1256"
          loading="lazy"
          src={AVATARS[3]}
          width="1256"
        />
        <figcaption>Built from the experience inward.</figcaption>
      </figure>
      <div className={styles.hero16Copy}>
        <p>{BIO}</p>
        <CutCornerButton href={LINKS.cal} variant="navy">
          Schedule a call
        </CutCornerButton>
      </div>
    </section>
  )
}

function HeroSolarIndex() {
  return (
    <section className={styles.hero17}>
      <div className={styles.hero17Orbit}>
        <span aria-hidden="true" />
        <figure>
          <img
            alt="Voxel portrait of Mo with headphones"
            height="1256"
            loading="lazy"
            src={AVATARS[5]}
            width="1256"
          />
        </figure>
        <small>Whole experience<br />Last pixel</small>
      </div>
      <div className={styles.hero17Copy}>
        <p className={styles.heroRole}>Mo · Design engineer</p>
        <h2>Build with<br />a point of view.</h2>
        <p>{BIO}</p>
        <CutCornerButton href={LINKS.cal} variant="paper">
          Schedule a call
        </CutCornerButton>
      </div>
    </section>
  )
}

function HeroPosterStack() {
  return (
    <section className={styles.hero18}>
      <p aria-hidden="true" className={styles.hero18Backdrop}>DETAIL</p>
      <motion.figure
        className={styles.hero18Portrait}
        whileHover={{ rotate: -4, x: -8, y: -6 }}
      >
        <img
          alt="Voxel portrait of Mo in a dark hoodie"
          height="1256"
          loading="lazy"
          src={AVATARS[2]}
          width="1256"
        />
        <figcaption>Mo Ibrahim</figcaption>
      </motion.figure>
      <motion.div
        className={styles.hero18Copy}
        whileHover={{ rotate: 0, x: 8, y: -5 }}
      >
        <p className={styles.heroRole}>Design engineer</p>
        <h2>Every layer<br />has a reason.</h2>
        <p>{BIO}</p>
        <CutCornerButton href={LINKS.cal} variant="navy">
          Schedule a call
        </CutCornerButton>
      </motion.div>
    </section>
  )
}

function HeroDetailDial() {
  return (
    <section className={styles.hero19}>
      <div className={styles.hero19Dial}>
        <span aria-hidden="true">01</span>
        <figure>
          <img
            alt="Voxel portrait of Mo in profile"
            height="1256"
            loading="lazy"
            src={AVATARS[1]}
            width="1256"
          />
        </figure>
        <small>Experience<br />Interface<br />Pixel</small>
      </div>
      <div className={styles.hero19Copy}>
        <p className={styles.heroRole}>Design engineer</p>
        <h2>Hello,<br />I’m <AvatarMoWord />.</h2>
        <p>{BIO}</p>
        <CutCornerButton href={LINKS.cal} variant="gold">
          Schedule a call
        </CutCornerButton>
      </div>
    </section>
  )
}

function HeroQuietCollision() {
  return (
    <section className={styles.hero20}>
      <h2 aria-label="Hello" className={styles.hero20Hello}>HELLO</h2>
      <figure className={styles.hero20Portrait}>
        <img
          alt="Voxel portrait of Mo waving"
          height="1256"
          loading="lazy"
          src={AVATARS[4]}
          width="1256"
        />
      </figure>
      <div className={styles.hero20Copy}>
        <p className={styles.heroRole}>Mo · Design engineer</p>
        <p>{BIO}</p>
        <CutCornerButton href={LINKS.cal} variant="navy">
          Schedule a call
        </CutCornerButton>
      </div>
      <span aria-hidden="true" className={styles.hero20Mark}>✦</span>
    </section>
  )
}

const HEADERS: Direction[] = [
  { Component: HeaderGalleryLine, description: 'Fast lift with a quiet gold edge.', id: '01', name: 'Emil Lift' },
  { Component: HeaderSplitLedger, description: 'A warm face tint with almost no movement.', id: '02', name: 'Warm Face' },
  { Component: HeaderFloatingCapsule, description: 'A compact scale response centered on the control.', id: '03', name: 'Tight Scale' },
  { Component: HeaderCornerIndex, description: 'A shallow physical shadow under the control.', id: '04', name: 'Soft Depth' },
  { Component: HeaderEditorialMasthead, description: 'A restrained gold edge glow.', id: '05', name: 'Gold Edge' },
  { Component: HeaderStatusTicker, description: 'A one-degree tactile tilt.', id: '06', name: 'Micro Tilt' },
  { Component: HeaderSolarOrbit, description: 'A smooth navy face inversion.', id: '07', name: 'Navy Invert' },
  { Component: HeaderFoldedRibbon, description: 'A restrained red edge accent.', id: '08', name: 'Red Accent' },
  { Component: HeaderCommandStrip, description: 'Crisp offset feedback across social and Schedule controls.', id: '09', name: 'Pixel Step' },
  { Component: HeaderAvatarSignature, description: 'Balanced lift, scale, and edge response.', id: '10', name: 'Balanced' },
]

const HEROES: Direction[] = [
  { Component: HeroHoverPortrait, description: 'Hover or tap “Mo” to cycle through portraits.', id: '01', name: 'Hello, Mo' },
  { Component: HeroSplitManifesto, description: 'Role ledger against an oversized manifesto.', id: '02', name: 'Split Manifesto' },
  { Component: HeroTypographicStack, description: 'A three-word typographic operating system.', id: '03', name: 'Type Stack' },
  { Component: HeroContactSheet, description: 'Six responsive portrait studies beside the bio.', id: '04', name: 'Contact Sheet' },
  { Component: HeroTerminal, description: 'The profile expressed as precise executable code.', id: '05', name: 'Profile Terminal' },
  { Component: HeroEditorialProfile, description: 'Quiet editorial portrait and authored statement.', id: '06', name: 'Editorial Profile' },
  { Component: HeroSolarPortrait, description: 'A circular solar portrait with asymmetric copy.', id: '07', name: 'Solar Portrait' },
  { Component: HeroModularBlocks, description: 'A modular identity board with clear information blocks.', id: '08', name: 'Modular Identity' },
  { Component: HeroLayeredCards, description: 'Two tactile cards lean into one another.', id: '09', name: 'Layered Introduction' },
  { Component: HeroQuietSignal, description: 'Monumental initials with an extremely quiet bio.', id: '10', name: 'Quiet Signal' },
  { Component: HeroManifestoPortrait, description: 'Manifesto scale meets the portrait-revealing name.', id: '11', name: 'Manifesto Portrait' },
  { Component: HeroCutType, description: 'Three cut typographic planes frame a quiet portrait.', id: '12', name: 'Cut Type' },
  { Component: HeroFoldedIntroduction, description: 'A restrained introduction built from tactile layers.', id: '13', name: 'Folded Introduction' },
  { Component: HeroWindowedMonogram, description: 'Drag and recompose the pieces of the MO mark.', id: '14', name: 'Glyph Workshop' },
  { Component: HeroMarginNotes, description: 'Editorial margin notes hold a precise central statement.', id: '15', name: 'Margin Notes' },
  { Component: HeroPrecisionLine, description: 'One strong line connects role, portrait, and invitation.', id: '16', name: 'Precision Line' },
  { Component: HeroSolarIndex, description: 'Solar geometry anchors a compact product manifesto.', id: '17', name: 'Solar Index' },
  { Component: HeroPosterStack, description: 'Portrait and manifesto overlap like collected studio posters.', id: '18', name: 'Poster Stack' },
  { Component: HeroDetailDial, description: 'A precision dial balances portrait, process, and hello.', id: '19', name: 'Detail Dial' },
  { Component: HeroQuietCollision, description: 'Oversized type and a small portrait meet without noise.', id: '20', name: 'Quiet Collision' },
]

function parseSelection(name: string, total: number) {
  const requested = Number(new URLSearchParams(window.location.search).get(name))
  if (Number.isInteger(requested) && requested >= 1 && requested <= total) {
    return requested - 1
  }
  return 0
}

export function IntroLab() {
  const [headerIndex, setHeaderIndex] = useState(0)
  const [heroIndex, setHeroIndex] = useState(0)
  const selectedHeader = HEADERS[headerIndex] ?? HEADERS[0]
  const selectedHero = HEROES[heroIndex] ?? HEROES[0]
  const SelectedHeader = selectedHeader.Component
  const SelectedHero = selectedHero.Component

  useEffect(() => {
    setHeaderIndex(parseSelection('header', HEADERS.length))
    setHeroIndex(parseSelection('hero', HEROES.length))
  }, [])

  function selectDirection(type: 'header' | 'hero', index: number) {
    if (type === 'header') setHeaderIndex(index)
    else setHeroIndex(index)

    const url = new URL(window.location.href)
    url.searchParams.set(type, String(index + 1).padStart(2, '0'))
    window.history.replaceState({}, '', url)
  }

  return (
    <MotionConfig reducedMotion="user">
      <main className={styles.lab} id="intro-lab">
        <a className={styles.skipLink} href="#pairing">
          Skip to selected pairing
        </a>

        <header className={styles.labHeader}>
          <div>
            <a className={styles.backLink} href="/">← Exploration index</a>
            <p className={styles.labEyebrow}>MO portfolio · identity laboratory</p>
            <h1>Ten headers.<br />Twenty ways to say hello.</h1>
            <p>
              Ten restrained header interactions and twenty hero directions using the
              same identity, biography, and Schedule CTA. Mix any pairing.
            </p>
          </div>
          <dl>
            <div><dt>Headers</dt><dd>10</dd></div>
            <div><dt>Heroes</dt><dd>20</dd></div>
            <div><dt>Pairings</dt><dd>200</dd></div>
          </dl>
        </header>

        <section aria-labelledby="pairing-title" className={styles.pairing} id="pairing">
          <div className={styles.pairingHeading}>
            <div>
              <p className={styles.labEyebrow}>Live pairing</p>
              <h2 id="pairing-title">
                {selectedHeader.name} × {selectedHero.name}
              </h2>
            </div>
            <p>Choose one from each index. The preview updates without changing the explorations below.</p>
          </div>

          <div className={styles.pairingControls}>
            <nav aria-label="Choose header exploration">
              <span>Header</span>
              {HEADERS.map((header, index) => (
                <button
                  aria-pressed={index === headerIndex}
                  key={header.id}
                  onClick={() => selectDirection('header', index)}
                  type="button"
                >
                  {header.id}
                </button>
              ))}
            </nav>
            <nav aria-label="Choose hero exploration">
              <span>Hero</span>
              {HEROES.map((hero, index) => (
                <button
                  aria-pressed={index === heroIndex}
                  key={hero.id}
                  onClick={() => selectDirection('hero', index)}
                  type="button"
                >
                  {hero.id}
                </button>
              ))}
            </nav>
          </div>

          <div className={styles.liveFrame}>
            {selectedHero.id === '14' ? null : (
              <SelectedHeader key={`header-${selectedHeader.id}`} />
            )}
            <SelectedHero key={`hero-${selectedHero.id}`} />
          </div>
        </section>

        <ExplorationGallery
          directions={HEADERS}
          onSelect={(index) => selectDirection('header', index)}
          selectedIndex={headerIndex}
          title="Header explorations"
          type="header"
        />
        <ExplorationGallery
          directions={HEROES}
          onSelect={(index) => selectDirection('hero', index)}
          selectedIndex={heroIndex}
          title="Hero explorations"
          type="hero"
        />

        <footer className={styles.footer}>
          <p>30 identity explorations · no final pairing selected</p>
          <a href="#intro-lab">Back to top ↑</a>
        </footer>
      </main>
    </MotionConfig>
  )
}

function ExplorationGallery({
  directions,
  onSelect,
  selectedIndex,
  title,
  type,
}: {
  directions: Direction[]
  onSelect: (index: number) => void
  selectedIndex: number
  title: string
  type: 'header' | 'hero'
}) {
  return (
    <section
      aria-labelledby={`${type}-explorations-title`}
      className={`${styles.explorations} ${styles[type]}`}
      id={`${type}s`}
    >
      <header className={styles.explorationHeading}>
        <p className={styles.labEyebrow}>
          {type === 'header' ? '10 button hover studies' : '20 hero directions'}
        </p>
        <h2 id={`${type}-explorations-title`}>{title}</h2>
      </header>
      <ol>
        {directions.map(({ Component, description, id, name }, index) => (
          <li id={`${type}-${id}`} key={id}>
            <article className={styles.explorationCard}>
              <header>
                <span>
                  {id} / {String(directions.length).padStart(2, '0')}
                </span>
                <div>
                  <h3>{name}</h3>
                  <p>{description}</p>
                </div>
                <button
                  aria-pressed={selectedIndex === index}
                  onClick={() => onSelect(index)}
                  type="button"
                >
                  {selectedIndex === index ? 'In pairing' : 'Use this'}
                </button>
              </header>
              <div className={styles.explorationCanvas}>
                <Component />
              </div>
            </article>
          </li>
        ))}
      </ol>
    </section>
  )
}
