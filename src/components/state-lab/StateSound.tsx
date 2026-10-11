import { useEffect, useRef, useState } from 'react'

import styles from './StateExplorationLab.module.css'

export function useStateSound() {
  const [enabled, setEnabled] = useState(false)
  const audio = useRef<AudioContext | null>(null)
  const sound = useRef(false)

  useEffect(() => () => { if (audio.current) void audio.current.close() }, [])

  function play(notes: number[], duration = 0.22, type: OscillatorType = 'sine') {
    const context = audio.current
    if (!sound.current || !context || context.state !== 'running') return
    notes.forEach((frequency, i) => {
      const startAt = context.currentTime + i * 0.065
      const oscillator = context.createOscillator()
      const gain = context.createGain()
      oscillator.type = type
      oscillator.frequency.setValueAtTime(frequency, startAt)
      gain.gain.setValueAtTime(0.0001, startAt)
      gain.gain.exponentialRampToValueAtTime(duration < 0.1 ? 0.012 : 0.025, startAt + 0.008)
      gain.gain.exponentialRampToValueAtTime(0.0001, startAt + duration)
      oscillator.connect(gain)
      gain.connect(context.destination)
      oscillator.start(startAt)
      oscillator.stop(startAt + duration + 0.02)
      oscillator.onended = () => { oscillator.disconnect(); gain.disconnect() }
    })
  }

  function toggle() {
    sound.current = !sound.current
    setEnabled(sound.current)
    if (!sound.current) {
      if (audio.current) void audio.current.close()
      audio.current = null
      return
    }
    const context = new AudioContext()
    audio.current = context
    void context.resume().then(() => { if (audio.current === context) play([880], 0.045) })
  }

  return { enabled, play, toggle }
}

export function SoundToggle({ enabled, onClick }: { enabled: boolean; onClick: () => void }) {
  return <button aria-label={enabled ? 'Mute sound' : 'Enable sound'} aria-pressed={enabled} className={styles.soundToggle} onClick={onClick} title={enabled ? 'Mute sound' : 'Enable sound'} type="button">
    <svg aria-hidden="true" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" viewBox="0 0 24 24"><path d="M11 5 6 9H3v6h3l5 4z" />{enabled ? <path d="M15 8q4 4 0 8M18 5q7 7 0 14" /> : <path d="m16 9 6 6m0-6-6 6" />}</svg>
  </button>
}
