'use client'

import { useState, useEffect, useRef, useCallback } from 'react'
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { Music2 } from 'lucide-react'
import { motion } from 'framer-motion'
import ShareInline from '@/components/ShareInline'

const SOUNDS = [
  { label: 'Hmmm', guidance: 'Let the hum vibrate in your chest and throat' },
  { label: 'Voo', guidance: 'Feel the deep "Voo" resonate in your belly' },
  { label: 'Om', guidance: 'Let the "Om" fill your whole body with vibration' },
]

const INHALE_SEC = 4
const DURATIONS = [2, 3, 5]

type Phase = 'inhale' | 'hum'

export default function VagalHumming() {
  const [isRunning, setIsRunning] = useState(false)
  const [soundIndex, setSoundIndex] = useState(0)
  const [durationMin, setDurationMin] = useState(3)
  const [phase, setPhase] = useState<Phase>('inhale')
  const [phaseTime, setPhaseTime] = useState(0)
  const [humTime, setHumTime] = useState(0)
  const [cycles, setCycles] = useState(0)
  const [timeLeft, setTimeLeft] = useState(0)
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null)

  const sound = SOUNDS[soundIndex]

  const start = useCallback(() => {
    setIsRunning(true)
    setPhase('inhale')
    setPhaseTime(INHALE_SEC)
    setHumTime(0)
    setCycles(0)
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

      if (phase === 'inhale') {
        setPhaseTime(prev => {
          if (prev <= 1) {
            setPhase('hum')
            setHumTime(0)
            return 0
          }
          return prev - 1
        })
      } else {
        setHumTime(prev => prev + 1)
      }
    }, 1000)
    return () => { if (timerRef.current) clearInterval(timerRef.current) }
  }, [isRunning, phase, stop])

  const nextCycle = useCallback(() => {
    setCycles(prev => prev + 1)
    setPhase('inhale')
    setPhaseTime(INHALE_SEC)
    setHumTime(0)
  }, [])

  const formatTime = (s: number) => `${Math.floor(s / 60)}:${(s % 60).toString().padStart(2, '0')}`

  // Circle scale: grows on inhale, stays large on hum
  const circleScale = phase === 'inhale' ? 0.6 + 0.4 * (1 - phaseTime / INHALE_SEC) : 1

  return (
    <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}>
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Music2 className="w-5 h-5 text-sky-500" />
            Vagal Humming
          </CardTitle>
          <CardDescription>Stimulate your vagus nerve through sustained vocalization</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {!isRunning ? (
            <>
              <div className="bg-gray-50 dark:bg-gray-800/50 border border-gray-200 dark:border-gray-700 rounded-xl p-4 text-sm text-gray-600 dark:text-gray-300 space-y-2">
                <p>Humming creates vibrations that directly stimulate the vagus nerve, activating your body&apos;s calming response.</p>
                <ol className="list-decimal list-inside space-y-1">
                  <li>Breathe in slowly</li>
                  <li>Hum on your exhale as long as comfortable</li>
                  <li>Feel the vibration in your chest and throat</li>
                  <li>Tap &quot;Next cycle&quot; when ready to breathe in again</li>
                </ol>
              </div>

              <div>
                <p className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Sound</p>
                <div className="flex gap-2">
                  {SOUNDS.map((s, i) => (
                    <Button key={s.label} variant={soundIndex === i ? 'default' : 'outline'} size="sm" onClick={() => setSoundIndex(i)}>
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
              <div className="flex items-center justify-center h-48">
                <motion.div
                  className="rounded-full bg-sky-100 dark:bg-sky-900/50 flex items-center justify-center"
                  animate={{
                    scale: circleScale,
                    filter: phase === 'hum' ? ['blur(0px)', 'blur(1px)', 'blur(0px)'] : 'blur(0px)',
                  }}
                  transition={{
                    scale: { duration: 0.5, ease: 'easeOut' },
                    filter: { duration: 0.3, repeat: phase === 'hum' ? Infinity : 0 },
                  }}
                  style={{ width: 160, height: 160 }}
                >
                  <div className="text-center">
                    <p className="text-2xl font-bold text-sky-600 dark:text-sky-300">
                      {phase === 'inhale' ? 'Breathe in' : sound.label + '...'}
                    </p>
                    <p className="text-lg font-mono text-sky-500 dark:text-sky-400 mt-1">
                      {phase === 'inhale' ? phaseTime + 's' : humTime + 's'}
                    </p>
                  </div>
                </motion.div>
              </div>

              <p className="text-center text-sm text-gray-500 dark:text-gray-400">{sound.guidance}</p>

              {phase === 'hum' && (
                <Button onClick={nextCycle} variant="outline" className="w-full">Next cycle (breathe in)</Button>
              )}

              <div className="flex items-center justify-between text-sm text-gray-500 dark:text-gray-400">
                <span>Cycles: {cycles}</span>
                <span>{formatTime(timeLeft)}</span>
              </div>

              <Button onClick={stop} variant="outline" className="w-full">Stop</Button>
            </>
          )}

          <div className="border-t border-gray-200 dark:border-gray-700 pt-4">
            <ShareInline title="Vagal Humming" />
          </div>
        </CardContent>
      </Card>
    </motion.div>
  )
}
