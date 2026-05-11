"use client"

import { useState } from 'react'
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import ShareInline from '@/components/ShareInline'
import { motion, AnimatePresence } from 'framer-motion'
import { Compass, Heart, Shield, BadgeCheck, Coffee, CheckCircle2, RotateCcw, ArrowLeft } from 'lucide-react'

type ValueId = 'care' | 'courage' | 'honesty' | 'rest'

interface ValueOption {
  id: ValueId
  label: string
  examples: string[]
  icon: React.ComponentType<{ className?: string }>
  color: string
  bgColor: string
}

const VALUES: ValueOption[] = [
  { id: 'care', label: 'Care', examples: ['Send a kind message', 'Check in with yourself', 'Do one small nurturing thing'], icon: Heart, color: 'text-rose-500', bgColor: 'bg-rose-500' },
  { id: 'courage', label: 'Courage', examples: ['Say something honest', 'Take a tiny step toward a scary task', 'Ask for help'], icon: Shield, color: 'text-orange-500', bgColor: 'bg-orange-500' },
  { id: 'honesty', label: 'Honesty', examples: ['Notice and name what you really feel', 'Admit a limit', 'Clarify expectations'], icon: BadgeCheck, color: 'text-blue-500', bgColor: 'bg-blue-500' },
  { id: 'rest', label: 'Rest', examples: ['Pause for 5 minutes', 'Step away from a screen', 'Go to bed a little earlier'], icon: Coffee, color: 'text-indigo-500', bgColor: 'bg-indigo-500' },
]

export default function ValuesCompass() {
  const [selected, setSelected] = useState<ValueId | null>(null)
  const [chosenStep, setChosenStep] = useState('')
  const [completed, setCompleted] = useState(false)

  const current = VALUES.find((v) => v.id === selected)

  const finish = () => {
    if (selected) setCompleted(true)
  }

  const reset = () => {
    setSelected(null)
    setChosenStep('')
    setCompleted(false)
  }

  if (completed && current) {
    const Icon = current.icon
    return (
      <Card className="max-w-md mx-auto">
        <CardContent className="text-center py-10 space-y-5">
          <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: 'spring', bounce: 0.5 }}>
            <div className={`w-16 h-16 rounded-full ${current.bgColor} bg-opacity-20 flex items-center justify-center mx-auto`}>
              <Icon className={`w-8 h-8 ${current.color}`} />
            </div>
          </motion.div>
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
            <h3 className="text-xl font-semibold text-gray-800 dark:text-gray-100">Compass set toward {current.label} \ud83e\udded</h3>
            <p className="text-gray-600 dark:text-gray-400 mt-2 text-sm">
              Even a tiny step in the direction of your values is meaningful. You don&apos;t need to be perfect \u2014 just pointed in the right direction.
            </p>
          </motion.div>
          {chosenStep && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.5 }}
              className="bg-green-50 dark:bg-green-950/30 border border-green-200 dark:border-green-800/50 rounded-xl p-3 max-w-xs mx-auto"
            >
              <p className="text-xs text-green-600 dark:text-green-400 font-bold uppercase mb-1">Your tiny step</p>
              <p className="text-sm text-green-800 dark:text-green-200">{chosenStep}</p>
            </motion.div>
          )}
          <div className="flex gap-3 justify-center pt-2">
            <Button onClick={reset} variant="calm" size="lg" className="gap-2">
              <RotateCcw size={16} /> Do Again
            </Button>
            <Button onClick={() => window.history.back()} variant="outline" size="lg" className="gap-2">
              <ArrowLeft size={16} /> Back
            </Button>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="max-w-md mx-auto">
      <CardHeader className="text-center">
        <div className="flex items-center justify-center gap-2 mb-2">
          <Compass className="w-5 h-5 text-calm-600" />
          <CardTitle>Values Compass</CardTitle>
        </div>
        <CardDescription>Pick a direction and a tiny next step</CardDescription>
      </CardHeader>

      <CardContent className="space-y-6">
        <p className="text-sm text-gray-600 dark:text-gray-400 text-center">Which direction calls to you right now?</p>

        <div className="grid grid-cols-2 gap-3">
          {VALUES.map((v) => {
            const Icon = v.icon
            return (
              <button
                key={v.id}
                onClick={() => setSelected(v.id)}
                className={`p-4 rounded-xl border-2 transition-all text-center space-y-2 ${
                  selected === v.id
                    ? 'border-calm-400 bg-calm-50 dark:bg-calm-950/30 shadow-md scale-[1.02]'
                    : 'border-gray-200 dark:border-gray-700 hover:border-gray-300'
                }`}
              >
                <Icon className={`w-6 h-6 mx-auto ${v.color}`} />
                <span className="text-sm font-semibold text-gray-700 dark:text-gray-200">{v.label}</span>
              </button>
            )
          })}
        </div>

        <AnimatePresence mode="wait">
          {current && (
            <motion.div
              key={current.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="space-y-3"
            >
              <div className={`border-l-4 ${current.bgColor} bg-gray-50 dark:bg-gray-800/50 rounded-r-xl p-4`}>
                <p className="text-xs text-gray-500 dark:text-gray-400 mb-2 uppercase tracking-wide font-medium">Tiny steps you could take:</p>
                <ul className="space-y-1.5">
                  {current.examples.map((ex) => (
                    <li key={ex} className="text-sm text-gray-700 dark:text-gray-300 flex items-start gap-2">
                      <span className="text-gray-400 mt-0.5">\u2022</span> {ex}
                    </li>
                  ))}
                </ul>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-1">Your chosen step (optional)</label>
                <input
                  type="text"
                  className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-xl bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 placeholder-gray-400 focus:ring-2 focus:ring-calm-500 focus:border-calm-500"
                  placeholder="I will..."
                  value={chosenStep}
                  onChange={(e) => setChosenStep(e.target.value)}
                />
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        <div className="flex justify-center">
          <Button onClick={finish} variant="calm" size="lg" disabled={!selected} className="gap-2">
            <CheckCircle2 size={16} /> Set My Direction
          </Button>
        </div>
      </CardContent>

      <div className="px-6 pb-6 pt-0"><div className="pt-4 mt-2 border-t border-gray-100 dark:border-gray-800">
        <ShareInline title="Values Compass" text="Use a simple values compass to pick a tiny next step on CalmMyself." />
      </div></div>
    </Card>
  )
}
