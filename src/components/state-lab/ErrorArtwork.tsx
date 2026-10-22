import { useEffect, useId, useRef, useState } from 'react'
import type { CSSProperties, KeyboardEvent, PointerEvent } from 'react'

import { SoundToggle, useStateSound } from './StateSound'
import labStyles from './StateExplorationLab.module.css'
import styles from './ErrorArtwork.module.css'

function gear(radius: number, teeth: number) {
  return Array.from({ length: teeth * 4 }, (_, i) => {
    const angle = i * Math.PI * 2 / (teeth * 4)
    const r = i % 4 === 0 || i % 4 === 3 ? radius - 7 : radius
    return `${i ? 'L' : 'M'}${(Math.cos(angle) * r).toFixed(2)} ${(Math.sin(angle) * r).toFixed(2)}`
  }).join('') + 'Z'
}

function Sun({ awake = false, stunned = false }: { awake?: boolean; stunned?: boolean }) {
  const id = `sun-${useId().replaceAll(':', '')}`
  return <g className={styles.sun} data-awake={awake} data-stunned={stunned || undefined}>
    <defs><radialGradient id={id} cx="30%" cy="22%" r="82%"><stop stopColor="#fff0b5" /><stop offset="0.4" stopColor="#edbe63" /><stop offset="0.76" stopColor="#c38c35" /><stop offset="1" stopColor="#805126" /></radialGradient></defs>
    <g className={styles.rays}>{Array.from({ length: 12 }, (_, i) => <path d="M0-35v-10" key={i} transform={`rotate(${i * 30})`} />)}</g>
    <circle className={styles.sunDepth} cy="3" r="28" />
    <circle className={styles.sunFace} r="27" style={{ fill: `url(#${id})` }} />
    <circle className={styles.sunBevel} r="24.5" />
    <path className={styles.sunHighlight} d="M-21-8a23 23 0 0 1 29-13M-21-3l-1 5" />
    <path className={styles.sunPatina} d="m9-17 2-1m-25 24 2 1m21 10 2-1m8-9 1-2" />
    <path className={styles.sunFeatures} d={stunned ? 'm-12-4 6 4-6 4m24-8-6 4 6 4M-3 12a3 4 0 1 0 6 0a3 4 0 1 0-6 0' : awake ? 'M-11-3h2m18 0h2M-7 9q7 6 14 0' : 'M-12 0q4 4 8 0m8 0q4 4 8 0M-3 11h6'} />
  </g>
}

const BLOCKS = [
  { points: [[168, 257], [187, 257], [187, 245], [203, 245], [203, 257], [218, 257], [218, 335], [168, 335]], x: -80, y: -5, angle: 90, cx: 193, cy: 290, clay: false, etching: 'M180 278h26m-26 9h26m-13 13v20' },
  { points: [[168, 257], [168, 148], [200, 148], [200, 117], [251, 117], [251, 131], [239, 131], [239, 151], [251, 151], [251, 165], [218, 165], [218, 257], [203, 257], [203, 245], [187, 245], [187, 257]], x: -105, y: -42, angle: 180, cx: 209, cy: 187, clay: true, etching: 'M182 184h23m-23 9h23m-12 12v24m25-94h11' },
  { points: [[251, 117], [349, 117], [349, 131], [337, 131], [337, 151], [349, 151], [349, 165], [251, 165], [251, 151], [239, 151], [239, 131], [251, 131]], x: -35, y: -65, angle: 90, cx: 300, cy: 141, clay: false, etching: 'M269 132h54m-43 9h40' },
  { points: [[349, 117], [400, 117], [400, 148], [432, 148], [432, 185], [418, 185], [418, 196], [400, 196], [400, 185], [386, 185], [386, 196], [368, 196], [368, 165], [349, 165], [349, 151], [337, 151], [337, 131], [349, 131]], x: 65, y: -65, angle: 180, cx: 390, cy: 156, clay: true, etching: 'M365 135h21m12 28h18m-36 10h22' },
  { points: [[368, 196], [386, 196], [386, 185], [400, 185], [400, 196], [418, 196], [418, 260], [403, 260], [403, 272], [383, 272], [383, 260], [368, 260]], x: 101, y: -4, angle: 90, cx: 393, cy: 228, clay: true, etching: 'M380 215h26m-26 9h26m-13 13v15' },
  { points: [[368, 260], [383, 260], [383, 272], [403, 272], [403, 260], [418, 260], [418, 335], [368, 335]], x: 87, y: 12, angle: 180, cx: 393, cy: 298, clay: true, etching: 'M381 289h24m-24 9h24m-12 11v12' },
].map(piece => {
  let area = 0
  let moment = 0
  piece.points.forEach(([x, y], i) => {
    const [nextX, nextY] = piece.points[(i + 1) % piece.points.length]
    const cross = x * nextY - nextX * y
    area += cross
    moment += (x + nextX) * cross
  })
  return { ...piece, area: area / 2, centerOfMass: moment / (3 * area), path: `M${piece.points.map(point => point.join(' ')).join('L')}Z` }
})

const ARCH_EDGES = BLOCKS.flatMap((piece, block) => piece.points.map(([ax, ay], i) => {
  const [bx, by] = piece.points[(i + 1) % piece.points.length]
  const neighbor = BLOCKS.findIndex((other, index) => index !== block && other.points.some(([cx, cy], j, points) => {
    const [dx, dy] = points[(j + 1) % points.length]
    return ax === dx && ay === dy && bx === cx && by === cy
  }))
  return { ax, ay, bx, by, block, neighbor, path: `M${ax} ${ay}L${bx} ${by}` }
}))

