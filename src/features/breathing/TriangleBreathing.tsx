"use client"

import { useState, useEffect, useCallback, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import ShareInline from '@/components/ShareInline'
import BreathingCycle, { type BreathingPattern } from '@/components/BreathingCycle'
import { Button } from '@/components/ui/Button'
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/Card'
import { Play, Pause, RotateCcw } from 'lucide-react'

type BreathingPhase = 'inhale' | 'hold' | 'exhale'

const PHASE_DURATION = { inhale: 4000, hold: 4000, exhale: 6000 }
const PHASE_LABELS = {
  inhale: 'Breathe In',
  hold: 'Hold',
  exhale: 'Breathe Out'
}

const PHASES: BreathingPhase[] = ['inhale', 'hold', 'exhale']

const PATTERN: BreathingPattern = [
  { phase: 'inhale', label: 'Breathe In', durationMs: 4000 },
  { phase: 'hold1', label: 'Hold', durationMs: 4000 },
  { phase: 'exhale', label: 'Breathe Out', durationMs: 6000 },
]

export default function TriangleBreathing() {
  const [isActive, setIsActive] = useState(false)
  const [currentPhase, setCurrentPhase] = useState<BreathingPhase>('inhale')
  const [phaseIndex, setPhaseIndex] = useState(0)
  const [cycleCount, setCycleCount] = useState(0)
  const [timeRemaining, setTimeRemaining] = useState(PHASE_DURATION.inhale)

  const nextPhase = useCallback(() => {
    setPhaseIndex((prev) => {
      const next = (prev + 1) % PHASES.length
      if (next === 0) setCycleCount((c) => c + 1)
      const newPhase = PHASES[next]
      setCurrentPhase(newPhase)
      setTimeRemaining(PHASE_DURATION[newPhase])
      return next
    })
  }, [])

  const reset = useCallback(() => {
    setIsActive(false)
    setCurrentPhase('inhale')
    setPhaseIndex(0)
    setCycleCount(0)
    setTimeRemaining(PHASE_DURATION.inhale)
  }, [])

  useEffect(() => {
    let interval: NodeJS.Timeout | null = null

    if (isActive) {
      interval = setInterval(() => {
        setTimeRemaining((time) => {
          if (time <= 100) {
            nextPhase()
            return PHASE_DURATION[PHASES[(phaseIndex + 1) % PHASES.length]]
          }
          return time - 100
        })
      }, 100)
    }

    return () => {
      if (interval) clearInterval(interval)
    }
  }, [isActive, nextPhase, phaseIndex])

  const currentPhaseDuration = PHASE_DURATION[currentPhase]
  const progress = ((currentPhaseDuration - timeRemaining) / currentPhaseDuration) * 100

  // SVG triangle path tracing to visually match 4-4-6 timing
  const pathRef = useRef<SVGPathElement | null>(null)
  const [pathLen, setPathLen] = useState(300)

  useEffect(() => {
    if (pathRef.current) {
      try {
        const len = pathRef.current.getTotalLength()
        if (Number.isFinite(len) && len > 0) setPathLen(len)
      } catch {}
    }
  }, [])

  const phaseStartEnd = () => {
    switch (currentPhase) {
      case 'inhale': return [0, 1 / 3] as const
      case 'hold': return [1 / 3, 1 / 3] as const // no movement
      case 'exhale': return [1 / 3, 1] as const
      default: return [0, 0] as const
    }
  }

  const [startFrac, endFrac] = phaseStartEnd()
  const startOffset = pathLen * (1 - startFrac)
  const endOffset = pathLen * (1 - endFrac)

  return (
    <Card className="max-w-md mx-auto">
      <CardHeader className="text-center">
        <CardTitle>Triangle Breathing</CardTitle>
        <CardDescription>
          4-4-6 pattern for relaxation and stress relief
        </CardDescription>
      </CardHeader>

      <CardContent className="space-y-6 pb-6">
        {/* Breathing Visual */}
        <div className="flex flex-col items-center space-y-4">
          <div className="relative" style={{ width: 192, height: 192 }}>
            <svg className="absolute" width={192} height={192} viewBox="0 0 168 168" aria-hidden="true">
              <defs>
                <linearGradient id="triGrad" x1="0" y1="0" x2="1" y2="1">
                  <stop offset="0%" stopColor="#fcd34d" stopOpacity="0.9" />
                  <stop offset="100%" stopColor="#f59e0b" stopOpacity="0.9" />
                </linearGradient>
                <filter id="triGlow" x="-50%" y="-50%" width="200%" height="200%">
                  <feGaussianBlur in="SourceGraphic" stdDeviation="3" result="blur" />
                  <feMerge>
                    <feMergeNode in="blur" />
                    <feMergeNode in="SourceGraphic" />
                  </feMerge>
                </filter>
              </defs>
              {/* Track */}
              <path
                d="M84 18 L148 138 L20 138 Z"
                fill="none"
                stroke="rgba(16,24,16,0.12)"
                strokeWidth={5}
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              {/* Animated progress */}
              <motion.path
                key={`${currentPhase}-${phaseIndex}-${currentPhaseDuration}`}
                ref={pathRef}
                d="M84 18 L148 138 L20 138 Z"
                fill="none"
                stroke="url(#triGrad)"
                strokeWidth={5}
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeDasharray={pathLen}
                initial={{ strokeDashoffset: startOffset }}
                animate={{ strokeDashoffset: endOffset }}
                transition={{ duration: isActive ? currentPhaseDuration / 1000 : 0, ease: 'linear' }}
                filter="url(#triGlow)"
              />
              {/* Pulsing opacity during hold phase */}
              {isActive && currentPhase === 'hold' && (
                <motion.path
                  d="M84 18 L148 138 L20 138 Z"
                  fill="none"
                  stroke="url(#triGrad)"
                  strokeWidth={5}
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeDasharray={pathLen}
                  strokeDashoffset={pathLen * (1 - 1 / 3)}
                  initial={{ opacity: 0.4 }}
                  animate={{ opacity: [0.4, 0.9, 0.4] }}
                  transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
                  filter="url(#triGlow)"
                />
              )}
            </svg>
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
              <div className="text-grounding-900 font-semibold text-sm text-center select-none bg-white/80 rounded px-2 py-0.5">
                {Math.ceil(timeRemaining / 1000)}
              </div>
            </div>
          </div>

          {/* Phase Indicator */}
          <div className="text-center">
            <div className="text-2xl font-semibold text-grounding-800 mb-2 min-h-[32px]">
              <AnimatePresence mode="wait">
                <motion.span
                  key={currentPhase}
                  initial={{ opacity: 0, y: 6 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -6 }}
                  transition={{ duration: 0.25, ease: 'easeOut' }}
                >
                  {PHASE_LABELS[currentPhase]}
                </motion.span>
              </AnimatePresence>
            </div>
            <div className="text-sm text-gray-600">
              Cycle {cycleCount + 1}
            </div>
          </div>

          {/* Progress Bar */}
          <div className="w-full bg-grounding-100 rounded-full h-2">
            <div
              className="bg-grounding-500 h-2 rounded-full transition-all duration-100 ease-linear"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>

        {/* Instructions */}
        <div className="text-sm text-gray-600 text-center bg-grounding-50 p-3 rounded-md">
          <p className="mb-2">Follow the triangle pattern:</p>
          <ul className="space-y-1">
            <li>Inhale for 4 seconds</li>
            <li>Hold breath for 4 seconds</li>
            <li>Exhale slowly for 6 seconds</li>
          </ul>
          <p className="text-xs text-gray-500 mt-2">
            Longer exhale activates the parasympathetic nervous system
          </p>
        </div>

        {/* Controls */}
        <div className="flex justify-center space-x-3">
          <Button
            onClick={() => setIsActive(!isActive)}
            variant="grounding"
            size="lg"
            className="flex items-center space-x-2"
            aria-label={isActive ? 'Pause breathing exercise' : 'Start breathing exercise'}
          >
            {isActive ? <Pause size={20} /> : <Play size={20} />}
            <span>{isActive ? 'Pause' : 'Start'}</span>
          </Button>

          <Button
            onClick={reset}
            variant="outline"
            size="lg"
            className="flex items-center space-x-2"
            aria-label="Reset breathing exercise"
          >
            <RotateCcw size={20} />
            <span>Reset</span>
          </Button>
        </div>
      </CardContent>
      <div className="px-6 pb-6 space-y-3">
        <div className="text-xs text-gray-600 bg-grounding-50 border border-grounding-100 p-3 rounded-md">
          About: Triangle breathing emphasizes a slightly longer exhale, which can support parasympathetic activation.
          <br/>
          Evidence: Controlled breathing with extended exhalation is commonly used to reduce physiological arousal.
        </div>
        <ShareInline title="Triangle Breathing" text="Practice Triangle Breathing on CalmMyself" />
      </div>
    </Card>
  )
}
