'use client'

import { useCallback, useEffect, useMemo, useRef, useState } from 'react'

export type BreathRunStatus = 'idle' | 'running' | 'paused' | 'complete'

export interface BreathPatternStep<TPhase extends string = string> {
  phase: TPhase
  label: string
  durationMs: number
}

interface BreathSnapshot {
  status: BreathRunStatus
  phaseIndex: number
  cycleCount: number
  elapsedMs: number
}

interface UseBreathPatternOptions<TPhase extends string> {
  pattern: readonly BreathPatternStep<TPhase>[]
  maxCycles?: number
  tickMs?: number
  onComplete?: (cycleCount: number) => void
}

const INITIAL_SNAPSHOT: BreathSnapshot = {
  status: 'idle',
  phaseIndex: 0,
  cycleCount: 0,
  elapsedMs: 0,
}

export function useBreathPattern<TPhase extends string>({
  pattern,
  maxCycles,
  tickMs = 100,
  onComplete,
}: UseBreathPatternOptions<TPhase>) {
  const [snapshot, setSnapshot] = useState<BreathSnapshot>(INITIAL_SNAPSHOT)
  const snapshotRef = useRef(snapshot)
  const patternRef = useRef(pattern)
  const maxCyclesRef = useRef(maxCycles)
  const onCompleteRef = useRef(onComplete)
  const rafRef = useRef<number | null>(null)
  const phaseStartedAtRef = useRef(0)
  const lastPaintAtRef = useRef(0)

  const cancelFrame = useCallback(() => {
    if (rafRef.current !== null) {
      window.cancelAnimationFrame(rafRef.current)
      rafRef.current = null
    }
  }, [])

  const commitSnapshot = useCallback((next: BreathSnapshot) => {
    snapshotRef.current = next
    setSnapshot(next)
  }, [])

  useEffect(() => {
    patternRef.current = pattern
  }, [pattern])

  useEffect(() => {
    maxCyclesRef.current = maxCycles
  }, [maxCycles])

  useEffect(() => {
    onCompleteRef.current = onComplete
  }, [onComplete])

  const tick = useCallback((now: number) => {
    const currentSnapshot = snapshotRef.current

    if (currentSnapshot.status !== 'running') {
      rafRef.current = null
      return
    }

    const currentPattern = patternRef.current
    let phaseIndex = currentSnapshot.phaseIndex
    let cycleCount = currentSnapshot.cycleCount
    let elapsedMs = now - phaseStartedAtRef.current
    let phaseChanged = false

    while (elapsedMs >= currentPattern[phaseIndex].durationMs) {
      elapsedMs -= currentPattern[phaseIndex].durationMs
      phaseIndex = (phaseIndex + 1) % currentPattern.length
      phaseChanged = true

      if (phaseIndex === 0) {
        cycleCount += 1

        if (maxCyclesRef.current !== undefined && cycleCount >= maxCyclesRef.current) {
          const completeSnapshot: BreathSnapshot = {
            status: 'complete',
            phaseIndex: 0,
            cycleCount,
            elapsedMs: 0,
          }

          commitSnapshot(completeSnapshot)
          onCompleteRef.current?.(cycleCount)
          rafRef.current = null
          return
        }
      }
    }

    if (phaseChanged) {
      phaseStartedAtRef.current = now - elapsedMs
    }

    const shouldPaint = phaseChanged || now - lastPaintAtRef.current >= tickMs

    if (shouldPaint) {
      lastPaintAtRef.current = now
      commitSnapshot({
        status: 'running',
        phaseIndex,
        cycleCount,
        elapsedMs,
      })
    } else {
      snapshotRef.current = {
        status: 'running',
        phaseIndex,
        cycleCount,
        elapsedMs,
      }
    }

    rafRef.current = window.requestAnimationFrame(tick)
  }, [commitSnapshot, tickMs])

  const start = useCallback(() => {
    if (typeof window === 'undefined') return

    cancelFrame()

    const now = window.performance.now()
    const currentSnapshot = snapshotRef.current
    const resumable = currentSnapshot.status === 'paused'
    const nextSnapshot: BreathSnapshot = resumable
      ? { ...currentSnapshot, status: 'running' }
      : { ...INITIAL_SNAPSHOT, status: 'running' }

    phaseStartedAtRef.current = now - nextSnapshot.elapsedMs
    lastPaintAtRef.current = 0
    commitSnapshot(nextSnapshot)
    rafRef.current = window.requestAnimationFrame(tick)
  }, [cancelFrame, commitSnapshot, tick])

  const pause = useCallback(() => {
    if (typeof window === 'undefined') return

    const currentSnapshot = snapshotRef.current
    if (currentSnapshot.status !== 'running') return

    cancelFrame()

    const currentStep = patternRef.current[currentSnapshot.phaseIndex]
    const elapsedMs = Math.min(
      window.performance.now() - phaseStartedAtRef.current,
      currentStep.durationMs,
    )

    commitSnapshot({
      ...currentSnapshot,
      status: 'paused',
      elapsedMs,
    })
  }, [cancelFrame, commitSnapshot])

  const reset = useCallback(() => {
    cancelFrame()
    phaseStartedAtRef.current = 0
    lastPaintAtRef.current = 0
    commitSnapshot(INITIAL_SNAPSHOT)
  }, [cancelFrame, commitSnapshot])

  const toggle = useCallback(() => {
    const currentStatus = snapshotRef.current.status

    if (currentStatus === 'running') {
      pause()
      return
    }

    start()
  }, [pause, start])

  useEffect(() => cancelFrame, [cancelFrame])

  const current = pattern[snapshot.phaseIndex]
  const phaseDurationMs = current.durationMs
  const phaseProgress = Math.min(1, Math.max(0, snapshot.elapsedMs / phaseDurationMs))
  const timeRemainingMs = Math.max(0, phaseDurationMs - snapshot.elapsedMs)

  return useMemo(() => ({
    status: snapshot.status,
    isRunning: snapshot.status === 'running',
    isPaused: snapshot.status === 'paused',
    isComplete: snapshot.status === 'complete',
    current,
    phaseIndex: snapshot.phaseIndex,
    cycleCount: snapshot.cycleCount,
    elapsedMs: snapshot.elapsedMs,
    phaseDurationMs,
    timeRemainingMs,
    displaySeconds: Math.max(1, Math.ceil(timeRemainingMs / 1000)),
    phaseProgress,
    progressPercent: phaseProgress * 100,
    start,
    pause,
    reset,
    toggle,
  }), [
    current,
    phaseDurationMs,
    phaseProgress,
    pause,
    reset,
    snapshot.cycleCount,
    snapshot.elapsedMs,
    snapshot.phaseIndex,
    snapshot.status,
    start,
    timeRemainingMs,
    toggle,
  ])
}
