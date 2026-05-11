'use client'

import { useState, useCallback, useRef, useEffect } from 'react'
import { Button } from '@/components/ui/Button'
import { Cloud, Play, Pause, Clock, CheckCircle2, RotateCcw, ArrowLeft } from 'lucide-react'
import { motion } from 'framer-motion'
import ShareInline from '@/components/ShareInline'

type ThoughtCloud = {
  id: string
  text: string
  x: number
  y: number
  scale: number
  opacity: number
  speed: number
  puffs: { dx: number; dy: number; r: number }[]
  spawnTime: number
  fadeIn: number
}

type AmbientCloud = {
  x: number
  y: number
  scale: number
  speed: number
  opacity: number
  layer: number
  puffs: { dx: number; dy: number; r: number }[]
}

type Star = {
  x: number
  y: number
  size: number
  twinkleSpeed: number
  twinkleOffset: number
}

function generatePuffs(scale: number, variation: number = 0): { dx: number; dy: number; r: number }[] {
  const v = () => (Math.random() - 0.5) * variation
  return [
    { dx: v(), dy: v(), r: (28 + Math.random() * 6) * scale },
    { dx: (-24 + v()) * scale, dy: (4 + v()), r: (20 + Math.random() * 5) * scale },
    { dx: (24 + v()) * scale, dy: (4 + v()), r: (23 + Math.random() * 5) * scale },
    { dx: (-14 + v()) * scale, dy: (-11 + v()), r: (18 + Math.random() * 5) * scale },
    { dx: (14 + v()) * scale, dy: (-9 + v()), r: (20 + Math.random() * 5) * scale },
    { dx: v() * scale, dy: (-14 + v()), r: (16 + Math.random() * 4) * scale },
    { dx: (-8 + v()) * scale, dy: (10 + v()), r: (15 + Math.random() * 4) * scale },
    { dx: (8 + v()) * scale, dy: (10 + v()), r: (15 + Math.random() * 4) * scale },
  ]
}

function createAmbientClouds(canvasW: number, canvasH: number): AmbientCloud[] {
  const clouds: AmbientCloud[] = []
  const layers = [
    { count: 5, scaleRange: [0.4, 0.7], speedRange: [0.15, 0.3], opacityRange: [0.2, 0.35], yRange: [0.05, 0.4] },
    { count: 4, scaleRange: [0.7, 1.1], speedRange: [0.3, 0.5], opacityRange: [0.35, 0.55], yRange: [0.15, 0.55] },
    { count: 3, scaleRange: [1.1, 1.6], speedRange: [0.5, 0.8], opacityRange: [0.5, 0.7], yRange: [0.25, 0.65] },
  ]
  layers.forEach((layer, li) => {
    for (let i = 0; i < layer.count; i++) {
      const scale = layer.scaleRange[0] + Math.random() * (layer.scaleRange[1] - layer.scaleRange[0])
      clouds.push({
        x: Math.random() * (canvasW + 200) - 100,
        y: (layer.yRange[0] + Math.random() * (layer.yRange[1] - layer.yRange[0])) * canvasH,
        scale,
        speed: layer.speedRange[0] + Math.random() * (layer.speedRange[1] - layer.speedRange[0]),
        opacity: layer.opacityRange[0] + Math.random() * (layer.opacityRange[1] - layer.opacityRange[0]),
        layer: li,
        puffs: generatePuffs(scale, 8),
      })
    }
  })
  return clouds
}

function createStars(canvasW: number, canvasH: number): Star[] {
  const stars: Star[] = []
  for (let i = 0; i < 80; i++) {
    stars.push({
      x: Math.random() * canvasW,
      y: Math.random() * canvasH * 0.7,
      size: Math.random() * 2 + 0.5,
      twinkleSpeed: Math.random() * 2 + 1,
      twinkleOffset: Math.random() * Math.PI * 2,
    })
  }
  return stars
}

