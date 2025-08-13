'use client'

import { useState, useCallback, useEffect } from 'react'
import { Button } from '@/components/ui/Button'
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/Card'
import { Play, Pause, RotateCcw } from 'lucide-react'

interface BodyPart {
  name: string
  instruction: string
  duration: number
}

const BODY_PARTS: BodyPart[] = [
  {
    name: 'Top of Head',
    instruction: 'Notice any sensations at the crown of your head. Warmth, coolness, tingling, or nothing at all.',
    duration: 15000
  },
  {
    name: 'Forehead & Eyes',
    instruction: 'Feel your forehead and the area around your eyes. Are they relaxed or tense?',
    duration: 15000
  },
  {
    name: 'Jaw & Mouth',
    instruction: 'Notice your jaw and mouth. Let them soften if they feel tight.',
    duration: 15000
  },
  {
    name: 'Neck & Throat',
    instruction: 'Scan your neck and throat area. Breathe into any tension you find.',
    duration: 15000
  },
  {
    name: 'Shoulders',
    instruction: 'Feel your shoulders. Let them drop and release any holding.',
    duration: 15000
  },
  {
    name: 'Arms & Hands',
    instruction: 'Scan down your arms to your fingertips. Notice temperature, tingling, or heaviness.',
    duration: 20000
  },
  {
    name: 'Chest & Heart',
    instruction: 'Feel your chest rise and fall. Notice your heartbeat and any emotions present.',
    duration: 20000
  },
  {
    name: 'Stomach & Abdomen',
    instruction: 'Notice your belly area. Let it soften and breathe naturally.',
    duration: 15000
  },
  {
    name: 'Lower Back',
    instruction: 'Scan your lower back. Send breath to any areas of tension or discomfort.',
    duration: 15000
  },
  {
    name: 'Hips & Pelvis',
    instruction: 'Notice your hip area and pelvis. Let them settle and relax.',
    duration: 15000
  },
  {
    name: 'Thighs',
    instruction: 'Feel the front and back of your thighs. Notice their weight and any sensations.',
    duration: 15000
  },
  {
    name: 'Knees & Calves',
    instruction: 'Scan your knees and calf muscles. Let them be heavy and relaxed.',
    duration: 15000
  },
  {
    name: 'Feet & Toes',
    instruction: 'Feel your feet and toes. Notice their connection to the ground beneath you.',
    duration: 15000
  },
  {
    name: 'Whole Body',
    instruction: 'Take a moment to feel your entire body as one connected whole. Rest in this awareness.',
    duration: 20000
  }
]

