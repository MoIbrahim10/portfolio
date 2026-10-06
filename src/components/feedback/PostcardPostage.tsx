import { useId } from 'react'
import type { ReactNode } from 'react'

import styles from './PostcardPostage.module.css'

export const POSTCARD_STAMPS = [
  { id: 'love', label: 'Loved it', title: 'First light', prompt: 'What did you like?' },
  { id: 'idea', label: 'An idea', title: 'New paths', prompt: 'What would you change or add?' },
  { id: 'issue', label: 'Something broke', title: 'Held together', prompt: 'What happened? Where did you notice it?' },
] as const

export type PostcardKind = typeof POSTCARD_STAMPS[number]['id']

function StampFrame({ children }: { children: ReactNode }) {
  const perforation = useId()
  return <svg aria-hidden="true" viewBox="0 0 72 98" fill="none">
    <defs><mask id={perforation}><rect width="72" height="98" fill="white" />{[8, 20, 32, 44, 56, 68, 80, 92].map((y) => <g key={y}><circle cy={y} r="2.4" fill="black" /><circle cx="72" cy={y} r="2.4" fill="black" /></g>)}{[8, 20, 32, 44, 56, 68].map((x) => <g key={x}><circle cx={x} r="2.4" fill="black" /><circle cx={x} cy="98" r="2.4" fill="black" /></g>)}</mask></defs>
    <g mask={`url(#${perforation})`}>
    <path d="M4 0h64v4h4v90h-4v4H4v-4H0V4h4Z" fill="#fffaf0" />
    {children}
    </g>
  </svg>
}

export function StampArt({ kind }: { kind: PostcardKind }) {
  if (kind === 'issue') return <StampFrame><HeldTogetherStampArt /></StampFrame>
  return <StampFrame>
    <path d="M8 8h56v82H8Z" fill={kind === 'love' ? '#9f3732' : '#d79d40'} />
    <path d="M12 22h48v54H12Z" stroke="#fffaf0" strokeOpacity=".5" strokeWidth=".5" />
    <text x="13" y="17" fill={kind === 'idea' ? '#102b43' : '#fffaf0'} fontSize="5" fontFamily="monospace" letterSpacing="1.2">MO · CAIRO</text>
    {kind === 'love' ? <>
      <path d="M18 75V43h5v-7h6v-6h14v6h6v7h5v32Z" fill="#f3e8d3" />
      <path d="M24 75V47h5v-6h14v6h5v28Z" fill="#102b43" />
      <circle cx="36" cy="51" r="6" fill="#d79d40" />
      <path d="M24 65c8-4 16 4 24 0m-24 5c8-4 16 4 24 0" stroke="#f3e8d3" strokeWidth=".7" />
    </> : <>
      <path d="M20 75V29m16 46V29m16 46V29M13 37h46M13 53h46M13 69h46" stroke="#102b43" strokeWidth=".5" strokeOpacity=".25" />
      <path d="M18 72V58c0-14 34-3 34-18V28" stroke="#102b43" strokeWidth="3" />
      <path d="m45 35 7-7 7 7" stroke="#102b43" strokeWidth="2" />
      <path d="m29 34 2 5 5 2-5 2-2 5-2-5-5-2 5-2Z" fill="#fffaf0" />
      <circle cx="18" cy="72" r="3" fill="#fffaf0" />
    </>}
    <text x="36" y="85" textAnchor="middle" fill={kind === 'idea' ? '#102b43' : '#fffaf0'} fontSize="4.5" fontFamily="monospace" letterSpacing=".6">{kind === 'love' ? 'FIRST LIGHT' : 'NEW PATHS'}</text>
  </StampFrame>
}

function HeldTogetherStampArt() {
  return <g>
    <path d="M8 8h56v82H8Z" fill="#102b43" />
    <path d="M14 25h23l-3 9 4 7-5 9 4 8-4 15H14Z" fill="#fffaf0" />
    <path d="M42 25h16v48H39l4-15-4-8 5-9-4-7Z" fill="#f3e8d3" />
    <path d="m30 30 14 2m-15 11 17 1m-17 12 17 1m-18 10 15 1" stroke="#d79d40" strokeWidth="1.5" strokeLinecap="round" />
    <path d="M19 30v38m34-38v38" stroke="#102b43" strokeWidth=".5" strokeOpacity=".35" />
    <g fill="#fffaf0" fontFamily="monospace"><text x="13" y="17" fontSize="5" letterSpacing="1.2">MO · CAIRO</text><text x="36" y="85" textAnchor="middle" fontSize="4.5" letterSpacing=".6">HELD TOGETHER</text></g>
  </g>
}

export function StampPicker({ kind, onChange, disabled = false, instant = false, onInstantChange }: {
  kind: PostcardKind
  onChange: (kind: PostcardKind) => void
  disabled?: boolean
  instant?: boolean
  onInstantChange: (instant: boolean) => void
}) {
  const instance = useId()
  return <fieldset className={styles.picker} disabled={disabled} data-instant={instant} onKeyDown={() => onInstantChange(true)} onPointerDown={() => onInstantChange(false)}>
    <legend>Choose your stamp</legend>
    <div className={styles.options}>{POSTCARD_STAMPS.map((stamp, index) => <label key={stamp.id} className={styles.option} data-selected={stamp.id === kind}>
      <input type="radio" name={`${instance}-stamp`} value={stamp.id} checked={stamp.id === kind} onChange={() => onChange(stamp.id)} aria-label={stamp.label} />
      <span className={styles.print}><StampArt kind={stamp.id} /><i aria-hidden="true">↗</i></span>
      <span className={styles.caption}><strong>{stamp.label}</strong><small><span>0{index + 1}</span>{stamp.title}</small></span>
    </label>)}</div>
  </fieldset>
}
