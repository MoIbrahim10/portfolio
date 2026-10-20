import { useId } from 'react'
import type { PortfolioCollection } from './portfolio-data'
import styles from './CollectionSwitch.module.css'

export function CollectionSwitch({
  collection,
  instant,
  onChange,
}: {
  collection: PortfolioCollection
  instant: boolean
  onChange: (collection: PortfolioCollection, keyboard: boolean) => void
}) {
  const labelId = useId()

  return (
    <div
      aria-labelledby={labelId}
      className={styles.switch}
      data-collection={collection}
      data-instant={instant}
      role="group"
    >
      <span className={styles.label} id={labelId}>Portfolio collection</span>
      <span aria-hidden="true" className={styles.face}>
        <span className={styles.grip} />
      </span>
      {(['work', 'playground'] as const).map((value) => (
        <button
          aria-controls={`portfolio-${value}`}
          aria-pressed={collection === value}
          key={value}
          onClick={(event) => onChange(value, event.detail === 0)}
          type="button"
        >
          {value === 'work' ? 'Work' : 'Playground'}
        </button>
      ))}
    </div>
  )
}
