'use client'

import { useState } from 'react'
import '@/components/ui/shimmer.css'
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
  const prefersReducedMotion = typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  // Focus management for accessibility
  const contentRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (contentRef.current) {
      contentRef.current.focus();
    }
  }, [currentLineIndex, currentStep, selectedScene]);

  const getColorClasses = (color: string) => {
    switch (color) {
      case 'green':
        return { bg: 'bg-gradient-to-br from-green-100 to-green-200', text: 'text-green-900', accent: 'bg-green-500', shadow: 'shadow-green-200' };
      case 'blue':
        return { bg: 'bg-gradient-to-br from-blue-100 to-blue-200', text: 'text-blue-900', accent: 'bg-blue-500', shadow: 'shadow-blue-200' };
      case 'purple':
        return { bg: 'bg-gradient-to-br from-purple-100 to-purple-200', text: 'text-purple-900', accent: 'bg-purple-500', shadow: 'shadow-purple-200' };
      case 'yellow':
        return { bg: 'bg-gradient-to-br from-yellow-100 to-yellow-200', text: 'text-yellow-900', accent: 'bg-yellow-500', shadow: 'shadow-yellow-200' };
      default:
        return { bg: 'bg-gradient-to-br from-calm-100 to-grounding-100', text: 'text-calm-900', accent: 'bg-calm-500', shadow: 'shadow-calm-200' };
    }
  };

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
    const content = getCurrentContent();
    if (currentLineIndex < content.length - 1) {
      setCurrentLineIndex(currentLineIndex + 1);
    } else if (currentStep < 2) {
      setCurrentStep(currentStep + 1);
      setCurrentLineIndex(0);
    }
  };

  const prevLine = () => {
    if (currentLineIndex > 0) {
      setCurrentLineIndex(currentLineIndex - 1);
    } else if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
      const prevContent = selectedScene ?
        (currentStep === 1 ? selectedScene.visualization : selectedScene.sounds) : [];
      setCurrentLineIndex(prevContent.length - 1);
    }
  };

  // Keyboard navigation
  const handleKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
    if (e.key === 'ArrowRight' || e.key === 'Enter') {
      nextLine();
      e.preventDefault();
    } else if (e.key === 'ArrowLeft') {
      prevLine();
      e.preventDefault();
    }
  };

  const resetScene = () => {
    setSelectedScene(null)
    setCurrentStep(0)
    setCurrentLineIndex(0)
  }

  // Scene selection
  if (!selectedScene) {
    return (
      <Card className="max-w-md mx-auto" role="region" aria-label="Nature scene selection">
        <CardHeader className="text-center">
          <CardTitle>Calming Nature Scenes</CardTitle>
          <CardDescription>
            Choose a natural setting for guided visualization
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {NATURE_SCENES.map((scene) => {
            const Icon = scene.icon;
            const colors = getColorClasses(scene.color);
            return (
              <Card
                key={scene.id}
                className={`cursor-pointer transition-all duration-200 hover:scale-105 border-2 hover:border-gray-300 ${colors.shadow} shadow-md`}
                onClick={() => setSelectedScene(scene)}
                tabIndex={0}
                role="button"
                aria-label={`Select ${scene.name}`}
                onKeyDown={e => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    setSelectedScene(scene);
                  }
                }}
              >
                <CardContent className="p-4">
                  <div className="flex items-start space-x-3">
                    <motion.div
                      className={`flex-shrink-0 w-12 h-12 rounded-lg ${colors.bg} flex items-center justify-center shadow-lg shimmer-glow`}
                      animate={prefersReducedMotion ? undefined : { y: [0, -2, 0] }}
                      transition={prefersReducedMotion ? undefined : { type: 'spring', stiffness: 80, damping: 16, mass: 0.7, repeat: Infinity, repeatType: 'loop', duration: 4 }}
                    >
                      <Icon size={28} className={colors.text} />
                    </motion.div>
                    <div>
                      <h3 className="font-semibold text-gray-900 mb-1">{scene.name}</h3>
                      <p className="text-sm text-gray-700">{scene.description}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </CardContent>
      </Card>
    );
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
    <Card className="max-w-md mx-auto shadow-xl" role="region" aria-label="Nature scene visualization">
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
        <div className="w-full bg-gray-200 rounded-full h-2" aria-label="Progress bar" role="progressbar" aria-valuenow={currentLineNumber} aria-valuemax={totalLines} aria-valuemin={1}>
          <div
            className={`${colors.accent} h-2 rounded-full transition-all duration-500`}
            style={{ width: `${(currentLineNumber / totalLines) * 100}%` }}
          />
        </div>

        {/* Step indicator */}
        <div className="flex justify-center space-x-4" aria-label="Visualization steps">
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

<<<<<<< HEAD
        {/* Current content with animated transitions and ambient animations */}
        <div
          className={`${colors.bg} rounded-xl p-8 text-center min-h-[120px] flex items-center justify-center overflow-hidden shadow-lg border border-gray-100 relative`}
          tabIndex={0}
          ref={contentRef}
          onKeyDown={handleKeyDown}
          aria-live="polite"
          aria-label={getStepTitle()}
          role="group"
        >
          {/* Forest: Falling leaves */}
          {selectedScene.id === 'forest' && (
            <>
              {[...Array(6)].map((_, i) => (
                <motion.div
                  key={`leaf-${i}`}
                  className="absolute text-2xl"
                  style={{
                    left: `${10 + i * 15}%`,
                    top: -20,
                  }}
                  animate={{
                    y: [0, 200],
                    x: [0, Math.sin(i) * 20],
                    rotate: [0, 360],
                    opacity: [0, 1, 1, 0],
                  }}
                  transition={{
                    duration: 8 + i * 2,
                    repeat: Infinity,
                    delay: i * 1.5,
                    ease: 'easeInOut',
                  }}
                >
                  🍃
                </motion.div>
              ))}
            </>
          )}

          {/* Ocean: Animated waves */}
          {selectedScene.id === 'ocean' && (
            <>
              {[...Array(3)].map((_, i) => (
                <motion.div
                  key={`wave-${i}`}
                  className="absolute bottom-0 left-0 right-0 h-8 bg-gradient-to-t from-blue-300/20 to-transparent"
                  style={{ bottom: i * 8 }}
                  animate={{
                    scaleX: [1, 1.1, 1],
                    opacity: [0.3, 0.5, 0.3],
                  }}
                  transition={{
                    duration: 4,
                    repeat: Infinity,
                    delay: i * 0.8,
                    ease: 'easeInOut',
                  }}
                />
              ))}
            </>
          )}

          {/* Mountain: Drifting clouds */}
          {selectedScene.id === 'mountain' && (
            <>
              {[...Array(4)].map((_, i) => (
                <motion.div
                  key={`cloud-${i}`}
                  className="absolute text-3xl opacity-40"
                  style={{
                    top: `${10 + i * 20}%`,
                    left: -100,
                  }}
                  animate={{
                    x: [0, 500],
                  }}
                  transition={{
                    duration: 20 + i * 5,
                    repeat: Infinity,
                    delay: i * 3,
                    ease: 'linear',
                  }}
                >
                  ☁️
                </motion.div>
              ))}
            </>
          )}

          {/* Meadow: Swaying grass and butterflies */}
          {selectedScene.id === 'meadow' && (
            <>
              {[...Array(5)].map((_, i) => (
                <motion.div
                  key={`flower-${i}`}
                  className="absolute text-xl"
                  style={{
                    left: `${15 + i * 18}%`,
                    bottom: 10,
                  }}
                  animate={{
                    rotate: [-5, 5, -5],
                  }}
                  transition={{
                    duration: 2 + i * 0.5,
                    repeat: Infinity,
                    ease: 'easeInOut',
                  }}
                >
                  {i % 3 === 0 ? '🌼' : i % 3 === 1 ? '🌸' : '🌺'}
                </motion.div>
              ))}
              {[...Array(2)].map((_, i) => (
                <motion.div
                  key={`butterfly-${i}`}
                  className="absolute text-lg"
                  style={{
                    left: `${20 + i * 40}%`,
                    top: `${30 + i * 20}%`,
                  }}
                  animate={{
                    x: [0, 30, 0, -30, 0],
                    y: [0, -20, 0, -10, 0],
                  }}
                  transition={{
                    duration: 8,
                    repeat: Infinity,
                    delay: i * 3,
                    ease: 'easeInOut',
                  }}
                >
                  🦋
                </motion.div>
              ))}
            </>
          )}

          <AnimatePresence mode="wait">
            <motion.p
              key={`${currentStep}-${currentLineIndex}`}
              className={`text-xl font-medium ${colors.text} leading-relaxed drop-shadow-sm relative z-10`}
              initial={prefersReducedMotion ? undefined : { opacity: 0, y: 8 }}
              animate={prefersReducedMotion ? undefined : { opacity: 1, y: 0 }}
              exit={prefersReducedMotion ? undefined : { opacity: 0, y: -8 }}
              transition={prefersReducedMotion ? undefined : { type: 'spring', stiffness: 90, damping: 18, mass: 0.7 }}
            >
              {currentContent[currentLineIndex]}
            </motion.p>
          </AnimatePresence>
        </div>
            <>
              {[...Array(6)].map((_, i) => (
                <motion.div
                  key={`leaf-${i}`}
                  className="absolute text-2xl"
                  style={{
                    left: `${10 + i * 15}%`,
                    top: -20,
                  }}
                  animate={{
                    y: [0, 200],
                    x: [0, Math.sin(i) * 20],
                    rotate: [0, 360],
                    opacity: [0, 1, 1, 0],
                  }}
                  transition={{
                    duration: 8 + i * 2,
                    repeat: Infinity,
                    delay: i * 1.5,
                    ease: 'easeInOut',
                  }}
                >
                  🍃
                </motion.div>
              ))}
            </>
          )}

          {/* Ocean: Animated waves */}
          {selectedScene.id === 'ocean' && (
            <>
              {[...Array(3)].map((_, i) => (
                <motion.div
                  key={`wave-${i}`}
                  className="absolute bottom-0 left-0 right-0 h-8 bg-gradient-to-t from-blue-300/20 to-transparent"
                  style={{ bottom: i * 8 }}
                  animate={{
                    scaleX: [1, 1.1, 1],
                    opacity: [0.3, 0.5, 0.3],
                  }}
                  transition={{
                    duration: 4,
                    repeat: Infinity,
                    delay: i * 0.8,
                    ease: 'easeInOut',
                  }}
                />
              ))}
            </>
          )}

          {/* Mountain: Drifting clouds */}
          {selectedScene.id === 'mountain' && (
            <>
              {[...Array(4)].map((_, i) => (
                <motion.div
                  key={`cloud-${i}`}
                  className="absolute text-3xl opacity-40"
                  style={{
                    top: `${10 + i * 20}%`,
                    left: -100,
                  }}
                  animate={{
                    x: [0, 500],
                  }}
                  transition={{
                    duration: 20 + i * 5,
                    repeat: Infinity,
                    delay: i * 3,
                    ease: 'linear',
                  }}
                >
                  ☁️
                </motion.div>
              ))}
            </>
          )}

          {/* Meadow: Swaying grass and butterflies */}
          {selectedScene.id === 'meadow' && (
            <>
              {[...Array(5)].map((_, i) => (
                <motion.div
                  key={`flower-${i}`}
                  className="absolute text-xl"
                  style={{
                    left: `${15 + i * 18}%`,
                    bottom: 10,
                  }}
                  animate={{
                    rotate: [-5, 5, -5],
                  }}
                  transition={{
                    duration: 2 + i * 0.5,
                    repeat: Infinity,
                    ease: 'easeInOut',
                  }}
                >
                  {i % 3 === 0 ? '🌼' : i % 3 === 1 ? '🌸' : '🌺'}
                </motion.div>
              ))}
              {[...Array(2)].map((_, i) => (
                <motion.div
                  key={`butterfly-${i}`}
                  className="absolute text-lg"
                  style={{
                    left: `${20 + i * 40}%`,
                    top: `${30 + i * 20}%`,
                  }}
                  animate={{
                    x: [0, 30, 0, -30, 0],
                    y: [0, -20, 0, -10, 0],
                  }}
                  transition={{
                    duration: 8,
                    repeat: Infinity,
                    delay: i * 3,
                    ease: 'easeInOut',
                  }}
                >
                  🦋
                </motion.div>
              ))}
            </>
          )}

          <AnimatePresence mode="wait">
            <motion.p
              key={`${currentStep}-${currentLineIndex}`}
              className={`text-lg ${colors.text} leading-relaxed relative z-10`}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.35, ease: 'easeOut' }}
