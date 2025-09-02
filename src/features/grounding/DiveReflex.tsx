"use client"

import { useEffect, useState } from 'react'
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { Snowflake, RotateCcw, Play, Pause } from 'lucide-react'
import { motion } from 'framer-motion'
import ShareInline from '@/components/ShareInline'

export default function DiveReflex() {
  const [isActive, setIsActive] = useState(false)
  const [remaining, setRemaining] = useState(30)

  useEffect(() => {
    if (!isActive) return
    const id = setInterval(() => setRemaining((s) => (s <= 1 ? 0 : s - 1)), 1000)
    return () => clearInterval(id)
  }, [isActive])

  const reset = () => { setIsActive(false); setRemaining(30) }

  return (
    <Card className="max-w-md mx-auto">
      <CardHeader className="text-center">
        <div className="flex items-center justify-center gap-2 mb-2">
          <Snowflake className="w-5 h-5 text-calm-600" />
          <CardTitle>Dive Reflex Activation</CardTitle>
        </div>
        <CardDescription>Cool face/neck for ~30s to trigger calming reflex</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="relative h-24 rounded-md overflow-hidden bg-gradient-to-r from-calm-50 to-blue-50">
          <motion.div
            className="absolute inset-0"
            initial={{ backgroundPositionX: 0 }}
            animate={{ backgroundPositionX: '200%' }}
            transition={{ duration: 6, repeat: Infinity, ease: 'linear' }}
            style={{ backgroundImage: 'radial-gradient(60px 12px at 30% 50%, rgba(14,165,233,0.25), transparent 60%)' }}
          />
          <div className="absolute inset-0 flex items-center justify-center text-2xl font-semibold text-calm-800">
            {remaining}s
          </div>
        </div>
        <div className="text-sm text-gray-700 bg-calm-50 border border-calm-100 p-3 rounded-md">
          Press a cool pack or cold water cloth to your face (esp. around eyes/upper cheeks) and lean forward if comfortable. Breathe slowly while the timer runs.
        </div>
        <div className="flex justify-center gap-3">
          <Button onClick={() => setIsActive((a) => !a)} variant="calm" size="lg" className="flex items-center gap-2">
            {isActive ? <Pause size={18}/> : <Play size={18}/>} {isActive ? 'Pause' : 'Start'}
          </Button>
          <Button onClick={reset} variant="outline" size="lg" className="flex items-center gap-2"><RotateCcw size={18}/>Reset</Button>
        </div>
      </CardContent>
      <div className="px-6 pb-6 space-y-3">
        <div className="text-xs text-gray-600 bg-calm-50 border border-calm-100 p-3 rounded-md">
          About: Cooling the face can stimulate the mammalian dive reflex, increasing vagal tone and slowing heart rate.
          <br/>
          Evidence: See physiology texts on the “mammalian dive reflex” and trigeminal stimulation.
        </div>
        <ShareInline title="Dive Reflex Activation" text="Activate the dive reflex timer on CalmMyself" />
      </div>
    </Card>
  )
}
