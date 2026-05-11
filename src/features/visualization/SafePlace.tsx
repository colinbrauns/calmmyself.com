'use client'

import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Button } from '@/components/ui/Button'
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/Card'
import { Download, ImageDown, Mail, MapPin, RefreshCw, Sparkles } from 'lucide-react'

const SAFE_PLACE_PROMPTS = [
  {
    category: "Setting the Scene",
    questions: [
      "Where is your safe place? Indoors or outdoors?",
      "What does the ground or floor feel like beneath you?",
      "What colors do you see around you?",
      "How is the lighting? Bright, dim, filtered?",
      "What's the temperature like? Warm, cool, just right?"
    ]
  },
  {
    category: "Using Your Senses",
    questions: [
      "What sounds can you hear in your safe place?",
      "Are there any pleasant scents or smells?",
      "What textures can you touch or feel?",
      "Is there anything to taste? Perhaps tea, fruit, or fresh air?",
      "What draws your eyes? What's beautiful to look at?"
    ]
  },
  {
    category: "Feeling Safe",
    questions: [
      "What makes this place feel safe to you?",
      "Are you alone or with others? Who might be there?",
      "What would you like to do in this place?",
      "How does your body feel when you're here?",
      "What emotions arise when you imagine being here?"
    ]
  },
  {
    category: "Deepening the Experience",
    questions: [
      "If this place could speak, what would it say to you?",
      "What gift might this place offer you?",
      "How can you carry the feeling of this place with you?",
      "What word or phrase captures the essence of this place?",
      "When might you return to this place in your mind?"
    ]
  }
]

// ─── Color helpers ───────────────────────────────────────────────────
function lerpColor(a: number[], b: number[], t: number): number[] {
  return a.map((v, i) => v + (b[i] - v) * t)
}

function rgba(c: number[], a = 1): string {
  return `rgba(${Math.round(c[0])},${Math.round(c[1])},${Math.round(c[2])},${a})`
}

// ─── Particle type ───────────────────────────────────────────────────
interface Particle {
  x: number
  y: number
  vx: number
  vy: number
  r: number
  phase: number
  hue: number
  brightness: number
}

function createParticle(w: number, h: number, organized = false): Particle {
  return {
    x: Math.random() * w,
    y: organized ? h * 0.2 + Math.random() * h * 0.5 : Math.random() * h,
    vx: (Math.random() - 0.5) * 0.3,
    vy: (Math.random() - 0.5) * 0.2 - 0.1,
    r: 2 + Math.random() * 4,
    phase: Math.random() * Math.PI * 2,
    hue: 30 + Math.random() * 30,
    brightness: 0.5 + Math.random() * 0.5,
  }
}

// ─── Drawing functions ───────────────────────────────────────────────

function drawSky(ctx: CanvasRenderingContext2D, w: number, h: number, progress: number, time: number) {
  const dark = [10, 10, 30]
  const mid1 = [40, 20, 80]
  const mid2 = [120, 50, 100]
  const warm = [180, 100, 60]
  const sunset = [220, 150, 80]

  const grad = ctx.createLinearGradient(0, 0, 0, h * 0.6)

  const topColor = lerpColor(dark, lerpColor(mid1, mid2, progress), progress)
  const midColor = lerpColor(mid1, warm, progress)
  const bottomColor = lerpColor(dark, sunset, progress)

  grad.addColorStop(0, rgba(topColor))
  grad.addColorStop(0.5, rgba(midColor, 0.8))
  grad.addColorStop(1, rgba(bottomColor, 0.6))

  ctx.fillStyle = grad
  ctx.fillRect(0, 0, w, h)

  // Stars in later phases
  if (progress > 0.5) {
    const starAlpha = (progress - 0.5) * 2
    for (let i = 0; i < 60; i++) {
      const sx = ((i * 137.5) % w)
      const sy = ((i * 97.3) % (h * 0.4))
      const flicker = 0.4 + 0.6 * Math.sin(time * 0.8 + i * 2.1)
      ctx.beginPath()
      ctx.arc(sx, sy, 0.5 + Math.sin(i) * 0.5, 0, Math.PI * 2)
      ctx.fillStyle = rgba([255, 255, 220], starAlpha * flicker)
      ctx.fill()
    }
  }
}

