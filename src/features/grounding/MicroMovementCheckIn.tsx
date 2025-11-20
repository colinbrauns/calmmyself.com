"use client"

import { useState } from 'react'
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import ShareInline from '@/components/ShareInline'

const PROMPTS = [
  'Roll your shoulders gently forward and back a few times.',
  'Stretch your fingers wide, then soften your hands.',
  'Press your feet into the floor and notice the contact.',
  'Gently turn your head side to side within a comfortable range.',
  'Sit up a little taller, then allow your posture to soften again.',
] as const

export default function MicroMovementCheckIn() {
  const [index, setIndex] = useState(0)

  const prompt = PROMPTS[index]
  const isLast = index === PROMPTS.length - 1

  const next = () => {
    if (!isLast) setIndex((i) => i + 1)
  }

  const reset = () => setIndex(0)

  return (
    <Card className="max-w-md mx-auto">
      <CardHeader className="text-center">
        <CardTitle>Micro‑Movement Check‑In</CardTitle>
        <CardDescription>Small, seated movements to wake up the body</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="flex items-center justify-between text-sm text-gray-600">
          <span>
            Step {index + 1} of {PROMPTS.length}
          </span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-2">
          <div
            className="bg-grounding-500 h-2 rounded-full transition-all duration-300"
            style={{ width: `${((index + 1) / PROMPTS.length) * 100}%` }}
          />
        </div>

        <div className="text-center space-y-3">
          <p className="text-sm text-gray-700">{prompt}</p>
          <p className="text-xs text-gray-500">
            Move within a range that feels safe for your body. You can skip or adapt any step.
          </p>
        </div>

        <div className="flex justify-center gap-3">
          {!isLast && (
            <Button variant="grounding" size="lg" onClick={next}>
              Next Movement
            </Button>
          )}
          <Button variant="outline" size="lg" onClick={reset}>
            Reset
          </Button>
        </div>
      </CardContent>
      <div className="px-6 pb-6">
        <ShareInline
          title="Micro‑Movement Check‑In"
          text="Use a micro‑movement check‑in when feeling numb or shut down on CalmMyself."
        />
      </div>
    </Card>
  )
}


