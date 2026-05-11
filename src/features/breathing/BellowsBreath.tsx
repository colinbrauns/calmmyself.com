'use client'

import { Zap } from 'lucide-react'
import { motion } from 'framer-motion'
import ShareInline from '@/components/ShareInline'
import { useBreathPattern } from '@/hooks/useBreathPattern'
import {
  CompletionCard,
  EvidenceNote,
  ToolBody,
  ToolCard,
  ToolControls,
  ToolFooter,
  ToolHeader,
  ToolProgress,
  ToolStage,
} from '@/components/CalmTool'

const TOTAL_CYCLES = 30
const PATTERN = [
  { phase: 'in', label: 'IN', durationMs: 1000 },
  { phase: 'out', label: 'OUT', durationMs: 1000 },
] as const

export default function BellowsBreath() {
  const breath = useBreathPattern({
    pattern: PATTERN,
    maxCycles: TOTAL_CYCLES,
  })

  const reset = () => {
    breath.reset()
  }

  if (breath.isComplete) {
    return (
      <CompletionCard
        icon={<Zap className="h-10 w-10 text-amber-600" />}
        title="Energized"
        description={`You completed ${TOTAL_CYCLES} cycles of bellows breathing. Notice the energy in your body.`}
        onAction={reset}
        tone="amber"
      >
        <ShareInline title="Bellows Breath" text="Energizing bellows breathing on CalmMyself" />
      </CompletionCard>
    )
  }

  const lungScale = breath.isRunning ? (breath.current.phase === 'in' ? 1.3 : 0.7) : 1

  return (
    <ToolCard>
      <ToolHeader
        icon={Zap}
        title="Bellows Breath"
        description={`Rapid energizing breath: 1s in, 1s out, ${TOTAL_CYCLES} cycles`}
        tone="amber"
      />
      <ToolBody>
        <ToolStage>
          <div data-testid="tool-visual" className="relative w-32 h-40 flex items-center justify-center">
            <motion.div
              className="w-24 h-32 rounded-[40%] bg-gradient-to-b from-amber-200 to-amber-400 dark:from-amber-700 dark:to-amber-900 opacity-60"
              initial={false}
              animate={{ scaleY: lungScale, scaleX: lungScale * 0.8 }}
              transition={{ duration: breath.isRunning ? 0.4 : 0, ease: 'easeInOut' }}
            />
            <div className="absolute inset-0 flex items-center justify-center">
              <span className="text-lg font-bold text-amber-800 dark:text-amber-200">
                {breath.isRunning ? breath.current.label : breath.isPaused ? 'PAUSED' : 'READY'}
              </span>
            </div>
          </div>
          <div className="text-center">
            <p className="text-2xl font-bold text-gray-800 dark:text-gray-100">{breath.cycleCount} / {TOTAL_CYCLES}</p>
            <p className="text-sm text-gray-500 dark:text-gray-400">cycles completed</p>
          </div>
          <ToolProgress value={(breath.cycleCount / TOTAL_CYCLES) * 100} tone="amber" />
        </ToolStage>

        <ToolControls
          isRunning={breath.isRunning}
          isPaused={breath.isPaused}
          onToggle={breath.toggle}
          onReset={reset}
          tone="amber"
        />

      </ToolBody>
      <ToolFooter>
        <EvidenceNote>
          Bellows Breath is energizing. Breathe through the nose with equal emphasis on inhale and exhale, and stop if dizzy.
        </EvidenceNote>
        <ShareInline title="Bellows Breath" text="Energizing bellows breathing on CalmMyself" />
      </ToolFooter>
    </ToolCard>
  )
}
