'use client'

import { useState, useEffect, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import BreathingCycle, { type BreathingPattern } from '@/components/BreathingCycle'
import { useRef } from 'react'
import { Button } from '@/components/ui/Button'
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/Card'
import { Play, Pause, RotateCcw } from 'lucide-react'
import { useUsageTracking } from '@/hooks/useUsageTracking'
import ShareInline from '@/components/ShareInline'
import CelebrationAnimation from '@/components/CelebrationAnimation'

type BreathingPhase = 'inhale' | 'hold1' | 'exhale' | 'hold2'

const PHASE_DURATION = 4000 // 4 seconds
const PHASE_LABELS = {
  inhale: 'Breathe In',
  hold1: 'Hold',
  exhale: 'Breathe Out', 
  hold2: 'Hold'
}

const PHASES: BreathingPhase[] = ['inhale', 'hold1', 'exhale', 'hold2']

const PATTERN: BreathingPattern = [
  { phase: 'inhale', label: PHASE_LABELS.inhale, durationMs: PHASE_DURATION },
  { phase: 'hold1', label: PHASE_LABELS.hold1, durationMs: PHASE_DURATION },
  { phase: 'exhale', label: PHASE_LABELS.exhale, durationMs: PHASE_DURATION },
  { phase: 'hold2', label: PHASE_LABELS.hold2, durationMs: PHASE_DURATION },
]

export default function BoxBreathing() {
  const [isActive, setIsActive] = useState(false)
  const [currentPhase, setCurrentPhase] = useState<BreathingPhase>('inhale')
  const [phaseIndex, setPhaseIndex] = useState(0)
  const [cycleCount, setCycleCount] = useState(0)
  const [timeRemaining, setTimeRemaining] = useState(PHASE_DURATION)
  const [showCelebration, setShowCelebration] = useState(false)
  const phaseStartTimeRef = useRef<number>(0)

  // Usage tracking
  const { trackUsage } = useUsageTracking('box-breathing', isActive)

  const nextPhase = useCallback(() => {
    setPhaseIndex((prev) => {
      const next = (prev + 1) % PHASES.length
      if (next === 0) {
        setCycleCount((c) => {
          const newCount = c + 1
          if (newCount === 5) {
            setShowCelebration(true)
            setTimeout(() => setShowCelebration(false), 3000)
          }
          return newCount
        })
      }
      setCurrentPhase(PHASES[next])
      return next
    })
    setTimeRemaining(PHASE_DURATION)
    phaseStartTimeRef.current = Date.now()
  }, [])

  const reset = useCallback(() => {
    if (isActive) {
      trackUsage(cycleCount >= 3) // Consider completed if 3+ cycles
    }
    setIsActive(false)
    setCurrentPhase('inhale')
    setPhaseIndex(0)
    setCycleCount(0)
    setTimeRemaining(PHASE_DURATION)
  }, [isActive, cycleCount, trackUsage])

  useEffect(() => {
    let animationFrame: number | null = null

    if (isActive) {
      phaseStartTimeRef.current = Date.now()

      const updateTimer = () => {
        const elapsed = Date.now() - phaseStartTimeRef.current
        const remaining = Math.max(0, PHASE_DURATION - elapsed)

        setTimeRemaining(remaining)

        if (remaining <= 0) {
          nextPhase()
        } else {
          animationFrame = requestAnimationFrame(updateTimer)
        }
      }

      animationFrame = requestAnimationFrame(updateTimer)
    }

    return () => {
      if (animationFrame) cancelAnimationFrame(animationFrame)
    }
  }, [isActive, phaseIndex, nextPhase])

  const progress = ((PHASE_DURATION - timeRemaining) / PHASE_DURATION) * 100

  // Square path trace setup
  const pathRef = useRef<SVGPathElement | null>(null)
  const [pathLen, setPathLen] = useState(400)
  useEffect(() => {
    if (pathRef.current) {
      try {
        const len = pathRef.current.getTotalLength()
        if (Number.isFinite(len) && len > 0) setPathLen(len)
      } catch {}
    }
  }, [])

  const phaseStartEnd = () => {
    // Trace around square in 4 equal sides per phase
    switch (currentPhase) {
      case 'inhale': return [0, 1 / 4] as const
      case 'hold1': return [1 / 4, 2 / 4] as const
      case 'exhale': return [2 / 4, 3 / 4] as const
      case 'hold2': return [3 / 4, 1] as const
      default: return [0, 0] as const
    }
  }
  const [startFrac, endFrac] = phaseStartEnd()
  const startOffset = pathLen * (1 - startFrac)
  const endOffset = pathLen * (1 - endFrac)

  return (
    <>
      <CelebrationAnimation show={showCelebration} />
      <Card className="max-w-md mx-auto">
        <CardHeader className="text-center">
          <CardTitle>Box Breathing</CardTitle>
          <CardDescription>
            4-4-4-4 pattern for calm and focus
          </CardDescription>
        </CardHeader>
      
      <CardContent className="space-y-6 pb-6">
        {/* Breathing Visual */}
        <div className="flex flex-col items-center space-y-4">
          <div className="relative" style={{ width: 128, height: 128 }}>
            <svg className="absolute" width={128} height={128} viewBox="0 0 112 112" aria-hidden="true">
              {/* Track */}
              <path d="M16 16 H96 V96 H16 Z" fill="none" stroke="rgba(2,132,199,0.15)" strokeWidth={4} strokeLinejoin="round" />
              {/* Animated progress */}
              <motion.path
                key={`${currentPhase}-${phaseIndex}`}
                ref={pathRef}
                d="M16 16 H96 V96 H16 Z"
                fill="none"
                stroke="#0ea5e9"
                strokeWidth={4}
                strokeLinejoin="round"
                strokeDasharray={pathLen}
                initial={{ strokeDashoffset: startOffset }}
                animate={{ strokeDashoffset: endOffset }}
                transition={{ duration: isActive ? PHASE_DURATION / 1000 : 0, ease: 'linear' }}
              />
            </svg>
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
              <div className="text-calm-800 font-semibold text-sm text-center select-none bg-white/70 rounded px-2 py-0.5">
                {Math.ceil(timeRemaining / 1000)}
              </div>
            </div>
          </div>
          
          {/* Phase Indicator */}
          <div className="text-center">
            <div className="text-2xl font-semibold text-calm-800 mb-2 min-h-[32px]">
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
              {cycleCount >= 3 && (
                <span className="ml-2 text-green-600">✨ Great job!</span>
              )}
            </div>
          </div>

          {/* Progress Bar */}
          <div className="w-full bg-calm-100 rounded-full h-2">
            <div 
              className="bg-calm-500 h-2 rounded-full transition-all duration-100 ease-linear"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>

        {/* Instructions */}
        <div className="text-sm text-gray-600 text-center bg-calm-50 p-3 rounded-md">
          <p className="mb-2">Follow the square sides:</p>
          <ul className="space-y-1">
            <li>• Inhale: top side (4s)</li>
            <li>• Hold: right side (4s)</li>
            <li>• Exhale: bottom side (4s)</li>
            <li>• Hold: left side (4s)</li>
          </ul>
        </div>

        {/* Controls */}
        <div className="flex justify-center space-x-3 mt-2">
          <Button
            onClick={() => setIsActive(!isActive)}
            variant="calm"
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
        <div className="text-xs text-gray-600 bg-calm-50 border border-calm-100 p-3 rounded-md">
          About: Box breathing (equal inhale/hold/exhale/hold) can aid attention and reduce arousal when practiced gently.
          <br/>
          Evidence: Variants of paced breathing are used across clinical settings to support regulation.
        </div>
        <ShareInline title="Box Breathing" text="Use Box Breathing on CalmMyself" />
      </div>
    </Card>
    </>
  )
}
