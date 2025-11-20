"use client"

import { useEffect, useState } from 'react'
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import ShareInline from '@/components/ShareInline'
import { motion, AnimatePresence } from 'framer-motion'
import { Trash2, CheckCircle, Archive } from 'lucide-react'

const STORAGE_KEY = 'calmmyself:worry-parking'

interface WorryEntry {
  worry: string
  action: string
  when: string
}

export default function WorryParkingLot() {
  const [entry, setEntry] = useState<WorryEntry>({ worry: '', action: '', when: '' })
  const [isParked, setIsParked] = useState(false)

  useEffect(() => {
    if (typeof window === 'undefined') return
    try {
      const raw = window.localStorage.getItem(STORAGE_KEY)
      if (!raw) return
      const parsed = JSON.parse(raw) as Partial<WorryEntry>
      if (parsed.worry || parsed.action || parsed.when) {
         setEntry((prev) => ({
           worry: parsed.worry ?? prev.worry,
           action: parsed.action ?? prev.action,
           when: parsed.when ?? prev.when,
         }))
         // If there's already data, assume it's "parked" for visual purposes
         // unless the user starts editing again.
         setIsParked(true)
      }
    } catch {
      // ignore
    }
  }, [])

  useEffect(() => {
    if (typeof window === 'undefined') return
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(entry))
    } catch {
      // ignore
    }
  }, [entry])

  const onChange = (field: keyof WorryEntry, value: string) => {
    setEntry((prev) => ({ ...prev, [field]: value }))
    if (isParked) setIsParked(false)
  }

  const onPark = () => {
     if (entry.worry.trim() || entry.action.trim() || entry.when.trim()) {
        setIsParked(true)
     }
  }

  const onClear = () => {
     setEntry({ worry: '', action: '', when: '' })
     setIsParked(false)
  }

  return (
    <Card className="max-w-md mx-auto overflow-hidden">
      <CardHeader className="text-center z-10 relative bg-white/80 backdrop-blur-sm">
        <CardTitle>Worry Parking Lot</CardTitle>
        <CardDescription>Park a worry so you can return to calm for now</CardDescription>
      </CardHeader>

      <CardContent className="space-y-6 relative min-h-[400px]">
        <AnimatePresence mode="wait">
          {isParked ? (
            <motion.div
              key="parked-view"
              initial={{ y: -50, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: 50, opacity: 0 }}
              className="flex flex-col items-center justify-center py-12 space-y-6 text-center"
            >
              {/* Visual Parking Ticket */}
              <motion.div 
                 className="relative bg-yellow-50 border-2 border-yellow-200 p-6 rounded-lg shadow-md w-full max-w-xs rotate-1"
                 initial={{ scale: 0.9 }}
                 animate={{ scale: 1, rotate: 2 }}
                 transition={{ type: "spring", bounce: 0.4 }}
              >
                 <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-yellow-200 px-2 py-0.5 rounded text-[10px] font-bold tracking-widest uppercase text-yellow-800">
                    Parked Ticket
                 </div>
                 
                 <div className="space-y-3 text-left">
                    <div>
                       <p className="text-[10px] text-gray-400 uppercase font-bold">Worry</p>
                       <p className="text-sm text-gray-800 font-medium line-clamp-2">{entry.worry || "—"}</p>
                    </div>
                    <div>
                       <p className="text-[10px] text-gray-400 uppercase font-bold">Action</p>
                       <p className="text-sm text-gray-800 line-clamp-2">{entry.action || "—"}</p>
                    </div>
                    <div>
                       <p className="text-[10px] text-gray-400 uppercase font-bold">Revisit</p>
                       <p className="text-sm text-gray-800">{entry.when || "—"}</p>
                    </div>
                 </div>
                 
                 <div className="mt-4 pt-3 border-t border-dashed border-yellow-200 flex items-center justify-center gap-2 text-green-600 text-xs font-bold uppercase">
                    <CheckCircle size={12} /> Safe & Sound
                 </div>
              </motion.div>

              <div className="space-y-2 max-w-xs">
                 <p className="text-gray-600 text-sm">
                    Your worry is safely parked. You don&apos;t need to carry it right now.
                 </p>
                 <Button 
                    onClick={() => setIsParked(false)} 
                    variant="outline" 
                    size="sm"
                    className="mt-2"
                 >
                    Edit Ticket
                 </Button>
              </div>
            </motion.div>
          ) : (
            <motion.div
              key="edit-form"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="space-y-4"
            >
               <div className="text-xs text-gray-600 bg-grounding-50 border border-grounding-100 p-3 rounded-md">
                Capture a worry, choose what&apos;s actually in your control, and decide when you&apos;ll revisit it.
               </div>

              <div className="space-y-3 text-sm">
                <div>
                  <label className="block font-medium text-gray-700 mb-1">
                    1. What is the worry?
                  </label>
                  <textarea
                    rows={2}
                    className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-grounding-500 focus:border-grounding-500"
                    value={entry.worry}
                    onChange={(e) => onChange('worry', e.target.value)}
                    placeholder="Briefly describe it..."
                  />
                </div>

                <div>
                  <label className="block font-medium text-gray-700 mb-1">
                    2. What is actually in your control?
                  </label>
                  <textarea
                    rows={2}
                    className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-grounding-500 focus:border-grounding-500"
                    value={entry.action}
                    onChange={(e) => onChange('action', e.target.value)}
                    placeholder="One small step..."
                  />
                </div>

                <div>
                  <label className="block font-medium text-gray-700 mb-1">
                    3. When will you come back to this?
                  </label>
                  <input
                    type="text"
                    className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-grounding-500 focus:border-grounding-500"
                    placeholder="e.g. Tomorrow at 10:00"
                    value={entry.when}
                    onChange={(e) => onChange('when', e.target.value)}
                  />
                </div>
              </div>

              <div className="flex items-center gap-3 pt-2">
                <Button 
                   variant="ghost" 
                   size="sm" 
                   onClick={onClear}
                   className="text-gray-400 hover:text-red-500"
                   title="Clear Form"
                >
                  <Trash2 size={16} />
                </Button>
                <Button 
                   onClick={onPark} 
                   variant="grounding" 
                   className="flex-1 gap-2"
                   disabled={!entry.worry && !entry.action && !entry.when}
                >
                   <Archive size={16} /> Park It
                </Button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </CardContent>

      <div className="px-6 pb-6 z-10 relative">
        <ShareInline
          title="Worry Parking Lot"
          text="Use the Worry Parking Lot to capture and schedule worries on CalmMyself."
        />
      </div>
    </Card>
  )
}


