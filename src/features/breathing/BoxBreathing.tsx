'use client'

import { useCallback, useEffect, useRef, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Button } from '@/components/ui/Button'
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/Card'
import { Play, Pause, RotateCcw } from 'lucide-react'
import { useUsageTracking } from '@/hooks/useUsageTracking'
import ShareInline from '@/components/ShareInline'
import { useBreathPattern } from '@/hooks/useBreathPattern'

type BreathingPhase = 'inhale' | 'hold1' | 'exhale' | 'hold2'

const PHASE_DURATION = 4000 // 4 seconds
const PHASE_LABELS = {
  inhale: 'Breathe In',
  hold1: 'Hold',
  exhale: 'Breathe Out', 
  hold2: 'Hold'
}

const PHASES: BreathingPhase[] = ['inhale', 'hold1', 'exhale', 'hold2']

const PATTERN = PHASES.map((phase) => ({
  phase,
  label: PHASE_LABELS[phase],
  durationMs: PHASE_DURATION,
}))

export default function BoxBreathing() {
  const breath = useBreathPattern<BreathingPhase>({
    pattern: PATTERN,
  })
  
  // Usage tracking
  const { trackUsage } = useUsageTracking('box-breathing', breath.isRunning)

  const reset = useCallback(() => {
    if (breath.status !== 'idle') {
      trackUsage(breath.cycleCount >= 3) // Consider completed if 3+ cycles
    }
    breath.reset()
  }, [breath, trackUsage])

  const currentPhase = breath.current.phase

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
  // strokeDashoffset: pathLen = fully hidden, 0 = fully visible
  // For first phase (inhale), start at pathLen (0% visible) and animate to pathLen * 0.75 (25% visible)
  const startOffset = pathLen * (1 - startFrac)
  const endOffset = pathLen * (1 - endFrac)

  return (
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
          <div className="relative" style={{ width: 200, height: 200 }}>
            <svg className="absolute" width={200} height={200} viewBox="0 0 180 180" aria-hidden="true">
              {/* Track */}
              <path d="M20 20 H160 V160 H20 Z" fill="none" stroke="rgba(2,132,199,0.15)" strokeWidth={4} strokeLinejoin="round" />
              {/* Animated progress */}
              <motion.path
                key={`${currentPhase}-${breath.phaseIndex}-${breath.isRunning}`}
                ref={pathRef}
                d="M20 20 H160 V160 H20 Z"
                fill="none"
                stroke="#0ea5e9"
                strokeWidth={4}
                strokeLinejoin="round"
                strokeDasharray={pathLen}
                initial={{ strokeDashoffset: startOffset }}
                animate={{ strokeDashoffset: breath.isRunning ? endOffset : startOffset }}
                transition={{ duration: breath.isRunning ? PHASE_DURATION / 1000 : 0, ease: 'linear' }}
              />
            </svg>
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
              <div className="text-calm-800 font-semibold text-sm text-center select-none bg-white/70 rounded px-2 py-0.5">
                {breath.displaySeconds}
              </div>
            </div>
          </div>
          
          {/* Phase Indicator */}
          <div className="text-center">
            <div className="text-2xl font-semibold text-calm-800 dark:text-gray-100 mb-2 min-h-[32px]">
              <AnimatePresence mode="wait">
                <motion.span
                  key={currentPhase}
                  initial={{ opacity: 0, y: 6 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -6 }}
                  transition={{ duration: 0.25, ease: 'easeOut' }}
                >
                  {breath.current.label}
                </motion.span>
              </AnimatePresence>
            </div>
            <div className="text-sm text-gray-600 dark:text-gray-400">
              Cycle {breath.cycleCount + 1}
              {breath.cycleCount >= 3 && (
                <span className="ml-2 text-green-600">Great job!</span>
              )}
            </div>
          </div>

          {/* Progress Bar */}
          <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
            <div 
              className="bg-sky-500 h-2 rounded-full transition-all duration-100 ease-linear"
              style={{ width: `${breath.progressPercent}%` }}
            />
          </div>
        </div>

        {/* Instructions */}
        <div className="text-sm text-gray-600 text-center bg-calm-50 dark:bg-gray-800/50 p-3 rounded-xl">
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
            onClick={breath.toggle}
            variant="calm"
            size="lg"
            className="flex items-center space-x-2"
            aria-label={breath.isRunning ? 'Pause breathing exercise' : 'Start breathing exercise'}
          >
            {breath.isRunning ? <Pause size={20} /> : <Play size={20} />}
            <span>{breath.isRunning ? 'Pause' : breath.isPaused ? 'Resume' : 'Start'}</span>
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
      <div className="px-6 pb-6 pt-0"><div className="pt-4 mt-2 border-t border-gray-100 dark:border-gray-800 space-y-3">
        <div className="text-xs text-gray-600 dark:text-gray-400 bg-gray-50 dark:bg-gray-800/50 border border-gray-200 dark:border-gray-700 p-3 rounded-xl">
          About: Box breathing (equal inhale/hold/exhale/hold) can aid attention and reduce arousal when practiced gently.
          <br/>
          Evidence: Variants of paced breathing are used across clinical settings to support regulation.
        </div>
        <ShareInline title="Box Breathing" text="Use Box Breathing on CalmMyself" />
      </div></div>
    </Card>
  )
}
