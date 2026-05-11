"use client"

import { useState, useEffect, useMemo } from 'react'
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { Heart, Play, Pause, RotateCcw } from 'lucide-react'
import ShareInline from '@/components/ShareInline'
import { motion, AnimatePresence } from 'framer-motion'

const DEFAULT_PHRASES = [
  'Right now, I am safe enough.',
  'This is hard, and I am doing my best.',
  'One breath, at a time is enough.',
]

function ExpandingRings({ isActive, phase }: { isActive: boolean; phase: 'inhale' | 'exhale' }) {
  const isInhale = phase === 'inhale'
  const rings = [0, 1, 2, 3]

  return (
    <svg width={220} height={220} viewBox="0 0 220 220" className="absolute inset-0 m-auto">
      {rings.map((i) => {
        const baseR = 20 + i * 20
        const expandedR = baseR + 15
        const contractedR = baseR - 5
        const target = isActive ? (isInhale ? expandedR : contractedR) : baseR
        const opacity = 0.25 - i * 0.05

        return (
          <motion.circle
            key={i}
            cx={110}
            cy={110}
            fill="none"
            stroke="#8b9dc3"
            strokeWidth={1.5}
            animate={{
              r: target,
              opacity: isActive ? opacity + 0.1 : opacity,
            }}
            transition={{ duration: 3.8, ease: 'easeInOut' }}
          />
        )
      })}
      {/* Center glow */}
      <motion.circle
        cx={110}
        cy={110}
        fill="rgba(139, 157, 195, 0.15)"
        stroke="none"
        animate={{
          r: isActive ? (isInhale ? 35 : 15) : 20,
        }}
        transition={{ duration: 3.8, ease: 'easeInOut' }}
      />
    </svg>
  )
}

