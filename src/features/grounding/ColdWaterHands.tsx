'use client'

import { useState, useEffect, useRef } from 'react'
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { Droplets, Play, Pause, RotateCcw } from 'lucide-react'
import { motion } from 'framer-motion'
import ShareInline from '@/components/ShareInline'

export default function ColdWaterHands() {
  const [isRunning, setIsRunning] = useState(false)
  const [duration, setDuration] = useState(30)
  const [remaining, setRemaining] = useState(30)
  const [completed, setCompleted] = useState(false)

  useEffect(() => {
    if (!isRunning || remaining <= 0) return
    const id = setInterval(() => {
      setRemaining(prev => {
        if (prev <= 1) { setIsRunning(false); setCompleted(true); return 0 }
        return prev - 1
      })
    }, 1000)
    return () => clearInterval(id)
  }, [isRunning, remaining])

  const reset = () => { setIsRunning(false); setRemaining(duration); setCompleted(false) }
  const progress = 1 - remaining / duration

  if (completed) {
    return (
      <Card className="max-w-md mx-auto">
        <CardContent className="text-center py-12 space-y-6">
          <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: 'spring', stiffness: 200 }}>
            <div className="w-20 h-20 rounded-full bg-blue-100 dark:bg-blue-900/50 flex items-center justify-center mx-auto">
              <Droplets className="w-10 h-10 text-blue-500" />
            </div>
          </motion.div>
          <div>
            <h3 className="text-xl font-semibold text-gray-800 dark:text-gray-100 mb-2">Well done 💧</h3>
            <p className="text-gray-500 dark:text-gray-400">The cold water activates your vagus nerve, shifting your body toward calm. Notice the tingling in your hands.</p>
          </div>
          <div className="flex justify-center gap-3">
            <Button onClick={reset} variant="calm" size="lg">Do Again</Button>
          </div>
          <ShareInline title="Cold Water Hands" text="Vagal nerve activation with cold water on CalmMyself" />
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="max-w-md mx-auto">
      <CardHeader className="text-center">
        <div className="flex items-center justify-center gap-2 mb-2">
          <Droplets className="w-5 h-5 text-blue-500" />
          <CardTitle>Cold Water Hands</CardTitle>
        </div>
        <CardDescription>Run cold water over your hands to activate your vagus nerve</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {!isRunning && remaining === duration ? (
          <>
            <div className="flex justify-center gap-2">
              {[30, 45, 60].map(d => (
                <button key={d} onClick={() => { setDuration(d); setRemaining(d) }}
                  className={`px-4 py-2 rounded-xl text-sm font-medium transition-all ${d === duration ? 'bg-blue-600 text-white' : 'bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400'}`}>
                  {d}s
                </button>
              ))}
            </div>
            <div className="text-sm text-gray-600 dark:text-gray-400 bg-blue-50 dark:bg-blue-950/30 border border-blue-100 dark:border-blue-900/50 p-4 rounded-xl space-y-2">
              <p className="font-medium text-blue-800 dark:text-blue-300">Steps:</p>
              <ol className="list-decimal list-inside space-y-1">
                <li>Go to a sink and turn on cold water</li>
                <li>Place both hands under the stream</li>
                <li>Focus on the sensation of cold</li>
                <li>Breathe slowly while you feel the temperature</li>
              </ol>
            </div>
            <div className="flex justify-center">
              <Button onClick={() => setIsRunning(true)} variant="calm" size="lg" className="flex items-center gap-2">
                <Play size={18} /> Start Timer
              </Button>
            </div>
          </>
        ) : (
          <>
            <div className="relative w-40 h-40 mx-auto">
              <svg viewBox="0 0 100 100" className="w-full h-full -rotate-90">
                <circle cx="50" cy="50" r="45" fill="none" stroke="currentColor" strokeWidth="4" className="text-gray-100 dark:text-gray-800" />
                <motion.circle cx="50" cy="50" r="45" fill="none" strokeWidth="4"
                  className="text-blue-500"
                  strokeLinecap="round"
                  style={{ pathLength: progress }}
                  animate={{ pathLength: progress }}
                  strokeDasharray="283"
                  strokeDashoffset={283 * (1 - progress)}
                />
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <motion.div
                  className="w-16 h-16 rounded-full"
                  animate={{ backgroundColor: `rgba(59, 130, 246, ${0.15 + progress * 0.5})` }}
                  transition={{ duration: 0.5 }}
                >
                  <div className="w-full h-full flex items-center justify-center">
                    <span className="text-2xl font-bold text-blue-700 dark:text-blue-300">{remaining}s</span>
                  </div>
                </motion.div>
              </div>
            </div>
            <p className="text-center text-sm text-gray-500 dark:text-gray-400">
              Feel the cold water on your hands. Breathe slowly.
            </p>
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
          Cold water on the hands and wrists stimulates the vagus nerve, triggering a parasympathetic response that lowers heart rate and reduces anxiety.
        </div>
        <ShareInline title="Cold Water Hands" text="Vagal nerve activation with cold water on CalmMyself" />
      </CardContent>
    </Card>
  )
}
