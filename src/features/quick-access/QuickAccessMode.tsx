'use client'

import { useState, useCallback, useEffect } from 'react'
import { Button } from '@/components/ui/Button'
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/Card'
import { Zap, RotateCcw, CheckCircle, ArrowRight } from 'lucide-react'
import { useUsageTracking } from '@/hooks/useUsageTracking'

interface QuickTechnique {
  id: string
  title: string
  instruction: string
  duration: number
  type: 'breathing' | 'grounding' | 'physical'
}

const QUICK_TECHNIQUES: QuickTechnique[] = [
  {
    id: 'double-inhale',
    title: 'Double Inhale',
    instruction: 'Take two quick inhales through your nose, then one long exhale through your mouth',
    duration: 6000,
    type: 'breathing'
  },
  {
    id: 'feet-floor',
    title: 'Feet on Floor',
    instruction: 'Press your feet firmly into the ground. Feel the connection and stability',
    duration: 8000,
    type: 'grounding'
  },
  {
    id: 'shoulder-drop',
    title: 'Shoulder Drop',
    instruction: 'Lift your shoulders up to your ears, hold for 3 seconds, then let them drop',
    duration: 8000,
    type: 'physical'
  },
  {
    id: 'cold-water',
    title: 'Cold Water Face',
    instruction: 'Imagine splashing cold water on your face, or actually do it if possible',
    duration: 5000,
    type: 'physical'
  },
  {
    id: 'count-backward',
    title: 'Count Backward',
    instruction: 'Count backward from 100 by 7s: 100, 93, 86, 79, 72, 65...',
    duration: 15000,
    type: 'grounding'
  },
  {
    id: 'hand-squeeze',
    title: 'Hand Squeeze',
    instruction: 'Make tight fists, squeeze for 5 seconds, then release and shake your hands',
    duration: 10000,
    type: 'physical'
  },
  {
    id: 'name-colors',
    title: 'Name 5 Colors',
    instruction: 'Look around and quickly name 5 different colors you can see',
    duration: 10000,
    type: 'grounding'
  },
  {
    id: 'breath-hold',
    title: 'Extended Exhale',
    instruction: 'Breathe in for 4, hold for 4, exhale slowly for 8 counts',
    duration: 16000,
    type: 'breathing'
  }
]

