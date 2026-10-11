import { useEffect, useRef, useState } from 'react'

interface RadioAudio {
  context: AudioContext
  staticGain: GainNode
  musicGain: GainNode
  speaker: BiquadFilterNode
}

// A small original instrumental, generated locally so the radio works offline.
function musicBuffer(context: AudioContext) {
  const rate = 22050
  const beat = 0.625
  const buffer = context.createBuffer(1, rate * beat * 32, rate)
  const samples = buffer.getChannelData(0)
  const chords = [[57, 60, 64, 67], [53, 57, 60, 64], [55, 59, 62, 65], [52, 55, 59, 62]]
  const melody = [76, 79, 76, 72, 74, 76, 72, 69, 71, 74, 77, 74, 71, 72, 76, 71]

  function note(midi: number, start: number, duration: number, level: number, bass = false) {
    const frequency = 440 * 2 ** ((midi - 69) / 12)
    const first = Math.round(start * rate)
    for (let i = 0; i < duration * rate; i++) {
      const time = i / rate
      const phase = 2 * Math.PI * frequency * time
      const attack = Math.min(1, time / (bass ? 0.008 : 0.018))
      const release = Math.min(1, (duration - time) / 0.09)
      const envelope = attack * release * Math.exp(-time * (bass ? 3.5 : 2.2))
      const tone = bass
        ? Math.sin(phase) + 0.2 * Math.sin(phase * 2)
        : Math.sin(phase) + 0.32 * Math.sin(phase * 2 + 0.1) + 0.12 * Math.sin(phase * 3) + 0.05 * Math.sin(phase * 4)
      samples[(first + i) % samples.length] += tone * envelope * level
    }
  }

  for (let bar = 0; bar < 8; bar++) {
    const chord = chords[bar % chords.length]
    for (const offset of [0, 1.5, 2.75]) chord.forEach((pitch, i) => note(pitch, (bar * 4 + offset) * beat + i * 0.013, 1.2, 0.065))
    note(chord[0] - 12, bar * 4 * beat, 0.55, 0.25, true)
    note(chord[0] - 5, (bar * 4 + 2) * beat, 0.55, 0.2, true)
    note(melody[bar * 2], (bar * 4 + 0.5) * beat, 0.9, 0.18)
    note(melody[bar * 2 + 1], (bar * 4 + 2.5) * beat, 0.75, 0.15)
    for (let eighth = 0; eighth < 8; eighth++) {
      const first = Math.round((bar * 4 + eighth / 2) * beat * rate)
      for (let i = 0; i < rate * 0.06; i++) samples[first + i] += (Math.random() * 2 - 1) * Math.exp(-i / (rate * 0.012)) * (eighth % 2 ? 0.025 : 0.045)
    }
  }
  return buffer
}

function tune(audio: RadioAudio, value: number) {
  const clarity = Math.exp(-((value - 56) ** 2) / 28)
  const now = audio.context.currentTime
  audio.staticGain.gain.setTargetAtTime(0.003 + (1 - clarity) * 0.065, now, 0.045)
  audio.musicGain.gain.setTargetAtTime(clarity * 0.32, now, 0.045)
  audio.speaker.frequency.setTargetAtTime(1200 + clarity * 2000, now, 0.045)
}

export function useRadioSound(value: number) {
  const [enabled, setEnabled] = useState(false)
  const audio = useRef<RadioAudio | null>(null)

  useEffect(() => { if (audio.current) tune(audio.current, value) }, [value])
  useEffect(() => () => { if (audio.current) void audio.current.context.close() }, [])

  function toggle() {
    if (audio.current) {
      void audio.current.context.close()
      audio.current = null
      setEnabled(false)
      return
    }

    const context = new AudioContext()
    const noise = context.createBufferSource()
    const staticBuffer = context.createBuffer(1, 22050 * 2, 22050)
    const samples = staticBuffer.getChannelData(0)
    for (let i = 0; i < samples.length; i++) samples[i] = Math.random() * 2 - 1
    noise.buffer = staticBuffer
    noise.loop = true
    const staticFilter = context.createBiquadFilter()
    staticFilter.type = 'bandpass'
    staticFilter.frequency.value = 1800
    staticFilter.Q.value = 0.45
    const staticGain = context.createGain()
    staticGain.gain.value = 0
    noise.connect(staticFilter).connect(staticGain)

    const music = context.createBufferSource()
    music.buffer = musicBuffer(context)
    music.loop = true
    const musicGain = context.createGain()
    musicGain.gain.value = 0
    music.connect(musicGain)

    const lowCut = context.createBiquadFilter()
    lowCut.type = 'highpass'
    lowCut.frequency.value = 130
    const speaker = context.createBiquadFilter()
    speaker.type = 'lowpass'
    speaker.Q.value = 0.7
    staticGain.connect(lowCut)
    musicGain.connect(lowCut)
    lowCut.connect(speaker).connect(context.destination)

    const radio = { context, staticGain, musicGain, speaker }
    audio.current = radio
    setEnabled(true)
    tune(radio, value)
    void context.resume().then(() => {
      if (audio.current !== radio) return
      noise.start()
      music.start()
    })
  }

  return { enabled, toggle }
}
