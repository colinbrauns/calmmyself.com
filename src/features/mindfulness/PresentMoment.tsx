'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/Button'
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/Card'
import { RefreshCw, Clock, Play, CheckCircle2, RotateCcw, ArrowLeft, Sparkles } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import ShareInline from '@/components/ShareInline'

const PRESENT_MOMENT_PROMPTS = [
  "What do you notice about your breathing right now?",
  "How does your body feel in this moment?",
  "What sounds can you hear around you?",
  "What thoughts are passing through your mind?",
  "How are your feet connecting with the ground?",
  "What emotions are present for you right now?",
  "What can you see in your immediate surroundings?",
  "How does the air feel on your skin?",
  "What is the quality of light around you?",
  "What does this moment feel like in your body?",
  "If you were to describe 'right now' in three words, what would they be?",
  "What is the most subtle sensation you can notice?",
  "How present do you feel on a scale of 1-10?",
  "What would you like to appreciate about this moment?",
  "How has this moment been a gift to you?"
]

const DURATION_OPTIONS = [
  { label: '2 min', seconds: 120 },
  { label: '5 min', seconds: 300 },
  { label: '10 min', seconds: 600 },
]

export default function PresentMoment() {
  const [currentPrompt, setCurrentPrompt] = useState(0)
  const [sessionState, setSessionState] = useState<'setup' | 'active' | 'completed'>('setup')
  const [duration, setDuration] = useState(300)
  const [elapsed, setElapsed] = useState(0)
  const [promptKey, setPromptKey] = useState(0)

  const getRandomPrompt = () => {
    const availablePrompts = PRESENT_MOMENT_PROMPTS.filter((_, index) => index !== currentPrompt)
    const randomIndex = Math.floor(Math.random() * availablePrompts.length)
    const newPromptIndex = PRESENT_MOMENT_PROMPTS.findIndex(prompt => prompt === availablePrompts[randomIndex])
    setCurrentPrompt(newPromptIndex)
    setPromptKey(k => k + 1)
  }

  const startSession = () => {
    setSessionState('active')
    setElapsed(0)
    getRandomPrompt()
  }

  const reset = () => {
    setSessionState('setup')
    setElapsed(0)
  }

  useEffect(() => {
    let interval: NodeJS.Timeout | null = null
    if (sessionState === 'active') {
      interval = setInterval(() => {
        setElapsed(prev => {
          const next = prev + 1
          if (next >= duration) {
            setSessionState('completed')
            if (interval) clearInterval(interval)
          }
          return next
        })
      }, 1000)
    }
    return () => { if (interval) clearInterval(interval) }
  }, [sessionState, duration])

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins}:${secs.toString().padStart(2, '0')}`
  }

  if (sessionState === 'completed') {
    return (
      <Card className="max-w-md mx-auto">
        <CardContent className="text-center py-10 space-y-5">
          <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: 'spring', bounce: 0.5 }}>
            <CheckCircle2 className="w-16 h-16 text-green-500 mx-auto" />
          </motion.div>
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
            <h3 className="text-xl font-semibold text-gray-800 dark:text-gray-100">Beautifully present ✨</h3>
            <p className="text-gray-600 dark:text-gray-400 mt-2 text-sm">
              You spent {formatTime(duration)} in present moment awareness. This moment is always available to you — no app needed.
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
          <ShareInline title="Present Moment Awareness" text="Practice present moment awareness on CalmMyself" />
        </CardContent>
      </Card>
    )
  }

  if (sessionState === 'setup') {
    return (
      <Card className="max-w-md mx-auto">
        <CardHeader className="text-center">
          <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}>
            <div className="flex items-center justify-center gap-2 mb-2">
              <Sparkles className="w-5 h-5 text-purple-500" />
              <CardTitle>Present Moment Awareness</CardTitle>
            </div>
            <CardDescription>
              Simple questions to anchor you in the now
            </CardDescription>
          </motion.div>
        </CardHeader>
        <CardContent className="space-y-6">
          <div>
            <p className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3 text-center">Session Duration</p>
            <div className="flex gap-2 justify-center">
              {DURATION_OPTIONS.map((d) => (
                <Button key={d.seconds} variant={duration === d.seconds ? 'grounding' : 'outline'} size="sm" onClick={() => setDuration(d.seconds)}>
                  {d.label}
                </Button>
              ))}
            </div>
          </div>

          <div className="bg-gray-50 dark:bg-gray-800/50 p-4 rounded-xl">
            <p className="text-sm text-purple-800 dark:text-purple-200 mb-2 font-medium">
              How to practice:
            </p>
            <ul className="text-sm text-gray-600 dark:text-gray-400 space-y-1">
              <li>• Read each question slowly</li>
              <li>• Take a moment to genuinely explore it</li>
              <li>• Notice what arises without judgment</li>
              <li>• There are no right or wrong answers</li>
            </ul>
          </div>

          <Button onClick={startSession} variant="grounding" size="lg" className="w-full gap-2">
            <Play size={18} /> Begin Practice
          </Button>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="max-w-md mx-auto">
      <CardHeader className="text-center pb-2">
        <div className="flex items-center justify-center gap-2 mb-1">
          <Sparkles className="w-5 h-5 text-purple-500" />
          <CardTitle>Present Moment</CardTitle>
        </div>
      </CardHeader>

      <CardContent className="space-y-6">
        {/* Timer */}
        <div className="flex items-center justify-center gap-2 bg-purple-50 dark:bg-purple-950/30 rounded-xl p-3">
          <Clock size={16} className="text-purple-600" />
          <span className="text-lg font-mono text-purple-800 dark:text-purple-200">
            {formatTime(duration - elapsed)}
          </span>
        </div>

        <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-1.5">
          <div className="bg-purple-400 h-1.5 rounded-full transition-all" style={{ width: `${(elapsed / duration) * 100}%` }} />
        </div>

        {/* Current Prompt */}
        <AnimatePresence mode="wait">
          <motion.div
            key={promptKey}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.4 }}
            className="bg-gradient-to-r from-purple-50 to-green-50 dark:from-purple-950/30 dark:to-green-950/30 rounded-xl p-6 text-center"
          >
            <div className="mb-4">
              <div className="w-12 h-12 bg-purple-200 dark:bg-purple-800 rounded-full flex items-center justify-center mx-auto mb-3">
                <span className="text-xl">💭</span>
              </div>
            </div>
            <p className="text-lg text-gray-800 dark:text-gray-100 leading-relaxed font-medium">
              {PRESENT_MOMENT_PROMPTS[currentPrompt]}
            </p>
          </motion.div>
        </AnimatePresence>

        {/* Reflection Area */}
        <div className="space-y-3">
          <label className="text-sm font-medium text-gray-700 dark:text-gray-400">
            Your reflection (optional):
          </label>
          <textarea
            className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-xl bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-500 focus:ring-2 focus:ring-purple-500 focus:border-purple-500 resize-none"
            rows={3}
            placeholder="What do you notice? How does this moment feel?"
          />
        </div>

        {/* Next prompt */}
        <Button
          onClick={getRandomPrompt}
          variant="ghost"
          size="lg"
          className="flex items-center gap-2 w-full"
        >
          <RefreshCw size={18} />
          <span>Next Question</span>
        </Button>
      </CardContent>
    </Card>
  )
}
