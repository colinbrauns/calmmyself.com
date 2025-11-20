"use client"

import { useState } from 'react'
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import ShareInline from '@/components/ShareInline'
import { motion } from 'framer-motion'

const WaveVisualizer = ({ isActive }: { isActive: boolean }) => {
  return (
    <div className="relative h-48 w-full overflow-hidden bg-sky-50 rounded-xl border border-sky-100 mb-6">
      {/* Sky/Background */}
      <div className="absolute inset-0 opacity-30 bg-gradient-to-b from-sky-200 to-transparent" />

      {/* The Wave */}
      <div className="absolute bottom-0 w-[200%] h-full flex items-end">
        <motion.svg
          viewBox="0 0 1200 300"
          className="w-full h-full text-sky-400 fill-current opacity-80"
          preserveAspectRatio="none"
          animate={isActive ? { x: ['0%', '-50%'] } : { x: '0%' }}
          transition={{ repeat: Infinity, duration: 8, ease: 'linear' }}
        >
          <path d="M0,150 C150,50 450,250 600,150 C750,50 1050,250 1200,150 V300 H0 Z" />
        </motion.svg>
      </div>

      {/* Second Wave Layer (Offset) */}
      <div className="absolute bottom-0 w-[200%] h-full flex items-end opacity-50">
        <motion.svg
          viewBox="0 0 1200 300"
          className="w-full h-full text-sky-300 fill-current"
          preserveAspectRatio="none"
          animate={isActive ? { x: ['-25%', '-75%'] } : { x: '-25%' }}
          transition={{ repeat: Infinity, duration: 12, ease: 'linear' }}
        >
          <path d="M0,160 C150,60 450,260 600,160 C750,60 1050,260 1200,160 V300 H0 Z" />
        </motion.svg>
      </div>

      {/* The Surfer */}
      <motion.div
        className="absolute left-1/2 top-1/2 w-6 h-6 bg-orange-400 rounded-full shadow-md z-10 border-2 border-white"
        style={{ x: '-50%', y: '-50%' }}
        animate={
          isActive
            ? {
                y: ['-50%', '-60%', '-45%', '-50%'],
              }
            : {}
        }
        transition={{ repeat: Infinity, duration: 4, ease: 'easeInOut' }}
      />
    </div>
  )
}

type StepId = 'notice' | 'ride' | 'choose'

interface Step {
  id: StepId
  title: string
  body: string
}

const STEPS: Step[] = [
  {
    id: 'notice',
    title: 'Notice the urge',
    body:
      "Briefly describe what the urge is for and where you feel it in your body (e.g. chest, stomach, hands). You do not have to act on it.",
  },
  {
    id: 'ride',
    title: 'Ride the wave',
    body:
      'For 60–90 seconds, simply track the urge like a wave: rising, peaking, and falling. Notice any small changes without judging them.',
  },
  {
    id: 'choose',
    title: 'Choose a next step',
    body:
      'From this slightly steadier place, choose one tiny next step that moves you toward your values (e.g. text a friend, get a glass of water, step outside).',
  },
]

export default function UrgeSurfing() {
  const [stepIndex, setStepIndex] = useState(0)

  const step = STEPS[stepIndex]
  const isLast = stepIndex === STEPS.length - 1
  const progress = ((stepIndex + 1) / STEPS.length) * 100

  const next = () => {
    if (!isLast) setStepIndex((i) => i + 1)
  }

  const back = () => {
    if (stepIndex > 0) setStepIndex((i) => i - 1)
  }

  const reset = () => setStepIndex(0)

  return (
    <Card className="max-w-md mx-auto">
      <CardHeader className="text-center">
        <CardTitle>Urge Surfing</CardTitle>
        <CardDescription>
          Notice, ride, and choose—without needing to fight the urge
        </CardDescription>
      </CardHeader>

      <CardContent className="space-y-6">
        <WaveVisualizer isActive={step.id === 'ride'} />
        
        <div className="flex items-center justify-between text-sm text-gray-600">
          <span>
            Step {stepIndex + 1} of {STEPS.length}
          </span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-2">
          <div
            className="bg-grounding-500 h-2 rounded-full transition-all duration-300"
            style={{ width: `${progress}%` }}
          />
        </div>

        <div className="space-y-3">
          <h3 className="text-lg font-semibold text-grounding-800 text-center">
            {step.title}
          </h3>
          <p className="text-sm text-gray-700 text-center whitespace-pre-line">{step.body}</p>
        </div>

        {step.id === 'notice' && (
          <div className="text-xs text-gray-600 bg-grounding-50 border border-grounding-100 p-3 rounded-md">
            You might write a few words or simply say them silently: “Strong urge to… I feel it in
            my…”.
          </div>
        )}

        {step.id === 'ride' && (
          <div className="text-xs text-gray-600 bg-grounding-50 border border-grounding-100 p-3 rounded-md">
            You can imagine the urge as a physical wave or curve. Your only job is to **observe**
            it changing—even just a little—over a minute or two.
          </div>
        )}

        {step.id === 'choose' && (
          <div className="text-xs text-gray-600 bg-grounding-50 border border-grounding-100 p-3 rounded-md">
            Your next step can be very small. The goal is to move just a little closer to how
            you&apos;d like to handle this over time, not to be perfect.
          </div>
        )}

        <div className="flex justify-between gap-3">
          <Button
            variant="outline"
            size="sm"
            onClick={back}
            disabled={stepIndex === 0}
            aria-label="Previous step"
          >
            Back
          </Button>
          <div className="flex gap-3 ml-auto">
            <Button
              variant="outline"
              size="sm"
              onClick={reset}
              aria-label="Reset urge surfing steps"
            >
              Reset
            </Button>
            {!isLast && (
              <Button
                variant="grounding"
                size="lg"
                onClick={next}
                aria-label="Next step"
              >
                Next
              </Button>
            )}
          </div>
        </div>
      </CardContent>

      <div className="px-6 pb-6">
        <ShareInline
          title="Urge Surfing"
          text="Try an urge surfing exercise for strong impulses on CalmMyself."
        />
      </div>
    </Card>
  )
}


