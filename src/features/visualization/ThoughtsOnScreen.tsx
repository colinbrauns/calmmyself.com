"use client"

import { useState, useRef, useEffect, useCallback } from 'react'
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { Monitor, Play, Clock, CheckCircle2, RotateCcw, ArrowLeft } from 'lucide-react'
import { motion } from 'framer-motion'
import ShareInline from '@/components/ShareInline'

interface DustMote {
  x: number
  y: number
  speed: number
  size: number
  opacity: number
  drift: number
}

interface StarLight {
  x: number
  y: number
  brightness: number
  twinkleSpeed: number
}

const DURATION_OPTIONS = [
  { label: '2 min', seconds: 120 },
  { label: '5 min', seconds: 300 },
  { label: '10 min', seconds: 600 },
]

export default function ThoughtsOnScreen() {
  const [input, setInput] = useState('')
  const [sessionState, setSessionState] = useState<'setup' | 'active' | 'completed'>('setup')
  const [duration, setDuration] = useState(300)
  const [elapsed, setElapsed] = useState(0)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const animFrameRef = useRef<number>(0)
  const frameCountRef = useRef(0)
  const grainDataRef = useRef<ImageData | null>(null)
  const timerRef = useRef<NodeJS.Timeout | null>(null)

  const activeTextRef = useRef<string | null>(null)
  const textPhaseRef = useRef<'idle' | 'typing' | 'hold' | 'fadeout'>('idle')
  const textProgressRef = useRef(0)
  const holdStartRef = useRef(0)
  const fadeStartRef = useRef(0)

  const dustMotesRef = useRef<DustMote[]>([])
  const starsRef = useRef<StarLight[]>([])
  const initedRef = useRef(false)

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
  }

  const reset = () => {
    setSessionState('setup')
    setElapsed(0)
    activeTextRef.current = null
    textPhaseRef.current = 'idle'
  }

  const initScene = useCallback((w: number, h: number) => {
    if (initedRef.current) return
    initedRef.current = true
    const motes: DustMote[] = []
    for (let i = 0; i < 40; i++) {
      motes.push({
        x: Math.random() * w,
        y: Math.random() * h * 0.6,
        speed: 0.2 + Math.random() * 0.5,
        size: 0.5 + Math.random() * 1.5,
        opacity: 0.1 + Math.random() * 0.3,
        drift: (Math.random() - 0.5) * 0.3,
      })
    }
    dustMotesRef.current = motes

    const stars: StarLight[] = []
    for (let i = 0; i < 30; i++) {
      stars.push({
        x: Math.random() * w,
        y: Math.random() * h * 0.15,
        brightness: 0.1 + Math.random() * 0.3,
        twinkleSpeed: 0.5 + Math.random() * 2,
      })
    }
    starsRef.current = stars
  }, [])

  const wrapText = (ctx: CanvasRenderingContext2D, text: string, maxWidth: number): string[] => {
    const words = text.split(' ')
    const lines: string[] = []
    let currentLine = ''
    for (const word of words) {
      const test = currentLine ? currentLine + ' ' + word : word
      if (ctx.measureText(test).width > maxWidth && currentLine) {
        lines.push(currentLine)
        currentLine = word
      } else {
        currentLine = test
      }
    }
    if (currentLine) lines.push(currentLine)
    return lines
  }

  const draw = useCallback((ctx: CanvasRenderingContext2D, w: number, h: number, time: number) => {
    const frame = frameCountRef.current++
    const elapsedMs = time * 1000

    const screenMarginX = w * 0.08
    const screenMarginTop = h * 0.12
    const screenW = w - screenMarginX * 2
    const screenH = h * 0.55
    const screenX = screenMarginX
    const screenY = screenMarginTop

    const flicker = 1 + (Math.random() - 0.5) * 0.03
    const isActive = textPhaseRef.current !== 'idle'
    const beamBrightness = isActive ? 0.06 : 0.03

    ctx.fillStyle = '#0a0a0a'
    ctx.fillRect(0, 0, w, h)

    for (const star of starsRef.current) {
      const twinkle = Math.sin(time * star.twinkleSpeed) * 0.5 + 0.5
      const alpha = star.brightness * twinkle
      ctx.beginPath()
      ctx.arc(star.x, star.y, 1, 0, Math.PI * 2)
      ctx.fillStyle = `rgba(200, 210, 255, ${alpha})`
      ctx.fill()
    }

    const beamGrad = ctx.createLinearGradient(w * 0.85, 0, w * 0.5, h * 0.7)
    beamGrad.addColorStop(0, `rgba(255, 240, 200, ${beamBrightness * flicker})`)
    beamGrad.addColorStop(1, 'rgba(255, 240, 200, 0)')
    ctx.beginPath()
    ctx.moveTo(w * 0.92, 0)
    ctx.lineTo(screenX, screenY + screenH)
    ctx.lineTo(screenX + screenW, screenY + screenH)
    ctx.closePath()
    ctx.fillStyle = beamGrad
    ctx.fill()

    const screenGrad = ctx.createRadialGradient(
      screenX + screenW / 2, screenY + screenH / 2, screenW * 0.1,
      screenX + screenW / 2, screenY + screenH / 2, screenW * 0.7
    )
    screenGrad.addColorStop(0, `rgba(20, 18, 15, ${0.95 * flicker})`)
    screenGrad.addColorStop(1, `rgba(8, 7, 6, ${0.98 * flicker})`)
    ctx.fillStyle = screenGrad
    ctx.fillRect(screenX, screenY, screenW, screenH)

    ctx.strokeStyle = 'rgba(60, 55, 45, 0.4)'
    ctx.lineWidth = 1.5
    ctx.strokeRect(screenX, screenY, screenW, screenH)

    const glowGrad = ctx.createRadialGradient(
      screenX + screenW / 2, screenY + screenH / 2, screenW * 0.3,
      screenX + screenW / 2, screenY + screenH / 2, screenW * 0.8
    )
    glowGrad.addColorStop(0, `rgba(255, 230, 180, ${0.015 * flicker})`)
    glowGrad.addColorStop(1, 'rgba(255, 230, 180, 0)')
    ctx.fillStyle = glowGrad
    ctx.fillRect(0, 0, w, h)

    const letterboxH = screenH * 0.08
    ctx.fillStyle = 'rgba(0, 0, 0, 0.9)'
    ctx.fillRect(screenX, screenY, screenW, letterboxH)
    ctx.fillRect(screenX, screenY + screenH - letterboxH, screenW, letterboxH)

    const textAreaY = screenY + letterboxH + 10
    const textAreaH = screenH - letterboxH * 2 - 20
    const textCenterX = screenX + screenW / 2
    const textCenterY = textAreaY + textAreaH / 2

    if (textPhaseRef.current === 'idle') {
      const pulse = Math.sin(time * 2) * 0.3 + 0.4
      ctx.fillStyle = `rgba(255, 248, 240, ${pulse})`
      ctx.fillRect(textCenterX - 6, textCenterY - 1, 12, 2)
    } else {
      const fullText = activeTextRef.current || ''
      let globalAlpha = 1
      let blurAmount = 0

      if (textPhaseRef.current === 'typing') {
        textProgressRef.current += 0.02
        if (textProgressRef.current >= 1) {
          textPhaseRef.current = 'hold'
          holdStartRef.current = time
          textProgressRef.current = 1
        }
      } else if (textPhaseRef.current === 'hold') {
        if (time - holdStartRef.current > 3) {
          textPhaseRef.current = 'fadeout'
          fadeStartRef.current = time
        }
      } else if (textPhaseRef.current === 'fadeout') {
        const fadeProgress = Math.min((time - fadeStartRef.current) / 2, 1)
        globalAlpha = 1 - fadeProgress
        blurAmount = fadeProgress * 6
        if (fadeProgress >= 1) {
          textPhaseRef.current = 'idle'
          activeTextRef.current = null
        }
      }

      const charsToShow = Math.floor(textProgressRef.current * fullText.length)
      const visibleText = fullText.substring(0, charsToShow)

      ctx.save()
      if (blurAmount > 0) {
        ctx.filter = `blur(${blurAmount}px)`
      }
      ctx.globalAlpha = globalAlpha

      ctx.font = `${Math.max(16, Math.min(24, w * 0.04))}px 'Courier New', monospace`
      ctx.textAlign = 'center'
      ctx.textBaseline = 'middle'

      const maxTextW = screenW * 0.8
      const lines = wrapText(ctx, visibleText, maxTextW)
      const lineHeight = Math.max(20, w * 0.05)
      const startY = textCenterY - ((lines.length - 1) * lineHeight) / 2

      ctx.fillStyle = `rgba(255, 248, 240, 0.95)`
      lines.forEach((line, i) => {
        ctx.fillText(line, textCenterX, startY + i * lineHeight)
      })

      if (textPhaseRef.current === 'typing' && charsToShow > 0 && charsToShow < fullText.length) {
        ctx.shadowBlur = 25
        ctx.shadowColor = 'rgba(255, 200, 100, 0.8)'
        ctx.fillStyle = 'rgba(255, 248, 240, 1)'
        const lastChar = fullText[charsToShow - 1]
        const lastLine = lines[lines.length - 1]
        const lineW = ctx.measureText(lastLine).width
        const charW = ctx.measureText(lastChar).width
        const lastCharX = textCenterX + lineW / 2 - charW / 2
        const lastCharY = startY + (lines.length - 1) * lineHeight
        ctx.fillText(lastChar, lastCharX, lastCharY)
        ctx.shadowBlur = 0
        ctx.shadowColor = 'transparent'
      }

      ctx.restore()
    }

    ctx.fillStyle = 'rgba(0, 0, 0, 0.03)'
    for (let y = screenY; y < screenY + screenH; y += 2) {
      ctx.fillRect(screenX, y, screenW, 1)
    }

    if (frame % 6 === 0) {
      try {
        const imgData = ctx.getImageData(screenX, screenY, screenW, screenH)
        const d = imgData.data
        for (let i = 0; i < d.length; i += 16) {
          const noise = (Math.random() - 0.5) * 12
          d[i] = Math.max(0, Math.min(255, d[i] + noise))
          d[i + 1] = Math.max(0, Math.min(255, d[i + 1] + noise))
          d[i + 2] = Math.max(0, Math.min(255, d[i + 2] + noise))
        }
        grainDataRef.current = imgData
      } catch { /* canvas tainted */ }
    }
    if (grainDataRef.current) {
      try { ctx.putImageData(grainDataRef.current, screenX, screenY) } catch { /* skip */ }
    }

    const vigGrad = ctx.createRadialGradient(
      screenX + screenW / 2, screenY + screenH / 2, screenW * 0.25,
      screenX + screenW / 2, screenY + screenH / 2, screenW * 0.6
    )
    vigGrad.addColorStop(0, 'rgba(0,0,0,0)')
    vigGrad.addColorStop(1, 'rgba(0,0,0,0.4)')
    ctx.fillStyle = vigGrad
    ctx.fillRect(screenX, screenY, screenW, screenH)

    for (const mote of dustMotesRef.current) {
      mote.y += mote.speed
      mote.x += mote.drift + Math.sin(time + mote.x) * 0.2
      if (mote.y > h * 0.7) {
        mote.y = -5
        mote.x = screenX + Math.random() * screenW
      }
      if (mote.x < 0) mote.x = w
      if (mote.x > w) mote.x = 0

      const beamLeft = screenX + (mote.y / (h * 0.7)) * (w * 0.92 - screenX - screenW) * -1
      const beamRight = screenX + screenW + (1 - mote.y / (h * 0.7)) * (w * 0.92 - screenX - screenW)
      if (mote.x > beamLeft - 50 && mote.x < beamRight + 50) {
        ctx.beginPath()
        ctx.arc(mote.x, mote.y, mote.size, 0, Math.PI * 2)
        ctx.fillStyle = `rgba(255, 240, 200, ${mote.opacity * flicker})`
        ctx.fill()
      }
    }

    ctx.beginPath()
    ctx.strokeStyle = 'rgba(255, 248, 240, 0.06)'
    ctx.lineWidth = 1
    const waveY = screenY + screenH - 15
    for (let x = screenX; x < screenX + screenW; x += 2) {
      const val = Math.sin((x - screenX) * 0.02 + time * 1.5) * 3
        + Math.sin((x - screenX) * 0.05 + time * 2.3) * 1.5
      if (x === screenX) ctx.moveTo(x, waveY + val)
      else ctx.lineTo(x, waveY + val)
    }
    ctx.stroke()

    const seatY = screenY + screenH + h * 0.08
    const seatW = w * 0.06
    const seatGap = w * 0.02
    const totalSeats = Math.floor(w / (seatW + seatGap))
    const seatStartX = (w - totalSeats * (seatW + seatGap)) / 2
    for (let i = 0; i < totalSeats; i++) {
      const sx = seatStartX + i * (seatW + seatGap)
      ctx.fillStyle = '#0e0e0e'
      ctx.beginPath()
      ctx.roundRect(sx, seatY, seatW, h * 0.08, 3)
      ctx.fill()
      ctx.fillStyle = '#111'
      ctx.beginPath()
      ctx.roundRect(sx + seatW * 0.15, seatY - h * 0.02, seatW * 0.7, h * 0.03, 2)
      ctx.fill()
    }
    const seat2Y = seatY + h * 0.1
    for (let i = 0; i < totalSeats + 1; i++) {
      const sx = seatStartX - seatW / 2 + i * (seatW + seatGap)
      ctx.fillStyle = '#090909'
      ctx.beginPath()
      ctx.roundRect(sx, seat2Y, seatW, h * 0.06, 3)
      ctx.fill()
    }
  }, [])

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    const resize = () => {
      const dpr = window.devicePixelRatio || 1
      const rect = canvas.getBoundingClientRect()
      canvas.width = rect.width * dpr
      canvas.height = rect.height * dpr
      ctx.scale(dpr, dpr)
      initScene(rect.width, rect.height)
    }
    resize()
    window.addEventListener('resize', resize)

    const animate = (ts: number) => {
      const rect = canvas.getBoundingClientRect()
      const time = ts / 1000
      ctx.setTransform(window.devicePixelRatio || 1, 0, 0, window.devicePixelRatio || 1, 0, 0)
      draw(ctx, rect.width, rect.height, time)
      animFrameRef.current = requestAnimationFrame(animate)
    }
    animFrameRef.current = requestAnimationFrame(animate)

    return () => {
      cancelAnimationFrame(animFrameRef.current)
      window.removeEventListener('resize', resize)
    }
  }, [draw, initScene])

  const handleProject = () => {
    if (!input.trim()) return
    activeTextRef.current = input.trim()
    textPhaseRef.current = 'typing'
    textProgressRef.current = 0
    setInput('')
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault()
      handleProject()
    }
  }

  const formatTime = (s: number) => `${Math.floor(s / 60)}:${(s % 60).toString().padStart(2, '0')}`

  if (sessionState === 'completed') {
    return (
      <div className="max-w-md mx-auto">
        <Card className="bg-[#0a0a0a] border-gray-900 shadow-2xl">
          <CardContent className="text-center py-10 space-y-5">
            <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: 'spring', bounce: 0.5 }}>
              <CheckCircle2 className="w-16 h-16 text-amber-500 mx-auto" />
            </motion.div>
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
              <h3 className="text-xl font-semibold text-gray-200">Session complete 🎬</h3>
              <p className="text-gray-500 mt-2 text-sm font-mono">
                You watched your thoughts for {formatTime(duration)}. You are the audience, not the movie.
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
            <ShareInline title="Thoughts on a Screen" text="Practice watching thoughts as subtitles on CalmMyself." />
          </CardContent>
        </Card>
      </div>
    )
  }

  if (sessionState === 'setup') {
    return (
      <div className="max-w-md mx-auto">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          <Card className="bg-[#0a0a0a] border-gray-900 shadow-2xl">
            <CardHeader className="text-center">
              <div className="flex items-center justify-center gap-2 mb-1">
                <Monitor className="w-5 h-5 text-amber-700/60" />
                <CardTitle className="text-gray-300 text-lg">Thoughts on a Screen</CardTitle>
              </div>
              <CardDescription className="text-gray-600 text-xs font-mono">
                Watch thoughts like subtitles instead of being inside them
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <p className="text-sm font-medium text-gray-400 mb-3 text-center">Session Duration</p>
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
            </CardContent>
          </Card>
        </motion.div>
      </div>
    )
  }

  return (
    <div className="max-w-2xl mx-auto">
      <Card className="bg-[#0a0a0a] border-gray-900 shadow-2xl">
        <CardHeader className="text-center pb-2">
          <div className="flex items-center justify-center gap-2 mb-1">
            <Monitor className="w-5 h-5 text-amber-700/60" />
            <CardTitle className="text-gray-300 text-lg">Thoughts on a Screen</CardTitle>
          </div>
          <div className="flex items-center justify-center gap-2">
            <Clock size={14} className="text-amber-600" />
            <span className="text-amber-400 text-sm font-mono">{formatTime(duration - elapsed)}</span>
          </div>
          <div className="w-48 mx-auto mt-1 bg-gray-800 rounded-full h-1">
            <div className="bg-amber-600 h-1 rounded-full transition-all" style={{ width: `${(elapsed / duration) * 100}%` }} />
          </div>
        </CardHeader>

        <CardContent className="space-y-4 px-3 sm:px-6">
          <canvas ref={canvasRef} className="w-full rounded-lg" style={{ height: '420px', background: '#0a0a0a' }} />

          <div className="flex gap-2">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="I'm having the thought that..."
              className="flex-1 p-3 bg-[#111] border border-gray-800 rounded-lg text-gray-200 placeholder-gray-600 font-mono text-sm focus:ring-1 focus:ring-amber-900/50 focus:border-amber-900/50 outline-none"
              aria-label="Enter a thought"
            />
            <Button onClick={handleProject} disabled={!input.trim()} variant="calm"
              className="bg-gray-800 hover:bg-gray-700 text-gray-300 border-gray-700 font-mono">
              Project
            </Button>
          </div>

          <div className="text-xs text-gray-500 bg-[#0f0f0f] border border-gray-800/50 p-3 rounded-lg font-mono">
            <p className="mb-2 text-gray-400">How to use:</p>
            <ol className="list-decimal list-inside space-y-1 text-gray-600">
              <li>Notice a thought popping up.</li>
              <li>Type it out above.</li>
              <li>Watch it appear on the screen, hold, and dissolve away.</li>
              <li>You don&apos;t have to fix it. Just watch it go.</li>
            </ol>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
