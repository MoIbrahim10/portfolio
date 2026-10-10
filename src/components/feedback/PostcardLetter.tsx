import { useEffect, useId, useRef, useState } from 'react'
import type { Ref } from 'react'

import { CutCornerButton } from '#/components/v14-exploration-lab/CutCornerButton'
import { POSTCARD_STAMPS, StampArt } from './PostcardPostage'
import type { PostcardKind } from './PostcardPostage'
import styles from './PostcardLetter.module.css'

export function PostcardLetter({ kind, instant = false, message, name, messageError, onMessageChange, onNameChange, disabled = false, textareaRef, sendLabel = 'Send postcard' }: {
  kind: PostcardKind
  instant?: boolean
  message: string
  name: string
  messageError?: string
  onMessageChange: (value: string) => void
  onNameChange: (value: string) => void
  disabled?: boolean
  textareaRef?: Ref<HTMLTextAreaElement>
  sendLabel?: string
}) {
  const instance = useId()
  const [messageFocused, setMessageFocused] = useState(false)
  const ruleGuide = useRef<HTMLSpanElement>(null)
  const selected = POSTCARD_STAMPS.find((stamp) => stamp.id === kind)!
  const showCount = messageFocused && message.length > 0
  useEffect(() => {
    const guide = ruleGuide.current
    if (!guide) return
    const alignRules = () => {
      const baseline = guide.firstElementChild!.getBoundingClientRect().top - guide.getBoundingClientRect().top
      guide.parentElement!.style.setProperty('--rule-baseline', `${baseline + 1}px`)
    }
    const observer = new ResizeObserver(alignRules)
    observer.observe(guide)
    alignRules()
    return () => observer.disconnect()
  }, [])
  return <div className={styles.frame} data-letter-kind={kind} data-instant={instant}>
    <div className={styles.letter}>
      <div className={styles.atmosphere} aria-hidden="true">{POSTCARD_STAMPS.map((stamp) => <div key={stamp.id} className={styles.paperLayer} data-paper={stamp.id} data-active={kind === stamp.id}>
        <svg viewBox="0 0 240 360" fill="none">
          {stamp.id === 'love' ? <><path d="M15 360V160h30v-40h30V80h90v40h30v40h30v200M45 360V180h30v-40h90v40h30v180M75 360V200h30v-20h30v20h30v160" stroke="currentColor" /><circle cx="120" cy="238" r="27" fill="currentColor" /></>
            : stamp.id === 'idea' ? <><path d="M20 360V240c0-120 200 0 200-120V0M40 360V250c0-110 160 0 160-120V0M60 360V260c0-100 120 0 120-120V0M80 360V270c0-90 80 0 80-120V0" stroke="currentColor" /><path d="m80 70 8 22 22 8-22 8-8 22-8-22-22-8 22-8Z" fill="currentColor" /></>
              : <><path d="M25 360V160a95 95 0 0 1 190 0v200M45 360V160a75 75 0 0 1 150 0v200M65 360V160a55 55 0 0 1 110 0v200" stroke="currentColor" /><path d="M120 57v32M18 270h54m96 0h54" stroke="currentColor" strokeWidth="2" strokeDasharray="3 3" /></>}
        </svg>
      </div>)}</div>
      <aside className={styles.rail} data-perforated-edge aria-hidden="true" />
      <div className={styles.writing}>
        <div className={styles.body}>
          <div className={styles.note}>
            <label className={styles.title} htmlFor={`${instance}-message`}>A few words<br /> for <em>Mo.</em></label>
            <div className={styles.messageField}><span ref={ruleGuide} className={styles.ruleGuide} aria-hidden="true"><span />Ag</span><textarea ref={textareaRef} id={`${instance}-message`} name="message" aria-label="Your feedback" placeholder={selected.prompt} value={message} onChange={(event) => onMessageChange(event.target.value)} onScroll={(event) => event.currentTarget.parentElement!.style.setProperty('--rule-scroll', `${event.currentTarget.scrollTop}px`)} onFocus={() => setMessageFocused(true)} onBlur={() => setMessageFocused(false)} minLength={3} maxLength={2000} required disabled={disabled} aria-invalid={messageError ? true : undefined} aria-describedby={[showCount ? `${instance}-count` : '', messageError ? `${instance}-error` : ''].filter(Boolean).join(' ') || undefined} />{showCount && <span className={styles.count} id={`${instance}-count`} data-near-limit={message.length > 1900} aria-label={`${2000 - message.length} characters left`}><strong>{(2000 - message.length).toLocaleString('en')}</strong>{' '}<span>left</span></span>}{messageError && <span className={styles.fieldError} id={`${instance}-error`} role="alert">{messageError}</span>}</div>
            <div className={styles.signature}><label htmlFor={`${instance}-name`}>From</label><input id={`${instance}-name`} name="name" aria-label="Your name" placeholder="Your name" value={name} onChange={(event) => onNameChange(event.target.value)} maxLength={80} autoComplete="name" disabled={disabled} /></div>
          </div>
          <aside className={styles.destination}>
            <div className={styles.destinationTop}>
              <img className={styles.mark} src="/brand/mo-mark-v3.svg" alt="MO" width="68" height="42" />
              <div className={styles.postage} aria-hidden="true"><div key={kind} className={styles.affixedStamp} data-affixed-kind={kind}><StampArt kind={kind} /></div><svg className={styles.postmark} viewBox="0 0 110 50" fill="none"><circle cx="24" cy="25" r="20" stroke="currentColor" strokeWidth=".7" /><text x="24" y="27" textAnchor="middle" fill="currentColor" fontSize="7" fontFamily="monospace">CAIRO</text><path d="M48 17c10-7 16 7 26 0s16 7 26 0M48 25c10-7 16 7 26 0s16 7 26 0M48 33c10-7 16 7 26 0s16 7 26 0" stroke="currentColor" strokeWidth=".7" /></svg></div>
            </div>
            <div className={styles.address}><span>To</span><strong>Mo Ibrahim</strong><p>Cairo, Egypt</p></div>
          </aside>
        </div>
        <div className={styles.delivery}>
          <CutCornerButton className={styles.send} disabled={disabled} type="submit">{sendLabel}<span aria-hidden="true">↗</span></CutCornerButton>
        </div>
      </div>
    </div>
  </div>
}
