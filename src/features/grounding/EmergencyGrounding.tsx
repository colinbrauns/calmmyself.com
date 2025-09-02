'use client'

import { useState, useCallback, useEffect } from 'react'
import { Button } from '@/components/ui/Button'
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/Card'
import { AlertTriangle, Phone, CheckCircle, RotateCcw } from 'lucide-react'

interface GroundingStep {
  title: string
  instruction: string
  action: string
  duration: number
  type: 'breathing' | 'physical' | 'cognitive' | 'sensory'
}

const EMERGENCY_STEPS: GroundingStep[] = [
  {
    title: "STOP",
    instruction: "Stop what you're doing. You're going to be okay.",
    action: "Take a moment to pause everything",
    duration: 3000,
    type: 'cognitive'
  },
  {
    title: "BREATHE",
    instruction: "Take a deep breath in through your nose, hold for 3, then breathe out slowly through your mouth.",
    action: "In... 2... 3... Hold... 2... 3... Out... 2... 3... 4... 5... 6",
    duration: 12000,
    type: 'breathing'
  },
  {
    title: "FEET ON GROUND",
    instruction: "Feel your feet firmly planted on the ground. Press them down. You are here, you are safe.",
    action: "Press your feet firmly into the floor",
    duration: 8000,
    type: 'physical'
  },
  {
    title: "5 THINGS YOU CAN SEE",
    instruction: "Look around and name 5 things you can see. Say them out loud if possible.",
    action: "Look around and count: 1... 2... 3... 4... 5",
    duration: 15000,
    type: 'sensory'
  },
  {
    title: "4 THINGS YOU CAN TOUCH",
    instruction: "Find 4 things you can touch. Feel their texture, temperature, weight.",
    action: "Touch and count: 1... 2... 3... 4",
    duration: 12000,
    type: 'sensory'
  },
  {
    title: "3 THINGS YOU CAN HEAR",
    instruction: "Listen carefully. What are 3 sounds you can hear right now?",
    action: "Listen and count: 1... 2... 3",
    duration: 10000,
    type: 'sensory'
  },
  {
    title: "YOU ARE SAFE",
    instruction: "This feeling will pass. You are in control. You are safe right now.",
    action: "Repeat: 'I am safe. This will pass. I am in control.'",
    duration: 8000,
    type: 'cognitive'
  }
]

const CRISIS_RESOURCES = [
  {
    name: "Crisis Text Line",
    contact: "Text HOME to 741741",
    description: "24/7 crisis support via text"
  },
  {
    name: "National Suicide Prevention Lifeline", 
    contact: "Call or Text 988",
    description: "24/7 suicide prevention and crisis support"
  },
  {
    name: "Emergency Services",
    contact: "Call 911",
    description: "For immediate life-threatening emergencies"
  }
]

