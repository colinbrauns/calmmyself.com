'use client'

import { useState, useEffect, useRef, useCallback } from 'react'
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { ArrowDown, Play, Pause, RotateCcw } from 'lucide-react'
import { motion } from 'framer-motion'
import ShareInline from '@/components/ShareInline'

const PHASES = [
  { name: 'Raise', desc: 'Raise your shoulders up to your ears', duration: 5 },
  { name: 'Hold', desc: 'Hold the tension — feel it', duration: 5 },
  { name: 'Drop & Exhale', desc: 'Let them drop. Exhale fully.', duration: 10 },
]
const TOTAL_CYCLES = 5

export default function ShoulderDrop() {
  const [isRunning, setIsRunning] = useState(false)
  const [cycle, setCycle] = useState(0)
  const [phaseIdx, setPhaseIdx] = useState(0)
  const [timeLeft, setTimeLeft] = useState(PHASES[0].duration)
  const [completed, setCompleted] = useState(false)

  useEffect(() => {
    if (!isRunning) return
    const id = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) {
          if (phaseIdx < PHASES.length - 1) {
            setPhaseIdx(p => p + 1)
            return PHASES[phaseIdx + 1].duration
          } else {
            const nextCycle = cycle + 1
            if (nextCycle >= TOTAL_CYCLES) { setIsRunning(false); setCompleted(true); return 0 }
            setCycle(nextCycle)
            setPhaseIdx(0)
            return PHASES[0].duration
          }
        }
        return prev - 1
      })
    }, 1000)
    return () => clearInterval(id)
  }, [isRunning, phaseIdx, cycle])

  const start = () => { setIsRunning(true); setCycle(0); setPhaseIdx(0); setTimeLeft(PHASES[0].duration); setCompleted(false) }
  const reset = () => { setIsRunning(false); setCycle(0); setPhaseIdx(0); setTimeLeft(PHASES[0].duration); setCompleted(false) }

  const shoulderY = phaseIdx === 0 ? -15 : phaseIdx === 1 ? -15 : 5

  if (completed) {
    return (
      <Card className="max-w-md mx-auto">
        <CardContent className="text-center py-12 space-y-6">
          <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: 'spring' }}>
            <div className="w-20 h-20 rounded-full bg-teal-100 dark:bg-teal-900/50 flex items-center justify-center mx-auto">
              <ArrowDown className="w-10 h-10 text-teal-600" />
            </div>
          </motion.div>
          <div>
            <h3 className="text-xl font-semibold text-gray-800 dark:text-gray-100 mb-2">Shoulders released 🧘</h3>
            <p className="text-gray-500 dark:text-gray-400">{TOTAL_CYCLES} cycles complete. Notice how much lower your shoulders sit now.</p>
          </div>
          <div className="flex justify-center gap-3"><Button onClick={reset} variant="calm" size="lg">Do Again</Button></div>
          <ShareInline title="Shoulder Drop" text="Shoulder tension release on CalmMyself" />
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="max-w-md mx-auto">
      <CardHeader className="text-center">
        <div className="flex items-center justify-center gap-2 mb-2"><ArrowDown className="w-5 h-5 text-teal-600" /><CardTitle>Shoulder Drop</CardTitle></div>
        <CardDescription>Raise, hold, and drop your shoulders — {TOTAL_CYCLES} cycles</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {!isRunning && cycle === 0 && !completed ? (
          <div className="flex justify-center"><Button onClick={start} variant="calm" size="lg" className="flex items-center gap-2"><Play size={18} /> Start</Button></div>
        ) : (
          <>
            <div className="flex justify-center">
              <div className="relative w-32 h-32">
                <svg viewBox="0 0 100 100" className="w-full h-full">
                  <circle cx="50" cy="30" r="12" fill="none" stroke="currentColor" strokeWidth="2" className="text-gray-300 dark:text-gray-600" />
                  <motion.line x1="25" y1="55" x2="50" y2="50" stroke="currentColor" strokeWidth="3" strokeLinecap="round"
                    className="text-teal-500" animate={{ y1: 55 + shoulderY }} transition={{ duration: 0.5 }} />
                  <motion.line x1="75" y1="55" x2="50" y2="50" stroke="currentColor" strokeWidth="3" strokeLinecap="round"
                    className="text-teal-500" animate={{ y1: 55 + shoulderY }} transition={{ duration: 0.5 }} />
                  <line x1="50" y1="50" x2="50" y2="80" stroke="currentColor" strokeWidth="2" className="text-gray-300 dark:text-gray-600" />
                </svg>
              </div>
            </div>
            <div className="text-center space-y-2">
              <p className="text-2xl font-bold text-teal-600 dark:text-teal-400">{PHASES[phaseIdx].name}</p>
              <p className="text-gray-600 dark:text-gray-400">{PHASES[phaseIdx].desc}</p>
              <p className="text-3xl font-bold text-gray-800 dark:text-gray-100">{timeLeft}s</p>
              <p className="text-sm text-gray-400 dark:text-gray-500">Cycle {cycle + 1} of {TOTAL_CYCLES}</p>
            </div>
            <div className="flex justify-center gap-3">
              <Button onClick={() => setIsRunning(r => !r)} variant="calm" size="lg" className="flex items-center gap-2">
                {isRunning ? <Pause size={18} /> : <Play size={18} />} {isRunning ? 'Pause' : 'Resume'}
              </Button>
              <Button onClick={reset} variant="outline" size="lg" className="flex items-center gap-2"><RotateCcw size={18} /> Reset</Button>
            </div>
          </>
        )}
        <div className="text-xs text-gray-600 dark:text-gray-400 bg-gray-50 dark:bg-gray-800/50 border border-gray-200 dark:border-gray-700 p-3 rounded-xl">
          This technique works by first deliberately creating tension, then releasing it. The contrast helps your body find a deeper state of relaxation than it started with.
        </div>
        <ShareInline title="Shoulder Drop" text="Shoulder tension release on CalmMyself" />
      </CardContent>
    </Card>
  )
}
