"use client"

import { useState } from 'react'
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { motion } from 'framer-motion'
import ShareInline from '@/components/ShareInline'
import { useBreathPattern } from '@/hooks/useBreathPattern'

const STEPS = [
  {
    title: 'Clearing breath',
    description: 'One slow inhale and a longer, gentle exhale to release a bit of tension.',
  },
  {
    title: 'Orienting breath',
    description: 'On the next breath, softly notice the room around you—light, shapes, sounds.',
  },
  {
    title: 'Intention breath',
    description: 'On the third breath, name your next small step out loud or in your mind.',
  },
] as const

const BREATH_PATTERN = [
  { phase: 'inhale', label: 'Breathe in...', durationMs: 4000 },
  { phase: 'exhale', label: 'Breathe out...', durationMs: 4000 },
] as const

function CountdownDots({ breathIndex, isBreathing, breathPhase }: { breathIndex: number; isBreathing: boolean; breathPhase: 'inhale' | 'exhale' }) {
  return (
    <div className="flex items-center justify-center gap-6 py-4">
      {[0, 1, 2].map((i) => {
        const isCompleted = i < breathIndex
        const isCurrent = i === breathIndex
        const isInhale = breathPhase === 'inhale'

        return (
          <div key={i} className="flex flex-col items-center gap-2">
            <motion.div
              className="relative"
              style={{ width: 56, height: 56 }}
            >
              {/* Background circle */}
              <motion.div
                className="absolute inset-0 rounded-full border-2"
                style={{
                  borderColor: isCompleted ? '#22c55e' : isCurrent ? '#6ba5d7' : '#e5e7eb',
                  backgroundColor: isCompleted ? 'rgba(34, 197, 94, 0.15)' : 'transparent',
                }}
              />

              {/* Fill animation for current breath */}
              {isCurrent && isBreathing && (
                <motion.div
                  className="absolute inset-0 rounded-full"
                  style={{ backgroundColor: 'rgba(107, 165, 215, 0.25)' }}
                  animate={{
                    scale: isInhale ? [0.3, 1] : [1, 0.3],
                  }}
                  transition={{ duration: 4, ease: 'easeInOut' }}
                />
              )}

              {/* Pulse ring for current */}
              {isCurrent && isBreathing && (
                <motion.div
                  className="absolute inset-0 rounded-full border-2 border-calm-400"
                  animate={{
                    scale: [1, 1.3],
                    opacity: [0.6, 0],
                  }}
                  transition={{ duration: 2, repeat: Infinity }}
                />
              )}

              {/* Check mark for completed */}
              {isCompleted && (
                <div className="absolute inset-0 flex items-center justify-center">
                  <svg width={24} height={24} viewBox="0 0 24 24" fill="none">
                    <motion.path
                      d="M5 13l4 4L19 7"
                      stroke="#22c55e"
                      strokeWidth={2.5}
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      initial={{ pathLength: 0 }}
                      animate={{ pathLength: 1 }}
                      transition={{ duration: 0.4 }}
                    />
                  </svg>
                </div>
              )}

              {/* Number for incomplete */}
              {!isCompleted && (
                <div className="absolute inset-0 flex items-center justify-center">
                  <span className={`text-lg font-semibold ${isCurrent ? 'text-calm-700' : 'text-gray-400'}`}>
                    {i + 1}
                  </span>
                </div>
              )}
            </motion.div>
          </div>
        )
      })}
    </div>
  )
}

export default function ThreeBreathReset() {
  const [breathIndex, setBreathIndex] = useState(0)
  const [intention, setIntention] = useState('')
  const breath = useBreathPattern({
    pattern: BREATH_PATTERN,
  })

  const current = STEPS[breathIndex]
  const isLast = breathIndex === STEPS.length - 1
  const isAllDone = breathIndex >= STEPS.length
  const isBreathing = breath.status === 'running' || breath.status === 'paused'
  const breathPhase = breath.current.phase

  const onNext = () => {
    if (!isLast) {
      setBreathIndex((i) => i + 1)
      breath.reset()
      breath.start()
    } else {
      setBreathIndex(STEPS.length) // mark all done
      breath.reset()
    }
  }

  const onReset = () => {
    setBreathIndex(0)
    setIntention('')
    breath.reset()
  }

  const onStart = () => {
    breath.start()
  }

  return (
    <Card className="max-w-md mx-auto">
      <CardHeader className="text-center">
        <CardTitle>3‑Breath Reset</CardTitle>
        <CardDescription>Use three short breaths between tasks</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Countdown Dots Visualization */}
        <CountdownDots breathIndex={breathIndex} isBreathing={isBreathing} breathPhase={breathPhase} />

        {!isAllDone && (
          <>
            <div className="flex items-center justify-between text-sm text-gray-600 dark:text-gray-400">
              <span>Breath {breathIndex + 1} of {STEPS.length}</span>
              {isBreathing && (
                <motion.span
                  className="text-calm-600 font-medium"
                  animate={{ opacity: [0.5, 1, 0.5] }}
                  transition={{ duration: 4, repeat: Infinity }}
                >
                  {breath.current.label}
                </motion.span>
              )}
            </div>
            <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
              <div
                className="bg-sky-500 h-2 rounded-full transition-all duration-300"
                style={{ width: `${((breathIndex) / STEPS.length) * 100}%` }}
              />
            </div>

            <div className="text-center space-y-2">
              <h3 className="text-lg font-semibold text-calm-800 dark:text-gray-100">{current.title}</h3>
              <p className="text-sm text-gray-700 dark:text-gray-400">{current.description}</p>
            </div>

            {current.title === 'Intention breath' && (
              <div className="space-y-2">
                <input
                  type="text"
                  className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-xl bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-500 text-sm focus:ring-2 focus:ring-calm-500 focus:border-calm-500"
                  placeholder="My next small step is..."
                  value={intention}
                  onChange={(e) => setIntention(e.target.value)}
                />
                <p className="text-xs text-gray-500 text-center">
                  Keep it tiny and specific, like &quot;open the document&quot; or &quot;send one email&quot;.
                </p>
              </div>
            )}
          </>
        )}

        {isAllDone && (
          <div className="text-center py-4">
            <motion.div initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} transition={{ duration: 0.4 }}>
              <p className="text-xl font-semibold text-green-600 mb-2">✨ Reset Complete</p>
              <p className="text-sm text-gray-600 dark:text-gray-400">You&apos;re grounded and ready for your next step.</p>
            </motion.div>
          </div>
        )}

        <div className="flex justify-center gap-3">
          {!isBreathing && !isAllDone && breathIndex === 0 && (
            <Button variant="calm" size="lg" onClick={onStart}>
              Begin
            </Button>
          )}
          {isBreathing && !isAllDone && (
            <Button variant="calm" size="lg" onClick={onNext}>
              {isLast ? 'Complete' : 'Next Breath'}
            </Button>
          )}
          <Button variant="outline" size="lg" onClick={onReset}>
            Reset
          </Button>
        </div>
      </CardContent>
      <div className="px-6 pb-6 pt-0"><div className="pt-4 mt-2 border-t border-gray-100 dark:border-gray-800">
        <ShareInline title="3‑Breath Reset" text="Use a quick 3‑breath reset between tasks on CalmMyself." />
      </div></div>
    </Card>
  )
}