function ArchAssembly({ placed, seating }: { placed: number[]; seating?: { block: number; x: number; y: number } | null }) {
  const id = `assembly-${useId().replaceAll(':', '')}`
  const remaining = new Set(placed)
  const components: number[][] = []
  while (remaining.size) {
    const queue = [remaining.values().next().value!]
    const component: number[] = []
    while (queue.length) {
      const block = queue.pop()!
      if (!remaining.delete(block)) continue
      component.push(block)
      ARCH_EDGES.filter(edge => edge.block === block && remaining.has(edge.neighbor)).forEach(edge => queue.push(edge.neighbor))
    }
    components.push(component.sort((a, b) => a - b))
  }
  const seatingStyle = seating ? { '--seat-x': `${seating.x}px`, '--seat-y': `${seating.y}px` } as CSSProperties : undefined
  return <g aria-hidden="true">
    <defs>
      {[['sand', '#ebd2a3', '#c7a46a', '#977549'], ['clay', '#d58b6d', '#ae5f48', '#824333']].map(([tone, light, middle, dark]) => <linearGradient id={`${id}-${tone}`} gradientUnits="userSpaceOnUse" x1="160" y1="117" x2="440" y2="335" key={tone}><stop stopColor={light} /><stop offset="0.5" stopColor={middle} /><stop offset="1" stopColor={dark} /></linearGradient>)}
      <pattern id={`${id}-grain`} width="37" height="43" patternUnits="userSpaceOnUse"><path d="m3 7 7-1m12 10 9 1m-19 9 5-1m9 12 7-2M5 39l3-1" stroke="#fff1cf" strokeWidth="0.6" opacity="0.2" /><path d="m4 9 4-1m14 12 5-1M10 31l2-1" stroke="#45392b" strokeWidth="0.65" opacity="0.2" /></pattern>
    </defs>
    {components.map(component => {
      const edges = ARCH_EDGES.filter(edge => component.includes(edge.block))
      const exposed = edges.filter(edge => !component.includes(edge.neighbor))
      const seams = edges.filter(edge => component.includes(edge.neighbor) && edge.block < edge.neighbor)
      const center = component.reduce((sum, block) => sum + BLOCKS[block].area * BLOCKS[block].centerOfMass, 0) / component.reduce((sum, block) => sum + BLOCKS[block].area, 0)
      const leftFoot = component.includes(0)
      const rightFoot = component.includes(5)
      const overhang = leftFoot && !rightFoot ? Math.max(0, center - 218) : rightFoot && !leftFoot ? Math.min(0, center - 368) : 0
      const lean = Math.max(-1.25, Math.min(1.25, overhang / 65))
      const pivot = leftFoot ? 218 : 368
      const clip = `${id}-${component[0]}`
      return <g className={styles.archAssembly} data-arch-assembly data-grounded={leftFoot || rightFoot} data-lean={lean} key={leftFoot ? 0 : rightFoot ? 5 : component[0]} style={{ transform: `rotate(${lean}deg)`, transformOrigin: `${pivot}px 335px` }}>
        <defs><clipPath id={clip}><path d={component.map(block => BLOCKS[block].path).join('')} /></clipPath></defs>
        {component.map(block => <g className={seating?.block === block ? styles.stoneSeat : undefined} data-stone-depth={block} key={block} style={seating?.block === block ? seatingStyle : undefined}>
          {exposed.filter(edge => edge.block === block && edge.by - edge.ay + edge.bx - edge.ax > 0).map((edge, i) => <path className={styles.blockDepth} d={`${edge.path}l12-12L${edge.ax + 12} ${edge.ay - 12}Z`} fill={edge.ay === edge.by ? BLOCKS[block].clay ? '#d99a78' : '#ecd0a0' : BLOCKS[block].clay ? '#76442f' : '#81613a'} key={i} />)}
        </g>)}
        {component.map(block => <g className={seating?.block === block ? styles.stoneSeat : undefined} data-stone-face={block} key={block} style={seating?.block === block ? seatingStyle : undefined}>
          <path d={BLOCKS[block].path} fill={`url(#${id}-${BLOCKS[block].clay ? 'clay' : 'sand'})`} />
          <path d={BLOCKS[block].path} fill={`url(#${id}-grain)`} />
          <path className={styles.blockEtching} d={BLOCKS[block].etching} />
          <g clipPath={`url(#${clip})`}>
            <path className={styles.assemblyBevelShade} d={exposed.filter(edge => edge.block === block).map(edge => edge.path).join('')} transform="translate(-1.2 -1.5)" />
            <path className={styles.assemblyBevelLight} d={exposed.filter(edge => edge.block === block).map(edge => edge.path).join('')} transform="translate(1.2 1.5)" />
          </g>
        </g>)}
        {[false, true].map(entering => {
          const joints = seams.filter(edge => (edge.block === seating?.block || edge.neighbor === seating?.block) === entering).map(edge => edge.path).join('')
          if (!joints) return null
          return <g className={entering ? styles.seamSeat : undefined} key={entering ? `incoming-${seating?.block}` : 'settled'}>
            <path className={styles.stoneSeam} d={joints} />
            <path className={styles.stoneSeamLight} d={joints} transform="translate(0.45 0.6)" />
          </g>
        })}
      </g>
    })}
  </g>
}

function ArchBase() {
  return <>
    <ellipse className={styles.shadow} cx="306" cy="369" rx="214" ry="12" />
    <path className={styles.archGuide} d="M168 335V148h32v-31h200v31h32v187" />
    <path className={styles.plinthTop} d="m144 335 12-12h312l-12 12zM126 348l12-12h348l-12 12z" />
    <path className={styles.plinthSide} d="m456 335 12-12v13l-12 12zM474 348l12-12v12l-12 12z" />
    <path className={styles.archSteps} d="M144 335h312v13H144zM126 348h348v12H126z" />
    <path className={styles.plinthHighlight} d="M145 335h310M127 348h346" />
    <path className={styles.plinthSeam} d="M178 351v6m245-6v6M213 339h102" />
  </>
}