function drawAurora(ctx: CanvasRenderingContext2D, w: number, h: number, progress: number, time: number) {
  if (progress < 0.25) return
  const alpha = Math.min(1, (progress - 0.25) * 1.5) * 0.15

  for (let band = 0; band < 3; band++) {
    ctx.beginPath()
    const yBase = h * (0.1 + band * 0.08)
    ctx.moveTo(0, yBase)
    for (let x = 0; x <= w; x += 10) {
      const y = yBase + Math.sin(x * 0.005 + time * 0.3 + band * 1.5) * 30
        + Math.sin(x * 0.01 + time * 0.5) * 15
      ctx.lineTo(x, y)
    }
    ctx.lineTo(w, yBase + 60)
    ctx.lineTo(0, yBase + 60)
    ctx.closePath()

    const hues = [140, 180, 280]
    ctx.fillStyle = `hsla(${hues[band]}, 70%, 60%, ${alpha})`
    ctx.fill()
  }
}

function drawTerrain(ctx: CanvasRenderingContext2D, w: number, h: number, progress: number, time: number) {
  const layers = Math.min(4, Math.floor(progress * 5) + 1)
  const colors = [
    [30, 60, 30],
    [40, 80, 40],
    [50, 100, 50],
    [35, 75, 45],
  ]
  const darks = [
    [15, 35, 20],
    [20, 45, 25],
    [25, 55, 30],
    [18, 40, 22],
  ]

  for (let i = 0; i < layers; i++) {
    const layerProgress = Math.min(1, (progress * 5 - i) * 2)
    if (layerProgress <= 0) continue

    const baseY = h * (0.55 + i * 0.1)
    const amplitude = 30 + i * 10
    const freq = 0.003 + i * 0.001
    const speed = 0.15 + i * 0.05

    ctx.beginPath()
    ctx.moveTo(0, h)
    for (let x = 0; x <= w; x += 4) {
      const y = baseY
        + Math.sin(x * freq + time * speed) * amplitude
        + Math.sin(x * freq * 2.5 + time * speed * 0.7 + i) * (amplitude * 0.4)
      ctx.lineTo(x, y)
    }
    ctx.lineTo(w, h)
    ctx.closePath()

    const grad = ctx.createLinearGradient(0, baseY - amplitude, 0, h)
    grad.addColorStop(0, rgba(colors[i], 0.7 * layerProgress))
    grad.addColorStop(1, rgba(darks[i], 0.9 * layerProgress))
    ctx.fillStyle = grad
    ctx.fill()
  }
}

function drawParticles(
  ctx: CanvasRenderingContext2D,
  particles: Particle[],
  w: number,
  h: number,
  time: number,
  progress: number,
  breathScale: number
) {
  const constellation = progress > 0.75

  for (let i = 0; i < particles.length; i++) {
    const p = particles[i]

    // Update position
    p.x += p.vx + Math.sin(time * 0.5 + p.phase) * 0.2
    p.y += p.vy + Math.cos(time * 0.3 + p.phase) * 0.15

    // Wrap
    if (p.x < -10) p.x = w + 10
    if (p.x > w + 10) p.x = -10
    if (p.y < -10) p.y = h + 10
    if (p.y > h + 10) p.y = -10

    // Draw glow
    const pulseR = p.r * (1 + Math.sin(time + p.phase) * 0.3) * breathScale
    const grad = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, pulseR * 3)
    grad.addColorStop(0, `hsla(${p.hue}, 80%, ${p.brightness * 80}%, 0.6)`)
    grad.addColorStop(0.5, `hsla(${p.hue}, 70%, ${p.brightness * 60}%, 0.2)`)
    grad.addColorStop(1, `hsla(${p.hue}, 60%, ${p.brightness * 40}%, 0)`)

    ctx.beginPath()
    ctx.arc(p.x, p.y, pulseR * 3, 0, Math.PI * 2)
    ctx.fillStyle = grad
    ctx.fill()

    // Core
    ctx.beginPath()
    ctx.arc(p.x, p.y, pulseR * 0.5, 0, Math.PI * 2)
    ctx.fillStyle = `hsla(${p.hue}, 90%, 85%, 0.9)`
    ctx.fill()

    // Constellation lines
    if (constellation) {
      for (let j = i + 1; j < particles.length; j++) {
        const q = particles[j]
        const dx = p.x - q.x
        const dy = p.y - q.y
        const dist = Math.sqrt(dx * dx + dy * dy)
        if (dist < 120) {
          ctx.beginPath()
          ctx.moveTo(p.x, p.y)
          ctx.lineTo(q.x, q.y)
          ctx.strokeStyle = `rgba(255,215,100,${(1 - dist / 120) * 0.15})`
          ctx.lineWidth = 0.5
          ctx.stroke()
        }
      }
    }
  }
}

