"use client"

import { useState, useEffect, useCallback } from 'react'
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { Play, Pause, RotateCcw, Timer } from 'lucide-react'
import BreathingCycle, { type BreathingPattern } from '@/components/BreathingCycle'
import { AnimatePresence, motion } from 'framer-motion'
import ShareInline from '@/components/ShareInline'
import CelebrationAnimation from '@/components/CelebrationAnimation'

const PATTERN: BreathingPattern = [
  { phase: 'inhale', label: 'Inhale (4)', durationMs: 4000 },
  { phase: 'hold', label: 'Hold (7)', durationMs: 7000 },
  { phase: 'exhale', label: 'Exhale (8)', durationMs: 8000 },
]

// Arc segment helper: returns SVG arc path for a segment of a circle
function arcPath(cx: number, cy: number, r: number, startAngle: number, endAngle: number): string {
  const start = {
    x: cx + r * Math.cos(startAngle),
    y: cy + r * Math.sin(startAngle),
  }
  const end = {
    x: cx + r * Math.cos(endAngle),
    y: cy + r * Math.sin(endAngle),
  }
  const largeArc = endAngle - startAngle > Math.PI ? 1 : 0
  return `M ${start.x} ${start.y} A ${r} ${r} 0 ${largeArc} 1 ${end.x} ${end.y}`
}

// Segment definitions: 4/19 inhale, 7/19 hold, 8/19 exhale
const TOTAL = 19
const SEGMENTS = [
  { label: '4', fraction: 4 / TOTAL, color: '#3b82f6', activeColor: '#2563eb' }, // blue
  { label: '7', fraction: 7 / TOTAL, color: '#f59e0b', activeColor: '#d97706' }, // amber
  { label: '8', fraction: 8 / TOTAL, color: '#10b981', activeColor: '#059669' }, // green
]

export default function FourSevenEight() {
  const [isActive, setIsActive] = useState(false)
  const [phaseIndex, setPhaseIndex] = useState(0)
  const [cycleCount, setCycleCount] = useState(0)
  const [timeRemaining, setTimeRemaining] = useState(PATTERN[0].durationMs)
  const [showCelebration, setShowCelebration] = useState(false)

  const next = useCallback(() => {
    setPhaseIndex((prev) => {
      const next = (prev + 1) % PATTERN.length
      if (next === 0) {
        setCycleCount((c) => {
          const newCount = c + 1
          if (newCount === 4) {
            setShowCelebration(true)
            setTimeout(() => setShowCelebration(false), 3000)
          }
          return newCount
        })
      }
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

  // Arc segment rendering
  const arcR = 76
  const arcCx = 80
  const arcCy = 80
  const gap = 0.04 // small gap between segments in radians
  const startAngleBase = -Math.PI / 2 // start from top

  return (
    <>
      <CelebrationAnimation show={showCelebration} />
      <Card className="max-w-md mx-auto">
      <CardHeader className="text-center">
        <div className="flex items-center justify-center gap-2 mb-2">
          <Timer className="w-5 h-5 text-calm-600" />
          <CardTitle>4&#x2011;7&#x2011;8 Breathing</CardTitle>
        </div>
        <CardDescription>4s inhale • 7s hold • 8s exhale</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="flex flex-col items-center space-y-4">
          <div className="relative w-40 h-40 flex items-center justify-center">
            {/* Arc segments overlay */}
            <svg className="absolute" width={160} height={160} viewBox="0 0 160 160" aria-hidden="true">
              {(() => {
                let currentAngle = startAngleBase
                return SEGMENTS.map((seg, i) => {
                  const segStart = currentAngle + gap / 2
                  const segEnd = currentAngle + seg.fraction * Math.PI * 2 - gap / 2
                  const midAngle = (segStart + segEnd) / 2
                  const labelR = arcR + 2
                  const labelX = arcCx + labelR * Math.cos(midAngle)
                  const labelY = arcCy + labelR * Math.sin(midAngle)
                  const isActiveSegment = i === phaseIndex
                  currentAngle += seg.fraction * Math.PI * 2

                  return (
                    <g key={i}>
                      <path
                        d={arcPath(arcCx, arcCy, arcR, segStart, segEnd)}
                        fill="none"
                        stroke={isActiveSegment ? seg.activeColor : seg.color}
                        strokeWidth={isActiveSegment ? 5 : 3}
                        strokeLinecap="round"
                        opacity={isActiveSegment ? 1 : 0.3}
                      />
                      <text
                        x={labelX}
                        y={labelY}
                        textAnchor="middle"
                        dominantBaseline="central"
                        fill={isActiveSegment ? seg.activeColor : seg.color}
                        fontSize={11}
                        fontWeight={isActiveSegment ? 700 : 500}
                        opacity={isActiveSegment ? 1 : 0.5}
                      >
                        {seg.label}
                      </text>
                    </g>
                  )
                })
              })()}
            </svg>

            <BreathingCycle
              pattern={PATTERN}
              isActive={isActive}
              cycleIndex={phaseIndex}
              onCycle={(n) => setPhaseIndex(n)}
              size={112}
              colors={{ from: 'from-blue-300', to: 'to-blue-600' }}
              scaleMin={1}
              scaleMax={1.5}
            />
            <div className="absolute text-white font-medium text-sm select-none">{Math.ceil(timeRemaining/1000)}</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-semibold text-calm-800 mb-2 min-h-[32px]">
              <AnimatePresence mode="wait">
                <motion.span key={current.label} initial={{opacity:0,y:6}} animate={{opacity:1,y:0}} exit={{opacity:0,y:-6}} transition={{duration:0.25}}>
                  {current.label}
                </motion.span>
              </AnimatePresence>
            </div>
            <div className="text-sm text-gray-600">Cycle {cycleCount + 1}</div>
          </div>
          <div className="w-full bg-calm-100 rounded-full h-2">
            <div className="bg-calm-500 h-2 rounded-full transition-all duration-100 ease-linear" style={{ width: `${progress}%` }} />
          </div>
        </div>
        <div className="flex justify-center gap-3">
          <Button onClick={() => setIsActive(!isActive)} variant="calm" size="lg" className="flex items-center gap-2">
            {isActive ? <Pause size={18}/> : <Play size={18}/>} {isActive ? 'Pause' : 'Start'}
          </Button>
          <Button onClick={reset} variant="outline" size="lg" className="flex items-center gap-2"><RotateCcw size={18}/>Reset</Button>
        </div>
      </CardContent>
      <div className="px-6 pb-6 space-y-3">
        <div className="text-xs text-gray-600 bg-calm-50 border border-calm-100 p-3 rounded-md">
          About: 4&#x2011;7&#x2011;8 uses a longer exhale to encourage parasympathetic activation. Keep breaths gentle; skip holds if dizzy.
          <br/>
          Evidence: Longer exhalation patterns are commonly used in clinical breathing interventions to downshift arousal.
        </div>
        <ShareInline title="4&#x2011;7&#x2011;8 Breathing" text="Practice 4-7-8 breathing on CalmMyself" />
      </div>
    </Card>
    </>
  )
}
