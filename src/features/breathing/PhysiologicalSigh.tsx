'use client'

import { motion } from 'framer-motion'
import { Button } from '@/components/ui/Button'
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/Card'
import { Play, Pause, RotateCcw } from 'lucide-react'
import ShareInline from '@/components/ShareInline'
import { useBreathPattern } from '@/hooks/useBreathPattern'

type BreathingPhase = 'inhale1' | 'inhale2' | 'exhale'

const PATTERN = [
  { phase: 'inhale1', label: 'First inhale', durationMs: 2000 },
  { phase: 'inhale2', label: 'Second inhale', durationMs: 1000 },
  { phase: 'exhale', label: 'Long exhale', durationMs: 6000 },
] as const

function DoublePulseVisual({ phase, progress, isActive }: { phase: BreathingPhase; progress: number; isActive: boolean }) {
  // Inner circle: expands on inhale1, stays on inhale2, shrinks on exhale
  // Outer circle: stays small on inhale1, expands on inhale2, shrinks on exhale
  let innerScale = 0.4
  let outerScale = 0.3

  if (isActive) {
    if (phase === 'inhale1') {
      innerScale = 0.4 + (progress / 100) * 0.35
      outerScale = 0.3
    } else if (phase === 'inhale2') {
      innerScale = 0.75
      outerScale = 0.3 + (progress / 100) * 0.7
    } else {
      // exhale: both shrink
      innerScale = 0.75 - (progress / 100) * 0.35
      outerScale = 1.0 - (progress / 100) * 0.7
    }
  }

  const size = 200
  const cx = size / 2
  const cy = size / 2
  const outerRadius = 80 * outerScale
  const innerRadius = 50 * innerScale
  const circleTransition = { duration: isActive ? 0.15 : 0, ease: 'linear' as const }

  const isInhaling = phase === 'inhale1' || phase === 'inhale2'

  return (
    <div className="relative" style={{ width: size, height: size }}>
      <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
        {/* Outer circle */}
        <motion.circle
          cx={cx}
          cy={cy}
          r={outerRadius}
          fill="none"
          stroke={phase === 'inhale2' && isActive ? '#3b82f6' : '#93c5fd'}
          strokeWidth={3}
          initial={false}
          animate={{ r: outerRadius }}
          transition={circleTransition}
          opacity={isActive ? (outerScale > 0.35 ? 0.8 : 0.3) : 0.3}
        />
        <motion.circle
          cx={cx}
          cy={cy}
          r={outerRadius}
          fill={`rgba(59, 130, 246, ${isActive ? 0.08 : 0.05})`}
          stroke="none"
          initial={false}
          animate={{ r: outerRadius }}
          transition={circleTransition}
        />

        {/* Inner circle */}
        <motion.circle
          cx={cx}
          cy={cy}
          r={innerRadius}
          fill={`rgba(59, 130, 246, ${isActive ? 0.15 : 0.1})`}
          stroke={phase === 'inhale1' && isActive ? '#2563eb' : '#60a5fa'}
          strokeWidth={3}
          initial={false}
          animate={{ r: innerRadius }}
          transition={circleTransition}
        />

        {/* Breath direction arrows */}
        {isActive && isInhaling && (
          <>
            <motion.path
              d={`M ${cx} ${cy - 55 * innerScale} L ${cx - 6} ${cy - 55 * innerScale + 10} M ${cx} ${cy - 55 * innerScale} L ${cx + 6} ${cy - 55 * innerScale + 10}`}
              stroke="#2563eb"
              strokeWidth={2}
              fill="none"
              animate={{ opacity: [0.3, 0.8, 0.3] }}
              transition={{ duration: 1, repeat: Infinity }}
            />
            <motion.path
              d={`M ${cx} ${cy + 55 * innerScale} L ${cx - 6} ${cy + 55 * innerScale - 10} M ${cx} ${cy + 55 * innerScale} L ${cx + 6} ${cy + 55 * innerScale - 10}`}
              stroke="#2563eb"
              strokeWidth={2}
              fill="none"
              animate={{ opacity: [0.3, 0.8, 0.3] }}
              transition={{ duration: 1, repeat: Infinity }}
            />
          </>
        )}
        {isActive && phase === 'exhale' && (
          <>
            <motion.path
              d={`M ${cx} ${cy - 55 * innerScale} L ${cx - 6} ${cy - 55 * innerScale - 10} M ${cx} ${cy - 55 * innerScale} L ${cx + 6} ${cy - 55 * innerScale - 10}`}
              stroke="#60a5fa"
              strokeWidth={2}
              fill="none"
              animate={{ opacity: [0.3, 0.8, 0.3] }}
              transition={{ duration: 1.5, repeat: Infinity }}
            />
            <motion.path
              d={`M ${cx} ${cy + 55 * innerScale} L ${cx - 6} ${cy + 55 * innerScale + 10} M ${cx} ${cy + 55 * innerScale} L ${cx + 6} ${cy + 55 * innerScale + 10}`}
              stroke="#60a5fa"
              strokeWidth={2}
              fill="none"
              animate={{ opacity: [0.3, 0.8, 0.3] }}
              transition={{ duration: 1.5, repeat: Infinity }}
            />
          </>
        )}
      </svg>

      {/* Inhale dots indicator */}
      <div className="absolute top-2 left-1/2 -translate-x-1/2 flex gap-2">
        <div className={`w-3 h-3 rounded-full border-2 transition-all duration-300 ${
          isActive && (phase === 'inhale1' || phase === 'inhale2' || phase === 'exhale') ? 'bg-blue-500 border-blue-500' : 'bg-transparent border-blue-300'
        }`} />
        <div className={`w-3 h-3 rounded-full border-2 transition-all duration-300 ${
          isActive && (phase === 'inhale2' || phase === 'exhale') ? 'bg-blue-500 border-blue-500' : 'bg-transparent border-blue-300'
        }`} />
      </div>
    </div>
  )
}

