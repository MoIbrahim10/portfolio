import { CrossAxisProjectRail } from './CrossAxisProjectRail'
import styles from './CrossAxisPresentationLab.module.css'

export function CrossAxisPresentationLab() {
  return (
    <section aria-label="Selected project work" className={styles.lab}>
      <CrossAxisProjectRail presentation="editorial" />
    </section>
  )
}
