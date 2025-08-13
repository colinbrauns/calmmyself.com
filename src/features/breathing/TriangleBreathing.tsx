'use client'

import { useState, useEffect, useCallback } from 'react'
import { motion } from 'framer-motion'
import { Button } from '@/components/ui/Button'
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/Card'
import { Play, Pause, RotateCcw } from 'lucide-react'

type BreathingPhase = 'inhale' | 'hold' | 'exhale'

const PHASE_DURATION = { inhale: 4000, hold: 4000, exhale: 6000 }
const PHASE_LABELS = {
  inhale: 'Breathe In',
  hold: 'Hold',
  exhale: 'Breathe Out'
}

const PHASES: BreathingPhase[] = ['inhale', 'hold', 'exhale']

export default function TriangleBreathing() {
  const [isActive, setIsActive] = useState(false)
  const [currentPhase, setCurrentPhase] = useState<BreathingPhase>('inhale')
  const [phaseIndex, setPhaseIndex] = useState(0)
  const [cycleCount, setCycleCount] = useState(0)
  const [timeRemaining, setTimeRemaining] = useState(PHASE_DURATION.inhale)

  const nextPhase = useCallback(() => {
    setPhaseIndex((prev) => {
      const next = (prev + 1) % PHASES.length
      if (next === 0) setCycleCount((c) => c + 1)
      const newPhase = PHASES[next]
      setCurrentPhase(newPhase)
      setTimeRemaining(PHASE_DURATION[newPhase])
      return next
    })
  }, [])

  const reset = useCallback(() => {
    setIsActive(false)
    setCurrentPhase('inhale')
    setPhaseIndex(0)
    setCycleCount(0)
    setTimeRemaining(PHASE_DURATION.inhale)
  }, [])

  useEffect(() => {
    let interval: NodeJS.Timeout | null = null
    
    if (isActive) {
      interval = setInterval(() => {
        setTimeRemaining((time) => {
          if (time <= 100) {
            nextPhase()
            return PHASE_DURATION[PHASES[(phaseIndex + 1) % PHASES.length]]
          }
          return time - 100
        })
      }, 100)
    }

    return () => {
      if (interval) clearInterval(interval)
    }
  }, [isActive, nextPhase, phaseIndex])

  const currentPhaseDuration = PHASE_DURATION[currentPhase]
  const progress = ((currentPhaseDuration - timeRemaining) / currentPhaseDuration) * 100

  const getTriangleTransform = () => {
    const angle = (progress / 100) * 360
    return `rotate(${angle}deg)`
  }

  const getCircleScale = () => {
    switch (currentPhase) {
      case 'inhale':
        return 1 + (progress / 100) * 0.4
      case 'exhale':
        return 1.4 - (progress / 100) * 0.4
      default:
        return 1.4
    }
  }

  return (
    <Card className="max-w-md mx-auto">
      <CardHeader className="text-center">
        <CardTitle>Triangle Breathing</CardTitle>
        <CardDescription>
          4-4-6 pattern for relaxation and stress relief
        </CardDescription>
      </CardHeader>
      
      <CardContent className="space-y-6">
        {/* Breathing Visual */}
        <div className="flex flex-col items-center space-y-4">
          <div className="relative w-32 h-32 flex items-center justify-center">
            {/* Triangle indicator */}
            <motion.div
              className="absolute w-20 h-20 border-3 border-grounding-400"
              style={{
                clipPath: 'polygon(50% 0%, 0% 100%, 100% 100%)'
              }}
              animate={{
                transform: getTriangleTransform(),
              }}
              transition={{
                duration: isActive ? currentPhaseDuration / 1000 : 0,
                ease: 'linear'
              }}
            />
            
            {/* Center circle */}
            <motion.div
              className="w-16 h-16 rounded-full bg-gradient-to-br from-grounding-300 to-grounding-500 flex items-center justify-center shadow-lg z-10"
              animate={{
                scale: getCircleScale(),
              }}
              transition={{
                duration: isActive ? currentPhaseDuration / 1000 : 0,
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
            <div className="text-2xl font-semibold text-grounding-800 mb-2">
              {PHASE_LABELS[currentPhase]}
            </div>
            <div className="text-sm text-gray-600">
              Cycle {cycleCount + 1}
            </div>
          </div>

          {/* Progress Bar */}
          <div className="w-full bg-grounding-100 rounded-full h-2">
            <div 
              className="bg-grounding-500 h-2 rounded-full transition-all duration-100 ease-linear"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>

        {/* Instructions */}
        <div className="text-sm text-gray-600 text-center bg-grounding-50 p-3 rounded-md">
          <p className="mb-2">Follow the triangle pattern:</p>
          <ul className="space-y-1">
            <li>• Inhale for 4 seconds</li>
            <li>• Hold breath for 4 seconds</li>
            <li>• Exhale slowly for 6 seconds</li>
          </ul>
          <p className="text-xs text-gray-500 mt-2">
            Longer exhale activates the parasympathetic nervous system
          </p>
        </div>

        {/* Controls */}
        <div className="flex justify-center space-x-3">
          <Button
            onClick={() => setIsActive(!isActive)}
            variant="grounding"
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