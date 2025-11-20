"use client"

import { useCallback, useState } from 'react'
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { ChevronDown } from 'lucide-react'
import ShareInline from '@/components/ShareInline'

const COUNTS = [10, 9, 8, 7, 6, 5, 4, 3, 2, 1]

export default function GroundedCountdown() {
  const [index, setIndex] = useState(0)
  const [round, setRound] = useState(1)

  const current = COUNTS[index]
  const isComplete = round > 2 && index === COUNTS.length - 1

  const next = useCallback(() => {
    setIndex((prev) => {
      if (prev < COUNTS.length - 1) {
        return prev + 1
      }
      setRound((r) => r + 1)
      return 0
    })
  }, [])

  const reset = useCallback(() => {
    setIndex(0)
    setRound(1)
  }, [])

  return (
    <Card className="max-w-md mx-auto">
      <CardHeader className="text-center">
        <CardTitle>Grounded Countdown</CardTitle>
        <CardDescription>
          Step or press your feet as you count down with the breath
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="flex items-center justify-between text-sm text-gray-600">
          <span>Number: {current}</span>
          <span>Round {round} of 3</span>
        </div>

        <div className="w-full bg-gray-200 rounded-full h-2">
          <div
            className="bg-grounding-500 h-2 rounded-full transition-all duration-300"
            style={{ width: `${((index + 1) / COUNTS.length) * 100}%` }}
          />
        </div>

        <div className="text-center space-y-3">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-grounding-100 text-grounding-700 text-3xl font-semibold">
            {current}
          </div>
          <p className="text-sm text-gray-700">
            As you step or press your feet into the floor, inhale on the number and exhale on the
            word “and”. For example: “10” (inhale), “and” (exhale).
          </p>
        </div>

        <div className="bg-grounding-50 border border-grounding-100 rounded-md p-3 text-xs text-gray-700 flex items-start gap-2">
          <ChevronDown className="w-4 h-4 text-grounding-600 mt-0.5" />
          <p>
            You can do this while walking, pacing, or even seated by pressing your feet into the
            ground. When you reach 1, notice how your body feels before starting another round.
          </p>
        </div>

        <div className="flex justify-center gap-3">
          <Button onClick={next} variant="grounding" size="lg" className="flex items-center gap-2">
            {isComplete ? 'Repeat Countdown' : 'Next Number'}
          </Button>
          <Button onClick={reset} variant="outline" size="lg" className="flex items-center gap-2">
            Reset
          </Button>
        </div>
      </CardContent>
      <div className="px-6 pb-6">
        <ShareInline
          title="Grounded Countdown"
          text="Try the Grounded Countdown for panic and high arousal on CalmMyself."
        />
      </div>
    </Card>
  )
}


