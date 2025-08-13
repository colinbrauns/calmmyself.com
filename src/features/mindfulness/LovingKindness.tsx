'use client'

import { useState, useCallback, useEffect } from 'react'
import { Button } from '@/components/ui/Button'
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/Card'
import { Play, Pause, RotateCcw, Heart } from 'lucide-react'

interface LovingKindnessPhrase {
  text: string
  duration: number
}

const LOVING_KINDNESS_PHRASES: LovingKindnessPhrase[] = [
  {
    text: "May I be happy",
    duration: 10000
  },
  {
    text: "May I be healthy",
    duration: 10000
  },
  {
    text: "May I be safe",
    duration: 10000
  },
  {
    text: "May I be at peace",
    duration: 10000
  },
  {
    text: "May I be free from suffering",
    duration: 10000
  },
  {
    text: "May you be happy",
    duration: 10000
  },
  {
    text: "May you be healthy", 
    duration: 10000
  },
  {
    text: "May you be safe",
    duration: 10000
  },
  {
    text: "May you be at peace",
    duration: 10000
  },
  {
    text: "May you be free from suffering",
    duration: 10000
  },
  {
    text: "May all beings be happy",
    duration: 12000
  },
  {
    text: "May all beings be healthy",
    duration: 12000
  },
  {
    text: "May all beings be safe",
    duration: 12000
  },
  {
    text: "May all beings be at peace",
    duration: 12000
  },
  {
    text: "May all beings be free from suffering",
    duration: 12000
  }
]

const PHASES = [
  { name: 'Self', start: 0, end: 4, description: 'Sending love to yourself' },
  { name: 'Loved One', start: 5, end: 9, description: 'Sending love to someone dear' },
  { name: 'All Beings', start: 10, end: 14, description: 'Sending love to all beings' }
]

