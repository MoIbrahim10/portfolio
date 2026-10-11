import { memo, useEffect, useId, useRef, useState } from 'react'
import type { KeyboardEvent, PointerEvent } from 'react'

import { SoundToggle, useStateSound } from './StateSound'
import styles from './StateExplorationLab.module.css'

function bearing(angle: number) { return (angle % 360 + 360) % 360 }

function isNorth(angle: number) {
  const direction = bearing(angle)
  return direction < 8 || direction > 352
}

function WingedSun() {
  return <>
    <path className={styles.sunRays} d="M260 146v15m0 88v15m-59-59h15m88 0h15M218 163l11 11m62 62 11 11m-84 0 11-11m62-62 11-11" />
    <g className={styles.sunWings}>
      <path className={styles.goldFill} d="M242 195c-24 3-43-5-66-23 2 21 17 38 40 47l-25 2 18 9 18-4-10 11 18-3 16-20z" />
      <path className={styles.goldStroke} d="M182 184q22 24 58 21m-51-11q16 21 45 19m-29 2 25 7" />
      <g transform="translate(520 0) scale(-1 1)"><path className={styles.goldFill} d="M242 195c-24 3-43-5-66-23 2 21 17 38 40 47l-25 2 18 9 18-4-10 11 18-3 16-20z" /><path className={styles.goldStroke} d="M182 184q22 24 58 21m-51-11q16 21 45 19m-29 2 25 7" /></g>
    </g>
    <path className={styles.sunFacet} d="M252 185h16l12 12v16l-12 12h-16l-12-12v-16z" />
    <path className={styles.sunFacetLight} d="M252 185h16l-8 20-20 8v-16z" />
    <path className={styles.inkFill} d="M260 197l8 8-8 8-8-8z" />
  </>
}

function DoorPanel({ right = false, back = false }: { right?: boolean; back?: boolean }) {
  const panelId = `door-panel-${useId().replaceAll(':', '')}`
  return <>
    <defs><linearGradient id={panelId} x1="0" x2="1" y1="0" y2="1"><stop stopColor="#b55341" /><stop offset="0.55" stopColor="#9f3732" /><stop offset="1" stopColor="#742a28" /></linearGradient></defs>
    <path className={styles.doorFace} d="M0 0h86v214H0z" style={{ fill: `url(#${panelId})` }} />
    <path className={styles.doorBevel} d={right ? 'M79 0h7v214h-7zM0 0h79v7H0z' : 'M0 0h7v214H0zM7 0h79v7H7z'} />
    <path className={styles.doorRecess} d="M19 25h48v162H19z" />
    <path className={styles.goldStroke} d="M12 16h61v182H12zM19 25h48v162H19zM25 32h36v148H25zM31 51h23m-23 113h23" />
    <path className={styles.doorCarving} d="M31 42l6-6 6 6 6-6 6 6M31 173l6 6 6-6 6 6 6-6M43 57l4 5-4 5-4-5zM43 149l4 5-4 5-4-5z" />
    <path className={styles.doorHinge} d={right ? 'M77 37h9v14h-9zM77 163h9v14h-9z' : 'M0 37h9v14H0zM0 163h9v14H0z'} />
    {back ? <path className={styles.goldStroke} d="M43 78l17 29-17 29-17-29zM43 88l11 19-11 19-11-19zM43 95v24" /> : <>
      <text className={styles.doorNumeral} x="43" y="138" textAnchor="middle">4</text>
      <path className={styles.doorHandlePlate} d={right ? 'M6 99l5 5v24l-5 5-4-5v-24z' : 'M79 99l5 5v24l-5 5-4-5v-24z'} />
      <path className={styles.doorHandle} d={right ? 'M6 108h3v18H6z' : 'M78 108h3v18h-3z'} />
    </>}
  </>
}