function drawCentralGlow(ctx: CanvasRenderingContext2D, w: number, h: number, progress: number, time: number, breathScale: number) {
  if (progress < 0.5) return
  const intensity = (progress - 0.5) * 2
  const radius = (w * 0.3 + Math.sin(time * 0.5) * 20) * intensity * breathScale
  const cx = w / 2
  const cy = h * 0.45

  const grad = ctx.createRadialGradient(cx, cy, 0, cx, cy, radius)
  grad.addColorStop(0, `rgba(255,200,80,${0.15 * intensity})`)
  grad.addColorStop(0.4, `rgba(255,180,60,${0.08 * intensity})`)
  grad.addColorStop(1, 'rgba(255,180,60,0)')

  ctx.fillStyle = grad
  ctx.fillRect(0, 0, w, h)
}

function drawDome(ctx: CanvasRenderingContext2D, w: number, h: number, progress: number, time: number, breathScale: number) {
  if (progress < 0.5) return
  const intensity = (progress - 0.5) * 2
  const cx = w / 2
  const cy = h * 0.9
  const rx = (w * 0.45) * breathScale
  const ry = (h * 0.7) * breathScale

  ctx.beginPath()
  ctx.ellipse(cx, cy, rx, ry, 0, Math.PI, 0)
  ctx.strokeStyle = `rgba(255,220,130,${0.12 * intensity})`
  ctx.lineWidth = 2
  ctx.stroke()

  // Second ring
  ctx.beginPath()
  ctx.ellipse(cx, cy, rx * 1.05, ry * 1.05, 0, Math.PI, 0)
  ctx.strokeStyle = `rgba(255,220,130,${0.06 * intensity})`
  ctx.lineWidth = 1
  ctx.stroke()
}

function drawBranches(ctx: CanvasRenderingContext2D, w: number, h: number, progress: number, time: number) {
  if (progress < 0.75) return
  const branchAlpha = (progress - 0.75) * 4

  function drawBranch(x: number, y: number, angle: number, length: number, depth: number) {
    if (depth === 0 || length < 2) return
    const endX = x + Math.cos(angle) * length
    const endY = y + Math.sin(angle) * length
    ctx.strokeStyle = `rgba(255,215,100,${(0.15 + depth * 0.06) * branchAlpha})`
    ctx.lineWidth = depth * 0.7
    ctx.beginPath()
    ctx.moveTo(x, y)
    ctx.lineTo(endX, endY)
    ctx.stroke()
    drawBranch(endX, endY, angle - 0.45 + Math.sin(time * 0.3) * 0.08, length * 0.68, depth - 1)
    drawBranch(endX, endY, angle + 0.45 + Math.cos(time * 0.3) * 0.08, length * 0.68, depth - 1)
  }

  // Two branch points
  drawBranch(w * 0.2, h, -Math.PI / 2 - 0.2, 50 * branchAlpha, 7)
  drawBranch(w * 0.8, h, -Math.PI / 2 + 0.2, 50 * branchAlpha, 7)
  drawBranch(w * 0.5, h, -Math.PI / 2, 40 * branchAlpha, 6)
}

