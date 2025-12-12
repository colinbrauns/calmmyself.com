'use client'

import { useState, useRef, useEffect } from 'react'
import '@/components/ui/shimmer.css'
import { motion, AnimatePresence } from 'framer-motion'
import { Button } from '@/components/ui/Button'
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/Card'
import { MapPin, RefreshCw } from 'lucide-react'

const SAFE_PLACE_PROMPTS = [
  {
    category: "Setting the Scene",
    questions: [
      "Where is your safe place? Indoors or outdoors?",
      "What does the ground or floor feel like beneath you?",
      "What colors do you see around you?",
      "How is the lighting? Bright, dim, filtered?",
      "What's the temperature like? Warm, cool, just right?"
    ]
  },
  {
    category: "Using Your Senses",
    questions: [
      "What sounds can you hear in your safe place?",
      "Are there any pleasant scents or smells?",
      "What textures can you touch or feel?",
      "Is there anything to taste? Perhaps tea, fruit, or fresh air?",
      "What draws your eyes? What's beautiful to look at?"
    ]
  },
  {
    category: "Feeling Safe",
    questions: [
      "What makes this place feel safe to you?",
      "Are you alone or with others? Who might be there?",
      "What would you like to do in this place?",
      "How does your body feel when you're here?",
      "What emotions arise when you imagine being here?"
    ]
  },
  {
    category: "Deepening the Experience",
    questions: [
      "If this place could speak, what would it say to you?",
      "What gift might this place offer you?",
      "How can you carry the feeling of this place with you?",
      "What word or phrase captures the essence of this place?",
      "When might you return to this place in your mind?"
    ]
  }
]

