"use client"

import { useState, useCallback } from 'react'
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { Cloud } from 'lucide-react'
import ShareInline from '@/components/ShareInline'
import { motion, AnimatePresence } from 'framer-motion'

type CloudItem = {
  id: string
  text: string
  top: number
  duration: number
}

export default function CloudVisualization() {
  const [clouds, setClouds] = useState<CloudItem[]>([])
  const [input, setInput] = useState('')

  const addCloud = useCallback(() => {
    if (!input.trim()) return
    const id = Math.random().toString(36).substr(2, 9)
    // Randomize vertical position between 10% and 70%
    const top = Math.random() * 60 + 10
    // Randomize speed between 15s and 25s
    const duration = Math.random() * 10 + 15
    
    setClouds((prev) => [...prev, { id, text: input, top, duration }])
    setInput('')
  }, [input])

  const removeCloud = useCallback((id: string) => {
    setClouds((prev) => prev.filter((c) => c.id !== id))
  }, [])

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault()
      addCloud()
    }
  }

  return (
    <Card className="max-w-lg mx-auto">
      <CardHeader className="text-center">
        <div className="flex items-center justify-center gap-2 mb-2">
          <Cloud className="w-5 h-5 text-calm-600" />
          <CardTitle>Thoughts as Clouds</CardTitle>
        </div>
        <CardDescription>Let thoughts drift by instead of trying to stop them</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Sky Canvas */}
        <div className="relative h-64 w-full rounded-xl overflow-hidden bg-gradient-to-b from-blue-300 to-blue-100 border border-blue-200 shadow-inner">
          <div className="absolute inset-0 opacity-50 pointer-events-none" />
          
          {clouds.length === 0 && (
            <div className="absolute inset-0 flex items-center justify-center text-blue-800/50 text-sm font-medium pointer-events-none p-4 text-center">
              Type a thought below and watch it drift away...
            </div>
          )}

          <AnimatePresence>
            {clouds.map((cloud) => (
              <motion.div
                key={cloud.id}
                initial={{ x: '-100%', opacity: 0, top: `${cloud.top}%` }}
                animate={{ x: '400px', opacity: 1 }} // Move well past the container width
                exit={{ opacity: 0 }}
                transition={{ 
                  x: { duration: cloud.duration, ease: 'linear' },
                  opacity: { duration: 0.5 } 
                }}
                onAnimationComplete={() => removeCloud(cloud.id)}
                className="absolute left-0 flex items-center gap-2 px-4 py-2 bg-white/90 rounded-full shadow-sm text-sm text-gray-700 whitespace-nowrap backdrop-blur-sm border border-white/50"
                style={{ top: `${cloud.top}%` }}
              >
                <Cloud className="w-4 h-4 text-blue-400 fill-blue-50" />
                {cloud.text}
              </motion.div>
            ))}
          </AnimatePresence>
        </div>

        {/* Input Area */}
        <div className="flex gap-2">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="I'm thinking about..."
            className="flex-1 p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-calm-500 focus:border-calm-500 text-sm"
            aria-label="Enter a thought"
          />
          <Button onClick={addCloud} disabled={!input.trim()} variant="calm">
            Release
          </Button>
        </div>

        <div className="text-xs text-gray-600 bg-calm-50 border border-calm-100 p-3 rounded-md">
          You don't need to push the thoughts away. Just place them in the sky and let the wind carry them at its own pace.
        </div>
      </CardContent>
      <div className="px-6 pb-6">
        <ShareInline
          title="Thoughts as Clouds"
          text="Use a short cloud visualization for racing thoughts on CalmMyself."
        />
      </div>
    </Card>
  )
}


