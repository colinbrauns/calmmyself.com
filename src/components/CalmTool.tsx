'use client'

import type { ComponentType, ReactNode } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { Pause, Play, RotateCcw } from 'lucide-react'
import { Button, type ButtonProps } from '@/components/ui/Button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/Card'

type ToolTone = 'calm' | 'grounding' | 'teal' | 'amber' | 'neutral'

const toneClasses = {
  calm: {
    icon: 'text-sky-500',
    title: 'text-sky-800 dark:text-sky-100',
    phase: 'text-sky-800 dark:text-sky-100',
    progress: 'bg-sky-500',
    info: 'bg-sky-50/70 border-sky-100 text-sky-900 dark:bg-sky-950/20 dark:border-sky-900/40 dark:text-sky-100',
    button: 'calm',
  },
  grounding: {
    icon: 'text-amber-500',
    title: 'text-amber-800 dark:text-amber-100',
    phase: 'text-amber-800 dark:text-amber-100',
    progress: 'bg-amber-500',
    info: 'bg-amber-50/70 border-amber-100 text-amber-900 dark:bg-amber-950/20 dark:border-amber-900/40 dark:text-amber-100',
    button: 'grounding',
  },
  teal: {
    icon: 'text-teal-500',
    title: 'text-teal-800 dark:text-teal-100',
    phase: 'text-teal-800 dark:text-teal-100',
    progress: 'bg-teal-500',
    info: 'bg-teal-50/70 border-teal-100 text-teal-900 dark:bg-teal-950/20 dark:border-teal-900/40 dark:text-teal-100',
    button: 'calm',
  },
  amber: {
    icon: 'text-amber-500',
    title: 'text-amber-800 dark:text-amber-100',
    phase: 'text-amber-800 dark:text-amber-100',
    progress: 'bg-amber-500',
    info: 'bg-amber-50/70 border-amber-100 text-amber-900 dark:bg-amber-950/20 dark:border-amber-900/40 dark:text-amber-100',
    button: 'calm',
  },
  neutral: {
    icon: 'text-gray-500',
    title: 'text-gray-900 dark:text-gray-100',
    phase: 'text-gray-900 dark:text-gray-100',
    progress: 'bg-sky-500',
    info: 'bg-gray-50/80 border-gray-200 text-gray-700 dark:bg-gray-800/50 dark:border-gray-700 dark:text-gray-300',
    button: 'calm',
  },
} as const

function getTone(tone: ToolTone = 'calm') {
  return toneClasses[tone]
}

export function ToolCard({ children, className = '' }: { children: ReactNode; className?: string }) {
  return (
    <Card className={`mx-auto max-w-md overflow-hidden rounded-lg ${className}`}>
      {children}
    </Card>
  )
}

export function ToolHeader({
  icon: Icon,
  title,
  description,
  tone = 'calm',
}: {
  icon?: ComponentType<{ className?: string }>
  title: string
  description: string
  tone?: ToolTone
}) {
  const classes = getTone(tone)

  return (
    <CardHeader className="items-center px-5 pb-2 pt-5 text-center">
      <div className="flex items-center justify-center gap-2">
        {Icon && <Icon className={`h-5 w-5 ${classes.icon}`} />}
        <CardTitle className={`text-base ${classes.title}`}>{title}</CardTitle>
      </div>
      <CardDescription className="max-w-xs leading-relaxed">{description}</CardDescription>
    </CardHeader>
  )
}

export function ToolBody({ children, className = '' }: { children: ReactNode; className?: string }) {
  return <CardContent className={`space-y-5 px-5 pb-5 ${className}`}>{children}</CardContent>
}

export function ToolStage({ children, className = '' }: { children: ReactNode; className?: string }) {
  return (
    <div data-testid="tool-stage" className={`flex flex-col items-center gap-4 ${className}`}>
      {children}
    </div>
  )
}

export function PhaseReadout({
  label,
  detail,
  tone = 'calm',
}: {
  label: ReactNode
  detail?: ReactNode
  tone?: ToolTone
}) {
  const classes = getTone(tone)

  return (
    <div data-testid="phase-readout" className="min-h-[64px] text-center">
      <div className={`mb-1 min-h-[32px] text-2xl font-semibold leading-tight ${classes.phase}`}>
        <AnimatePresence mode="wait">
          <motion.span
            key={String(label)}
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -6 }}
            transition={{ duration: 0.22, ease: 'easeOut' }}
          >
            {label}
          </motion.span>
        </AnimatePresence>
      </div>
      {detail && <div className="text-sm text-gray-600 dark:text-gray-400">{detail}</div>}
    </div>
  )
}

