"use client"

import { useEffect, useRef, useState } from 'react'
import { Button } from '@/components/ui/Button'
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/Card'
import { Music2, Play, Pause } from 'lucide-react'
import { motion } from 'framer-motion'
import ShareInline from '@/components/ShareInline'

type Preset = { id: string; name: string; hz: number; hue: number }

const PRESETS: Preset[] = [
  { id: '174', name: '174 Hz – Relax', hz: 174, hue: 30 },
  { id: '396', name: '396 Hz – Release', hz: 396, hue: 15 },
  { id: '432', name: '432 Hz – Soothing', hz: 432, hue: 38 },
  { id: '528', name: '528 Hz – Bright', hz: 528, hue: 45 },
  { id: '639', name: '639 Hz – Warm', hz: 639, hue: 22 },
]

export default function SoundFrequencies() {
  const [isPlaying, setIsPlaying] = useState(false)
  const [selected, setSelected] = useState<Preset>(PRESETS[2])
  const [volume, setVolume] = useState(0.08)

  const isPlayingRef = useRef(false)
  const audioCtxRef = useRef<AudioContext | null>(null)
  const oscRef = useRef<OscillatorNode | null>(null)
  const gainRef = useRef<GainNode | null>(null)
  const analyserRef = useRef<AnalyserNode | null>(null)
  const canvasRef = useRef<HTMLCanvasElement | null>(null)
  const animationFrameRef = useRef<number | null>(null)
  const selectedRef = useRef(selected)

  useEffect(() => {
    selectedRef.current = selected
  }, [selected])

  useEffect(() => {
    return () => {
      stopTone(true)
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current)
      }
    }
  }, [])

  const drawVisualizer = () => {
    const canvas = canvasRef.current
    const analyser = analyserRef.current
    if (!canvas || !analyser) return

    const ctx = canvas.getContext('2d')
    if (!ctx) return

    const bufferLength = analyser.frequencyBinCount
    const dataArray = new Uint8Array(bufferLength)

    const draw = () => {
      if (!isPlayingRef.current) {
        // Clear canvas to background when stopped
        ctx.fillStyle = 'rgb(254, 252, 232)'
        ctx.fillRect(0, 0, canvas.width, canvas.height)
        return
      }

      animationFrameRef.current = requestAnimationFrame(draw)
      analyser.getByteFrequencyData(dataArray)

      ctx.fillStyle = 'rgb(254, 252, 232)' // grounding-50
      ctx.fillRect(0, 0, canvas.width, canvas.height)

      const barCount = 64
      const barWidth = canvas.width / barCount
      const step = Math.floor(bufferLength / barCount)
      const hue = selectedRef.current.hue
      const centerY = canvas.height / 2

      for (let i = 0; i < barCount; i++) {
        const value = dataArray[i * step] / 255
        const barHeight = value * centerY * 0.85
        const x = i * barWidth + 1
        const w = barWidth - 2
        const topY = centerY - barHeight
        const radius = Math.min(w / 2, 4)

        // Main bar gradient (varies per preset hue)
        const gradient = ctx.createLinearGradient(x, centerY, x, topY)
        gradient.addColorStop(0, `hsl(${hue}, 90%, 60%)`)
        gradient.addColorStop(0.5, `hsl(${hue + 10}, 85%, 65%)`)
        gradient.addColorStop(1, `hsl(${hue + 20}, 80%, 80%)`)

        // Draw bar with rounded top
        ctx.fillStyle = gradient
        ctx.beginPath()
        ctx.moveTo(x, centerY)
        ctx.lineTo(x, topY + radius)
        ctx.arcTo(x, topY, x + radius, topY, radius)
        ctx.arcTo(x + w, topY, x + w, topY + radius, radius)
        ctx.lineTo(x + w, centerY)
        ctx.closePath()
        ctx.fill()

        // Mirrored bar below center (shorter, more transparent)
        const mirrorHeight = barHeight * 0.35
        const mirrorBottomY = centerY + mirrorHeight
        const mirrorGradient = ctx.createLinearGradient(x, centerY, x, mirrorBottomY)
        mirrorGradient.addColorStop(0, `hsla(${hue}, 80%, 65%, 0.4)`)
        mirrorGradient.addColorStop(1, `hsla(${hue}, 70%, 75%, 0.1)`)

        ctx.fillStyle = mirrorGradient
        ctx.fillRect(x, centerY + 1, w, mirrorHeight)
      }

      // Subtle center line
      ctx.strokeStyle = `hsla(${hue}, 60%, 50%, 0.15)`
      ctx.lineWidth = 1
      ctx.beginPath()
      ctx.moveTo(0, centerY)
      ctx.lineTo(canvas.width, centerY)
      ctx.stroke()
    }

    draw()
  }

  useEffect(() => {
    if (isPlaying) {
      drawVisualizer()
    } else if (animationFrameRef.current) {
      cancelAnimationFrame(animationFrameRef.current)
      // Clear canvas when stopped
      const canvas = canvasRef.current
      if (canvas) {
        const ctx = canvas.getContext('2d')
        if (ctx) {
          ctx.fillStyle = 'rgb(254, 252, 232)'
          ctx.fillRect(0, 0, canvas.width, canvas.height)
        }
      }
    }
  }, [isPlaying])

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
    const analyser = ctx.createAnalyser()

    analyser.fftSize = 2048
    analyser.smoothingTimeConstant = 0.8

    osc.frequency.value = selected.hz
    osc.type = 'sine'
    gain.gain.value = 0

    osc.connect(analyser)
    analyser.connect(gain)
    gain.connect(ctx.destination)

    osc.start()
    // fade in
    gain.gain.linearRampToValueAtTime(volume, ctx.currentTime + 0.6)
    ctx.resume?.()

    oscRef.current = osc
    gainRef.current = gain
    analyserRef.current = analyser
    isPlayingRef.current = true
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
    isPlayingRef.current = false
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
          These tones are gentle aids; listen at low volume. Evidence for specific "healing frequencies" varies—use what feels pleasant and calming to you.
        </div>

        <div className="relative h-32 overflow-hidden rounded-lg bg-gradient-to-r from-grounding-50 to-calm-50 border border-grounding-200">
          <canvas
            ref={canvasRef}
            width={600}
            height={128}
            className="w-full h-full"
            style={{ imageRendering: 'auto' }}
          />
          {!isPlaying && (
            <div className="absolute inset-0 flex items-center justify-center text-sm text-gray-400">
              Press Play to see audio visualization
            </div>
          )}
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
