"use client"

import { useState, useEffect, useCallback } from 'react'
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { Play, Pause, RotateCcw, Timer } from 'lucide-react'
import { AnimatePresence, motion } from 'framer-motion'
import ShareInline from '@/components/ShareInline'

const PATTERN = [
  { phase: 'inhale', label: 'Inhale (4)', durationMs: 4000, color: '#3b82f6', ratio: 4 },
  { phase: 'hold', label: 'Hold (7)', durationMs: 7000, color: '#f59e0b', ratio: 7 },
  { phase: 'exhale', label: 'Exhale (8)', durationMs: 8000, color: '#14b8a6', ratio: 8 },
] as const

const TOTAL_RATIO = 4 + 7 + 8

function ArcGauge({ phaseIndex, progress, isActive }: { phaseIndex: number; progress: number; isActive: boolean }) {
  const size = 200
  const cx = size / 2
  const cy = size / 2
  const r = 80
  const strokeWidth = 18

  // Calculate arc segments based on 4:7:8 ratio
  const segments = PATTERN.map((p, i) => {
    const startAngle = PATTERN.slice(0, i).reduce((s, seg) => s + (seg.ratio / TOTAL_RATIO) * 360, 0) - 90
    const sweepAngle = (p.ratio / TOTAL_RATIO) * 360
    return { ...p, startAngle, sweepAngle, index: i }
  })

  const describeArc = (startAngle: number, endAngle: number) => {
    const startRad = (startAngle * Math.PI) / 180
    const endRad = (endAngle * Math.PI) / 180
    const x1 = cx + r * Math.cos(startRad)
    const y1 = cy + r * Math.sin(startRad)
    const x2 = cx + r * Math.cos(endRad)
    const y2 = cy + r * Math.sin(endRad)
    const large = endAngle - startAngle > 180 ? 1 : 0
    return `M ${x1} ${y1} A ${r} ${r} 0 ${large} 1 ${x2} ${y2}`
  }

  // Label positions
  const labelPos = (seg: typeof segments[number]) => {
    const midAngle = ((seg.startAngle + seg.sweepAngle / 2) * Math.PI) / 180
    return {
      x: cx + (r + 28) * Math.cos(midAngle),
      y: cy + (r + 28) * Math.sin(midAngle),
    }
  }

  return (
    <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} className="mx-auto">
      {/* Background segments */}
      {segments.map((seg) => (
        <path
          key={seg.phase}
          d={describeArc(seg.startAngle, seg.startAngle + seg.sweepAngle - 2)}
          fill="none"
          stroke={seg.index <= phaseIndex && isActive ? seg.color : '#e5e7eb'}
          strokeWidth={strokeWidth}
          strokeLinecap="round"
          opacity={seg.index < phaseIndex && isActive ? 1 : seg.index === phaseIndex && isActive ? 0.3 : 0.2}
        />
      ))}

      {/* Active fill */}
      {isActive && (
        <path
          d={describeArc(
            segments[phaseIndex].startAngle,
            segments[phaseIndex].startAngle + segments[phaseIndex].sweepAngle * (progress / 100) - 1
          )}
          fill="none"
          stroke={segments[phaseIndex].color}
          strokeWidth={strokeWidth}
          strokeLinecap="round"
        />
      )}

      {/* Filled previous segments */}
      {isActive && segments.filter((_, i) => i < phaseIndex).map((seg) => (
        <path
          key={`filled-${seg.phase}`}
          d={describeArc(seg.startAngle, seg.startAngle + seg.sweepAngle - 2)}
          fill="none"
          stroke={seg.color}
          strokeWidth={strokeWidth}
          strokeLinecap="round"
        />
      ))}

      {/* Ratio labels */}
      {segments.map((seg) => {
        const pos = labelPos(seg)
        return (
          <text
            key={`label-${seg.phase}`}
            x={pos.x}
            y={pos.y}
            textAnchor="middle"
            dominantBaseline="central"
            fill={seg.index === phaseIndex && isActive ? seg.color : '#9ca3af'}
            fontSize="14"
            fontWeight={seg.index === phaseIndex && isActive ? 'bold' : 'normal'}
          >
            {seg.ratio}
          </text>
        )
      })}
    </svg>
  )
}

