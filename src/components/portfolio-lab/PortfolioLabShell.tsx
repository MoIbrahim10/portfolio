import { useEffect, useMemo, useState } from 'react'
import type { ComponentType } from 'react'

import styles from './PortfolioLabShell.module.css'

export interface PortfolioLabVersion {
  Component: ComponentType
  id: string
  label: string
}

interface PortfolioLabShellProps {
  versions: PortfolioLabVersion[]
}

export function PortfolioLabShell({ versions }: PortfolioLabShellProps) {
  const [activeId, setActiveId] = useState(versions[0]?.id ?? '')
  const activeIndex = Math.max(0, versions.findIndex((version) => version.id === activeId))
  const activeVersion = versions[activeIndex]

  useEffect(() => {
    const versionId = new URLSearchParams(window.location.search).get('v')
    if (versionId && versions.some((version) => version.id === versionId)) {
      setActiveId(versionId)
    }
  }, [versions])

  const changeVersion = useMemo(
    () => (nextIndex: number) => {
      const nextVersion = versions[(nextIndex + versions.length) % versions.length]
      if (!nextVersion) return

      setActiveId(nextVersion.id)
      const url = new URL(window.location.href)
      url.searchParams.set('v', nextVersion.id)
      window.history.replaceState({}, '', url)
      window.scrollTo({ behavior: 'instant', top: 0 })
    },
    [versions],
  )

  if (!activeVersion) return null

  const ActiveComponent = activeVersion.Component

  return (
    <div className={styles.shell}>
      <ActiveComponent key={activeVersion.id} />
      <nav aria-label="Portfolio direction selector" className={styles.switcher}>
        <button
          aria-label="Previous portfolio direction"
          className={styles.control}
          onClick={() => changeVersion(activeIndex - 1)}
          type="button"
        >
          ←
        </button>
        <span className={styles.label} aria-live="polite">
          <span className={styles.eyebrow}>Portfolio laboratory · {activeIndex + 1}/10</span>
          <span className={styles.name}>{activeVersion.label}</span>
        </span>
        <select
          aria-label="Choose portfolio direction"
          className={styles.select}
          onChange={(event) => changeVersion(Number(event.target.value))}
          value={activeIndex}
        >
          {versions.map((version, index) => (
            <option key={version.id} value={index}>
              {String(index + 1).padStart(2, '0')} · {version.label}
            </option>
          ))}
        </select>
        <button
          aria-label="Next portfolio direction"
          className={styles.control}
          onClick={() => changeVersion(activeIndex + 1)}
          type="button"
        >
          →
        </button>
      </nav>
    </div>
  )
}
