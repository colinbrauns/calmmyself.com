"use client"

import { useEffect, useRef, useState } from 'react'
import { Button } from '@/components/ui/Button'
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/Card'
import { Music2, Play, Pause } from 'lucide-react'
import { motion } from 'framer-motion'
import ShareInline from '@/components/ShareInline'

type Preset = { id: string; name: string; hz: number; note?: string }

const PRESETS: Preset[] = [
  { id: '174', name: '174 Hz – Relax', hz: 174 },
  { id: '396', name: '396 Hz – Release', hz: 396 },
  { id: '432', name: '432 Hz – Soothing', hz: 432 },
  { id: '528', name: '528 Hz – Bright', hz: 528 },
  { id: '639', name: '639 Hz – Warm', hz: 639 },
]

export default function SoundFrequencies() {
  const [isPlaying, setIsPlaying] = useState(false)
  const [selected, setSelected] = useState<Preset>(PRESETS[2])
  const [volume, setVolume] = useState(0.08)

  const audioCtxRef = useRef<AudioContext | null>(null)
  const oscRef = useRef<OscillatorNode | null>(null)
  const gainRef = useRef<GainNode | null>(null)

  useEffect(() => {
    return () => {
      stopTone(true)
    }
  }, [])

  const startTone = async () => {
    if (typeof window === 'undefined') return
    const AudioCtx = (window as any).AudioContext || (window as any).webkitAudioContext
    if (!AudioCtx) return
    if (!audioCtxRef.current) audioCtxRef.current = new AudioCtx()
    const ctx = audioCtxRef.current
    if (!ctx) return

    stopTone(true)
    const osc = ctx.createOscillator()
    const gain = ctx.createGain()
    osc.frequency.value = selected.hz
    osc.type = 'sine'
    gain.gain.value = 0
    osc.connect(gain)
    gain.connect(ctx.destination)
    osc.start()
    // fade in
    gain.gain.linearRampToValueAtTime(volume, ctx.currentTime + 0.6)
    ctx.resume?.()
    oscRef.current = osc
    gainRef.current = gain
    setIsPlaying(true)
  }

  const stopTone = (immediate = false) => {
    const ctx = audioCtxRef.current
    const osc = oscRef.current
    const gain = gainRef.current
    if (ctx && osc && gain) {
      if (immediate) {
        try { osc.stop(); } catch {}
      } else {
        gain.gain.cancelScheduledValues(ctx.currentTime)
        gain.gain.linearRampToValueAtTime(0, ctx.currentTime + 0.6)
        setTimeout(() => { try { osc.stop() } catch {} }, 650)
      }
    }
    oscRef.current = null
    gainRef.current = null
    setIsPlaying(false)
  }

  const toggle = () => {
    if (isPlaying) stopTone()
    else startTone()
  }

  const onChangePreset = (p: Preset) => {
    setSelected(p)
    if (isPlaying) startTone()
  }

  const onChangeVolume = (v: number) => {
    setVolume(v)
    const gain = gainRef.current
    if (gain && audioCtxRef.current) {
      gain.gain.linearRampToValueAtTime(v, audioCtxRef.current.currentTime + 0.1)
    }
  }

  return (
    <Card className="max-w-md mx-auto">
      <CardHeader className="text-center">
        <div className="flex items-center justify-center gap-2 mb-2">
          <Music2 className="w-5 h-5 text-grounding-600" />
          <CardTitle>Calming Sounds</CardTitle>
        </div>
        <CardDescription>Generate gentle tones with smooth fade in/out</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="grid grid-cols-2 gap-2">
          {PRESETS.map((p) => (
            <Button key={p.id} onClick={() => onChangePreset(p)} variant={selected.id === p.id ? 'grounding' : 'outline'} className="truncate">
              {p.name}
            </Button>
          ))}
        </div>

        <div className="flex items-center gap-3">
          <Button onClick={toggle} variant="grounding" size="lg" className="flex items-center gap-2">
            {isPlaying ? <Pause size={18}/> : <Play size={18}/>} {isPlaying ? 'Pause' : 'Play'}
          </Button>
          <div className="flex-1">
            <label className="text-xs text-gray-600">Volume</label>
            <input
              type="range"
              min={0}
              max={0.25}
              step={0.005}
              value={volume}
              onChange={(e) => onChangeVolume(Number(e.target.value))}
              className="w-full"
            />
          </div>
        </div>

        <div className="text-xs text-gray-500 bg-yellow-50 border border-yellow-200 p-3 rounded-md">
          These tones are gentle aids; listen at low volume. Evidence for specific “healing frequencies” varies—use what feels pleasant and calming to you.
        </div>

        <div className="relative h-16 overflow-hidden rounded-md bg-gradient-to-r from-grounding-50 to-calm-50">
          <motion.div
            className="absolute inset-0 opacity-70"
            initial={{ x: '-100%' }}
            animate={{ x: '100%' }}
            transition={{ duration: 6, repeat: Infinity, ease: 'linear' }}
            style={{ background: 'radial-gradient(60px 12px at 30% 50%, rgba(245,158,11,0.25), transparent 60%)' }}
          />
        </div>
      </CardContent>
      <div className="px-6 pb-6 space-y-3">
        <div className="text-xs text-gray-600 bg-grounding-50 border border-grounding-100 p-3 rounded-md">
          About: Simple tones can be soothing for some people. Evidence for specific frequency effects varies; listen at low volume and use what feels calming.
        </div>
        <ShareInline title="Calming Sounds" text="Generate calming tones on CalmMyself" />
      </div>
    </Card>
  )
}