export default function FourSevenEight() {
  const [isActive, setIsActive] = useState(false)
  const [phaseIndex, setPhaseIndex] = useState(0)
  const [cycleCount, setCycleCount] = useState(0)
  const [timeRemaining, setTimeRemaining] = useState<number>(PATTERN[0].durationMs)

  const next = useCallback(() => {
    setPhaseIndex((prev) => {
      const next = (prev + 1) % PATTERN.length
      if (next === 0) setCycleCount((c) => c + 1)
      setTimeRemaining(PATTERN[next].durationMs)
      return next
    })
  }, [])

  useEffect(() => {
    if (!isActive) return
    const id = setInterval(() => {
      setTimeRemaining((t) => {
        if (t <= 100) { next(); return PATTERN[(phaseIndex + 1) % PATTERN.length].durationMs }
        return t - 100
      })
    }, 100)
    return () => clearInterval(id)
  }, [isActive, phaseIndex, next])

  const reset = () => { setIsActive(false); setPhaseIndex(0); setCycleCount(0); setTimeRemaining(PATTERN[0].durationMs) }
  const current = PATTERN[phaseIndex]
  const progress = ((current.durationMs - timeRemaining) / current.durationMs) * 100

  return (
    <Card className="max-w-md mx-auto">
      <CardHeader className="text-center">
        <div className="flex items-center justify-center gap-2 mb-2">
          <Timer className="w-5 h-5 text-calm-600" />
          <CardTitle>4‑7‑8 Breathing</CardTitle>
        </div>
        <CardDescription>4s inhale • 7s hold • 8s exhale</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="flex flex-col items-center space-y-4">
          {/* Arc Gauge Visualization */}
          <div className="relative">
            <ArcGauge phaseIndex={phaseIndex} progress={progress} isActive={isActive} />
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="text-center">
                <div className="text-3xl font-bold" style={{ color: isActive ? current.color : '#6b7280' }}>
                  {Math.ceil(timeRemaining / 1000)}
                </div>
                <div className="text-xs text-gray-500 mt-1">seconds</div>
              </div>
            </div>
          </div>

          <div className="text-center">
            <div className="text-2xl font-semibold text-calm-800 dark:text-gray-100 mb-2 min-h-[32px]">
              <AnimatePresence mode="wait">
                <motion.span key={current.label} initial={{opacity:0,y:6}} animate={{opacity:1,y:0}} exit={{opacity:0,y:-6}} transition={{duration:0.25}}>
                  {current.label}
                </motion.span>
              </AnimatePresence>
            </div>
            <div className="text-sm text-gray-600 dark:text-gray-400">Cycle {cycleCount + 1}</div>
          </div>
          <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
            <div className="bg-sky-500 h-2 rounded-full transition-all duration-100 ease-linear" style={{ width: `${progress}%` }} />
          </div>
        </div>
        <div className="flex justify-center gap-3">
          <Button onClick={() => setIsActive(!isActive)} variant="calm" size="lg" className="flex items-center gap-2">
            {isActive ? <Pause size={18}/> : <Play size={18}/>} {isActive ? 'Pause' : 'Start'}
          </Button>
          <Button onClick={reset} variant="outline" size="lg" className="flex items-center gap-2"><RotateCcw size={18}/>Reset</Button>
        </div>
      </CardContent>
      <div className="px-6 pb-6 pt-0"><div className="pt-4 mt-2 border-t border-gray-100 dark:border-gray-800 space-y-3">
        <div className="text-xs text-gray-600 dark:text-gray-400 bg-gray-50 dark:bg-gray-800/50 border border-gray-200 dark:border-gray-700 p-3 rounded-xl">
          About: 4‑7‑8 uses a longer exhale to encourage parasympathetic activation. Keep breaths gentle; skip holds if dizzy.
          <br/>
          Evidence: Longer exhalation patterns are commonly used in clinical breathing interventions to downshift arousal.
        </div>
        <ShareInline title="4‑7‑8 Breathing" text="Practice 4‑7‑8 breathing on CalmMyself" />
      </div></div>
    </Card>
  )
}
