"use client"

import { useState, useEffect, useCallback } from 'react'
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { Play, Pause, RotateCcw, Shuffle } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import ShareInline from '@/components/ShareInline'

type Phase = 'inhaleL' | 'hold1' | 'exhaleR' | 'inhaleR' | 'hold2' | 'exhaleL'

const SEQ: { phase: Phase; label: string; duration: number }[] = [
  { phase: 'inhaleL', label: 'Inhale Left', duration: 4000 },
  { phase: 'hold1', label: 'Hold', duration: 4000 },
  { phase: 'exhaleR', label: 'Exhale Right', duration: 4000 },
  { phase: 'inhaleR', label: 'Inhale Right', duration: 4000 },
  { phase: 'hold2', label: 'Hold', duration: 4000 },
  { phase: 'exhaleL', label: 'Exhale Left', duration: 4000 },
]

export default function AlternateNostril() {
  const [isActive, setIsActive] = useState(false)
  const [index, setIndex] = useState(0)
  const [cycleCount, setCycleCount] = useState(0)
  const [remaining, setRemaining] = useState(SEQ[0].duration)

  const next = useCallback(() => {
    setIndex((prev) => {
      const next = (prev + 1) % SEQ.length
      if (next === 0) setCycleCount((c) => c + 1)
      setRemaining(SEQ[next].duration)
      return next
    })
  }, [])

  useEffect(() => {
    if (!isActive) return
    const id = setInterval(() => {
      setRemaining((t) => {
        if (t <= 100) { next(); return SEQ[(index + 1) % SEQ.length].duration }
        return t - 100
      })
    }, 100)
    return () => clearInterval(id)
  }, [isActive, index, next])

  const reset = () => { setIsActive(false); setIndex(0); setCycleCount(0); setRemaining(SEQ[0].duration) }
  const current = SEQ[index]
  const progress = ((current.duration - remaining) / current.duration) * 100

  const leftActive = current.phase === 'inhaleL' || current.phase === 'exhaleL'
  const rightActive = current.phase === 'inhaleR' || current.phase === 'exhaleR'

  return (
    <Card className="max-w-md mx-auto">
      <CardHeader className="text-center">
        <div className="flex items-center justify-center gap-2 mb-2">
          <Shuffle className="w-5 h-5 text-grounding-600" />
          <CardTitle>Alternate Nostril Breathing</CardTitle>
        </div>
        <CardDescription>Balanced pattern to calm and focus</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Nostril indicator */}
        <div className="flex items-center justify-center gap-6">
          <motion.div
            className={`w-10 h-10 rounded-full ${leftActive ? 'bg-grounding-400' : 'bg-grounding-100'} border border-grounding-300`}
            animate={{ scale: leftActive ? 1.1 : 1, opacity: leftActive ? 1 : 0.6 }}
            transition={{ duration: 0.3 }}
            aria-label="Left nostril"
          />
          <motion.div
            className={`w-10 h-10 rounded-full ${rightActive ? 'bg-grounding-400' : 'bg-grounding-100'} border border-grounding-300`}
            animate={{ scale: rightActive ? 1.1 : 1, opacity: rightActive ? 1 : 0.6 }}
            transition={{ duration: 0.3 }}
            aria-label="Right nostril"
          />
        </div>

        {/* Timer */}
        <div className="relative w-32 h-32 mx-auto">
          <div className="absolute inset-0 rounded-full bg-gradient-to-br from-grounding-200 to-grounding-300 opacity-40" />
          <div className="absolute inset-0 flex items-center justify-center text-grounding-900 font-semibold">
            {Math.ceil(remaining/1000)}
          </div>
        </div>

        {/* Labels */}
        <div className="text-center">
          <div className="text-2xl font-semibold text-grounding-800 mb-2 min-h-[32px]">
            <AnimatePresence mode="wait">
              <motion.span key={current.label} initial={{opacity:0,y:6}} animate={{opacity:1,y:0}} exit={{opacity:0,y:-6}} transition={{duration:0.25}}>
                {current.label}
              </motion.span>
            </AnimatePresence>
          </div>
          <div className="text-sm text-gray-600">Cycle {cycleCount + 1}</div>
        </div>

        <div className="w-full bg-grounding-100 rounded-full h-2">
          <div className="bg-grounding-500 h-2 rounded-full transition-all duration-100 ease-linear" style={{ width: `${progress}%` }} />
        </div>

        <div className="flex justify-center gap-3">
          <Button onClick={() => setIsActive(!isActive)} variant="grounding" size="lg" className="flex items-center gap-2">
            {isActive ? <Pause size={18}/> : <Play size={18}/>} {isActive ? 'Pause' : 'Start'}
          </Button>
          <Button onClick={reset} variant="outline" size="lg" className="flex items-center gap-2"><RotateCcw size={18}/>Reset</Button>
        </div>

        <div className="text-xs text-gray-500 bg-grounding-50 border border-grounding-100 p-3 rounded-md">
          Tip: Use the right hand — thumb to gently close right nostril, ring finger to close left. Breathe softly.
        </div>
      </CardContent>
      <div className="px-6 pb-6 space-y-3">
        <div className="text-xs text-gray-600 bg-grounding-50 border border-grounding-100 p-3 rounded-md">
          About: Alternate nostril breathing (nadi shodhana) may help reduce perceived stress and improve attention in some studies. Breathe lightly.
          <br/>
          Evidence: Look up controlled trials on “alternate nostril breathing attention anxiety”.
        </div>
        <ShareInline title="Alternate Nostril Breathing" text="Try alternate nostril breathing on CalmMyself" />
      </div>
    </Card>
  )
}