export default function SafePlace() {
  const [currentCategoryIndex, setCurrentCategoryIndex] = useState(0)
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0)
  const [hasStarted, setHasStarted] = useState(false)
  const [responses, setResponses] = useState<string[]>([])
  const prefersReducedMotion = typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  // Focus management for accessibility
  const questionRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (questionRef.current) {
      questionRef.current.focus();
    }
  }, [currentQuestionIndex, currentCategoryIndex, hasStarted]);

  const currentCategory = SAFE_PLACE_PROMPTS[currentCategoryIndex]
  const currentQuestion = currentCategory.questions[currentQuestionIndex]
  const totalQuestions = SAFE_PLACE_PROMPTS.reduce((sum, category) => sum + category.questions.length, 0)
  const currentQuestionNumber = SAFE_PLACE_PROMPTS
    .slice(0, currentCategoryIndex)
    .reduce((sum, category) => sum + category.questions.length, 0) + currentQuestionIndex + 1

  const nextQuestion = () => {
    if (currentQuestionIndex < currentCategory.questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    } else if (currentCategoryIndex < SAFE_PLACE_PROMPTS.length - 1) {
      setCurrentCategoryIndex(currentCategoryIndex + 1);
      setCurrentQuestionIndex(0);
    }
  };

  const prevQuestion = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(currentQuestionIndex - 1);
    } else if (currentCategoryIndex > 0) {
      const prevCategoryIndex = currentCategoryIndex - 1;
      setCurrentCategoryIndex(prevCategoryIndex);
      setCurrentQuestionIndex(SAFE_PLACE_PROMPTS[prevCategoryIndex].questions.length - 1);
    }
  };

  // Keyboard navigation
  const handleKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
    if (e.key === 'ArrowRight' || e.key === 'Enter') {
      nextQuestion();
      e.preventDefault();
    } else if (e.key === 'ArrowLeft') {
      prevQuestion();
      e.preventDefault();
    }
  };

  const resetVisualization = () => {
    setCurrentCategoryIndex(0)
    setCurrentQuestionIndex(0)
    setHasStarted(false)
    setResponses([])
  }

  const isLastQuestion = currentCategoryIndex === SAFE_PLACE_PROMPTS.length - 1 && 
                       currentQuestionIndex === currentCategory.questions.length - 1
  const isFirstQuestion = currentCategoryIndex === 0 && currentQuestionIndex === 0

  if (!hasStarted) {
    return (
      <Card className="max-w-md mx-auto shadow-xl" role="region" aria-label="Safe place visualization intro">
        <CardHeader className="text-center">
          <CardTitle>Safe Place Visualization</CardTitle>
          <CardDescription>
            Create a mental sanctuary you can visit anytime
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-8">
          <div className="bg-gradient-to-br from-green-50 to-blue-50 p-8 rounded-xl text-center shadow-lg border border-green-100">
            <motion.div
              className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4 shadow shimmer-glow"
              animate={prefersReducedMotion ? undefined : { y: [0, -2, 0] }}
              transition={prefersReducedMotion ? undefined : { type: 'spring', stiffness: 80, damping: 16, mass: 0.7, repeat: Infinity, repeatType: 'loop', duration: 4 }}
            >
              <MapPin className="w-8 h-8 text-green-700" />
            </motion.div>
            <p className="text-lg text-gray-800 leading-relaxed mb-4 font-medium">
              This guided visualization will help you create a detailed mental image
              of a safe, peaceful place that you can return to whenever you need comfort.
            </p>
          </div>
          <div className="bg-gradient-to-r from-blue-50 to-green-50 p-5 rounded-lg border border-blue-100">
            <p className="text-base text-blue-900 font-semibold mb-2">What you'll do:</p>
            <ul className="text-base text-blue-800 space-y-1">
              <li>• Answer guided questions about your safe place</li>
              <li>• Use all your senses to build the visualization</li>
              <li>• Create a detailed mental sanctuary</li>
              <li>• Learn to access it quickly when needed</li>
            </ul>
          </div>
          <div className="text-center">
            <Button
              onClick={() => setHasStarted(true)}
              variant="grounding"
              size="lg"
              className="w-full"
              aria-label="Begin visualization"
            >
              Begin Visualization
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="max-w-md mx-auto shadow-xl" role="region" aria-label="Safe place visualization">
      <CardHeader className="text-center">
        <CardTitle>Safe Place Visualization</CardTitle>
        <CardDescription>
          Question {currentQuestionNumber} of {totalQuestions}
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-8">
        {/* Progress */}
        <div className="w-full bg-gray-200 rounded-full h-2" aria-label="Progress bar" role="progressbar" aria-valuenow={currentQuestionNumber} aria-valuemax={totalQuestions} aria-valuemin={1}>
          <div
            className="bg-green-500 h-2 rounded-full transition-all duration-500"
            style={{ width: `${(currentQuestionNumber / totalQuestions) * 100}%` }}
          />
        </div>

        {/* Category */}
        <div className="text-center">
          <div className="inline-block px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm font-medium" aria-label={currentCategory.category}>
            {currentCategory.category}
          </div>
        </div>

        {/* Question with smooth transition */}
        <div
          className="bg-gradient-to-br from-green-50 to-blue-100 rounded-xl p-8 text-center overflow-hidden min-h-[88px] flex items-center justify-center shadow-lg border border-blue-100"
          tabIndex={0}
          ref={questionRef}
          onKeyDown={handleKeyDown}
          aria-live="polite"
          aria-label={currentCategory.category}
          role="group"
        >
          <AnimatePresence mode="wait">
            <motion.p
              key={`${currentCategoryIndex}-${currentQuestionIndex}`}
              className="text-xl text-gray-900 leading-relaxed font-semibold drop-shadow-sm"
              initial={prefersReducedMotion ? undefined : { opacity: 0, y: 8 }}
              animate={prefersReducedMotion ? undefined : { opacity: 1, y: 0 }}
              exit={prefersReducedMotion ? undefined : { opacity: 0, y: -8 }}
              transition={prefersReducedMotion ? undefined : { type: 'spring', stiffness: 90, damping: 18, mass: 0.7 }}
            >
              {currentQuestion}
            </motion.p>
          </AnimatePresence>
        </div>

        {/* Reflection Area */}
        <div className="space-y-3">
          <label className="text-base font-semibold text-gray-800" htmlFor="safeplace-reflect">
            Take time to visualize and reflect:
          </label>
          <textarea
            id="safeplace-reflect"
            className="w-full p-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 resize-none text-gray-900 bg-white shadow"
            rows={4}
            placeholder="Close your eyes and imagine... What do you see, hear, feel, smell, or taste?"
            aria-label="Reflection area"
          />
        </div>

        {/* Instructions */}
        <div className="bg-gradient-to-r from-yellow-50 to-green-50 border border-yellow-200 rounded-lg p-4" aria-label="Instructions">
          <p className="text-base text-yellow-900 font-medium">
            💡 <strong>Tip:</strong> Take your time. Close your eyes and really
            try to experience this place with all your senses before moving on.
          </p>
        </div>

        {/* Controls */}
        <div className="flex space-x-3" role="group" aria-label="Navigation controls">
          <Button
            onClick={prevQuestion}
            variant="outline"
            size="lg"
            className="flex-1"
            disabled={isFirstQuestion}
            aria-label="Previous question"
          >
            Previous
          </Button>
          {!isLastQuestion ? (
            <Button
              onClick={nextQuestion}
              variant="grounding"
              size="lg"
              className="flex-1"
              aria-label="Next question"
            >
              Next
            </Button>
          ) : (
            <Button
              onClick={resetVisualization}
              variant="grounding"
              size="lg"
              className="flex-1"
              aria-label="Complete visualization"
            >
              Complete
            </Button>
          )}
        </div>

        {/* Reset */}
        <div className="text-center">
          <Button
            onClick={resetVisualization}
            variant="ghost"
            size="sm"
            className="flex items-center space-x-2"
            aria-label="Start over"
          >
            <RefreshCw size={16} />
            <span>Start Over</span>
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
