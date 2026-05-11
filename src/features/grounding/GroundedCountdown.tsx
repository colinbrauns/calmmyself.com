"use client"

import { useCallback, useState } from 'react'
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { ChevronDown, CheckCircle2, RotateCcw, ArrowLeft } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import ShareInline from '@/components/ShareInline'

const COUNTS = [10, 9, 8, 7, 6, 5, 4, 3, 2, 1]

export default function GroundedCountdown() {
  const [index, setIndex] = useState(0)
  const [round, setRound] = useState(1)
  const [completed, setCompleted] = useState(false)

  const current = COUNTS[index]

  const next = useCallback(() => {
    if (index < COUNTS.length - 1) {
      setIndex((prev) => prev + 1)
    } else if (round < 3) {
      setRound((r) => r + 1)
      setIndex(0)
    } else {
      setCompleted(true)
    }
  }, [index, round])

  const reset = useCallback(() => {
    setIndex(0)
    setRound(1)
    setCompleted(false)
  }, [])

  if (completed) {
    return (
      <Card className="max-w-md mx-auto">
        <CardContent className="text-center py-12 space-y-5">
          <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: 'spring', bounce: 0.5 }}>
            <CheckCircle2 className="w-16 h-16 text-green-500 mx-auto" />
          </motion.div>
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
            <h3 className="text-xl font-semibold text-gray-800 dark:text-gray-100">Grounded 🌿</h3>
            <p className="text-gray-600 dark:text-gray-400 mt-2 text-sm">
              Three rounds complete. Notice how your feet feel against the floor right now — a little more connected, maybe a little steadier.
            </p>
          </motion.div>
          <div className="flex gap-3 justify-center pt-2">
            <Button onClick={reset} variant="grounding" size="lg" className="gap-2">
              <RotateCcw size={16} /> Do Again
            </Button>
            <Button onClick={() => window.history.back()} variant="outline" size="lg" className="gap-2">
              <ArrowLeft size={16} /> Back
            </Button>
          </div>
        </CardContent>
      </Card>
    )
  }

  const overallProgress = ((round - 1) * COUNTS.length + index + 1) / (3 * COUNTS.length)

  return (
    <Card className="max-w-md mx-auto">
      <CardHeader className="text-center">
        <CardTitle>Grounded Countdown</CardTitle>
        <CardDescription>
          Step or press your feet as you count down with the breath
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="flex items-center justify-between text-sm text-gray-600 dark:text-gray-400">
          <span>Number: {current}</span>
          <span>Round {round} of 3</span>
        </div>

        <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
          <motion.div
            className="bg-amber-500 h-2 rounded-full"
            animate={{ width: `${overallProgress * 100}%` }}
            transition={{ duration: 0.3 }}
          />
        </div>

        <div className="text-center space-y-3">
          <AnimatePresence mode="wait">
            <motion.div
              key={`${round}-${index}`}
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 1.2, opacity: 0 }}
              className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-300 text-4xl font-bold"
            >
              {current}
            </motion.div>
          </AnimatePresence>
          <p className="text-sm text-gray-700 dark:text-gray-400">
            Inhale on the number, exhale on &ldquo;and&rdquo;.
          </p>
        </div>

        <div className="bg-gray-50 dark:bg-gray-800/50 border border-gray-200 dark:border-gray-700 rounded-xl p-3 text-xs text-gray-700 dark:text-gray-400 flex items-start gap-2">
          <ChevronDown className="w-4 h-4 text-amber-600 mt-0.5 flex-shrink-0" />
          <p>
            You can do this while walking, pacing, or seated by pressing your feet into the ground.
          </p>
        </div>

        <div className="flex justify-center gap-3">
          <Button onClick={next} variant="grounding" size="lg">
            Next Number
          </Button>
          <Button onClick={reset} variant="outline" size="lg">
            Reset
          </Button>
        </div>
      </CardContent>
      <div className="px-6 pb-6 pt-0"><div className="pt-4 mt-2 border-t border-gray-100 dark:border-gray-800">
        <ShareInline
          title="Grounded Countdown"
          text="Try the Grounded Countdown for panic and high arousal on CalmMyself."
        />
      </div></div>
    </Card>
  )
}
