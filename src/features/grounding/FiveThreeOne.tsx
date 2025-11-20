'use client'

import { useState, useCallback } from 'react'
import { Button } from '@/components/ui/Button'
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/Card'
import { ChevronRight, RotateCcw, CheckCircle, Eye, Hand, Ear, Wind, Sparkles } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'

interface GroundingStep {
  sense: string
  count: number
  prompt: string
  icon: any
  color: string
}

const GROUNDING_STEPS: GroundingStep[] = [
  {
    sense: 'See',
    count: 5,
    prompt: '5 things you can see',
    icon: Eye,
    color: 'text-blue-500'
  },
  {
    sense: 'Touch',
    count: 4, 
    prompt: '4 things you can touch',
    icon: Hand,
    color: 'text-amber-600'
  },
  {
    sense: 'Hear',
    count: 3,
    prompt: '3 things you can hear',
    icon: Ear,
    color: 'text-purple-500'
  },
  {
    sense: 'Smell',
    count: 2,
    prompt: '2 things you can smell',
    icon: Wind,
    color: 'text-emerald-500'
  },
  {
    sense: 'Taste',
    count: 1,
    prompt: '1 thing you can taste',
    icon: Sparkles,
    color: 'text-rose-500'
  }
]

export default function FiveThreeOne() {
  const [currentStep, setCurrentStep] = useState(0)
  const [completedCounts, setCompletedCounts] = useState<number[]>([0, 0, 0, 0, 0])
  const [isComplete, setIsComplete] = useState(false)

  const currentStepData = GROUNDING_STEPS[currentStep]

  const handleTap = useCallback(() => {
    const newCounts = [...completedCounts]
    if (newCounts[currentStep] < currentStepData.count) {
      newCounts[currentStep] += 1
      setCompletedCounts(newCounts)
    }
  }, [completedCounts, currentStep, currentStepData.count])

  const nextStep = useCallback(() => {
    if (currentStep < GROUNDING_STEPS.length - 1) {
      setCurrentStep(currentStep + 1)
    } else {
      setIsComplete(true)
    }
  }, [currentStep])

  const reset = useCallback(() => {
    setCurrentStep(0)
    setCompletedCounts([0, 0, 0, 0, 0])
    setIsComplete(false)
  }, [])

  const isStepComplete = completedCounts[currentStep] >= currentStepData.count

  if (isComplete) {
    return (
      <Card className="max-w-md mx-auto">
        <CardContent className="text-center py-12">
          <motion.div 
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: "spring", stiffness: 200, damping: 15 }}
          >
            <CheckCircle className="w-20 h-20 text-green-500 mx-auto mb-6" />
          </motion.div>
          <h2 className="text-2xl font-semibold text-green-700 mb-3">
            Grounded & Ready
          </h2>
          <p className="text-gray-600 mb-8">
            You&rsquo;ve connected with all 5 senses. Take a deep breath and notice how you feel.
          </p>
          <Button onClick={reset} variant="grounding" size="lg">
            Start Again
          </Button>
        </CardContent>
      </Card>
    )
  }

  const Icon = currentStepData.icon

  return (
    <Card className="max-w-md mx-auto overflow-hidden">
      <CardHeader className="text-center relative z-10">
        <CardTitle>5-4-3-2-1 Grounding</CardTitle>
        <CardDescription>
          Tap the icons as you find things with your senses
        </CardDescription>
      </CardHeader>
      
      <CardContent className="space-y-8 relative z-10">
        {/* Dynamic Progress Header */}
        <div className="text-center space-y-2">
          <motion.div
            key={currentStepData.sense}
            initial={{ y: 10, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            className="text-2xl font-bold text-gray-800"
          >
            {currentStepData.prompt}
          </motion.div>
          <div className="text-sm text-gray-500 font-medium">
            {completedCounts[currentStep]} / {currentStepData.count} Found
          </div>
        </div>

        {/* Sensory Collector Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 justify-items-center min-h-[180px]">
          <AnimatePresence mode="popLayout">
            {Array.from({ length: currentStepData.count }).map((_, i) => {
              const isFound = i < completedCounts[currentStep]
              return (
                <motion.button
                  key={`${currentStep}-${i}`}
                  initial={{ scale: 0, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  exit={{ scale: 0, opacity: 0 }}
                  transition={{ delay: i * 0.1 }}
                  onClick={() => !isFound && handleTap()}
                  disabled={isFound}
                  className={`
                    relative w-20 h-20 rounded-2xl flex items-center justify-center
                    transition-all duration-300
                    ${isFound 
                      ? 'bg-grounding-100 shadow-inner ring-2 ring-grounding-200' 
                      : 'bg-white shadow-md hover:shadow-lg border-2 border-dashed border-gray-200 cursor-pointer hover:border-grounding-300 hover:bg-gray-50'
                    }
                  `}
                >
                  {isFound ? (
                    <motion.div
                      initial={{ scale: 0.5, rotate: -45 }}
                      animate={{ scale: 1, rotate: 0 }}
                      className={currentStepData.color}
                    >
                      <Icon className="w-8 h-8" />
                    </motion.div>
                  ) : (
                    <Icon className="w-6 h-6 text-gray-300" />
                  )}
                  
                  {/* Checkmark badge */}
                  {isFound && (
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      className="absolute -top-2 -right-2 bg-green-500 text-white rounded-full p-1 shadow-sm"
                    >
                      <CheckCircle className="w-3 h-3" />
                    </motion.div>
                  )}
                </motion.button>
              )
            })}
          </AnimatePresence>
        </div>

        {/* Context Tip */}
        {!isStepComplete && (
           <div className="text-center text-sm text-gray-400 animate-pulse">
              Look around you... tap a box when you find one.
           </div>
        )}

        {/* Controls */}
        <div className="flex justify-center pt-4">
          <AnimatePresence mode="wait">
            {isStepComplete ? (
              <motion.div
                key="next"
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                exit={{ y: 20, opacity: 0 }}
                className="w-full"
              >
                <Button
                  onClick={nextStep}
                  variant="grounding"
                  size="lg"
                  className="w-full flex items-center justify-center gap-2 shadow-lg shadow-grounding-200"
                >
                  <span>Next Sense</span>
                  <ChevronRight size={20} />
                </Button>
              </motion.div>
            ) : (
              <motion.div
                key="reset"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="w-full"
              >
                 <Button
                  onClick={reset}
                  variant="ghost"
                  size="sm"
                  className="w-full text-gray-400 hover:text-gray-600"
                >
                  Start Over
                </Button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </CardContent>

      {/* Background Blobs */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none z-0">
        <div className="absolute -top-20 -right-20 w-64 h-64 bg-grounding-50 rounded-full blur-3xl opacity-50" />
        <div className="absolute -bottom-20 -left-20 w-64 h-64 bg-blue-50 rounded-full blur-3xl opacity-50" />
      </div>
    </Card>
  )
}
