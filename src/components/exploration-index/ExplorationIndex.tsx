import { motion, useReducedMotion } from 'motion/react'

import { AnimatedLogo } from '#/components/brand/AnimatedLogo'
import { CutCornerButton } from '#/components/project-lab/shared/CutCornerButton'

import styles from './ExplorationIndex.module.css'

interface DirectionLink {
  href: string
  name: string
}

interface Laboratory {
  accent: 'gold' | 'navy' | 'red'
  count: number
  directions: DirectionLink[]
  eyebrow: string
  href: string
  id: string
  number: string
  summary: string
  title: string
}

const LABORATORIES: Laboratory[] = [
  {
    accent: 'gold',
    count: 5,
    directions: [
      { href: '/button-lab#01-step-pylon', name: 'Monumental Step Pylon' },
      { href: '/button-lab#02-solar-aperture', name: 'Cut Corner' },
      { href: '/button-lab#03-cartouche-rail', name: 'Red Seal' },
      { href: '/button-lab#04-gilded-relief', name: 'Gilded Relief' },
      { href: '/button-lab#05-pressed-seal', name: 'Pressed Seal' },
    ],
    eyebrow: 'Interaction foundation',
    href: '/button-lab',
    id: 'buttons',
    number: '01',
    summary:
      'Five button systems that established the selected V2 Cut Corner language.',
    title: 'Button systems',
  },
  {
    accent: 'navy',
    count: 10,
    directions: [
      { href: '/project-lab?v=01#project-lab-preview', name: 'Editorial Grid' },
      { href: '/project-lab?v=02#project-lab-preview', name: 'Museum Catalog' },
      { href: '/project-lab?v=03#project-lab-preview', name: 'Split-Screen Register' },
      { href: '/project-lab?v=04#project-lab-preview', name: 'Processional Rail' },
      { href: '/project-lab?v=05#project-lab-preview', name: 'Timeline Archive' },
      { href: '/project-lab?v=06#project-lab-preview', name: 'Modular Mosaic' },
      { href: '/project-lab?v=07#project-lab-preview', name: 'Project Dossier' },
      { href: '/project-lab?v=08#project-lab-preview', name: 'Dimensional Stack' },
      { href: '/project-lab?v=09#project-lab-preview', name: 'Cinematic Feature' },
      { href: '/project-lab?v=10#project-lab-preview', name: 'Technical Index' },
    ],
    eyebrow: 'Round one · broad structures',
    href: '/project-lab',
    id: 'project-systems',
    number: '02',
    summary:
      'Ten structurally different ways to organize a complete body of work.',
    title: 'Project presentation',
  },
  {
    accent: 'red',
    count: 10,
    directions: [
      { href: '/project-slider-lab?v=01#project-slider-lab-preview', name: 'Chromatic Filmstrip' },
      { href: '/project-slider-lab?v=02#project-slider-lab-preview', name: 'Architectural Viewfinder' },
      { href: '/project-slider-lab?v=03#project-slider-lab-preview', name: 'Kinetic Contact Sheet' },
      { href: '/project-slider-lab?v=04#project-slider-lab-preview', name: 'Solar Aperture' },
      { href: '/project-slider-lab?v=05#project-slider-lab-preview', name: 'Editorial Split Rail' },
      { href: '/project-slider-lab?v=06#project-slider-lab-preview', name: 'Ambient Canvas' },
      { href: '/project-slider-lab?v=07#project-slider-lab-preview', name: 'Dimensional Slide Stack' },
      { href: '/project-slider-lab?v=08#project-slider-lab-preview', name: 'Gallery Drawer' },
      { href: '/project-slider-lab?v=09#project-slider-lab-preview', name: 'Cinematic Stage' },
      { href: '/project-slider-lab?v=10#project-slider-lab-preview', name: 'Technical Switcher' },
    ],
    eyebrow: 'Round two · horizontal studies',
    href: '/project-slider-lab',
    id: 'slider-systems',
    number: '03',
    summary:
      'Ten restrained slider studies built around small controls and native snapping.',
    title: 'Slider studies',
  },
  {
    accent: 'gold',
    count: 10,
    directions: [
      { href: '/project-card-lab?v=01#project-card-preview', name: 'Layout Morph' },
      { href: '/project-card-lab?v=02#project-card-preview', name: 'Elastic Accordion' },
      { href: '/project-card-lab?v=03#project-card-preview', name: 'Filmstrip Drawer' },
      { href: '/project-card-lab?v=04#project-card-preview', name: 'Minimal Coverflow' },
      { href: '/project-card-lab?v=05#project-card-preview', name: 'Magnetic Snap' },
      { href: '/project-card-lab?v=06#project-card-preview', name: 'Stacked Peel' },
      { href: '/project-card-lab?v=07#project-card-preview', name: 'Kinetic Ribbon' },
      { href: '/project-card-lab?v=08#project-card-preview', name: 'Aperture Zoom' },
      { href: '/project-card-lab?v=09#project-card-preview', name: 'Kinetic Columns' },
      { href: '/project-card-lab?v=10#project-card-preview', name: 'Edge Cabinet' },
    ],
    eyebrow: 'Round three · image-first cards',
    href: '/project-card-lab',
    id: 'card-systems',
    number: '04',
    summary:
      'Ten compact image-card mechanics that reveal useful context on demand.',
    title: 'Card motion studies',
  },
  {
    accent: 'red',
    count: 10,
    directions: [
      { href: '/portfolio-lab?v=01', name: 'Prism Conveyor' },
      { href: '/portfolio-lab?v=02', name: 'Magnetic Editorial' },
      { href: '/portfolio-lab?v=03', name: 'Living Blueprint' },
      { href: '/portfolio-lab?v=04', name: 'Chromatic Desktop' },
      { href: '/portfolio-lab?v=05', name: 'Typographic Cinema' },
      { href: '/portfolio-lab?v=06', name: 'Folded Index' },
      { href: '/portfolio-lab?v=07', name: 'Orbital Studio' },
      { href: '/portfolio-lab?v=08', name: 'Elastic Gallery' },
      { href: '/portfolio-lab?v=09', name: 'Kinetic Mosaic' },
      { href: '/portfolio-lab?v=10', name: 'Quiet Monument' },
    ],
    eyebrow: 'Round four · complete portfolios',
    href: '/portfolio-lab?v=01',
    id: 'portfolio-systems',
    number: '05',
    summary:
      'Ten complete portfolio candidates combining identity, projects, and motion.',
    title: 'Complete portfolios',
  },
  {
    accent: 'navy',
    count: 20,
    directions: [
      { href: '/intro-lab?header=01&hero=01#pairing', name: 'Header · Gallery Line' },
      { href: '/intro-lab?header=02&hero=01#pairing', name: 'Header · Split Ledger' },
      { href: '/intro-lab?header=03&hero=01#pairing', name: 'Header · Floating Capsule' },
      { href: '/intro-lab?header=04&hero=01#pairing', name: 'Header · Corner Index' },
      { href: '/intro-lab?header=05&hero=01#pairing', name: 'Header · Editorial Masthead' },
      { href: '/intro-lab?header=06&hero=01#pairing', name: 'Header · Status Ticker' },
      { href: '/intro-lab?header=07&hero=01#pairing', name: 'Header · Solar Orbit' },
      { href: '/intro-lab?header=08&hero=01#pairing', name: 'Header · Folded Ribbon' },
      { href: '/intro-lab?header=09&hero=01#pairing', name: 'Header · Command Strip' },
      { href: '/intro-lab?header=10&hero=01#pairing', name: 'Header · Avatar Signature' },
      { href: '/intro-lab?header=01&hero=01#pairing', name: 'Hero · Hello, Mo' },
      { href: '/intro-lab?header=01&hero=02#pairing', name: 'Hero · Split Manifesto' },
      { href: '/intro-lab?header=01&hero=03#pairing', name: 'Hero · Type Stack' },
      { href: '/intro-lab?header=01&hero=04#pairing', name: 'Hero · Contact Sheet' },
      { href: '/intro-lab?header=01&hero=05#pairing', name: 'Hero · Profile Terminal' },
      { href: '/intro-lab?header=01&hero=06#pairing', name: 'Hero · Editorial Profile' },
      { href: '/intro-lab?header=01&hero=07#pairing', name: 'Hero · Solar Portrait' },
      { href: '/intro-lab?header=01&hero=08#pairing', name: 'Hero · Modular Identity' },
      { href: '/intro-lab?header=01&hero=09#pairing', name: 'Hero · Layered Introduction' },
      { href: '/intro-lab?header=01&hero=10#pairing', name: 'Hero · Quiet Signal' },
    ],
    eyebrow: 'Round five · identity introductions',
    href: '/intro-lab?header=01&hero=01',
    id: 'intro-systems',
    number: '06',
    summary:
      'Ten unique headers and ten unique heroes that can be mixed into 100 pairings.',
    title: 'Headers & heroes',
  },
]