export function DoorwayScene({ openness = 0, leaves = true }: { openness?: number; leaves?: boolean }) {
  const courtyardId = `courtyard-${useId().replaceAll(':', '')}`

  return (
    <>
      <defs>
        <clipPath id={courtyardId}><path d="M174 122h172v214H174z" /></clipPath>
        <radialGradient id={`${courtyardId}-glow`} cx="50%" cy="30%" r="75%"><stop offset="0" stopColor="#edba62" stopOpacity="0.6" /><stop offset="1" stopColor="#d79d40" stopOpacity="0" /></radialGradient>
        <linearGradient id={`${courtyardId}-stone`} x1="0" x2="0.8" y1="0" y2="1"><stop stopColor="var(--portal-stone-light, #eee0c5)" /><stop offset="0.55" stopColor="var(--portal-stone, #dfceb0)" /><stop offset="1" stopColor="var(--portal-stone-shade, #c2aa85)" /></linearGradient>
      </defs>
      <ellipse className={styles.portalShadow} cx="260" cy="364" rx="222" ry="13" />
      <path className={styles.portalHalo} d="M28 348V108h30V78h30V48h344v30h30v30h30v240z" />
      <path className={styles.portalStone} d="M67 336V118h26V92h26V66h282v26h26v26h26v218z" style={{ fill: `url(#${courtyardId}-stone)` }} />
      <path className={styles.portalEdge} d="M119 66h282v8H126v26h-26v26H75v210h-8V118h26V92h26z" />
      <path className={styles.portalShade} d="M401 74v26h26v26h26v210h-13V135h-26v-27h-26V74zM151 140h23v196h-23zM346 140h23v196h-23z" />
      <path className={styles.goldStroke} d="M81 336V129h27v-27h27V80h250v22h27v27h27v207M121 336V147h27v-25h224v25h27v189" />
      <path className={styles.portalLintel} d="M145 103h230v19H145zM152 128h216v12H152z" />
      <path className={styles.goldStroke} d="M151 108h218m-209 7h200M160 133h200" />
      <g transform="translate(200.2 43) scale(0.23)"><WingedSun /></g>
      <path className={styles.portalColumn} d="M116 155h35v177h-35zM369 155h35v177h-35z" />
      <path className={styles.portalCapital} d="M109 143h49l-7 12h-35zM362 143h49l-7 12h-35zM112 325h43v7h-43zM365 325h43v7h-43z" />
      <path className={styles.goldStroke} opacity="0.5" d="M127 205v61m12-61v61m241-61v61m12-61v61M115 145l9 9m9-9v9m18-9-9 9M368 145l9 9m9-9v9m18-9-9 9" />
      <path className={styles.goldStroke} d="M122 170h23m-23 11h23m-23 18h23m-23 76h23m-23 11h23m-23 18h23M375 170h23m-23 11h23m-23 18h23m-23 76h23m-23 11h23m-23 18h23" />
      <path className={styles.goldStroke} d="M133 216l7 8-7 8-7-8zM386 216l7 8-7 8-7-8zM133 244v12m-6-6h12M386 244v12m-6-6h12" />
      <g clipPath={`url(#${courtyardId})`}>
        <path className={styles.portalSky} d="M174 122h172v214H174z" />
        <rect className={styles.portalLight} fill={`url(#${courtyardId}-glow)`} height="214" style={{ opacity: openness }} width="172" x="174" y="122" />
        <g className={styles.courtyardFar}>
          <g className={styles.courtyardSun} style={{ transform: `translateY(${((1 - openness) * 24).toFixed(3)}px)` }}>
            <circle className={styles.goldFill} cx="260" cy="179" r="24" />
            {Array.from({ length: 12 }, (_, i) => <path className={styles.goldStroke} d="M260 144v-8" key={i} transform={`rotate(${i * 30} 260 179)`} />)}
          </g>
          <path className={styles.courtyardDistant} d="M160 267l69-58 68 58 29-30 40 41v58H160z" />
          <path className={styles.courtyardPyramidShade} d="M229 209l17 58h51zM326 237l8 41h32z" />
        </g>
        <g className={styles.courtyardFront}><path className={styles.courtyardNear} d="M162 287l43-53 45 53 27-25 39 26 42-12v60H162z" /><path className={styles.courtyardPyramidShade} d="M205 234l12 53h33z" /></g>
        <path className={styles.courtyardFloor} d="M174 279h172v57H174z" />
        <path className={styles.goldStroke} opacity="0.5" d="M174 294h172M174 313h172M208 279l-29 57m65-57-10 57m45-57 10 57m30-57 23 57" />
        <g className={styles.courtyardFront}><path className={styles.courtyardTree} d="M317 283q-6-25 0-55m0 8q-18-25-32-12m32 12q22-27 35-14m-35 14q-24-11-34 6m34-6q24-11 36 5m-36-5q-4-22 5-28" /></g>
        <g className={styles.portalLight} style={{ opacity: openness }}>
          <path className={styles.paperFill} d="M260 201l-27 135h54z" opacity="0.06" />
          <path className={styles.goldFill} d="M189 164l2 5 5 2-5 2-2 5-2-5-5-2 5-2zM326 191l2 4 4 2-4 2-2 4-2-4-4-2 4-2z" />
          <g className={styles.courtyardMotes}><circle className={styles.goldFill} cx="214" cy="174" r="1.5" /><circle className={styles.goldFill} cx="299" cy="151" r="1" /><circle className={styles.paperFill} cx="285" cy="192" r="1.2" /></g>
        </g>
      </g>
      {leaves ? <><g transform="translate(174 122)"><DoorPanel /></g><g transform="translate(260 122)"><DoorPanel right /></g></> : null}
      <path className={styles.portalThreshold} d="M99 336h322v9H99zM77 345h366v8H77zM53 353h414v8H53z" />
      <path className={styles.goldStroke} d="M23 362h474" />
      <path className={styles.portalSpill} style={{ opacity: openness }} d="M190 336h140l67 26H123z" />
      <path className={styles.portalLight} fill={`url(#${courtyardId}-glow)`} style={{ opacity: openness }} d="M174 336h172l76 47H98z" />
    </>
  )
}

