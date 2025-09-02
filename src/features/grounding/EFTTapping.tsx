"use client"

import { useState } from 'react'
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { Hand } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import ShareInline from '@/components/ShareInline'

const POINTS = [
  { id: 'karate', name: 'Karate Chop (side of hand)', tip: 'Tap with four fingers of the opposite hand.' },
  { id: 'eyebrow', name: 'Eyebrow (start)', tip: 'Inner brow, near bridge of nose.' },
  { id: 'sideEye', name: 'Side of Eye', tip: 'On the bone at the outer corner.' },
  { id: 'underEye', name: 'Under Eye', tip: 'On the bone below the pupil.' },
  { id: 'underNose', name: 'Under Nose', tip: 'Between upper lip and nose.' },
  { id: 'chin', name: 'Chin', tip: 'Midway between lower lip and chin.' },
  { id: 'collarbone', name: 'Collarbone', tip: 'Below the hard U-shaped bone.' },
  { id: 'underArm', name: 'Under Arm', tip: 'About 4 inches below armpit.' },
  { id: 'topHead', name: 'Top of Head', tip: 'Center of the crown.' },
]

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
        {/* Stylized silhouette with pulsing highlight */}
        <div className="relative h-40">
          <div className="absolute inset-x-0 top-4 mx-auto w-24 h-24 rounded-full bg-gradient-to-br from-grounding-100 to-grounding-200 opacity-70" />
          <div className="absolute inset-x-0 top-28 mx-auto w-32 h-20 rounded-t-[32px] bg-gradient-to-br from-grounding-100 to-grounding-200 opacity-70" />
          <motion.div
            key={current.id}
            className="absolute left-1/2 -translate-x-1/2 top-10 w-6 h-6 rounded-full bg-grounding-500 shadow"
            initial={{ scale: 0.9, opacity: 0.5 }}
            animate={{ scale: [1, 1.15, 1], opacity: [0.6, 1, 0.6] }}
            transition={{ duration: 1.2, repeat: Infinity }}
          />
        </div>

        <div className="text-center">
          <div className="text-lg font-semibold text-grounding-800 mb-1">
            <AnimatePresence mode="wait">
              <motion.span key={current.id} initial={{opacity:0,y:6}} animate={{opacity:1,y:0}} exit={{opacity:0,y:-6}} transition={{duration:0.25}}>
                {index + 1}. {current.name}
              </motion.span>
            </AnimatePresence>
          </div>
          <p className="text-sm text-gray-600">{current.tip}</p>
        </div>

        <div className="bg-grounding-50 border border-grounding-100 rounded-md p-3 text-sm text-grounding-800">
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
      <div className="px-6 pb-6 space-y-3">
        <div className="text-xs text-gray-600 bg-grounding-50 border border-grounding-100 p-3 rounded-md">
          About: Emotional Freedom Technique (EFT) combines gentle tapping and focused phrases; some studies show reductions in anxiety for certain groups.
          <br/>
          Evidence: Search scholarly databases for “EFT tapping randomized trial anxiety”.
        </div>
        <ShareInline title="EFT Tapping" text="Follow the EFT tapping sequence on CalmMyself" />
      </div>
    </Card>
  )
}