export function ErrorScene({ index, turn = 0, placed = [], landed = false }: { index: number; turn?: number; placed?: number[]; landed?: boolean }) {
  const id = `error-metal-${useId().replaceAll(':', '')}`
  if (index === 1) return <>
    <ArchBase />
    <g transform="translate(300 225)" opacity={placed.length === BLOCKS.length ? 1 : 0.14}><Sun awake={placed.length === BLOCKS.length} /></g>
    <ArchAssembly placed={placed} />
    {BLOCKS.map((_, i) => placed.includes(i) ? null : <ArchBlock block={i} key={i} />)}
  </>
  if (index === 2) return <>
    <ellipse className={styles.shadow} cx="300" cy="393" rx="166" ry="10" />
    <path className={styles.fallingGuide} d="M307 74q26-12 46 9m-3-8 3 8-9-1" />
    <Cradle landed={landed} layer="back" />
    <g className={styles.fallingSun} data-landed={landed} transform="translate(300 95)"><Sun awake={landed} /></g>
    <Cradle landed={landed} layer="front" />
  </>
  return <>
    <defs>
      <linearGradient id={id} x1="0" y1="0" x2="1" y2="1"><stop stopColor="#ffe5ae" /><stop offset="0.35" stopColor="#bd873b" /><stop offset="0.6" stopColor="#f4d08b" /><stop offset="1" stopColor="#855927" /></linearGradient>
      <linearGradient id={`${id}-case`} x2="0.3" y2="1"><stop stopColor="#c87b59" /><stop offset="0.45" stopColor="#a6523c" /><stop offset="1" stopColor="#6b3328" /></linearGradient>
      <linearGradient id={`${id}-glass`} x2="0.7" y2="1"><stop stopColor="#243c48" /><stop offset="1" stopColor="#081d2c" /></linearGradient>
      <linearGradient id={`${id}-side`} x2="0" y2="1"><stop stopColor="#853d31" /><stop offset="1" stopColor="#3c2523" /></linearGradient>
      <pattern id={`${id}-grain`} height="8" width="29" patternUnits="userSpaceOnUse"><path d="M0 2h18m5 4h6" stroke="#f2bb82" strokeOpacity="0.08" strokeWidth="0.6" /></pattern>
      <clipPath id={`${id}-recess`}><rect x="127" y="127" width="346" height="172" /></clipPath>
    </defs>
    <ellipse className={styles.shadow} cx="300" cy="356" rx="223" ry="12" />
    <path className={styles.machineFeet} d="M128 321h34v31h-34zM438 321h34v31h-34z" />
    <path className={styles.footGlint} d="M130 347h29m282 0h28" />
    <path className={styles.caseDepth} d="M106 91h388l16 16v216l-16 16H106l-16-16V107z" transform="translate(9 10)" />
    <path className={styles.machineCase} d="M106 91h388l16 16v216l-16 16H106l-16-16V107z" style={{ fill: `url(#${id}-case)` }} />
    <path d="m510 107 9 10v216l-16 16-9-10 16-16zM106 339h388l9 10H115z" fill={`url(#${id}-side)`} />
    <path className={styles.caseHighlight} d="m92 108 15-15h386l15 15M92 110v210" />
    <path d="M106 91h388l16 16v216l-16 16H106l-16-16V107z" fill={`url(#${id}-grain)`} />
    <path className={styles.machineRim} d="M111 101h378l11 11v206l-11 11H111l-11-11V112z" style={{ stroke: `url(#${id})` }} />
    <path className={styles.machineGlass} d="M122 122h356v181H122z" style={{ fill: `url(#${id}-glass)` }} />
    <path className={styles.glassRecess} d="M125 300V125h350" />
    <path className={styles.glassReflection} d="m126 126 117 0-117 117zM139 300l172-174h24L163 300z" />
    <g clipPath={`url(#${id}-recess)`} data-clockwork-recess>
      <path className={styles.belt} d="M273 224 400 198a51 51 0 0 1 0 102l-127-14a31 31 0 0 1 0-62z" />
      <path className={styles.beltStitch} d="M273 224 400 198a51 51 0 0 1 0 102l-127-14a31 31 0 0 1 0-62z" />
      {[[190, 234, 55, 14, -16 / 14], [278, 181, 52, 16, 1], [273, 255, 30, 8, 2]].map(([x, y, r, teeth, ratio], i) => <g key={i} transform={`translate(${x} ${y})`}>
        <g className={styles.gear} data-gear-ratio={ratio} style={{ transform: `rotate(${turn * ratio}deg)` }}>
          <path className={styles.gearDepth} d={gear(r, teeth)} transform="translate(2.5 3)" />
          <path className={i === 1 ? styles.sunGear : styles.gearFace} d={gear(r, teeth)} style={{ fill: `url(#${id})` }} />
          <circle className={styles.gearInset} r={r - 13} />
          <circle className={styles.gearBevel} r={r - 9} />
          <circle className={styles.gearGroove} r={r - 17} />
          {Array.from({ length: 6 }, (_, j) => <path className={styles.gearSpoke} d={`M0 ${-r + 15}v${r - 25}`} key={j} transform={`rotate(${j * 60})`} />)}
        </g>
        {i === 1 ? <Sun awake={turn >= 540} /> : <><circle className={styles.axle} r="10" /><path className={styles.screwSlot} d="M-4 0h8" /></>}
      </g>)}
    </g>
    <path className={styles.glassGlint} d="M126 129h63m-63 4h29M474 258v39h-37" />
    <Wheel turn={turn} />
    <path className={styles.windArrow} d="M371 179q29-15 58 0m-4-6 5 7-9 1" />
    {[0, 1, 2, 3, 4].map(i => <g key={i}><circle className={styles.lampWell} cx={358 + i * 23} cy="146" r="5" /><circle className={styles.chargeLamp} data-charge-lamp={i} cx={358 + i * 23} cy="146" r="3.5" /></g>)}
    {[[109, 111], [491, 111], [109, 319], [491, 319]].map(([x, y], i) => <g key={i} transform={`translate(${x} ${y})`}><circle className={styles.rivet} r="4" /><path className={styles.screwSlot} d="M-2 0h4" /></g>)}
    <path className={styles.vent} d="M134 316h6m4 0h6m4 0h6m4 0h6m4 0h6m240 0h6m4 0h6m4 0h6m4 0h6m4 0h6" />
  </>
}