const CompassDial = memo(function CompassDial() {
  const faceId = `compass-face-${useId().replaceAll(':', '')}`
  return <>
    <defs><radialGradient id={faceId} cx="35%" cy="25%" r="80%"><stop offset="0" stopColor="#294c62" /><stop offset="1" stopColor="#102b43" /></radialGradient></defs>
      <circle className={styles.compassOuter} cx="260" cy="205" r="183" />
      <circle className={styles.compassRim} cx="260" cy="205" r="175" style={{ fill: `url(#${faceId})` }} />
      <circle className={styles.goldStroke} cx="260" cy="205" r="158" opacity="0.5" />
      {Array.from({ length: 72 }, (_, i) => <path className={i % 9 ? styles.compassTick : styles.goldStroke} d={`M260 34v${i % 9 ? 7 : 17}`} key={i} transform={`rotate(${i * 5} 260 205)`} />)}
      {Array.from({ length: 8 }, (_, i) => <g key={i} transform={`rotate(${i * 45} 260 205)`}>
        <path className={styles.compassRose} d="M260 77l18 128-18-14-18 14z" />
        <path className={styles.goldStroke} opacity="0.2" d="M260 77v114" />
      </g>)}
      <circle className={styles.compassInner} cx="260" cy="205" r="104" />
      <circle className={styles.faintStroke} cx="260" cy="205" r="97" />
      <g className={styles.compassCardinals}>
        <text x="260" y="79" textAnchor="middle">N</text>
        <text x="393" y="213" textAnchor="middle">E</text>
        <text x="260" y="350" textAnchor="middle">S</text>
        <text x="126" y="213" textAnchor="middle">W</text>
      </g>
      <path className={styles.compassNorthMark} d="M260 9l5 7-5 7-5-7z" />
  </>
})

