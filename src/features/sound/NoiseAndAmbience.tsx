"use client"

import { useEffect, useRef, useState } from 'react'
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { Waves, Trees, CloudRain, Radio, Play, Pause } from 'lucide-react'
import ShareInline from '@/components/ShareInline'

type Mode = 'noise' | 'ambience'
type NoiseType = 'white' | 'pink' | 'brown' | 'blue' | 'violet'
type AmbienceType = 'ocean' | 'rain' | 'rainforest'

export default function NoiseAndAmbience() {
  const [mode, setMode] = useState<Mode>('noise')
  const [noise, setNoise] = useState<NoiseType>('pink')
  const [ambience, setAmbience] = useState<AmbienceType>('ocean')
  const [isPlaying, setIsPlaying] = useState(false)
  const [volume, setVolume] = useState(0.12)

  const ctxRef = useRef<AudioContext | null>(null)
  const mainGainRef = useRef<GainNode | null>(null)
  const srcRef = useRef<AudioNode | null>(null)
  const lfoNodesRef = useRef<{ osc?: OscillatorNode; gain?: GainNode } | null>(null)

  useEffect(() => () => stopAll(true), [])

  const ensureCtx = () => {
    if (typeof window === 'undefined') return null
    const AC = (window as any).AudioContext || (window as any).webkitAudioContext
    if (!AC) return null
    if (!ctxRef.current) {
      ctxRef.current = new AC()
    }
    if (ctxRef.current) {
      mainGainRef.current = ctxRef.current.createGain()
      mainGainRef.current.gain.value = 0
      mainGainRef.current.connect(ctxRef.current.destination)
    }
    return ctxRef.current
  }

  const stopAll = (immediate = false) => {
    const ctx = ctxRef.current
    const gain = mainGainRef.current
    if (ctx && gain) {
      gain.gain.cancelScheduledValues(ctx.currentTime)
      if (immediate) {
        gain.gain.value = 0
      } else {
        gain.gain.linearRampToValueAtTime(0, ctx.currentTime + 0.4)
      }
    }
    if (srcRef.current) {
      try {
        // Attempt stop on buffer source or oscillator
        ;(srcRef.current as any).stop?.()
        ;(srcRef.current as any).disconnect?.()
      } catch {}
      srcRef.current = null
    }
    if (lfoNodesRef.current) {
      try { lfoNodesRef.current.osc?.stop() } catch {}
      lfoNodesRef.current.gain?.disconnect()
      lfoNodesRef.current.osc?.disconnect()
      lfoNodesRef.current = null
    }
    setIsPlaying(false)
  }

  const start = async () => {
    const ctx = ensureCtx()
    if (!ctx || !mainGainRef.current) return
    stopAll(true)

    if (mode === 'noise') {
      buildNoise(ctx, noise)
    } else {
      buildAmbience(ctx, ambience)
    }

    ctx.resume?.()
    // fade in
    mainGainRef.current.gain.linearRampToValueAtTime(volume, ctx.currentTime + 0.5)
    setIsPlaying(true)
  }

  const buildNoise = (ctx: AudioContext, type: NoiseType) => {
    const bufferSize = 2 * ctx.sampleRate
    const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate)
    const data = buffer.getChannelData(0)
    for (let i = 0; i < bufferSize; i++) {
      data[i] = Math.random() * 2 - 1
    }
    let source: AudioNode = ctx.createBufferSource()
    ;(source as AudioBufferSourceNode).buffer = buffer
    ;(source as AudioBufferSourceNode).loop = true

    // Basic filtering to approximate different spectra
    const filter1 = ctx.createBiquadFilter()
    const filter2 = ctx.createBiquadFilter()
    filter1.type = 'lowshelf'
    filter2.type = 'highshelf'

    switch (type) {
      case 'white':
        filter1.gain.value = 0; filter2.gain.value = 0; break
      case 'pink':
        filter1.frequency.value = 200; filter1.gain.value = 6
        filter2.frequency.value = 4000; filter2.gain.value = -6
        break
      case 'brown':
        filter1.frequency.value = 300; filter1.gain.value = 12
        filter2.frequency.value = 3000; filter2.gain.value = -8
        break
      case 'blue':
        filter1.frequency.value = 400; filter1.gain.value = -8
        filter2.frequency.value = 4000; filter2.gain.value = 8
        break
      case 'violet':
        filter1.frequency.value = 800; filter1.gain.value = -12
        filter2.frequency.value = 6000; filter2.gain.value = 10
        break
    }

    source.connect(filter1)
    filter1.connect(filter2)
    filter2.connect(mainGainRef.current!)
    ;(source as AudioBufferSourceNode).start()
    srcRef.current = source
  }

  const buildAmbience = (ctx: AudioContext, type: AmbienceType) => {
    // Base noise source
    const bufferSize = 2 * ctx.sampleRate
    const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate)
    const data = buffer.getChannelData(0)
    for (let i = 0; i < bufferSize; i++) data[i] = Math.random() * 2 - 1
    const src = ctx.createBufferSource()
    src.buffer = buffer
    src.loop = true

    // Filter chain and LFO
    const filter = ctx.createBiquadFilter()
    const gain = ctx.createGain()
    gain.gain.value = 0

    const lfo = ctx.createOscillator()
    const lfoGain = ctx.createGain()

    if (type === 'ocean') {
      filter.type = 'lowpass'; filter.frequency.value = 800; filter.Q.value = 0.7
      lfo.frequency.value = 0.08; lfoGain.gain.value = 0.08 // slow swell
    } else if (type === 'rain') {
      filter.type = 'bandpass'; filter.frequency.value = 2000; filter.Q.value = 0.6
      lfo.frequency.value = 0.3; lfoGain.gain.value = 0.05
    } else { // rainforest
      filter.type = 'bandpass'; filter.frequency.value = 4000; filter.Q.value = 1
      lfo.frequency.value = 0.2; lfoGain.gain.value = 0.07
    }

    // Connect graph: noise -> filter -> gain -> main
    src.connect(filter)
    filter.connect(gain)
    gain.connect(mainGainRef.current!)

    // LFO on gain.gain
    lfo.connect(lfoGain)
    lfoGain.connect(gain.gain)
    lfo.start()
    src.start()

    srcRef.current = src
    lfoNodesRef.current = { osc: lfo, gain: lfoGain }

    // Fade to current volume
    gain.gain.linearRampToValueAtTime(1.0, ctx.currentTime + 0.8)
  }

  const toggle = () => (isPlaying ? stopAll() : start())

  const onChangeVolume = (v: number) => {
    setVolume(v)
    const ctx = ctxRef.current
    const gain = mainGainRef.current
    if (ctx && gain) gain.gain.linearRampToValueAtTime(v, ctx.currentTime + 0.1)
  }

  return (
    <Card className="max-w-md mx-auto">
      <CardHeader className="text-center">
        <div className="flex items-center justify-center gap-2 mb-2">
          <Radio className="w-5 h-5 text-grounding-600" />
          <CardTitle>Noise & Ambience</CardTitle>
        </div>
        <CardDescription>White/pink/brown/blue/violet noise and ocean/rain/rainforest</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="flex gap-2 justify-center">
          <Button variant={mode==='noise'?'grounding':'outline'} onClick={()=>setMode('noise')}>Noise</Button>
          <Button variant={mode==='ambience'?'grounding':'outline'} onClick={()=>setMode('ambience')}>Ambience</Button>
        </div>

        {mode === 'noise' ? (
          <div className="grid grid-cols-2 gap-2">
            {(['white','pink','brown','blue','violet'] as NoiseType[]).map((t)=> (
              <Button key={t} variant={noise===t?'grounding':'outline'} onClick={()=>{setNoise(t); if(isPlaying) start()}} className="capitalize">{t} noise</Button>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-3 gap-2">
            <Button variant={ambience==='ocean'?'grounding':'outline'} onClick={()=>{setAmbience('ocean'); if(isPlaying) start()}} className="flex items-center gap-2"><Waves size={16}/>Ocean</Button>
            <Button variant={ambience==='rain'?'grounding':'outline'} onClick={()=>{setAmbience('rain'); if(isPlaying) start()}} className="flex items-center gap-2"><CloudRain size={16}/>Rain</Button>
            <Button variant={ambience==='rainforest'?'grounding':'outline'} onClick={()=>{setAmbience('rainforest'); if(isPlaying) start()}} className="flex items-center gap-2"><Trees size={16}/>Rainforest</Button>
          </div>
        )}

        <div className="flex items-center gap-3">
          <Button onClick={toggle} variant="grounding" size="lg" className="flex items-center gap-2">
            {isPlaying ? <Pause size={18}/> : <Play size={18}/>} {isPlaying ? 'Pause' : 'Play'}
          </Button>
          <div className="flex-1">
            <label className="text-xs text-gray-600">Volume</label>
            <input type="range" min={0} max={0.3} step={0.005} value={volume} onChange={(e)=>onChangeVolume(Number(e.target.value))} className="w-full" />
          </div>
        </div>

        <div className="text-xs text-gray-600 bg-grounding-50 border border-grounding-100 p-3 rounded-md">
          Notes: Noise colors are approximations via simple filtering. Ambience is synthesized from noise with gentle modulation.
        </div>
      </CardContent>
      <div className="px-6 pb-6">
        <ShareInline title="Noise & Ambience" text="Play noise and nature ambience on CalmMyself" />
      </div>
    </Card>
  )
}

