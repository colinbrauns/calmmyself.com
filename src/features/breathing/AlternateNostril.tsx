"use client"

import { useState, useEffect, useCallback } from 'react'
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { Play, Pause, RotateCcw, Shuffle } from 'lucide-react'
import BreathingCycle, { type BreathingPattern } from '@/components/BreathingCycle'
import { motion, AnimatePresence } from 'framer-motion'
import ShareInline from '@/components/ShareInline'

type Phase = 'inhaleL' | 'hold1' | 'exhaleR' | 'inhaleR' | 'hold2' | 'exhaleL'

const SEQ: { phase: Phase; label: string; duration: number }[] = [
  { phase: 'inhaleL', label: 'Inhale Left', duration: 4000 },
  { phase: 'hold1', label: 'Hold', duration: 4000 },
  { phase: 'exhaleR', label: 'Exhale Right', duration: 4000 },
  { phase: 'inhaleR', label: 'Inhale Right', duration: 4000 },
  { phase: 'hold2', label: 'Hold', duration: 4000 },
  { phase: 'exhaleL', label: 'Exhale Left', duration: 4000 },
]

// Map to BreathingCycle-compatible pattern
const BREATHING_PATTERN: BreathingPattern = [
  { phase: 'inhale', label: 'Inhale Left', durationMs: 4000 },
  { phase: 'hold1', label: 'Hold', durationMs: 4000 },
  { phase: 'exhale', label: 'Exhale Right', durationMs: 4000 },
  { phase: 'inhale', label: 'Inhale Right', durationMs: 4000 },
  { phase: 'hold2', label: 'Hold', durationMs: 4000 },
  { phase: 'exhale', label: 'Exhale Left', durationMs: 4000 },
]

