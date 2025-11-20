"use client"

import { useState } from 'react'
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import ShareInline from '@/components/ShareInline'
import { motion, AnimatePresence } from 'framer-motion'
import { Compass, Heart, Shield, BadgeCheck, Coffee } from 'lucide-react'

type ValueId = 'care' | 'courage' | 'honesty' | 'rest'

interface ValueOption {
  id: ValueId
  label: string
  examples: string[]
  angle: number
  icon: any
  color: string
}

const VALUES: ValueOption[] = [
  {
    id: 'care',
    label: 'Care',
    examples: ['Send a kind message', 'Check in with yourself', 'Do one small nurturing thing'],
    angle: 0,
    icon: Heart,
    color: 'text-rose-500'
  },
  {
    id: 'courage',
    label: 'Courage',
    examples: ['Say something honest', 'Take a tiny step toward a scary task', 'Ask for help'],
    angle: 90,
    icon: Shield,
    color: 'text-orange-500'
  },
  {
    id: 'honesty',
    label: 'Honesty',
    examples: ['Notice and name what you really feel', 'Admit a limit', 'Clarify expectations'],
    angle: 180,
    icon: BadgeCheck,
    color: 'text-blue-500'
  },
  {
    id: 'rest',
    label: 'Rest',
    examples: ['Pause for 5 minutes', 'Step away from a screen', 'Go to bed a little earlier'],
    angle: 270,
    icon: Coffee,
    color: 'text-indigo-500'
  },
]

export default function ValuesCompass() {
  const [selected, setSelected] = useState<ValueId>('care')
  const current = VALUES.find((v) => v.id === selected) ?? VALUES[0]

  // Helper to normalize rotation direction
  const rotation = -current.angle

  return (
    <Card className="max-w-md mx-auto">
      <CardHeader className="text-center">
        <CardTitle>Values Compass</CardTitle>
        <CardDescription>Pick a direction and a tiny next step</CardDescription>
      </CardHeader>

      <CardContent className="space-y-8">
        {/* Compass Visual */}
        <div className="relative h-64 w-full flex items-center justify-center overflow-hidden">
          {/* Compass Rose */}
          <motion.div
            className="relative w-48 h-48 rounded-full border-4 border-calm-200 bg-white shadow-inner flex items-center justify-center"
            animate={{ rotate: rotation }}
            transition={{ type: 'spring', stiffness: 60, damping: 20 }}
          >
            {/* Compass Markings */}
            <div className="absolute inset-0 rounded-full border border-gray-100" />
            <div className="absolute top-2 left-1/2 -translate-x-1/2 w-1 h-3 bg-calm-300" />
            <div className="absolute bottom-2 left-1/2 -translate-x-1/2 w-1 h-3 bg-calm-300" />
            <div className="absolute left-2 top-1/2 -translate-y-1/2 w-3 h-1 bg-calm-300" />
            <div className="absolute right-2 top-1/2 -translate-y-1/2 w-3 h-1 bg-calm-300" />

            {/* Icons placed at cardinal directions */}
            {VALUES.map((v) => {
              const Icon = v.icon
              return (
                <div
                  key={v.id}
                  className="absolute w-8 h-8 flex items-center justify-center"
                  style={{
                    top: '50%',
                    left: '50%',
                    transform: `translate(-50%, -50%) rotate(${v.angle}deg) translate(0, -70px) rotate(${-v.angle}deg)`
                  }}
                >
                  <Icon className={`w-5 h-5 ${v.color}`} />
                </div>
              )
            })}
          </motion.div>

          {/* Fixed Needle Overlay */}
          <div className="absolute pointer-events-none">
            <div className="w-4 h-4 bg-calm-600 rounded-full shadow-md z-20 relative border-2 border-white" />
            <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-full w-0 h-0 border-l-[8px] border-l-transparent border-r-[8px] border-r-transparent border-b-[40px] border-b-calm-600 pb-1" />
          </div>

          {/* Direction Labels (Clickable) */}
          <div className="absolute inset-0 pointer-events-none">
             {VALUES.map((v) => (
                <button
                  key={v.id}
                  onClick={() => setSelected(v.id)}
                  className={`absolute p-2 rounded-full pointer-events-auto transition-transform hover:scale-110 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-calm-400 ${
                     selected === v.id ? 'bg-white shadow-md scale-110' : ''
                  }`}
                  style={{
                     top: '50%',
                     left: '50%',
                     // Fixed positions around the circle visually
                     transform: `translate(-50%, -50%) rotate(${v.angle}deg) translate(0, -100px) rotate(${-v.angle}deg)`
                  }}
                  aria-label={`Select ${v.label}`}
                >
                   <span className={`text-xs font-bold uppercase tracking-wider ${selected === v.id ? 'text-calm-800' : 'text-gray-400'}`}>
                      {v.label}
                   </span>
                </button>
             ))}
          </div>
        </div>

        <AnimatePresence mode="wait">
          <motion.div
            key={current.id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.3 }}
            className="bg-calm-50 border border-calm-100 rounded-xl p-5 text-sm text-gray-700 relative"
          >
            {/* Decorative colored strip */}
            <div className={`absolute top-0 left-0 w-1 h-full rounded-l-xl ${current.color.replace('text-', 'bg-')}`} />
            
            <div className="flex items-center gap-2 mb-3">
               <current.icon className={`w-5 h-5 ${current.color}`} />
               <h3 className="font-semibold text-lg text-gray-900">{current.label}</h3>
            </div>
            
            <p className="text-xs text-gray-500 mb-3 uppercase tracking-wide font-medium">
              Tiny steps you could take:
            </p>
            <ul className="space-y-2">
              {current.examples.map((ex) => (
                <li key={ex} className="flex items-start gap-2">
                   <span className="text-calm-400 mt-1">•</span>
                   <span>{ex}</span>
                </li>
              ))}
            </ul>
          </motion.div>
        </AnimatePresence>

        <p className="text-xs text-gray-500 text-center">
          Tap a direction on the compass to orient yourself.
        </p>
      </CardContent>

      <div className="px-6 pb-6">
        <ShareInline
          title="Values Compass"
          text="Use a simple values compass to pick a tiny next step on CalmMyself."
        />
      </div>
    </Card>
  )
}


