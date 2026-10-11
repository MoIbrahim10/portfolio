import { useState } from 'react'
import type { ReactNode } from 'react'

import { CutCornerButton } from '#/components/v14-exploration-lab/CutCornerButton'

import { CompassScene, DoorwayScene } from './Spatial404Artwork'
import { OfflineScene } from './OfflineArtwork'
import type { StateKind } from './state-concepts'
import styles from './StateExplorationLab.module.css'

interface ArtworkProps {
  kind: StateKind
  index: number
  value?: number
  marks?: number[]
}

function Arch() {
  return <path className={styles.goldStroke} d="M140 315V150h28v-28h28V94h128v28h28v28h28v165h-48V175h-28v-28h-88v28h-28v140z" />
}

export function StateArtwork({ kind, index, value = 0, marks = [] }: ArtworkProps) {
  let drawing: ReactNode

  switch (`${kind}-${index}`) {
    case '404-0':
      drawing = <DoorwayScene />
      break
    case '404-1':
      drawing = <CompassScene />
      break
    case 'error-0':
      drawing = <>
        <path className={styles.softFill} d="M107 72h306v257H107z" />
        <path className={styles.goldStroke} d="M125 90h270v221H125z" />
        <g className={styles.moving} transform={`rotate(${value * 90} 260 198)`}>
          <circle className={styles.accentFill} cx="260" cy="198" r="70" />
          <circle className={styles.goldStroke} cx="260" cy="198" r="53" />
          <path className={styles.paperStroke} strokeWidth="11" d="M226 198h68M260 164v68" />
        </g>
        {[[142, 106], [378, 106], [142, 294], [378, 294]].map(([x, y], i) => <g key={i}><circle className={styles.goldFill} cx={x} cy={y} r="7" /><line className={styles.inkStroke} x1={x - 4} y1={y} x2={x + 4} y2={y} /></g>)}
        <text className={styles.annotation} x="260" y="372" textAnchor="middle">{value >= 3 ? 'A LITTLE BETTER ALREADY' : 'SMALL DETAILS MAKE A DIFFERENCE'}</text>
      </>
      break
    case 'error-1':
      drawing = <>
        <Arch />
        {[0, 1, 2, 3].map(i => <g key={i} className={styles.moving} transform={marks.includes(i) ? 'translate(0 0) rotate(0)' : `translate(${i < 2 ? -60 : 60} ${i % 2 ? 65 : 25})`}>
          <path className={i % 2 ? styles.goldFill : styles.accentFill} d={['M140 175h48v140h-48z', 'M140 150v-28h56v53h-56z', 'M196 94h128v53H196z', 'M324 122h28v28h28v165h-48V175h-8z'][i]} />
          <text className={styles.markerType} x={[164, 168, 260, 353][i]} y={[258, 157, 126, 239][i]} textAnchor="middle">{i + 1}</text>
        </g>)}
        <path className={styles.faintStroke} d="M60 340h400" />
      </>
      break
    case 'error-2':
      drawing = <>
        <rect className={styles.softFill} x="46" y="50" width="428" height="284" />
        {Array.from({ length: 7 }, (_, i) => <g className={styles.moving} key={i} transform={`translate(${(100 - value) * (i % 2 ? -0.45 : 0.45)} 0)`}>
          <path className={i % 2 ? styles.accentStroke : styles.inkStroke} strokeWidth="13" d={`M160 ${90 + i * 31}h200M160 ${90 + i * 31}v24m200-24v24`} />
          <line className={styles.goldStroke} x1="176" y1={101 + i * 31} x2="344" y2={101 + i * 31} />
        </g>)}
        <path className={styles.accentFill} d="M216 369v-16l-18 8zm29 0v-16l-18 8z" />
        <text className={styles.annotation} x="277" y="366">TAKE TWO</text>
      </>
      break
    case 'error-3':
      drawing = <>
        <path className={styles.softFill} d="M50 65h420v268H50z" />
        {[0, 1, 2].map(i => <g key={i}>
          <path className={marks.includes(i) ? styles.goldStroke : styles.faintStroke} d={`M${138 + i * 123} 255V131`} />
          <circle className={marks.includes(i) ? styles.goldFill : styles.inkFill} cx={138 + i * 123} cy="112" r="22" />
          <rect className={styles.inkFill} x={107 + i * 123} y="222" width="62" height="75" />
          <rect className={`${styles.paperFill} ${styles.moving}`} x={115 + i * 123} y={marks.includes(i) ? 230 : 255} width="46" height="34" />
        </g>)}
      </>
      break
    case 'error-4':
      drawing = <>
        <path className={styles.faintStroke} strokeDasharray="5 8" d="M260 48v236" />
        <g key={value} className={value ? styles.dropping : undefined}><circle className={styles.goldFill} cx="260" cy="90" r="28" /><circle className={styles.accentStroke} cx="260" cy="90" r="18" /></g>
        <path className={styles.accentStroke} strokeWidth="4" d="M126 274q134 108 268 0" />
        <path className={styles.goldStroke} d="M145 291q115 116 230 0M168 306q92 115 184 0M197 320q63 105 126 0M126 274l62 76m206-76-62 76M182 309l27 49m129-49-27 49M260 326v43" />
        <path className={styles.inkStroke} d="M120 268v91m280-91v91" />
      </>
      break
    case 'error-5':
      drawing = <>
        <circle className={styles.faintStroke} cx="260" cy="195" r="142" />
        <circle className={styles.goldStroke} cx="260" cy="195" r="120" />
        <g className={styles.moving} transform={`rotate(${value * 90} 260 195)`}>
          <circle className={styles.accentFill} cx="260" cy="141" r="34" />
          <circle className={styles.paperStroke} cx="260" cy="141" r="16" />
          <path className={styles.goldFill} d="M251 175h18v99h26v-18h-26v-20h38v-16h-38v-45z" />
        </g>
        <text className={styles.annotation} x="260" y="378" textAnchor="middle">{value ? 'A NEW START IS ALWAYS AN OPTION' : 'TURN TOWARDS A FRESH START'}</text>
      </>
      break
    case 'error-6':
      drawing = <>
        <path className={styles.paperFill} d="M54 70h177l-14 56 27 45-21 49 21 48-22 59H54zM466 70H270l-14 56 27 45-21 49 21 48-22 59h205z" />
        <path className={styles.accentStroke} d="M231 70l-14 56 27 45-21 49 21 48-22 59M270 70l-14 56 27 45-21 49 21 48-22 59" />
        {[0, 1, 2, 3].map(i => <g key={i}>
          <circle className={styles.goldFill} cx="204" cy={112 + i * 58} r="6" />
          <circle className={styles.goldFill} cx="295" cy={112 + i * 58} r="6" />
          {marks.includes(i) ? <path className={styles.goldStroke} strokeWidth="4" d={`M204 ${112 + i * 58}L295 ${112 + i * 58 + 15}M204 ${127 + i * 58}L295 ${112 + i * 58}`} /> : null}
        </g>)}
        <text className={styles.annotation} x="260" y="375" textAnchor="middle">VISIBLE MENDING / A LITTLE CHARACTER</text>
      </>
      break
    case 'error-7':
      drawing = <>
        <g className={styles.moving} transform={`translate(${(100 - value) * -0.7} 0)`}><path className={styles.paperStroke} strokeWidth="22" d="M140 315V150h28v-28h28V94h64" /></g>
        <g className={styles.moving} transform={`translate(${(100 - value) * 0.7} 0)`}><path className={styles.goldStroke} strokeWidth="22" d="M260 94h64v28h28v28h28v165" /></g>
        <path className={styles.faintStroke} d="M260 40V355M80 315h360" />
        <text className={styles.annotation} x="260" y="378" textAnchor="middle">A SMALL SHIFT CHANGES EVERYTHING</text>
      </>
      break
    case 'error-8':
      drawing = <>
        <rect className={styles.paperFill} x="60" y="58" width="400" height="288" />
        <path className={styles.faintStroke} d="M78 80h364v244H78z" />
        <g className={styles.moving} transform={`rotate(${value ? -4 : 7} 260 205)`}>
          <rect className={styles.accentStroke} strokeWidth="5" x="101" y="118" width="318" height="130" />
          <text className={`${styles.stampType} ${styles.accentText}`} x="260" y="199" textAnchor="middle">{value ? 'TAKE TWO' : 'MISPRINT'}</text>
          <text className={styles.annotation} x="260" y="229" textAnchor="middle">{value ? 'A FRESH IMPRESSION' : 'FIRST ATTEMPT / NO. 001'}</text>
        </g>
        <text className={styles.annotation} x="260" y="302" textAnchor="middle">CRAFT IS A PROCESS</text>
      </>
      break
    default:
      drawing = <>
        <rect className={styles.paperFill} x="80" y="52" width="360" height="290" />
        <text className={styles.postcardType} x="117" y="119">Every good thing</text>
        <text className={styles.postcardType} x="117" y="162">starts again.</text>
        <path className={styles.goldStroke} d="M117 191h271M117 222h231M117 253h257M117 284h131" />
        {Array.from({ length: 4 }, (_, i) => <path key={i} className={`${styles.accentStroke} ${styles.moving}`} strokeWidth="7" opacity={value > i ? 0 : 1} d={`M100 ${91 + i * 60}q120-42 300 12q-140-40-285 26q176-62 272 7`} />)}
        <text className={styles.annotation} x="260" y="378" textAnchor="middle">SECOND DRAFT / A LITTLE CLEARER</text>
      </>
  }

  return (
    <svg aria-hidden="true" className={styles.scene} focusable="false" viewBox="0 0 520 400">
      {kind === 'offline' ? <OfflineScene index={index} /> : drawing}
    </svg>
  )
}