export default function AlternateNostril() {
  const [isActive, setIsActive] = useState(false)
  const [index, setIndex] = useState(0)
  const [cycleCount, setCycleCount] = useState(0)
  const [remaining, setRemaining] = useState(SEQ[0].duration)

  const next = useCallback(() => {
    setIndex((prev) => {
      const next = (prev + 1) % SEQ.length
      if (next === 0) setCycleCount((c) => c + 1)
      setRemaining(SEQ[next].duration)
      return next
    })
  }, [])

  useEffect(() => {
    if (!isActive) return
    const id = setInterval(() => {
      setRemaining((t) => {
        if (t <= 100) { next(); return SEQ[(index + 1) % SEQ.length].duration }
        return t - 100
      })
    }, 100)
    return () => clearInterval(id)
  }, [isActive, index, next])

  const reset = () => { setIsActive(false); setIndex(0); setCycleCount(0); setRemaining(SEQ[0].duration) }
  const current = SEQ[index]
  const progress = ((current.duration - remaining) / current.duration) * 100

  const leftActive = current.phase === 'inhaleL' || current.phase === 'exhaleL'
  const rightActive = current.phase === 'inhaleR' || current.phase === 'exhaleR'
  const isInhale = current.phase === 'inhaleL' || current.phase === 'inhaleR'
  const isExhale = current.phase === 'exhaleL' || current.phase === 'exhaleR'

  // Airflow direction: inhale = into nose (downward dash offset), exhale = out of nose (upward)
  const leftFlowing = current.phase === 'inhaleL' || current.phase === 'exhaleL'
  const rightFlowing = current.phase === 'inhaleR' || current.phase === 'exhaleR'

  return (
    <Card className="max-w-md mx-auto">
      <CardHeader className="text-center">
        <div className="flex items-center justify-center gap-2 mb-2">
          <Shuffle className="w-5 h-5 text-grounding-600" />
          <CardTitle>Alternate Nostril Breathing</CardTitle>
        </div>
        <CardDescription>Balanced pattern to calm and focus</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Nose visualization with airflow */}
        <div className="flex flex-col items-center">
          <svg width={180} height={140} viewBox="0 0 180 140" aria-hidden="true" className="mb-2">
            {/* Nose shape - simplified geometric */}
            <path
              d="M90 20 C90 20, 70 60, 55 90 Q50 100, 55 108 L75 108 Q80 95, 90 90 Q100 95, 105 108 L125 108 Q130 100, 125 90 C110 60, 90 20, 90 20"
              fill="none"
              stroke="#d4a574"
              strokeWidth={2.5}
              opacity={0.6}
            />
            {/* Left nostril ellipse */}
            <ellipse
              cx={68}
              cy={102}
              rx={10}
              ry={6}
              fill={leftActive ? '#f59e0b' : '#e5e7eb'}
              stroke={leftActive ? '#d97706' : '#d1d5db'}
              strokeWidth={1.5}
              opacity={leftActive ? 1 : 0.5}
            />
            {/* Right nostril ellipse */}
            <ellipse
              cx={112}
              cy={102}
              rx={10}
              ry={6}
              fill={rightActive ? '#f59e0b' : '#e5e7eb'}
              stroke={rightActive ? '#d97706' : '#d1d5db'}
              strokeWidth={1.5}
              opacity={rightActive ? 1 : 0.5}
            />

            {/* L and R labels */}
            <text x={68} y={128} textAnchor="middle" className="fill-grounding-600 text-xs font-semibold" fontSize={13}>L</text>
            <text x={112} y={128} textAnchor="middle" className="fill-grounding-600 text-xs font-semibold" fontSize={13}>R</text>

            {/* Airflow lines - left nostril */}
            {isActive && leftFlowing && (
              <g>
                <motion.line
                  x1={62} y1={108} x2={52} y2={135}
                  stroke="#f59e0b"
                  strokeWidth={2}
                  strokeDasharray="4 4"
                  initial={{ strokeDashoffset: 0 }}
                  animate={{ strokeDashoffset: current.phase === 'inhaleL' ? -30 : 30 }}
                  transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                  opacity={0.7}
                />
                <motion.line
                  x1={68} y1={108} x2={68} y2={138}
                  stroke="#f59e0b"
                  strokeWidth={2}
                  strokeDasharray="4 4"
                  initial={{ strokeDashoffset: 0 }}
                  animate={{ strokeDashoffset: current.phase === 'inhaleL' ? -30 : 30 }}
                  transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                  opacity={0.7}
                />
                <motion.line
                  x1={74} y1={108} x2={84} y2={135}
                  stroke="#f59e0b"
                  strokeWidth={2}
                  strokeDasharray="4 4"
                  initial={{ strokeDashoffset: 0 }}
                  animate={{ strokeDashoffset: current.phase === 'inhaleL' ? -30 : 30 }}
                  transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                  opacity={0.7}
                />
              </g>
            )}

            {/* Airflow lines - right nostril */}
            {isActive && rightFlowing && (
              <g>
                <motion.line
                  x1={106} y1={108} x2={96} y2={135}
                  stroke="#f59e0b"
                  strokeWidth={2}
                  strokeDasharray="4 4"
                  initial={{ strokeDashoffset: 0 }}
                  animate={{ strokeDashoffset: current.phase === 'inhaleR' ? -30 : 30 }}
                  transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                  opacity={0.7}
                />
                <motion.line
                  x1={112} y1={108} x2={112} y2={138}
                  stroke="#f59e0b"
                  strokeWidth={2}
                  strokeDasharray="4 4"
                  initial={{ strokeDashoffset: 0 }}
                  animate={{ strokeDashoffset: current.phase === 'inhaleR' ? -30 : 30 }}
                  transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                  opacity={0.7}
                />
                <motion.line
                  x1={118} y1={108} x2={128} y2={135}
                  stroke="#f59e0b"
                  strokeWidth={2}
                  strokeDasharray="4 4"
                  initial={{ strokeDashoffset: 0 }}
                  animate={{ strokeDashoffset: current.phase === 'inhaleR' ? -30 : 30 }}
                  transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                  opacity={0.7}
                />
              </g>
            )}
          </svg>
        </div>

        {/* Breathing orb with timer */}
        <div className="flex flex-col items-center space-y-4">
          <div className="relative w-32 h-32 flex items-center justify-center">
            <BreathingCycle
              pattern={BREATHING_PATTERN}
              isActive={isActive}
              cycleIndex={index}
              onCycle={(n) => setIndex(n)}
              size={96}
              colors={{ from: 'from-grounding-300', to: 'to-grounding-500' }}
              scaleMin={1}
              scaleMax={1.4}
            />
            <div className="absolute text-white font-medium text-sm select-none">
              {Math.ceil(remaining / 1000)}
            </div>
          </div>

          {/* Labels */}
          <div className="text-center">
            <div className="text-2xl font-semibold text-grounding-800 mb-2 min-h-[32px]">
              <AnimatePresence mode="wait">
                <motion.span key={current.label} initial={{opacity:0,y:6}} animate={{opacity:1,y:0}} exit={{opacity:0,y:-6}} transition={{duration:0.25}}>
                  {current.label}
                </motion.span>
              </AnimatePresence>
            </div>
            <div className="text-sm text-gray-600">Cycle {cycleCount + 1}</div>
          </div>

          <div className="w-full bg-grounding-100 rounded-full h-2">
            <div className="bg-grounding-500 h-2 rounded-full transition-all duration-100 ease-linear" style={{ width: `${progress}%` }} />
          </div>
        </div>

        <div className="flex justify-center gap-3">
          <Button onClick={() => setIsActive(!isActive)} variant="grounding" size="lg" className="flex items-center gap-2">
            {isActive ? <Pause size={18}/> : <Play size={18}/>} {isActive ? 'Pause' : 'Start'}
          </Button>
          <Button onClick={reset} variant="outline" size="lg" className="flex items-center gap-2"><RotateCcw size={18}/>Reset</Button>
        </div>

        <div className="text-xs text-gray-500 bg-grounding-50 border border-grounding-100 p-3 rounded-md">
          Tip: Use the right hand — thumb to gently close right nostril, ring finger to close left. Breathe softly.
        </div>
      </CardContent>
      <div className="px-6 pb-6 space-y-3">
        <div className="text-xs text-gray-600 bg-grounding-50 border border-grounding-100 p-3 rounded-md">
          About: Alternate nostril breathing (nadi shodhana) may help reduce perceived stress and improve attention in some studies. Breathe lightly.
          <br/>
          Evidence: Look up controlled trials on "alternate nostril breathing attention anxiety".
        </div>
        <ShareInline title="Alternate Nostril Breathing" text="Try alternate nostril breathing on CalmMyself" />
      </div>
    </Card>
  )
}