function Wheel({ turn }: { turn: number }) {
  return <g transform="translate(400 249)">
    <circle className={styles.wheelShadow} cy="5" r="55" />
    <circle className={styles.wheelBase} r="54" />
    <circle className={styles.wheelRim} r="45" />
    <circle className={styles.wheelRimHighlight} cx="-0.5" cy="-1" r="45" />
    <circle className={styles.wheelInnerEdge} r="40" />
    <g className={styles.gear} data-gear-ratio={1} style={{ transform: `rotate(${turn}deg)` }}>
      <path className={styles.wheelSpokes} d="M0-41V41M-35.5-20.5l71 41m-71 0 71-41" />
      <circle className={styles.wheelHub} r="14" />
      <circle className={styles.wheelHubEdge} r="10" />
      <circle className={styles.handleShadow} cx="33" cy="-29" r="12" />
      <circle className={styles.handle} cx="31" cy="-34" r="11" />
      <path className={styles.handleGlint} d="M27-39q4-3 8 0" />
    </g>
  </g>
}

function ArchBlock({ block, x, y, turn, dragging = false }: { block: number; x?: number; y?: number; turn?: number; dragging?: boolean }) {
  const piece = BLOCKS[block]
  const id = `stone-${useId().replaceAll(':', '')}`
  const rotation = turn ?? piece.angle
  const radians = rotation * Math.PI / 180
  const dx = 12 * (Math.cos(radians) - Math.sin(radians))
  const dy = -12 * (Math.sin(radians) + Math.cos(radians))
  return <g className={styles.archBlock} data-dragging={dragging || undefined} style={{ transform: `translate(${x ?? piece.x}px, ${y ?? piece.y}px) rotate(${rotation}deg)`, transformOrigin: `${piece.cx}px ${piece.cy}px` }}>
    <defs>
      <linearGradient id={id} x2="0.75" y2="1"><stop stopColor={piece.clay ? '#d58b6d' : '#ebd2a3'} /><stop offset="0.5" stopColor={piece.clay ? '#ae5f48' : '#c7a46a'} /><stop offset="1" stopColor={piece.clay ? '#824333' : '#977549'} /></linearGradient>
      <linearGradient id={`${id}-side`} x2="0.2" y2="1"><stop stopColor={piece.clay ? '#854835' : '#987542'} /><stop offset="1" stopColor={piece.clay ? '#4e3028' : '#5a482e'} /></linearGradient>
      <pattern id={`${id}-grain`} width="37" height="43" patternUnits="userSpaceOnUse"><path d="m3 7 7-1m12 10 9 1m-19 9 5-1m9 12 7-2M5 39l3-1" stroke="#fff1cf" strokeWidth="0.6" opacity="0.22" /><path d="m4 9 4-1m14 12 5-1M10 31l2-1" stroke="#45392b" strokeWidth="0.65" opacity="0.26" /><circle cx="29" cy="6" r="0.65" fill="#45392b" opacity="0.22" /></pattern>
      <clipPath id={`${id}-face`}><path d={piece.path} /></clipPath>
    </defs>
    <path className={styles.blockShadow} d={piece.path} transform={`translate(${15 * Math.cos(radians) + 20 * Math.sin(radians)} ${20 * Math.cos(radians) - 15 * Math.sin(radians)})`} />
    <circle className={styles.hitArea} cx={piece.cx} cy={piece.cy} r="40" />
    {piece.points.map(([ax, ay], i) => {
      const [bx, by] = piece.points[(i + 1) % piece.points.length]
      if ((by - ay) * dx - (bx - ax) * dy <= 0.001) return null
      return <path className={styles.blockDepth} d={`M${ax} ${ay}L${bx} ${by}l${dx} ${dy}L${ax + dx} ${ay + dy}Z`} key={i} fill={Math.abs((bx - ax) * Math.sin(radians) + (by - ay) * Math.cos(radians)) < 0.001 ? piece.clay ? '#d99a78' : '#ecd0a0' : `url(#${id}-side)`} />
    })}
    <path className={styles.blockFace} d={piece.path} style={{ fill: `url(#${id})` }} />
    <path d={piece.path} fill={`url(#${id}-grain)`} />
    <g clipPath={`url(#${id}-face)`}>
      <path className={styles.blockBevelShade} d={piece.path} transform="translate(-1.2 -1.5)" />
      <path className={styles.blockEdge} d={piece.path} transform="translate(1.2 1.5)" />
    </g>
    <path className={styles.blockEtching} d={piece.etching} />
  </g>
}

function netPoint(u: number, v: number) {
  return { x: 178 + 244 * u, y: 282 + 4 * u * (1 - u) * (44 + 22 * v) }
}

const NET_STRANDS = [-0.16, 0.16].flatMap(slope => Array.from({ length: 17 }, (_, i) => {
  const offset = (i - 2) / 12
  const from = Math.max(0, slope > 0 ? -offset / slope : (1 - offset) / slope)
  const to = Math.min(1, slope > 0 ? (1 - offset) / slope : -offset / slope)
  if (to <= from) return ''
  return Array.from({ length: 17 }, (_, j) => {
    const v = from + (to - from) * j / 16
    const p = netPoint(offset + slope * v, v)
    return `${j ? 'L' : 'M'}${p.x.toFixed(2)} ${p.y.toFixed(2)}`
  }).join('')
})).filter(Boolean)

const NET_KNOTS = Array.from({ length: 17 }, (_, i) => Array.from({ length: 17 }, (_, j) => {
  const a = (i - 2) / 12
  const b = (j - 2) / 12
  const u = (a + b) / 2
  const v = (b - a) / 0.32
  return u > 0 && u < 1 && v > 0 && v < 1 ? netPoint(u, v) : null
})).flat().filter(point => point !== null)

function ropeBraid(v: number) {
  return Array.from({ length: 60 }, (_, i) => {
    const u = (i + 0.5) / 60
    const p = netPoint(u, v)
    const dy = 4 * (1 - 2 * u) * (44 + 22 * v)
    const length = Math.hypot(244, dy)
    const nx = -dy / length * 2.4
    const ny = 244 / length * 2.4
    return `M${(p.x - nx - 1).toFixed(2)} ${(p.y - ny).toFixed(2)}q${(nx + 2).toFixed(2)} ${(ny - 1).toFixed(2)} ${(nx * 2 + 2).toFixed(2)} ${(ny * 2).toFixed(2)}`
  }).join('')
}

