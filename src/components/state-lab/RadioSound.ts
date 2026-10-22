import { useCallback, useEffect, useRef, useState } from 'react'

import duneMusic from './audio/local-forecast.mp3?inline'
import solarMusic from './audio/dream-culture.mp3?inline'
import futureMusic from './audio/carefree.mp3?inline'

export const RADIO_STATIONS = [
  { value: 22, name: 'Dune FM', frequency: '92.4', format: 'lounge jazz', music: duneMusic, title: 'Local Forecast – Elevator', source: 'https://commons.wikimedia.org/wiki/File:Local_Forecast_-_Elevator_(ISRC_USUAN1300012).mp3' },
  { value: 56, name: 'Solar Radio', frequency: '99.2', format: 'piano lounge', music: solarMusic, title: 'Dream Culture', source: 'https://commons.wikimedia.org/wiki/File:Kevin_MacLeod_-_Dream_Culture.ogg' },
  { value: 84, name: 'Future FM', frequency: '104.8', format: 'acoustic pop', music: futureMusic, title: 'Carefree', source: 'https://commons.wikimedia.org/wiki/File:Kevin_MacLeod_-_Carefree.ogg' },
]

export function radioStation(value: number) {
  return RADIO_STATIONS.find(station => Math.abs(value - station.value) < 3)
}

interface RadioAudio {
  context: AudioContext
  staticGain: GainNode
  channels: GainNode[]
  speaker: BiquadFilterNode
  master: GainNode
  analyser: AnalyserNode
  samples: Float32Array<ArrayBuffer>
}

// Licensed recordings are bundled so tuning never needs a live stream.
function stationBuffer(context: AudioContext, music: AudioBuffer) {
  const buffer = context.createBuffer(1, music.length, music.sampleRate)
  const samples = buffer.getChannelData(0)
  samples.set(music.getChannelData(0))
  const fade = Math.round(music.sampleRate * 0.12)
  for (let i = 0; i < fade; i++) {
    samples[i] *= i / fade
    samples[samples.length - i - 1] *= i / fade
  }
  return buffer
}

function tune(audio: RadioAudio, value: number) {
  const strengths = RADIO_STATIONS.map(station => Math.exp(-((value - station.value) ** 2) / 7))
  const clarity = Math.max(...strengths)
  const now = audio.context.currentTime
  audio.staticGain.gain.setTargetAtTime(0.0002 + (1 - clarity) * 0.018, now, 0.035)
  audio.channels.forEach((gain, i) => gain.gain.setTargetAtTime(strengths[i] * 0.7, now, 0.035))
  audio.speaker.frequency.setTargetAtTime(2000 + clarity * 5800, now, 0.035)
}

function powerClick(context: AudioContext, on: boolean) {
  const buffer = context.createBuffer(1, Math.ceil(context.sampleRate * 0.045), context.sampleRate)
  const samples = buffer.getChannelData(0)
  let contact = 0
  for (let i = 0; i < samples.length; i++) {
    const time = i / context.sampleRate
    contact += ((Math.random() * 2 - 1) - contact) * 0.65
    const strike = Math.exp(-time / 0.0015) + 0.3 * Math.exp(-Math.abs(time - (on ? 0.012 : 0.008)) / 0.001)
    samples[i] = contact * strike * 0.12 + Math.sin(time * 2 * Math.PI * (on ? 170 : 130)) * Math.exp(-time / 0.008) * 0.025
  }
  const source = context.createBufferSource()
  source.buffer = buffer
  source.connect(context.destination)
  source.start()
  source.onended = () => source.disconnect()
}

export function useRadioSound(value: number) {
  const [enabled, setEnabled] = useState(false)
  const [error, setError] = useState('')
  const audio = useRef<RadioAudio | null>(null)
  const latestValue = useRef(value)
  const closing = useRef(new Map<AudioContext, ReturnType<typeof setTimeout>>())
  const readLevel = useCallback(() => {
    const radio = audio.current
    if (!radio || radio.context.state !== 'running') return 0
    radio.analyser.getFloatTimeDomainData(radio.samples)
    return Math.min(1, Math.sqrt(radio.samples.reduce((sum, sample) => sum + sample * sample, 0) / radio.samples.length) * 8)
  }, [])

  useEffect(() => { latestValue.current = value; if (audio.current) tune(audio.current, value) }, [value])
  useEffect(() => () => {
    if (audio.current) { void audio.current.context.close(); audio.current = null }
    closing.current.forEach((timer, context) => { clearTimeout(timer); void context.close() })
    closing.current.clear()
  }, [])

  function toggle() {
    const current = audio.current
    if (current) {
      audio.current = null
      setEnabled(false)
      const now = current.context.currentTime
      current.master.gain.cancelScheduledValues(now)
      current.master.gain.setValueAtTime(current.master.gain.value, now)
      current.master.gain.linearRampToValueAtTime(0, now + 0.06)
      powerClick(current.context, false)
      const timer = setTimeout(() => { void current.context.close(); closing.current.delete(current.context) }, 90)
      closing.current.set(current.context, timer)
      return
    }

    const context = new AudioContext()
    const staticGain = context.createGain()
    staticGain.gain.value = 0
    const staticFilter = context.createBiquadFilter()
    staticFilter.type = 'bandpass'
    staticFilter.frequency.value = 1800
    staticFilter.Q.value = 0.45
    const lowCut = context.createBiquadFilter()
    lowCut.type = 'highpass'
    lowCut.frequency.value = 85
    const speaker = context.createBiquadFilter()
    speaker.type = 'lowpass'
    speaker.Q.value = 0.7
    const master = context.createGain()
    master.gain.value = 0
    const analyser = context.createAnalyser()
    analyser.fftSize = 256
    staticGain.connect(lowCut)
    lowCut.connect(speaker).connect(master).connect(analyser).connect(context.destination)
    const channels = RADIO_STATIONS.map(() => { const gain = context.createGain(); gain.gain.value = 0; gain.connect(lowCut); return gain })
    const radio = { context, staticGain, channels, speaker, master, analyser, samples: new Float32Array(analyser.fftSize) }
    audio.current = radio
    setError('')
    setEnabled(true)
    tune(radio, value)
    void context.resume().then(async () => {
      if (audio.current !== radio) return
      powerClick(context, true)
      const noise = context.createBufferSource()
      const staticBuffer = context.createBuffer(1, 22050 * 2, 22050)
      const samples = staticBuffer.getChannelData(0)
      for (let i = 0; i < samples.length; i++) samples[i] = Math.random() * 2 - 1
      noise.buffer = staticBuffer
      noise.loop = true
      noise.connect(staticFilter).connect(staticGain)
      noise.start()
      master.gain.linearRampToValueAtTime(1, context.currentTime + 0.12)
      const decode = (asset: string) => context.decodeAudioData(Uint8Array.from(atob(asset.split(',')[1]), character => character.charCodeAt(0)).buffer)
      const programmes = await Promise.all(RADIO_STATIONS.map(station => decode(station.music)))
      if (audio.current !== radio) return
      programmes.forEach((music, i) => {
        const source = context.createBufferSource()
        source.buffer = stationBuffer(context, music)
        source.loop = true
        source.connect(channels[i])
        source.start()
      })
      tune(radio, latestValue.current)
    }).catch(() => {
      if (audio.current !== radio) return
      audio.current = null
      setEnabled(false)
      setError('The radio couldn’t start. Try switching it on again.')
      void context.close()
    })
  }

  return { enabled, toggle, readLevel, error }
}
