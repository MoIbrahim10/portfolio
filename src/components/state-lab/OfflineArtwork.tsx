import { useId, useRef, useState } from 'react'
import type { CSSProperties, KeyboardEvent, PointerEvent } from 'react'

import { SoundToggle, useStateSound } from './StateSound'
import { useRadioSound } from './RadioSound'
import styles from './StateExplorationLab.module.css'
import art from './OfflineArtwork.module.css'

interface Point { x: number; y: number }
const STARS = [[124, 230], [182, 130], [277, 159], [351, 102], [402, 239], [287, 286]]
const ROWS = [98, 198, 298]
const NOTES = [261.63, 329.63, 392, 523.25]

function Sun({ x = 260, y = 110, radius = 30 }: { x?: number; y?: number; radius?: number }) {
  return <g><circle className={art.gold} cx={x} cy={y} r={radius} />{Array.from({ length: 12 }, (_, i) => <path className={art.line} d={`M${x} ${y - radius - 9}v-8`} key={i} transform={`rotate(${i * 30} ${x} ${y})`} />)}</g>
}

interface SceneProps {
  index: number
  value?: number
  marks?: number[]
  plugs?: Point[]
  lines?: string[]
  hot?: number
  pulse?: number
  aim?: number
  sealed?: boolean
  powered?: boolean
}

