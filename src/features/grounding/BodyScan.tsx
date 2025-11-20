'use client'

import { useState, useCallback, useEffect } from 'react'
import { Button } from '@/components/ui/Button'
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/Card'
import { Play, Pause, RotateCcw } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'

interface BodyPart {
  id: string
  name: string
  instruction: string
  duration: number
  // SVG path d attribute or similar coordinate data could go here
  path?: string 
}

const BODY_PARTS: BodyPart[] = [
  {
    id: 'head',
    name: 'Top of Head',
    instruction: 'Notice any sensations at the crown of your head. Warmth, coolness, tingling, or nothing at all.',
    duration: 15000
  },
  {
    id: 'face',
    name: 'Forehead & Eyes',
    instruction: 'Feel your forehead and the area around your eyes. Are they relaxed or tense?',
    duration: 15000
  },
  {
    id: 'jaw',
    name: 'Jaw & Mouth',
    instruction: 'Notice your jaw and mouth. Let them soften if they feel tight.',
    duration: 15000
  },
  {
    id: 'neck',
    name: 'Neck & Throat',
    instruction: 'Scan your neck and throat area. Breathe into any tension you find.',
    duration: 15000
  },
  {
    id: 'shoulders',
    name: 'Shoulders',
    instruction: 'Feel your shoulders. Let them drop and release any holding.',
    duration: 15000
  },
  {
    id: 'arms',
    name: 'Arms & Hands',
    instruction: 'Scan down your arms to your fingertips. Notice temperature, tingling, or heaviness.',
    duration: 20000
  },
  {
    id: 'chest',
    name: 'Chest & Heart',
    instruction: 'Feel your chest rise and fall. Notice your heartbeat and any emotions present.',
    duration: 20000
  },
  {
    id: 'stomach',
    name: 'Stomach & Abdomen',
    instruction: 'Notice your belly area. Let it soften and breathe naturally.',
    duration: 15000
  },
  {
    id: 'back',
    name: 'Lower Back',
    instruction: 'Scan your lower back. Send breath to any areas of tension or discomfort.',
    duration: 15000
  },
  {
    id: 'hips',
    name: 'Hips & Pelvis',
    instruction: 'Notice your hip area and pelvis. Let them settle and relax.',
    duration: 15000
  },
  {
    id: 'thighs',
    name: 'Thighs',
    instruction: 'Feel the front and back of your thighs. Notice their weight and any sensations.',
    duration: 15000
  },
  {
    id: 'knees',
    name: 'Knees & Calves',
    instruction: 'Scan your knees and calf muscles. Let them be heavy and relaxed.',
    duration: 15000
  },
  {
    id: 'feet',
    name: 'Feet & Toes',
    instruction: 'Feel your feet and toes. Notice their connection to the ground beneath you.',
    duration: 15000
  },
  {
    id: 'whole',
    name: 'Whole Body',
    instruction: 'Take a moment to feel your entire body as one connected whole. Rest in this awareness.',
    duration: 20000
  }
]

const AuraVisualizer = ({ currentPartIndex, isActive }: { currentPartIndex: number; isActive: boolean }) => {
  // Determine approximate vertical position of the "scan line" / focus area
  // This is a simplified mapping. 0% is top, 100% is bottom.
  const getFocusTop = (index: number) => {
    if (index === 13) return 50 // Center for whole body
    return Math.min((index / 12) * 90 + 5, 95)
  }
  
  const focusTop = getFocusTop(currentPartIndex)
  const isWholeBody = currentPartIndex === 13

  return (
    <div className="relative h-64 w-full flex justify-center items-center overflow-hidden rounded-xl bg-gradient-to-b from-slate-900 to-slate-800 mb-6">
      {/* Silhouette */}
      <svg viewBox="0 0 200 400" className="h-5/6 w-auto opacity-20">
        <path d="M100,20 C130,20 160,60 160,120 L180,300 L140,400 L100,350 L60,400 L20,300 L40,120 C40,60 70,20 100,20" fill="white" />
      </svg>
      
      {/* Animated Aura / Glow */}
      <motion.div
        className="absolute w-full pointer-events-none"
        animate={{
          top: isWholeBody ? '0%' : `${focusTop}%`,
          height: isWholeBody ? '100%' : '20%',
          opacity: isActive ? 0.6 : 0.2
        }}
        transition={{ duration: 1.5, ease: "easeInOut" }}
        style={{ 
            transform: 'translateY(-50%)', 
            background: 'radial-gradient(circle, rgba(99,102,241,0.8) 0%, rgba(99,102,241,0) 70%)',
            filter: 'blur(20px)'
        }}
      />

      {/* Scanning Line */}
      {!isWholeBody && isActive && (
          <motion.div 
            className="absolute w-full h-0.5 bg-indigo-400 shadow-[0_0_15px_rgba(129,140,248,1)]"
            animate={{ top: `${focusTop}%` }}
            transition={{ duration: 1.5, ease: "easeInOut" }}
          />
      )}

      {/* Particles (Optional decorative touch) */}
       <div className="absolute inset-0 w-full h-full">
         {isActive && (
           <motion.div
             className="absolute w-2 h-2 bg-indigo-300 rounded-full opacity-50"
             animate={{
               x: [0, 100, -50, 20],
               y: [0, -20, 40, -10],
               opacity: [0, 1, 0]
             }}
             transition={{ repeat: Infinity, duration: 3 }}
             style={{ top: `${focusTop}%`, left: '50%' }}
           />
         )}
       </div>
    </div>
  )
}

