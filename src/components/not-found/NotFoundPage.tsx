import { CutCornerButton } from '#/components/v14-exploration-lab/CutCornerButton'
import { Spatial404Artwork } from '#/components/state-lab/Spatial404Artwork'
import { StateLogo } from '#/components/state-lab/StateLogo'
import { CONCEPTS } from '#/components/state-lab/state-concepts'
import compassStyles from '#/components/state-lab/StateExplorationLab.module.css'

import styles from './NotFoundPage.module.css'

export function NotFoundPage() {
  return (
    <main className={`${compassStyles.preview} ${styles.page}`} data-404="compass" data-theme="navy">
      <header className={compassStyles.previewHeader}>
        <a aria-label="MO portfolio home" className={compassStyles.previewLogo} href="/">
          <StateLogo tone="navy" />
        </a>
      </header>
      <section aria-labelledby="not-found-title" className={`${compassStyles.previewBody} ${styles.body}`}>
        <Spatial404Artwork index={1} />
        <div className={compassStyles.message}>
          <h1 id="not-found-title">{CONCEPTS['404'][1].title}</h1>
          <div className={compassStyles.recoveryActions}>
            <CutCornerButton href="/" variant="gold">Back home ↗</CutCornerButton>
          </div>
        </div>
      </section>
    </main>
  )
}