export function ToolProgress({
  value,
  tone = 'calm',
  className = '',
}: {
  value: number
  tone?: ToolTone
  className?: string
}) {
  const width = `${Math.min(Math.max(value, 0), 100)}%`

  return (
    <div data-testid="tool-progress" className={`h-2 w-full rounded-full bg-gray-200 dark:bg-gray-700 ${className}`}>
      <div
        className={`h-2 rounded-full transition-all duration-100 ease-linear ${getTone(tone).progress}`}
        style={{ width }}
      />
    </div>
  )
}

export function ToolControls({
  isRunning,
  isPaused,
  onToggle,
  onReset,
  tone = 'calm',
  startLabel = 'Start',
  resumeLabel = 'Resume',
  pauseLabel = 'Pause',
  resetLabel = 'Reset',
  resetDisabled = false,
  startAriaLabel,
  pauseAriaLabel,
}: {
  isRunning: boolean
  isPaused?: boolean
  onToggle: () => void
  onReset: () => void
  tone?: ToolTone
  startLabel?: string
  resumeLabel?: string
  pauseLabel?: string
  resetLabel?: string
  resetDisabled?: boolean
  startAriaLabel?: string
  pauseAriaLabel?: string
}) {
  const variant = getTone(tone).button as ButtonProps['variant']
  const label = isRunning ? pauseLabel : isPaused ? resumeLabel : startLabel

  return (
    <div data-testid="tool-controls" className="flex flex-wrap justify-center gap-3">
      <Button
        onClick={onToggle}
        variant={isRunning ? 'outline' : variant}
        size="lg"
        className="min-w-[8rem] gap-2"
        aria-label={isRunning ? pauseAriaLabel || pauseLabel : startAriaLabel || startLabel}
      >
        {isRunning ? <Pause size={18} /> : <Play size={18} />}
        {label}
      </Button>
      <Button
        onClick={onReset}
        variant="outline"
        size="lg"
        className="min-w-[8rem] gap-2"
        aria-label={resetLabel}
        disabled={resetDisabled}
      >
        <RotateCcw size={18} />
        {resetLabel}
      </Button>
    </div>
  )
}

export function ToolInfo({
  children,
  tone = 'neutral',
  className = '',
}: {
  children: ReactNode
  tone?: ToolTone
  className?: string
}) {
  return (
    <div className={`rounded-lg border p-3 text-sm leading-relaxed ${getTone(tone).info} ${className}`}>
      {children}
    </div>
  )
}

export function ToolFooter({ children }: { children: ReactNode }) {
  return (
    <div className="border-t border-gray-100 px-5 pb-5 pt-4 dark:border-gray-800">
      <div className="space-y-3">{children}</div>
    </div>
  )
}

export function EvidenceNote({ children }: { children: ReactNode }) {
  return (
    <div className="rounded-lg border border-gray-200 bg-gray-50/80 p-3 text-xs leading-relaxed text-gray-600 dark:border-gray-700 dark:bg-gray-800/50 dark:text-gray-400">
      {children}
    </div>
  )
}

export function CompletionCard({
  icon,
  title,
  description,
  actionLabel = 'Do Again',
  onAction,
  children,
  tone = 'calm',
}: {
  icon: ReactNode
  title: string
  description: string
  actionLabel?: string
  onAction: () => void
  children?: ReactNode
  tone?: ToolTone
}) {
  return (
    <ToolCard>
      <ToolBody className="py-12 text-center">
        <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-gray-100 dark:bg-gray-800">
          {icon}
        </div>
        <div>
          <h3 className="mb-2 text-xl font-semibold text-gray-900 dark:text-gray-100">{title}</h3>
          <p className="text-sm leading-relaxed text-gray-500 dark:text-gray-400">{description}</p>
        </div>
        <Button onClick={onAction} variant={getTone(tone).button as ButtonProps['variant']} size="lg">
          {actionLabel}
        </Button>
        {children}
      </ToolBody>
    </ToolCard>
  )
}

export function DurationSelector({
  values,
  value,
  onChange,
  unit = 'min',
  tone = 'teal',
}: {
  values: readonly number[]
  value: number
  onChange: (value: number) => void
  unit?: string
  tone?: ToolTone
}) {
  const selectedClass = tone === 'teal' ? 'bg-teal-600 text-white' : 'bg-sky-600 text-white'

  return (
    <div className="flex justify-center gap-2">
      {values.map((option) => (
        <button
          key={option}
          type="button"
          onClick={() => onChange(option)}
          className={`rounded-lg px-4 py-2 text-sm font-medium transition-colors ${
            option === value
              ? selectedClass
              : 'bg-gray-100 text-gray-600 hover:bg-gray-200 dark:bg-gray-800 dark:text-gray-400 dark:hover:bg-gray-700'
          }`}
        >
          {option} {unit}
        </button>
      ))}
    </div>
  )
}