const NET_BRAIDS = [ropeBraid(0), ropeBraid(1)]

function Cradle({ landed = false, layer }: { landed?: boolean; layer: 'back' | 'front' }) {
  const id = `cradle-${useId().replaceAll(':', '')}`
  return <g className={styles.cradle} data-landed={landed}>
    {layer === 'back' ? <>
      <defs><linearGradient id={id}><stop stopColor="#263e49" /><stop offset="0.35" stopColor="#87958b" /><stop offset="0.55" stopColor="#294552" /><stop offset="1" stopColor="#102b43" /></linearGradient></defs>
      <ellipse className={styles.netShadow} cx="303" cy="384" rx="137" ry="7" />
      <path className={styles.cradleLegShadow} d="M178 282v95m244-95v95" transform="translate(4 3)" />
      <path className={styles.cradleLegs} d="M178 282v95m244-95v95M164 378h28m216 0h28" />
      <path className={styles.cradlePost} d="M174 285h8v87h-8zM418 285h8v87h-8z" fill={`url(#${id})`} />
      <path className={styles.cradleBraces} d="m178 350 17 26m227-26-17 26" />
      <path className={styles.cradleLegGlint} d="M176 292v75m244-75v75" />
      {[178, 422].map(x => <path className={styles.postCollar} d={`M${x - 6} 288h12v9h-12zM${x - 6} 358h12v8h-12z`} key={x} />)}
      <g className={styles.netResponse} data-net-response>
        <path className={styles.netSling} d="M178 282Q300 370 422 282Q300 414 178 282Z" />
        <path className={styles.netUnderRope} d="M178 282Q300 370 422 282" />
        <path className={styles.backRope} d="M178 282Q300 370 422 282" />
        <path className={styles.ropeBraid} d={NET_BRAIDS[0]} />
      </g>
    </> : <>
      <g className={styles.netResponse} data-net-response>
        <g className={styles.meshShade} transform="translate(0 1.2)">{NET_STRANDS.map((d, i) => <path d={d} key={i} />)}</g>
        <g className={styles.cradleNet}>{NET_STRANDS.map((d, i) => <path d={d} key={i} />)}</g>
        {NET_KNOTS.map((p, i) => <ellipse className={styles.netKnot} cx={p.x} cy={p.y} key={i} rx="1.8" ry="1" transform={`rotate(-30 ${p.x} ${p.y})`} />)}
        <path className={styles.netUnderRope} d="M178 282Q300 414 422 282" />
        <path className={styles.cradleRope} d="M178 282Q300 414 422 282" />
        <path className={styles.ropeHighlight} d="M178 281Q300 413 422 281" />
        <path className={styles.ropeBraid} d={NET_BRAIDS[1]} />
      </g>
      {[178, 422].map(x => <g key={x}>
        <circle className={styles.anchorDepth} cx={x + 1} cy="284" r="7" />
        <circle className={styles.rivet} cx={x} cy="282" r="6" />
        <path className={styles.anchorSlot} d={`m${x - 2} 280 4 4`} />
        <path className={styles.ropeBinding} d={`M${x - 4} 287q4 3 8 0m-8 3q4 3 8 0m-8 3q4 3 8 0`} />
      </g>)}
    </>}
  </g>
}

const LAUNCHES = [
  { x: 205, vx: 185, vy: -115, gravity: 550 },
  { x: 395, vx: -195, vy: -145, gravity: 590 },
  { x: 365, vx: 300, vy: -125, gravity: 560 },
  { x: 235, vx: -310, vy: -150, gravity: 600 },
]

