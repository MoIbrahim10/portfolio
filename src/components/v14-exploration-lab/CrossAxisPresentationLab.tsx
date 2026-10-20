import { CrossAxisProjectRail } from './CrossAxisProjectRail'
import type { PortfolioCollection } from './portfolio-data'
import styles from './CrossAxisPresentationLab.module.css'

export function CrossAxisPresentationLab({
  collection = 'work',
  instant = false,
}: {
  collection?: PortfolioCollection
  instant?: boolean
}) {
  return (
    <section
      aria-label="Selected project work"
      className={styles.lab}
      data-instant={instant}
    >
      {(['work', 'playground'] as const).map((value) => (
        <div
          aria-hidden={collection !== value}
          className={styles.collection}
          data-active={collection === value}
          data-collection={value}
          id={`portfolio-${value}`}
          inert={collection !== value}
          key={value}
        >
          <CrossAxisProjectRail
            active={collection === value}
            collection={value}
            presentation="editorial"
          />
        </div>
      ))}
    </section>
  )
}
