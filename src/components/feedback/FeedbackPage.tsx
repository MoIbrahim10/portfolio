import { AnimatePresence, MotionConfig, motion, useReducedMotion } from 'motion/react'
import { useEffect, useRef, useState } from 'react'
import type { FormEvent, MouseEvent } from 'react'

import { PostcardFront } from './PostcardFront'
import { PostcardLetter } from './PostcardLetter'
import { POSTCARD_STAMPS, StampPicker } from './PostcardPostage'
import { CutCornerButton } from '#/components/v14-exploration-lab/CutCornerButton'

import styles from './FeedbackPage.module.css'

const STAMPS = POSTCARD_STAMPS

type Kind = typeof STAMPS[number]['id']
type DeliveryState = 'writing' | 'sending' | 'retrying' | 'sent' | 'failed'

function Arrow() {
  return (
    <svg aria-hidden="true" viewBox="0 0 24 24" fill="none">
      <path d="M4 12h15m-6-6 6 6-6 6" />
    </svg>
  )
}

function ResultMark({ failed, sending }: { failed: boolean; sending: boolean }) {
  return (
    <svg aria-hidden="true" viewBox="0 0 48 48" fill="none">
      {sending
        ? <path d="M9 24h28m-9-9 9 9-9 9" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        : failed
        ? <path d="M24 12v14m0 8v.1M11 39h26L24 9 11 39Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        : <path d="m13 25 7 7 15-16" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />}
    </svg>
  )
}

function CardTurnIcon() {
  return (
    <span className={styles.flipIcon} aria-hidden="true">
      <span className={styles.flipMiniature}>
        <svg viewBox="0 0 36 26" fill="none">
          <path fill="#fffaf0" d="M0 0h36v26H0z" />
          <path fill="#9f3732" d="M33 0h3v26h-3zM5 5h10v7H5zM18 15h10v7H18z" />
          <path fill="#102b43" d="M18 5h10v7H18zM5 15h10v7H5z" />
          <circle cx="25" cy="7" r="2" fill="#d79d40" />
        </svg>
        <svg className={styles.flipWriting} viewBox="0 0 36 26" fill="none">
          <path fill="#fffaf0" d="M0 0h36v26H0z" />
          <path fill="#9f3732" d="M0 0h3v26H0zM28 4h4v6h-4z" />
          <path stroke="#102b43" strokeOpacity=".35" d="M7 7h14M7 12h14M7 17h14M7 22h10M25 14v8" />
        </svg>
      </span>
    </span>
  )
}

function Postcard() {
  const [hydrated, setHydrated] = useState(false)
  const [stackedLayout, setStackedLayout] = useState(true)
  const [kind, setKind] = useState<Kind>('love')
  const [instantStamp, setInstantStamp] = useState(false)
  const [side, setSide] = useState<'front' | 'back'>('front')
  const [turning, setTurning] = useState(false)
  const [instantFlip, setInstantFlip] = useState(false)
  const [message, setMessage] = useState('')
  const [name, setName] = useState('')
  const [status, setStatus] = useState<DeliveryState>('writing')
  const [error, setError] = useState('')
  const [messageError, setMessageError] = useState('')
  const [receipt, setReceipt] = useState('')
  const retry = useRef<{ payload: string; id: string } | null>(null)
  const note = useRef<HTMLTextAreaElement>(null)
  const resultHeading = useRef<HTMLHeadingElement>(null)
  const flipFocus = useRef(false)
  const reducedMotion = useReducedMotion()
  const writeLabel = message || name ? 'Back to your note' : 'Write a note'

  useEffect(() => {
    setHydrated(true)
    const media = window.matchMedia('(max-width: 1050px)')
    const updateLayout = () => setStackedLayout(media.matches)
    updateLayout()
    media.addEventListener('change', updateLayout)
    return () => media.removeEventListener('change', updateLayout)
  }, [])

  useEffect(() => {
    if (side !== 'back' || turning || !flipFocus.current) return
    flipFocus.current = false
    if (document.activeElement === document.body || document.activeElement?.hasAttribute('data-flip')) {
      note.current?.focus({ preventScroll: true })
    }
  }, [side, turning])

  function flip(event: MouseEvent<HTMLButtonElement>) {
    setInstantFlip(event.detail === 0)
    setTurning(!reducedMotion && event.detail !== 0)
    flipFocus.current = side === 'front'
    setSide((current) => current === 'front' ? 'back' : 'front')
  }

  async function deliver(payload: string, id: string) {
    try {
      const response = await fetch('/api/feedback', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...JSON.parse(payload), id }),
        signal: AbortSignal.timeout(15_000),
      })
      const result = await response.json() as { id?: string; error?: string }
      if (!response.ok || !result.id) throw new Error(result.error ?? 'Your postcard couldn’t be delivered. Please try again.')
      setReceipt(result.id.slice(0, 8).toUpperCase())
      setStatus('sent')
    } catch (cause) {
      setError(cause instanceof Error && cause.name !== 'TimeoutError'
        ? cause.message
        : 'Delivery took a little too long. Your note is still here; please try again.')
      setStatus('failed')
    }
  }

  async function send(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    if (status !== 'writing') return
    if (message.trim().length < 3) {
      setMessageError(message.trim().length === 0 ? 'A few words first.' : 'Write a little more first.')
      note.current?.focus()
      return
    }
    setMessageError('')
    setError('')
    setStatus('sending')
    const website = new FormData(event.currentTarget).get('website')
    const payload = JSON.stringify({ kind, visibility: 'private', message: message.trim(), name: name.trim(), website })
    if (retry.current?.payload !== payload) {
      retry.current = { payload, id: crypto.randomUUID() }
    }
    await deliver(retry.current.payload, retry.current.id)
  }

  async function retryDelivery() {
    if (!retry.current || status !== 'failed') return
    setError('')
    setStatus('retrying')
    await deliver(retry.current.payload, retry.current.id)
  }

  function editDraft() {
    setError('')
    setMessageError('')
    flipFocus.current = true
    setSide('back')
    setStatus('writing')
  }

  function reset() {
    setMessage('')
    setName('')
    setError('')
    setMessageError('')
    retry.current = null
    setSide('back')
    setStatus('writing')
  }

  const sending = status === 'sending'
  const showingResult = sending || status === 'sent' || status === 'failed' || status === 'retrying'
  const failed = status === 'failed' || status === 'retrying'

  useEffect(() => {
    if (showingResult) resultHeading.current?.focus({ preventScroll: true })
  }, [showingResult, failed, status])

  return (
    <motion.section layout={!stackedLayout} transition={{ layout: { duration: reducedMotion ? 0 : 0.2, ease: [0.22, 1, 0.36, 1] } }} className={styles.experience} aria-label="Write Mo a postcard" data-result={sending ? 'sending' : showingResult ? (failed ? 'failed' : 'sent') : 'writing'}>
      <div className={styles.postcardArea}>
        <div className={styles.cardStage}>
          <AnimatePresence mode="popLayout" initial={false}>
            {showingResult ? (
              <motion.section key={sending ? 'sending-result' : failed ? 'failed-result' : 'sent-result'} className={styles.delivered} data-state={sending ? 'sending' : failed ? 'failed' : 'sent'} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: reducedMotion ? 0 : 0.16, ease: [0.22, 1, 0.36, 1] }} aria-labelledby={sending ? 'sending-title' : failed ? 'failed-title' : 'delivered-title'}>
                <div className={styles.resultTop}>
                  <img src="/brand/mo-mark-v3.svg" alt="MO" width="132" height="80" />
                </div>
                <div className={styles.resultBody}>
                  <div className={styles.resultCopy}>
                    <span className={styles.receiptLabel}>{sending ? 'ON ITS WAY' : failed ? (status === 'retrying' ? 'SENDING AGAIN' : 'DELIVERY UPDATE') : 'YOUR NOTE IS IN'}</span>
                    <h2 id={sending ? 'sending-title' : failed ? 'failed-title' : 'delivered-title'} tabIndex={-1} ref={resultHeading}>{sending ? <>On its way.</> : failed ? <>A small delivery<br />snag.</> : <>Your postcard<br />made it.</>}</h2>
                    <p role={failed ? 'alert' : sending ? 'status' : undefined}>{sending ? 'Your note is travelling to Mo.' : failed ? (status === 'retrying' ? 'Trying again. Your note is still here.' : error || 'Your note is still here. Please try sending again.') : 'Your words made it.'}</p>
                  </div>
                  <motion.span className={styles.resultStamp} data-state={sending ? 'sending' : failed ? 'failed' : 'sent'} aria-label={sending ? 'Postcard in transit' : failed ? 'Postcard return stamp' : 'Postcard delivery stamp'} initial={reducedMotion ? false : { opacity: 0, rotate: failed ? -6 : 6 }} animate={{ opacity: 1, rotate: sending ? 0 : failed ? -3 : 3 }} transition={{ duration: reducedMotion ? 0 : 0.2, delay: reducedMotion ? 0 : 0.03, ease: [0.22, 1, 0.36, 1] }}>
                    <span className={styles.resultMark}><ResultMark failed={failed} sending={sending} /></span>
                    <span className={styles.resultSeal}>{sending ? 'IN TRANSIT' : failed ? 'RETURN' : 'MO · CAIRO'}</span>
                  </motion.span>
                </div>
                <div className={styles.resultFooter}>
                  <div className={styles.receipt}>{sending ? 'POSTCARD / IN TRANSIT' : failed ? 'YOUR NOTE / STILL HERE' : <>POSTCARD NO. {receipt}</>}</div>
                  {failed && <div className={styles.resultActions}>
                    <button className={styles.another} onClick={retryDelivery} disabled={status === 'retrying'}>{status === 'retrying' ? 'Sending again…' : 'Try sending again'} <Arrow /></button>
                    <button className={styles.editDraft} onClick={editDraft} disabled={status === 'retrying'}>Edit note</button>
                  </div>}
                </div>
              </motion.section>
            ) : (
              <motion.div key="postcard" className={styles.cardShell} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: reducedMotion ? 0 : 0.18, ease: [0.22, 1, 0.36, 1] }}>
                <motion.div id="feedback-postcard" className={styles.flipper} initial={false} animate={{ rotateY: side === 'back' ? 180 : 0 }} transition={{ duration: reducedMotion || instantFlip ? 0 : 0.48, ease: [0.22, 1, 0.36, 1] }} onAnimationComplete={() => setTurning(false)}>
                  <div className={styles.front} inert={side !== 'front'} aria-hidden={side !== 'front'}>
                    <div className={styles.frontArtwork}><PostcardFront /></div>
                  </div>
                  <form className={styles.back} onSubmit={send} noValidate inert={side !== 'back' || turning} aria-hidden={side !== 'back' || turning}>
                    <PostcardLetter kind={kind} instant={instantStamp} message={message} name={name} messageError={messageError} onMessageChange={(value) => { setMessage(value); if (messageError) setMessageError('') }} onNameChange={setName} disabled={turning} textareaRef={note} />
                    <div className={styles.honeypot} aria-hidden="true"><label>Website<input name="website" tabIndex={-1} autoComplete="off" /></label></div>
                  </form>
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
        <div className={styles.cardTools}>
          <CutCornerButton className={styles.flipButton} onClick={showingResult ? reset : flip} disabled={!hydrated || status === 'sending' || status === 'retrying'} aria-controls={showingResult ? undefined : 'feedback-postcard'} type="button" variant="paper" data-flip data-side={side} data-instant={instantFlip}>
            <CardTurnIcon />
            <span className={styles.flipLabel}>{status === 'sending' ? 'Sending…' : showingResult ? 'Send another' : side === 'front' ? writeLabel : 'View artwork'}</span>
          </CutCornerButton>
        </div>
      </div>
      <aside className={styles.stampTray} data-visible={status === 'writing'} aria-label="Postcard stamps" aria-hidden={status !== 'writing'} inert={status !== 'writing'}>
        <div className={styles.stampTrayReveal}>
          <div className={styles.stampTrayContent}>
            <StampPicker kind={kind} onChange={setKind} instant={instantStamp} onInstantChange={setInstantStamp} disabled={!hydrated} />
          </div>
        </div>
      </aside>
    </motion.section>
  )
}

export function FeedbackPage() {
  return (
    <MotionConfig reducedMotion="user">
      <main className={styles.page}>
        <nav className={styles.nav} aria-label="Page navigation">
          <a href="/" className={styles.brand} aria-label="MO portfolio home"><img src="/brand/mo-mark-v3.svg" alt="MO" width="132" height="80" /></a>
          <div className={styles.navLinks}><CutCornerButton href="/" variant="paper">Back to portfolio <span aria-hidden="true">↗</span></CutCornerButton></div>
        </nav>
        <div className={styles.layout}>
          <header className={styles.heading}>
            <div>
              <span className={styles.label}>A POSTCARD FOR MO</span>
              <h1>Leave me <span>a note.</span></h1>
            </div>
            <p>What caught your eye?<br />What could I make better?</p>
          </header>
          <Postcard />
        </div>
        <footer className={styles.footer}><span>MO / FEEDBACK</span><span>Thanks for stopping by.</span></footer>
      </main>
    </MotionConfig>
  )
}
