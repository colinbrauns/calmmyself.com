"use client"

import { useCallback, useEffect, useState } from 'react'
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { Play, Pause, RotateCcw } from 'lucide-react'
import ShareInline from '@/components/ShareInline'

interface Region {
  name: string
  instruction: string
}

const REGIONS: Region[] = [
  {
    name: 'Face & Shoulders',
    instruction: 'Scrunch your face gently and raise your shoulders toward your ears.',
  },
  {
    name: 'Chest & Arms',
    instruction: 'Gently squeeze your arms and chest, as if giving yourself a small hug.',
  },
  {
    name: 'Legs & Feet',
    instruction: 'Press your legs together and gently point your toes or press heels into the floor.',
  },
]

type Phase = 'ready' | 'tense' | 'relax' | 'complete'

const TENSE_MS = 5000
const RELAX_MS = 10000

export default function BodyMelt() {
  const [regionIndex, setRegionIndex] = useState(0)
  const [phase, setPhase] = useState<Phase>('ready')
  const [remaining, setRemaining] = useState(0)
  const [isActive, setIsActive] = useState(false)

  const region = REGIONS[regionIndex]

  const startTense = useCallback(() => {
    setPhase('tense')
    setRemaining(TENSE_MS)
    setIsActive(true)
  }, [])

  const startRelax = useCallback(() => {
    setPhase('relax')
    setRemaining(RELAX_MS)
  }, [])

  const nextRegion = useCallback(() => {
    if (regionIndex < REGIONS.length - 1) {
      setRegionIndex((i) => i + 1)
      setPhase('ready')
      setIsActive(false)
      setRemaining(0)
    } else {
      setPhase('complete')
      setIsActive(false)
    }
  }, [regionIndex])

  const reset = useCallback(() => {
    setRegionIndex(0)
    setPhase('ready')
    setRemaining(0)
    setIsActive(false)
  }, [])

  useEffect(() => {
    if (!isActive || remaining <= 0) return
    const id = setInterval(() => {
      setRemaining((t) => {
        const next = t - 100
        if (next <= 0) {
          if (phase === 'tense') {
            startRelax()
            return RELAX_MS
          }
          if (phase === 'relax') {
            nextRegion()
            return 0
          }
        }
        return next
      })
    }, 100)
    return () => clearInterval(id)
  }, [isActive, remaining, phase, startRelax, nextRegion])

  if (phase === 'complete') {
    return (
      <Card className="max-w-md mx-auto">
        <CardContent className="text-center py-8">
          <h2 className="text-2xl font-semibold text-grounding-700 dark:text-gray-100 mb-2">
            Body Melt Complete
          </h2>
          <p className="text-gray-600 mb-6">
            You&apos;ve done one gentle pass of tensing and relaxing your body. Notice any areas
            that feel softer or heavier.
          </p>
          <Button onClick={reset} variant="grounding" size="lg">
            Do Another Pass
          </Button>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="max-w-md mx-auto">
      <CardHeader className="text-center">
        <CardTitle>Body Melt (Mini PMR)</CardTitle>
        <CardDescription>Three quick regions to soften before rest</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="flex items-center justify-between text-sm text-gray-600 dark:text-gray-400">
          <span>
            Region {regionIndex + 1} of {REGIONS.length}
          </span>
          <span>{remaining > 0 ? `${Math.ceil(remaining / 1000)}s` : null}</span>
        </div>

        <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
          <div
            className="bg-sky-500 h-2 rounded-full transition-all duration-300"
            style={{ width: `${(regionIndex / REGIONS.length) * 100}%` }}
          />
        </div>

        <div className="text-center space-y-2">
          <h3 className="text-xl font-semibold text-grounding-800 dark:text-gray-100">{region.name}</h3>
          <p className="text-sm text-gray-700 dark:text-gray-400">{region.instruction}</p>
        </div>

        <div className="bg-gray-50 dark:bg-gray-800/50 border border-gray-200 dark:border-gray-700 rounded-xl p-3 text-xs text-gray-700 dark:text-gray-400">
          {phase === 'ready' && (
            <p>
              When you&apos;re ready, press Start. You&apos;ll gently tense for about 5 seconds, then
              relax for about 10 seconds.
            </p>
          )}
          {phase === 'tense' && (
            <p>
              TENSE: Hold the tension at about 60–70% of your maximum. Avoid pain or strain, and
              stop early if anything feels off.
            </p>
          )}
          {phase === 'relax' && (
            <p>
              RELAX: Let the muscles soften completely. Notice the difference between tension and
              release.
            </p>
          )}
        </div>

        <div className="flex justify-center gap-3">
          {phase === 'ready' && (
            <Button
              onClick={startTense}
              variant="grounding"
              size="lg"
              className="flex items-center gap-2"
            >
              <Play size={20} />
              <span>Start</span>
            </Button>
          )}
          {(phase === 'tense' || phase === 'relax') && (
            <Button
              onClick={() => setIsActive((a) => !a)}
              variant={isActive ? 'outline' : 'grounding'}
              size="lg"
              className="flex items-center gap-2"
            >
              {isActive ? <Pause size={20} /> : <Play size={20} />}
              <span>{isActive ? 'Pause' : 'Resume'}</span>
            </Button>
          )}
          <Button
            onClick={reset}
            variant="outline"
            size="lg"
            className="flex items-center gap-2"
          >
            <RotateCcw size={20} />
            <span>Reset</span>
          </Button>
        </div>
      </CardContent>
      <div className="px-6 pb-6 pt-0"><div className="pt-4 mt-2 border-t border-gray-100 dark:border-gray-800">
        <ShareInline
          title="Body Melt"
          text="Try a short Body Melt relaxation sequence on CalmMyself."
        />
      </div></div>
    </Card>
  )
}