export function CompassScene({ angle = 135, aligned = Math.round(bearing(angle)) % 360 === 0 }: { angle?: number; aligned?: boolean }) {
  const faceId = `compass-face-${useId().replaceAll(':', '')}`

  return (
    <>
      <defs><radialGradient id={`${faceId}-sun`}><stop stopColor="#edba62" stopOpacity="0.2" /><stop offset="1" stopColor="#edba62" stopOpacity="0" /></radialGradient></defs>
      <g className={styles.compassDial} data-aligned={aligned}><CompassDial /></g>
      <g className={styles.compassGlint} transform={`rotate(${angle} 260 205)`}><path d="M136 81a175 175 0 0 1 248 0" /></g>
      <g className={styles.compassOrbit} transform={`rotate(${-angle * 0.14} 260 205)`}>{Array.from({ length: 8 }, (_, i) => <path className={styles.goldFill} d="M260 48l3 4-3 4-3-4z" key={i} transform={`rotate(${i * 45} 260 205)`} />)}</g>
      <text className={styles.compassWatermark} data-aligned={aligned} x="260" y="236" textAnchor="middle">404</text>
      <g className={styles.compassNeedle} transform={`rotate(${angle} 260 205)`}>
        <g className={styles.compassPointer} data-aligned={aligned}>
        <path className={styles.compassNeedleShadow} d="M264 85l17 124-17-14-17 14zM264 333l17-124-17 14-17-14z" />
        <path className={styles.goldFill} d="M260 81l17 124-17-14-17 14z" />
        <path className={styles.compassNeedleHighlight} d="M260 81v110l-17 14z" />
        <path className={styles.compassSouth} d="M260 329l17-124-17 14-17-14z" />
        <path className={styles.compassSouthHighlight} d="M260 329V219l-17-14z" />
        </g>
      </g>
      <path className={styles.compassHub} data-aligned={aligned} d="M260 194l11 11-11 11-11-11z" />
      <g className={styles.compassSunSeal} data-aligned={aligned}>
        <path d="M155 100h210v210H155z" fill={`url(#${faceId}-sun)`} />
        <path className={styles.sunPath} d="M260 91v52" />
        <WingedSun />
      </g>
    </>
  )
}

interface Drag {
  pointerId: number
  startX: number
  startY: number
  startValue: number
  side: number
  previousAngle: number
  moved: boolean
  lastTime: number
  velocity: number
}

