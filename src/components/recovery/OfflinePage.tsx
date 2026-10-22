import { useEffect, useRef, useState } from 'react'
import { CutCornerButton } from '#/components/v14-exploration-lab/CutCornerButton'
import { OfflineArtwork } from '#/components/state-lab/OfflineArtwork'
import { RADIO_STATIONS } from '#/components/state-lab/RadioSound'
import lab from '#/components/state-lab/StateExplorationLab.module.css'
import styles from './RecoveryPage.module.css'

export function OfflinePage() {
  const [checking, setChecking] = useState(false)
  const [message, setMessage] = useState('')
  const request = useRef<AbortController | null>(null)
  useEffect(() => () => { request.current?.abort(); request.current = null }, [])

  async function retry() {
    if (request.current) return
    const controller = new AbortController()
    request.current = controller
    setChecking(true)
    setMessage('')
    const timer = setTimeout(() => controller.abort(), 5000)
    try {
      const response = await fetch('/', { method: 'HEAD', cache: 'no-store', signal: controller.signal })
      if (request.current !== controller) return
      if (!response.ok) { setMessage('The page is still unavailable. Try again shortly.'); return }
      if (window.location.pathname === '/offline') window.location.replace('/')
      else window.location.reload()
    } catch {
      if (request.current === controller) setMessage('Still offline. The music can stay.')
    } finally {
      clearTimeout(timer)
      if (request.current === controller) { request.current = null; setChecking(false) }
    }
  }

  return <main className={`${lab.preview} ${styles.page}`} data-offline="1" data-theme="paper">
    <header className={lab.previewHeader}><a aria-label="MO portfolio home" className={lab.previewLogo} href="/"><img alt="" height="480" src="/brand/mo-mark-v3.svg" width="790" /></a></header>
    <section aria-labelledby="offline-title" className={`${lab.previewBody} ${styles.body}`}>
      <OfflineArtwork index={1} />
      <div className={lab.message}>
        <h1 id="offline-title">No internet.<br />Still on the air.</h1>
        <div className={`${lab.recoveryActions} ${lab.radioActions}`}>
          <CutCornerButton loading={checking} onClick={retry} variant="navy">Check connection ↻</CutCornerButton>
          <CutCornerButton href="/" variant="paper">← Back home</CutCornerButton>
        </div>
        <p aria-live="polite" className={styles.status}>{message}</p>
        <details className={styles.credits}><summary>Music credits</summary><p>Excerpts by Kevin MacLeod (incompetech.com), licensed under <a href="https://creativecommons.org/licenses/by/3.0/" rel="noreferrer" target="_blank">CC BY 3.0</a>. Trimmed, faded and volume adjusted.</p><ul>{RADIO_STATIONS.map(station => <li key={station.name}><a href={station.source} rel="noreferrer" target="_blank">{station.title}</a> · {station.frequency} FM</li>)}</ul></details>
      </div>
    </section>
  </main>
}
