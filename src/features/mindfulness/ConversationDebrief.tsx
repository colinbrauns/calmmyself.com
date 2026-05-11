"use client"

import { useState } from 'react'
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { motion, AnimatePresence } from 'framer-motion'
import { MessageSquare, CheckCircle2, RotateCcw, ArrowLeft, ArrowRight } from 'lucide-react'
import ShareInline from '@/components/ShareInline'

interface DebriefStep {
  label: string
  description: string
  placeholder: string
}

const STEPS: DebriefStep[] = [
  {
    label: 'What actually happened?',
    description: 'Stick to simple facts, like a short summary you might tell a neutral observer.',
    placeholder: 'e.g. We talked about the schedule. It got tense for a few minutes...',
  },
  {
    label: 'What went even slightly okay?',
    description: 'It might be as small as "I stayed in the room" or "I took a breath before answering."',
    placeholder: 'e.g. I paused before replying once...',
  },
  {
    label: 'What can you gently let go of for now?',
    description: 'For example: replaying every line, guessing what others think, or trying to fix the past.',
    placeholder: 'e.g. Worrying about what they thought of my answer...',
  },
]

export default function ConversationDebrief() {
  const [stepIndex, setStepIndex] = useState(0)
  const [answers, setAnswers] = useState(['', '', ''])
  const [completed, setCompleted] = useState(false)

  const step = STEPS[stepIndex]
  const isLast = stepIndex === STEPS.length - 1

  const setAnswer = (value: string) => {
    const next = [...answers]
    next[stepIndex] = value
    setAnswers(next)
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
    setAnswers(['', '', ''])
    setCompleted(false)
  }

  if (completed) {
    return (
      <Card className="max-w-md mx-auto">
        <CardContent className="text-center py-10 space-y-5">
          <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: 'spring', bounce: 0.5 }}>
            <CheckCircle2 className="w-16 h-16 text-green-500 mx-auto" />
          </motion.div>
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
            <h3 className="text-xl font-semibold text-gray-800 dark:text-gray-100">Gently processed \ud83d\udc9b</h3>
            <p className="text-gray-600 dark:text-gray-400 mt-2 text-sm">
              You may still feel stirred up, and that&apos;s okay. You softened the harshest self-criticism and brought a bit more balance.
            </p>
          </motion.div>
          <div className="text-xs text-gray-500 dark:text-gray-400 bg-gray-50 dark:bg-gray-800/50 border border-gray-200 dark:border-gray-700 p-3 rounded-xl max-w-xs mx-auto">
            Pairing this with a calming practice (like a breath exercise) can help your body catch up with the reflection.
          </div>
          <div className="flex gap-3 justify-center pt-2">
            <Button onClick={reset} variant="calm" size="lg" className="gap-2">
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

  return (
    <Card className="max-w-md mx-auto">
      <CardHeader className="text-center">
        <div className="flex items-center justify-center gap-2 mb-2">
          <MessageSquare className="w-5 h-5 text-calm-600" />
          <CardTitle>After\u2011Conversation De\u2011Brief</CardTitle>
        </div>
        <CardDescription>Gently come down from a tough social moment</CardDescription>
      </CardHeader>

      <CardContent className="space-y-6">
        <div className="flex items-center justify-between text-sm text-gray-600 dark:text-gray-400">
          <span>Step {stepIndex + 1} of {STEPS.length}</span>
        </div>
        <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
          <div className="bg-purple-400 h-2 rounded-full transition-all duration-300" style={{ width: `${((stepIndex + 1) / STEPS.length) * 100}%` }} />
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
              rows={3}
              className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-xl bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-500 focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
              placeholder={step.placeholder}
              value={answers[stepIndex]}
              onChange={(e) => setAnswer(e.target.value)}
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
        <ShareInline title="After\u2011Conversation De\u2011Brief" text="Gently de-brief after a tough conversation on CalmMyself." />
      </div></div>
    </Card>
  )
}
