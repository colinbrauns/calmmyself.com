"use client"

import { useState, useEffect, useCallback, useRef } from 'react'
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { Play, Pause, RotateCcw, Activity } from 'lucide-react'
import BreathingCycle, { type BreathingPattern } from '@/components/BreathingCycle'
import { AnimatePresence, motion } from 'framer-motion'
import ShareInline from '@/components/ShareInline'

const PATTERN: BreathingPattern = [
  { phase: 'inhale', label: 'Inhale', durationMs: 5000 },
  { phase: 'exhale', label: 'Exhale', durationMs: 5000 },
]

const MAX_CYCLES = 6


export default function CoherentBreathing() {
  const [isActive, setIsActive] = useState(false)
  const [phaseIndex, setPhaseIndex] = useState(0)
  const [cycleCount, setCycleCount] = useState(0)
  const [timeRemaining, setTimeRemaining] = useState(5000)
  const [isComplete, setIsComplete] = useState(false)
  const cycleCountRef = useRef(0)

  const next = useCallback(() => {
    setPhaseIndex((prev) => {
      const nextPhase = (prev + 1) % PATTERN.length
      if (nextPhase === 0) {
        cycleCountRef.current += 1
        const newCycleCount = cycleCountRef.current
        setCycleCount(newCycleCount)
        if (newCycleCount >= MAX_CYCLES) {
          setIsActive(false)
          setIsComplete(true)
          return prev
        }
      }
      setTimeRemaining(PATTERN[nextPhase].durationMs)
      return nextPhase
    })
  }, [])

  useEffect(() => {
    if (!isActive || isComplete) return
    const id = setInterval(() => {
      setTimeRemaining((t) => {
        const newTime = t - 100
        if (newTime <= 0) { 
          next()
          return PATTERN[(phaseIndex + 1) % PATTERN.length].durationMs 
        }
        return newTime
      })
    }, 100)
    return () => clearInterval(id)
  }, [isActive, isComplete, phaseIndex, next])

  const reset = () => { 
    setIsActive(false)
    setPhaseIndex(0)
    setCycleCount(0)
    cycleCountRef.current = 0
    setTimeRemaining(5000)
    setIsComplete(false)
  }
  const currentLabel = PATTERN[phaseIndex].label
  const progress = ((PATTERN[phaseIndex].durationMs - timeRemaining) / PATTERN[phaseIndex].durationMs) * 100

  return (
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
          <div className="relative flex items-center justify-center">
            <BreathingCycle
              pattern={PATTERN}
              isActive={isActive}
              cycleIndex={phaseIndex}
              size={112}
              colors={{ from: 'from-calm-300', to: 'to-calm-500' }}
              scaleMin={1}
              scaleMax={1.5}
            />
            <div className="pointer-events-none absolute inset-0 flex items-center justify-center text-white font-medium text-sm select-none">
              {Math.ceil(timeRemaining/1000)}
            </div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-semibold text-calm-800 dark:text-gray-100 mb-2 min-h-[32px]">
              <AnimatePresence mode="wait">
                <motion.span key={currentLabel} initial={{opacity:0,y:6}} animate={{opacity:1,y:0}} exit={{opacity:0,y:-6}} transition={{duration:0.25}}>
                  {currentLabel}
                </motion.span>
              </AnimatePresence>
            </div>
            <div className="text-sm text-gray-600 dark:text-gray-400">
              {isComplete ? (
                <span className="text-green-600 font-semibold">✨ Complete! {MAX_CYCLES} cycles finished</span>
              ) : (
                `Cycle ${cycleCount + 1} of ${MAX_CYCLES}`
              )}
            </div>
          </div>
          <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
            <div className="bg-sky-500 h-2 rounded-full transition-all duration-100 ease-linear" style={{ width: `${progress}%` }} />
          </div>
        </div>
        <div className="flex justify-center gap-3">
          <Button onClick={() => setIsActive(!isActive)} variant="calm" size="lg" className="flex items-center gap-2">
            {isActive ? <Pause size={18}/> : <Play size={18}/>} {isActive ? 'Pause' : 'Start'}
          </Button>
          <Button onClick={reset} variant="outline" size="lg" className="flex items-center gap-2"><RotateCcw size={18}/>Reset</Button>
        </div>
      </CardContent>
      <div className="px-6 pb-6 pt-0"><div className="pt-4 mt-2 border-t border-gray-100 dark:border-gray-800 space-y-3">
        <div className="text-xs text-gray-600 dark:text-gray-400 bg-gray-50 dark:bg-gray-800/50 border border-gray-200 dark:border-gray-700 p-3 rounded-xl">
          About: Coherent breathing (around 5–6 breaths per minute) can help balance autonomic tone and improve HRV. Breathe softly without strain.
          <br/>
          Evidence: Search for "hrv biofeedback coherent breathing randomized controlled trial".
        </div>
        <ShareInline title="Coherent Breathing" text="Try coherent breathing (6 bpm) on CalmMyself" />
      </div></div>
    </Card>
  )
}
