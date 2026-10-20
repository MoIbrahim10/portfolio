import { CrossAxisProjectRail } from './CrossAxisProjectRail'
import type { PortfolioCollection } from './portfolio-data'
import styles from './CrossAxisPresentationLab.module.css'

export function CrossAxisPresentationLab({
  collection = 'work',
  instant = false,
  onCollectionChange,
}: {
  collection?: PortfolioCollection
  instant?: boolean
  onCollectionChange: (collection: PortfolioCollection, keyboard: boolean) => void
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
            collectionInstant={instant}
            onCollectionChange={onCollectionChange}
            presentation="editorial"
          />
        </div>
      ))}
    </section>
  )
}
