"use client"

import { useState } from 'react'
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { Hand } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import ShareInline from '@/components/ShareInline'

// Coordinates roughly mapping to a 200x300 SVG viewbox
const POINTS = [
  { id: 'karate', name: 'Karate Chop', tip: 'Side of hand', x: 160, y: 240 },
  { id: 'eyebrow', name: 'Eyebrow', tip: 'Inner brow', x: 90, y: 55 },
  { id: 'sideEye', name: 'Side of Eye', tip: 'Outer corner of eye', x: 130, y: 70 },
  { id: 'underEye', name: 'Under Eye', tip: 'Bone below pupil', x: 90, y: 85 },
  { id: 'underNose', name: 'Under Nose', tip: 'Above lip', x: 100, y: 105 },
  { id: 'chin', name: 'Chin', tip: 'Below lower lip', x: 100, y: 125 },
  { id: 'collarbone', name: 'Collarbone', tip: 'Below the U-shaped bone', x: 100, y: 160 },
  { id: 'underArm', name: 'Under Arm', tip: '4 inches below armpit', x: 50, y: 190 },
  { id: 'topHead', name: 'Top of Head', tip: 'Center of crown', x: 100, y: 20 },
]

const InteractiveBodyMap = ({ activePointIndex }: { activePointIndex: number }) => {
  const activePoint = POINTS[activePointIndex]

  return (
    <div className="relative w-full h-48 sm:h-64 flex items-center justify-center mb-4 px-2">
      <svg viewBox="0 0 200 300" className="h-full w-auto max-w-full drop-shadow-sm">
        {/* Simplified Body Outline */}
        <path
          d="M100,20 C130,20 150,100 150,100 L180,280 M100,20 C70,20 50,100 50,100 L20,280 M75,140 L75,300 M125,140 L125,300"
          fill="none"
          stroke="#cbd5e1"
          strokeWidth="2"
          strokeLinecap="round"
        />
        {/* Head */}
        <ellipse cx="100" cy="60" rx="40" ry="50" fill="#f1f5f9" stroke="#cbd5e1" strokeWidth="2" />
        {/* Shoulders/Torso */}
        <path
          d="M60,110 Q20,130 20,200 L180,200 Q180,130 140,110"
          fill="#f8fafc"
          stroke="#cbd5e1"
          strokeWidth="2"
        />
        
        {/* Active Pulse */}
        <motion.circle
          cx={activePoint.x}
          cy={activePoint.y}
          r="6"
          fill="#10b981"
          initial={{ scale: 0, opacity: 0 }}
          animate={{ 
            scale: [1, 1.5, 1], 
            opacity: [0.7, 0, 0.7] 
          }}
          transition={{ 
            duration: 1.5, 
            repeat: Infinity, 
            ease: "easeInOut" 
          }}
        />
        
        {/* Active Point Solid */}
        <circle cx={activePoint.x} cy={activePoint.y} r="4" fill="#059669" className="shadow-sm" />
      </svg>
    </div>
  )
}

export default function EFTTapping() {
  const [index, setIndex] = useState(0)

  const next = () => setIndex((i) => Math.min(i + 1, POINTS.length - 1))
  const prev = () => setIndex((i) => Math.max(i - 1, 0))
  const reset = () => setIndex(0)

  const current = POINTS[index]

  return (
    <Card className="max-w-md mx-auto">
      <CardHeader className="text-center">
        <div className="flex items-center justify-center gap-2 mb-2">
          <Hand className="w-5 h-5 text-grounding-600" />
          <CardTitle>EFT Tapping</CardTitle>
        </div>
        <CardDescription>Follow the sequence of gentle tapping points</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Interactive Map */}
        <InteractiveBodyMap activePointIndex={index} />

        <div className="text-center px-2">
          <div className="text-base sm:text-lg font-semibold text-grounding-800 dark:text-gray-100 mb-1">
            <AnimatePresence mode="wait">
              <motion.span key={current.id} initial={{opacity:0,y:6}} animate={{opacity:1,y:0}} exit={{opacity:0,y:-6}} transition={{duration:0.25}}>
                {index + 1}. {current.name}
              </motion.span>
            </AnimatePresence>
          </div>
          <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400">{current.tip}</p>
        </div>

        <div className="bg-gray-50 dark:bg-gray-800/50 border border-gray-200 dark:border-gray-700 rounded-xl p-3 text-sm text-grounding-800 dark:text-gray-100">
          Tap lightly ~7–10 times at each point while breathing slowly. You can repeat a calming phrase like “I am safe” or “I can handle this.”
        </div>

        <div className="flex gap-3">
          <Button onClick={prev} variant="outline" className="flex-1" disabled={index===0}>Previous</Button>
          <Button onClick={next} variant="grounding" className="flex-1" disabled={index===POINTS.length-1}>Next</Button>
        </div>
        <div className="text-center">
          <Button onClick={reset} variant="ghost" size="sm">Start Over</Button>
        </div>
      </CardContent>
      <div className="px-6 pb-6 pt-0"><div className="pt-4 mt-2 border-t border-gray-100 dark:border-gray-800 space-y-3">
        <div className="text-xs text-gray-600 dark:text-gray-400 bg-gray-50 dark:bg-gray-800/50 border border-gray-200 dark:border-gray-700 p-3 rounded-xl">
          About: Emotional Freedom Technique (EFT) combines gentle tapping and focused phrases; some studies show reductions in anxiety for certain groups.
          <br/>
          Evidence: Search scholarly databases for “EFT tapping randomized trial anxiety”.
        </div>
        <ShareInline title="EFT Tapping" text="Follow the EFT tapping sequence on CalmMyself" />
      </div></div>
    </Card>
  )
}
