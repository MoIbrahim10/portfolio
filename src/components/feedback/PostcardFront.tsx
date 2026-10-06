import styles from './PostcardFront.module.css'

function Miniature({ scene }: { scene: number }) {
  return <svg viewBox="0 0 240 160" fill="none" aria-hidden="true">
    <rect width="240" height="160" fill={scene === 0 || scene === 3 ? 'var(--navy)' : 'var(--beige)'} />
    {scene === 0 ? <>
      <g className={styles.doorSun}><circle cx="170" cy="51" r="29" fill="var(--gold)" /></g>
      <path d="M51 160V64h19V45h20V25h58v20h20v19h19v96Z" fill="var(--red)" />
      <path d="M79 160V82h19V63h41v19h19v78Z" fill="var(--paper)" />
      <path d="M102 160V98h33v62Z" fill="var(--gold)" />
      <g className={styles.doorLeaf}><path d="M102 160V98h33v62Z" fill="var(--navy)" /></g>
    </> : scene === 1 ? <>
      <g className={styles.palmSun}><circle cx="94" cy="70" r="46" fill="var(--gold)" /></g>
      <path d="M130 160c-8-38-7-69 3-100" stroke="var(--navy)" strokeWidth="5" />
      <g className={styles.palmFronds}><path d="M133 64c-28-32-57-26-66-11 30-4 48 1 66 11Zm0 0c-4-38 11-53 30-53-15 19-26 37-30 53Zm0 0c26-26 56-23 68-7-28-2-48 2-68 7Zm0 0c26-6 42 6 45 24-18-11-31-18-45-24Zm0 0c-24-3-42 13-46 28 18-16 31-23 46-28Z" fill="var(--navy)" /></g>
      <path d="M0 146h240" stroke="var(--red)" strokeWidth="2" />
    </> : scene === 2 ? <>
      <path d="M0 82h240v78H0Z" fill="var(--navy)" />
      <g className={styles.sailboat}>
        <path d="m85 109 68-91v91Z" fill="var(--red)" />
        <path d="m163 108-6-65 38 65Z" fill="var(--gold)" />
        <path d="M153 18v104m-83-8h128l-19 13H91Z" stroke="var(--paper)" strokeWidth="2" fill="var(--paper)" />
      </g>
      <g className={styles.water}><path d="M28 141h89m36 9h57M19 99h44" stroke="var(--paper)" strokeWidth="1" /></g>
    </> : <>
      <g className={styles.moon}><circle cx="167" cy="56" r="37" fill="var(--gold)" /><circle className={styles.moonShade} cx="167" cy="56" r="37" fill="var(--navy)" /></g>
      <path d="M0 123h27V97h26V75h23V54h18v21h22v42h27V95h24v16h29V89h20v34h24v37H0Z" fill="var(--red)" />
      <path d="M0 138h240v22H0Z" fill="var(--navy)" />
      <path d="M73 149h145m-100 7h71" stroke="var(--paper)" strokeWidth=".8" />
      <g className={styles.nightStars}><path d="M33 25h5v5h-5Zm79-9h3v3h-3Z" fill="var(--paper)" /></g>
    </>}
  </svg>
}

export function PostcardFront() {
  return <div className={styles.surface} data-postcard-front role="group" aria-label="Four Cairo scenes beneath the MO mark">
    <div className={styles.frames}>
      <div className={styles.framesMark}><img className={styles.mark} src="/brand/mo-mark-v3.svg" alt="" width="790" height="480" draggable={false} /></div>
      <div className={styles.miniatures}>
        {['The doorway', 'The palm', 'The felucca', 'Moonlight over Cairo'].map((label, scene) => <div className={styles.miniature} key={label} data-scene={scene} role="img" aria-label={label} tabIndex={0}><Miniature scene={scene} /></div>)}
      </div>
      <span className={styles.perforatedEdge} aria-hidden="true" />
    </div>
  </div>
}