export default function LovingKindness() {
  const [currentPhrase, setCurrentPhrase] = useState(0)
  const [timeRemaining, setTimeRemaining] = useState(LOVING_KINDNESS_PHRASES[0].duration)
  const [isActive, setIsActive] = useState(false)
  const [isComplete, setIsComplete] = useState(false)

  const currentPhraseData = LOVING_KINDNESS_PHRASES[currentPhrase]
  const currentPhase = PHASES.find(phase => currentPhrase >= phase.start && currentPhrase <= phase.end)

  const nextPhrase = useCallback(() => {
    if (currentPhrase < LOVING_KINDNESS_PHRASES.length - 1) {
      const nextIndex = currentPhrase + 1
      setCurrentPhrase(nextIndex)
      setTimeRemaining(LOVING_KINDNESS_PHRASES[nextIndex].duration)
    } else {
      setIsComplete(true)
      setIsActive(false)
    }
  }, [currentPhrase])

  const reset = useCallback(() => {
    setCurrentPhrase(0)
    setTimeRemaining(LOVING_KINDNESS_PHRASES[0].duration)
    setIsActive(false)
    setIsComplete(false)
  }, [])

  useEffect(() => {
    let interval: NodeJS.Timeout | null = null
    
    if (isActive && !isComplete) {
      interval = setInterval(() => {
        setTimeRemaining((time) => {
          if (time <= 100) {
            nextPhrase()
            return LOVING_KINDNESS_PHRASES[Math.min(currentPhrase + 1, LOVING_KINDNESS_PHRASES.length - 1)].duration
          }
          return time - 100
        })
      }, 100)
    }

    return () => {
      if (interval) clearInterval(interval)
    }
  }, [isActive, isComplete, nextPhrase, currentPhrase])

  const progress = ((currentPhraseData.duration - timeRemaining) / currentPhraseData.duration) * 100
  const overallProgress = ((currentPhrase + 1) / LOVING_KINDNESS_PHRASES.length) * 100

  const getPhaseColor = (phaseName: string) => {
    switch (phaseName) {
      case 'Self':
        return 'from-pink-200 to-pink-300'
      case 'Loved One':
        return 'from-red-200 to-red-300'
      case 'All Beings':
        return 'from-purple-200 to-purple-300'
      default:
        return 'from-calm-200 to-calm-300'
    }
  }

  if (isComplete) {
    return (
      <Card className="max-w-md mx-auto">
        <CardContent className="text-center py-8">
          <div className="w-16 h-16 bg-pink-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Heart className="w-8 h-8 text-pink-500" fill="currentColor" />
          </div>
          <h2 className="text-2xl font-semibold text-pink-700 mb-2">
            Loving Kindness Complete
          </h2>
          <p className="text-gray-600 mb-6">
            You've sent loving kindness to yourself, a loved one, and all beings. 
            Notice how your heart feels now - perhaps softer, warmer, more open.
          </p>
          <Button onClick={reset} variant="calm" size="lg">
            Practice Again
          </Button>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="max-w-md mx-auto">
      <CardHeader className="text-center">
        <CardTitle>Loving-Kindness Practice</CardTitle>
        <CardDescription>
          Cultivate compassion for yourself and others
        </CardDescription>
      </CardHeader>
      
      <CardContent className="space-y-6">
        {/* Progress */}
        <div className="flex items-center justify-between text-sm text-gray-600">
          <span>{currentPhase?.name} ({currentPhrase + 1}/{LOVING_KINDNESS_PHRASES.length})</span>
          <span>{Math.round(overallProgress)}% complete</span>
        </div>

        <div className="w-full bg-gray-200 rounded-full h-2">
          <div 
            className="bg-pink-500 h-2 rounded-full transition-all duration-300"
            style={{ width: `${overallProgress}%` }}
          />
        </div>

        {/* Current Phase */}
        {currentPhase && (
          <div className="text-center">
            <p className="text-sm text-gray-600 mb-2">{currentPhase.description}</p>
            <div className={`inline-block px-3 py-1 rounded-full bg-gradient-to-r ${getPhaseColor(currentPhase.name)} text-sm font-medium`}>
              {currentPhase.name}
            </div>
          </div>
        )}

        {/* Current Phrase */}
        <div className="bg-gradient-to-r from-pink-50 to-purple-50 rounded-lg p-8 text-center">
          <div className="mb-4">
            <Heart className="w-12 h-12 text-pink-500 mx-auto mb-3" fill="currentColor" />
          </div>
          
          <p className="text-2xl font-medium text-gray-800 leading-relaxed mb-4">
            {currentPhraseData.text}
          </p>
          
          {isActive && (
            <div className="text-xl font-mono text-pink-600">
              {Math.ceil(timeRemaining / 1000)}s
            </div>
          )}
        </div>

        {/* Current Phrase Progress */}
        <div className="w-full bg-pink-100 rounded-full h-2">
          <div 
            className="bg-pink-500 h-2 rounded-full transition-all duration-100 ease-linear"
            style={{ width: `${progress}%` }}
          />
        </div>

        {/* Instructions */}
        <div className="text-sm text-gray-600 text-center bg-pink-50 p-3 rounded-md">
          <p className="mb-2">Loving-kindness meditation:</p>
          <ul className="space-y-1">
            <li>• Repeat each phrase silently or aloud</li>
            <li>• Feel the intention behind the words</li>
            <li>• Notice warmth or softness in your heart</li>
            <li>• It's okay if feelings don't come immediately</li>
          </ul>
        </div>

        {/* Phase Guide */}
        <div className="grid grid-cols-3 gap-2">
          {PHASES.map((phase, index) => (
            <div key={index} className="text-center">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold ${
                currentPhase?.name === phase.name
                  ? 'bg-pink-500 text-white'
                  : currentPhrase > phase.end
                    ? 'bg-green-500 text-white'
                    : 'bg-gray-200 text-gray-500'
              }`}>
                {index + 1}
              </div>
              <p className="text-xs text-gray-600 mt-1">{phase.name}</p>
            </div>
          ))}
        </div>

        {/* Controls */}
        <div className="flex justify-center space-x-3">
          <Button
            onClick={() => setIsActive(!isActive)}
            variant="calm"
            size="lg"
            className="flex items-center space-x-2"
            aria-label={isActive ? 'Pause loving kindness practice' : 'Start loving kindness practice'}
          >
            {isActive ? <Pause size={20} /> : <Play size={20} />}
            <span>{isActive ? 'Pause' : 'Start'}</span>
          </Button>
          
          <Button
            onClick={reset}
            variant="outline"
            size="lg"
            className="flex items-center space-x-2"
            aria-label="Reset loving kindness practice"
          >
            <RotateCcw size={20} />
            <span>Reset</span>
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}