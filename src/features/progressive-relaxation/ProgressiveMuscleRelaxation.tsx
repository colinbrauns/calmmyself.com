'use client'

import { useState, useCallback, useEffect } from 'react'
import { Button } from '@/components/ui/Button'
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/Card'
import { Play, Pause, RotateCcw, ChevronRight } from 'lucide-react'

interface MuscleGroup {
  name: string
  instruction: string
  tenseDuration: number
  relaxDuration: number
}

const MUSCLE_GROUPS: MuscleGroup[] = [
  {
    name: 'Face & Forehead',
    instruction: 'Scrunch your forehead and close your eyes tightly',
    tenseDuration: 5000,
    relaxDuration: 10000
  },
  {
    name: 'Jaw & Neck',
    instruction: 'Clench your jaw and tense your neck muscles',
    tenseDuration: 5000,
    relaxDuration: 10000
  },
  {
    name: 'Shoulders',
    instruction: 'Raise your shoulders up to your ears',
    tenseDuration: 5000,
    relaxDuration: 10000
  },
  {
    name: 'Arms & Hands',
    instruction: 'Make fists and tense your arms',
    tenseDuration: 5000,
    relaxDuration: 10000
  },
  {
    name: 'Chest & Upper Back',
    instruction: 'Arch your back and push your chest out',
    tenseDuration: 5000,
    relaxDuration: 10000
  },
  {
    name: 'Stomach',
    instruction: 'Tighten your abdominal muscles',
    tenseDuration: 5000,
    relaxDuration: 10000
  },
  {
    name: 'Buttocks & Hips',
    instruction: 'Squeeze your glutes and hip muscles',
    tenseDuration: 5000,
    relaxDuration: 10000
  },
  {
    name: 'Thighs',
    instruction: 'Tense your quadriceps and hamstrings',
    tenseDuration: 5000,
    relaxDuration: 10000
  },
  {
    name: 'Calves & Feet',
    instruction: 'Point your toes and tense your calf muscles',
    tenseDuration: 5000,
    relaxDuration: 10000
  }
]

type Phase = 'ready' | 'tense' | 'relax' | 'complete'

