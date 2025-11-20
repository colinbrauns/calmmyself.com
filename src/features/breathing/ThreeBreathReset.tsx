"use client"

import { useState } from 'react'
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import ShareInline from '@/components/ShareInline'

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

export default function ThreeBreathReset() {
  const [breathIndex, setBreathIndex] = useState(0)
  const [intention, setIntention] = useState('')

  const current = STEPS[breathIndex]
  const isLast = breathIndex === STEPS.length - 1

  const onNext = () => {
    if (!isLast) setBreathIndex((i) => i + 1)
  }

  const onReset = () => {
    setBreathIndex(0)
    setIntention('')
  }

  return (
    <Card className="max-w-md mx-auto">
      <CardHeader className="text-center">
        <CardTitle>3‑Breath Reset</CardTitle>
        <CardDescription>Use three short breaths between tasks</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="flex items-center justify-between text-sm text-gray-600">
          <span>
            Breath {breathIndex + 1} of {STEPS.length}
          </span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-2">
          <div
            className="bg-calm-500 h-2 rounded-full transition-all duration-300"
            style={{ width: `${((breathIndex + 1) / STEPS.length) * 100}%` }}
          />
        </div>

        <div className="text-center space-y-2">
          <h3 className="text-lg font-semibold text-calm-800">{current.title}</h3>
          <p className="text-sm text-gray-700">{current.description}</p>
        </div>

        {current.title === 'Intention breath' && (
          <div className="space-y-2">
            <input
              type="text"
              className="w-full p-2 border border-gray-300 rounded-md text-sm focus:ring-2 focus:ring-calm-500 focus:border-calm-500"
              placeholder="My next small step is..."
              value={intention}
              onChange={(e) => setIntention(e.target.value)}
            />
            <p className="text-xs text-gray-500 text-center">
              Keep it tiny and specific, like &quot;open the document&quot; or &quot;send one
              email&quot;.
            </p>
          </div>
        )}

        <div className="flex justify-center gap-3">
          {!isLast && (
            <Button variant="calm" size="lg" onClick={onNext}>
              Next Breath
            </Button>
          )}
          <Button variant="outline" size="lg" onClick={onReset}>
            Reset
          </Button>
        </div>
      </CardContent>
      <div className="px-6 pb-6">
        <ShareInline
          title="3‑Breath Reset"
          text="Use a quick 3‑breath reset between tasks on CalmMyself."
        />
      </div>
    </Card>
  )
}