const TOTAL_DIRECTIONS = LABORATORIES.reduce(
  (total, laboratory) => total + laboratory.count,
  0,
)

export function ExplorationIndex() {
  const reducedMotion = useReducedMotion()

  return (
    <div className={styles.page}>
      <a className={styles.skipLink} href="#laboratories">
        Skip to laboratories
      </a>

      <header className={styles.masthead}>
        <a aria-label="Exploration index home" className={styles.logoLink} href="/">
          <AnimatedLogo animateOnMount={false} className={styles.logo} />
        </a>
        <nav aria-label="Index navigation" className={styles.nav}>
          <a href="#laboratories">All labs</a>
          <CutCornerButton href="/portfolio-lab?v=01" variant="paper">
            Latest round
          </CutCornerButton>
        </nav>
      </header>

      <main>
        <section aria-labelledby="index-title" className={styles.hero}>
          <div className={styles.heroTitle}>
            <p className={styles.eyebrow}>MO portfolio · selection room</p>
            <h1 id="index-title">
              Every experiment.
              <br />
              One final direction.
            </h1>
          </div>

          <div className={styles.heroBrief}>
            <p>
              Review the complete design process—from button language to full
              portfolio systems—and tell me what should survive into the final
              site.
            </p>
            <dl className={styles.stats}>
              <div>
                <dt>Laboratories</dt>
                <dd>{String(LABORATORIES.length).padStart(2, '0')}</dd>
              </div>
              <div>
                <dt>Directions</dt>
                <dd>{TOTAL_DIRECTIONS}</dd>
              </div>
              <div>
                <dt>Decision</dt>
                <dd>Open</dd>
              </div>
            </dl>
          </div>
        </section>

        <section
          aria-labelledby="laboratories-title"
          className={styles.laboratories}
          id="laboratories"
        >
          <div className={styles.sectionHeading}>
            <div>
              <p className={styles.eyebrow}>Exploration archive</p>
              <h2 id="laboratories-title">Choose a chapter.</h2>
            </div>
            <p>
              Open a full laboratory or jump directly to a named direction.
            </p>
          </div>

          <ol className={styles.labList}>
            {LABORATORIES.map((laboratory, index) => (
              <motion.li
                className={styles.labItem}
                initial={reducedMotion ? false : { opacity: 0, y: 14 }}
                key={laboratory.id}
                transition={{
                  delay: reducedMotion ? 0 : index * 0.045,
                  duration: reducedMotion ? 0 : 0.32,
                  ease: [0.22, 1, 0.36, 1],
                }}
                viewport={{ amount: 0.12, once: true }}
                whileInView={{ opacity: 1, y: 0 }}
              >
                <article
                  className={styles.labCard}
                  data-accent={laboratory.accent}
                >
                  <div className={styles.labIntro}>
                    <span className={styles.labNumber}>{laboratory.number}</span>
                    <div>
                      <p className={styles.eyebrow}>{laboratory.eyebrow}</p>
                      <h3>{laboratory.title}</h3>
                      <p className={styles.summary}>{laboratory.summary}</p>
                    </div>
                    <div className={styles.labAction}>
                      <span>{String(laboratory.count).padStart(2, '0')} directions</span>
                      <CutCornerButton href={laboratory.href} variant="navy">
                        Open laboratory
                      </CutCornerButton>
                    </div>
                  </div>

                  <nav
                    aria-label={`${laboratory.title} directions`}
                    className={styles.directionGrid}
                  >
                    {laboratory.directions.map((direction, directionIndex) => (
                      <a
                        href={direction.href}
                        key={`${laboratory.id}-${directionIndex}`}
                      >
                        <span>{String(directionIndex + 1).padStart(2, '0')}</span>
                        <strong>{direction.name}</strong>
                        <span aria-hidden="true">↗</span>
                      </a>
                    ))}
                  </nav>
                </article>
              </motion.li>
            ))}
          </ol>
        </section>

        <section aria-labelledby="review-title" className={styles.reviewNote}>
          <p className={styles.eyebrow}>A useful review</p>
          <h2 id="review-title">You do not need to choose one whole page.</h2>
          <p>
            Pick a favorite complete portfolio, then call out any button,
            typography, color, project transition, or interaction from another
            direction. The final system can combine the strongest decisions.
          </p>
          <CutCornerButton href="/portfolio-lab?v=01" variant="gold">
            Start with complete portfolios
          </CutCornerButton>
        </section>
      </main>

      <footer className={styles.footer}>
        <div>
          <AnimatedLogo animateOnMount={false} className={styles.footerLogo} />
          <p>MO · Portfolio exploration archive</p>
        </div>
        <p>{TOTAL_DIRECTIONS} directions · final selection pending</p>
        <a href="#index-title">Back to top ↑</a>
      </footer>
    </div>
  )
}
