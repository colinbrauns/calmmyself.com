'use client'

import { useState, useEffect, useRef, useCallback } from 'react'
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { Waves, Play, Pause, RotateCcw } from 'lucide-react'
import { motion } from 'framer-motion'
import ShareInline from '@/components/ShareInline'

const INHALE = 5
const EXHALE = 6
const DURATIONS = [2, 3, 5]

export default function OceanBreath() {
  const [isRunning, setIsRunning] = useState(false)
  const [durationMin, setDurationMin] = useState(3)
  const [phase, setPhase] = useState<'inhale' | 'exhale'>('inhale')
  const [phaseTime, setPhaseTime] = useState(INHALE)
  const [timeLeft, setTimeLeft] = useState(0)
  const [completed, setCompleted] = useState(false)
  const [cycles, setCycles] = useState(0)
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null)

  const stop = useCallback(() => {
    setIsRunning(false)
    if (timerRef.current) clearInterval(timerRef.current)
    timerRef.current = null
  }, [])

  const start = () => {
    setIsRunning(true)
    setPhase('inhale')
    setPhaseTime(INHALE)
    setCycles(0)
    setTimeLeft(durationMin * 60)
    setCompleted(false)
  }

  const reset = () => { stop(); setCompleted(false); setCycles(0); setTimeLeft(0) }

  useEffect(() => {
    if (!isRunning) return
    timerRef.current = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) { stop(); setCompleted(true); return 0 }
        return prev - 1
      })
      setPhaseTime(prev => {
        if (prev <= 1) {
          setPhase(p => {
            if (p === 'exhale') setCycles(c => c + 1)
            return p === 'inhale' ? 'exhale' : 'inhale'
          })
          return phase === 'inhale' ? EXHALE : INHALE
        }
        return prev - 1
      })
    }, 1000)
    return () => { if (timerRef.current) clearInterval(timerRef.current) }
  }, [isRunning, phase, stop])

  const formatTime = (s: number) => `${Math.floor(s / 60)}:${(s % 60).toString().padStart(2, '0')}`

  if (completed) {
    return (
      <Card className="max-w-md mx-auto">
        <CardContent className="text-center py-12 space-y-6">
          <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: 'spring', stiffness: 200 }}>
            <div className="w-20 h-20 rounded-full bg-teal-100 dark:bg-teal-900/50 flex items-center justify-center mx-auto">
              <Waves className="w-10 h-10 text-teal-600" />
            </div>
          </motion.div>
          <div>
            <h3 className="text-xl font-semibold text-gray-800 dark:text-gray-100 mb-2">Beautifully done 🌊</h3>
            <p className="text-gray-500 dark:text-gray-400">You completed {cycles} cycles of ocean breathing. Let the calm linger.</p>
          </div>
          <div className="flex justify-center gap-3">
            <Button onClick={reset} variant="calm" size="lg">Do Again</Button>
          </div>
          <ShareInline title="Ocean Breath" text="Ujjayi ocean breathing on CalmMyself" />
        </CardContent>
      </Card>
    )
  }

  const waveY = phase === 'inhale' ? -20 : 20

  return (
    <Card className="max-w-md mx-auto">
      <CardHeader className="text-center">
        <div className="flex items-center justify-center gap-2 mb-2">
          <Waves className="w-5 h-5 text-teal-600" />
          <CardTitle>Ocean Breath (Ujjayi)</CardTitle>
        </div>
        <CardDescription>Slow breath with gentle throat constriction, like the sound of ocean waves</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {!isRunning && timeLeft === 0 ? (
          <>
            <div className="flex justify-center gap-2">
              {DURATIONS.map(d => (
                <button key={d} onClick={() => setDurationMin(d)}
                  className={`px-4 py-2 rounded-xl text-sm font-medium transition-all ${d === durationMin ? 'bg-teal-600 text-white' : 'bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400'}`}>
                  {d} min
                </button>
              ))}
            </div>
            <div className="flex justify-center">
              <Button onClick={start} variant="calm" size="lg" className="flex items-center gap-2">
                <Play size={18} /> Begin
              </Button>
            </div>
          </>
        ) : (
          <>
            <div className="relative h-32 rounded-xl overflow-hidden bg-gradient-to-b from-teal-50 to-cyan-100 dark:from-teal-950 dark:to-cyan-950">
              <motion.div
                className="absolute bottom-0 left-0 right-0 h-16 bg-gradient-to-t from-teal-400/40 to-transparent"
                animate={{ y: waveY }}
                transition={{ duration: phase === 'inhale' ? INHALE : EXHALE, ease: 'easeInOut' }}
              />
              <svg className="absolute bottom-0 left-0 right-0" viewBox="0 0 400 60" preserveAspectRatio="none">
                <motion.path
                  d="M0,30 Q50,10 100,30 T200,30 T300,30 T400,30 V60 H0 Z"
                  fill="rgba(20,184,166,0.3)"
                  animate={{ d: phase === 'inhale'
                    ? 'M0,20 Q50,0 100,20 T200,20 T300,20 T400,20 V60 H0 Z'
                    : 'M0,40 Q50,20 100,40 T200,40 T300,40 T400,40 V60 H0 Z'
                  }}
                  transition={{ duration: phase === 'inhale' ? INHALE : EXHALE, ease: 'easeInOut' }}
                />
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <p className="text-2xl font-bold text-teal-800 dark:text-teal-200">{phase === 'inhale' ? 'Breathe In' : 'Breathe Out'}</p>
                <p className="text-lg text-teal-600 dark:text-teal-300">{phaseTime}s</p>
              </div>
            </div>
            <div className="flex justify-between text-sm text-gray-500 dark:text-gray-400">
              <span>{cycles} cycles</span>
              <span>{formatTime(timeLeft)} remaining</span>
            </div>
            <div className="flex justify-center gap-3">
              <Button onClick={() => setIsRunning(r => !r)} variant="calm" size="lg" className="flex items-center gap-2">
                {isRunning ? <Pause size={18} /> : <Play size={18} />}
                {isRunning ? 'Pause' : 'Resume'}
              </Button>
              <Button onClick={reset} variant="outline" size="lg" className="flex items-center gap-2">
                <RotateCcw size={18} /> Reset
              </Button>
            </div>
          </>
        )}
        <div className="text-xs text-gray-600 dark:text-gray-400 bg-gray-50 dark:bg-gray-800/50 border border-gray-200 dark:border-gray-700 p-3 rounded-xl">
          Ujjayi breathing involves a slight constriction at the back of the throat, creating a soft ocean-like sound. Breathe through the nose. This activates the parasympathetic nervous system for deep calm.
        </div>
        <ShareInline title="Ocean Breath" text="Ujjayi ocean breathing on CalmMyself" />
      </CardContent>
    </Card>
  )
}
