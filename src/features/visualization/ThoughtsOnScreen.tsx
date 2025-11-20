"use client"

import { useState, useRef, useEffect } from 'react'
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { Monitor, Film } from 'lucide-react'
import ShareInline from '@/components/ShareInline'
import { motion, AnimatePresence } from 'framer-motion'

export default function ThoughtsOnScreen() {
  const [input, setInput] = useState('')
  const [activeSubtitle, setActiveSubtitle] = useState<{ id: number; text: string } | null>(null)
  const timerRef = useRef<NodeJS.Timeout>()

  // Cleanup timer on unmount
  useEffect(() => {
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current)
    }
  }, [])

  const handleProject = () => {
    if (!input.trim()) return

    // Clear existing timer if user types fast
    if (timerRef.current) clearTimeout(timerRef.current)

    setActiveSubtitle({ id: Date.now(), text: input })
    setInput('')

    // Auto fade out after 5s
    timerRef.current = setTimeout(() => {
      setActiveSubtitle(null)
    }, 5000)
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault()
      handleProject()
    }
  }

  return (
    <Card className="max-w-md mx-auto">
      <CardHeader className="text-center">
        <div className="flex items-center justify-center gap-2 mb-2">
          <Monitor className="w-5 h-5 text-calm-600" />
          <CardTitle>Thoughts on a Screen</CardTitle>
        </div>
        <CardDescription>
          Watch thoughts like subtitles instead of being inside them
        </CardDescription>
      </CardHeader>

      <CardContent className="space-y-6">
        {/* Cinema Screen */}
        <div className="relative h-48 rounded-xl overflow-hidden bg-black shadow-2xl border-4 border-gray-800">
          {/* Screen Glow/Flicker */}
          <div className="absolute inset-0 bg-white opacity-[0.02] animate-pulse" />
          
          <div className="absolute inset-0 flex items-center justify-center px-8 pb-8">
            <AnimatePresence mode="wait">
              {!activeSubtitle ? (
                <motion.div
                  key="empty"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="text-gray-600 text-xs text-center font-mono"
                >
                  [Screen is empty]
                </motion.div>
              ) : (
                <motion.div
                  key={activeSubtitle.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, filter: 'blur(4px)' }}
                  transition={{ duration: 1.5 }}
                  className="text-white text-center font-mono text-lg leading-relaxed drop-shadow-md"
                >
                  {activeSubtitle.text}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
          
          {/* Subtitle area indicator */}
          <div className="absolute bottom-4 left-0 right-0 flex justify-center opacity-20">
             <Film className="w-4 h-4 text-white" />
          </div>
        </div>

        {/* Input Area */}
        <div className="flex gap-2">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="I'm having the thought that..."
            className="flex-1 p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-calm-500 focus:border-calm-500 text-sm font-mono"
            aria-label="Enter a thought"
          />
          <Button onClick={handleProject} disabled={!input.trim()} variant="calm">
            Project
          </Button>
        </div>

        <div className="text-xs text-gray-600 bg-calm-50 border border-calm-100 p-3 rounded-md">
          <p className="mb-2 font-semibold">How to use:</p>
          <ol className="list-decimal list-inside space-y-1">
             <li>Notice a thought popping up.</li>
             <li>Type it out above (e.g. &quot;I&apos;m worrying about tomorrow&quot;).</li>
             <li>Watch it appear on the screen, stay for a moment, and fade away.</li>
             <li>You don&apos;t have to fix it or fight it. Just watch it go.</li>
          </ol>
        </div>

      </CardContent>

      <div className="px-6 pb-6">
        <ShareInline
          title="Thoughts on a Screen"
          text="Practice watching thoughts as subtitles on CalmMyself."
        />
      </div>
    </Card>
  )
}


