"use client"

import { useEffect, useState } from 'react'
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { Timer } from 'lucide-react'
import ShareInline from '@/components/ShareInline'

const STEPS = [
  'Look away from your screen and let your eyes soften.',
  'Take three slow breaths, feeling the air move in and out.',
  'Roll your shoulders and gently move your neck within a comfortable range.',
  'Press your feet into the floor and notice the support beneath you.',
] as const

const DURATION_SECONDS = 60

export default function MicroBreakTimer() {
  const [remaining, setRemaining] = useState(DURATION_SECONDS)
  const [isRunning, setIsRunning] = useState(false)

  useEffect(() => {
    if (!isRunning || remaining <= 0) return
    const id = setInterval(() => {
      setRemaining((s) => (s <= 1 ? 0 : s - 1))
    }, 1000)
    return () => clearInterval(id)
  }, [isRunning, remaining])

  const reset = () => {
    setRemaining(DURATION_SECONDS)
    setIsRunning(false)
  }

  const progress = ((DURATION_SECONDS - remaining) / DURATION_SECONDS) * 100

  return (
    <Card className="max-w-md mx-auto">
      <CardHeader className="text-center">
        <div className="flex items-center justify-center gap-2 mb-2">
          <Timer className="w-5 h-5 text-grounding-600" />
          <CardTitle>Micro‑Break Timer</CardTitle>
        </div>
        <CardDescription>Take a 60‑second nervous‑system break</CardDescription>
      </CardHeader>

      <CardContent className="space-y-6">
        <div className="flex items-center justify-between text-sm text-gray-600 dark:text-gray-400">
          <span>Time left: {remaining}s</span>
        </div>
        <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
          <div
            className="bg-sky-500 h-2 rounded-full transition-all duration-300"
            style={{ width: `${progress}%` }}
          />
        </div>

        <div className="space-y-2 text-sm text-gray-700 dark:text-gray-400">
          {STEPS.map((step, i) => (
            <p key={i}>• {step}</p>
          ))}
        </div>

        <div className="flex justify-center gap-3">
          <Button
            variant="grounding"
            size="lg"
            onClick={() => setIsRunning((r) => !r)}
            className="flex items-center gap-2"
          >
            {isRunning ? 'Pause' : 'Start'}
          </Button>
          <Button variant="outline" size="lg" onClick={reset}>
            Reset
          </Button>
        </div>

        <div className="text-xs text-gray-600 dark:text-gray-400 bg-gray-50 dark:bg-gray-800/50 border border-gray-200 dark:border-gray-700 p-3 rounded-xl">
          Even brief breaks like this, taken regularly, can help eyes, posture, and nervous system
          recover during longer work sessions.
        </div>
      </CardContent>
      <div className="px-6 pb-6 pt-0"><div className="pt-4 mt-2 border-t border-gray-100 dark:border-gray-800">
        <ShareInline
          title="Micro‑Break Timer"
          text="Use a 60‑second micro‑break timer for nervous‑system rest on CalmMyself."
        />
      </div></div>
    </Card>
  )
}


