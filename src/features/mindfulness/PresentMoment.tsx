'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/Button'
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/Card'
import { RefreshCw, Clock } from 'lucide-react'

const PRESENT_MOMENT_PROMPTS = [
  "What do you notice about your breathing right now?",
  "How does your body feel in this moment?",
  "What sounds can you hear around you?",
  "What thoughts are passing through your mind?",
  "How are your feet connecting with the ground?",
  "What emotions are present for you right now?",
  "What can you see in your immediate surroundings?",
  "How does the air feel on your skin?",
  "What is the quality of light around you?",
  "What does this moment feel like in your body?",
  "If you were to describe 'right now' in three words, what would they be?",
  "What is the most subtle sensation you can notice?",
  "How present do you feel on a scale of 1-10?",
  "What would you like to appreciate about this moment?",
  "How has this moment been a gift to you?"
]

export default function PresentMoment() {
  const [currentPrompt, setCurrentPrompt] = useState(0)
  const [startTime, setStartTime] = useState<Date | null>(null)
  const [timeSpent, setTimeSpent] = useState(0)
  const [isActive, setIsActive] = useState(false)

  const getRandomPrompt = () => {
    const availablePrompts = PRESENT_MOMENT_PROMPTS.filter((_, index) => index !== currentPrompt)
    const randomIndex = Math.floor(Math.random() * availablePrompts.length)
    const newPromptIndex = PRESENT_MOMENT_PROMPTS.findIndex(prompt => prompt === availablePrompts[randomIndex])
    setCurrentPrompt(newPromptIndex)
  }

  const startSession = () => {
    setStartTime(new Date())
    setIsActive(true)
    setTimeSpent(0)
  }

  const endSession = () => {
    setIsActive(false)
    setStartTime(null)
  }

  useEffect(() => {
    let interval: NodeJS.Timeout | null = null
    
    if (isActive && startTime) {
      interval = setInterval(() => {
        setTimeSpent(Math.floor((Date.now() - startTime.getTime()) / 1000))
      }, 1000)
    }

    return () => {
      if (interval) clearInterval(interval)
    }
  }, [isActive, startTime])

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins}:${secs.toString().padStart(2, '0')}`
  }

  return (
    <Card className="max-w-md mx-auto">
      <CardHeader className="text-center">
        <CardTitle>Present Moment Awareness</CardTitle>
        <CardDescription>
          Simple questions to anchor you in the now
        </CardDescription>
      </CardHeader>
      
      <CardContent className="space-y-6">
        {/* Timer */}
        {isActive && (
          <div className="flex items-center justify-center space-x-2 bg-calm-50 rounded-lg p-3">
            <Clock size={16} className="text-calm-600" />
            <span className="text-lg font-mono text-calm-800">
              {formatTime(timeSpent)}
            </span>
          </div>
        )}

        {/* Current Prompt */}
        <div className="bg-gradient-to-r from-calm-50 to-grounding-50 rounded-lg p-6 text-center">
          <div className="mb-4">
            <div className="w-12 h-12 bg-calm-200 rounded-full flex items-center justify-center mx-auto mb-3">
              <span className="text-xl">💭</span>
            </div>
          </div>
          
          <p className="text-lg text-gray-800 leading-relaxed font-medium">
            {PRESENT_MOMENT_PROMPTS[currentPrompt]}
          </p>
        </div>

        {/* Instructions */}
        <div className="bg-blue-50 p-4 rounded-lg">
          <p className="text-sm text-blue-800 mb-2 font-medium">
            How to practice:
          </p>
          <ul className="text-sm text-blue-700 space-y-1">
            <li>• Read the question slowly</li>
            <li>• Take a moment to genuinely explore it</li>
            <li>• Notice what arises without judgment</li>
            <li>• There are no right or wrong answers</li>
          </ul>
        </div>

        {/* Reflection Area */}
        {isActive && (
          <div className="space-y-3">
            <label className="text-sm font-medium text-gray-700">
              Your reflection (optional):
            </label>
            <textarea
              className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-calm-500 focus:border-calm-500 resize-none"
              rows={3}
              placeholder="What do you notice? How does this moment feel?"
            />
          </div>
        )}

        {/* Controls */}
        <div className="flex flex-col space-y-3">
          {!isActive ? (
            <Button
              onClick={startSession}
              variant="calm"
              size="lg"
              className="w-full"
            >
              Begin Present Moment Practice
            </Button>
          ) : (
            <Button
              onClick={endSession}
              variant="outline"
              size="lg"
              className="w-full"
            >
              End Session
            </Button>
          )}
          
          <Button
            onClick={getRandomPrompt}
            variant="ghost"
            size="lg"
            className="flex items-center space-x-2 w-full"
          >
            <RefreshCw size={20} />
            <span>New Question</span>
          </Button>
        </div>

        {/* Completion Message */}
        {!isActive && timeSpent > 0 && (
          <div className="bg-green-50 border border-green-200 rounded-lg p-4 text-center">
            <p className="text-green-800 font-medium mb-1">
              Session Complete! ✨
            </p>
            <p className="text-sm text-green-700">
              You spent {formatTime(timeSpent)} in present moment awareness.
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  )
}