'use client'

import { useState, useCallback } from 'react'
import { Button } from '@/components/ui/Button'
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/Card'
import { ChevronRight, RotateCcw, CheckCircle } from 'lucide-react'

interface GroundingStep {
  sense: string
  count: number
  prompt: string
  examples: string[]
  color: string
}

const GROUNDING_STEPS: GroundingStep[] = [
  {
    sense: 'See',
    count: 5,
    prompt: 'Name 5 things you can see around you',
    examples: ['A book on the table', 'The color of the walls', 'Light coming through window', 'Your hands', 'A piece of furniture'],
    color: 'calm'
  },
  {
    sense: 'Touch',
    count: 4, 
    prompt: 'Name 4 things you can touch or feel',
    examples: ['The texture of your clothing', 'Temperature of the air', 'Surface you\'re sitting on', 'Your phone in your hand'],
    color: 'grounding'
  },
  {
    sense: 'Hear',
    count: 3,
    prompt: 'Name 3 things you can hear',
    examples: ['Traffic outside', 'Your own breathing', 'Air conditioning humming'],
    color: 'calm'
  },
  {
    sense: 'Smell',
    count: 2,
    prompt: 'Name 2 things you can smell',
    examples: ['Fresh air', 'Coffee', 'Soap', 'Food cooking'],
    color: 'grounding'
  },
  {
    sense: 'Taste',
    count: 1,
    prompt: 'Name 1 thing you can taste',
    examples: ['Mint from gum', 'Lingering coffee', 'Just the taste in your mouth'],
    color: 'calm'
  }
]

export default function FiveThreeOne() {
  const [currentStep, setCurrentStep] = useState(0)
  const [completedItems, setCompletedItems] = useState<string[]>([])
  const [isComplete, setIsComplete] = useState(false)

  const nextStep = useCallback(() => {
    if (currentStep < GROUNDING_STEPS.length - 1) {
      setCurrentStep(currentStep + 1)
    } else {
      setIsComplete(true)
    }
  }, [currentStep])

  const reset = useCallback(() => {
    setCurrentStep(0)
    setCompletedItems([])
    setIsComplete(false)
  }, [])

  const addItem = useCallback((item: string) => {
    if (item.trim() && !completedItems.includes(item.trim())) {
      setCompletedItems(prev => [...prev, item.trim()])
    }
  }, [completedItems])

  const currentStepData = GROUNDING_STEPS[currentStep]
  const currentStepItems = completedItems.filter((_, index) => 
    index >= GROUNDING_STEPS.slice(0, currentStep).reduce((sum, step) => sum + step.count, 0) &&
    index < GROUNDING_STEPS.slice(0, currentStep + 1).reduce((sum, step) => sum + step.count, 0)
  )

  if (isComplete) {
    return (
      <Card className="max-w-md mx-auto">
        <CardContent className="text-center py-8">
          <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
          <h2 className="text-2xl font-semibold text-green-700 mb-2">
            Well Done!
          </h2>
          <p className="text-gray-600 mb-6">
            You've completed the 5-4-3-2-1 grounding exercise. 
            Take a moment to notice how you feel now.
          </p>
          <Button onClick={reset} variant="grounding" size="lg">
            Try Again
          </Button>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="max-w-md mx-auto">
      <CardHeader className="text-center">
        <CardTitle>5-4-3-2-1 Grounding</CardTitle>
        <CardDescription>
          Use your senses to connect with the present moment
        </CardDescription>
      </CardHeader>
      
      <CardContent className="space-y-6">
        {/* Progress */}
        <div className="flex items-center justify-between text-sm text-gray-600">
          <span>Step {currentStep + 1} of {GROUNDING_STEPS.length}</span>
          <span>{completedItems.length} items completed</span>
        </div>

        <div className="w-full bg-gray-200 rounded-full h-2">
          <div 
            className="bg-calm-500 h-2 rounded-full transition-all duration-300"
            style={{ width: `${((currentStep + 1) / GROUNDING_STEPS.length) * 100}%` }}
          />
        </div>

        {/* Current Step */}
        <div className="space-y-4">
          <div className="text-center">
            <div className={`inline-flex items-center justify-center w-12 h-12 rounded-full ${
              currentStepData.color === 'calm' ? 'bg-calm-100 text-calm-700' : 'bg-grounding-100 text-grounding-700'
            } text-xl font-bold mb-3`}>
              {currentStepData.count}
            </div>
            <h3 className="text-xl font-semibold text-gray-800 mb-2">
              {currentStepData.prompt}
            </h3>
          </div>

          {/* Current Progress */}
          <div className="space-y-2">
            {Array.from({ length: currentStepData.count }, (_, i) => (
              <div 
                key={i}
                className={`p-3 rounded-md border-2 border-dashed ${
                  currentStepItems[i] 
                    ? 'border-green-300 bg-green-50 text-green-800' 
                    : 'border-gray-300 bg-gray-50 text-gray-500'
                }`}
              >
                {currentStepItems[i] || `${currentStepData.sense} ${i + 1}...`}
              </div>
            ))}
          </div>

          {/* Examples */}
          {currentStepItems.length < currentStepData.count && (
            <div className="bg-blue-50 p-3 rounded-md">
              <p className="text-sm text-blue-800 font-medium mb-2">Examples:</p>
              <ul className="text-sm text-blue-700 space-y-1">
                {currentStepData.examples.map((example, i) => (
                  <li key={i}>• {example}</li>
                ))}
              </ul>
            </div>
          )}
        </div>

        {/* Input */}
        {currentStepItems.length < currentStepData.count && (
          <div className="space-y-3">
            <input
              type="text"
              placeholder={`What can you ${currentStepData.sense.toLowerCase()}?`}
              className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-calm-500 focus:border-calm-500"
              onKeyPress={(e) => {
                if (e.key === 'Enter') {
                  addItem(e.currentTarget.value)
                  e.currentTarget.value = ''
                }
              }}
              aria-label={`Enter something you can ${currentStepData.sense.toLowerCase()}`}
            />
            <p className="text-xs text-gray-500 text-center">
              Press Enter to add • {currentStepItems.length}/{currentStepData.count} completed
            </p>
          </div>
        )}

        {/* Controls */}
        <div className="flex justify-center space-x-3">
          {currentStepItems.length === currentStepData.count && (
            <Button
              onClick={nextStep}
              variant="grounding"
              size="lg"
              className="flex items-center space-x-2"
            >
              <span>{currentStep === GROUNDING_STEPS.length - 1 ? 'Complete' : 'Next Step'}</span>
              <ChevronRight size={20} />
            </Button>
          )}
          
          <Button
            onClick={reset}
            variant="outline"
            size="lg"
            className="flex items-center space-x-2"
            aria-label="Reset grounding exercise"
          >
            <RotateCcw size={20} />
            <span>Reset</span>
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}