export function ErrorArtwork({ index, onSolved, resetKey }: { index: number; onSolved: () => void; resetKey: number }) {
  const [placed, setPlaced] = useState<number[]>([])
  const [positions, setPositions] = useState(BLOCKS.map(({ x, y }) => ({ x, y })))
  const [turns, setTurns] = useState(BLOCKS.map(block => block.angle))
  const [seating, setSeating] = useState<{ block: number; x: number; y: number } | null>(null)
  const [offset, setOffset] = useState<{ block: number; x: number; y: number } | null>(null)
  const [solved, setSolved] = useState(false)
  const [instant, setInstant] = useState(false)
  const [dragging, setDragging] = useState(false)
  const [needsTurn, setNeedsTurn] = useState(false)
  const [phase, setPhase] = useState<'ready' | 'falling' | 'caught' | 'bouncing' | 'missed'>('ready')
  const [launch, setLaunch] = useState(LAUNCHES[0])
  const launchCount = useRef(0)
  const scene = useRef<SVGSVGElement>(null)
  const wheel = useRef<SVGGElement>(null)
  const ball = useRef<SVGGElement>(null)
  const net = useRef<SVGGElement>(null)
  const netBack = useRef<SVGGElement>(null)
  const frame = useRef<number | null>(null)
  const angle = useRef(0)
  const done = useRef(false)
  const pieces = useRef<number[]>([])
  const netX = useRef(300)
  const netTarget = useRef(300)
  const lastTick = useRef(0)
  const windDrag = useRef<{ angle: number; time: number; velocity: number } | null>(null)
  const pieceDrag = useRef<{ startX: number; startY: number; x: number; y: number; moved: boolean } | null>(null)
  const sounds = useStateSound()
  const hintId = useId()

  function stop() {
    if (frame.current !== null) cancelAnimationFrame(frame.current)
    frame.current = null
  }

  function complete() {
    if (done.current) return
    done.current = true
    setSolved(true)
    sounds.play([523.25, 659.25, 783.99], 0.32, 'triangle')
  }

  function paintWind(next: number) {
    const value = Math.max(0, Math.min(540, next))
    if (Math.floor(angle.current / 24) !== Math.floor(value / 24) && performance.now() - lastTick.current > 35) {
      sounds.play([180, 360], 0.025, 'triangle')
      lastTick.current = performance.now()
    }
    angle.current = value
    scene.current?.querySelectorAll<SVGGElement>('[data-gear-ratio]').forEach(node => {
      node.style.transform = `rotate(${value * Number(node.dataset.gearRatio)}deg)`
    })
    scene.current?.querySelectorAll<SVGCircleElement>('[data-charge-lamp]').forEach((node, i) => {
      node.style.opacity = String(Math.max(0, Math.min(1, value / 108 - i)))
    })
    wheel.current?.setAttribute('aria-valuenow', String(Math.round(value)))
    wheel.current?.setAttribute('aria-valuetext', `${Math.round(value / 5.4)} percent wound`)
    if (value >= 540) complete()
  }

  function paintNet(value: number) {
    netX.current = Math.max(175, Math.min(425, value))
    for (const ref of [net, netBack]) {
      if (ref.current) ref.current.style.transform = `translateX(${netX.current - 300}px)`
    }
    net.current?.setAttribute('aria-valuenow', String(Math.round(netX.current)))
  }

  function paintCatch(depth: number) {
    for (const ref of [net, netBack]) {
      const mesh = ref.current?.querySelector<SVGGElement>('[data-net-response]')
      if (mesh) mesh.style.transform = `scaleY(${1 + Math.max(0, depth) / 44})`
    }
  }

  function nextLaunch() {
    const profile = LAUNCHES[launchCount.current++ % LAUNCHES.length]
    const next = { ...profile, vx: profile.vx * (0.94 + Math.random() * 0.12) }
    setLaunch(next)
    if (ball.current) ball.current.style.transform = `translate(${next.x}px, 95px)`
    const body = ball.current?.querySelector<SVGGElement>('[data-sun-body]')
    if (body) body.style.transform = ''
  }

  useEffect(() => {
    stop()
    angle.current = 0
    done.current = false
    pieces.current = []
    windDrag.current = null
    pieceDrag.current = null
    netTarget.current = 300
    setPlaced([]); setPositions(BLOCKS.map(({ x, y }) => ({ x, y }))); setTurns(BLOCKS.map(block => block.angle))
    setOffset(null); setSeating(null); setSolved(false); setDragging(false); setNeedsTurn(false); setPhase('ready'); setInstant(false)
    paintWind(0); paintNet(300); paintCatch(0)
    if (index === 2) nextLaunch()
    return stop
  }, [resetKey])

  useEffect(() => {
    if (!solved) return
    const timer = setTimeout(onSolved, window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 180 : 700)
    return () => clearTimeout(timer)
  }, [solved, onSolved])

  function point(event: PointerEvent<SVGElement>) {
    const matrix = scene.current?.getScreenCTM()
    return matrix ? new DOMPoint(event.clientX, event.clientY).matrixTransform(matrix.inverse()) : { x: 300, y: 200 }
  }

  function coast(velocity: number) {
    if (done.current || Math.abs(velocity) < 35 || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
    let previous = performance.now()
    function tick(now: number) {
      const dt = Math.min((now - previous) / 1000, 0.032)
      previous = now
      velocity *= Math.exp(-5.5 * dt)
      paintWind(angle.current + velocity * dt)
      if (!done.current && angle.current > 0 && Math.abs(velocity) > 12) frame.current = requestAnimationFrame(tick)
      else frame.current = null
    }
    frame.current = requestAnimationFrame(tick)
  }

  function place(block: number, turn = turns[block], from = positions[block]) {
    if (pieces.current.includes(block)) return
    if ((turn % 360 + 360) % 360 !== 0) {
      setNeedsTurn(true)
      sounds.play([120, 85], 0.055, 'triangle')
      return
    }
    setNeedsTurn(false)
    setSeating({ block, ...from })
    pieces.current = [...pieces.current, block]
    setPlaced(pieces.current)
    if (pieces.current.length === BLOCKS.length) complete()
    else sounds.play([147, 220], 0.08, 'triangle')
  }

  function turnPiece(block: number, direction = 1) {
    if (pieces.current.includes(block)) return
    const next = turns[block] + direction * 90
    setTurns(turns.map((turn, i) => i === block ? next : turn))
    setNeedsTurn(false)
    sounds.play([260], 0.04, 'triangle')
    if (Math.hypot(positions[block].x, positions[block].y) < 64 && (next % 360 + 360) % 360 === 0) place(block, next)
  }

  function drop(keyboard = false) {
    if (phase === 'falling' || phase === 'bouncing' || done.current) return
    stop()
    setInstant(keyboard)
    if (keyboard || window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      if (ball.current) ball.current.style.transform = 'translate(300px, 305px)'
      paintNet(300); paintCatch(5); setPhase('caught'); complete()
      return
    }
    setPhase('falling')
    const started = performance.now()
    let previous = started
    let impact: number | null = null
    let caughtX = 300
    let previousY = 95
    let bounced = false
    let missedAt: number | null = null
    let missedX = 300
    let missedRotation = 0
    function tick(now: number) {
      const dt = Math.min((now - previous) / 1000, 0.032)
      previous = now
      paintNet(netX.current + (netTarget.current - netX.current) * (1 - Math.exp(-28 * dt)))
      const t = (now - started) / 1000
      const travel = launch.x + launch.vx * t
      let x = travel > 508 ? 1016 - travel : travel < 92 ? 184 - travel : travel
      let y = 95 + launch.vy * t + launch.gravity * t * t / 2
      let rotation = launch.vx * t * 0.45
      if (impact === null && missedAt === null && !bounced && (travel > 508 || travel < 92)) {
        bounced = true
        sounds.play([220, 165], 0.055, 'triangle')
      }
      if (impact === null && missedAt === null && previousY < 300 && y >= 300 && Math.abs(x - netX.current) < 77) {
        impact = now
        caughtX = x
        sounds.play([110, 165], 0.1, 'triangle')
      }
      if (impact === null && missedAt === null && y >= 365) {
        missedAt = now
        missedX = x
        missedRotation = rotation
        setPhase('bouncing')
        sounds.playMiss()
      }
      if (missedAt !== null) {
        const elapsed = (now - missedAt) / 1000
        const hop = elapsed < 0.36 ? elapsed : elapsed < 0.58 ? elapsed - 0.36 : Math.min(0.14, elapsed - 0.58)
        const duration = elapsed < 0.36 ? 0.36 : elapsed < 0.58 ? 0.22 : 0.14
        x = missedX + (bounced ? -launch.vx : launch.vx) * 0.12 * (1 - Math.exp(-3 * elapsed))
        y = 365 - 450 * hop * (duration - hop)
        rotation = missedRotation + (bounced ? -launch.vx : launch.vx) * elapsed * 0.35
        const squash = 0.18 * Math.exp(-35 * hop) * Math.exp(-3 * elapsed)
        const body = ball.current?.querySelector<SVGGElement>('[data-sun-body]')
        if (body) body.style.transform = `scale(${1 + squash}, ${1 - squash})`
        if (elapsed >= 0.95) {
          setPhase('missed'); frame.current = null
          nextLaunch()
          return
        }
      }
      if (impact !== null) {
        const settling = (now - impact) / 1000
        const depth = 5 * (1 - Math.exp(-12 * settling)) + 18 * Math.exp(-5.5 * settling) * Math.sin(16 * settling)
        x = caughtX + (netX.current - caughtX) * Math.min(1, settling * 4)
        y = 300 + depth
        rotation *= Math.exp(-8 * settling)
        paintCatch(depth)
        if (settling >= 1) {
          setPhase('caught'); complete(); frame.current = null
          if (ball.current) ball.current.style.transform = `translate(${netX.current}px, 305px)`
          paintCatch(5)
          return
        }
      }
      if (ball.current) ball.current.style.transform = `translate(${x}px, ${y}px) rotate(${rotation}deg)`
      previousY = y
      frame.current = requestAnimationFrame(tick)
    }
    frame.current = requestAnimationFrame(tick)
  }

  function windingKeys(event: KeyboardEvent<SVGGElement>) {
    const values: Record<string, number> = { ArrowRight: angle.current + 45, ArrowUp: angle.current + 45, ArrowLeft: angle.current - 45, ArrowDown: angle.current - 45, Home: 0, End: 540 }
    if (values[event.key] === undefined || done.current) return
    event.preventDefault(); stop(); setInstant(true); paintWind(values[event.key])
  }

  const status = solved ? 'Ready. Trying again.' : index === 0 ? 'Wind the wheel to retry.'
    : index === 1 ? needsTurn ? 'Turn this stone to fit. Use the arrow keys to rotate and Enter to place.' : `${placed.length} of ${BLOCKS.length} pieces in place. Match the shapes. Tap to turn, drag to place. Keyboard: arrows turn, Enter places.`
    : phase === 'bouncing' ? 'Missed the net. The sun is taking a tumble.' : phase === 'missed' ? 'Missed it. A new throw is ready.' : 'Tap the sun. Move the net to catch it.'

  return <div className={`${labStyles.interactiveArt} ${styles.artwork}`} data-error-art={index} data-solved={solved} data-phase={phase} data-instant={instant || undefined} data-dragging={dragging || undefined}>
    <svg aria-describedby={hintId} className={styles.scene} onPointerMove={event => {
      if (index === 2 && event.pointerType === 'mouse' && !done.current) {
        netTarget.current = point(event).x
        if (phase !== 'falling' && phase !== 'bouncing') paintNet(netTarget.current)
      }
    }} ref={scene} viewBox={index === 0 ? '0 0 600 378' : '0 0 600 420'}>
      {index === 0 ? <>
        <ErrorScene index={0} turn={solved ? 540 : 0} />
        <g ref={wheel} aria-label="Wind the sun machine" aria-valuemax={540} aria-valuemin={0} aria-valuenow={Math.round(angle.current)} aria-valuetext={`${Math.round(angle.current / 5.4)} percent wound`} className={styles.wheelControl} onKeyDown={windingKeys} onPointerDown={event => {
          if (!event.isPrimary || event.button !== 0 || done.current) return
          event.preventDefault(); stop(); setInstant(false); setDragging(true)
          const p = point(event)
          windDrag.current = { angle: Math.atan2(p.y - 249, p.x - 400) * 180 / Math.PI, time: event.timeStamp, velocity: 0 }
          event.currentTarget.setPointerCapture(event.pointerId)
          event.currentTarget.focus({ preventScroll: true })
        }} onPointerMove={event => {
          const gesture = windDrag.current
          if (!gesture || done.current) return
          const p = point(event)
          if (Math.hypot(p.x - 400, p.y - 249) < 18) return
          const next = Math.atan2(p.y - 249, p.x - 400) * 180 / Math.PI
          const delta = (next - gesture.angle + 540) % 360 - 180
          const speed = delta / Math.max(1, event.timeStamp - gesture.time) * 1000
          gesture.velocity = Math.max(-1100, Math.min(1100, gesture.velocity * 0.55 + speed * 0.45))
          gesture.angle = next; gesture.time = event.timeStamp
          paintWind(angle.current + delta)
        }} onPointerUp={event => {
          const gesture = windDrag.current
          windDrag.current = null; setDragging(false)
          if (event.currentTarget.hasPointerCapture(event.pointerId)) event.currentTarget.releasePointerCapture(event.pointerId)
          if (gesture) coast(event.timeStamp - gesture.time > 90 ? 0 : gesture.velocity)
        }} onPointerCancel={() => { windDrag.current = null; setDragging(false); stop() }} role="slider" tabIndex={0}>
          <circle className={styles.hitArea} cx="400" cy="249" r="61" /><circle className={styles.focusRing} cx="400" cy="249" r="61" />
        </g>
      </> : index === 1 ? <>
        <ArchBase />
        <g className={styles.archLight} data-complete={solved} transform="translate(300 225)"><Sun awake={solved} /></g>
        <ArchAssembly placed={placed} seating={seating} />
        {BLOCKS.map((block, i) => <g aria-disabled={placed.includes(i)} aria-description={`${(turns[i] % 360 + 360) % 360} degrees. Arrow keys or Space rotate; Enter places.`} aria-label={`Place arch piece ${i + 1}`} className={styles.pieceControl} data-turn={(turns[i] % 360 + 360) % 360} key={i} onKeyDown={event => {
          if (event.key === 'Enter') { event.preventDefault(); setInstant(true); place(i) }
          else if (event.key === 'ArrowRight' || event.key === 'ArrowLeft' || event.key === ' ') { event.preventDefault(); setInstant(true); turnPiece(i, event.key === 'ArrowLeft' ? -1 : 1) }
        }} onPointerDown={event => {
          if (!event.isPrimary || placed.includes(i) || event.button !== 0) return
          event.preventDefault()
          const p = point(event)
          setInstant(false); setNeedsTurn(false)
          pieceDrag.current = { startX: p.x, startY: p.y, ...positions[i], moved: false }
          setOffset({ block: i, ...positions[i] })
          event.currentTarget.setPointerCapture(event.pointerId)
          event.currentTarget.focus({ preventScroll: true })
        }} onPointerMove={event => {
          const gesture = pieceDrag.current
          if (!gesture) return
          const p = point(event)
          const x = Math.max(90 - block.cx, Math.min(510 - block.cx, positions[i].x + p.x - gesture.startX))
          const y = Math.max(85 - block.cy, Math.min(325 - block.cy, positions[i].y + p.y - gesture.startY))
          gesture.x = x; gesture.y = y
          if (Math.hypot(p.x - gesture.startX, p.y - gesture.startY) > 4) gesture.moved = true
          setOffset({ block: i, x, y })
        }} onPointerUp={event => {
          const gesture = pieceDrag.current
          if (!gesture) return
          if (!gesture.moved) turnPiece(i)
          else {
            setPositions(positions.map((position, j) => j === i ? { x: gesture.x, y: gesture.y } : position))
            if (Math.hypot(gesture.x, gesture.y) < 64) place(i, turns[i], { x: gesture.x, y: gesture.y })
          }
          pieceDrag.current = null; setOffset(null)
          if (event.currentTarget.hasPointerCapture(event.pointerId)) event.currentTarget.releasePointerCapture(event.pointerId)
        }} onPointerCancel={() => { pieceDrag.current = null; setOffset(null) }} role="button" tabIndex={placed.includes(i) ? -1 : 0}>
          {placed.includes(i) ? <path className={styles.placedHitArea} d={block.path} /> : <ArchBlock block={i} dragging={offset?.block === i} turn={turns[i]} x={offset?.block === i ? offset.x : positions[i].x} y={offset?.block === i ? offset.y : positions[i].y} />}
        </g>)}
      </> : <>
        <ellipse className={styles.shadow} cx="300" cy="393" rx="166" ry="10" />
        {Math.abs(launch.vx) > 250 ? <g transform={launch.vx > 0 ? 'translate(542 0)' : 'translate(58 0) scale(-1 1)'}>
          <path className={styles.bumperFoot} d="M-12 378h28v5h-28z" />
          <path className={styles.bumperPost} d="M0 66v310" />
          <path className={styles.bumperPadDepth} d="M-4 76v78" />
          <path className={styles.bumperPad} d="M-4 72v78" />
          <path className={styles.bumperPadGlint} d="M-6 77v68" />
          <path className={styles.postCollar} d="M-6 61H6v9H-6zM-6 157H6v9H-6z" />
        </g> : null}
        <g aria-hidden="true" className={styles.netBack} ref={netBack}><Cradle landed={solved} layer="back" /></g>
        <path className={styles.fallingGuide} data-hidden={phase === 'falling' || phase === 'bouncing' || solved} d={`M${launch.x + Math.sign(launch.vx) * 9} 74q${Math.sign(launch.vx) * 26}-12 ${Math.sign(launch.vx) * 46} 9m${-Math.sign(launch.vx) * 3}-8 ${Math.sign(launch.vx) * 3} 8 ${-Math.sign(launch.vx) * 9}-1`} />
        <g aria-label="Give the sun a soft landing" aria-pressed={solved} className={styles.sunControl} onClick={() => drop()} onKeyDown={event => { if (event.key === 'Enter' || event.key === ' ') { event.preventDefault(); drop(true) } }} role="button" tabIndex={0}>
          <g className={styles.fallingSun} ref={ball} style={{ transform: `translate(${launch.x}px, 95px)` }}><g data-sun-body><Sun awake={solved || phase === 'falling' || phase === 'bouncing'} stunned={phase === 'bouncing'} /></g><circle className={styles.hitArea} r="49" /></g>
        </g>
        <g aria-label="Move the safety net" aria-valuemin={175} aria-valuemax={425} aria-valuenow={Math.round(netX.current)} className={styles.netControl} onPointerDown={event => {
          if (!event.isPrimary || done.current) return
          event.preventDefault(); event.currentTarget.setPointerCapture(event.pointerId)
          netTarget.current = point(event).x; paintNet(netTarget.current)
        }} onPointerMove={event => { if (event.buttons && !done.current) { netTarget.current = point(event).x; paintNet(netTarget.current) } }} onPointerUp={event => { if (event.currentTarget.hasPointerCapture(event.pointerId)) event.currentTarget.releasePointerCapture(event.pointerId) }} onKeyDown={event => {
          if (event.key === 'ArrowLeft' || event.key === 'ArrowRight' || event.key === 'Home') {
            event.preventDefault(); netTarget.current = event.key === 'Home' ? 300 : netX.current + (event.key === 'ArrowLeft' ? -20 : 20); paintNet(netTarget.current)
          } else if (event.key === 'Enter' || event.key === ' ') { event.preventDefault(); drop(true) }
        }} ref={net} role="slider" tabIndex={0}>
          <Cradle landed={solved} layer="front" />
          <path className={styles.netGrip} d="M280 368h40m-30 5h20" />
          <rect className={styles.hitArea} x="160" y="275" width="280" height="112" />
        </g>
      </>}
    </svg>
    <SoundToggle enabled={sounds.enabled} onClick={sounds.toggle} />
    <p className={styles.instruction} id={hintId}>{solved ? 'A fresh start.' : index === 0 ? 'Wind to retry.' : index === 1 ? needsTurn ? 'Turn this stone to fit.' : 'Tap to turn. Drag to rebuild.' : phase === 'bouncing' ? 'Oof. One more?' : phase === 'missed' ? 'New throw. Try the other way.' : 'Tap the sun. Catch to retry.'}</p>
    <p aria-live="polite" className={labStyles.srOnly}>{status}</p>
  </div>
}
