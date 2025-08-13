'use client'

import { useState, useEffect, useCallback } from 'react'
import { motion } from 'framer-motion'
import { Button } from '@/components/ui/Button'
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/Card'
import { Play, Pause, RotateCcw } from 'lucide-react'

type BreathingPhase = 'inhale1' | 'inhale2' | 'exhale'

const PHASE_DURATION = { inhale1: 2000, inhale2: 1000, exhale: 6000 }
const PHASE_LABELS = {
  inhale1: 'First Inhale',
  inhale2: 'Second Inhale',
  exhale: 'Long Exhale'
}

const PHASES: BreathingPhase[] = ['inhale1', 'inhale2', 'exhale']

export default function PhysiologicalSigh() {
  const [isActive, setIsActive] = useState(false)
  const [currentPhase, setCurrentPhase] = useState<BreathingPhase>('inhale1')
  const [phaseIndex, setPhaseIndex] = useState(0)
  const [cycleCount, setCycleCount] = useState(0)
  const [timeRemaining, setTimeRemaining] = useState(PHASE_DURATION.inhale1)

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
    setCurrentPhase('inhale1')
    setPhaseIndex(0)
    setCycleCount(0)
    setTimeRemaining(PHASE_DURATION.inhale1)
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

  const getCircleScale = () => {
    switch (currentPhase) {
      case 'inhale1':
        return 1 + (progress / 100) * 0.3 // Scale to 1.3
      case 'inhale2':
        return 1.3 + (progress / 100) * 0.2 // Scale from 1.3 to 1.5
      case 'exhale':
        return 1.5 - (progress / 100) * 0.5 // Scale from 1.5 to 1
      default:
        return 1
    }
  }

  const getCircleColor = () => {
    switch (currentPhase) {
      case 'inhale1':
        return 'from-blue-300 to-blue-500'
      case 'inhale2':
        return 'from-blue-400 to-blue-600'
      case 'exhale':
        return 'from-green-300 to-green-500'
      default:
        return 'from-calm-300 to-calm-500'
    }
  }

  return (
    <Card className="max-w-md mx-auto">
      <CardHeader className="text-center">
        <CardTitle>Physiological Sigh</CardTitle>
        <CardDescription>
          Double inhale + long exhale for rapid calm
        </CardDescription>
      </CardHeader>
      
      <CardContent className="space-y-6">
        {/* Breathing Visual */}
        <div className="flex flex-col items-center space-y-4">
          <div className="relative w-32 h-32 flex items-center justify-center">
            <motion.div
              className={`w-24 h-24 rounded-full bg-gradient-to-br ${getCircleColor()} flex items-center justify-center shadow-lg`}
              animate={{
                scale: getCircleScale(),
              }}
              transition={{
                duration: isActive ? currentPhaseDuration / 1000 : 0,
                ease: currentPhase === 'exhale' ? 'easeOut' : 'easeInOut'
              }}
            >
              <div className="text-white font-medium text-sm text-center">
                {Math.ceil(timeRemaining / 1000)}
              </div>
            </motion.div>

            {/* Double inhale indicator */}
            {(currentPhase === 'inhale1' || currentPhase === 'inhale2') && (
              <div className="absolute -top-8 left-1/2 transform -translate-x-1/2">
                <div className="flex space-x-1">
                  <div className={`w-2 h-2 rounded-full ${currentPhase === 'inhale1' ? 'bg-blue-500' : 'bg-blue-300'}`} />
                  <div className={`w-2 h-2 rounded-full ${currentPhase === 'inhale2' ? 'bg-blue-500' : 'bg-blue-300'}`} />
                </div>
              </div>
            )}
          </div>
          
          {/* Phase Indicator */}
          <div className="text-center">
            <div className="text-2xl font-semibold text-calm-800 mb-2">
              {PHASE_LABELS[currentPhase]}
            </div>
            <div className="text-sm text-gray-600">
              Cycle {cycleCount + 1}
            </div>
          </div>

          {/* Progress Bar */}
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div 
              className="bg-blue-500 h-2 rounded-full transition-all duration-100 ease-linear"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>

        {/* Instructions */}
        <div className="text-sm text-gray-600 text-center bg-blue-50 p-3 rounded-md">
          <p className="mb-2">The most effective calming breath:</p>
          <ul className="space-y-1">
            <li>• <strong>First inhale:</strong> Fill lower lungs (2s)</li>
            <li>• <strong>Second inhale:</strong> Top up upper lungs (1s)</li>
            <li>• <strong>Long exhale:</strong> Release slowly (6s)</li>
          </ul>
          <p className="text-xs text-gray-500 mt-2">
            Based on neuroscience research - just 1-3 cycles can reduce stress
          </p>
        </div>

        {/* Quick Action */}
        <div className="bg-yellow-50 border border-yellow-200 rounded-md p-3">
          <p className="text-sm text-yellow-800 font-medium mb-2">⚡ Quick Relief</p>
          <p className="text-xs text-yellow-700">
            This technique works in just 1-3 breaths! Perfect for immediate stress relief.
          </p>
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