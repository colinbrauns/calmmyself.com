'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Button } from '@/components/ui/Button'
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/Card'
import { Trees, Mountain, Waves, Sun, RefreshCw } from 'lucide-react'

interface NatureScene {
  id: string
  name: string
  icon: React.ElementType
  color: string
  description: string
  visualization: string[]
  sounds: string[]
  sensations: string[]
}

const NATURE_SCENES: NatureScene[] = [
  {
    id: 'forest',
    name: 'Peaceful Forest',
    icon: Trees,
    color: 'green',
    description: 'A quiet woodland path dappled with sunlight',
    visualization: [
      "You're walking on a soft forest path covered with fallen leaves.",
      "Tall trees stretch up around you, their branches forming a natural canopy.",
      "Gentle rays of sunlight filter through the leaves, creating dancing patterns of light and shadow.",
      "The air is fresh and clean, filled with the scent of earth and growing things.",
      "You can hear birds singing softly in the distance and leaves rustling in a gentle breeze."
    ],
    sounds: [
      "Gentle rustling of leaves",
      "Distant bird songs",
      "Your footsteps on the soft earth",
      "A gentle breeze through the trees",
      "Perhaps the distant sound of a stream"
    ],
    sensations: [
      "Cool, fresh air filling your lungs",
      "Soft earth beneath your feet",
      "Dappled sunlight warming your skin",
      "A gentle breeze on your face",
      "The peaceful feeling of being embraced by nature"
    ]
  },
  {
    id: 'ocean',
    name: 'Ocean Shore',
    icon: Waves,
    color: 'blue',
    description: 'A serene beach with gentle waves and warm sand',
    visualization: [
      "You're sitting on warm, soft sand at the edge of a beautiful ocean.",
      "The water is a stunning blue-green color, clear and inviting.",
      "Gentle waves roll in rhythmically, creating white foam as they meet the shore.",
      "The horizon stretches endlessly where the ocean meets the sky.",
      "Seagulls glide gracefully overhead against a backdrop of puffy white clouds."
    ],
    sounds: [
      "Rhythmic sound of waves washing ashore",
      "Gentle hiss as water retreats over sand",
      "Seagulls calling in the distance",
      "Gentle breeze rustling through beach grass",
      "The vast, peaceful sound of the ocean"
    ],
    sensations: [
      "Warm sand beneath you",
      "Gentle ocean breeze on your skin",
      "Warm sun on your face",
      "Salt air filling your lungs",
      "Cool water touching your feet"
    ]
  },
  {
    id: 'mountain',
    name: 'Mountain Peak',
    icon: Mountain,
    color: 'purple',
    description: 'A peaceful mountain summit with vast views',
    visualization: [
      "You're sitting on a comfortable rocky outcrop at the top of a beautiful mountain.",
      "Rolling hills and valleys stretch out below you in all directions.",
      "The air is crisp and clear, with unlimited visibility.",
      "Other mountain peaks rise in the distance, creating layers of blue and purple silhouettes.",
      "Above you, the sky is a brilliant blue with white clouds drifting slowly by."
    ],
    sounds: [
      "Gentle wind through the mountain air",
      "Distant echo from the valleys below",
      "Perhaps the call of a hawk circling overhead",
      "Your own peaceful breathing",
      "The profound silence of high places"
    ],
    sensations: [
      "Cool, crisp mountain air",
      "Warm sun on your back",
      "Solid rock supporting you",
      "Gentle breeze in your hair",
      "A sense of elevation and expansiveness"
    ]
  },
  {
    id: 'meadow',
    name: 'Sunny Meadow',
    icon: Sun,
    color: 'yellow',
    description: 'A flower-filled meadow on a perfect day',
    visualization: [
      "You're lying in a beautiful meadow filled with wildflowers.",
      "Colorful blooms surround you - yellows, purples, whites, and pinks.",
      "The grass is soft and green, swaying gently in a warm breeze.",
      "Above you, the sky is a perfect blue with fluffy white clouds.",
      "Butterflies dance from flower to flower, and bees hum contentedly nearby."
    ],
    sounds: [
      "Gentle buzzing of bees among flowers",
      "Grass and flowers swaying in the breeze",
      "Birds singing happily nearby",
      "The whisper of wind through the meadow",
      "Your own peaceful breathing"
    ],
    sensations: [
      "Soft grass beneath you",
      "Warm sunshine on your skin",
      "Gentle breeze carrying flower scents",
      "The tickle of grass around you",
      "Complete relaxation and peace"
    ]
  }
]

