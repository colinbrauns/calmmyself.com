'use client'

import { useState, useEffect, useCallback } from 'react'
import { motion } from 'framer-motion'
import { Button } from '@/components/ui/Button'
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/Card'
import { Play, Pause, RotateCcw } from 'lucide-react'
import { useUsageTracking } from '@/hooks/useUsageTracking'

type BreathingPhase = 'inhale' | 'hold1' | 'exhale' | 'hold2'

const PHASE_DURATION = 4000 // 4 seconds
const PHASE_LABELS = {
  inhale: 'Breathe In',
  hold1: 'Hold',
  exhale: 'Breathe Out', 
  hold2: 'Hold'
}

const PHASES: BreathingPhase[] = ['inhale', 'hold1', 'exhale', 'hold2']

export default function BoxBreathing() {
  const [isActive, setIsActive] = useState(false)
  const [currentPhase, setCurrentPhase] = useState<BreathingPhase>('inhale')
  const [phaseIndex, setPhaseIndex] = useState(0)
  const [cycleCount, setCycleCount] = useState(0)
  const [timeRemaining, setTimeRemaining] = useState(PHASE_DURATION)
  
  // Usage tracking
  const { trackUsage } = useUsageTracking('box-breathing', isActive)

  const nextPhase = useCallback(() => {
    setPhaseIndex((prev) => {
      const next = (prev + 1) % PHASES.length
      if (next === 0) setCycleCount((c) => c + 1)
      setCurrentPhase(PHASES[next])
      return next
    })
    setTimeRemaining(PHASE_DURATION)
  }, [])

  const reset = useCallback(() => {
    if (isActive) {
      trackUsage(cycleCount >= 3) // Consider completed if 3+ cycles
    }
    setIsActive(false)
    setCurrentPhase('inhale')
    setPhaseIndex(0)
    setCycleCount(0)
    setTimeRemaining(PHASE_DURATION)
  }, [isActive, cycleCount, trackUsage])

  useEffect(() => {
    let interval: NodeJS.Timeout | null = null
    
    if (isActive) {
      interval = setInterval(() => {
        setTimeRemaining((time) => {
          if (time <= 100) {
            nextPhase()
            return PHASE_DURATION
          }
          return time - 100
        })
      }, 100)
    }

    return () => {
      if (interval) clearInterval(interval)
    }
  }, [isActive, nextPhase])

  const progress = ((PHASE_DURATION - timeRemaining) / PHASE_DURATION) * 100

  const getCircleScale = () => {
    switch (currentPhase) {
      case 'inhale':
        return 1 + (progress / 100) * 0.5 // Scale from 1 to 1.5
      case 'exhale':
        return 1.5 - (progress / 100) * 0.5 // Scale from 1.5 to 1
      default:
        return currentPhase === 'hold1' ? 1.5 : 1
    }
  }

  return (
    <Card className="max-w-md mx-auto">
      <CardHeader className="text-center">
        <CardTitle>Box Breathing</CardTitle>
        <CardDescription>
          4-4-4-4 pattern for calm and focus
        </CardDescription>
      </CardHeader>
      
      <CardContent className="space-y-6">
        {/* Breathing Visual */}
        <div className="flex flex-col items-center space-y-4">
          <div className="relative w-32 h-32 flex items-center justify-center">
            <motion.div
              className="w-24 h-24 rounded-full bg-gradient-to-br from-calm-300 to-calm-500 flex items-center justify-center shadow-lg"
              animate={{
                scale: getCircleScale(),
              }}
              transition={{
                duration: isActive ? PHASE_DURATION / 1000 : 0,
                ease: 'easeInOut'
              }}
            >
              <div className="text-white font-medium text-sm text-center">
                {Math.ceil(timeRemaining / 1000)}
              </div>
            </motion.div>
          </div>
          
          {/* Phase Indicator */}
          <div className="text-center">
            <div className="text-2xl font-semibold text-calm-800 mb-2">
              {PHASE_LABELS[currentPhase]}
            </div>
            <div className="text-sm text-gray-600">
              Cycle {cycleCount + 1}
              {cycleCount >= 3 && (
                <span className="ml-2 text-green-600">✨ Great job!</span>
              )}
            </div>
          </div>

          {/* Progress Bar */}
          <div className="w-full bg-calm-100 rounded-full h-2">
            <div 
              className="bg-calm-500 h-2 rounded-full transition-all duration-100 ease-linear"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>

        {/* Instructions */}
        <div className="text-sm text-gray-600 text-center bg-calm-50 p-3 rounded-md">
          <p className="mb-2">Follow the visual guide:</p>
          <ul className="space-y-1">
            <li>• Inhale as circle grows (4s)</li>
            <li>• Hold breath (4s)</li>
            <li>• Exhale as circle shrinks (4s)</li>
            <li>• Hold empty (4s)</li>
          </ul>
        </div>

        {/* Controls */}
        <div className="flex justify-center space-x-3">
          <Button
            onClick={() => setIsActive(!isActive)}
            variant="calm"
            size="lg"
            className="flex items-center space-x-2"
            aria-label={isActive ? 'Pause breathing exercise' : 'Start breathing exercise'}
          >
            {isActive ? <Pause size={20} /> : <Play size={20} />}
            <span>{isActive ? 'Pause' : 'Start'}</span>
          </Button>
          
          <Button
            onClick={reset}
            variant="outline"
            size="lg"
            className="flex items-center space-x-2"
            aria-label="Reset breathing exercise"
          >
            <RotateCcw size={20} />
            <span>Reset</span>
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}