export default function BodyScan() {
  const [currentPart, setCurrentPart] = useState(0)
  const [timeRemaining, setTimeRemaining] = useState(BODY_PARTS[0].duration)
  const [isActive, setIsActive] = useState(false)
  const [isComplete, setIsComplete] = useState(false)
  
  const currentBodyPart = BODY_PARTS[currentPart]

  // ... logic remains same ...
  const nextPart = useCallback(() => {
    if (currentPart < BODY_PARTS.length - 1) {
      const nextIndex = currentPart + 1
      setCurrentPart(nextIndex)
      setTimeRemaining(BODY_PARTS[nextIndex].duration)
    } else {
      setIsComplete(true)
      setIsActive(false)
    }
  }, [currentPart])

  const reset = useCallback(() => {
    setCurrentPart(0)
    setTimeRemaining(BODY_PARTS[0].duration)
    setIsActive(false)
    setIsComplete(false)
  }, [])

  useEffect(() => {
    let interval: NodeJS.Timeout | null = null
    if (isActive && !isComplete) {
      interval = setInterval(() => {
        setTimeRemaining((time) => {
          if (time <= 100) {
            nextPart()
            return BODY_PARTS[Math.min(currentPart + 1, BODY_PARTS.length - 1)].duration
          }
          return time - 100
        })
      }, 100)
    }
    return () => { if (interval) clearInterval(interval) }
  }, [isActive, isComplete, nextPart, currentPart])

  const progress = currentPart / BODY_PARTS.length * 100
  const currentProgress = ((currentBodyPart.duration - timeRemaining) / currentBodyPart.duration) * 100

  if (isComplete) {
    return (
      <Card className="max-w-md mx-auto">
        <CardContent className="text-center py-12">
          <motion.div 
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            className="w-20 h-20 bg-indigo-100 rounded-full flex items-center justify-center mx-auto mb-6"
          >
            <span className="text-4xl">✨</span>
          </motion.div>
          <h2 className="text-2xl font-semibold text-indigo-900 mb-3">
            Scan Complete
          </h2>
          <p className="text-gray-600 mb-8 leading-relaxed">
            Take a moment to rest in the awareness of your whole body. 
            Notice if you feel any different than when you started.
          </p>
          <Button onClick={reset} variant="grounding" size="lg">
            Scan Again
          </Button>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="max-w-md mx-auto">
      <CardHeader className="text-center">
        <CardTitle>Body Scan Meditation</CardTitle>
        <CardDescription>
          Mindfully scan through your body from head to toe
        </CardDescription>
      </CardHeader>
      
      <CardContent className="space-y-6">
        <AuraVisualizer currentPartIndex={currentPart} isActive={isActive} />

        {/* Progress */}
        <div className="flex items-center justify-between text-xs uppercase tracking-wider font-medium text-gray-500">
          <span>{currentBodyPart.name}</span>
          <span>{currentPart + 1} / {BODY_PARTS.length}</span>
        </div>

        {/* Progress Bar */}
        <div className="space-y-1">
          <div className="w-full bg-gray-100 rounded-full h-1.5 overflow-hidden">
            <motion.div 
              className="bg-indigo-200 h-full"
              animate={{ width: `${progress}%` }}
            />
          </div>
           {/* Micro-progress for current step */}
           <div className="w-full h-0.5 bg-transparent overflow-hidden flex justify-center">
             <motion.div 
               className="bg-indigo-500 h-full" 
               style={{ width: '100%' }}
               initial={{ scaleX: 0 }}
               animate={{ scaleX: currentProgress / 100 }}
               transition={{ ease: 'linear', duration: 0.1 }}
             />
           </div>
        </div>

        {/* Instruction Text */}
        <div className="text-center py-2 min-h-[100px] flex flex-col justify-center items-center">
           <AnimatePresence mode="wait">
             <motion.div
                key={currentBodyPart.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="space-y-2"
             >
                <h3 className="text-xl font-semibold text-gray-900">
                  {currentBodyPart.name}
                </h3>
                <p className="text-gray-600 leading-relaxed max-w-xs mx-auto">
                  {currentBodyPart.instruction}
                </p>
             </motion.div>
           </AnimatePresence>
        </div>

        {/* Controls */}
        <div className="flex justify-center gap-4">
          <Button
            onClick={() => setIsActive(!isActive)}
            variant="grounding"
            size="lg"
            className="w-32 gap-2"
          >
            {isActive ? <Pause size={18} /> : <Play size={18} />}
            <span>{isActive ? 'Pause' : 'Start'}</span>
          </Button>
          
          <Button
            onClick={reset}
            variant="outline"
            size="icon"
            aria-label="Reset body scan"
          >
            <RotateCcw size={18} />
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}
