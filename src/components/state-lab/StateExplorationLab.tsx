import { useEffect, useState } from 'react'

import { CutCornerButton } from '#/components/v14-exploration-lab/CutCornerButton'

import { InteractiveArtwork, StateArtwork } from './StateArtwork'
import { Spatial404Artwork } from './Spatial404Artwork'
import { OfflineArtwork } from './OfflineArtwork'
import { StateLogo } from './StateLogo'
import { CONCEPTS, STATE_LABELS } from './state-concepts'
import type { StateKind } from './state-concepts'
import styles from './StateExplorationLab.module.css'

const KINDS: StateKind[] = ['404', 'offline', 'error']
const DIRECTION_COUNT = KINDS.reduce((total, state) => total + CONCEPTS[state].length, 0)

function previewHash(kind: StateKind, index: number, fullPage: boolean) {
  return `#${kind}/${index + 1}${kind === '404' && index === 1 ? '/orbit' : ''}${fullPage ? '/page' : ''}`
}

export function StateExplorationLab() {
  const [kind, setKind] = useState<StateKind>('404')
  const [index, setIndex] = useState(0)
  const [fullPage, setFullPage] = useState(false)
  const [replay, setReplay] = useState(0)
  const [hydrated, setHydrated] = useState(false)
  const [picks, setPicks] = useState<Partial<Record<StateKind, number>>>({})
  const [recoveryMessage, setRecoveryMessage] = useState('')
  const concept = CONCEPTS[kind][index]
  const count = CONCEPTS[kind].length
  const theme = concept.theme
  const picked = picks[kind] === index

  useEffect(() => {
    function readHash() {
      const match = window.location.hash.match(/^#(404|offline|error)\/(10|[1-9])(?:\/([a-z-]+))?(?:\/(page))?$/)
      if (!match) return
      const nextKind = match[1] as StateKind
      const nextIndex = Math.min(Number(match[2]) - 1, CONCEPTS[nextKind].length - 1)
      const nextFullPage = match[3] === 'page' || Boolean(match[4])
      setKind(nextKind)
      setIndex(nextIndex)
      setFullPage(nextFullPage)
      setRecoveryMessage('')
      const hash = previewHash(nextKind, nextIndex, nextFullPage)
      if (window.location.hash !== hash) window.history.replaceState(null, '', hash)
    }
    readHash()
    setHydrated(true)
    window.addEventListener('hashchange', readHash)
    return () => window.removeEventListener('hashchange', readHash)
  }, [])

  useEffect(() => {
    if (!fullPage) return
    function onEscape(event: KeyboardEvent) {
      if (event.key === 'Escape') {
        setFullPage(false)
        window.history.replaceState(null, '', previewHash(kind, index, false))
      }
    }
    window.addEventListener('keydown', onEscape)
    return () => window.removeEventListener('keydown', onEscape)
  }, [fullPage, index, kind])

  function select(nextKind: StateKind, nextIndex: number, full = fullPage) {
    setKind(nextKind)
    setIndex(nextIndex)
    setFullPage(full)
    setRecoveryMessage('')
    window.history.replaceState(null, '', previewHash(nextKind, nextIndex, full))
  }

  function pick() {
    setPicks(current => {
      const next = { ...current }
      if (picked) delete next[kind]
      else next[kind] = index
      return next
    })
  }

  return (
    <main className={`${styles.lab} ${fullPage ? styles.fullView : ''}`} data-kind={kind} data-hydrated={hydrated || undefined}>
      <header className={styles.labHeader}>
        <a aria-label="MO portfolio home" className={styles.labLogo} href="/"><img alt="" height="480" src="/brand/mo-mark-v3.svg" width="790" /></a>
        <span className={styles.labWordmark}>The art of the detour<span>State explorations / {DIRECTION_COUNT} directions</span></span>
        {fullPage ? <button className={styles.textButton} onClick={() => select(kind, index, false)} type="button">← Back to explorations</button> : <a className={styles.backLink} href="/">Back to portfolio ↗</a>}
      </header>

      {!fullPage ? <>
        <div className={styles.labIntroduction} data-kind={kind}>
          <div>{kind === 'error' ? <p className={styles.eyebrow}>Small interruptions. A little imagination.</p> : null}<h1>{kind === '404' ? 'Two ways to get lost' : kind === 'offline' ? 'Ten ways to take a breath' : <>Even the detours<br />deserve good design</>}<span>.</span></h1></div>
          {kind === 'error' ? <p>Pick a state. Explore a direction.<br />Play a little. Find your favorite.</p> : null}
        </div>
        <div className={styles.categoryRow}>
          <div aria-label="Page state" className={styles.categories}>
            {KINDS.map(state => <button aria-pressed={state === kind} className={styles.categoryButton} key={state} onClick={() => select(state, 0, false)} type="button"><span>{state === '404' ? '404' : state === 'offline' ? 'Offline' : 'Error'}</span><span>{CONCEPTS[state].length}</span></button>)}
          </div>
          <span className={styles.categoryNote}>{STATE_LABELS[kind]} / {count} directions</span>
        </div>
        <ol aria-label={`${STATE_LABELS[kind]} concepts`} className={styles.conceptGrid} data-kind={kind}>
          {CONCEPTS[kind].map((option, i) => <li key={option.name}>
            <button aria-label={`Preview ${String(i + 1).padStart(2, '0')}: ${option.name}`} aria-pressed={index === i} className={styles.conceptCard} onClick={() => select(kind, i, false)} type="button">
              <span className={styles.thumbnail} data-theme={option.theme}><StateArtwork index={i} kind={kind} /><span className={styles.thumbnailNumber}>{String(i + 1).padStart(2, '0')}</span>{picks[kind] === i ? <span className={styles.pickFlag}>PICK ✓</span> : null}</span>
              <span className={styles.cardCaption}><span>{option.name}</span><span aria-hidden="true">{index === i ? '↘' : '↗'}</span></span>
            </button>
          </li>)}
        </ol>
      </> : null}

      <section aria-label="Selected concept preview" className={styles.previewSection}>
        <div className={styles.previewToolbar}>
          <div className={styles.previewName}><span>{String(index + 1).padStart(2, '0')} / {count}</span><h2>{concept.name}</h2><span className={styles.liveTag}><i />Interactive preview</span></div>
          <div className={styles.previewTools}>
            <button aria-label="Previous concept" className={styles.iconButton} onClick={() => select(kind, (index + count - 1) % count)} type="button">←</button>
            <button aria-label="Next concept" className={styles.iconButton} onClick={() => select(kind, (index + 1) % count)} type="button">→</button>
            <button aria-label="Restart interaction" className={styles.iconButton} onClick={() => { setReplay(replay + 1); setRecoveryMessage('') }} type="button">↻</button>
            <button className={styles.textButton} onClick={() => select(kind, index, !fullPage)} type="button">{fullPage ? 'Exit full page ↙' : 'Full page ↗'}</button>
          </div>
        </div>

        <div className={styles.preview} data-404={kind === '404' ? index === 0 ? 'doorway' : 'compass' : undefined} data-offline={kind === 'offline' ? index : undefined} data-layout={concept.layout} data-theme={theme} key={`${kind}-${index}`}>
          <div className={styles.previewHeader}><a aria-label="MO portfolio home" className={styles.previewLogo} href="/">{kind !== 'error' && theme !== 'paper' ? <StateLogo tone={theme} /> : <img alt="" height="480" src="/brand/mo-mark-v3.svg" width="790" />}</a><span>{kind === '404' ? '404' : kind === 'offline' ? 'NO INTERNET' : 'ERROR / ANOTHER POSSIBILITY'}</span></div>
          <div className={styles.previewBody}>
            <div className={styles.message}>
              {kind === 'error' ? <p className={styles.eyebrow}>A small interruption</p> : null}
              <h3>{concept.title}</h3>
              {kind === 'error' ? <p className={styles.description}>{concept.description}</p> : null}
              <div className={styles.recoveryActions}>
                {kind === '404' ? <CutCornerButton href="/" variant="navy">Back home ↗</CutCornerButton> : <CutCornerButton onClick={() => setRecoveryMessage(kind === 'offline' ? 'Preview only: the live page will check the connection and retry.' : 'Preview only: the live page will retry loading.')} variant="navy">{kind === 'offline' ? 'Check connection ↻' : 'Try again ↻'}</CutCornerButton>}
                {kind !== '404' ? <a className={styles.quietLink} href="/">Back home ↗</a> : null}
              </div>
              {kind !== '404' ? <p aria-live="polite" className={styles.recoveryMessage}>{recoveryMessage}</p> : null}
            </div>
            {kind === '404' && index < 2
              ? <Spatial404Artwork index={index} key={`${kind}-${index}-${replay}`} />
              : kind === 'offline' ? <OfflineArtwork index={index} key={`${kind}-${index}-${replay}`} />
              : <InteractiveArtwork index={index} key={`${kind}-${index}-${replay}`} kind={kind} />}
          </div>
          {kind === 'error' ? <div className={styles.previewFooter}><span>MO / MADE WITH A LITTLE CURIOSITY</span><span><i />A little room to try again</span></div> : null}
        </div>
        <div className={styles.decisionRow}><p><span className={styles.hintSymbol} aria-hidden="true">✳</span>{concept.hint}</p><button aria-pressed={picked} className={styles.pickButton} onClick={pick} type="button">{picked ? 'Your pick ✓' : `Pick this ${kind === '404' ? '404' : kind === 'offline' ? 'offline page' : 'error page'} ♡`}</button></div>
      </section>

      {!fullPage ? <footer className={styles.labFooter}>
        <div className={styles.shortlist}><span className={styles.eyebrow}>Your picks</span>{KINDS.map(state => {
          const choice = picks[state]
          return <button className={styles.shortlistItem} disabled={choice === undefined} key={state} onClick={() => select(state, choice ?? 0, false)} type="button"><span>{state === '404' ? '404' : state === 'offline' ? 'OFF' : 'ERR'}</span><span>{choice !== undefined ? CONCEPTS[state][choice].name : 'Still exploring'}</span></button>
        })}</div>
        <p>One favorite per state. These are design previews; live recovery comes after your choice.</p>
      </footer> : null}
    </main>
  )
}
