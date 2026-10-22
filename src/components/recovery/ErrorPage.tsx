import { useCallback, useRef, useState } from 'react'
import { CutCornerButton } from '#/components/v14-exploration-lab/CutCornerButton'
import { ErrorArtwork } from '#/components/state-lab/ErrorArtwork'
import { StateLogo } from '#/components/state-lab/StateLogo'
import lab from '#/components/state-lab/StateExplorationLab.module.css'
import styles from './RecoveryPage.module.css'

export function ErrorPage({ onRetry }: { onRetry?: () => void | Promise<void> }) {
  const [retrying, setRetrying] = useState(false)
  const [attempt, setAttempt] = useState(0)
  const busy = useRef(false)
  const retry = useCallback(async () => {
    if (busy.current) return
    busy.current = true
    setRetrying(true)
    try {
      if (onRetry) await onRetry()
      else window.location.reload()
    } finally { busy.current = false; setRetrying(false); setAttempt(current => current + 1) }
  }, [onRetry])
  return <main className={`${lab.preview} ${styles.page}`} data-error="0" data-theme="red">
    <header className={lab.previewHeader}><a aria-label="MO portfolio home" className={lab.previewLogo} href="/"><StateLogo tone="red" /></a></header>
    <section aria-labelledby="error-title" className={`${lab.previewBody} ${styles.body}`}>
      <ErrorArtwork index={0} onSolved={retry} resetKey={attempt} />
      <div className={lab.message}>
        <h1 id="error-title">Something went wrong.</h1>
        <p className={lab.description}>This page couldn’t load. Let’s try again.</p>
        <div className={`${lab.recoveryActions} ${lab.errorActions}`}>
          <CutCornerButton loading={retrying} onClick={retry} variant="gold">↻ Try again</CutCornerButton>
          <CutCornerButton href="/" variant="paper">← Back home</CutCornerButton>
        </div>
      </div>
    </section>
  </main>
}

