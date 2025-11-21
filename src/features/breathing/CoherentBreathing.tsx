"use client"

import { useState, useEffect, useCallback } from 'react'
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { Play, Pause, RotateCcw, Activity } from 'lucide-react'
import BreathingCycle, { type BreathingPattern } from '@/components/BreathingCycle'
import { AnimatePresence, motion } from 'framer-motion'
import ShareInline from '@/components/ShareInline'
import CelebrationAnimation from '@/components/CelebrationAnimation'

const PATTERN: BreathingPattern = [
  { phase: 'inhale', label: 'Inhale', durationMs: 5000 },
  { phase: 'exhale', label: 'Exhale', durationMs: 5000 },
]

export default function CoherentBreathing() {
  const [isActive, setIsActive] = useState(false)
  const [phaseIndex, setPhaseIndex] = useState(0)
  const [cycleCount, setCycleCount] = useState(0)
  const [timeRemaining, setTimeRemaining] = useState(5000)
  const [showCelebration, setShowCelebration] = useState(false)

  const next = useCallback(() => {
    setPhaseIndex((prev) => {
      const next = (prev + 1) % PATTERN.length
      if (next === 0) {
        setCycleCount((c) => {
          const newCount = c + 1
          if (newCount === 6) {
            setShowCelebration(true)
            setTimeout(() => setShowCelebration(false), 3000)
          }
          return newCount
        })
      }
      setTimeRemaining(PATTERN[next].durationMs)
      return next
    })
  }, [])

  useEffect(() => {
    if (!isActive) return
    const id = setInterval(() => {
      setTimeRemaining((t) => {
        if (t <= 100) { next(); return PATTERN[(phaseIndex + 1) % PATTERN.length].durationMs }
        return t - 100
      })
    }, 100)
    return () => clearInterval(id)
  }, [isActive, phaseIndex, next])

  const reset = () => { setIsActive(false); setPhaseIndex(0); setCycleCount(0); setTimeRemaining(5000) }
  const currentLabel = PATTERN[phaseIndex].label
  const progress = ((PATTERN[phaseIndex].durationMs - timeRemaining) / PATTERN[phaseIndex].durationMs) * 100

  return (
    <>
      <CelebrationAnimation show={showCelebration} />
      <Card className="max-w-md mx-auto">
      <CardHeader className="text-center">
        <div className="flex items-center justify-center gap-2 mb-2">
          <Activity className="w-5 h-5 text-calm-600" />
          <CardTitle>Coherent Breathing (6 bpm)</CardTitle>
        </div>
        <CardDescription>5s inhale • 5s exhale • steady rhythm</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="flex flex-col items-center space-y-4">
          <div className="relative w-32 h-32 flex items-center justify-center">
            <BreathingCycle
              pattern={PATTERN}
              isActive={isActive}
              cycleIndex={phaseIndex}
              onCycle={(n) => setPhaseIndex(n)}
              size={112}
              colors={{ from: 'from-calm-300', to: 'to-calm-500' }}
              scaleMin={1}
              scaleMax={1.5}
            />
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
              <div className="text-calm-900 font-semibold text-sm select-none bg-white/80 rounded px-2 py-0.5">
                {Math.ceil(timeRemaining/1000)}
              </div>
            </div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-semibold text-calm-800 mb-2 min-h-[32px]">
              <AnimatePresence mode="wait">
                <motion.span key={currentLabel} initial={{opacity:0,y:6}} animate={{opacity:1,y:0}} exit={{opacity:0,y:-6}} transition={{duration:0.25}}>
                  {currentLabel}
                </motion.span>
              </AnimatePresence>
            </div>
            <div className="text-sm text-gray-600">Cycle {cycleCount + 1}</div>
          </div>
          <div className="w-full bg-calm-100 rounded-full h-2">
            <div className="bg-calm-500 h-2 rounded-full transition-all duration-100 ease-linear" style={{ width: `${progress}%` }} />
          </div>
        </div>
        <div className="flex justify-center gap-3">
          <Button onClick={() => setIsActive(!isActive)} variant="calm" size="lg" className="flex items-center gap-2">
            {isActive ? <Pause size={18}/> : <Play size={18}/>} {isActive ? 'Pause' : 'Start'}
          </Button>
          <Button onClick={reset} variant="outline" size="lg" className="flex items-center gap-2"><RotateCcw size={18}/>Reset</Button>
        </div>
      </CardContent>
      <div className="px-6 pb-6 space-y-3">
        <div className="text-xs text-gray-600 bg-calm-50 border border-calm-100 p-3 rounded-md">
          About: Coherent breathing (around 5–6 breaths per minute) can help balance autonomic tone and improve HRV. Breathe softly without strain.
          <br/>
          Evidence: Search for “hrv biofeedback coherent breathing randomized controlled trial”.
        </div>
        <ShareInline title="Coherent Breathing" text="Try coherent breathing (6 bpm) on CalmMyself" />
      </div>
    </Card>
    </>
  )
}
