'use client'

import { useEffect, useState } from 'react'
import { Button } from '@/components/ui/Button'
import { Waves } from 'lucide-react'
import { motion } from 'framer-motion'
import ShareInline from '@/components/ShareInline'
import { useBreathPattern } from '@/hooks/useBreathPattern'
import {
  CompletionCard,
  DurationSelector,
  EvidenceNote,
  ToolBody,
  ToolCard,
  ToolControls,
  ToolFooter,
  ToolHeader,
} from '@/components/CalmTool'

const INHALE = 5
const EXHALE = 6
const DURATIONS = [2, 3, 5]
const PATTERN = [
  { phase: 'inhale', label: 'Breathe In', durationMs: INHALE * 1000 },
  { phase: 'exhale', label: 'Breathe Out', durationMs: EXHALE * 1000 },
] as const

export default function OceanBreath() {
  const [durationMin, setDurationMin] = useState(3)
  const [timeLeft, setTimeLeft] = useState(0)
  const [completed, setCompleted] = useState(false)
  const [completedCycles, setCompletedCycles] = useState(0)
  const breath = useBreathPattern({
    pattern: PATTERN,
  })

  const start = () => {
    setTimeLeft(durationMin * 60)
    setCompleted(false)
    setCompletedCycles(0)
    breath.start()
  }

  const reset = () => {
    breath.reset()
    setCompleted(false)
    setCompletedCycles(0)
    setTimeLeft(0)
  }

  useEffect(() => {
    if (!breath.isRunning) return
    const id = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) {
          setCompletedCycles(breath.cycleCount)
          breath.reset()
          setCompleted(true)
          return 0
        }
        return prev - 1
      })
    }, 1000)
    return () => clearInterval(id)
  }, [breath.cycleCount, breath.isRunning, breath.reset])

  const formatTime = (s: number) => `${Math.floor(s / 60)}:${(s % 60).toString().padStart(2, '0')}`

  if (completed) {
    return (
      <CompletionCard
        icon={<Waves className="h-10 w-10 text-teal-600" />}
        title="Beautifully done"
        description={`You completed ${completedCycles} cycles of ocean breathing. Let the calm linger.`}
        onAction={reset}
        tone="teal"
      >
        <ShareInline title="Ocean Breath" text="Ujjayi ocean breathing on CalmMyself" />
      </CompletionCard>
    )
  }

  const phase = breath.current.phase
  const waveY = phase === 'inhale' ? -20 : 20

  return (
    <ToolCard>
      <ToolHeader
        icon={Waves}
        title="Ocean Breath (Ujjayi)"
        description="Slow nasal breath with a soft ocean-like sound"
        tone="teal"
      />
      <ToolBody>
        {breath.status === 'idle' && timeLeft === 0 ? (
          <>
            <DurationSelector values={DURATIONS} value={durationMin} onChange={setDurationMin} tone="teal" />
            <div className="flex justify-center">
              <Button onClick={start} variant="calm" size="lg" className="min-w-[8rem]">
                Begin
              </Button>
            </div>
          </>
        ) : (
          <>
            <div data-testid="tool-visual" className="relative h-32 rounded-lg overflow-hidden bg-gradient-to-b from-teal-50 to-cyan-100 dark:from-teal-950 dark:to-cyan-950">
              <motion.div
                className="absolute bottom-0 left-0 right-0 h-16 bg-gradient-to-t from-teal-400/40 to-transparent"
                animate={{ y: waveY }}
                transition={{ duration: phase === 'inhale' ? INHALE : EXHALE, ease: 'easeInOut' }}
              />
              <svg className="absolute bottom-0 left-0 right-0" viewBox="0 0 400 60" preserveAspectRatio="none">
                <motion.path
                  d="M0,30 Q50,10 100,30 T200,30 T300,30 T400,30 V60 H0 Z"
                  fill="rgba(20,184,166,0.3)"
                  animate={{ d: phase === 'inhale'
                    ? 'M0,20 Q50,0 100,20 T200,20 T300,20 T400,20 V60 H0 Z'
                    : 'M0,40 Q50,20 100,40 T200,40 T300,40 T400,40 V60 H0 Z'
                  }}
                  transition={{ duration: phase === 'inhale' ? INHALE : EXHALE, ease: 'easeInOut' }}
                />
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <p className="text-2xl font-bold text-teal-800 dark:text-teal-200">{breath.current.label}</p>
                <p className="text-lg text-teal-600 dark:text-teal-300">{breath.displaySeconds}s</p>
              </div>
            </div>
            <div className="flex justify-between text-sm text-gray-500 dark:text-gray-400">
              <span>{breath.cycleCount} cycles</span>
              <span>{formatTime(timeLeft)} remaining</span>
            </div>
            <ToolControls
              isRunning={breath.isRunning}
              isPaused={breath.isPaused}
              onToggle={breath.toggle}
              onReset={reset}
              tone="teal"
              startLabel="Resume"
            />
          </>
        )}
      </ToolBody>
      <ToolFooter>
        <EvidenceNote>
          Ujjayi breathing uses a slight throat constriction to create a soft ocean-like sound. Breathe through the nose without strain.
        </EvidenceNote>
        <ShareInline title="Ocean Breath" text="Ujjayi ocean breathing on CalmMyself" />
      </ToolFooter>
    </ToolCard>
  )
}