export default function AnchorPhraseBreath() {
  const [phrase, setPhrase] = useState(DEFAULT_PHRASES[0])
  const [breathsCompleted, setBreathsCompleted] = useState(0)
  const [isActive, setIsActive] = useState(false)
  const [phase, setPhase] = useState<'inhale' | 'exhale'>('inhale')

  const [part1, part2] = useMemo(() => {
    if (phrase.includes(',')) {
      const parts = phrase.split(',')
      return [parts[0].trim(), parts.slice(1).join(',').trim()]
    }
    if (phrase.includes('.')) {
        const parts = phrase.split('.')
        if (parts[0] && parts[1] && parts[1].trim() !== '') {
             return [parts[0].trim(), parts.slice(1).join('.').trim()]
        }
    }
    const words = phrase.split(' ')
    const mid = Math.ceil(words.length / 2)
    return [words.slice(0, mid).join(' '), words.slice(mid).join(' ')]
  }, [phrase])

  useEffect(() => {
    let interval: NodeJS.Timeout
    if (isActive) {
      setPhase('inhale')
      interval = setInterval(() => {
        setPhase((prev) => {
          if (prev === 'inhale') return 'exhale'
          setBreathsCompleted((c) => c + 1)
          return 'inhale'
        })
      }, 4000)
    }
    return () => clearInterval(interval)
  }, [isActive])

  const toggleActive = () => setIsActive(!isActive)
  const onReset = () => { setIsActive(false); setBreathsCompleted(0); setPhase('inhale') }

  return (
    <Card className="max-w-md mx-auto">
      <CardHeader className="text-center">
        <div className="flex items-center justify-center gap-2 mb-2">
          <Heart className="w-5 h-5 text-calm-600" />
          <CardTitle>Anchor Phrase + Breath</CardTitle>
        </div>
        <CardDescription>Pair a gentle phrase with your breath (4s in, 4s out)</CardDescription>
      </CardHeader>

      <CardContent className="space-y-8">
        {/* Visual Pacer with Expanding Rings */}
        <div className="relative h-64 flex items-center justify-center bg-calm-50 dark:bg-gray-800/50 rounded-2xl border border-calm-100 overflow-hidden">
            <ExpandingRings isActive={isActive} phase={phase} />

            {/* Text Display */}
            <div className="z-10 max-w-[200px] text-center px-4">
                <AnimatePresence mode="wait">
                    <motion.div
                        key={isActive ? phase : 'idle'}
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.95 }}
                        transition={{ duration: 0.5 }}
                        className="text-lg font-medium text-calm-900 dark:text-gray-100"
                    >
                        {!isActive ? (
                            <span className="text-gray-500 text-sm">Press Play to Begin</span>
                        ) : phase === 'inhale' ? (
                            <>
                                <motion.div
                                  className="text-xs text-calm-600 uppercase tracking-widest mb-1"
                                  animate={{ letterSpacing: ['0.1em', '0.2em', '0.1em'] }}
                                  transition={{ duration: 4, repeat: Infinity }}
                                >
                                  Inhale
                                </motion.div>
                                <motion.div
                                  animate={{ scale: [1, 1.05, 1] }}
                                  transition={{ duration: 4, repeat: Infinity }}
                                >
                                  {part1}
                                </motion.div>
                            </>
                        ) : (
                            <>
                                <motion.div
                                  className="text-xs text-calm-600 uppercase tracking-widest mb-1"
                                  animate={{ letterSpacing: ['0.2em', '0.1em', '0.2em'] }}
                                  transition={{ duration: 4, repeat: Infinity }}
                                >
                                  Exhale
                                </motion.div>
                                <motion.div
                                  animate={{ scale: [1.05, 1, 1.05] }}
                                  transition={{ duration: 4, repeat: Infinity }}
                                >
                                  {part2}
                                </motion.div>
                            </>
                        )}
                    </motion.div>
                </AnimatePresence>
            </div>
        </div>

        {/* Controls */}
        <div className="space-y-6">
            <div className="flex items-center justify-center gap-4">
                <Button variant={isActive ? "outline" : "calm"} size="lg" className="w-32 gap-2" onClick={toggleActive}>
                    {isActive ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
                    {isActive ? "Pause" : "Start"}
                </Button>
                <Button variant="ghost" size="icon" onClick={onReset} aria-label="Reset" disabled={breathsCompleted === 0 && !isActive}>
                    <RotateCcw className="w-5 h-5 text-gray-500 dark:text-gray-400" />
                </Button>
            </div>

            <div className="flex flex-col items-center gap-2">
                <div className="text-sm text-gray-600 dark:text-gray-400">
                    Breaths completed: <span className="font-semibold text-calm-700">{breathsCompleted}</span>
                </div>
                <div className="w-full max-w-xs bg-gray-200 dark:bg-gray-700 rounded-full h-1.5">
                    <div className="bg-sky-500 h-1.5 rounded-full transition-all duration-500" style={{ width: `${Math.min((breathsCompleted / 10) * 100, 100)}%` }} />
                </div>
            </div>

          <div className="space-y-3 pt-4 border-t border-gray-100">
            <label className="block text-xs font-medium text-gray-500 uppercase tracking-wide text-center">Customize Your Phrase</label>
            <textarea
              className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-xl bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-500 text-center text-sm focus:ring-2 focus:ring-calm-500 focus:border-calm-500 resize-none"
              rows={2}
              value={phrase}
              onChange={(e) => setPhrase(e.target.value)}
              aria-label="Anchor phrase"
            />
            <div className="flex flex-wrap justify-center gap-2">
              {DEFAULT_PHRASES.map((p) => (
                <button key={p} type="button" onClick={() => setPhrase(p)} className="text-[10px] px-2 py-1 rounded-full border border-gray-200 bg-white hover:border-calm-300 text-gray-600 transition-colors">
                  {p}
                </button>
              ))}
            </div>
          </div>
        </div>
      </CardContent>

      <div className="px-6 pb-6 pt-0"><div className="pt-4 mt-2 border-t border-gray-100 dark:border-gray-800">
        <ShareInline title="Anchor Phrase + Breath" text="Pair a gentle phrase with your breath on CalmMyself." />
      </div></div>
    </Card>
  )
}
