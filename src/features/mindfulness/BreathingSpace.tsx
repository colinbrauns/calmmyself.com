'use client'

import { useState, useCallback, useEffect } from 'react'
import { Button } from '@/components/ui/Button'
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/Card'
import { Play, Pause, RotateCcw } from 'lucide-react'

interface MindfulnessStep {
  title: string
  subtitle: string
  instruction: string
  duration: number
  color: string
}

const MINDFULNESS_STEPS: MindfulnessStep[] = [
  {
    title: 'Awareness',
    subtitle: 'What is here right now?',
    instruction: 'Take a moment to notice what you\'re experiencing right now. What thoughts are going through your mind? What emotions are you feeling? What sensations are present in your body? Just observe without trying to change anything.',
    duration: 60000,
    color: 'blue'
  },
  {
    title: 'Gathering',
    subtitle: 'Focus on your breath',
    instruction: 'Now gather your attention and focus it on your breathing. Feel the breath coming in and going out. If your mind wanders, gently bring it back to the breath. This is your anchor to the present moment.',
    duration: 60000,
    color: 'green'
  },
  {
    title: 'Expanding',
    subtitle: 'Widen your awareness',
    instruction: 'Expand your awareness to include your whole body and your surroundings. Feel yourself sitting here, in this moment, in this place. You might imagine your awareness expanding like ripples on a pond, including everything around you with kindness.',
    duration: 60000,
    color: 'purple'
  }
]

