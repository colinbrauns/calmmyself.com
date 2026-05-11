"use client"

import { useEffect, useRef, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import ShareInline from '@/components/ShareInline'
import { Button } from '@/components/ui/Button'
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/Card'
import { Play, Pause, RotateCcw } from 'lucide-react'
import { useBreathPattern } from '@/hooks/useBreathPattern'

type BreathingPhase = 'inhale' | 'hold' | 'exhale'

const PHASE_DURATION = { inhale: 4000, hold: 4000, exhale: 6000 }
const PHASE_LABELS = {
  inhale: 'Breathe In',
  hold: 'Hold',
  exhale: 'Breathe Out'
}

const PHASES: BreathingPhase[] = ['inhale', 'hold', 'exhale']

const PATTERN = PHASES.map((phase) => ({
  phase,
  label: PHASE_LABELS[phase],
  durationMs: PHASE_DURATION[phase],
}))

export default function TriangleBreathing() {
  const breath = useBreathPattern<BreathingPhase>({
    pattern: PATTERN,
  })

  const currentPhase = breath.current.phase
  const currentPhaseDuration = breath.current.durationMs

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
    // Fractions of total triangle perimeter to draw
    // Each phase traces one edge: Inhale 0->1/3, Hold 1/3->2/3, Exhale 2/3->1
    switch (currentPhase) {
      case 'inhale': return [0, 1 / 3] as const
      case 'hold': return [1 / 3, 2 / 3] as const
      case 'exhale': return [2 / 3, 1] as const
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
          <div className="relative" style={{ width: 200, height: 200 }}>
            {/* Triangle path trace only (no scaling) */}
            <svg className="absolute" width={200} height={200} viewBox="0 0 180 180" aria-hidden="true">
              <defs>
                <linearGradient id="triGrad" x1="0" y1="0" x2="1" y2="1">
                  <stop offset="0%" stopColor="#fcd34d" stopOpacity="0.9" />
                  <stop offset="100%" stopColor="#f59e0b" stopOpacity="0.9" />
                </linearGradient>
              </defs>
              {/* Track */}
              <path
                d="M90 20 L20 160 L160 160 Z"
                fill="none"
                stroke="rgba(16,24,16,0.12)"
                strokeWidth={4}
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              {/* Animated progress */}
              <motion.path
                key={`${currentPhase}-${breath.phaseIndex}-${currentPhaseDuration}-${breath.isRunning}`}
                ref={pathRef}
                d="M90 20 L20 160 L160 160 Z"
                fill="none"
                stroke="url(#triGrad)"
                strokeWidth={4}
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeDasharray={pathLen}
                initial={{ strokeDashoffset: startOffset }}
                animate={{ strokeDashoffset: breath.isRunning ? endOffset : startOffset }}
                transition={{ duration: breath.isRunning ? currentPhaseDuration / 1000 : 0, ease: 'linear' }}
              />
            </svg>
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
              <div className="text-white font-medium text-sm text-center select-none">
                {breath.displaySeconds}
              </div>
            </div>
          </div>
          
          {/* Phase Indicator */}
          <div className="text-center">
            <div className="text-2xl font-semibold text-grounding-800 dark:text-gray-100 mb-2 min-h-[32px]">
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
        <div className="text-sm text-gray-600 text-center bg-grounding-50 dark:bg-gray-800/50 p-3 rounded-xl">
          <p className="mb-2">Follow the triangle pattern:</p>
          <ul className="space-y-1">
            <li>• Inhale for 4 seconds</li>
            <li>• Hold breath for 4 seconds</li>
            <li>• Exhale slowly for 6 seconds</li>
          </ul>
          <p className="text-xs text-gray-500 mt-2">
            Longer exhale activates the parasympathetic nervous system
          </p>
        </div>

        {/* Controls */}
        <div className="flex justify-center space-x-3">
          <Button
            onClick={breath.toggle}
            variant="grounding"
            size="lg"
            className="flex items-center space-x-2"
            aria-label={breath.isRunning ? 'Pause breathing exercise' : 'Start breathing exercise'}
          >
            {breath.isRunning ? <Pause size={20} /> : <Play size={20} />}
            <span>{breath.isRunning ? 'Pause' : breath.isPaused ? 'Resume' : 'Start'}</span>
          </Button>
          
          <Button
            onClick={breath.reset}
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
          About: Triangle breathing emphasizes a slightly longer exhale, which can support parasympathetic activation.
          <br/>
          Evidence: Controlled breathing with extended exhalation is commonly used to reduce physiological arousal.
        </div>
        <ShareInline title="Triangle Breathing" text="Practice Triangle Breathing on CalmMyself" />
      </div></div>
    </Card>
  )
}
