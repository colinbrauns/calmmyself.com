"use client"

import { useEffect, useState } from 'react'
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { motion, AnimatePresence } from 'framer-motion'
import { Heart, CheckCircle2, RotateCcw, ArrowLeft, ArrowRight } from 'lucide-react'
import ShareInline from '@/components/ShareInline'

const STORAGE_KEY = 'calmmyself:journal:last-entry'

interface JournalStep {
  label: string
  description: string
  placeholder: string
}

const STEPS: JournalStep[] = [
  {
    label: 'What happened?',
    description: 'Briefly describe the situation or what\'s on your mind.',
    placeholder: 'Something happened today that...',
  },
  {
    label: 'What is your mind saying?',
    description: 'Capture any looping thoughts, worries, or stories your mind is telling.',
    placeholder: 'My mind keeps saying...',
  },
  {
    label: 'What would you say to a close friend?',
    description: 'Let that kinder voice speak to you as well, even if just a little.',
    placeholder: 'If my friend told me this, I\'d say...',
  },
]

export default function CompassionateJournaling() {
  const [stepIndex, setStepIndex] = useState(0)
  const [entries, setEntries] = useState(['', '', ''])
  const [completed, setCompleted] = useState(false)

  useEffect(() => {
    if (typeof window === 'undefined') return
    try {
      const raw = window.localStorage.getItem(STORAGE_KEY)
      if (!raw) return
      const parsed = JSON.parse(raw)
      if (Array.isArray(parsed) && parsed.length === 3) setEntries(parsed)
    } catch {}
  }, [])

  useEffect(() => {
    if (typeof window === 'undefined') return
    try { window.localStorage.setItem(STORAGE_KEY, JSON.stringify(entries)) } catch {}
  }, [entries])

  const step = STEPS[stepIndex]
  const isLast = stepIndex === STEPS.length - 1

  const setEntry = (value: string) => {
    const next = [...entries]
    next[stepIndex] = value
    setEntries(next)
  }

  const next = () => {
    if (!isLast) setStepIndex((i) => i + 1)
    else setCompleted(true)
  }

  const back = () => {
    if (stepIndex > 0) setStepIndex((i) => i - 1)
  }

  const reset = () => {
    setStepIndex(0)
    setEntries(['', '', ''])
    setCompleted(false)
  }

  if (completed) {
    return (
      <Card className="max-w-md mx-auto">
        <CardContent className="text-center py-10 space-y-5">
          <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: 'spring', bounce: 0.5 }}>
            <Heart className="w-16 h-16 text-rose-400 mx-auto" fill="currentColor" />
          </motion.div>
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
            <h3 className="text-xl font-semibold text-gray-800 dark:text-gray-100">A little kindness goes a long way \ud83d\udc9c</h3>
            <p className="text-gray-600 dark:text-gray-400 mt-2 text-sm">
              You don&apos;t need to get this perfect. The goal was simply to get things out of your head and offer even a small dose of compassion.
            </p>
          </motion.div>
          <div className="text-xs text-gray-500 dark:text-gray-400 bg-gray-50 dark:bg-gray-800/50 border border-gray-200 dark:border-gray-700 p-3 rounded-xl max-w-xs mx-auto">
            Nothing is stored on a server. Entries stay in your browser only.
          </div>
          <div className="flex gap-3 justify-center pt-2">
            <Button onClick={reset} variant="calm" size="lg" className="gap-2">
              <RotateCcw size={16} /> Write Again
            </Button>
            <Button onClick={() => window.history.back()} variant="outline" size="lg" className="gap-2">
              <ArrowLeft size={16} /> Back
            </Button>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="max-w-md mx-auto">
      <CardHeader className="text-center">
        <div className="flex items-center justify-center gap-2 mb-2">
          <Heart className="w-5 h-5 text-rose-400" />
          <CardTitle>Compassionate Journaling</CardTitle>
        </div>
        <CardDescription>A quick, private space to get worries out and respond kindly</CardDescription>
      </CardHeader>

      <CardContent className="space-y-6">
        <div className="flex items-center justify-between text-sm text-gray-600 dark:text-gray-400">
          <span>Step {stepIndex + 1} of {STEPS.length}</span>
        </div>
        <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
          <div className="bg-rose-400 h-2 rounded-full transition-all duration-300" style={{ width: `${((stepIndex + 1) / STEPS.length) * 100}%` }} />
        </div>

        <AnimatePresence mode="wait">
          <motion.div
            key={stepIndex}
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -30 }}
            className="space-y-3"
          >
            <label className="block font-medium text-gray-700 dark:text-gray-200">{step.label}</label>
            <p className="text-xs text-gray-500 dark:text-gray-400">{step.description}</p>
            <textarea
              rows={4}
              className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-xl bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-500 text-sm focus:ring-2 focus:ring-rose-400 focus:border-rose-400"
              placeholder={step.placeholder}
              value={entries[stepIndex]}
              onChange={(e) => setEntry(e.target.value)}
            />
          </motion.div>
        </AnimatePresence>

        <div className="flex justify-between gap-3">
          <Button variant="outline" size="sm" onClick={back} disabled={stepIndex === 0}>
            <ArrowLeft size={16} />
          </Button>
          <Button variant="calm" size="lg" onClick={next} className="gap-2">
            {isLast ? 'Finish' : 'Next'} {!isLast && <ArrowRight size={16} />}
          </Button>
        </div>
      </CardContent>

      <div className="px-6 pb-6 pt-0"><div className="pt-4 mt-2 border-t border-gray-100 dark:border-gray-800">
        <ShareInline title="Compassionate Journaling" text="Try a brief compassionate journaling exercise on CalmMyself." />
      </div></div>
    </Card>
  )
}
