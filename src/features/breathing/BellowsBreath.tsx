'use client'

import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { Zap, Play, Pause, RotateCcw } from 'lucide-react'
import { motion } from 'framer-motion'
import ShareInline from '@/components/ShareInline'
import { useBreathPattern } from '@/hooks/useBreathPattern'

const TOTAL_CYCLES = 30
const PATTERN = [
  { phase: 'in', label: 'IN', durationMs: 1000 },
  { phase: 'out', label: 'OUT', durationMs: 1000 },
] as const

export default function BellowsBreath() {
  const breath = useBreathPattern({
    pattern: PATTERN,
    maxCycles: TOTAL_CYCLES,
  })

  const reset = () => {
    breath.reset()
  }

  if (breath.isComplete) {
    return (
      <Card className="max-w-md mx-auto">
        <CardContent className="text-center py-12 space-y-6">
          <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: 'spring', stiffness: 200 }}>
            <div className="w-20 h-20 rounded-full bg-amber-100 dark:bg-amber-900/50 flex items-center justify-center mx-auto">
              <Zap className="w-10 h-10 text-amber-600" />
            </div>
          </motion.div>
          <div>
            <h3 className="text-xl font-semibold text-gray-800 dark:text-gray-100 mb-2">Energized! ⚡</h3>
            <p className="text-gray-500 dark:text-gray-400">You completed {TOTAL_CYCLES} cycles of bellows breathing. Feel the energy flowing through you.</p>
          </div>
          <div className="flex justify-center gap-3">
            <Button onClick={reset} variant="calm" size="lg">Do Again</Button>
          </div>
          <ShareInline title="Bellows Breath" text="Energizing bellows breathing on CalmMyself" />
        </CardContent>
      </Card>
    )
  }

  const lungScale = breath.isRunning ? (breath.current.phase === 'in' ? 1.3 : 0.7) : 1

  return (
    <Card className="max-w-md mx-auto">
      <CardHeader className="text-center">
        <div className="flex items-center justify-center gap-2 mb-2">
          <Zap className="w-5 h-5 text-amber-600" />
          <CardTitle>Bellows Breath</CardTitle>
        </div>
        <CardDescription>Rapid energizing breath — 1s in, 1s out, {TOTAL_CYCLES} cycles</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="flex flex-col items-center gap-4">
          <div className="relative w-32 h-40 flex items-center justify-center">
            <motion.div
              className="w-24 h-32 rounded-[40%] bg-gradient-to-b from-amber-200 to-amber-400 dark:from-amber-700 dark:to-amber-900 opacity-60"
              initial={false}
              animate={{ scaleY: lungScale, scaleX: lungScale * 0.8 }}
              transition={{ duration: breath.isRunning ? 0.4 : 0, ease: 'easeInOut' }}
            />
            <div className="absolute inset-0 flex items-center justify-center">
              <span className="text-lg font-bold text-amber-800 dark:text-amber-200">
                {breath.isRunning ? breath.current.label : breath.isPaused ? 'PAUSED' : 'READY'}
              </span>
            </div>
          </div>
          <div className="text-center">
            <p className="text-2xl font-bold text-gray-800 dark:text-gray-100">{breath.cycleCount} / {TOTAL_CYCLES}</p>
            <p className="text-sm text-gray-500 dark:text-gray-400">cycles completed</p>
          </div>
        </div>

        <div className="w-full bg-gray-100 dark:bg-gray-800 rounded-full h-2">
          <motion.div
            className="bg-amber-500 h-2 rounded-full"
            initial={false}
            animate={{ width: `${(breath.cycleCount / TOTAL_CYCLES) * 100}%` }}
            transition={{ duration: breath.isRunning ? 0.3 : 0 }}
          />
        </div>

        <div className="flex justify-center gap-3">
          <Button onClick={breath.toggle} variant="calm" size="lg" className="flex items-center gap-2">
            {breath.isRunning ? <Pause size={18} /> : <Play size={18} />}
            {breath.isRunning ? 'Pause' : breath.isPaused ? 'Resume' : 'Start'}
          </Button>
          <Button onClick={reset} variant="outline" size="lg" className="flex items-center gap-2">
            <RotateCcw size={18} /> Reset
          </Button>
        </div>

        <div className="text-xs text-gray-600 dark:text-gray-400 bg-gray-50 dark:bg-gray-800/50 border border-gray-200 dark:border-gray-700 p-3 rounded-xl">
          Bellows Breath (Bhastrika) is a yogic energizing technique. Breathe rapidly through the nose with equal emphasis on inhale and exhale. Good for low energy or mild depression. Stop if dizzy.
        </div>
        <ShareInline title="Bellows Breath" text="Energizing bellows breathing on CalmMyself" />
      </CardContent>
    </Card>
  )
}