export default function BreathingSpace() {
  const [currentStep, setCurrentStep] = useState(0)
  const [timeRemaining, setTimeRemaining] = useState(MINDFULNESS_STEPS[0].duration)
  const [isActive, setIsActive] = useState(false)
  const [isComplete, setIsComplete] = useState(false)

  const currentStepData = MINDFULNESS_STEPS[currentStep]

  const nextStep = useCallback(() => {
    if (currentStep < MINDFULNESS_STEPS.length - 1) {
      const nextIndex = currentStep + 1
      setCurrentStep(nextIndex)
      setTimeRemaining(MINDFULNESS_STEPS[nextIndex].duration)
    } else {
      setIsComplete(true)
      setIsActive(false)
    }
  }, [currentStep])

  const reset = useCallback(() => {
    setCurrentStep(0)
    setTimeRemaining(MINDFULNESS_STEPS[0].duration)
    setIsActive(false)
    setIsComplete(false)
  }, [])

  useEffect(() => {
    let interval: NodeJS.Timeout | null = null
    
    if (isActive && !isComplete) {
      interval = setInterval(() => {
        setTimeRemaining((time) => {
          if (time <= 100) {
            nextStep()
            return MINDFULNESS_STEPS[Math.min(currentStep + 1, MINDFULNESS_STEPS.length - 1)].duration
          }
          return time - 100
        })
      }, 100)
    }

    return () => {
      if (interval) clearInterval(interval)
    }
  }, [isActive, isComplete, nextStep, currentStep])

  const progress = ((MINDFULNESS_STEPS[currentStep].duration - timeRemaining) / MINDFULNESS_STEPS[currentStep].duration) * 100
  const overallProgress = ((currentStep + (isComplete ? 1 : (MINDFULNESS_STEPS[currentStep].duration - timeRemaining) / MINDFULNESS_STEPS[currentStep].duration)) / MINDFULNESS_STEPS.length) * 100

  const getColorClasses = (color: string) => {
    switch (color) {
      case 'blue':
        return { bg: 'bg-blue-100', text: 'text-blue-800', accent: 'bg-blue-500' }
      case 'green':
        return { bg: 'bg-green-100', text: 'text-green-800', accent: 'bg-green-500' }
      case 'purple':
        return { bg: 'bg-purple-100', text: 'text-purple-800', accent: 'bg-purple-500' }
      default:
        return { bg: 'bg-calm-100', text: 'text-calm-800', accent: 'bg-calm-500' }
    }
  }

  const colors = getColorClasses(currentStepData.color)

  if (isComplete) {
    return (
      <Card className="max-w-md mx-auto">
        <CardContent className="text-center py-8">
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <span className="text-2xl">🌸</span>
          </div>
          <h2 className="text-2xl font-semibold text-green-700 mb-2">
            Breathing Space Complete
          </h2>
          <p className="text-gray-600 mb-6">
            You've created a mindful breathing space. Take this sense of presence 
            and awareness with you as you continue your day.
          </p>
          <Button onClick={reset} variant="calm" size="lg">
            Create Another Space
          </Button>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="max-w-md mx-auto">
      <CardHeader className="text-center">
        <CardTitle>3-Minute Breathing Space</CardTitle>
        <CardDescription>
          A short mindfulness practice for any moment
        </CardDescription>
      </CardHeader>
      
      <CardContent className="space-y-6">
        {/* Overall Progress */}
        <div className="flex items-center justify-between text-sm text-gray-600">
          <span>Step {currentStep + 1} of {MINDFULNESS_STEPS.length}</span>
          <span>{Math.round(overallProgress)}% complete</span>
        </div>

        <div className="w-full bg-gray-200 rounded-full h-2">
          <div 
            className="bg-calm-500 h-2 rounded-full transition-all duration-300"
            style={{ width: `${overallProgress}%` }}
          />
        </div>

        {/* Current Step */}
        <div className={`${colors.bg} rounded-lg p-6 text-center`}>
          <div className="mb-4">
            <h3 className={`text-2xl font-bold ${colors.text} mb-2`}>
              {currentStepData.title}
            </h3>
            <p className={`text-sm ${colors.text} font-medium mb-4`}>
              {currentStepData.subtitle}
            </p>
          </div>
          
          <p className={`${colors.text} leading-relaxed text-sm mb-4`}>
            {currentStepData.instruction}
          </p>
          
          {isActive && (
            <div className={`text-3xl font-bold ${colors.text}`}>
              {Math.ceil(timeRemaining / 1000)}s
            </div>
          )}
        </div>

        {/* Current Step Progress */}
        <div className={`w-full ${colors.bg} rounded-full h-2`}>
          <div 
            className={`${colors.accent} h-2 rounded-full transition-all duration-100 ease-linear`}
            style={{ width: `${progress}%` }}
          />
        </div>

        {/* Step Indicators */}
        <div className="flex justify-center space-x-4">
          {MINDFULNESS_STEPS.map((step, index) => {
            const stepColors = getColorClasses(step.color)
            return (
              <div key={index} className="text-center">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold ${
                  index === currentStep 
                    ? `${stepColors.accent} text-white` 
                    : index < currentStep 
                      ? 'bg-green-500 text-white'
                      : 'bg-gray-200 text-gray-500'
                }`}>
                  {index + 1}
                </div>
                <p className="text-xs text-gray-600 mt-1">{step.title}</p>
              </div>
            )
          })}
        </div>

        {/* Instructions */}
        <div className="text-xs text-gray-500 text-center bg-gray-50 p-3 rounded-md">
          <p className="font-medium mb-1">Perfect for busy moments</p>
          <p>This practice helps you pause, breathe, and reconnect with the present moment 
          whenever you need a reset during your day.</p>
        </div>

        {/* Controls */}
        <div className="flex justify-center space-x-3">
          <Button
            onClick={() => setIsActive(!isActive)}
            variant="calm"
            size="lg"
            className="flex items-center space-x-2"
            aria-label={isActive ? 'Pause breathing space' : 'Start breathing space'}
          >
            {isActive ? <Pause size={20} /> : <Play size={20} />}
            <span>{isActive ? 'Pause' : 'Start'}</span>
          </Button>
          
          <Button
            onClick={reset}
            variant="outline"
            size="lg"
            className="flex items-center space-x-2"
            aria-label="Reset breathing space"
          >
            <RotateCcw size={20} />
            <span>Reset</span>
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}