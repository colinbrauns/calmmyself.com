"use client"

import { useEffect, useRef, useState } from 'react'
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { Waves, Trees, CloudRain, Radio, Play, Pause, Clock, CheckCircle2, RotateCcw, ArrowLeft } from 'lucide-react'
import { motion } from 'framer-motion'
import ShareInline from '@/components/ShareInline'

type Mode = 'noise' | 'ambience'
type NoiseType = 'white' | 'pink' | 'brown' | 'blue' | 'violet'
type AmbienceType = 'ocean' | 'rain' | 'rainforest'

const DURATION_OPTIONS = [
  { label: '2 min', seconds: 120 },
  { label: '5 min', seconds: 300 },
  { label: '10 min', seconds: 600 },
  { label: 'Free', seconds: 0 },
]

export default function NoiseAndAmbience() {
  const [mode, setMode] = useState<Mode>('noise')
  const [noise, setNoise] = useState<NoiseType>('pink')
  const [ambience, setAmbience] = useState<AmbienceType>('ocean')
  const [isPlaying, setIsPlaying] = useState(false)
  const [volume, setVolume] = useState(0.12)
  const [duration, setDuration] = useState(300)
  const [elapsed, setElapsed] = useState(0)
  const [completed, setCompleted] = useState(false)

  const ctxRef = useRef<AudioContext | null>(null)
  const mainGainRef = useRef<GainNode | null>(null)
  const srcRef = useRef<AudioScheduledSourceNode | null>(null)
  const lfoNodesRef = useRef<{ osc?: OscillatorNode; gain?: GainNode } | null>(null)
  const timerRef = useRef<NodeJS.Timeout | null>(null)

  useEffect(() => {
    if (typeof window === 'undefined') return
    try {
      const raw = window.localStorage.getItem('calmmyself:sound-preferences')
      if (!raw) return
      const parsed = JSON.parse(raw)
      if (parsed.mode) setMode(parsed.mode)
      if (parsed.noise) setNoise(parsed.noise)
      if (parsed.ambience) setAmbience(parsed.ambience)
      if (typeof parsed.volume === 'number') setVolume(parsed.volume)
    } catch {}
  }, [])

  useEffect(() => {
    if (typeof window === 'undefined') return
    try { window.localStorage.setItem('calmmyself:sound-preferences', JSON.stringify({ mode, noise, ambience, volume })) } catch {}
  }, [mode, noise, ambience, volume])

  useEffect(() => () => { stopAll(true); if (timerRef.current) clearInterval(timerRef.current) }, [])

  useEffect(() => {
    if (isPlaying) {
      timerRef.current = setInterval(() => {
        setElapsed((e) => {
          const next = e + 1
          if (duration > 0 && next >= duration) {
            stopAll()
            setCompleted(true)
          }
          return next
        })
      }, 1000)
    } else {
      if (timerRef.current) { clearInterval(timerRef.current); timerRef.current = null }
    }
    return () => { if (timerRef.current) clearInterval(timerRef.current) }
  }, [isPlaying, duration])

  const ensureCtx = () => {
    if (typeof window === 'undefined') return null
    type W = Window & { webkitAudioContext?: typeof AudioContext }
    const Ctor = (typeof AudioContext !== 'undefined' ? AudioContext : undefined) ?? (window as W).webkitAudioContext
    if (!Ctor) return null
    if (!ctxRef.current) {
      ctxRef.current = new Ctor()
      mainGainRef.current = ctxRef.current.createGain()
      mainGainRef.current.gain.value = 0
      mainGainRef.current.connect(ctxRef.current.destination)
    }
    return ctxRef.current
  }

  const stopAll = (immediate = false) => {
    const ctx = ctxRef.current; const gain = mainGainRef.current
    if (ctx && gain) {
      gain.gain.cancelScheduledValues(ctx.currentTime)
      if (immediate) gain.gain.value = 0
      else gain.gain.linearRampToValueAtTime(0, ctx.currentTime + 0.4)
    }
    if (srcRef.current) { try { srcRef.current.stop() } catch {} try { srcRef.current.disconnect() } catch {} srcRef.current = null }
    if (lfoNodesRef.current) { try { lfoNodesRef.current.osc?.stop() } catch {} lfoNodesRef.current.gain?.disconnect(); lfoNodesRef.current.osc?.disconnect(); lfoNodesRef.current = null }
    setIsPlaying(false)
  }

  const start = async () => {
    const ctx = ensureCtx()
    if (!ctx || !mainGainRef.current) return
    stopAll(true)
    if (mode === 'noise') buildNoise(ctx, noise)
    else buildAmbience(ctx, ambience)
    ctx.resume?.()
    mainGainRef.current.gain.linearRampToValueAtTime(volume, ctx.currentTime + 0.5)
    setIsPlaying(true)
    setElapsed(0)
    setCompleted(false)
  }

  const buildNoise = (ctx: AudioContext, type: NoiseType) => {
    const buf = ctx.createBuffer(1, 2 * ctx.sampleRate, ctx.sampleRate)
    const d = buf.getChannelData(0)
    for (let i = 0; i < d.length; i++) d[i] = Math.random() * 2 - 1
    const src = ctx.createBufferSource(); src.buffer = buf; src.loop = true
    const f1 = ctx.createBiquadFilter(); const f2 = ctx.createBiquadFilter()
    f1.type = 'lowshelf'; f2.type = 'highshelf'
    switch (type) {
      case 'white': f1.gain.value = 0; f2.gain.value = 0; break
      case 'pink': f1.frequency.value = 200; f1.gain.value = 6; f2.frequency.value = 4000; f2.gain.value = -6; break
      case 'brown': f1.frequency.value = 300; f1.gain.value = 12; f2.frequency.value = 3000; f2.gain.value = -8; break
      case 'blue': f1.frequency.value = 400; f1.gain.value = -8; f2.frequency.value = 4000; f2.gain.value = 8; break
      case 'violet': f1.frequency.value = 800; f1.gain.value = -12; f2.frequency.value = 6000; f2.gain.value = 10; break
    }
    src.connect(f1); f1.connect(f2); f2.connect(mainGainRef.current!)
    src.start(); srcRef.current = src
  }

  const buildAmbience = (ctx: AudioContext, type: AmbienceType) => {
    const buf = ctx.createBuffer(1, 2 * ctx.sampleRate, ctx.sampleRate)
    const d = buf.getChannelData(0)
    for (let i = 0; i < d.length; i++) d[i] = Math.random() * 2 - 1
    const src = ctx.createBufferSource(); src.buffer = buf; src.loop = true
    const filter = ctx.createBiquadFilter(); const gain = ctx.createGain(); gain.gain.value = 0
    const lfo = ctx.createOscillator(); const lfoGain = ctx.createGain()
    if (type === 'ocean') { filter.type = 'lowpass'; filter.frequency.value = 800; lfo.frequency.value = 0.08; lfoGain.gain.value = 0.08 }
    else if (type === 'rain') { filter.type = 'bandpass'; filter.frequency.value = 2000; lfo.frequency.value = 0.3; lfoGain.gain.value = 0.05 }
    else { filter.type = 'bandpass'; filter.frequency.value = 4000; filter.Q.value = 1; lfo.frequency.value = 0.2; lfoGain.gain.value = 0.07 }
    src.connect(filter); filter.connect(gain); gain.connect(mainGainRef.current!)
    lfo.connect(lfoGain); lfoGain.connect(gain.gain); lfo.start(); src.start()
    srcRef.current = src; lfoNodesRef.current = { osc: lfo, gain: lfoGain }
    gain.gain.linearRampToValueAtTime(1.0, ctx.currentTime + 0.8)
  }

  const toggle = () => (isPlaying ? stopAll() : start())

  const onChangeVolume = (v: number) => {
    setVolume(v)
    const ctx = ctxRef.current; const gain = mainGainRef.current
    if (ctx && gain) gain.gain.linearRampToValueAtTime(v, ctx.currentTime + 0.1)
  }

  const formatTime = (s: number) => `${Math.floor(s / 60)}:${(s % 60).toString().padStart(2, '0')}`

  const reset = () => { stopAll(true); setElapsed(0); setCompleted(false) }

  if (completed) {
    return (
      <Card className="max-w-md mx-auto">
        <CardContent className="text-center py-10 space-y-5">
          <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: 'spring', bounce: 0.5 }}>
            <CheckCircle2 className="w-16 h-16 text-green-500 mx-auto" />
          </motion.div>
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
            <h3 className="text-xl font-semibold text-gray-800 dark:text-gray-100">Session complete \ud83c\udfb6</h3>
            <p className="text-gray-600 dark:text-gray-400 mt-2 text-sm">
              You listened for {formatTime(duration)}. Take a moment to notice how the quiet feels now.
            </p>
          </motion.div>
          <div className="flex gap-3 justify-center pt-2">
            <Button onClick={reset} variant="grounding" size="lg" className="gap-2">
              <RotateCcw size={16} /> Listen Again
            </Button>
            <Button onClick={() => window.history.back()} variant="outline" size="lg" className="gap-2">
              <ArrowLeft size={16} /> Back
            </Button>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="max-w-md mx-auto">
      <CardHeader className="text-center">
        <div className="flex items-center justify-center gap-2 mb-2">
          <Radio className="w-5 h-5 text-grounding-600" />
          <CardTitle>Noise & Ambience</CardTitle>
        </div>
        <CardDescription>White/pink/brown noise and nature soundscapes</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {!isPlaying && elapsed === 0 && (
          <div className="flex gap-2 justify-center flex-wrap">
            {DURATION_OPTIONS.map((d) => (
              <Button key={d.seconds} variant={duration === d.seconds ? 'grounding' : 'outline'} size="sm" onClick={() => setDuration(d.seconds)}>
                {d.label}
              </Button>
            ))}
          </div>
        )}

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
            <Button variant={ambience==='rainforest'?'grounding':'outline'} onClick={()=>{setAmbience('rainforest'); if(isPlaying) start()}} className="flex items-center gap-2"><Trees size={16}/>Forest</Button>
          </div>
        )}

        {isPlaying && (
          <div className="flex items-center justify-center gap-2 bg-green-50 dark:bg-green-950/30 rounded-xl p-3">
            <Clock size={16} className="text-green-600" />
            <span className="text-lg font-mono text-green-800 dark:text-green-200">
              {duration > 0 ? formatTime(duration - elapsed) : formatTime(elapsed)}
            </span>
          </div>
        )}

        {isPlaying && duration > 0 && (
          <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-1.5">
            <div className="bg-green-400 h-1.5 rounded-full transition-all" style={{ width: `${(elapsed / duration) * 100}%` }} />
          </div>
        )}

        <div className="flex items-center gap-3">
          <Button onClick={toggle} variant="grounding" size="lg" className="flex items-center gap-2">
            {isPlaying ? <Pause size={18}/> : <Play size={18}/>} {isPlaying ? 'Pause' : 'Play'}
          </Button>
          <div className="flex-1">
            <label className="text-xs text-gray-600 dark:text-gray-400">Volume</label>
            <input type="range" min={0} max={0.3} step={0.005} value={volume} onChange={(e)=>onChangeVolume(Number(e.target.value))} className="w-full" />
          </div>
        </div>
      </CardContent>
      <div className="px-6 pb-6 pt-0"><div className="pt-4 mt-2 border-t border-gray-100 dark:border-gray-800">
        <ShareInline title="Noise & Ambience" text="Play noise and nature ambience on CalmMyself" />
      </div></div>
    </Card>
  )
}
