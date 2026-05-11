'use client'

import { useState, useEffect, useRef, useCallback } from 'react'
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { Eye } from 'lucide-react'
import { motion } from 'framer-motion'
import ShareInline from '@/components/ShareInline'

const SPEEDS = [
  { label: 'Slow', sec: 2 },
  { label: 'Medium', sec: 1.5 },
  { label: 'Fast', sec: 1 },
]
const DURATIONS = [1, 3, 5]

export default function EyeMovement() {
  const [isRunning, setIsRunning] = useState(false)
  const [speedIndex, setSpeedIndex] = useState(1)
  const [durationMin, setDurationMin] = useState(3)
  const [timeLeft, setTimeLeft] = useState(0)
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null)

  const speed = SPEEDS[speedIndex]

  const start = useCallback(() => {
    setIsRunning(true)
    setTimeLeft(durationMin * 60)
  }, [durationMin])

  const stop = useCallback(() => {
    setIsRunning(false)
    if (timerRef.current) clearInterval(timerRef.current)
    timerRef.current = null
  }, [])

  useEffect(() => {
    if (!isRunning) return
    timerRef.current = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) { stop(); return 0 }
        return prev - 1
      })
    }, 1000)
    return () => { if (timerRef.current) clearInterval(timerRef.current) }
  }, [isRunning, stop])

  const formatTime = (s: number) => `${Math.floor(s / 60)}:${(s % 60).toString().padStart(2, '0')}`

  return (
    <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}>
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Eye className="w-5 h-5 text-emerald-500" />
            Eye Movement Exercise
          </CardTitle>
          <CardDescription>EMDR-inspired bilateral eye movement for processing and calm</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {!isRunning ? (
            <>
              <div className="bg-gray-50 dark:bg-gray-800/50 border border-gray-200 dark:border-gray-700 rounded-xl p-4 text-sm text-gray-600 dark:text-gray-300">
                <p>Follow the dot with your eyes, keeping your head still. Let your gaze move smoothly from side to side.</p>
              </div>

              <div>
                <p className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Speed</p>
                <div className="flex gap-2">
                  {SPEEDS.map((s, i) => (
                    <Button key={s.label} variant={speedIndex === i ? 'default' : 'outline'} size="sm" onClick={() => setSpeedIndex(i)}>
                      {s.label}
                    </Button>
                  ))}
                </div>
              </div>

              <div>
                <p className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Duration</p>
                <div className="flex gap-2">
                  {DURATIONS.map(d => (
                    <Button key={d} variant={durationMin === d ? 'default' : 'outline'} size="sm" onClick={() => setDurationMin(d)}>
                      {d} min
                    </Button>
                  ))}
                </div>
              </div>

              <Button onClick={start} className="w-full">Begin</Button>
            </>
          ) : (
            <>
              <div className="relative w-full h-32 bg-gray-900 dark:bg-gray-950 rounded-xl overflow-hidden flex items-center">
                <motion.div
                  className="absolute w-5 h-5 rounded-full bg-sky-400 shadow-[0_0_20px_6px_rgba(56,189,248,0.4)]"
                  animate={{ x: ['0%', 'calc(100% - 20px)', '0%'] }}
                  transition={{
                    duration: speed.sec * 2,
                    repeat: Infinity,
                    ease: 'easeInOut',
                  }}
                  style={{ left: '10px', top: 'calc(50% - 10px)' }}
                />
                {/* Track line */}
                <div className="absolute left-4 right-4 h-px bg-gray-700" style={{ top: '50%' }} />
              </div>

              <p className="text-center text-sm text-gray-500 dark:text-gray-400">Follow the dot with your eyes, keeping your head still</p>

              <div className="text-center">
                <p className="text-3xl font-mono font-bold text-gray-800 dark:text-gray-100">{formatTime(timeLeft)}</p>
              </div>

              <Button onClick={stop} variant="outline" className="w-full">Stop</Button>
            </>
          )}

          <div className="border-t border-gray-200 dark:border-gray-700 pt-4">
            <ShareInline title="Eye Movement Exercise" />
          </div>
        </CardContent>
      </Card>
    </motion.div>
  )
}
