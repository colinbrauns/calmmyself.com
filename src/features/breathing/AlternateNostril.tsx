"use client"

import { Shuffle } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import ShareInline from '@/components/ShareInline'
import { useBreathPattern } from '@/hooks/useBreathPattern'
import {
  EvidenceNote,
  ToolBody,
  ToolCard,
  ToolControls,
  ToolFooter,
  ToolHeader,
  ToolInfo,
  ToolProgress,
  ToolStage,
} from '@/components/CalmTool'

type Phase = 'inhaleL' | 'hold1' | 'exhaleR' | 'inhaleR' | 'hold2' | 'exhaleL'

const SEQ = [
  { phase: 'inhaleL', label: 'Inhale Left', durationMs: 4000 },
  { phase: 'hold1', label: 'Hold', durationMs: 4000 },
  { phase: 'exhaleR', label: 'Exhale Right', durationMs: 4000 },
  { phase: 'inhaleR', label: 'Inhale Right', durationMs: 4000 },
  { phase: 'hold2', label: 'Hold', durationMs: 4000 },
  { phase: 'exhaleL', label: 'Exhale Left', durationMs: 4000 },
] as const

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
  const breath = useBreathPattern<Phase>({
    pattern: SEQ,
  })

  const current = breath.current

  const leftActive = current.phase === 'inhaleL' || current.phase === 'exhaleL'
  const rightActive = current.phase === 'inhaleR' || current.phase === 'exhaleR'
  const isHold = current.phase === 'hold1' || current.phase === 'hold2'

  return (
    <ToolCard>
      <ToolHeader
        icon={Shuffle}
        title="Alternate Nostril Breathing"
        description="Balanced left/right breathing for focus"
        tone="grounding"
      />
      <ToolBody>
        {/* Nostril Diagram */}
        <ToolStage>
          <div data-testid="tool-visual" className="relative">
            <NostrilDiagram leftActive={leftActive} rightActive={rightActive} isHold={isHold} isActive={breath.isRunning} />
            <div className="pointer-events-none absolute inset-0 flex items-center justify-center pt-8">
              <div className="rounded bg-white/75 px-2 py-0.5 text-sm font-semibold text-grounding-800 dark:bg-gray-900/70 dark:text-grounding-100">
                {breath.displaySeconds}
              </div>
            </div>
          </div>
          <div className="text-2xl font-semibold text-grounding-800 dark:text-gray-100 mb-2 min-h-[32px]">
            <AnimatePresence mode="wait">
              <motion.span key={current.label} initial={{opacity:0,y:6}} animate={{opacity:1,y:0}} exit={{opacity:0,y:-6}} transition={{duration:0.25}}>
                {current.label}
              </motion.span>
            </AnimatePresence>
          </div>
          <div className="text-sm text-gray-600 dark:text-gray-400">Cycle {breath.cycleCount + 1}</div>
          <ToolProgress value={breath.progressPercent} tone="grounding" />
        </ToolStage>

        <ToolControls
          isRunning={breath.isRunning}
          isPaused={breath.isPaused}
          onToggle={breath.toggle}
          onReset={breath.reset}
          tone="grounding"
        />

        <ToolInfo tone="grounding">
          Use your right hand: thumb closes the right nostril, ring finger closes the left. Breathe softly.
        </ToolInfo>
      </ToolBody>
      <ToolFooter>
        <EvidenceNote>
          Alternate nostril breathing may help reduce perceived stress and improve attention in some studies.
          <br/>
          Evidence: Look up controlled trials on "alternate nostril breathing attention anxiety".
        </EvidenceNote>
        <ShareInline title="Alternate Nostril Breathing" text="Try alternate nostril breathing on CalmMyself" />
      </ToolFooter>
    </ToolCard>
  )
}
