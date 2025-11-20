"use client"

import { useState } from 'react'
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import ShareInline from '@/components/ShareInline'
import { motion } from 'framer-motion'

const SunsetVisualizer = ({ stepIndex }: { stepIndex: number }) => {
  return (
    <div className="relative h-40 w-full rounded-xl overflow-hidden mb-6 border border-gray-200">
      {/* Sky Background */}
      <motion.div
        className="absolute inset-0"
        initial={false}
        animate={{
          background:
            stepIndex === 0
              ? 'linear-gradient(180deg, #bae6fd 0%, #e0f2fe 100%)'
              : stepIndex === 1
              ? 'linear-gradient(180deg, #fdba74 0%, #ffedd5 100%)'
              : 'linear-gradient(180deg, #818cf8 0%, #c4b5fd 100%)',
        }}
        transition={{ duration: 1.5 }}
      />

      {/* Sun */}
      <motion.div
        className="absolute left-1/2 w-16 h-16 rounded-full shadow-lg"
        style={{ x: '-50%' }}
        initial={false}
        animate={{
          top: stepIndex === 0 ? '15%' : stepIndex === 1 ? '45%' : '85%',
          backgroundColor: stepIndex === 2 ? '#fbbf24' : '#fde047',
          boxShadow:
            stepIndex === 2
              ? '0 0 30px rgba(251, 191, 36, 0.4)'
              : '0 0 40px rgba(253, 224, 71, 0.6)',
        }}
        transition={{ duration: 1.5, type: 'spring', bounce: 0.2 }}
      />

      {/* Horizon / Landscape */}
      <div className="absolute bottom-0 w-full h-12 bg-gradient-to-t from-emerald-900/20 to-transparent" />
      <div className="absolute bottom-[-10px] w-[120%] left-[-10%] h-8 bg-emerald-800/10 blur-xl rounded-full" />
    </div>
  )
}

type StepId = 'breath' | 'gratitude' | 'let-go'

interface Step {
  id: StepId
  title: string
  prompt: string
  helper: string
}

const STEPS: Step[] = [
  {
    id: 'breath',
    title: '3 gentle breaths',
    prompt: 'Take three slow, comfortable breaths.',
    helper: 'On each exhale, imagine the day “landing” a little more.',
  },
  {
    id: 'gratitude',
    title: '2 things that were okay enough',
    prompt: 'Name two things that went okay, or were even slightly good, today.',
    helper: 'They can be very small: a text, a meal, a moment of quiet, a joke.',
  },
  {
    id: 'let-go',
    title: '1 thing for tomorrow-you',
    prompt: 'Pick one thing you are handing to tomorrow-you to handle.',
    helper: 'You might write it down somewhere safe and give yourself permission to pause on it now.',
  },
]

export default function LandTheDay() {
  const [stepIndex, setStepIndex] = useState(0)
  const [gratitudes, setGratitudes] = useState(['', ''])
  const [tomorrowItem, setTomorrowItem] = useState('')

  const step = STEPS[stepIndex]
  const isLast = stepIndex === STEPS.length - 1
  const progress = ((stepIndex + 1) / STEPS.length) * 100

  const next = () => {
    if (!isLast) setStepIndex((i) => i + 1)
  }

  const back = () => {
    if (stepIndex > 0) setStepIndex((i) => i - 1)
  }

  const reset = () => {
    setStepIndex(0)
    setGratitudes(['', ''])
    setTomorrowItem('')
  }

  return (
    <Card className="max-w-md mx-auto">
      <CardHeader className="text-center">
        <CardTitle>Land the Day</CardTitle>
        <CardDescription>Short evening check‑in before bed</CardDescription>
      </CardHeader>

      <CardContent className="space-y-6">
        <SunsetVisualizer stepIndex={stepIndex} />
        
        <div className="flex items-center justify-between text-sm text-gray-600">
          <span>
            Step {stepIndex + 1} of {STEPS.length}
          </span>
          <span>Bedtime wind‑down</span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-2">
          <div
            className="bg-calm-500 h-2 rounded-full transition-all duration-300"
            style={{ width: `${progress}%` }}
          />
        </div>

        <div className="space-y-3">
          <h3 className="text-lg font-semibold text-calm-800 text-center">{step.title}</h3>
          <p className="text-sm text-gray-700 text-center">{step.prompt}</p>
          <p className="text-xs text-gray-500 text-center">{step.helper}</p>
        </div>

        {step.id === 'gratitude' && (
          <div className="space-y-2">
            {gratitudes.map((g, i) => (
              <input
                key={i}
                type="text"
                className="w-full p-2 border border-gray-300 rounded-md text-sm focus:ring-2 focus:ring-calm-500 focus:border-calm-500"
                placeholder={`Thing ${i + 1} that was okay enough`}
                value={g}
                onChange={(e) => {
                  const next = [...gratitudes]
                  next[i] = e.target.value
                  setGratitudes(next)
                }}
              />
            ))}
          </div>
        )}

        {step.id === 'let-go' && (
          <div className="space-y-2">
            <input
              type="text"
              className="w-full p-2 border border-gray-300 rounded-md text-sm focus:ring-2 focus:ring-calm-500 focus:border-calm-500"
              placeholder="Tomorrow‑you will handle..."
              value={tomorrowItem}
              onChange={(e) => setTomorrowItem(e.target.value)}
            />
            <p className="text-xs text-gray-500 text-center">
              You can write this somewhere you trust (notes app, paper) so you do not have to keep
              rehearsing it in your head.
            </p>
          </div>
        )}

        <div className="flex justify-between gap-3">
          <Button
            variant="outline"
            size="sm"
            onClick={back}
            disabled={stepIndex === 0}
          >
            Back
          </Button>
          <div className="flex gap-3 ml-auto">
            <Button variant="outline" size="sm" onClick={reset}>
              Reset
            </Button>
            {!isLast && (
              <Button variant="calm" size="lg" onClick={next}>
                Next
              </Button>
            )}
          </div>
        </div>
      </CardContent>

      <div className="px-6 pb-6">
        <ShareInline
          title="Land the Day"
          text="Use a brief Land the Day check‑in before bed on CalmMyself."
        />
      </div>
    </Card>
  )
}