function drawLightRays(ctx: CanvasRenderingContext2D, w: number, h: number, progress: number, time: number) {
  if (progress < 0.75) return
  const intensity = (progress - 0.75) * 4

  for (let i = 0; i < 5; i++) {
    const cx = w * (0.2 + i * 0.15)
    const topY = 0
    const spread = 30 + Math.sin(time * 0.2 + i * 1.3) * 10

    ctx.beginPath()
    ctx.moveTo(cx, topY)
    ctx.lineTo(cx - spread, h * 0.7)
    ctx.lineTo(cx + spread, h * 0.7)
    ctx.closePath()

    const grad = ctx.createLinearGradient(cx, topY, cx, h * 0.7)
    grad.addColorStop(0, `rgba(255,240,200,${0.06 * intensity})`)
    grad.addColorStop(1, 'rgba(255,240,200,0)')
    ctx.fillStyle = grad
    ctx.fill()
  }
}

// ─── SanctuaryCanvas component ───────────────────────────────────────
function SanctuaryCanvas({
  progress,
  canvasRef,
}: {
  progress: number
  canvasRef?: React.RefObject<HTMLCanvasElement | null>
}) {
  const internalRef = useRef<HTMLCanvasElement | null>(null)
  const ref = (canvasRef || internalRef) as React.RefObject<HTMLCanvasElement | null>
  const particlesRef = useRef<Particle[]>([])
  const animRef = useRef<number>(0)

  const draw = useCallback(() => {
    const canvas = ref.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    const dpr = window.devicePixelRatio || 1
    const rect = canvas.getBoundingClientRect()
    const w = rect.width
    const h = rect.height

    if (canvas.width !== w * dpr || canvas.height !== h * dpr) {
      canvas.width = w * dpr
      canvas.height = h * dpr
      ctx.scale(dpr, dpr)
    }

    const time = performance.now() / 1000
    const breathScale = 1 + Math.sin(time * 0.4) * 0.015

    // Manage particles
    const phase = progress < 0.25 ? 0 : progress < 0.5 ? 1 : progress < 0.75 ? 2 : 3
    const targetCount = phase === 0 ? 0 : phase === 1 ? 25 : phase === 2 ? 40 : 50
    while (particlesRef.current.length < targetCount) {
      particlesRef.current.push(createParticle(w, h, phase >= 2))
    }

    ctx.clearRect(0, 0, w, h)
    ctx.save()

    // Breathing transform
    const cx = w / 2, cy = h / 2
    ctx.translate(cx, cy)
    ctx.scale(breathScale, breathScale)
    ctx.translate(-cx, -cy)

    drawSky(ctx, w, h, progress, time)
    drawAurora(ctx, w, h, progress, time)
    drawLightRays(ctx, w, h, progress, time)
    drawCentralGlow(ctx, w, h, progress, time, breathScale)
    drawDome(ctx, w, h, progress, time, breathScale)
    drawTerrain(ctx, w, h, progress, time)
    drawBranches(ctx, w, h, progress, time)

    if (particlesRef.current.length > 0) {
      drawParticles(ctx, particlesRef.current, w, h, time, progress, breathScale)
    }

    ctx.restore()

    animRef.current = requestAnimationFrame(draw)
  }, [progress, ref])

  useEffect(() => {
    animRef.current = requestAnimationFrame(draw)
    return () => cancelAnimationFrame(animRef.current)
  }, [draw])

  return (
    <canvas
      ref={ref as React.LegacyRef<HTMLCanvasElement>}
      className="absolute inset-0 w-full h-full"
      style={{ display: 'block' }}
    />
  )
}