export function InteractiveArtwork({ kind, index }: { kind: StateKind; index: number }) {
  const [value, setValue] = useState(0)
  const [marks, setMarks] = useState<number[]>([])
  let controls: ReactNode
  let status = ''
  const sceneKey = `${kind}-${index}`

  function action(label: string, onClick: () => void, disabled = false) {
    return <CutCornerButton disabled={disabled} onClick={onClick} variant="paper">{label}</CutCornerButton>
  }

  function range(label: string) {
    return <label className={styles.rangeLabel}><span>{label}<span>{value}%</span></span><input aria-label={label} max="100" min="0" onChange={event => setValue(Number(event.target.value))} type="range" value={value} /></label>
  }

  function addMark(i: number) { setMarks(current => current.includes(i) ? current : [...current, i]) }

  function markButtons(count: number, label: string) {
    return <div className={styles.numberControls}>{Array.from({ length: count }, (_, i) => <button aria-label={`${label} ${i + 1}`} aria-pressed={marks.includes(i)} className={styles.numberButton} key={i} onClick={() => addMark(i)} type="button">{marks.includes(i) ? '✓' : i + 1}</button>)}</div>
  }

  switch (sceneKey) {
    case 'error-0':
      controls = action(value >= 3 ? 'A little tighter ✓' : 'Quarter turn ↻', () => setValue(Math.min(3, value + 1)), value >= 3)
      status = value >= 3 ? 'Illustration repaired. Try the page again below.' : `${value} of 3 turns. A satisfying little fix.`
      break
    case 'error-1':
      controls = markButtons(4, 'Place block')
      status = marks.length === 4 ? 'Built again. With a little more character.' : `${marks.length} of 4 pieces back in place.`
      break
    case 'error-2':
      controls = range('Rewind the picture')
      status = value === 100 ? 'Back in alignment. Ready for another take.' : 'Roll it back. Watch it come together.'
      break
    case 'error-3':
      controls = <div className={styles.numberControls}>{[0, 1, 2].map(i => <button aria-checked={marks.includes(i)} aria-label={`Switch ${i + 1}`} className={styles.numberButton} key={i} onClick={() => setMarks(current => current.includes(i) ? current.filter(mark => mark !== i) : [...current, i])} role="switch" type="button">{marks.includes(i) ? 'ON' : 'OFF'}</button>)}</div>
      status = marks.length === 3 ? 'Illustration lit. Try the page again when you’re ready.' : 'A little light, one switch at a time.'
      break
    case 'error-4':
      controls = action('Give it a soft landing ↓', () => setValue(value + 1))
      status = value ? 'There’s room for another try.' : 'A little safety net for a little gold ball.'
      break
    case 'error-5':
      controls = action('Turn the key ↻', () => setValue(value + 1))
      status = value ? 'A fresh start. A little room to try again.' : 'A small ritual for a new beginning.'
      break
    case 'error-6':
      controls = markButtons(4, 'Add stitch')
      status = marks.length === 4 ? 'The joins are part of the story.' : `${marks.length} of 4 stitches. A little better with each one.`
      break
    case 'error-7':
      controls = range('Align the layers')
      status = value === 100 ? 'A whole new perspective.' : 'Bring the two sides back together.'
      break
    case 'error-8':
      controls = action(value ? 'Print another impression ↓' : 'A fresh impression ↓', () => setValue(value + 1))
      status = value ? `Impression ${value + 1}. Every attempt is a new beginning.` : 'A first attempt is only a first attempt.'
      break
    default:
      controls = action(value >= 4 ? 'A clear new beginning ✓' : 'Erase a little →', () => setValue(Math.min(4, value + 1)), value >= 4)
      status = value >= 4 ? 'A fresh page. Another possibility.' : `${value} of 4 lines cleared. A little room for something better.`
  }

  return (
    <div className={styles.interactiveArt}>
      <div className={styles.artCanvas}>
        <span aria-hidden="true" className={styles.artCorner}>MO / {kind === '404' ? '404' : kind === 'offline' ? 'OFF' : 'ERR'}</span>
        <StateArtwork index={index} kind={kind} marks={marks} value={value} />
        <span aria-hidden="true" className={styles.artEdition}>FIG. {String(index + 1).padStart(2, '0')}</span>
      </div>
      <div className={styles.artControls}>{controls}</div>
      <p aria-live="polite" className={styles.artStatus}>{status}</p>
    </div>
  )
}