function getSkyColors(t: number): { top: string; bottom: string; sunColor: string; sunY: number; sunX: number; nightAmount: number } {
  const phases = [
    { t: 0, top: [255, 140, 100], bottom: [255, 200, 150] },
    { t: 0.15, top: [80, 150, 230], bottom: [160, 210, 250] },
    { t: 0.25, top: [40, 120, 220], bottom: [135, 195, 245] },
    { t: 0.4, top: [70, 140, 225], bottom: [150, 205, 248] },
    { t: 0.5, top: [230, 120, 70], bottom: [255, 180, 100] },
    { t: 0.6, top: [60, 40, 100], bottom: [120, 70, 130] },
    { t: 0.75, top: [15, 15, 40], bottom: [30, 25, 60] },
    { t: 0.9, top: [20, 20, 50], bottom: [40, 30, 70] },
    { t: 1.0, top: [255, 140, 100], bottom: [255, 200, 150] },
  ]

  let a = phases[0], b = phases[1]
  for (let i = 0; i < phases.length - 1; i++) {
    if (t >= phases[i].t && t < phases[i + 1].t) {
      a = phases[i]
      b = phases[i + 1]
      break
    }
  }

  const lerp = (a.t === b.t) ? 0 : (t - a.t) / (b.t - a.t)
  const mix = (c1: number[], c2: number[]) =>
    c1.map((v, i) => Math.round(v + (c2[i] - v) * lerp))

  const top = mix(a.top, b.top)
  const bottom = mix(a.bottom, b.bottom)

  const sunAngle = t * Math.PI * 2
  const sunY = 0.5 - Math.sin(sunAngle * 2) * 0.45
  const sunX = 0.2 + t * 0.6

  const nightAmount = t > 0.6 && t < 0.9 ? Math.min(1, (t - 0.6) / 0.15) :
    t >= 0.9 ? Math.max(0, 1 - (t - 0.9) / 0.1) : 0

  return {
    top: `rgb(${top[0]},${top[1]},${top[2]})`,
    bottom: `rgb(${bottom[0]},${bottom[1]},${bottom[2]})`,
    sunColor: nightAmount > 0.5 ? 'rgba(220,220,255,0.8)' : 'rgba(255,240,200,1)',
    sunY,
    sunX: sunX > 1 ? sunX - 1 : sunX,
    nightAmount,
  }
}

function drawCloudShape(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  puffs: { dx: number; dy: number; r: number }[],
  opacity: number,
  _tint: string = 'rgba(255,255,255,0.85)'
) {
  ctx.save()
  ctx.globalAlpha = opacity
  ctx.fillStyle = _tint
  ctx.shadowBlur = 25
  ctx.shadowColor = 'rgba(255,255,255,0.4)'
  puffs.forEach((p) => {
    ctx.beginPath()
    ctx.arc(x + p.dx, y + p.dy, p.r, 0, Math.PI * 2)
    ctx.fill()
  })
  ctx.shadowBlur = 0
  ctx.restore()
}

const DURATION_OPTIONS = [
  { label: '2 min', seconds: 120 },
  { label: '5 min', seconds: 300 },
  { label: '10 min', seconds: 600 },
]

