"use client"

import { useState, useEffect } from 'react'
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import ShareInline from '@/components/ShareInline'
import { motion, AnimatePresence } from 'framer-motion'
import { CheckCircle2, RotateCcw, ArrowLeft } from 'lucide-react'

const WaveVisualizer = ({ isActive }: { isActive: boolean }) => (
  <div className="relative h-48 w-full overflow-hidden bg-sky-50 dark:bg-sky-950/30 rounded-xl border border-sky-100 dark:border-sky-900 mb-6">
    <div className="absolute inset-0 opacity-30 bg-gradient-to-b from-sky-200 to-transparent" />
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
    <motion.div
      className="absolute left-1/2 top-1/2 w-6 h-6 bg-orange-400 rounded-full shadow-md z-10 border-2 border-white"
      style={{ x: '-50%', y: '-50%' }}
      animate={isActive ? { y: ['-50%', '-60%', '-45%', '-50%'] } : {}}
      transition={{ repeat: Infinity, duration: 4, ease: 'easeInOut' }}
    />
  </div>
)

type StepId = 'notice' | 'ride' | 'choose'

interface Step {
  id: StepId
  title: string
  body: string
  hint: string
  duration?: number
}

const STEPS: Step[] = [
  {
    id: 'notice',
    title: 'Notice the urge',
    body: "Briefly describe what the urge is for and where you feel it in your body. You do not have to act on it.",
    hint: 'You might say silently: "Strong urge to… I feel it in my…".',
  },
  {
    id: 'ride',
    title: 'Ride the wave',
    body: 'Track the urge like a wave: rising, peaking, and falling. Notice any small changes without judging them.',
    hint: 'Imagine the urge as a wave. Your only job is to observe it changing.',
    duration: 90,
  },
  {
    id: 'choose',
    title: 'Choose a next step',
    body: 'From this slightly steadier place, choose one tiny next step that moves you toward your values.',
    hint: 'The goal is to move just a little closer to how you\'d like to handle this over time.',
  },
]

export default function UrgeSurfing() {
  const [stepIndex, setStepIndex] = useState(0)
  const [completed, setCompleted] = useState(false)
  const [timer, setTimer] = useState(0)
  const [timerActive, setTimerActive] = useState(false)

  const step = STEPS[stepIndex]
  const isLast = stepIndex === STEPS.length - 1

  useEffect(() => {
    if (!timerActive || timer <= 0) {
      if (timerActive && timer <= 0) setTimerActive(false)
      return
    }
    const id = setInterval(() => setTimer((t) => t - 1), 1000)
    return () => clearInterval(id)
  }, [timerActive, timer])

  const next = () => {
    if (!isLast) {
      const nextStep = STEPS[stepIndex + 1]
      setStepIndex((i) => i + 1)
      if (nextStep.duration) {
        setTimer(nextStep.duration)
        setTimerActive(true)
      }
    } else {
      setCompleted(true)
    }
  }

  const back = () => {
    if (stepIndex > 0) {
      setStepIndex((i) => i - 1)
      setTimerActive(false)
    }
  }

  const reset = () => {
    setStepIndex(0)
    setCompleted(false)
    setTimerActive(false)
    setTimer(0)
  }

  if (completed) {
    return (
      <Card className="max-w-md mx-auto">
        <CardContent className="text-center py-12 space-y-5">
          <WaveVisualizer isActive={false} />
          <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: 'spring', bounce: 0.5 }}>
            <CheckCircle2 className="w-16 h-16 text-green-500 mx-auto" />
          </motion.div>
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
            <h3 className="text-xl font-semibold text-gray-800 dark:text-gray-100">Wave surfed 🌊</h3>
            <p className="text-gray-600 dark:text-gray-400 mt-2 text-sm">
              You rode the wave instead of fighting it. That takes real strength. The urge may return — and you can surf it again.
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

  const progress = ((stepIndex + 1) / STEPS.length) * 100

  return (
    <Card className="max-w-md mx-auto">
      <CardHeader className="text-center">
        <CardTitle>Urge Surfing</CardTitle>
        <CardDescription>Notice, ride, and choose — without needing to fight the urge</CardDescription>
      </CardHeader>

      <CardContent className="space-y-6">
        <WaveVisualizer isActive={step.id === 'ride' && timerActive} />

        <div className="flex items-center justify-between text-sm text-gray-600 dark:text-gray-400">
          <span>Step {stepIndex + 1} of {STEPS.length}</span>
          {timerActive && <span className="font-mono text-lg text-sky-600">{timer}s</span>}
        </div>
        <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
          <div className="bg-sky-500 h-2 rounded-full transition-all duration-300" style={{ width: `${progress}%` }} />
        </div>

        <AnimatePresence mode="wait">
          <motion.div
            key={stepIndex}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            className="space-y-3"
          >
            <h3 className="text-lg font-semibold text-sky-800 dark:text-sky-300 text-center">{step.title}</h3>
            <p className="text-sm text-gray-700 dark:text-gray-300 text-center">{step.body}</p>
          </motion.div>
        </AnimatePresence>

        <div className="text-xs text-gray-600 dark:text-gray-400 bg-gray-50 dark:bg-gray-800/50 border border-gray-200 dark:border-gray-700 p-3 rounded-xl">
          {step.hint}
        </div>

        <div className="flex justify-between gap-3">
          <Button variant="outline" size="sm" onClick={back} disabled={stepIndex === 0}>Back</Button>
          <Button variant="grounding" size="lg" onClick={next}>
            {isLast ? 'Finish' : 'Next'}
          </Button>
        </div>
      </CardContent>

      <div className="px-6 pb-6 pt-0"><div className="pt-4 mt-2 border-t border-gray-100 dark:border-gray-800">
        <ShareInline title="Urge Surfing" text="Try an urge surfing exercise for strong impulses on CalmMyself." />
      </div></div>
    </Card>
  )
}