>>>>>>> 7568bd483db1085f884919e35c36244ef4a8a8ac
            >
              {currentContent[currentLineIndex]}
            </motion.p>
          </AnimatePresence>
        </div>

        {/* Instructions */}
        <div className="bg-gradient-to-r from-gray-50 to-green-50 p-4 rounded-lg text-center border border-gray-100" aria-label="Instructions">
          <p className="text-base text-gray-700">
            {currentStep === 0 && "Close your eyes and picture this scene in detail."}
            {currentStep === 1 && "Listen carefully. What sounds would you hear?"}
            {currentStep === 2 && "Feel the sensations. How does your body respond?"}
          </p>
        </div>

        {/* Controls */}
        <div className="flex space-x-3" role="group" aria-label="Navigation controls">
          <Button
            onClick={prevLine}
            variant="outline"
            size="lg"
            className="flex-1"
            disabled={currentStep === 0 && currentLineIndex === 0}
            aria-label="Previous step"
          >
            Previous
          </Button>
          {!isComplete ? (
            <Button
              onClick={nextLine}
              variant={selectedScene.color as any}
              size="lg"
              className="flex-1"
              aria-label="Next step"
            >
              Next
            </Button>
          ) : (
            <Button
              onClick={resetScene}
              variant={selectedScene.color as any}
              size="lg"
              className="flex-1"
              aria-label="Complete visualization"
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
            aria-label="Choose different scene"
          >
            <RefreshCw size={16} />
            <span>Choose Different Scene</span>
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