export function OfflineScene({ index, value = index === 1 ? 24 : index === 3 ? 50 : 0, marks = [], plugs = ROWS.map(y => ({ x: 220, y })), lines = [], hot = -1, pulse = 0, aim = 0, sealed = false, powered = false }: SceneProps) {
  const id = `offline-${useId().replaceAll(':', '')}`
  const tuned = Math.abs(value - 56) < 5

  switch (index) {
    case 0:
      return <>
        <path className={art.shadow} d="M53 350h414l-17 12H70z" />
        <path className={art.stone} d="M53 45h414v292l-14 14H67l-14-14z" />
        <path className={art.line} d="M64 55h392v277l-9 9H73l-9-9zM85 67h57m236 0h57M85 326h57m236 0h57" />
        {ROWS.map((y, i) => {
          const plugged = marks.includes(i)
          const p = plugged ? { x: 320, y } : plugs[i]
          return <g data-part={i} key={i}>
            <path className={art.faint} d={`M82 ${y}h357`} strokeDasharray="2 8" />
            <path className={art.cableShadow} d={`M78 ${y + 4}C135 ${y - 39} ${p.x - 65} ${p.y + 39} ${p.x} ${p.y + 4}`} />
            <path className={[art.goldCable, art.redCable, art.navyCable][i]} d={`M78 ${y}C135 ${y - 43} ${p.x - 65} ${p.y + 35} ${p.x} ${p.y}`} />
            <path className={[art.goldCable, art.redCable, art.navyCable][i]} d={`M344 ${y}q53 ${i % 2 ? -24 : 24} 96 0`} />
            <path className={art.navy} d={`M311 ${y - 15}h34v30h-34z`} />
            <path className={art.line} d={`M311 ${y - 15}h34v30h-34zM322 ${y - 6}v12`} />
            <g className={art.plug} data-hot={hot === i} transform={`translate(${p.x} ${p.y})`}>
              <path className={art.gold} d="M-18-12H0l5 5v14l-5 5h-18z" />
              <path className={art.lightLine} d="M-13-8v16m5-16v16M4-5h9M4 5h9" />
            </g>
            <path className={art.gold} d={`M71 ${y - 6}h8v12h-8zM438 ${y - 6}h8v12h-8z`} />
          </g>
        })}
      </>
    case 1: {
      return <>
        <defs>
          <linearGradient id={`${id}-wood`} x2="0.15" y2="1"><stop stopColor="#ab6b40" /><stop offset="0.28" stopColor="#754329" /><stop offset="0.8" stopColor="#6a382b" /><stop offset="1" stopColor="#9f5736" /></linearGradient>
          <linearGradient id={`${id}-face`} x2="0.2" y2="1"><stop stopColor="#385568" /><stop offset="0.5" stopColor="#1c3c51" /><stop offset="1" stopColor="#153044" /></linearGradient>
          <linearGradient id={`${id}-brass`} x2="0.8" y2="1"><stop stopColor="#8a582a" /><stop offset="0.22" stopColor="#f7d38e" /><stop offset="0.48" stopColor="#d79d40" /><stop offset="0.75" stopColor="#a96b2b" /><stop offset="1" stopColor="#e9b75f" /></linearGradient>
          <linearGradient id={`${id}-glass`} x2="0" y2="1"><stop stopColor="#181e20" /><stop offset="0.4" stopColor="#433722" /><stop offset="1" stopColor="#211e19" /></linearGradient>
          <radialGradient id={`${id}-light`}><stop stopColor="#f7d38e" stopOpacity="0.45" /><stop offset="1" stopColor="#d79d40" stopOpacity="0" /></radialGradient>
          <radialGradient id={`${id}-knob`} cx="0.35" cy="0.25" r="0.8"><stop stopColor="#ffe5af" /><stop offset="0.4" stopColor="#e4b666" /><stop offset="0.76" stopColor="#b87c31" /><stop offset="1" stopColor="#744923" /></radialGradient>
          <pattern id={`${id}-grain`} width="48" height="16" patternUnits="userSpaceOnUse"><path d="M0 3q12-3 24 0t24 0M0 10q24 5 48 0M9 15q13-3 30 0" fill="none" stroke="#f2ba77" strokeOpacity="0.15" strokeWidth="0.6" /></pattern>
          <pattern id={`${id}-cloth`} width="5" height="5" patternUnits="userSpaceOnUse"><rect width="5" height="5" fill="#756249" /><path d="M0 1h5M0 4h5" stroke="#c0a278" strokeWidth="0.7" /><path d="M1 0v5M4 0v5" stroke="#372f2a" strokeWidth="0.8" /></pattern>
        </defs>
        <ellipse cx="266" cy="360" rx="208" ry="12" fill="#071a29" opacity="0.5" />
        <path d="M93 68v-9l267-38" fill="none" stroke="#142639" strokeWidth="7" strokeLinecap="round" />
        <path d="m93 56 266-38" fill="none" stroke={`url(#${id}-brass)`} strokeWidth="4" strokeLinecap="round" />
        <path d="m245 33 113-16" stroke="#fff1cd" strokeWidth="1.2" /><circle cx="360" cy="18" r="3" fill="#e7c18a" />
        <path d="M143 70V55q0-18 18-18h195q18 0 18 18v15" fill="none" stroke="#101f2c" strokeWidth="13" />
        <path d="M143 65V55q0-18 18-18h195q18 0 18 18v10" fill="none" stroke="#98663e" strokeWidth="7" />
        <path d="M161 34h195" stroke="#c48b54" strokeWidth="1.5" />
        <path d="M88 337h47v20H88zM379 337h47v20h-47z" fill="#15222b" /><path d="M92 341h39m252 0h39" stroke="#765233" strokeWidth="3" />
        <path d="M453 74l24 14v235l-24 20z" fill="#432b24" /><path d="M466 91v228" stroke="#a2643c" strokeWidth="1" />
        <rect x="45" y="64" width="418" height="278" rx="17" fill={`url(#${id}-wood)`} stroke="#c58b50" strokeWidth="1.5" />
        <rect x="45" y="64" width="418" height="278" rx="17" fill={`url(#${id}-grain)`} />
        <rect x="58" y="77" width="392" height="251" rx="10" fill="#18252d" stroke="#4a3024" strokeWidth="3" />
        <rect x="62" y="81" width="384" height="243" rx="8" fill={`url(#${id}-face)`} stroke={`url(#${id}-brass)`} strokeWidth="1.5" />
        <path d="M69 89h370M68 314h372" stroke="#d5ad68" strokeWidth="0.7" opacity="0.45" />
        <rect x="76" y="100" width="356" height="86" rx="5" fill="#0c1c27" stroke={`url(#${id}-brass)`} strokeWidth="4" />
        <rect x="80" y="104" width="348" height="78" rx="3" fill={`url(#${id}-glass)`} />
        <rect x="80" y="104" width="348" height="78" rx="3" fill={`url(#${id}-light)`} opacity={powered ? 1 : 0.28} />
        <g className={art.radioScale}>
          <text x="93" y="120" fontSize="6" letterSpacing="2">FM</text><text x="412" y="120" textAnchor="end" fontSize="6">MHz</text>
          {Array.from({ length: 11 }, (_, i) => <text x={90 + i * 32.2} y="139" textAnchor="middle" fontSize="8" key={i}>{88 + i * 2}</text>)}
          {Array.from({ length: 51 }, (_, i) => <path d={`M${90 + i * 6.44} 145v${i % 5 ? 5 : 10}`} key={i} stroke="currentColor" strokeWidth={i % 5 ? 0.65 : 1} opacity={i % 5 ? 0.5 : 0.9} />)}
          <path d="M90 159h322" stroke="currentColor" opacity="0.3" />
          <text x="90" y="174" fontSize="6" letterSpacing="0.5">MO · DESERT RADIO</text>
          <text x="415" y="174" textAnchor="end" fontSize="6" letterSpacing="1.2">ANALOGUE</text>
        </g>
        <g transform={`translate(${90 + value * 3.22} 0)`}><path d="M2 122v40" stroke="#060d15" strokeWidth="3" opacity="0.6" /><path d="M0 120v42" stroke="#f8ab68" strokeWidth="1.6" /><path d="M-3 118h6l-3 4z" fill="#eaba78" /></g>
        <path d="m83 107 343 0-27 20H83z" fill="#fffaf0" opacity="0.045" /><path d="m86 105 138 0-67 75H86z" fill="#fffaf0" opacity="0.025" />
        <rect x="76" y="207" width="236" height="103" rx="6" fill="#0b202e" stroke={`url(#${id}-brass)`} strokeWidth="2" />
        <rect x="81" y="212" width="226" height="93" rx="3" fill={`url(#${id}-cloth)`} />
        <ellipse cx="194" cy="258" rx="71" ry="44" fill="#181c20" opacity="0.22" />
        {Array.from({ length: 7 }, (_, i) => <g key={i}><path d={`M84 ${219 + i * 13}h220`} stroke="#322d25" strokeWidth="3" /><path d={`M84 ${218 + i * 13}h220`} stroke={`url(#${id}-brass)`} strokeWidth="1.5" /></g>)}
        <g className={art.radioKnob} data-hot={hot === 0} data-part="0">
          <circle cx="384" cy="281" r="43" fill="#071c2b" opacity="0.8" />
          <circle cx="384" cy="277" r="44" fill="#10232f" stroke="#537084" strokeWidth="0.8" />
          {Array.from({ length: 36 }, (_, i) => <path d="M384 231v3" key={i} transform={`rotate(${i * 10} 384 277)`} stroke="#d4a461" strokeWidth="0.8" opacity={i % 3 ? 0.35 : 0.7} />)}
          <circle cx="384" cy="277" r="37" fill={`url(#${id}-brass)`} stroke="#e8bc73" strokeWidth="0.8" />
          {Array.from({ length: 48 }, (_, i) => <path d="M384 241v5" key={i} transform={`rotate(${i * 7.5} 384 277)`} stroke="#5e3e22" strokeWidth="1.1" opacity="0.6" />)}
          <circle cx="384" cy="277" r="31" fill={`url(#${id}-knob)`} stroke="#edc880" strokeWidth="0.8" />
          <circle cx="384" cy="277" r="27" fill="none" stroke="#aa7134" strokeWidth="0.7" opacity="0.5" />
          <g transform={`rotate(${value * 3.6} 384 277)`}><path d="M384 250v11" stroke="#503523" strokeWidth="3" strokeLinecap="round" /><path d="M383 250v11" stroke="#fff1ce" strokeWidth="0.7" strokeLinecap="round" /></g>
          <path className={art.knobShine} d="M364 263a25 25 0 0 1 32-7" fill="none" stroke="#fff4d6" strokeWidth="1.4" opacity="0.4" />
        </g>
        <circle cx="346" cy="211" r="3" fill={powered && tuned ? '#f7d38e' : '#514b3d'} stroke="#0c2436" strokeWidth="2" />
        <text className={art.radioLabel} x="359" y="214" fontSize="6" letterSpacing="1.5">{powered && tuned ? 'TUNED' : 'FM / MONO'}</text>
        <text className={art.radioLabel} x="384" y="334" textAnchor="middle" fontSize="6" letterSpacing="2">TUNING</text>
        {[[70, 89], [438, 89], [70, 316], [438, 316]].map(([x, y]) => <g key={`${x}-${y}`}><circle cx={x} cy={y} r="2.2" fill={`url(#${id}-brass)`} /><path d={`m${x - 1} ${y + 1} 2-2`} stroke="#624425" strokeWidth="0.7" /></g>)}
      </>
    }
    case 2:
      return <>
        <defs><radialGradient id={id}><stop stopColor="#edba62" stopOpacity="0.3" /><stop offset="1" stopColor="#edba62" stopOpacity="0" /></radialGradient></defs>
        <circle fill={`url(#${id})`} cx="260" cy="208" r="158" />
        <path className={art.dune} d="M36 320q85-49 155-12 69-72 134-15 106-56 159 34v32H36z" />
        <ellipse className={art.navy} cx="260" cy="324" rx="133" ry="26" />
        <ellipse className={art.line} cx="260" cy="324" rx="111" ry="17" opacity="0.6" />
        <g className={art.plant} transform={`translate(260 295) scale(${0.4 + value * 0.15}) translate(-260 -295)`}>
          <path className={art.line} strokeWidth="4" d="M260 295V126" />
          <path className={art.navy} d="M260 226c-60-6-84-58-84-58 66-5 84 58 84 58M260 194c59-9 78-61 78-61-66-1-78 61-78 61" />
          <path className={art.line} d="M184 177q48 14 76 49m0-32q22-38 70-53" opacity="0.65" />
          {value > 1 ? <g className={art.leafReveal}><path className={art.navy} d="M260 267c-49 0-71-39-71-39 52-9 71 39 71 39M260 244c50-9 67-47 67-47-56-2-67 47-67 47" /><path className={art.line} d="M198 234q34 7 62 33m0-23q19-30 58-42" opacity="0.6" /></g> : null}
          {value >= 4 ? <g className={art.leafReveal}><path className={art.gold} d="M260 88q-38 26-26 45l26 9 26-9q12-19-26-45z" /><path className={art.lightLine} d="M260 96v39m-17-25 17 25 17-25" /></g> : <Sun x={260} y={116} radius={12} />}
        </g>
        <path className={art.red} d="M211 285h98l-15 51h-68z" /><path className={art.line} d="M214 295h92M229 305v17m15-17v17m16-17v17m16-17v17m15-17v17" />
        <g className={art.water} data-part="0"><path className={art.line} d="M391 75q-20 27-20 38a20 20 0 0 0 40 0q0-11-20-38z" /><path className={art.gold} d="M391 95q-10 13-10 18a10 10 0 0 0 20 0q0-5-10-18z" /></g>
        {pulse ? <g key={pulse} className={art.rain}><path className={art.line} d="M381 142l-48 41m58-29-46 43m28-59-39 31" /><ellipse className={art.line} cx="260" cy="324" rx="78" ry="12" /></g> : null}
      </>
    case 3: {
      const x = 100 + value * 3.2
      const y = 104 + Math.abs(value - 50) * 1.8
      return <>
        <defs><radialGradient id={id}><stop stopColor="#edba62" stopOpacity="0.28" /><stop offset="1" stopColor="#edba62" stopOpacity="0" /></radialGradient></defs>
        <path className={art.faint} d="M51 195a211 161 0 0 1 418 0" strokeDasharray="2 9" />
        <circle fill={`url(#${id})`} cx={x} cy={y} r="107" />
        <g data-part="0"><Sun x={x} y={y} radius={29} /></g>
        <g className={art.far}><path className={art.navy} d="M18 293l140-139 141 139 95-100 108 100v63H18z" /><path className={art.gold} opacity="0.23" d="M158 154l42 139h99zM394 193l26 100h82z" /><path className={art.line} opacity="0.7" d="M18 293l140-139 141 139 95-100 108 100" /></g>
        <path className={art.redDark} d="M8 340q133-81 259-26t245-12v64H8z" />
        <path className={art.line} d="M8 340q133-81 259-26t245-12" />
        <path className={art.line} opacity="0.2" d="M53 353q95-36 177-16m107-10q94 9 141-10" />
        <path className={art.navy} d={`M158 293l${(50 - value) * 1.8} 53H82z`} opacity="0.18" />
        {value > 80 ? <path className={art.gold} d="M179 64l3 7 7 3-7 3-3 7-3-7-7-3 7-3zM291 42l2 5 5 2-5 2-2 5-2-5-5-2 5-2z" /> : null}
      </>
    }
    case 4:
      return <>
        <defs><clipPath id={id}><path d="M60 58h400v275H60z" /></clipPath></defs>
        <path className={art.shadow} d="M44 347h432l-18 15H62z" />
        <path className={art.stone} d="M44 41h432v306H44z" />
        <path className={art.sand} d="M60 58h400v275H60z" />
        <path className={art.line} d="M52 49h416v290H52z" />
        <g clipPath={`url(#${id})`}>
          {Array.from({ length: 13 }, (_, i) => <path className={art.sandContour} d={`M51 ${64 + i * 24}q96-33 204-3t226 0`} key={i} />)}
          {lines.map((line, i) => <g key={i}><path className={art.etchedShadow} d={line} transform="translate(1 2)" /><path className={art.etchedLine} d={line} /></g>)}
          <path className={art.red} d="M389 258l20-11 22 16-10 23-26-1z" /><path className={art.line} d="M389 258l20 4 22 1m-22-16v15l12 24" />
          <path className={art.gold} d="M94 92l12-9 19 8 4 16-21 9-17-10z" />
        </g>
      </>
    case 5:
      return <>
        <defs><radialGradient id={id}><stop stopColor="#33546a" /><stop offset="1" stopColor="#102b43" /></radialGradient></defs>
        <circle cx="260" cy="200" fill={`url(#${id})`} r="169" />
        <circle className={art.line} cx="260" cy="200" r="172" opacity="0.65" />
        <circle className={art.line} cx="260" cy="200" r="161" opacity="0.18" />
        {Array.from({ length: 48 }, (_, i) => <path className={art.line} opacity="0.35" d={`M260 30v${i % 6 ? 4 : 9}`} key={i} transform={`rotate(${i * 7.5} 260 200)`} />)}
        <g className={art.far}>{Array.from({ length: 24 }, (_, i) => <circle className={art.paper} cx={122 + (i * 73) % 272} cy={78 + (i * 47) % 242} key={i} opacity="0.27" r={i % 3 ? 0.8 : 1.5} />)}</g>
        <path className={art.faint} d="M124 230 182 130 277 159 351 102 402 239 287 286z" strokeDasharray="2 8" />
        {STARS.map(([x, y], i) => <g key={i}>
          {marks.includes(i) && marks.includes((i + 1) % 6) ? <path className={art.starLink} d={`M${x} ${y}L${STARS[(i + 1) % 6].join(' ')}`} /> : null}
          <g className={art.star} data-lit={marks.includes(i)} data-part={i} style={{ transformOrigin: `${x}px ${y}px` }}>
            <path className={marks.includes(i) ? art.gold : art.paper} d={`M${x} ${y - 12}l4 8 8 4-8 4-4 8-4-8-8-4 8-4z`} />
            {marks.includes(i) ? <path className={art.line} opacity="0.45" d={`M${x} ${y - 25}v5m0 40v5m-25-25h5m40 0h5`} /> : null}
          </g>
        </g>)}
        <path className={art.line} opacity="0.5" d="M241 23h38m-31-6h24M241 377h38m-31 6h24" />
      </>
    case 6:
      return <>
        <path className={art.faint} d="M64 284q235 59 318-151 52-113 67-8t-96 115" strokeDasharray="3 8" />
        <g className={art.far}><path className={art.line} opacity="0.3" d="M54 139h72m-50 10h91M348 288h96m-47 10h59" /><path className={art.dune} d="M49 340q116-54 229-3t190-8v34H49z" /></g>
        <g transform={`rotate(${aim} 260 194)`}>
          <g className={pulse ? art.planeFlight : undefined} key={pulse}>
            <path className={art.planeShadow} d="M133 178l229-83-88 205-38-89z" />
            <path className={art.paper} d="M124 165l228-79-83 199-37-88z" />
            <path className={art.stone} d="M232 197l120-111-83 199z" />
            <path className={art.red} d="M232 197l-4 55 25-28 16 61-37-88z" />
            <path className={art.line} d="M124 165l228-79-83 199-37-88zM232 197l120-111M232 197l-4 55 25-28" />
            <path className={art.line} opacity="0.6" d="M156 166l92-32m6 96 67-115" />
          </g>
        </g>
        <path className={art.line} d="M59 284h16m-8-8v16M407 72l3 7 7 3-7 3-3 7-3-7-7-3 7-3z" />
      </>
    case 7:
      return <>
        <path className={art.faint} d="M57 40h406v312H57z" />
        {[0, 1, 2, 3].map(i => {
          const x = 84 + i % 2 * 186
          const y = 57 + Math.floor(i / 2) * 144
          return <g className={art.rhythmTile} data-active={marks.at(-1) === i} data-part={i} key={`${i}-${marks.at(-1) === i ? pulse : 0}`}>
            <path className={art.tileShadow} d={`M${x + 6} ${y + 7}h166v123h-166z`} />
            <path className={art.tileFace} d={`M${x} ${y + 8}l8-8h150l8 8v104l-8 8H${x + 8}l-8-8z`} />
            <path className={art.tileInset} d={`M${x + 8} ${y + 10}h150v100H${x + 8}z`} />
            {i === 0 ? <Sun x={x + 83} y={y + 60} radius={19} /> : i === 1 ? <path className={art.line} d={`M${x + 54} ${y + 34}l58 52m-58 0 58-52`} strokeWidth="3" /> : i === 2 ? <path className={art.line} d={`M${x + 83} ${y + 29}l31 31-31 31-31-31zM${x + 83} ${y + 39}v42`} strokeWidth="3" /> : <path className={art.line} d={`M${x + 42} ${y + 65}q20-43 40 0t40 0`} strokeWidth="3" />}
            <path className={art.line} opacity="0.35" d={`M${x + 21} ${y + 15}h18m88 0h18M${x + 21} ${y + 105}h18m88 0h18`} />
          </g>
        })}
        {marks.slice(-12).map((mark, i) => <path className={art.gold} d={`M${159 + i * 18} 376l3-3 3 3-3 3z`} key={i} opacity={0.4 + mark * 0.2} />)}
      </>
    case 8: {
      const heights = marks.length ? marks : [1, 3, 2]
      const balanced = heights.every(height => height === heights[0])
      return <>
        <path className={art.faint} d="M72 337h376M79 111h362" strokeDasharray="2 8" />
        {balanced ? <g className={art.leafReveal}><Sun x={260} y={71} radius={15} /></g> : <path className={art.line} opacity="0.4" d="M249 66l11-12 11 12m-22 7h22" />}
        {heights.map((height, i) => <g data-part={i} key={i}>
          {Array.from({ length: height }, (_, j) => {
            const x = 99 + i * 119
            const y = 286 - j * 48
            return <g className={art.balanceStone} key={j}>
              <path className={i === 1 ? art.red : art.gold} d={`M${x} ${y + 5}l6-5h80l6 5-5 35h-82z`} />
              <path className={art.navy} opacity="0.17" d={`M${x + 83} ${y}l9 5-5 35h-12z`} />
              <path className={art.lightLine} d={`M${x + 7} ${y + 7}h74m-57 12h33m-25 7h17`} />
            </g>
          })}
          <path className={art.navy} d={`M${87 + i * 119} 333h115v6H${87 + i * 119}z`} />
        </g>)}
        <path className={art.line} d="M56 346h408" />
      </>
    }
    default:
      return <>
        <path className={art.gold} d="M76 85h378v239H76z" />
        <path className={art.paper} d="M61 70h384v243H61z" />
        <path className={art.line} d="M69 78h368v227H69z" />
        <g className={art.noteLines} data-sealed={sealed}><path className={art.faint} d="M94 168h315M94 211h315M94 254h315" /><path className={art.red} d="M94 99h35v3H94zM94 105h35v2H94z" /><path className={art.line} d="M373 96h37v38h-37z" strokeDasharray="2 3" /><Sun x={391} y={115} radius={8} /></g>
        <g className={art.noteFlap} data-sealed={sealed}>
          <path className={art.stone} d="M61 70h384L260 226z" />
          <path className={art.line} d="M61 70 260 226 445 70M61 313l129-133m255 133L320 180" />
          <Sun x={260} y={229} radius={19} />
        </g>
        <path className={art.paperLine} opacity="0.3" d="M54 341h159m135-1h104M34 136h12m-6-6v12M464 282l3 6 6 3-6 3-3 6-3-6-6-3 6-3z" />
      </>
  }
}

