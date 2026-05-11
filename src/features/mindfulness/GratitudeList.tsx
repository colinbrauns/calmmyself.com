'use client'

import { useState } from 'react'
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { Sun, ArrowRight, RotateCcw } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import ShareInline from '@/components/ShareInline'

export default function GratitudeList() {
  const [items, setItems] = useState(['', '', ''])
  const [currentIdx, setCurrentIdx] = useState(0)
  const [completed, setCompleted] = useState(false)

  const handleSubmit = () => {
    if (currentIdx < 2) setCurrentIdx(currentIdx + 1)
    else setCompleted(true)
  }

  const reset = () => { setItems(['', '', '']); setCurrentIdx(0); setCompleted(false) }

  if (completed) {
    return (
      <Card className="max-w-md mx-auto">
        <CardContent className="py-10 space-y-6">
          <div className="text-center">
            <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: 'spring' }}>
              <div className="w-16 h-16 rounded-full bg-amber-100 dark:bg-amber-900/50 flex items-center justify-center mx-auto mb-4">
                <Sun className="w-8 h-8 text-amber-600" />
              </div>
            </motion.div>
            <h3 className="text-xl font-semibold text-gray-800 dark:text-gray-100 mb-2">Gratitude fills the heart 🌻</h3>
            <p className="text-sm text-gray-500 dark:text-gray-400 mb-6">Today you're grateful for:</p>
          </div>
          {items.map((item, i) => (
            <motion.div key={i} initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.3 }}
              className="bg-gradient-to-r from-amber-50 to-orange-50 dark:from-amber-950/30 dark:to-orange-950/30 border border-amber-100 dark:border-amber-900/50 rounded-xl p-4 text-center">
              <p className="text-gray-800 dark:text-gray-200 font-medium">{item}</p>
            </motion.div>
          ))}
          <div className="flex justify-center gap-3 pt-4">
            <Button onClick={reset} variant="calm" size="lg">Do Again</Button>
          </div>
          <ShareInline title="Gratitude List" text="Practice gratitude on CalmMyself" />
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="max-w-md mx-auto">
      <CardHeader className="text-center">
        <div className="flex items-center justify-center gap-2 mb-2">
          <Sun className="w-5 h-5 text-amber-600" />
          <CardTitle>Gratitude List</CardTitle>
        </div>
        <CardDescription>Write 3 things you&apos;re grateful for today</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="flex justify-center gap-2">
          {[0, 1, 2].map(i => (
            <div key={i} className={`w-10 h-1.5 rounded-full transition-colors ${i <= currentIdx ? 'bg-amber-500' : 'bg-gray-200 dark:bg-gray-700'}`} />
          ))}
        </div>

        <AnimatePresence mode="wait">
          <motion.div key={currentIdx} initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-4">
            <p className="text-center text-lg text-gray-700 dark:text-gray-300">
              Grateful thing #{currentIdx + 1}
            </p>
            <textarea
              value={items[currentIdx]}
              onChange={e => { const n = [...items]; n[currentIdx] = e.target.value; setItems(n) }}
              placeholder="What are you grateful for?"
              rows={3}
              className="w-full px-4 py-3 rounded-xl bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-gray-800 dark:text-gray-200 focus:outline-none focus:ring-2 focus:ring-amber-300 dark:focus:ring-amber-700 text-sm resize-none"
            />
          </motion.div>
        </AnimatePresence>

        <div className="flex justify-center">
          <Button onClick={handleSubmit} variant="calm" size="lg" disabled={!items[currentIdx].trim()} className="flex items-center gap-2">
            {currentIdx < 2 ? <><ArrowRight size={18} /> Next</> : 'Complete'}
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}
