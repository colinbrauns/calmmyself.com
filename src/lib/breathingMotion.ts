export type BreathMotionPhase = string

export function getBreathTargetScale(
  phase: BreathMotionPhase,
  scaleMin: number,
  scaleMax: number,
) {
  if (phase === 'exhale' || phase.startsWith('exhale')) return scaleMin
  if (phase === 'hold2') return scaleMin
  if (phase === 'inhale' || phase.startsWith('inhale')) return scaleMax
  if (phase === 'hold' || phase === 'hold1') return scaleMax

  return scaleMin
}

export function getBreathEase(phase: BreathMotionPhase) {
  if (phase === 'exhale' || phase.startsWith('exhale')) {
    return [0.4, 0, 0.2, 1] as const
  }

  if (phase === 'inhale' || phase.startsWith('inhale')) {
    return [0.16, 1, 0.3, 1] as const
  }

  return [0.33, 1, 0.68, 1] as const
}

export function getBreathContainerSize(
  size: number,
  scaleMax: number,
  padding = 16,
) {
  return Math.max(size + padding, size * scaleMax)
}
