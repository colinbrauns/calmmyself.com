'use client'

import { useState, useEffect, useRef, useCallback } from 'react'
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { Smile, Play, RotateCcw } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import ShareInline from '@/components/ShareInline'

const STEPS = [
  { title: 'Open wide', desc: 'Open your mouth as wide as comfortable. Hold and feel the stretch.', duration: 10 },
  { title: 'Side to side', desc: 'Slowly move your jaw to the left, then the right. Gentle and slow.', duration: 15 },
  { title: 'Massage temples', desc: 'Place fingertips on your temples. Make slow circles with gentle pressure.', duration: 20 },
  { title: 'Massage jaw muscles', desc: 'Move fingers to the jaw hinge. Massage in small circles, releasing tension.', duration: 20 },
  { title: 'Intentional yawn', desc: 'Open wide and let yourself yawn. If a real yawn comes, let it happen fully.', duration: 15 },
]

export default function JawRelease() {
  const [step, setStep] = useState(-1)
  const [timeLeft, setTimeLeft] = useState(0)
  const [completed, setCompleted] = useState(false)

  const startStep = useCallback((idx: number) => { setStep(idx); setTimeLeft(STEPS[idx].duration) }, [])

  useEffect(() => {
    if (step < 0 || completed) return
    const id = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) {
          if (step < STEPS.length - 1) startStep(step + 1)
          else setCompleted(true)
          return 0
        }
        return prev - 1
      })
    }, 1000)
    return () => clearInterval(id)
  }, [step, completed, startStep])

  const reset = () => { setStep(-1); setTimeLeft(0); setCompleted(false) }

  if (completed) {
    return (
      <Card className="max-w-md mx-auto">
        <CardContent className="text-center py-12 space-y-6">
          <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: 'spring' }}>
            <div className="w-20 h-20 rounded-full bg-purple-100 dark:bg-purple-900/50 flex items-center justify-center mx-auto">
              <Smile className="w-10 h-10 text-purple-600" />
            </div>
          </motion.div>
          <div>
            <h3 className="text-xl font-semibold text-gray-800 dark:text-gray-100 mb-2">Tension released 😌</h3>
            <p className="text-gray-500 dark:text-gray-400">Your jaw holds so much stress. Notice how much lighter it feels now.</p>
          </div>
          <div className="flex justify-center gap-3"><Button onClick={reset} variant="calm" size="lg">Do Again</Button></div>
          <ShareInline title="Jaw Release" text="Release jaw tension on CalmMyself" />
        </CardContent>
      </Card>
    )
  }

  if (step < 0) {
    return (
      <Card className="max-w-md mx-auto">
        <CardHeader className="text-center">
          <div className="flex items-center justify-center gap-2 mb-2"><Smile className="w-5 h-5 text-purple-600" /><CardTitle>Jaw Release</CardTitle></div>
          <CardDescription>Release stored tension in your jaw — a common stress spot</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="flex justify-center"><Button onClick={() => startStep(0)} variant="calm" size="lg" className="flex items-center gap-2"><Play size={18} /> Begin</Button></div>
          <ShareInline title="Jaw Release" text="Release jaw tension on CalmMyself" />
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="max-w-md mx-auto">
      <CardHeader className="text-center"><div className="flex items-center justify-center gap-2 mb-2"><Smile className="w-5 h-5 text-purple-600" /><CardTitle>Jaw Release</CardTitle></div></CardHeader>
      <CardContent className="space-y-6">
        <div className="flex justify-center gap-1">{STEPS.map((_, i) => (<div key={i} className={`w-6 h-1.5 rounded-full transition-colors ${i <= step ? 'bg-purple-500' : 'bg-gray-200 dark:bg-gray-700'}`} />))}</div>
        <AnimatePresence mode="wait">
          <motion.div key={step} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="text-center space-y-4 py-4">
            <p className="text-lg font-semibold text-gray-800 dark:text-gray-100">{STEPS[step].title}</p>
            <p className="text-gray-600 dark:text-gray-400">{STEPS[step].desc}</p>
            <div className="text-3xl font-bold text-purple-600 dark:text-purple-400">{timeLeft}s</div>
          </motion.div>
        </AnimatePresence>
        <div className="flex justify-center"><Button onClick={reset} variant="outline" size="lg" className="flex items-center gap-2"><RotateCcw size={18} /> Start Over</Button></div>
      </CardContent>
    </Card>
  )
}
