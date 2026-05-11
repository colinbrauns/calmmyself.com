"use client"

import { useState, useEffect, useCallback } from 'react'
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { Play, Pause, RotateCcw, Shuffle } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import ShareInline from '@/components/ShareInline'

type Phase = 'inhaleL' | 'hold1' | 'exhaleR' | 'inhaleR' | 'hold2' | 'exhaleL'

const SEQ: { phase: Phase; label: string; duration: number }[] = [
  { phase: 'inhaleL', label: 'Inhale Left', duration: 4000 },
  { phase: 'hold1', label: 'Hold', duration: 4000 },
  { phase: 'exhaleR', label: 'Exhale Right', duration: 4000 },
  { phase: 'inhaleR', label: 'Inhale Right', duration: 4000 },
  { phase: 'hold2', label: 'Hold', duration: 4000 },
  { phase: 'exhaleL', label: 'Exhale Left', duration: 4000 },
]

function NostrilDiagram({ leftActive, rightActive, isHold, isActive }: { leftActive: boolean; rightActive: boolean; isHold: boolean; isActive: boolean }) {
  const size = 180
  const cx = size / 2

  return (
    <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} className="mx-auto">
      {/* Nose bridge */}
      <path
        d="M 90 35 Q 90 55 82 80 Q 78 95 75 110 Q 72 125 80 135 Q 85 140 90 140 Q 95 140 100 135 Q 108 125 105 110 Q 102 95 98 80 Q 90 55 90 35"
        fill="none"
        stroke="#d1d5db"
        strokeWidth={2}
      />

      {/* Left nostril */}
      <motion.ellipse
        cx={75}
        cy={140}
        rx={18}
        ry={12}
        fill={leftActive && isActive ? 'rgba(59, 130, 246, 0.2)' : 'rgba(209, 213, 219, 0.15)'}
        stroke={leftActive && isActive ? '#3b82f6' : '#d1d5db'}
        strokeWidth={2}
        animate={{
          scale: leftActive && isActive ? [1, 1.1, 1] : 1,
        }}
        transition={{ duration: 1.5, repeat: leftActive && isActive ? Infinity : 0 }}
      />
      {/* Left nostril opening */}
      <ellipse cx={75} cy={142} rx={6} ry={4} fill={leftActive && isActive ? '#3b82f6' : '#d1d5db'} opacity={0.5} />

      {/* Right nostril */}
      <motion.ellipse
        cx={105}
        cy={140}
        rx={18}
        ry={12}
        fill={rightActive && isActive ? 'rgba(245, 158, 11, 0.2)' : 'rgba(209, 213, 219, 0.15)'}
        stroke={rightActive && isActive ? '#f59e0b' : '#d1d5db'}
        strokeWidth={2}
        animate={{
          scale: rightActive && isActive ? [1, 1.1, 1] : 1,
        }}
        transition={{ duration: 1.5, repeat: rightActive && isActive ? Infinity : 0 }}
      />
      {/* Right nostril opening */}
      <ellipse cx={105} cy={142} rx={6} ry={4} fill={rightActive && isActive ? '#f59e0b' : '#d1d5db'} opacity={0.5} />

      {/* Airflow indicators */}
      {isActive && leftActive && !isHold && (
        <motion.g animate={{ opacity: [0.2, 0.8, 0.2] }} transition={{ duration: 1.2, repeat: Infinity }}>
          <line x1={60} y1={155} x2={60} y2={165} stroke="#3b82f6" strokeWidth={1.5} />
          <line x1={68} y1={157} x2={68} y2={167} stroke="#3b82f6" strokeWidth={1.5} />
          <line x1={76} y1={155} x2={76} y2={165} stroke="#3b82f6" strokeWidth={1.5} />
        </motion.g>
      )}
      {isActive && rightActive && !isHold && (
        <motion.g animate={{ opacity: [0.2, 0.8, 0.2] }} transition={{ duration: 1.2, repeat: Infinity }}>
          <line x1={98} y1={155} x2={98} y2={165} stroke="#f59e0b" strokeWidth={1.5} />
          <line x1={106} y1={157} x2={106} y2={167} stroke="#f59e0b" strokeWidth={1.5} />
          <line x1={114} y1={155} x2={114} y2={165} stroke="#f59e0b" strokeWidth={1.5} />
        </motion.g>
      )}

      {/* Labels */}
      <text x={45} y={175} textAnchor="middle" fill={leftActive && isActive ? '#3b82f6' : '#9ca3af'} fontSize={11} fontWeight={leftActive && isActive ? 'bold' : 'normal'}>Left</text>
      <text x={135} y={175} textAnchor="middle" fill={rightActive && isActive ? '#f59e0b' : '#9ca3af'} fontSize={11} fontWeight={rightActive && isActive ? 'bold' : 'normal'}>Right</text>

      {/* Hold indicator */}
      {isActive && isHold && (
        <motion.text
          x={cx}
          y={100}
          textAnchor="middle"
          fill="#6b7280"
          fontSize={12}
          animate={{ opacity: [0.4, 1, 0.4] }}
          transition={{ duration: 2, repeat: Infinity }}
        >
          holding…
        </motion.text>
      )}

      {/* Finger indicator - close right nostril */}
      {isActive && leftActive && (
        <motion.circle cx={120} cy={135} r={5} fill="#f59e0b" opacity={0.4}
          animate={{ opacity: [0.3, 0.5, 0.3] }}
          transition={{ duration: 2, repeat: Infinity }}
        />
      )}
      {/* Finger indicator - close left nostril */}
      {isActive && rightActive && (
        <motion.circle cx={60} cy={135} r={5} fill="#3b82f6" opacity={0.4}
          animate={{ opacity: [0.3, 0.5, 0.3] }}
          transition={{ duration: 2, repeat: Infinity }}
        />
      )}
    </svg>
  )
}

