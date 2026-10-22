import { CompassScene, DoorwayScene } from './Spatial404Artwork'
import { OfflineScene } from './OfflineArtwork'
import { ErrorScene } from './ErrorArtwork'
import type { StateKind } from './state-concepts'
import styles from './StateExplorationLab.module.css'

export function StateArtwork({ kind, index }: { kind: StateKind; index: number }) {
  return <svg aria-hidden="true" className={styles.scene} focusable="false" viewBox="0 0 520 400">
    {kind === '404' ? index === 0 ? <DoorwayScene /> : <CompassScene />
      : kind === 'offline' ? <OfflineScene index={index} />
      : <g transform="translate(-26 -9) scale(0.95)"><ErrorScene index={index} /></g>}
  </svg>
}
