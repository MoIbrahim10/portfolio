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
function Arrow() {
  return (
    <svg aria-hidden="true" viewBox="0 0 24 24" fill="none">
      <path d="M4 12h15m-6-6 6 6-6 6" />
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
  const [kind, setKind] = useState<Kind>('love')
  const [instantStamp, setInstantStamp] = useState(false)
  const [side, setSide] = useState<'front' | 'back'>('front')
  const [instantFlip, setInstantFlip] = useState(false)
  const [message, setMessage] = useState('')
  const [name, setName] = useState('')
  const [status, setStatus] = useState<'writing' | 'sending' | 'sent'>('writing')
  const [error, setError] = useState('')
  const [receipt, setReceipt] = useState('')
  const retry = useRef<{ payload: string; id: string } | null>(null)
  const note = useRef<HTMLTextAreaElement>(null)
  const flipFocus = useRef(false)
  const reducedMotion = useReducedMotion()
  const writeLabel = message || name ? 'Back to your note' : 'Write a note'

  useEffect(() => { setHydrated(true) }, [])

  function flip(event: MouseEvent<HTMLButtonElement>) {
    setInstantFlip(event.detail === 0)
    flipFocus.current = side === 'front'
    setSide((current) => current === 'front' ? 'back' : 'front')
  }

  async function send(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    if (status !== 'writing') return
    setError('')
    setStatus('sending')
    const website = new FormData(event.currentTarget).get('website')
    const payload = JSON.stringify({ kind, visibility: 'private', message: message.trim(), name: name.trim(), website })
    if (retry.current?.payload !== payload) {
      retry.current = { payload, id: crypto.randomUUID() }
    }

    try {
      const response = await fetch('/api/feedback', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...JSON.parse(payload), id: retry.current.id }),
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
      setStatus('writing')
    }
  }

  function reset() {
    setMessage('')
    setName('')
    setError('')
    retry.current = null
    setSide('back')
    setStatus('writing')
  }

  return (
    <section className={styles.experience} aria-label="Write Mo a postcard" data-delivered={status === 'sent'}>
      <div className={styles.postcardArea}>
        <div className={styles.cardStage}>
          <AnimatePresence mode="wait">
            {status === 'sent' ? (
              <motion.section key="receipt" className={styles.delivered} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} aria-labelledby="delivered-title">
                <div className={styles.deliveryMark} aria-hidden="true">DELIVERED<span>MO · CAIRO</span></div>
                <span className={styles.receiptLabel}>YOUR NOTE IS IN.</span>
                <h2 id="delivered-title" tabIndex={-1} ref={(element) => element?.focus()}>Thanks for<br />the postcard.</h2>
                <p>Delivered to Mo.</p>
                <div className={styles.receipt}>POSTCARD NO. {receipt}</div>
                <button className={styles.another} onClick={reset}>Write another postcard <Arrow /></button>
              </motion.section>
            ) : (
              <motion.div
                key="postcard"
                className={styles.cardShell}
                initial={{ opacity: 0, y: 18 }}
                animate={{ opacity: 1, y: 0 }}
                exit={reducedMotion ? { opacity: 0 } : { opacity: 0, y: 35, scale: 0.97 }}
                transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
              >
                <motion.div
                  id="feedback-postcard"
                  className={styles.flipper}
                  animate={{ rotateY: side === 'back' ? 180 : 0 }}
                  transition={{ duration: reducedMotion || instantFlip ? 0 : 0.48, ease: [0.22, 1, 0.36, 1] }}
                  onAnimationComplete={() => {
                    if (side === 'back' && flipFocus.current) {
                      flipFocus.current = false
                      if (document.activeElement === document.body || document.activeElement?.hasAttribute('data-flip')) {
                        note.current?.focus({ preventScroll: true })
                      }
                    }
                  }}
                >
                  <div className={styles.front} inert={side !== 'front'} aria-hidden={side !== 'front'}>
                    <div className={styles.frontArtwork}><PostcardFront /></div>
                  </div>

                  <form className={styles.back} onSubmit={send} inert={side !== 'back'} aria-hidden={side !== 'back'}>
                    <PostcardLetter kind={kind} instant={instantStamp} message={message} name={name} onMessageChange={setMessage} onNameChange={setName} disabled={status === 'sending'} textareaRef={note} sendLabel={status === 'sending' ? 'Sending…' : 'Send postcard'} />
                    <div className={styles.honeypot} aria-hidden="true"><label>Website<input name="website" tabIndex={-1} autoComplete="off" /></label></div>
                  </form>
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {status !== 'sent' && (
          <div className={styles.cardTools}>
            <CutCornerButton className={styles.flipButton} onClick={flip} disabled={!hydrated || status === 'sending'} aria-controls="feedback-postcard" type="button" variant="paper" data-flip data-side={side} data-instant={instantFlip}><CardTurnIcon /><span className={styles.flipLabel}>{side === 'front' ? writeLabel : 'View artwork'}</span></CutCornerButton>
          </div>
        )}
        <p className={styles.error} role="alert">{error}</p>
      </div>
      {status !== 'sent' && (
        <aside className={styles.stampTray} aria-label="Postcard stamps">
          <StampPicker kind={kind} onChange={setKind} instant={instantStamp} onInstantChange={setInstantStamp} disabled={!hydrated || status === 'sending'} />
        </aside>
      )}
    </section>
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