export default function NatureScenes() {
  const [selectedScene, setSelectedScene] = useState<NatureScene | null>(null)
  const [currentStep, setCurrentStep] = useState(0) // 0: visualization, 1: sounds, 2: sensations
  const [currentLineIndex, setCurrentLineIndex] = useState(0)

  const getColorClasses = (color: string) => {
    switch (color) {
      case 'green':
        return { bg: 'bg-green-100', text: 'text-green-800', accent: 'bg-green-500' }
      case 'blue':
        return { bg: 'bg-blue-100', text: 'text-blue-800', accent: 'bg-blue-500' }
      case 'purple':
        return { bg: 'bg-purple-100', text: 'text-purple-800', accent: 'bg-purple-500' }
      case 'yellow':
        return { bg: 'bg-yellow-100', text: 'text-yellow-800', accent: 'bg-yellow-500' }
      default:
        return { bg: 'bg-calm-100', text: 'text-calm-800', accent: 'bg-calm-500' }
    }
  }

  const getCurrentContent = () => {
    if (!selectedScene) return []
    switch (currentStep) {
      case 0: return selectedScene.visualization
      case 1: return selectedScene.sounds
      case 2: return selectedScene.sensations
      default: return []
    }
  }

  const getStepTitle = () => {
    switch (currentStep) {
      case 0: return 'Visualize'
      case 1: return 'Listen'
      case 2: return 'Feel'
      default: return ''
    }
  }

  const nextLine = () => {
    const content = getCurrentContent()
    if (currentLineIndex < content.length - 1) {
      setCurrentLineIndex(currentLineIndex + 1)
    } else if (currentStep < 2) {
      setCurrentStep(currentStep + 1)
      setCurrentLineIndex(0)
    }
  }

  const prevLine = () => {
    if (currentLineIndex > 0) {
      setCurrentLineIndex(currentLineIndex - 1)
    } else if (currentStep > 0) {
      setCurrentStep(currentStep - 1)
      const prevContent = selectedScene ? 
        (currentStep === 1 ? selectedScene.visualization : selectedScene.sounds) : []
      setCurrentLineIndex(prevContent.length - 1)
    }
  }

  const resetScene = () => {
    setSelectedScene(null)
    setCurrentStep(0)
    setCurrentLineIndex(0)
  }

  // Scene selection
  if (!selectedScene) {
    return (
      <Card className="max-w-md mx-auto">
        <CardHeader className="text-center">
          <CardTitle>Calming Nature Scenes</CardTitle>
          <CardDescription>
            Choose a natural setting for guided visualization
          </CardDescription>
        </CardHeader>
        
        <CardContent className="space-y-4">
          {NATURE_SCENES.map((scene) => {
            const Icon = scene.icon
            const colors = getColorClasses(scene.color)
            
            return (
              <Card 
                key={scene.id} 
                className="cursor-pointer transition-all duration-200 hover:scale-105 border-2 hover:border-gray-300"
                onClick={() => setSelectedScene(scene)}
              >
                <CardContent className="p-4">
                  <div className="flex items-start space-x-3">
                    <motion.div
                      className={`flex-shrink-0 w-12 h-12 rounded-lg ${colors.bg} flex items-center justify-center`}
                      animate={{ y: [0, -2, 0] }}
                      transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
                    >
                      <Icon size={24} className={colors.text} />
                    </motion.div>
                    <div>
                      <h3 className="font-semibold text-gray-800 mb-1">{scene.name}</h3>
                      <p className="text-sm text-gray-600">{scene.description}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )
          })}
        </CardContent>
      </Card>
    )
  }

  const colors = getColorClasses(selectedScene.color)
  const Icon = selectedScene.icon
  const currentContent = getCurrentContent()
  const totalLines = selectedScene.visualization.length + selectedScene.sounds.length + selectedScene.sensations.length
  const currentLineNumber = selectedScene.visualization.length * (currentStep >= 1 ? 1 : 0) +
                           selectedScene.sounds.length * (currentStep >= 2 ? 1 : 0) +
                           currentLineIndex + 1

  const isComplete = currentStep === 2 && currentLineIndex === selectedScene.sensations.length - 1

  return (
    <Card className="max-w-md mx-auto">
      <CardHeader className="text-center">
        <div className="flex items-center justify-center space-x-2 mb-2">
          <Icon size={24} className={colors.text} />
          <CardTitle>{selectedScene.name}</CardTitle>
        </div>
        <CardDescription>
          {getStepTitle()} • {currentLineNumber} of {totalLines}
        </CardDescription>
      </CardHeader>
      
      <CardContent className="space-y-6">
        {/* Progress */}
        <div className="w-full bg-gray-200 rounded-full h-2">
          <div 
            className={`${colors.accent} h-2 rounded-full transition-all duration-500`}
            style={{ width: `${(currentLineNumber / totalLines) * 100}%` }}
          />
        </div>

        {/* Step indicator */}
        <div className="flex justify-center space-x-4">
          {['Visualize', 'Listen', 'Feel'].map((step, index) => (
            <div key={index} className="text-center">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold ${
                index === currentStep
                  ? `${colors.accent} text-white`
                  : index < currentStep
                    ? 'bg-green-500 text-white'
                    : 'bg-gray-200 text-gray-500'
              }`}>
                {index + 1}
              </div>
              <p className="text-xs text-gray-600 mt-1">{step}</p>
            </div>
          ))}
        </div>

        {/* Current content with animated transitions */}
        <div className={`${colors.bg} rounded-lg p-6 text-center min-h-[120px] flex items-center justify-center overflow-hidden`}>
          <AnimatePresence mode="wait">
            <motion.p
              key={`${currentStep}-${currentLineIndex}`}
              className={`text-lg ${colors.text} leading-relaxed`}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.35, ease: 'easeOut' }}
            >
              {currentContent[currentLineIndex]}
            </motion.p>
          </AnimatePresence>
        </div>

        {/* Instructions */}
        <div className="bg-gray-50 p-3 rounded-lg text-center">
          <p className="text-sm text-gray-600">
            {currentStep === 0 && "Close your eyes and picture this scene in detail."}
            {currentStep === 1 && "Listen carefully. What sounds would you hear?"}
            {currentStep === 2 && "Feel the sensations. How does your body respond?"}
          </p>
        </div>

        {/* Controls */}
        <div className="flex space-x-3">
          <Button
            onClick={prevLine}
            variant="outline"
            size="lg"
            className="flex-1"
            disabled={currentStep === 0 && currentLineIndex === 0}
          >
            Previous
          </Button>
          
          {!isComplete ? (
            <Button
              onClick={nextLine}
              variant={selectedScene.color as any}
              size="lg"
              className="flex-1"
            >
              Next
            </Button>
          ) : (
            <Button
              onClick={resetScene}
              variant={selectedScene.color as any}
              size="lg"
              className="flex-1"
            >
              Complete
            </Button>
          )}
        </div>

        {/* Back to scenes */}
        <div className="text-center">
          <Button
            onClick={resetScene}
            variant="ghost"
            size="sm"
            className="flex items-center space-x-2"
          >
            <RefreshCw size={16} />
            <span>Choose Different Scene</span>
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}
