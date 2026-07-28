import type { ChangeEvent, CSSProperties, KeyboardEvent } from 'react'
import { useEffect, useRef, useState } from 'react'

import styles from './VideoPlayerLab.module.css'

const VARIANTS = [
  {
    id: 'clean',
    name: 'Clean Line',
    note: 'A single gold line advances without secondary motion.',
  },
  {
    id: 'ticks',
    name: 'Frame Ticks',
    note: 'Quiet frame marks fill as the video moves forward.',
  },
  {
    id: 'marker',
    name: 'Red Marker',
    note: 'A restrained red playhead follows a thin gold track.',
  },
  {
    id: 'segments',
    name: 'Quiet Segments',
    note: 'Measured blocks make progress easy to scan.',
  },
  {
    id: 'dual',
    name: 'Dual Track',
    note: 'Two fine rails advance together in gold and red.',
  },
  {
    id: 'negative',
    name: 'Negative Reveal',
    note: 'The strip inverts as each section is developed.',
  },
  {
    id: 'fade',
    name: 'Soft Exposure',
    note: 'A soft edge gives the progress line a gentle finish.',
  },
  {
    id: 'frames',
    name: 'Frame Count',
    note: 'Small film cells reveal one continuous timeline.',
  },
  {
    id: 'center',
    name: 'Center Guide',
    note: 'A narrow line sits quietly inside the film channel.',
  },
  {
    id: 'slate',
    name: 'Slate Cut',
    note: 'Sparse gold edit marks punctuate a navy strip.',
  },
] as const

type PlayerVariant = (typeof VARIANTS)[number]

function formatTime(value: number) {
  if (!Number.isFinite(value)) return '0:00'
  const minutes = Math.floor(value / 60)
  const seconds = Math.floor(value % 60)
  return `${minutes}:${seconds.toString().padStart(2, '0')}`
}

function PreviewPlayer({ variant }: { variant: PlayerVariant }) {
  const [currentTime, setCurrentTime] = useState(0)
  const [duration, setDuration] = useState(0)
  const [playing, setPlaying] = useState(false)
  const [ready, setReady] = useState(false)
  const videoRef = useRef<HTMLVideoElement>(null)
  const progress = duration > 0 ? (currentTime / duration) * 100 : 0

  useEffect(() => {
    const video = videoRef.current
    if (!video) return

    setReady(video.readyState >= HTMLMediaElement.HAVE_CURRENT_DATA)
    setPlaying(!video.paused)
    setCurrentTime(video.currentTime)
    if (Number.isFinite(video.duration)) setDuration(video.duration)
  }, [variant.id])

  function togglePlayback() {
    const video = videoRef.current
    if (!video) return

    if (video.paused) {
      void video.play().catch(() => setPlaying(false))
    } else {
      video.pause()
    }
  }

  function seek(event: ChangeEvent<HTMLInputElement>) {
    const video = videoRef.current
    if (!video) return
    const nextTime = Number(event.currentTarget.value)
    video.currentTime = nextTime
    setCurrentTime(nextTime)
  }

  return (
    <section
      aria-label={`${variant.name} video player`}
      className={styles.player}
      data-playing={playing || undefined}
      data-ready={ready || undefined}
      data-variant={variant.id}
      id="active-player"
      style={
        {
          '--progress': `${progress}%`,
          '--progress-ratio': progress / 100,
        } as CSSProperties
      }
    >
      <picture aria-hidden="true" className={styles.poster}>
        <source
          srcSet="/portfolio/projects/orgo/overview.webp"
          type="image/webp"
        />
        <img alt="" src="/portfolio/projects/orgo/overview.png" />
      </picture>
      <video
        autoPlay
        className={styles.video}
        loop
        muted
        onDurationChange={(event) => setDuration(event.currentTarget.duration)}
        onError={() => {
          setPlaying(false)
          setReady(false)
        }}
        onLoadedData={() => setReady(true)}
        onPause={() => setPlaying(false)}
        onPlaying={() => setPlaying(true)}
        onTimeUpdate={(event) =>
          setCurrentTime(event.currentTarget.currentTime)
        }
        playsInline
        poster="/portfolio/projects/orgo/overview.webp"
        preload="auto"
        ref={videoRef}
        src="/portfolio/projects/orgo/walkthrough.mp4"
      />

      <div className={styles.frameLabel}>
        <span>{variant.name}</span>
        <span>Orgo / motion study</span>
      </div>

      <div className={styles.controls}>
        <button
          aria-label={playing ? 'Pause video' : 'Play video'}
          className={styles.playButton}
          onClick={togglePlayback}
          type="button"
        >
          {playing ? (
            <svg aria-hidden="true" viewBox="0 0 24 24">
              <path d="M7 5h3v14H7zm7 0h3v14h-3z" />
            </svg>
          ) : (
            <svg aria-hidden="true" viewBox="0 0 24 24">
              <path d="m8 5 11 7-11 7z" />
            </svg>
          )}
        </button>

        <div className={styles.progressShell}>
          <span aria-hidden="true" className={styles.progressTrack}>
            <span className={styles.progressFill} />
          </span>
          <input
            aria-label="Video progress"
            max={duration || 0}
            min={0}
            onChange={seek}
            step="0.01"
            type="range"
            value={Math.min(currentTime, duration || 0)}
          />
        </div>

        <span className={styles.time}>
          {formatTime(currentTime)} <i>/</i> {formatTime(duration)}
        </span>
      </div>
    </section>
  )
}

export function VideoPlayerLab() {
  const [activeIndex, setActiveIndex] = useState(7)
  const activeVariant = VARIANTS[activeIndex] ?? VARIANTS[0]

  function handleTabKey(
    event: KeyboardEvent<HTMLButtonElement>,
    index: number,
  ) {
    const offset =
      event.key === 'ArrowRight' || event.key === 'ArrowDown'
        ? 1
        : event.key === 'ArrowLeft' || event.key === 'ArrowUp'
          ? -1
          : 0

    if (!offset) return
    event.preventDefault()
    const nextIndex = (index + offset + VARIANTS.length) % VARIANTS.length
    setActiveIndex(nextIndex)
    document.getElementById(`player-tab-${nextIndex}`)?.focus()
  }

  return (
    <main className={styles.page}>
      <header className={styles.header}>
        <a aria-label="Back to portfolio" className={styles.logoLink} href="/">
          <img alt="" src="/brand/mo-mark-v3.svg" />
        </a>
        <div>
          <p>Film Strip laboratory</p>
          <h1>Ten cuts of one film.</h1>
        </div>
        <p className={styles.intro}>
          The player stays fixed while the progress motion changes. Hover the
          film, press play, and choose the rhythm that feels right.
        </p>
      </header>

      <nav aria-label="Video player directions" className={styles.variantNav}>
        <div role="tablist">
          {VARIANTS.map((variant, index) => (
            <button
              aria-controls="active-player"
              aria-selected={activeIndex === index}
              id={`player-tab-${index}`}
              key={variant.id}
              onClick={() => setActiveIndex(index)}
              onKeyDown={(event) => handleTabKey(event, index)}
              role="tab"
              tabIndex={activeIndex === index ? 0 : -1}
              type="button"
            >
              <span>{variant.name}</span>
              <small>{variant.note}</small>
            </button>
          ))}
        </div>
      </nav>

      <div className={styles.preview}>
        <PreviewPlayer variant={activeVariant} />
        <footer>
          <p>{activeVariant.name}</p>
          <span>{activeVariant.note}</span>
        </footer>
      </div>
    </main>
  )
}