export default function CloudVisualization() {
  const [thoughts, setThoughts] = useState<ThoughtCloud[]>([])
  const [input, setInput] = useState('')
  const [sessionState, setSessionState] = useState<'setup' | 'active' | 'completed'>('setup')
  const [duration, setDuration] = useState(300)
  const [elapsed, setElapsed] = useState(0)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const animRef = useRef<number>(0)
  const ambientRef = useRef<AmbientCloud[]>([])
  const starsRef = useRef<Star[]>([])
  const thoughtsRef = useRef<ThoughtCloud[]>([])
  const startTimeRef = useRef<number>(Date.now())
  const sizeRef = useRef<{ w: number; h: number }>({ w: 0, h: 0 })
  const timerRef = useRef<NodeJS.Timeout | null>(null)

  thoughtsRef.current = thoughts

  useEffect(() => {
    if (sessionState === 'active') {
      timerRef.current = setInterval(() => {
        setElapsed(prev => {
          const next = prev + 1
          if (next >= duration) {
            setSessionState('completed')
            if (timerRef.current) clearInterval(timerRef.current)
          }
          return next
        })
      }, 1000)
    }
    return () => { if (timerRef.current) clearInterval(timerRef.current) }
  }, [sessionState, duration])

  const startSession = () => {
    setSessionState('active')
    setElapsed(0)
    setThoughts([])
  }

  const reset = () => {
    setSessionState('setup')
    setElapsed(0)
    setThoughts([])
  }

  const addThought = useCallback(() => {
    if (!input.trim()) return
    const text = input.trim()
    const scale = Math.min(2.2, 0.8 + text.length * 0.025)
    const canvasH = sizeRef.current.h || 500
    const y = 60 + Math.random() * (canvasH - 160)

    const thought: ThoughtCloud = {
      id: Math.random().toString(36).substr(2, 9),
      text,
      x: -80,
      y,
      scale,
      opacity: 0,
      speed: 0.4 + Math.random() * 0.2,
      puffs: generatePuffs(scale, 12),
      spawnTime: Date.now(),
      fadeIn: 0,
    }

    setThoughts((prev) => {
      const next = [...prev, thought]
      return next.length > 6 ? next.slice(-6) : next
    })
    setInput('')
  }, [input])

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault()
      addThought()
    }
  }

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext('2d')
    if (!ctx) return

    const resize = () => {
      const rect = canvas.getBoundingClientRect()
      const dpr = window.devicePixelRatio || 1
      canvas.width = rect.width * dpr
      canvas.height = rect.height * dpr
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
      sizeRef.current = { w: rect.width, h: rect.height }
      ambientRef.current = createAmbientClouds(rect.width, rect.height)
      starsRef.current = createStars(rect.width, rect.height)
    }

    resize()
    window.addEventListener('resize', resize)

    const CYCLE_DURATION = 120000

    const render = () => {
      const w = sizeRef.current.w
      const h = sizeRef.current.h
      const now = Date.now()
      const elapsedMs = now - startTimeRef.current
      const cycleT = (elapsedMs % CYCLE_DURATION) / CYCLE_DURATION
      const sky = getSkyColors(cycleT)

      const grad = ctx.createLinearGradient(0, 0, 0, h)
      grad.addColorStop(0, sky.top)
      grad.addColorStop(1, sky.bottom)
      ctx.fillStyle = grad
      ctx.fillRect(0, 0, w, h)

      if (sky.nightAmount > 0) {
        const timeS = elapsedMs / 1000
        starsRef.current.forEach((star) => {
          const twinkle = 0.3 + 0.7 * (0.5 + 0.5 * Math.sin(timeS * star.twinkleSpeed + star.twinkleOffset))
          ctx.globalAlpha = sky.nightAmount * twinkle * 0.9
          ctx.fillStyle = '#fff'
          ctx.beginPath()
          ctx.arc(star.x, star.y, star.size, 0, Math.PI * 2)
          ctx.fill()
        })
        ctx.globalAlpha = 1
      }

      const sunScreenX = sky.sunX * w
      const sunScreenY = sky.sunY * h
      if (sky.sunY < 0.85) {
        ctx.save()
        const sunGlow = ctx.createRadialGradient(sunScreenX, sunScreenY, 0, sunScreenX, sunScreenY, 120)
        if (sky.nightAmount > 0.5) {
          sunGlow.addColorStop(0, 'rgba(220,225,255,0.9)')
          sunGlow.addColorStop(0.3, 'rgba(200,210,255,0.3)')
          sunGlow.addColorStop(1, 'rgba(200,210,255,0)')
        } else {
          sunGlow.addColorStop(0, 'rgba(255,250,220,1)')
          sunGlow.addColorStop(0.15, 'rgba(255,240,180,0.6)')
          sunGlow.addColorStop(0.5, 'rgba(255,200,100,0.15)')
          sunGlow.addColorStop(1, 'rgba(255,200,100,0)')
        }
        ctx.fillStyle = sunGlow
        ctx.beginPath()
        ctx.arc(sunScreenX, sunScreenY, 120, 0, Math.PI * 2)
        ctx.fill()

        const orbGrad = ctx.createRadialGradient(sunScreenX, sunScreenY, 0, sunScreenX, sunScreenY, sky.nightAmount > 0.5 ? 22 : 30)
        if (sky.nightAmount > 0.5) {
          orbGrad.addColorStop(0, 'rgba(240,240,255,1)')
          orbGrad.addColorStop(1, 'rgba(210,215,240,0.8)')
        } else {
          orbGrad.addColorStop(0, 'rgba(255,255,240,1)')
          orbGrad.addColorStop(1, 'rgba(255,220,140,0.9)')
        }
        ctx.fillStyle = orbGrad
        ctx.beginPath()
        ctx.arc(sunScreenX, sunScreenY, sky.nightAmount > 0.5 ? 22 : 30, 0, Math.PI * 2)
        ctx.fill()

        if (sky.nightAmount < 0.3 && sky.sunY < 0.6) {
          ctx.save()
          ctx.globalCompositeOperation = 'lighter'
          ctx.globalAlpha = 0.06 * (1 - sky.nightAmount)
          for (let i = 0; i < 6; i++) {
            const angle = (i / 6) * Math.PI * 2 + elapsedMs * 0.00005
            const len = 200 + Math.sin(elapsedMs * 0.001 + i) * 50
            ctx.beginPath()
            ctx.moveTo(sunScreenX, sunScreenY)
            ctx.lineTo(sunScreenX + Math.cos(angle - 0.04) * len, sunScreenY + Math.sin(angle - 0.04) * len)
            ctx.lineTo(sunScreenX + Math.cos(angle + 0.04) * len, sunScreenY + Math.sin(angle + 0.04) * len)
            ctx.closePath()
            ctx.fillStyle = 'rgba(255,240,200,1)'
            ctx.fill()
          }
          ctx.restore()
        }
        ctx.restore()
      }

      ctx.save()
      ctx.globalAlpha = 0.03
      ctx.strokeStyle = '#fff'
      ctx.lineWidth = 1
      for (let i = 0; i < 8; i++) {
        const streakY = (i * 0.12 + 0.05) * h
        const offset = (elapsedMs * 0.02 + i * 200) % (w + 200) - 100
        ctx.beginPath()
        ctx.moveTo(offset, streakY)
        ctx.lineTo(offset + 80 + i * 10, streakY)
        ctx.stroke()
      }
      ctx.restore()

      for (let layer = 0; layer < 3; layer++) {
        const useBlur = layer === 0
        if (useBlur) {
          try { ctx.filter = 'blur(2px)' } catch { /* no filter support */ }
        }
        ambientRef.current.forEach((cloud) => {
          if (cloud.layer !== layer) return
          cloud.x += cloud.speed * 0.3
          if (cloud.x > w + 100) cloud.x = -150
          drawCloudShape(ctx, cloud.x, cloud.y, cloud.puffs, cloud.opacity)
        })
        if (useBlur) {
          try { ctx.filter = 'none' } catch { /* */ }
        }
      }

      const currentThoughts = thoughtsRef.current
      const toRemove: string[] = []
      currentThoughts.forEach((tc) => {
        tc.x += tc.speed
        const age = now - tc.spawnTime
        tc.fadeIn = Math.min(1, age / 1000)
        const fadeOut = tc.x > w - 150 ? Math.max(0, 1 - (tc.x - (w - 150)) / 150) : 1
        const alpha = tc.fadeIn * fadeOut

        if (tc.x > w + 100) {
          toRemove.push(tc.id)
          return
        }

        drawCloudShape(ctx, tc.x, tc.y, tc.puffs, alpha * 0.85)

        ctx.save()
        ctx.globalAlpha = alpha
        ctx.fillStyle = '#fff'
        ctx.shadowColor = 'rgba(0,0,0,0.3)'
        ctx.shadowBlur = 4
        ctx.font = `${Math.max(12, Math.min(16, 14 * tc.scale * 0.7))}px system-ui, sans-serif`
        ctx.textAlign = 'center'
        ctx.textBaseline = 'middle'
        const maxWidth = tc.scale * 55
        const words = tc.text.split(' ')
        const lines: string[] = []
        let currentLine = ''
        words.forEach((word) => {
          const test = currentLine ? currentLine + ' ' + word : word
          if (ctx.measureText(test).width > maxWidth && currentLine) {
            lines.push(currentLine)
            currentLine = word
          } else {
            currentLine = test
          }
        })
        if (currentLine) lines.push(currentLine)
        const lineH = Math.max(14, 18 * tc.scale * 0.7)
        const startY = tc.y - ((lines.length - 1) * lineH) / 2
        lines.forEach((line, i) => {
          ctx.fillText(line, tc.x, startY + i * lineH)
        })
        ctx.restore()
      })

      if (toRemove.length > 0) {
        setThoughts((prev) => prev.filter((t) => !toRemove.includes(t.id)))
      }

      animRef.current = requestAnimationFrame(render)
    }

    animRef.current = requestAnimationFrame(render)

    return () => {
      window.removeEventListener('resize', resize)
      cancelAnimationFrame(animRef.current)
    }
  }, [])

  const formatTime = (s: number) => `${Math.floor(s / 60)}:${(s % 60).toString().padStart(2, '0')}`

  if (sessionState === 'completed') {
    return (
      <div className="max-w-md mx-auto">
        <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-lg p-8 text-center space-y-5">
          <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: 'spring', bounce: 0.5 }}>
            <CheckCircle2 className="w-16 h-16 text-green-500 mx-auto" />
          </motion.div>
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
            <h3 className="text-xl font-semibold text-gray-800 dark:text-gray-100">Beautiful session ☁️</h3>
            <p className="text-gray-600 dark:text-gray-400 mt-2 text-sm">
              You spent {formatTime(duration)} watching thoughts drift by like clouds. Remember — you are the sky, not the clouds.
            </p>
          </motion.div>
          <div className="flex gap-3 justify-center pt-2">
            <Button onClick={reset} variant="grounding" size="lg" className="gap-2">
              <RotateCcw size={16} /> Do Again
            </Button>
            <Button onClick={() => window.history.back()} variant="outline" size="lg" className="gap-2">
              <ArrowLeft size={16} /> Back
            </Button>
          </div>
          <ShareInline title="Thoughts as Clouds" text="Use a cloud visualization for racing thoughts on CalmMyself." />
        </div>
      </div>
    )
  }

  if (sessionState === 'setup') {
    return (
      <div className="max-w-md mx-auto">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="bg-white dark:bg-gray-900 rounded-2xl shadow-lg p-8 text-center space-y-6">
          <div className="flex items-center justify-center gap-2">
            <Cloud className="w-6 h-6 text-blue-500" />
            <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-100">Thoughts as Clouds</h2>
          </div>
          <p className="text-gray-600 dark:text-gray-400 text-sm">
            Let thoughts drift by instead of trying to stop them. Type a thought and watch it float away.
          </p>
          <div>
            <p className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">Session Duration</p>
            <div className="flex gap-2 justify-center">
              {DURATION_OPTIONS.map((d) => (
                <Button key={d.seconds} variant={duration === d.seconds ? 'grounding' : 'outline'} size="sm" onClick={() => setDuration(d.seconds)}>
                  {d.label}
                </Button>
              ))}
            </div>
          </div>
          <Button onClick={startSession} variant="grounding" size="lg" className="w-full gap-2">
            <Play size={18} /> Start Session
          </Button>
        </motion.div>
      </div>
    )
  }

  return (
    <div className="max-w-4xl mx-auto space-y-4">
      <div className="relative w-full rounded-2xl overflow-hidden shadow-xl" style={{ height: 'clamp(400px, 65vh, 700px)' }}>
        <canvas ref={canvasRef} className="w-full h-full block" />

        <div className="absolute top-0 left-0 right-0 p-4 bg-gradient-to-b from-black/20 to-transparent pointer-events-none">
          <h2 className="text-white text-xl font-semibold text-center drop-shadow-lg">
            Thoughts as Clouds
          </h2>
          <div className="flex items-center justify-center gap-2 mt-1">
            <Clock size={14} className="text-white/80" />
            <span className="text-white/80 text-sm font-mono drop-shadow-md">
              {formatTime(duration - elapsed)} remaining
            </span>
          </div>
          <div className="w-48 mx-auto mt-2 bg-white/20 rounded-full h-1">
            <div className="bg-white/70 h-1 rounded-full transition-all" style={{ width: `${(elapsed / duration) * 100}%` }} />
          </div>
        </div>

        {thoughts.length === 0 && (
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
            <p className="text-white/50 text-sm font-medium drop-shadow-md px-4 text-center">
              Type a thought below and watch it drift away...
            </p>
          </div>
        )}

        <div className="absolute bottom-4 left-4 right-4">
          <div className="flex gap-2 bg-white/15 backdrop-blur-md rounded-full px-4 py-2 border border-white/20 shadow-lg">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="I'm thinking about..."
              className="flex-1 bg-transparent text-white placeholder-white/50 text-sm outline-none"
              aria-label="Enter a thought"
            />
            <Button onClick={addThought} disabled={!input.trim()} variant="calm" className="rounded-full px-4 py-1 text-sm">
              Release
            </Button>
          </div>
        </div>
      </div>

      <div className="text-xs text-gray-600 bg-calm-50 dark:bg-gray-800/50 border border-calm-100 dark:border-gray-700 p-3 rounded-md text-center">
        You don&apos;t need to push the thoughts away. Just place them in the sky and let the wind carry them at its own pace.
      </div>
    </div>
  )
}