export function Spatial404Artwork({ index }: { index: number }) {
  const doorway = index === 0
  const [value, setValue] = useState(doorway ? 0 : 135)
  const [dragging, setDragging] = useState(false)
  const [instant, setInstant] = useState(false)
  const [spinning, setSpinning] = useState(false)
  const [following, setFollowing] = useState(false)
  const sounds = useStateSound()
  const canvas = useRef<HTMLDivElement>(null)
  const drag = useRef<Drag | null>(null)
  const currentValue = useRef(value)
  const spin = useRef<number | null>(null)
  const lastTick = useRef(0)
  const previous = useRef({ open: false, north: false })
  const hintId = useId()
  const direction = Math.round(bearing(value)) % 360
  const open = value > 0.65
  const north = direction === 0 && !dragging && !spinning

  useEffect(() => () => {
    if (spin.current !== null) cancelAnimationFrame(spin.current)
  }, [])

  useEffect(() => {
    if (doorway && previous.current.open !== open) playSound(open ? 'open' : 'close')
    if (!doorway && north && !previous.current.north) playSound('north')
    previous.current = { open, north }
  }, [open, north, doorway])

  useEffect(() => {
    if (doorway) return
    const node = canvas.current
    const preview = node?.closest('[data-404]')
    if (!node || !preview) return
    function follow(event: Event) {
      const pointer = event as globalThis.PointerEvent
      if (pointer.pointerType !== 'mouse' || drag.current || spin.current !== null || node!.contains(pointer.target as Node)) return
      const p = compassPoint(pointer.clientX, pointer.clientY, node!)
      guideCompass(p.x, p.y)
    }
    preview.addEventListener('pointermove', follow)
    return () => preview.removeEventListener('pointermove', follow)
  }, [doorway])

  function playSound(kind: 'tick' | 'north' | 'open' | 'close') {
    const notes = kind === 'north' ? [523.25, 659.25, 783.99] : kind === 'open' ? [130.81, 196] : kind === 'close' ? [196, 130.81] : [880]
    sounds.play(notes, kind === 'tick' ? 0.045 : kind === 'north' ? 0.38 : 0.22, kind === 'open' || kind === 'close' ? 'triangle' : 'sine')
  }

  function update(next: number) {
    if (!doorway && Math.floor(bearing(next) / 15) !== Math.floor(bearing(currentValue.current) / 15) && !isNorth(next) && performance.now() - lastTick.current > 75) {
      playSound('tick')
      lastTick.current = performance.now()
    }
    currentValue.current = next
    setValue(next)
  }

  function stopSpin() {
    if (spin.current !== null) cancelAnimationFrame(spin.current)
    spin.current = null
    setSpinning(false)
  }

  function snapCompass() {
    update(isNorth(currentValue.current) ? Math.round(currentValue.current / 360) * 360 : Math.round(currentValue.current / 5) * 5)
  }

  function coast(velocity: number) {
    if (Math.abs(velocity) < 60 || window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      snapCompass()
      return
    }
    let speed = Math.max(-800, Math.min(800, velocity))
    let previous = performance.now()
    const started = previous
    setSpinning(true)
    function tick(now: number) {
      const elapsed = Math.min((now - previous) / 1000, 0.032)
      previous = now
      update(currentValue.current + speed * elapsed)
      speed *= Math.exp(-4.5 * elapsed)
      if (Math.abs(speed) < 15 || now - started > 1600 || window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
        spin.current = null
        setSpinning(false)
        snapCompass()
      } else spin.current = requestAnimationFrame(tick)
    }
    spin.current = requestAnimationFrame(tick)
  }

  function compassPoint(clientX: number, clientY: number, node: HTMLDivElement) {
    const box = node.getBoundingClientRect()
    return { x: (clientX - box.left) / box.width * 520, y: (clientY - box.top) / box.height * 400 }
  }

  function point(event: PointerEvent<HTMLDivElement>) {
    if (!doorway) return compassPoint(event.clientX, event.clientY, event.currentTarget)
    const svg = event.currentTarget.querySelector('svg')
    const matrix = svg?.getScreenCTM()
    if (!matrix) return { x: 260, y: 205 }
    return new DOMPoint(event.clientX, event.clientY).matrixTransform(matrix.inverse())
  }

  function angleAt(x: number, y: number) { return Math.atan2(x - 260, 205 - y) * 180 / Math.PI }

  function guideCompass(x: number, y: number) {
    setInstant(true)
    if (Math.hypot(x - 260, y - 205) <= 38) return
    const next = currentValue.current + (angleAt(x, y) - bearing(currentValue.current) + 540) % 360 - 180
    update(isNorth(next) ? Math.round(next / 360) * 360 : next)
  }

  function start(event: PointerEvent<HTMLDivElement>) {
    if (!event.isPrimary || event.button !== 0) return
    stopSpin()
    event.currentTarget.focus({ preventScroll: true })
    event.currentTarget.setPointerCapture(event.pointerId)
    const p = point(event)
    setInstant(false)
    setFollowing(false)
    setDragging(true)
    drag.current = { pointerId: event.pointerId, startX: p.x, startY: p.y, startValue: currentValue.current, side: p.x < 260 ? -1 : 1, previousAngle: angleAt(p.x, p.y), moved: false, lastTime: event.timeStamp, velocity: 0 }
  }

  function move(event: PointerEvent<HTMLDivElement>) {
    const gesture = drag.current
    const p = point(event)
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (!reduced) {
      event.currentTarget.style.setProperty('--look-x', String(Math.max(-1, Math.min(1, (p.x - 260) / 170))))
      event.currentTarget.style.setProperty('--look-y', String(Math.max(-1, Math.min(1, (p.y - 205) / 150))))
    }
    if (!gesture) {
      if (!doorway && event.pointerType === 'mouse' && spin.current === null) {
        setFollowing(true)
        guideCompass(p.x, p.y)
      }
      return
    }
    if (gesture.pointerId !== event.pointerId) return
    if (Math.hypot(p.x - gesture.startX, p.y - gesture.startY) > 4) gesture.moved = true
    if (doorway) {
      update(Math.max(0, Math.min(1, gesture.startValue + (p.x - gesture.startX) * gesture.side / 80)))
    } else if (Math.hypot(p.x - 260, p.y - 205) > 20) {
      const angle = angleAt(p.x, p.y)
      const delta = (angle - gesture.previousAngle + 540) % 360 - 180
      gesture.velocity = gesture.velocity * 0.45 + delta / Math.max(1, event.timeStamp - gesture.lastTime) * 1000 * 0.55
      gesture.lastTime = event.timeStamp
      gesture.previousAngle = angle
      update(currentValue.current + delta)
    }
  }

  function finish(event: PointerEvent<HTMLDivElement>) {
    const gesture = drag.current
    if (!gesture || gesture.pointerId !== event.pointerId) return
    drag.current = null
    setDragging(false)
    if (doorway) {
      const next = !gesture.moved ? (gesture.startValue > 0.5 ? 0 : 1) : currentValue.current >= 0.5 ? 1 : 0
      update(next)
    } else {
      coast(event.timeStamp - gesture.lastTime > 80 ? 0 : gesture.velocity)
    }
    if (event.currentTarget.hasPointerCapture(event.pointerId)) event.currentTarget.releasePointerCapture(event.pointerId)
  }

  function keyboard(event: KeyboardEvent<HTMLDivElement>) {
    const keys: Record<string, number> = doorway
      ? { Enter: open ? 0 : 1, ' ': open ? 0 : 1, ArrowRight: 1, ArrowLeft: 0, Escape: 0 }
      : { ArrowRight: value + 5, ArrowUp: value + 5, ArrowLeft: value - 5, ArrowDown: value - 5, Home: 0, End: 355, PageUp: value + 45, PageDown: value - 45 }
    const next = keys[event.key]
    if (next === undefined) return
    event.preventDefault()
    stopSpin()
    if (doorway && event.key === 'Escape') event.stopPropagation()
    setInstant(!doorway)
    update(next)
  }

  return (
    <div className={styles.interactiveArt} data-spatial={doorway ? 'doorway' : 'compass'}>
      <div
        aria-describedby={hintId}
        aria-label={doorway ? 'Explore the hidden doorway' : 'Rotate solar compass'}
        aria-valuemax={doorway ? undefined : 359}
        aria-valuemin={doorway ? undefined : 0}
        aria-valuenow={doorway ? undefined : direction}
        aria-valuetext={doorway ? undefined : `${direction} degrees. ${north ? 'North. Home is that way.' : 'Turn towards north.'}`}
        className={`${styles.artCanvas} ${styles.spatialCanvas}`}
        data-dragging={dragging || undefined}
        data-following={following || undefined}
        data-instant={instant || undefined}
        data-open={doorway ? open : undefined}
        data-north={!doorway ? north : undefined}
        data-spinning={spinning || undefined}
        onKeyDown={keyboard}
        onPointerCancel={event => { drag.current = null; setDragging(false); if (event.currentTarget.hasPointerCapture(event.pointerId)) event.currentTarget.releasePointerCapture(event.pointerId) }}
        onPointerDown={start}
        onPointerLeave={event => { setFollowing(false); event.currentTarget.style.setProperty('--look-x', '0'); event.currentTarget.style.setProperty('--look-y', '0') }}
        onPointerMove={move}
        onPointerUp={finish}
        role={doorway ? 'group' : 'slider'}
        ref={canvas}
        tabIndex={0}
      >
        {doorway ? <div className={styles.doorVisual}>
          <svg aria-hidden="true" className={styles.scene} focusable="false" viewBox="0 0 520 400"><DoorwayScene leaves={false} openness={value} /></svg>
          <div aria-hidden="true" className={styles.doorLeaf} data-side="left" style={{ transform: `rotateY(${-103 * value}deg)` }}><svg className={styles.scene} viewBox="0 0 86 214"><DoorPanel /></svg><svg className={`${styles.scene} ${styles.doorBack}`} viewBox="0 0 86 214"><DoorPanel back /></svg></div>
          <div aria-hidden="true" className={styles.doorLeaf} data-side="right" style={{ transform: `rotateY(${108 * value}deg)` }}><svg className={styles.scene} viewBox="0 0 86 214"><DoorPanel right /></svg><svg className={`${styles.scene} ${styles.doorBack}`} viewBox="0 0 86 214"><DoorPanel back right /></svg></div>
        </div> : <div className={styles.compassVisual}><svg aria-hidden="true" className={styles.scene} focusable="false" viewBox="0 0 520 400"><CompassScene aligned={north} angle={value} /></svg></div>}
      </div>
      <SoundToggle enabled={sounds.enabled} onClick={sounds.toggle} />
      <p className={styles.srOnly} id={hintId}>{doorway ? 'Tap to open or close. Pull the doors apart. Enter opens; Escape closes.' : 'Move your cursor to guide the needle. Drag or flick to spin. Grab to stop. Arrow keys rotate. Home finds north.'}</p>
      <p aria-live="polite" className={styles.srOnly}>{doorway ? open ? 'A quiet courtyard. A little light on the other side.' : 'A good place to get a little lost.' : spinning ? 'Finding a direction.' : north ? 'North. Home is that way.' : 'The way back is written in the sun.'}</p>
    </div>
  )
}