export default function BodyScan() {
  const [currentPart, setCurrentPart] = useState(0)
  const [timeRemaining, setTimeRemaining] = useState(BODY_PARTS[0].duration)
  const [isActive, setIsActive] = useState(false)
  const [isComplete, setIsComplete] = useState(false)

  const currentBodyPart = BODY_PARTS[currentPart]

  const nextPart = useCallback(() => {
    if (currentPart < BODY_PARTS.length - 1) {
      const nextIndex = currentPart + 1
      setCurrentPart(nextIndex)
      setTimeRemaining(BODY_PARTS[nextIndex].duration)
    } else {
      setIsComplete(true)
      setIsActive(false)
    }
  }, [currentPart])

  const reset = useCallback(() => {
    setCurrentPart(0)
    setTimeRemaining(BODY_PARTS[0].duration)
    setIsActive(false)
    setIsComplete(false)
  }, [])

  useEffect(() => {
    let interval: NodeJS.Timeout | null = null
    
    if (isActive && !isComplete) {
      interval = setInterval(() => {
        setTimeRemaining((time) => {
          if (time <= 100) {
            nextPart()
            return BODY_PARTS[Math.min(currentPart + 1, BODY_PARTS.length - 1)].duration
          }
          return time - 100
        })
      }, 100)
    }

    return () => {
      if (interval) clearInterval(interval)
    }
  }, [isActive, isComplete, nextPart, currentPart])

  const progress = currentPart / BODY_PARTS.length * 100
  const currentProgress = ((currentBodyPart.duration - timeRemaining) / currentBodyPart.duration) * 100

  if (isComplete) {
    return (
      <Card className="max-w-md mx-auto">
        <CardContent className="text-center py-8">
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <span className="text-2xl">🧘‍♀️</span>
          </div>
          <h2 className="text-2xl font-semibold text-green-700 mb-2">
            Body Scan Complete
          </h2>
          <p className="text-gray-600 mb-6">
            Take a moment to rest in the awareness of your whole body. 
            Notice how you feel now - more present, relaxed, and grounded.
          </p>
          <Button onClick={reset} variant="grounding" size="lg">
            Scan Again
          </Button>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="max-w-md mx-auto">
      <CardHeader className="text-center">
        <CardTitle>Body Scan Meditation</CardTitle>
        <CardDescription>
          Mindfully scan through your body from head to toe
        </CardDescription>
      </CardHeader>
      
      <CardContent className="space-y-6">
        {/* Progress */}
        <div className="flex items-center justify-between text-sm text-gray-600">
          <span>{currentBodyPart.name}</span>
          <span>{currentPart + 1} of {BODY_PARTS.length}</span>
        </div>

        <div className="space-y-2">
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div 
              className="bg-grounding-500 h-2 rounded-full transition-all duration-300"
              style={{ width: `${progress}%` }}
            />
          </div>
          <div className="w-full bg-grounding-100 rounded-full h-1">
            <div 
              className="bg-grounding-400 h-1 rounded-full transition-all duration-100 ease-linear"
              style={{ width: `${currentProgress}%` }}
            />
          </div>
        </div>

        {/* Current Body Part */}
        <div className="text-center space-y-4">
          <h3 className="text-xl font-semibold text-grounding-800">
            {currentBodyPart.name}
          </h3>
          
          <div className="bg-grounding-50 p-4 rounded-lg">
            <p className="text-gray-700 leading-relaxed">
              {currentBodyPart.instruction}
            </p>
          </div>
          
          {isActive && (
            <div className="text-3xl font-bold text-grounding-600">
              {Math.ceil(timeRemaining / 1000)}s
            </div>
          )}
        </div>

        {/* Body Diagram */}
        <div className="flex justify-center">
          <div className="relative">
            <svg width="120" height="200" viewBox="0 0 120 200" className="text-gray-300">
              {/* Simple body outline */}
              <ellipse cx="60" cy="25" rx="20" ry="15" fill={currentPart <= 3 ? "#fbbf24" : "currentColor"} />
              <rect x="45" y="40" width="30" height="40" rx="8" fill={currentPart >= 4 && currentPart <= 7 ? "#fbbf24" : "currentColor"} />
              <rect x="25" y="45" width="15" height="35" rx="7" fill={currentPart === 5 ? "#fbbf24" : "currentColor"} />
              <rect x="80" y="45" width="15" height="35" rx="7" fill={currentPart === 5 ? "#fbbf24" : "currentColor"} />
              <rect x="45" y="80" width="30" height="50" rx="8" fill={currentPart >= 6 && currentPart <= 9 ? "#fbbf24" : "currentColor"} />
              <rect x="50" y="130" width="10" height="40" rx="5" fill={currentPart >= 10 && currentPart <= 12 ? "#fbbf24" : "currentColor"} />
              <rect x="65" y="130" width="10" height="40" rx="5" fill={currentPart >= 10 && currentPart <= 12 ? "#fbbf24" : "currentColor"} />
              <ellipse cx="55" cy="175" rx="8" ry="5" fill={currentPart === 12 ? "#fbbf24" : "currentColor"} />
              <ellipse cx="70" cy="175" rx="8" ry="5" fill={currentPart === 12 ? "#fbbf24" : "currentColor"} />
            </svg>
          </div>
        </div>

        {/* Instructions */}
        <div className="text-xs text-gray-500 text-center bg-blue-50 p-3 rounded-md">
          <p className="font-medium mb-1">Tips for body scanning:</p>
          <p>There's no "right" way to feel. Simply notice whatever sensations arise - 
          tension, warmth, tingling, or nothing at all.</p>
        </div>

        {/* Controls */}
        <div className="flex justify-center space-x-3">
          <Button
            onClick={() => setIsActive(!isActive)}
            variant="grounding"
            size="lg"
            className="flex items-center space-x-2"
            aria-label={isActive ? 'Pause body scan' : 'Start body scan'}
          >
            {isActive ? <Pause size={20} /> : <Play size={20} />}
            <span>{isActive ? 'Pause' : 'Start'}</span>
          </Button>
          
          <Button
            onClick={reset}
            variant="outline"
            size="lg"
            className="flex items-center space-x-2"
            aria-label="Reset body scan"
          >
            <RotateCcw size={20} />
            <span>Reset</span>
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}