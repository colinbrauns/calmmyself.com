"use client"

import { useState, useEffect } from 'react'
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { motion, AnimatePresence } from 'framer-motion'
import { CheckCircle2, RotateCcw, ArrowLeft, Play } from 'lucide-react'
import ShareInline from '@/components/ShareInline'

const PROMPTS = [
  { text: 'Roll your shoulders gently forward and back a few times.', duration: 15 },
  { text: 'Stretch your fingers wide, then soften your hands.', duration: 12 },
  { text: 'Press your feet into the floor and notice the contact.', duration: 10 },
  { text: 'Gently turn your head side to side within a comfortable range.', duration: 15 },
  { text: 'Sit up a little taller, then allow your posture to soften again.', duration: 10 },
] as const

export default function MicroMovementCheckIn() {
  const [index, setIndex] = useState(0)
  const [phase, setPhase] = useState<'ready' | 'active' | 'done'>('ready')
  const [timer, setTimer] = useState(0)

  const prompt = PROMPTS[index]
  const isLast = index === PROMPTS.length - 1

  useEffect(() => {
    if (phase !== 'active') return
    if (timer <= 0) {
      if (isLast) {
        setPhase('done')
      } else {
        setIndex((i) => i + 1)
        setTimer(PROMPTS[index + 1].duration)
      }
      return
    }
    const id = setInterval(() => setTimer((t) => t - 1), 1000)
    return () => clearInterval(id)
  }, [phase, timer, isLast, index])

  const start = () => {
    setPhase('active')
    setTimer(prompt.duration)
  }

  const reset = () => {
    setIndex(0)
    setPhase('ready')
    setTimer(0)
  }

  if (phase === 'done') {
    return (
      <Card className="max-w-md mx-auto">
        <CardContent className="text-center py-12 space-y-5">
          <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: 'spring', bounce: 0.5 }}>
            <CheckCircle2 className="w-16 h-16 text-green-500 mx-auto" />
          </motion.div>
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
            <h3 className="text-xl font-semibold text-gray-800 dark:text-gray-100">Body checked in 💛</h3>
            <p className="text-gray-600 dark:text-gray-400 mt-2 text-sm">
              Those small movements can make a real difference. Notice how your body feels now compared to a minute ago.
            </p>
          </motion.div>
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
        <CardTitle>Micro‑Movement Check‑In</CardTitle>
        <CardDescription>Small, seated movements to wake up the body</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="flex items-center justify-between text-sm text-gray-600 dark:text-gray-400">
          <span>Step {index + 1} of {PROMPTS.length}</span>
          {phase === 'active' && <span className="font-mono text-lg text-amber-600">{timer}s</span>}
        </div>
        <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
          <motion.div
            className="bg-amber-500 h-2 rounded-full"
            animate={{ width: `${((index + (phase === 'active' ? 1 - timer / prompt.duration : 0)) / PROMPTS.length) * 100}%` }}
            transition={{ duration: 0.3 }}
          />
        </div>

        <AnimatePresence mode="wait">
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            className="text-center space-y-3 min-h-[80px] flex flex-col justify-center"
          >
            <p className="text-sm text-gray-700 dark:text-gray-300">{prompt.text}</p>
            <p className="text-xs text-gray-500 dark:text-gray-400">
              Move within a range that feels safe for your body. You can skip or adapt any step.
            </p>
          </motion.div>
        </AnimatePresence>

        {phase === 'active' && (
          <motion.div
            className="h-2 bg-gray-100 dark:bg-gray-800 rounded-full overflow-hidden"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          >
            <motion.div
              className="h-full bg-green-400 rounded-full"
              animate={{ width: `${((prompt.duration - timer) / prompt.duration) * 100}%` }}
              transition={{ duration: 0.5 }}
            />
          </motion.div>
        )}

        <div className="flex justify-center gap-3">
          {phase === 'ready' && (
            <Button variant="grounding" size="lg" onClick={start} className="gap-2">
              <Play size={16} /> Begin
            </Button>
          )}
          <Button variant="outline" size="lg" onClick={reset}>
            Reset
          </Button>
        </div>
      </CardContent>
      <div className="px-6 pb-6 pt-0"><div className="pt-4 mt-2 border-t border-gray-100 dark:border-gray-800">
        <ShareInline
          title="Micro‑Movement Check‑In"
          text="Use a micro‑movement check‑in when feeling numb or shut down on CalmMyself."
        />
      </div></div>
    </Card>
  )
}
