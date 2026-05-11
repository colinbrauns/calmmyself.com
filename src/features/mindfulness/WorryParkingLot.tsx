"use client"

import { useEffect, useState } from 'react'
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import ShareInline from '@/components/ShareInline'
import { motion, AnimatePresence } from 'framer-motion'
import { Trash2, CheckCircle, Archive, RotateCcw, ArrowLeft, ArrowRight } from 'lucide-react'

const STORAGE_KEY = 'calmmyself:worry-parking'

interface WorryEntry {
  worry: string
  action: string
  when: string
}

const STEPS = [
  { field: 'worry' as const, label: 'What is the worry?', placeholder: 'Briefly describe it...', type: 'textarea' as const },
  { field: 'action' as const, label: 'What is actually in your control?', placeholder: 'One small step...', type: 'textarea' as const },
  { field: 'when' as const, label: 'When will you come back to this?', placeholder: 'e.g. Tomorrow at 10:00', type: 'input' as const },
]

export default function WorryParkingLot() {
  const [entry, setEntry] = useState<WorryEntry>({ worry: '', action: '', when: '' })
  const [stepIndex, setStepIndex] = useState(0)
  const [isParked, setIsParked] = useState(false)

  useEffect(() => {
    if (typeof window === 'undefined') return
    try {
      const raw = window.localStorage.getItem(STORAGE_KEY)
      if (!raw) return
      const parsed = JSON.parse(raw) as Partial<WorryEntry>
      if (parsed.worry || parsed.action || parsed.when) {
        setEntry({ worry: parsed.worry ?? '', action: parsed.action ?? '', when: parsed.when ?? '' })
        setIsParked(true)
      }
    } catch {}
  }, [])

  useEffect(() => {
    if (typeof window === 'undefined') return
    try { window.localStorage.setItem(STORAGE_KEY, JSON.stringify(entry)) } catch {}
  }, [entry])

  const step = STEPS[stepIndex]
  const isLast = stepIndex === STEPS.length - 1

  const onChange = (value: string) => {
    setEntry((prev) => ({ ...prev, [step.field]: value }))
  }

  const next = () => {
    if (!isLast) setStepIndex((i) => i + 1)
    else setIsParked(true)
  }

  const back = () => {
    if (stepIndex > 0) setStepIndex((i) => i - 1)
  }

  const reset = () => {
    setEntry({ worry: '', action: '', when: '' })
    setStepIndex(0)
    setIsParked(false)
  }

  if (isParked) {
    return (
      <Card className="max-w-md mx-auto">
        <CardContent className="text-center py-10 space-y-5">
          <motion.div
            initial={{ y: -30, opacity: 0, rotate: -3 }}
            animate={{ y: 0, opacity: 1, rotate: 2 }}
            transition={{ type: 'spring', bounce: 0.4 }}
            className="bg-yellow-50 dark:bg-yellow-950/30 border-2 border-yellow-200 dark:border-yellow-800/50 rounded-xl p-5 max-w-xs mx-auto shadow-md relative"
          >
            <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-yellow-200 dark:bg-yellow-800/50 px-2 py-0.5 rounded text-[10px] font-bold tracking-widest uppercase text-yellow-800 dark:text-yellow-200">
              Parked Ticket
            </div>
            <div className="space-y-2.5 text-left mt-1">
              {entry.worry && <div><p className="text-[10px] text-gray-400 uppercase font-bold">Worry</p><p className="text-xs text-gray-800 dark:text-gray-200 line-clamp-2">{entry.worry}</p></div>}
              {entry.action && <div><p className="text-[10px] text-gray-400 uppercase font-bold">In my control</p><p className="text-xs text-gray-800 dark:text-gray-200 line-clamp-2">{entry.action}</p></div>}
              {entry.when && <div><p className="text-[10px] text-gray-400 uppercase font-bold">Revisit</p><p className="text-xs text-gray-800 dark:text-gray-200">{entry.when}</p></div>}
            </div>
            <div className="mt-3 pt-2 border-t border-dashed border-yellow-200 dark:border-yellow-800/50 flex items-center justify-center gap-1.5 text-green-600 text-xs font-bold uppercase">
              <CheckCircle size={12} /> Safe & Sound
            </div>
          </motion.div>

          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}>
            <h3 className="text-xl font-semibold text-gray-800 dark:text-gray-100">Worry parked \ud83d\udee4\ufe0f</h3>
            <p className="text-gray-600 dark:text-gray-400 mt-2 text-sm">
              You don&apos;t need to carry it right now. It&apos;s here when you&apos;re ready to come back to it.
            </p>
          </motion.div>

          <div className="flex gap-3 justify-center pt-2">
            <Button onClick={reset} variant="grounding" size="lg" className="gap-2">
              <RotateCcw size={16} /> Park Another
            </Button>
            <Button onClick={() => window.history.back()} variant="outline" size="lg" className="gap-2">
              <ArrowLeft size={16} /> Back
            </Button>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="max-w-md mx-auto">
      <CardHeader className="text-center">
        <div className="flex items-center justify-center gap-2 mb-2">
          <Archive className="w-5 h-5 text-amber-600" />
          <CardTitle>Worry Parking Lot</CardTitle>
        </div>
        <CardDescription>Park a worry so you can return to calm for now</CardDescription>
      </CardHeader>

      <CardContent className="space-y-6">
        <div className="flex items-center justify-between text-sm text-gray-600 dark:text-gray-400">
          <span>Step {stepIndex + 1} of {STEPS.length}</span>
        </div>
        <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
          <div className="bg-yellow-400 h-2 rounded-full transition-all duration-300" style={{ width: `${((stepIndex + 1) / STEPS.length) * 100}%` }} />
        </div>

        <AnimatePresence mode="wait">
          <motion.div
            key={stepIndex}
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -30 }}
            className="space-y-3"
          >
            <label className="block font-medium text-gray-700 dark:text-gray-200">{step.label}</label>
            {step.type === 'textarea' ? (
              <textarea
                rows={3}
                className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-xl bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 placeholder-gray-400 focus:ring-2 focus:ring-yellow-500 focus:border-yellow-500"
                placeholder={step.placeholder}
                value={entry[step.field]}
                onChange={(e) => onChange(e.target.value)}
              />
            ) : (
              <input
                type="text"
                className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-xl bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 placeholder-gray-400 focus:ring-2 focus:ring-yellow-500 focus:border-yellow-500"
                placeholder={step.placeholder}
                value={entry[step.field]}
                onChange={(e) => onChange(e.target.value)}
              />
            )}
          </motion.div>
        </AnimatePresence>

        <div className="flex justify-between gap-3">
          <Button variant="outline" size="sm" onClick={back} disabled={stepIndex === 0}>
            <ArrowLeft size={16} />
          </Button>
          <div className="flex gap-2">
            <Button variant="ghost" size="sm" onClick={reset} className="text-gray-400">
              <Trash2 size={16} />
            </Button>
            <Button variant="grounding" size="lg" onClick={next} className="gap-2">
              {isLast ? <><Archive size={16} /> Park It</> : <>Next <ArrowRight size={16} /></>}
            </Button>
          </div>
        </div>
      </CardContent>

      <div className="px-6 pb-6 pt-0"><div className="pt-4 mt-2 border-t border-gray-100 dark:border-gray-800">
        <ShareInline title="Worry Parking Lot" text="Use the Worry Parking Lot to capture and schedule worries on CalmMyself." />
      </div></div>
    </Card>
  )
}