export default function PhysiologicalSigh() {
  const breath = useBreathPattern<BreathingPhase>({
    pattern: PATTERN,
  })

  return (
    <Card className="max-w-md mx-auto">
      <CardHeader className="text-center">
        <CardTitle>Physiological Sigh</CardTitle>
        <CardDescription>Double inhale + long exhale for rapid calm</CardDescription>
      </CardHeader>
      
      <CardContent className="space-y-6 pb-6">
        <div className="flex flex-col items-center space-y-4">
          {/* Double Pulse Visualization */}
          <DoublePulseVisual phase={breath.current.phase} progress={breath.progressPercent} isActive={breath.isRunning} />
          
          {/* Cycle Indicator */}
          <div className="text-center">
            <div className="text-sm text-gray-600 dark:text-gray-400 min-h-[20px]">
              Cycle {breath.cycleCount + 1}
            </div>
          </div>

          {/* Progress Bar */}
          <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
            <div 
              className="bg-blue-500 h-2 rounded-full transition-all duration-100 ease-linear"
              style={{ width: `${breath.progressPercent}%` }}
            />
          </div>
        </div>

        {/* Instructions */}
        <div className="text-sm text-gray-600 text-center bg-gray-50 dark:bg-gray-800/50 p-3 rounded-xl">
          <p className="mb-2">The most effective calming breath:</p>
          <ul className="space-y-1">
            <li>• <strong>First inhale:</strong> Fill lower lungs (2s)</li>
            <li>• <strong>Second inhale:</strong> Top up upper lungs (1s)</li>
            <li>• <strong>Long exhale:</strong> Release slowly (6s)</li>
          </ul>
          <p className="text-xs text-gray-500 mt-2">Based on neuroscience research - just 1-3 cycles can reduce stress</p>
        </div>

        <div className="bg-gray-50 dark:bg-gray-800/50 border border-gray-200 dark:border-gray-700 rounded-xl p-3">
          <p className="text-sm text-yellow-800 dark:text-yellow-200 font-medium mb-2">⚡ Quick Relief</p>
          <p className="text-xs text-yellow-700">This technique works in just 1-3 breaths! Perfect for immediate stress relief.</p>
        </div>

        <div className="flex justify-center space-x-3">
          <Button onClick={breath.toggle} variant="calm" size="lg" className="flex items-center space-x-2">
            {breath.isRunning ? <Pause size={20} /> : <Play size={20} />}
            <span>{breath.isRunning ? 'Pause' : breath.isPaused ? 'Resume' : 'Start'}</span>
          </Button>
          <Button onClick={breath.reset} variant="outline" size="lg" className="flex items-center space-x-2">
            <RotateCcw size={20} />
            <span>Reset</span>
          </Button>
        </div>
      </CardContent>
      <div className="px-6 pb-6 pt-0"><div className="pt-4 mt-2 border-t border-gray-100 dark:border-gray-800 space-y-3">
        <div className="text-xs text-gray-600 dark:text-gray-400 bg-gray-50 dark:bg-gray-800/50 border border-gray-200 dark:border-gray-700 p-3 rounded-xl">
          About: The "physiological sigh" (double inhale, long exhale) has been shown to rapidly reduce autonomic arousal in lab settings.
          <br/>
          Evidence: <a className="underline text-blue-700" href="https://www.cell.com/cell-reports-medicine/fulltext/S2666-3791(22)00434-3" target="_blank" rel="noopener noreferrer">Cell Reports Medicine (2023) — Brief structured respiration practices vs. mindfulness</a>.
        </div>
        <ShareInline title="Physiological Sigh" text="Use the physiological sigh on CalmMyself" />
      </div></div>
    </Card>
  )
}