interface Gesture { pointerId: number; control: number; x: number; y: number; previousAngle: number; moved: boolean; capture: HTMLElement }

export function OfflineArtwork({ index }: { index: number }) {
  const [value, setValue] = useState(index === 1 ? 24 : index === 3 ? 50 : 0)
  const [marks, setMarks] = useState<number[]>(index === 8 ? [1, 3, 2] : [])
  const [plugs, setPlugs] = useState<Point[]>(ROWS.map(y => ({ x: 220, y })))
  const [lines, setLines] = useState<string[]>([])
  const [note, setNote] = useState('')
  const [sealed, setSealed] = useState(false)
  const [hot, setHot] = useState(-1)
  const [pulse, setPulse] = useState(0)
  const [aim, setAim] = useState(0)
  const gesture = useRef<Gesture | null>(null)
  const currentValue = useRef(value)
  const lastPoint = useRef<Point | null>(null)
  const lastSound = useRef(0)
  const hintId = useId()
  const sounds = useStateSound()
  const radio = useRadioSound(value)
  const tuned = Math.abs(value - 56) < 5

  function change(next: number) {
    const clamped = Math.max(0, Math.min(100, next))
    currentValue.current = clamped
    setValue(currentValue.current)
  }

  function activate(control: number) {
    setPulse(p => p + 1)
    if (index === 0 || index === 5) {
      if (marks.includes(control)) return
      setMarks(previous => previous.includes(control) ? previous : [...previous, control])
      sounds.play([NOTES[control % 4]], 0.22)
    } else if (index === 1) change(56)
    else if (index === 2) { setValue(v => Math.min(4, v + 1)); sounds.play([392, 523.25], 0.18) }
    else if (index === 6) { setValue(v => v + 1); sounds.play([392, 523.25, 783.99], 0.12) }
    else if (index === 7) { setMarks(previous => [...previous.slice(-11), control]); sounds.play([NOTES[control]], 0.28, 'triangle') }
    else if (index === 8) { setMarks(previous => previous.map((height, i) => i === control ? height % 4 + 1 : height)); sounds.play([NOTES[control]], 0.12) }
    else if (index === 9) { setSealed(s => !s); sounds.play(sealed ? [392, 261.63] : [261.63, 392, 523.25], 0.16) }
  }

  function point(event: PointerEvent<HTMLDivElement>) {
    const rect = event.currentTarget.getBoundingClientRect()
    return { x: (event.clientX - rect.left) / rect.width * 520, y: (event.clientY - rect.top) / rect.height * 400 }
  }

  function angleAt(p: Point) { return Math.atan2(p.x - 384, 277 - p.y) * 180 / Math.PI }

  function start(event: PointerEvent<HTMLDivElement>) {
    if (!event.isPrimary || event.button !== 0 || (index !== 0 && index !== 1 && index !== 3 && index !== 4)) return
    const button = (event.target as Element).closest<HTMLButtonElement>('button[data-hit]')
    if (index !== 4 && !button) return
    if (button?.disabled) return
    event.preventDefault()
    const capture = button ?? event.currentTarget
    capture.focus({ preventScroll: true })
    capture.setPointerCapture(event.pointerId)
    const p = point(event)
    gesture.current = { pointerId: event.pointerId, control: Number(button?.dataset.hit ?? 0), x: p.x, y: p.y, previousAngle: angleAt(p), moved: false, capture }
    event.currentTarget.dataset.dragging = 'true'
    if (index === 4) {
      lastPoint.current = p
      setLines(previous => [...previous.slice(-23), `M${p.x.toFixed(1)} ${p.y.toFixed(1)}l0.1 0.1`])
    }
  }

  function move(event: PointerEvent<HTMLDivElement>) {
    const p = point(event)
    if (!window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      event.currentTarget.style.setProperty('--look-x', String(Math.max(-1, Math.min(1, (p.x - 260) / 170))))
      event.currentTarget.style.setProperty('--look-y', String(Math.max(-1, Math.min(1, (p.y - 200) / 150))))
    }
    event.currentTarget.style.setProperty('--cursor-x', `${p.x / 520 * 100}%`)
    event.currentTarget.style.setProperty('--cursor-y', `${p.y / 400 * 100}%`)
    if (index === 6 && event.pointerType === 'mouse') setAim(Math.round(Math.max(-16, Math.min(16, (p.x - 260) / 12))))
    if (index === 5 && event.pointerType === 'mouse') {
      const star = STARS.findIndex(([x, y]) => Math.hypot(p.x - x, p.y - y) < 22)
      if (star >= 0 && !marks.includes(star)) activate(star)
    }
    const g = gesture.current
    if (!g || g.pointerId !== event.pointerId) return
    if (Math.hypot(p.x - g.x, p.y - g.y) > 4) g.moved = true
    if (index === 0) setPlugs(previous => previous.map((plug, i) => i === g.control ? { x: Math.max(110, Math.min(345, p.x)), y: Math.max(65, Math.min(332, p.y)) } : plug))
    else if (index === 1) {
      if (Math.hypot(p.x - 384, p.y - 277) < 12) return
      const angle = angleAt(p)
      const delta = (angle - g.previousAngle + 540) % 360 - 180
      g.previousAngle = angle
      change(currentValue.current + delta / 3.6)
    } else if (index === 3) change((p.x - 100) / 3.2)
    else if (index === 4 && lastPoint.current && Math.hypot(p.x - lastPoint.current.x, p.y - lastPoint.current.y) > 2) {
      lastPoint.current = p
      setLines(previous => previous.map((line, i) => i === previous.length - 1 && line.length < 12000 ? `${line}L${p.x.toFixed(1)} ${p.y.toFixed(1)}` : line))
      if (performance.now() - lastSound.current > 100) { sounds.play([170 + p.x / 5], 0.04, 'triangle'); lastSound.current = performance.now() }
    }
  }

  function finish(event: PointerEvent<HTMLDivElement>, cancelled = false) {
    const g = gesture.current
    if (!g || g.pointerId !== event.pointerId) return
    const p = point(event)
    if (!cancelled && index === 0) {
      if (!g.moved || Math.hypot(p.x - 320, p.y - ROWS[g.control]) < 38) activate(g.control)
      setPlugs(previous => previous.map((plug, i) => i === g.control ? { x: 220, y: ROWS[i] } : plug))
    } else if (!cancelled && index === 1 && !g.moved) activate(0)
    else if (!cancelled && index === 3) {
      sounds.play(value > 70 ? [392, 261.63] : [261.63, 392], 0.3)
    }
    gesture.current = null
    event.currentTarget.removeAttribute('data-dragging')
    if (g.capture.hasPointerCapture(event.pointerId)) g.capture.releasePointerCapture(event.pointerId)
  }

  function keyboard(event: KeyboardEvent<HTMLElement>) {
    if (index === 1 || index === 3) {
      const next = { Home: 0, End: 100, ArrowRight: value + 1, ArrowUp: value + 1, ArrowLeft: value - 1, ArrowDown: value - 1, PageUp: value + 10, PageDown: value - 10 }[event.key]
      if (next !== undefined) { event.preventDefault(); change(next); if (index === 3 && (event.key === 'Home' || event.key === 'End')) sounds.play([261.63, 392], 0.3) }
    } else if (index === 4) {
      if (event.key === 'Delete' || event.key === 'Backspace') { event.preventDefault(); setLines([]) }
      if (event.key === 'Enter' || event.key === ' ') { event.preventDefault(); setLines(previous => [...previous.slice(-23), `M${100 + previous.length % 5 * 55} 112q80 65 0 160`]) }
    } else if (index === 7 && /^[1-4]$/.test(event.key)) activate(Number(event.key) - 1)
  }

  function hit(control: number, label: string, x: number, y: number, width = 52, height = width, disabled = false) {
    const slider = index === 1 || index === 3
    const position: CSSProperties = { left: `${x / 520 * 100}%`, top: `${y / 400 * 100}%`, width: `${width / 520 * 100}%`, height: `${height / 400 * 100}%` }
    return <button aria-label={label} aria-pressed={index === 0 || index === 5 ? marks.includes(control) : undefined} aria-valuemin={slider ? 0 : undefined} aria-valuemax={slider ? 100 : undefined} aria-valuenow={slider ? Math.round(value) : undefined} aria-valuetext={slider ? index === 1 ? `${(88 + value * 0.2).toFixed(1)} FM. ${tuned ? 'Music is clear.' : 'Static. Turn the dial to find music.'}` : `${Math.round(value)} percent of the day.` : undefined} className={art.hit} data-hit={control} disabled={disabled} key={control} onClick={event => { if ((index !== 0 && index !== 1 && index !== 3) || event.detail === 0) activate(control) }} onPointerEnter={() => setHot(control)} onPointerLeave={() => setHot(-1)} role={slider ? 'slider' : undefined} style={position} type="button" />
  }

  const status = index === 0 ? marks.length === 3 ? 'The illustration is connected. Your network may still be offline.' : `${marks.length} of 3 little connections made.`
    : index === 1 ? tuned ? 'Station found. A little music, no internet needed.' : 'Turn the dial to find music. Enable sound to listen.'
    : index === 2 ? value >= 4 ? 'Small things grow with a little care.' : 'No Wi-Fi needed. Just a little care.'
    : index === 3 ? value < 30 ? 'A slow morning.' : value < 70 ? 'A little warmth in the middle of the day.' : 'The quiet part of the evening.'
    : index === 4 ? 'Draw with a finger or pointer. The sand is yours.'
    : index === 5 ? marks.length === 6 ? 'A whole constellation. All yours.' : `${marks.length} of 6 stars lit.`
    : index === 6 ? value ? `${value} ${value === 1 ? 'flight' : 'flights'} of fancy. Zero internet required.` : 'A thought can travel without a connection.'
    : index === 7 ? marks.length ? 'A little rhythm, made visible.' : 'Four tiles. Make a pattern of your own.'
    : index === 8 ? marks.every(height => height === marks[0]) ? 'A satisfying little balance.' : 'Tap the stones to find a balance.'
    : sealed ? 'A thought, sealed in a little sunshine.' : 'Just a local doodle. This note isn’t sent or saved.'

  return <div className={`${styles.interactiveArt} ${art.artwork}`} data-spatial="offline">
    <div aria-describedby={hintId} aria-label={index === 4 ? 'Draw in the sand' : 'Explore offline illustration'} className={art.canvas} data-scene={index} data-sealed={sealed} onDoubleClick={index === 4 ? () => setLines([]) : undefined} onKeyDown={keyboard} onPointerCancel={event => finish(event, true)} onPointerDown={start} onPointerLeave={event => { event.currentTarget.style.setProperty('--look-x', '0'); event.currentTarget.style.setProperty('--look-y', '0') }} onPointerMove={move} onPointerUp={event => finish(event)} role="group" tabIndex={index === 4 || index === 7 ? 0 : undefined}>
      <svg aria-hidden="true" className={styles.scene} focusable="false" viewBox="0 0 520 400"><OfflineScene aim={aim} hot={hot} index={index} lines={lines} marks={marks} plugs={plugs} powered={radio.enabled} pulse={pulse} sealed={sealed} value={value} /></svg>
      {index === 0 ? ROWS.map((y, i) => hit(i, `Connect wire ${i + 1}`, marks.includes(i) ? 320 : plugs[i].x - 7, marks.includes(i) ? y : plugs[i].y, 50, 50, marks.includes(i)))
        : index === 1 ? hit(0, 'Tune the radio', 384, 277, 90)
        : index === 2 ? hit(0, 'Water the oasis', 391, 109, 62)
        : index === 3 ? hit(0, 'Move the sun', 100 + value * 3.2, 104 + Math.abs(value - 50) * 1.8, 92)
        : index === 5 ? STARS.map(([x, y], i) => hit(i, `Light star ${i + 1}`, x, y))
        : index === 6 ? hit(0, 'Launch the paper plane', 253, 185, 240, 194)
        : index === 7 ? NOTES.map((_, i) => hit(i, `Play rhythm pad ${i + 1}`, 167 + i % 2 * 186, 117 + Math.floor(i / 2) * 144, 166, 120))
        : index === 8 ? marks.map((height, i) => hit(i, `Build column ${i + 1}`, 145 + i * 119, 312 - height * 24, 98, height * 48))
        : index === 9 ? <>{!sealed ? <textarea aria-label="Your passing thought" className={art.postcardInput} maxLength={100} onChange={event => setNote(event.target.value)} placeholder="What’s on your mind?" spellCheck={false} value={note} /> : null}{hit(0, sealed ? 'Open postcard' : 'Seal postcard', sealed ? 260 : 391, sealed ? 229 : 115, 65)}</> : null}
      {index === 4 ? <span aria-hidden="true" className={art.sandCursor} /> : null}
    </div>
    {index === 4 ? <button aria-label="Fresh sand" className={art.reset} onClick={() => setLines([])} type="button">↻</button> : null}
    <SoundToggle enabled={index === 1 ? radio.enabled : sounds.enabled} onClick={index === 1 ? radio.toggle : sounds.toggle} />
    <p className={styles.srOnly} id={hintId}>{index === 4 ? 'Draw with a pointer. Enter adds a stroke. Delete clears the sand.' : index === 1 || index === 3 ? 'Drag the artwork to adjust it. Arrow keys make small adjustments; Home and End reach either edge.' : 'Tap or use Tab and Enter to play with the illustration.'}</p>
    <p aria-live="polite" className={styles.srOnly}>{status}</p>
  </div>
}
