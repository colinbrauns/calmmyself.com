'use client'

import { useState } from 'react'
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { CloudOff, ArrowRight, RotateCcw } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import ShareInline from '@/components/ShareInline'

export default function ThoughtDefusion() {
  const [step, setStep] = useState(0)
  const [thought, setThought] = useState('')
  const [completed, setCompleted] = useState(false)

  const prefixed1 = `I notice I'm having the thought that ${thought}`
  const prefixed2 = `I notice I notice I'm having the thought that ${thought}`

  const reset = () => { setStep(0); setThought(''); setCompleted(false) }

  if (completed) {
    return (
      <Card className="max-w-md mx-auto">
        <CardContent className="py-10 space-y-6">
          <div className="text-center">
            <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: 'spring' }}>
              <div className="w-16 h-16 rounded-full bg-violet-100 dark:bg-violet-900/50 flex items-center justify-center mx-auto mb-4">
                <CloudOff className="w-8 h-8 text-violet-600" />
              </div>
            </motion.div>
            <h3 className="text-xl font-semibold text-gray-800 dark:text-gray-100 mb-2">Notice the distance 🌬️</h3>
            <p className="text-sm text-gray-500 dark:text-gray-400 mb-6">See how each layer creates more space between you and the thought?</p>
          </div>
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2 }}
            className="bg-gray-50 dark:bg-gray-800/50 rounded-xl p-4 space-y-3">
            <p className="text-sm text-gray-500 dark:text-gray-400">Original:</p>
            <p className="text-gray-700 dark:text-gray-300 font-medium">{thought}</p>
          </motion.div>
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.5 }}
            className="bg-violet-50 dark:bg-violet-950/30 rounded-xl p-4 space-y-1 border border-violet-100 dark:border-violet-900/50">
            <p className="text-sm text-violet-500">Layer 1:</p>
            <p className="text-gray-700 dark:text-gray-300">{prefixed1}</p>
          </motion.div>
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.8 }}
            className="bg-violet-50 dark:bg-violet-950/30 rounded-xl p-4 space-y-1 border border-violet-200 dark:border-violet-800/50">
            <p className="text-sm text-violet-500">Layer 2:</p>
            <p className="text-gray-700 dark:text-gray-300">{prefixed2}</p>
          </motion.div>
          <p className="text-xs text-gray-500 dark:text-gray-400 text-center">You are not your thoughts. You are the one observing them.</p>
          <div className="flex justify-center gap-3 pt-2">
            <Button onClick={reset} variant="calm" size="lg">Try Another Thought</Button>
          </div>
          <ShareInline title="Thought Defusion" text="ACT thought defusion technique on CalmMyself" />
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="max-w-md mx-auto">
      <CardHeader className="text-center">
        <div className="flex items-center justify-center gap-2 mb-2">
          <CloudOff className="w-5 h-5 text-violet-600" />
          <CardTitle>Thought Defusion</CardTitle>
        </div>
        <CardDescription>Create distance from distressing thoughts using an ACT technique</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="flex justify-center gap-2">
          {[0, 1, 2].map(i => (
            <div key={i} className={`w-10 h-1.5 rounded-full transition-colors ${i <= step ? 'bg-violet-500' : 'bg-gray-200 dark:bg-gray-700'}`} />
          ))}
        </div>

        <AnimatePresence mode="wait">
          {step === 0 && (
            <motion.div key="step0" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="space-y-4">
              <p className="text-center text-gray-700 dark:text-gray-300">What thought is bothering you?</p>
              <textarea value={thought} onChange={e => setThought(e.target.value)}
                placeholder="e.g., I'm not good enough" rows={3}
                className="w-full px-4 py-3 rounded-xl bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-gray-800 dark:text-gray-200 focus:outline-none focus:ring-2 focus:ring-violet-300 dark:focus:ring-violet-700 text-sm resize-none" />
              <div className="flex justify-center">
                <Button onClick={() => setStep(1)} variant="calm" disabled={!thought.trim()} className="flex items-center gap-2">
                  <ArrowRight size={18} /> Next
                </Button>
              </div>
            </motion.div>
          )}
          {step === 1 && (
            <motion.div key="step1" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="space-y-4">
              <p className="text-center text-sm text-gray-500 dark:text-gray-400">Now read this version out loud:</p>
              <div className="bg-violet-50 dark:bg-violet-950/30 border border-violet-100 dark:border-violet-900/50 rounded-xl p-4">
                <p className="text-gray-800 dark:text-gray-200 text-lg">&ldquo;{prefixed1}&rdquo;</p>
              </div>
              <p className="text-center text-xs text-gray-400 dark:text-gray-500">Notice how adding &ldquo;I notice I'm having the thought that...&rdquo; creates a little distance.</p>
              <div className="flex justify-center">
                <Button onClick={() => setStep(2)} variant="calm" className="flex items-center gap-2">
                  <ArrowRight size={18} /> One More Layer
                </Button>
              </div>
            </motion.div>
          )}
          {step === 2 && (
            <motion.div key="step2" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="space-y-4">
              <p className="text-center text-sm text-gray-500 dark:text-gray-400">And now this one:</p>
              <div className="bg-violet-50 dark:bg-violet-950/30 border border-violet-200 dark:border-violet-800/50 rounded-xl p-4">
                <p className="text-gray-800 dark:text-gray-200 text-lg">&ldquo;{prefixed2}&rdquo;</p>
              </div>
              <p className="text-center text-xs text-gray-400 dark:text-gray-500">Even more space. The thought is still there, but you&apos;re observing it from further away.</p>
              <div className="flex justify-center">
                <Button onClick={() => setCompleted(true)} variant="calm">See the Full Picture</Button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </CardContent>
    </Card>
  )
}
