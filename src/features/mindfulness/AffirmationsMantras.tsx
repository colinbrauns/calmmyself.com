"use client"

import { useState } from 'react'
import { Button } from '@/components/ui/Button'
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/Card'
import { Quote, RefreshCw, Volume2 } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import ShareInline from '@/components/ShareInline'

const CATEGORIES = [
  {
    id: 'grounding',
    name: 'Grounding',
    items: [
      'I am here, now. I am safe enough in this moment.',
      'I notice my breath, my body, and the ground supporting me.',
      'I can take one small step at a time.'
    ]
  },
  {
    id: 'self-compassion',
    name: 'Self‑Compassion',
    items: [
      'This is hard, and I’m doing my best.',
      'I give myself permission to rest and recover.',
      'I speak to myself the way I would to a friend.'
    ]
  },
  {
    id: 'confidence',
    name: 'Confidence',
    items: [
      'I have handled difficult moments before; I can handle this too.',
      'I trust myself to choose the next right thing.',
      'Every breath brings steady focus and clarity.'
    ]
  }
]

export default function AffirmationsMantras() {
  const [categoryIndex, setCategoryIndex] = useState(0)
  const [lineIndex, setLineIndex] = useState(0)

  const category = CATEGORIES[categoryIndex]
  const current = category.items[lineIndex]

  const next = () => {
    if (lineIndex < category.items.length - 1) setLineIndex(lineIndex + 1)
    else if (categoryIndex < CATEGORIES.length - 1) { setCategoryIndex(categoryIndex + 1); setLineIndex(0) }
  }
  const prev = () => {
    if (lineIndex > 0) setLineIndex(lineIndex - 1)
    else if (categoryIndex > 0) { const prevCat = categoryIndex - 1; setCategoryIndex(prevCat); setLineIndex(CATEGORIES[prevCat].items.length - 1) }
  }
  const reset = () => { setCategoryIndex(0); setLineIndex(0) }

  const speak = () => {
    if (typeof window === 'undefined' || !('speechSynthesis' in window)) return
    const utter = new SpeechSynthesisUtterance(current)
    utter.rate = 0.95
    utter.pitch = 1
    window.speechSynthesis.cancel()
    window.speechSynthesis.speak(utter)
  }

  const total = CATEGORIES.reduce((a, c) => a + c.items.length, 0)
  const currentNum = CATEGORIES.slice(0, categoryIndex).reduce((a, c) => a + c.items.length, 0) + lineIndex + 1

  return (
    <Card className="max-w-md mx-auto">
      <CardHeader className="text-center">
        <div className="flex items-center justify-center gap-2 mb-2">
          <Quote className="w-5 h-5 text-calm-600" />
          <CardTitle>Affirmations & Mantras</CardTitle>
        </div>
        <CardDescription>{category.name} • {currentNum} of {total}</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="w-full bg-gray-200 rounded-full h-2">
          <div className="bg-calm-500 h-2 rounded-full transition-all duration-500" style={{ width: `${(currentNum/total)*100}%` }} />
        </div>

        <div className="bg-calm-50 rounded-lg p-6 text-center min-h-[100px] flex items-center justify-center overflow-hidden">
          <AnimatePresence mode="wait">
            <motion.p
              key={`${categoryIndex}-${lineIndex}`}
              className="text-lg text-calm-900 leading-relaxed"
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.35, ease: 'easeOut' }}
            >
              {current}
            </motion.p>
          </AnimatePresence>
        </div>

        <div className="flex gap-2">
          <Button onClick={prev} variant="outline" size="lg" className="flex-1" disabled={categoryIndex===0 && lineIndex===0}>Previous</Button>
          <Button onClick={speak} variant="calm" size="lg" className="flex items-center gap-2"><Volume2 size={18}/>Speak</Button>
          <Button onClick={next} variant="calm" size="lg" className="flex-1">Next</Button>
        </div>

        <div className="text-center">
          <Button onClick={reset} variant="ghost" size="sm" className="inline-flex items-center gap-2"><RefreshCw size={16}/>Start Over</Button>
        </div>
      </CardContent>
      <div className="px-6 pb-6 space-y-3">
        <div className="text-xs text-gray-600 bg-calm-50 border border-calm-100 p-3 rounded-md">
          About: Brief self‑statements can guide attention and foster a kinder inner tone. Choose phrases that feel believable and supportive.
          <br/>
          Evidence: Self‑compassion and attentional reappraisal are associated with reduced stress reactivity.
        </div>
        <ShareInline title="Affirmations & Mantras" text="Use supportive affirmations on CalmMyself" />
      </div>
    </Card>
  )
}