export default function EmergencyGrounding() {
  const [currentStep, setCurrentStep] = useState(0)
  const [timeRemaining, setTimeRemaining] = useState(0)
  const [isActive, setIsActive] = useState(false)
  const [isComplete, setIsComplete] = useState(false)
  const [showCrisisResources, setShowCrisisResources] = useState(false)

  const currentStepData = EMERGENCY_STEPS[currentStep]

  const nextStep = useCallback(() => {
    if (currentStep < EMERGENCY_STEPS.length - 1) {
      const nextIndex = currentStep + 1
      setCurrentStep(nextIndex)
      setTimeRemaining(EMERGENCY_STEPS[nextIndex].duration)
    } else {
      setIsComplete(true)
      setIsActive(false)
    }
  }, [currentStep])

  const startProtocol = useCallback(() => {
    setCurrentStep(0)
    setTimeRemaining(EMERGENCY_STEPS[0].duration)
    setIsActive(true)
    setIsComplete(false)
  }, [])

  const reset = useCallback(() => {
    setCurrentStep(0)
    setTimeRemaining(0)
    setIsActive(false)
    setIsComplete(false)
    setShowCrisisResources(false)
  }, [])

  useEffect(() => {
    let interval: NodeJS.Timeout | null = null
    
    if (isActive && !isComplete) {
      interval = setInterval(() => {
        setTimeRemaining((time) => {
          if (time <= 100) {
            nextStep()
            return EMERGENCY_STEPS[Math.min(currentStep + 1, EMERGENCY_STEPS.length - 1)].duration
          }
          return time - 100
        })
      }, 100)
    }

    return () => {
      if (interval) clearInterval(interval)
    }
  }, [isActive, isComplete, nextStep, currentStep])

  const getStepColor = (type: string) => {
    switch (type) {
      case 'breathing': return 'blue'
      case 'physical': return 'green' 
      case 'cognitive': return 'purple'
      case 'sensory': return 'orange'
      default: return 'gray'
    }
  }

  const getStepColorClasses = (type: string) => {
    const color = getStepColor(type)
    switch (color) {
      case 'blue': return { bg: 'bg-blue-100', text: 'text-blue-800', accent: 'bg-blue-500' }
      case 'green': return { bg: 'bg-green-100', text: 'text-green-800', accent: 'bg-green-500' }
      case 'purple': return { bg: 'bg-purple-100', text: 'text-purple-800', accent: 'bg-purple-500' }
      case 'orange': return { bg: 'bg-orange-100', text: 'text-orange-800', accent: 'bg-orange-500' }
      default: return { bg: 'bg-gray-100', text: 'text-gray-800', accent: 'bg-gray-500' }
    }
  }

  // Crisis resources view
  if (showCrisisResources) {
    return (
      <Card className="max-w-md mx-auto">
        <CardHeader className="text-center">
          <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-3">
            <Phone className="w-6 h-6 text-red-600" />
          </div>
          <CardTitle className="text-red-800">Crisis Support Resources</CardTitle>
          <CardDescription>
            Professional help is available 24/7
          </CardDescription>
        </CardHeader>
        
        <CardContent className="space-y-4">
          {CRISIS_RESOURCES.map((resource, index) => (
            <div key={index} className="bg-red-50 border border-red-200 rounded-lg p-4">
              <h3 className="font-semibold text-red-800 mb-1">{resource.name}</h3>
              <p className="text-lg font-mono text-red-700 mb-1">{resource.contact}</p>
              <p className="text-sm text-red-600">{resource.description}</p>
            </div>
          ))}
          
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
            <p className="text-sm text-yellow-800">
              <strong>Remember:</strong> You are not alone. These feelings will pass. 
              Professional support is just a call or text away.
            </p>
          </div>

          <div className="flex space-x-3">
            <Button
              onClick={() => setShowCrisisResources(false)}
              variant="outline"
              size="lg"
              className="flex-1"
            >
              Back to Grounding
            </Button>
            <Button
              onClick={startProtocol}
              variant="calm"
              size="lg"
              className="flex-1"
            >
              Try Grounding
            </Button>
          </div>
        </CardContent>
      </Card>
    )
  }

  // Completion view
  if (isComplete) {
    return (
      <Card className="max-w-md mx-auto">
        <CardContent className="text-center py-8">
          <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
          <h2 className="text-2xl font-semibold text-green-700 mb-2">
            You Made It Through
          </h2>
          <p className="text-gray-600 mb-6">
            You've completed the emergency grounding protocol. 
            Take a moment to notice how you're feeling now. You are safe.
          </p>
          
          <div className="space-y-3">
            <Button onClick={reset} variant="grounding" size="lg" className="w-full">
              I'm Feeling Better
            </Button>
            <Button 
              onClick={() => setShowCrisisResources(true)}
              variant="outline" 
              size="lg" 
              className="w-full"
            >
              I Still Need Help
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
          <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-3">
            <AlertTriangle className="w-6 h-6 text-red-600" />
          </div>
          <CardTitle className="text-red-800">Emergency Grounding Protocol</CardTitle>
          <CardDescription>
            Quick grounding for overwhelming moments
          </CardDescription>
        </CardHeader>
        
        <CardContent className="space-y-6">
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-center">
            <p className="text-red-800 font-medium mb-2">
              If you're feeling overwhelmed, panicked, or disconnected:
            </p>
            <p className="text-red-700 text-sm">
              This protocol will guide you through 7 steps to help you feel grounded and safe again.
            </p>
          </div>

          <div className="bg-blue-50 p-4 rounded-lg">
            <p className="text-sm text-blue-800 font-medium mb-2">What this will do:</p>
            <ul className="text-sm text-blue-700 space-y-1">
              <li>• Interrupt the overwhelm cycle</li>
              <li>• Reconnect you to your body and surroundings</li>
              <li>• Use proven grounding techniques</li>
              <li>• Help you feel safe and in control</li>
            </ul>
          </div>

          <div className="space-y-3">
            <Button
              onClick={startProtocol}
              variant="grounding"
              size="lg"
              className="w-full bg-red-600 hover:bg-red-700 text-white font-bold"
            >
              Start Emergency Grounding
            </Button>
            
            <Button
              onClick={() => setShowCrisisResources(true)}
              variant="outline"
              size="lg"
              className="w-full border-red-300 text-red-700 hover:bg-red-50"
            >
              Crisis Support Resources
            </Button>
          </div>
        </CardContent>
      </Card>
    )
  }

  const colors = getStepColorClasses(currentStepData.type)
  const progress = ((currentStepData.duration - timeRemaining) / currentStepData.duration) * 100
  const overallProgress = ((currentStep + 1) / EMERGENCY_STEPS.length) * 100

  return (
    <Card className="max-w-md mx-auto">
      <CardHeader className="text-center">
        <CardTitle>Emergency Grounding</CardTitle>
        <CardDescription>
          Step {currentStep + 1} of {EMERGENCY_STEPS.length}
        </CardDescription>
      </CardHeader>
      
      <CardContent className="space-y-6">
        {/* Overall Progress */}
        <div className="w-full bg-gray-200 rounded-full h-3">
          <div 
            className="bg-red-500 h-3 rounded-full transition-all duration-300"
            style={{ width: `${overallProgress}%` }}
          />
        </div>

        {/* Current Step */}
        <div className={`${colors.bg} rounded-lg p-6 text-center`}>
          <h2 className={`text-2xl font-bold ${colors.text} mb-4`}>
            {currentStepData.title}
          </h2>
          
          <p className={`text-lg ${colors.text} leading-relaxed mb-4`}>
            {currentStepData.instruction}
          </p>
          
          <div className={`bg-white rounded-lg p-3 ${colors.text} font-medium mb-4`}>
            {currentStepData.action}
          </div>
          
          <div className={`text-3xl font-bold ${colors.text}`}>
            {Math.ceil(timeRemaining / 1000)}s
          </div>
        </div>

        {/* Step Progress */}
        <div className={`w-full ${colors.bg} rounded-full h-2`}>
          <div 
            className={`${colors.accent} h-2 rounded-full transition-all duration-100 ease-linear`}
            style={{ width: `${progress}%` }}
          />
        </div>

        {/* Controls */}
        <div className="flex justify-center space-x-3">
          <Button
            onClick={() => setIsActive(false)}
            variant="outline"
            size="lg"
            className="flex items-center space-x-2"
          >
            <RotateCcw size={20} />
            <span>Stop</span>
          </Button>
          
          <Button
            onClick={() => setShowCrisisResources(true)}
            variant="outline"
            size="lg"
            className="flex items-center space-x-2 border-red-300 text-red-700 hover:bg-red-50"
          >
            <Phone size={20} />
            <span>Get Help</span>
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}