// ─── Main component ──────────────────────────────────────────────────
export default function SafePlace() {
  const [currentCategoryIndex, setCurrentCategoryIndex] = useState(0)
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0)
  const [hasStarted, setHasStarted] = useState(false)
  const [hasCompleted, setHasCompleted] = useState(false)
  const canvasRef = useRef<HTMLCanvasElement>(null)

  const flatPrompts = useMemo(
    () =>
      SAFE_PLACE_PROMPTS.flatMap((group) =>
        group.questions.map((question) => ({
          category: group.category,
          question,
        }))
      ),
    []
  )

  const totalQuestions = flatPrompts.length
  const [responses, setResponses] = useState<string[]>(() => Array(totalQuestions).fill(''))

  const currentCategory = SAFE_PLACE_PROMPTS[currentCategoryIndex]
  const currentQuestion = currentCategory.questions[currentQuestionIndex]
  const currentQuestionNumber =
    SAFE_PLACE_PROMPTS.slice(0, currentCategoryIndex).reduce(
      (sum, category) => sum + category.questions.length,
      0
    ) +
    currentQuestionIndex +
    1

  const globalQuestionIndex = useMemo(() => currentQuestionNumber - 1, [currentQuestionNumber])

  const progress = currentQuestionNumber / totalQuestions

  const updateResponse = (value: string) => {
    setResponses((prev) => {
      const next = [...prev]
      next[globalQuestionIndex] = value
      return next
    })
  }

  const nextQuestion = () => {
    if (currentQuestionIndex < currentCategory.questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1)
    } else if (currentCategoryIndex < SAFE_PLACE_PROMPTS.length - 1) {
      setCurrentCategoryIndex(currentCategoryIndex + 1)
      setCurrentQuestionIndex(0)
    }
  }

  const prevQuestion = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(currentQuestionIndex - 1)
    } else if (currentCategoryIndex > 0) {
      const prevCategoryIndex = currentCategoryIndex - 1
      setCurrentCategoryIndex(prevCategoryIndex)
      setCurrentQuestionIndex(SAFE_PLACE_PROMPTS[prevCategoryIndex].questions.length - 1)
    }
  }

  const resetVisualization = () => {
    setCurrentCategoryIndex(0)
    setCurrentQuestionIndex(0)
    setHasStarted(false)
    setHasCompleted(false)
    setResponses(Array(totalQuestions).fill(''))
  }

  const isLastQuestion =
    currentCategoryIndex === SAFE_PLACE_PROMPTS.length - 1 &&
    currentQuestionIndex === currentCategory.questions.length - 1
  const isFirstQuestion = currentCategoryIndex === 0 && currentQuestionIndex === 0

  const summaryKeywords = useMemo(() => {
    const allWords = responses
      .join(' ')
      .toLowerCase()
      .split(/\W+/)
      .filter((word) => word.length > 4 && !['place', 'there', 'their', 'about'].includes(word))
    const unique: string[] = []
    for (const word of allWords) {
      if (!unique.includes(word)) {
        unique.push(word)
      }
      if (unique.length === 6) break
    }
    return unique
  }, [responses])

  const summaryText = useMemo(() => {
    return flatPrompts
      .map((prompt, index) => {
        const response = responses[index]?.trim()
        return `${prompt.category}\n${prompt.question}\n${response || '(no response recorded)'}`.trim()
      })
      .join('\n\n')
  }, [flatPrompts, responses])

  const downloadSummary = () => {
    const blob = new Blob([`Safe Place Visualization\n\n${summaryText}`], { type: 'text/plain' })
    const url = URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    link.download = 'safe-place-visualization.txt'
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    URL.revokeObjectURL(url)
  }

  const saveAsImage = () => {
    const canvas = canvasRef.current
    if (!canvas) return
    const url = canvas.toDataURL('image/png')
    const link = document.createElement('a')
    link.href = url
    link.download = 'my-safe-place.png'
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  const mailtoHref = useMemo(() => {
    const body = encodeURIComponent(`My safe place visualization:\n\n${summaryText}`)
    return `mailto:?subject=Safe%20Place%20Visualization&body=${body}`
  }, [summaryText])

  // ─── Summary screen ─────────────────────────────────────────────
  if (hasCompleted) {
    return (
      <div className="relative w-full min-h-[600px] rounded-2xl overflow-hidden">
        <SanctuaryCanvas progress={1} canvasRef={canvasRef} />
        <div className="relative z-10 p-4">
          <Card className="mx-auto max-w-xl bg-white/20 backdrop-blur-xl border-white/20 shadow-2xl">
            <CardHeader className="text-center">
              <CardTitle className="text-white drop-shadow-lg">Your Safe Place</CardTitle>
              <CardDescription className="text-white/80">
                A snapshot of the sanctuary you created — keep it close for when you need calm.
              </CardDescription>
            </CardHeader>

            <CardContent className="space-y-6">
              <div className="rounded-xl bg-white/15 backdrop-blur-md p-5 shadow-inner border border-white/10">
                <div className="mb-3 flex items-center gap-2 text-sm font-semibold text-amber-200">
                  <Sparkles size={18} />
                  Signature details
                </div>
                <div className="grid gap-3 sm:grid-cols-2">
                  {summaryKeywords.length ? (
                    summaryKeywords.map((word) => (
                      <span
                        key={word}
                        className="rounded-full bg-white/20 backdrop-blur-sm px-3 py-1 text-sm font-medium text-white shadow-sm"
                      >
                        {word}
                      </span>
                    ))
                  ) : (
                    <p className="text-sm text-white/70">
                      Spend more time with the prompts to build a richer description.
                    </p>
                  )}
                </div>
              </div>

              <div className="space-y-4 max-h-60 overflow-y-auto pr-1">
                {SAFE_PLACE_PROMPTS.map((group) => (
                  <div key={group.category} className="rounded-lg bg-white/10 backdrop-blur-sm p-4 border border-white/10">
                    <p className="mb-3 text-sm font-semibold text-amber-200 uppercase tracking-wide">
                      {group.category}
                    </p>
                    <div className="space-y-2 text-sm text-white/90">
                      {group.questions.map((question) => {
                        const index = flatPrompts.findIndex(
                          (prompt) => prompt.category === group.category && prompt.question === question
                        )
                        return (
                          <div key={question}>
                            <p className="font-medium text-white">{question}</p>
                            <p className="whitespace-pre-wrap text-white/70">
                              {responses[index]?.trim() || '...'}
                            </p>
                          </div>
                        )
                      })}
                    </div>
                  </div>
                ))}
              </div>

              <div className="flex flex-col gap-3 sm:flex-row">
                <Button onClick={saveAsImage} variant="calm" className="flex-1 items-center gap-2">
                  <ImageDown size={16} />
                  Save artwork
                </Button>
                <Button onClick={downloadSummary} variant="calm" className="flex-1 items-center gap-2">
                  <Download size={16} />
                  Download notes
                </Button>
              </div>

              <div className="flex flex-col gap-3 sm:flex-row">
                <a
                  href={mailtoHref}
                  className="flex flex-1 items-center justify-center gap-2 rounded-md border border-white/20 bg-white/10 px-4 py-2 text-sm font-medium text-white transition hover:bg-white/20"
                >
                  <Mail size={16} />
                  Email to yourself
                </a>
              </div>

              <div className="text-center">
                <Button onClick={resetVisualization} variant="ghost" className="text-white/70 hover:text-white">
                  <RefreshCw size={16} className="mr-2" />
                  Start a new safe place
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    )
  }

  // ─── Start screen ───────────────────────────────────────────────
  if (!hasStarted) {
    return (
      <div className="relative w-full min-h-[500px] rounded-2xl overflow-hidden">
        <SanctuaryCanvas progress={0.02} />
        <div className="relative z-10 flex items-center justify-center min-h-[500px] p-4">
          <Card className="max-w-md bg-white/20 backdrop-blur-xl border-white/20 shadow-2xl">
            <CardHeader className="text-center">
              <CardTitle className="text-white drop-shadow-lg">Safe Place Visualization</CardTitle>
              <CardDescription className="text-white/80">
                Create a mental sanctuary you can visit anytime
              </CardDescription>
            </CardHeader>

            <CardContent className="space-y-6">
              <div className="bg-white/10 backdrop-blur-sm p-6 rounded-lg text-center border border-white/10">
                <motion.div
                  className="w-16 h-16 bg-white/15 rounded-full flex items-center justify-center mx-auto mb-4"
                  animate={{ y: [0, -4, 0] }}
                  transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
                >
                  <MapPin className="w-8 h-8 text-amber-200" />
                </motion.div>
                <p className="text-white/90 leading-relaxed mb-4">
                  This guided visualization will help you create a detailed mental image
                  of a safe, peaceful place. Watch your sanctuary come to life as you answer each question.
                </p>
              </div>

              <div className="bg-white/10 backdrop-blur-sm p-4 rounded-lg border border-white/10">
                <p className="text-sm text-amber-200 font-medium mb-2">What you&rsquo;ll do:</p>
                <ul className="text-sm text-white/80 space-y-1">
                  <li>• Answer guided questions about your safe place</li>
                  <li>• Watch your sanctuary grow with each answer</li>
                  <li>• Create a detailed mental & visual sanctuary</li>
                  <li>• Save your artwork and notes when complete</li>
                </ul>
              </div>

              <div className="text-center">
                <Button onClick={() => setHasStarted(true)} variant="grounding" size="lg" className="w-full">
                  Begin Visualization
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    )
  }

  // ─── Question screen ───────────────────────────────────────────
  return (
    <div className="relative w-full min-h-[600px] rounded-2xl overflow-hidden">
      <SanctuaryCanvas progress={progress} canvasRef={canvasRef} />
      <div className="relative z-10 flex items-center justify-center min-h-[600px] p-4">
        <Card className="max-w-md w-full bg-white/15 backdrop-blur-xl border-white/20 shadow-2xl">
          <CardHeader className="text-center pb-3">
            <CardTitle className="text-white drop-shadow-lg text-lg">Safe Place Visualization</CardTitle>
            <CardDescription className="text-white/70">
              Question {currentQuestionNumber} of {totalQuestions}
            </CardDescription>
          </CardHeader>

          <CardContent className="space-y-5">
            {/* Progress — integrated thin line */}
            <div className="w-full bg-white/10 rounded-full h-1">
              <div
                className="bg-amber-300/70 h-1 rounded-full transition-all duration-700 ease-out"
                style={{ width: `${(currentQuestionNumber / totalQuestions) * 100}%` }}
              />
            </div>

            {/* Category */}
            <div className="text-center">
              <div className="inline-block px-3 py-1 bg-white/15 text-amber-200 rounded-full text-sm font-medium border border-white/10">
                {currentCategory.category}
              </div>
            </div>

            {/* Question */}
            <div className="bg-white/10 backdrop-blur-sm rounded-lg p-5 text-center overflow-hidden min-h-[80px] flex items-center justify-center border border-white/10">
              <AnimatePresence mode="wait">
                <motion.p
                  key={`${currentCategoryIndex}-${currentQuestionIndex}`}
                  className="text-lg text-white leading-relaxed font-medium drop-shadow"
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -8 }}
                  transition={{ duration: 0.35, ease: 'easeOut' }}
                >
                  {currentQuestion}
                </motion.p>
              </AnimatePresence>
            </div>

            {/* Textarea */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-white/70">
                Take time to visualize and reflect:
              </label>
              <textarea
                className="w-full p-3 bg-white/10 backdrop-blur-sm border border-white/20 rounded-md text-white placeholder-white/40 focus:ring-2 focus:ring-amber-300/50 focus:border-amber-300/30 resize-none"
                rows={4}
                placeholder="Close your eyes and imagine... What do you see, hear, feel?"
                value={responses[globalQuestionIndex] || ''}
                onChange={(event) => updateResponse(event.target.value)}
              />
            </div>

            {/* Tip */}
            <div className="bg-white/8 backdrop-blur-sm border border-white/10 rounded-lg p-3">
              <p className="text-sm text-white/70">
                💡 <strong className="text-white/90">Tip:</strong> Take your time. Close your eyes and really
                experience this place with all your senses before moving on.
              </p>
            </div>

            {/* Controls */}
            <div className="flex space-x-3">
              <Button
                onClick={prevQuestion}
                variant="outline"
                size="lg"
                className="flex-1 border-white/20 text-white hover:bg-white/10"
                disabled={isFirstQuestion}
              >
                Previous
              </Button>

              {!isLastQuestion ? (
                <Button onClick={nextQuestion} variant="grounding" size="lg" className="flex-1">
                  Next
                </Button>
              ) : (
                <Button onClick={() => setHasCompleted(true)} variant="grounding" size="lg" className="flex-1">
                  Complete
                </Button>
              )}
            </div>

            {/* Reset */}
            <div className="text-center">
              <Button
                onClick={resetVisualization}
                variant="ghost"
                size="sm"
                className="flex items-center space-x-2 text-white/50 hover:text-white/80"
              >
                <RefreshCw size={16} />
                <span>Start Over</span>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