export default function ProgressiveMuscleRelaxation() {
  const [currentGroup, setCurrentGroup] = useState(0)
  const [phase, setPhase] = useState<Phase>('ready')
  const [timeRemaining, setTimeRemaining] = useState(0)
  const [isActive, setIsActive] = useState(false)
  const [completedGroups, setCompletedGroups] = useState<number[]>([])

  const currentMuscleGroup = MUSCLE_GROUPS[currentGroup]

  const startTensePhase = useCallback(() => {
    setPhase('tense')
    setTimeRemaining(currentMuscleGroup.tenseDuration)
    setIsActive(true)
  }, [currentMuscleGroup])

  const startRelaxPhase = useCallback(() => {
    setPhase('relax')
    setTimeRemaining(currentMuscleGroup.relaxDuration)
  }, [currentMuscleGroup])

  const nextGroup = useCallback(() => {
    setCompletedGroups(prev => [...prev, currentGroup])
    if (currentGroup < MUSCLE_GROUPS.length - 1) {
      setCurrentGroup(currentGroup + 1)
      setPhase('ready')
      setIsActive(false)
      setTimeRemaining(0)
    } else {
      setPhase('complete')
      setIsActive(false)
    }
  }, [currentGroup])

  const reset = useCallback(() => {
    setCurrentGroup(0)
    setPhase('ready')
    setTimeRemaining(0)
    setIsActive(false)
    setCompletedGroups([])
  }, [])

  useEffect(() => {
    let interval: NodeJS.Timeout | null = null
    
    if (isActive && timeRemaining > 0) {
      interval = setInterval(() => {
        setTimeRemaining((time) => {
          if (time <= 100) {
            if (phase === 'tense') {
              startRelaxPhase()
              return currentMuscleGroup.relaxDuration
            } else if (phase === 'relax') {
              nextGroup()
              return 0
            }
            return 0
          }
          return time - 100
        })
      }, 100)
    }

    return () => {
      if (interval) clearInterval(interval)
    }
  }, [isActive, timeRemaining, phase, startRelaxPhase, nextGroup, currentMuscleGroup])

  if (phase === 'complete') {
    return (
      <Card className="max-w-md mx-auto">
        <CardContent className="text-center py-8">
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <span className="text-2xl">✨</span>
          </div>
          <h2 className="text-2xl font-semibold text-green-700 mb-2">
            Relaxation Complete
          </h2>
          <p className="text-gray-600 mb-6">
            Take a moment to notice the deep relaxation throughout your body.
            How do you feel now compared to when you started?
          </p>
          <Button onClick={reset} variant="grounding" size="lg">
            Start Again
          </Button>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="max-w-md mx-auto">
      <CardHeader className="text-center">
        <CardTitle>Progressive Muscle Relaxation</CardTitle>
        <CardDescription>
          Systematically tense and relax muscle groups
        </CardDescription>
      </CardHeader>
      
      <CardContent className="space-y-6">
        {/* Progress */}
        <div className="flex items-center justify-between text-sm text-gray-600">
          <span>Muscle Group {currentGroup + 1} of {MUSCLE_GROUPS.length}</span>
          <span>{completedGroups.length} completed</span>
        </div>

        <div className="w-full bg-gray-200 rounded-full h-2">
          <div 
            className="bg-grounding-500 h-2 rounded-full transition-all duration-300"
            style={{ width: `${(completedGroups.length / MUSCLE_GROUPS.length) * 100}%` }}
          />
        </div>

        {/* Current Muscle Group */}
        <div className="text-center">
          <h3 className="text-xl font-semibold text-grounding-800 mb-2">
            {currentMuscleGroup.name}
          </h3>
          <p className="text-gray-600 mb-4">
            {currentMuscleGroup.instruction}
          </p>
        </div>

        {/* Phase Display */}
        <div className="bg-grounding-50 rounded-lg p-4 text-center">
          {phase === 'ready' && (
            <>
              <p className="text-grounding-700 font-medium mb-2">Ready to begin</p>
              <p className="text-sm text-gray-600">
                Get comfortable and prepare to tense your {currentMuscleGroup.name.toLowerCase()}
              </p>
            </>
          )}
          
          {phase === 'tense' && (
            <>
              <p className="text-red-700 font-bold text-lg mb-2">TENSE</p>
              <p className="text-sm text-red-600 mb-2">
                {currentMuscleGroup.instruction}
              </p>
              <div className="text-2xl font-bold text-red-600">
                {Math.ceil(timeRemaining / 1000)}
              </div>
            </>
          )}
          
          {phase === 'relax' && (
            <>
              <p className="text-green-700 font-bold text-lg mb-2">RELAX</p>
              <p className="text-sm text-green-600 mb-2">
                Let go completely. Notice the contrast and feel the tension melting away
              </p>
              <div className="text-2xl font-bold text-green-600">
                {Math.ceil(timeRemaining / 1000)}
              </div>
            </>
          )}
        </div>

        {/* Instructions */}
        <div className="text-xs text-gray-500 text-center bg-blue-50 p-3 rounded-md">
          <p className="font-medium mb-1">How it works:</p>
          <p>Tense each muscle group for 5 seconds, then relax for 10 seconds. 
          Pay attention to the contrast between tension and relaxation.</p>
        </div>

        {/* Controls */}
        <div className="flex justify-center space-x-3">
          {phase === 'ready' && (
            <Button
              onClick={startTensePhase}
              variant="grounding"
              size="lg"
              className="flex items-center space-x-2"
            >
              <Play size={20} />
              <span>Start</span>
            </Button>
          )}
          
          {(phase === 'tense' || phase === 'relax') && (
            <Button
              onClick={() => setIsActive(!isActive)}
              variant={isActive ? "outline" : "grounding"}
              size="lg"
              className="flex items-center space-x-2"
            >
              {isActive ? <Pause size={20} /> : <Play size={20} />}
              <span>{isActive ? 'Pause' : 'Resume'}</span>
            </Button>
          )}
          
          <Button
            onClick={reset}
            variant="outline"
            size="lg"
            className="flex items-center space-x-2"
            aria-label="Reset exercise"
          >
            <RotateCcw size={20} />
            <span>Reset</span>
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}