export default function QuickAccessMode() {
  const [currentTechnique, setCurrentTechnique] = useState(0)
  const [timeRemaining, setTimeRemaining] = useState(0)
  const [isActive, setIsActive] = useState(false)
  const [completedTechniques, setCompletedTechniques] = useState<string[]>([])
  const [totalTime, setTotalTime] = useState(0)
  const [startTime, setStartTime] = useState<Date | null>(null)
  
  // Usage tracking
  const { trackUsage } = useUsageTracking('quick-access', isActive)

  const currentTech = QUICK_TECHNIQUES[currentTechnique]
  const remainingTime = 60 - totalTime

  const nextTechnique = useCallback(() => {
    if (currentTechnique < QUICK_TECHNIQUES.length - 1 && totalTime < 55) {
      const nextIndex = currentTechnique + 1
      setCurrentTechnique(nextIndex)
      setTimeRemaining(QUICK_TECHNIQUES[nextIndex].duration)
      setCompletedTechniques(prev => [...prev, currentTech.id])
    } else {
      setIsActive(false)
      setCompletedTechniques(prev => [...prev, currentTech.id])
    }
  }, [currentTechnique, totalTime, currentTech])

  const skipTechnique = useCallback(() => {
    nextTechnique()
  }, [nextTechnique])

  const startQuickAccess = useCallback(() => {
    setCurrentTechnique(0)
    setTimeRemaining(QUICK_TECHNIQUES[0].duration)
    setIsActive(true)
    setCompletedTechniques([])
    setTotalTime(0)
    setStartTime(new Date())
  }, [])

  const reset = useCallback(() => {
    if (isActive && completedTechniques.length > 0) {
      trackUsage(totalTime >= 45) // Consider completed if ran for 45+ seconds
    }
    setCurrentTechnique(0)
    setTimeRemaining(0)
    setIsActive(false)
    setCompletedTechniques([])
    setTotalTime(0)
    setStartTime(null)
  }, [isActive, completedTechniques.length, totalTime, trackUsage])

  useEffect(() => {
    let interval: NodeJS.Timeout | null = null
    
    if (isActive && startTime) {
      interval = setInterval(() => {
        const elapsed = Math.floor((Date.now() - startTime.getTime()) / 1000)
        setTotalTime(elapsed)
        
        setTimeRemaining((time) => {
          if (time <= 100) {
            if (elapsed >= 60) {
              setIsActive(false)
              setCompletedTechniques(prev => [...prev, currentTech.id])
              return 0
            }
            nextTechnique()
            return QUICK_TECHNIQUES[Math.min(currentTechnique + 1, QUICK_TECHNIQUES.length - 1)].duration
          }
          return time - 100
        })
      }, 100)
    }

    return () => {
      if (interval) clearInterval(interval)
    }
  }, [isActive, startTime, nextTechnique, currentTechnique, currentTech])

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'breathing': return 'blue'
      case 'grounding': return 'green'
      case 'physical': return 'purple'
      default: return 'gray'
    }
  }

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'breathing': return '🫁'
      case 'grounding': return '🌱'
      case 'physical': return '💪'
      default: return '⚡'
    }
  }

  // Completion screen
  if (!isActive && (completedTechniques.length > 0 || totalTime >= 60)) {
    return (
      <Card className="max-w-md mx-auto">
        <CardContent className="text-center py-8">
          <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
          <h2 className="text-2xl font-semibold text-green-700 mb-2">
            Quick Access Complete!
          </h2>
          <p className="text-gray-600 mb-4">
            You completed {completedTechniques.length} technique{completedTechniques.length !== 1 ? 's' : ''} in {totalTime} seconds.
          </p>
          
          <div className="bg-green-50 rounded-lg p-4 mb-6">
            <p className="text-sm text-green-800">
              <strong>Great job!</strong> You've given yourself some quick relief. 
              If you need more support, try a longer technique from the main menu.
            </p>
          </div>

          <div className="space-y-3">
            <Button onClick={startQuickAccess} variant="calm" size="lg" className="w-full">
              Try Another 60 Seconds
            </Button>
            <Button onClick={reset} variant="outline" size="lg" className="w-full">
              Back to Main Menu
            </Button>
          </div>
        </CardContent>
      </Card>
    )
  }

  // Initial screen
  if (!isActive) {
    return (
      <Card className="max-w-md mx-auto">
        <CardHeader className="text-center">
          <div className="w-12 h-12 bg-yellow-100 rounded-full flex items-center justify-center mx-auto mb-3">
            <Zap className="w-6 h-6 text-yellow-600" />
          </div>
          <CardTitle className="text-yellow-800">Quick Access Mode</CardTitle>
          <CardDescription>
            60 seconds of rapid calming techniques
          </CardDescription>
        </CardHeader>
        
        <CardContent className="space-y-6">
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 text-center">
            <p className="text-yellow-800 font-medium mb-2">
              Perfect when you need immediate relief
            </p>
            <p className="text-yellow-700 text-sm">
              Fast-cycling through 8 different techniques in just 60 seconds. 
              Each technique is designed for maximum impact in minimal time.
            </p>
          </div>

          <div className="grid grid-cols-3 gap-2 text-center">
            {['🫁 Breathing', '🌱 Grounding', '💪 Physical'].map((type, index) => (
              <div key={index} className="bg-gray-50 rounded-lg p-2">
                <p className="text-xs text-gray-600">{type}</p>
              </div>
            ))}
          </div>

          <div className="bg-blue-50 p-4 rounded-lg">
            <p className="text-sm text-blue-800 font-medium mb-2">What to expect:</p>
            <ul className="text-sm text-blue-700 space-y-1">
              <li>• 8 rapid-fire calming techniques</li>
              <li>• 5-15 seconds per technique</li>
              <li>• Automatic progression</li>
              <li>• Skip any technique that doesn't feel right</li>
            </ul>
          </div>

          <Button
            onClick={startQuickAccess}
            variant="grounding"
            size="lg"
            className="w-full bg-yellow-600 hover:bg-yellow-700"
          >
            Start 60-Second Quick Access
          </Button>
        </CardContent>
      </Card>
    )
  }

  // Active technique screen
  const progress = ((currentTech.duration - timeRemaining) / currentTech.duration) * 100
  const typeColor = getTypeColor(currentTech.type)

  return (
    <Card className="max-w-md mx-auto">
      <CardHeader className="text-center">
        <CardTitle>Quick Access Mode</CardTitle>
        <CardDescription>
          {remainingTime}s remaining • Technique {currentTechnique + 1}/8
        </CardDescription>
      </CardHeader>
      
      <CardContent className="space-y-6">
        {/* Overall Progress */}
        <div className="space-y-2">
          <div className="flex justify-between text-sm text-gray-600">
            <span>Overall Progress</span>
            <span>{totalTime}/60s</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-3">
            <div 
              className="bg-yellow-500 h-3 rounded-full transition-all duration-300"
              style={{ width: `${(totalTime / 60) * 100}%` }}
            />
          </div>
        </div>

        {/* Current Technique */}
        <div className={`rounded-lg p-6 text-center ${typeColor === 'blue' ? 'bg-blue-100' : typeColor === 'green' ? 'bg-green-100' : typeColor === 'purple' ? 'bg-purple-100' : 'bg-gray-100'}`}>
          <div className="text-3xl mb-3">{getTypeIcon(currentTech.type)}</div>
          
          <h3 className={`text-xl font-semibold mb-3 ${typeColor === 'blue' ? 'text-blue-800' : typeColor === 'green' ? 'text-green-800' : typeColor === 'purple' ? 'text-purple-800' : 'text-gray-800'}`}>
            {currentTech.title}
          </h3>
          
          <p className={`leading-relaxed mb-4 ${typeColor === 'blue' ? 'text-blue-700' : typeColor === 'green' ? 'text-green-700' : typeColor === 'purple' ? 'text-purple-700' : 'text-gray-700'}`}>
            {currentTech.instruction}
          </p>
          
          <div className={`text-2xl font-bold ${
            typeColor === 'blue' ? 'text-blue-800' :
            typeColor === 'green' ? 'text-green-800' :
            typeColor === 'purple' ? 'text-purple-800' : 'text-gray-800'
          }`}>
            {Math.ceil(timeRemaining / 1000)}s
          </div>
        </div>

        {/* Current Technique Progress */}
        <div className={`w-full rounded-full h-2 ${
          typeColor === 'blue' ? 'bg-blue-100' :
          typeColor === 'green' ? 'bg-green-100' :
          typeColor === 'purple' ? 'bg-purple-100' : 'bg-gray-100'
        }`}>
          <div 
            className={`h-2 rounded-full transition-all duration-100 ease-linear ${
              typeColor === 'blue' ? 'bg-blue-500' :
              typeColor === 'green' ? 'bg-green-500' :
              typeColor === 'purple' ? 'bg-purple-500' : 'bg-gray-500'
            }`}
            style={{ width: `${progress}%` }}
          />
        </div>

        {/* Controls */}
        <div className="flex space-x-3">
          <Button
            onClick={skipTechnique}
            variant="outline"
            size="lg"
            className="flex-1 flex items-center space-x-2"
          >
            <ArrowRight size={20} />
            <span>Skip</span>
          </Button>
          
          <Button
            onClick={reset}
            variant="outline"
            size="lg"
            className="flex items-center space-x-2"
          >
            <RotateCcw size={20} />
            <span>Stop</span>
          </Button>
        </div>

        {/* Progress indicator */}
        <div className="flex justify-center space-x-2">
          {QUICK_TECHNIQUES.map((_, index) => (
            <div key={index} className={`w-2 h-2 rounded-full ${
              completedTechniques.includes(QUICK_TECHNIQUES[index].id) 
                ? 'bg-green-500'
                : index === currentTechnique 
                  ? 'bg-yellow-500'
                  : 'bg-gray-300'
            }`} />
          ))}
        </div>
      </CardContent>
    </Card>
  )
}