export default function AlternateNostril() {
  const [isActive, setIsActive] = useState(false)
  const [index, setIndex] = useState(0)
  const [cycleCount, setCycleCount] = useState(0)
  const [remaining, setRemaining] = useState(SEQ[0].duration)

  const next = useCallback(() => {
    setIndex((prev) => {
      const next = (prev + 1) % SEQ.length
      if (next === 0) setCycleCount((c) => c + 1)
      setRemaining(SEQ[next].duration)
      return next
    })
  }, [])

  useEffect(() => {
    if (!isActive) return
    const id = setInterval(() => {
      setRemaining((t) => {
        if (t <= 100) { next(); return SEQ[(index + 1) % SEQ.length].duration }
        return t - 100
      })
    }, 100)
    return () => clearInterval(id)
  }, [isActive, index, next])

  const reset = () => { setIsActive(false); setIndex(0); setCycleCount(0); setRemaining(SEQ[0].duration) }
  const current = SEQ[index]
  const progress = ((current.duration - remaining) / current.duration) * 100

  const leftActive = current.phase === 'inhaleL' || current.phase === 'exhaleL'
  const rightActive = current.phase === 'inhaleR' || current.phase === 'exhaleR'
  const isHold = current.phase === 'hold1' || current.phase === 'hold2'

  return (
    <Card className="max-w-md mx-auto">
      <CardHeader className="text-center">
        <div className="flex items-center justify-center gap-2 mb-2">
          <Shuffle className="w-5 h-5 text-grounding-600" />
          <CardTitle>Alternate Nostril Breathing</CardTitle>
        </div>
        <CardDescription>Balanced pattern to calm and focus</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Nostril Diagram */}
        <NostrilDiagram leftActive={leftActive} rightActive={rightActive} isHold={isHold} isActive={isActive} />

        {/* Timer */}
        <div className="text-center">
          <div className="text-3xl font-bold text-grounding-700 dark:text-gray-100 mb-1">{Math.ceil(remaining/1000)}</div>
        </div>

        {/* Labels */}
        <div className="text-center">
          <div className="text-2xl font-semibold text-grounding-800 dark:text-gray-100 mb-2 min-h-[32px]">
            <AnimatePresence mode="wait">
              <motion.span key={current.label} initial={{opacity:0,y:6}} animate={{opacity:1,y:0}} exit={{opacity:0,y:-6}} transition={{duration:0.25}}>
                {current.label}
              </motion.span>
            </AnimatePresence>
          </div>
          <div className="text-sm text-gray-600 dark:text-gray-400">Cycle {cycleCount + 1}</div>
        </div>

        <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
          <div className="bg-sky-500 h-2 rounded-full transition-all duration-100 ease-linear" style={{ width: `${progress}%` }} />
        </div>

        <div className="flex justify-center gap-3">
          <Button onClick={() => setIsActive(!isActive)} variant="grounding" size="lg" className="flex items-center gap-2">
            {isActive ? <Pause size={18}/> : <Play size={18}/>} {isActive ? 'Pause' : 'Start'}
          </Button>
          <Button onClick={reset} variant="outline" size="lg" className="flex items-center gap-2"><RotateCcw size={18}/>Reset</Button>
        </div>

        <div className="text-xs text-gray-500 text-xs text-gray-600 dark:text-gray-400 bg-gray-50 dark:bg-gray-800/50 border border-gray-200 dark:border-gray-700 p-3 rounded-xl">
          Tip: Use the right hand — thumb to gently close right nostril, ring finger to close left. Breathe softly.
        </div>
      </CardContent>
      <div className="px-6 pb-6 pt-0"><div className="pt-4 mt-2 border-t border-gray-100 dark:border-gray-800 space-y-3">
        <div className="text-xs text-gray-600 dark:text-gray-400 bg-gray-50 dark:bg-gray-800/50 border border-gray-200 dark:border-gray-700 p-3 rounded-xl">
          About: Alternate nostril breathing (nadi shodhana) may help reduce perceived stress and improve attention in some studies. Breathe lightly.
          <br/>
          Evidence: Look up controlled trials on "alternate nostril breathing attention anxiety".
        </div>
        <ShareInline title="Alternate Nostril Breathing" text="Try alternate nostril breathing on CalmMyself" />
      </div></div>
    </Card>
  )
}
