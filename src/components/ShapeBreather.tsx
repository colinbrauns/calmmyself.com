"use client"

import { useEffect, useMemo } from 'react'
import { motion, useAnimationControls, useReducedMotion } from 'framer-motion'
import type { CyclePhase } from '@/components/BreathingCycle'

interface ShapeBreatherProps {
  shape: 'square' | 'triangle'
  phase: CyclePhase
  durationMs: number
  isActive: boolean
  size?: number
  colors?: { from: string; to: string }
  scaleMin?: number
  scaleMax?: number
  styleMode?: 'fill' | 'stroke'
  strokeClass?: string
}

export default function ShapeBreather({
  shape,
  phase,
  durationMs,
  isActive,
  size = 112,
  colors = { from: 'from-calm-300', to: 'to-calm-500' },
  scaleMin = 1,
  scaleMax = 1.5,
  styleMode = 'fill',
  strokeClass = 'text-calm-500',
}: ShapeBreatherProps) {
  const controls = useAnimationControls()
  const prefersReducedMotion = useReducedMotion()
  const allowOverride = typeof document !== 'undefined' && document.documentElement.classList.contains('allow-animations')

  const targetScale = useMemo(() => {
    if (phase === 'inhale' || phase === 'inhale1') return scaleMax
    if (phase === 'inhale2') return scaleMax
    if (phase === 'exhale') return scaleMin
    if (phase === 'hold1') return scaleMax
    if (phase === 'hold2') return scaleMin
    if (phase === 'hold') return scaleMax
    return scaleMin
  }, [phase, scaleMax, scaleMin])

  useEffect(() => {
    if (!isActive || (prefersReducedMotion && !allowOverride)) return
    controls.start({
      scale: targetScale,
      transition: {
        duration: durationMs / 1000,
        ease: phase === 'exhale' ? 'easeOut' : 'easeInOut',
      },
    })
  }, [controls, durationMs, isActive, prefersReducedMotion, allowOverride, phase, targetScale])

  const containerDim = size * scaleMax
  const dimension = `${size}px`

  const body = (() => {
    if (shape === 'square') {
      if (styleMode === 'stroke') {
        return (
          <>
            {/* Outer subtle glow */}
            <motion.div
              className="absolute rounded-xl blur-xl opacity-70"
              style={{ width: dimension, height: dimension }}
              animate={controls}
              initial={{ scale: scaleMin, opacity: 0.35 }}
            >
              <div className={`w-full h-full ${colors.from} ${colors.to} bg-gradient-to-br rounded-lg`} />
            </motion.div>

            {/* Stroke-only square */}
            <motion.div
              className={`will-change-transform rounded-lg border-4 border-current ${strokeClass}`}
              style={{ width: dimension, height: dimension, background: 'transparent' }}
              animate={controls}
              initial={{ scale: scaleMin, opacity: 1 }}
            />

            {/* Inner soft pulse on phase change */}
            <motion.div
              key={`${phase}`}
              className={`absolute rounded-lg ${colors.from} ${colors.to} bg-gradient-to-br`}
              style={{ width: dimension, height: dimension, opacity: 0.15 }}
              initial={{ scale: 0.92, opacity: 0.15 }}
              animate={{ scale: 1.08, opacity: 0 }}
              transition={{ duration: 0.8, ease: 'easeOut' }}
            />
          </>
        )
      }
      // fill mode
      return (
        <>
          {/* Soft outer glow */}
          <motion.div
            className="absolute rounded-xl blur-xl opacity-70"
            style={{ width: dimension, height: dimension }}
            animate={controls}
            initial={{ scale: scaleMin, opacity: 0.35 }}
          >
            <div className={`w-full h-full ${colors.from} ${colors.to} bg-gradient-to-br rounded-lg`} />
          </motion.div>
          <motion.div
            className={`shadow-lg will-change-transform ${colors.from} ${colors.to} bg-gradient-to-br rounded-lg`}
            style={{ width: dimension, height: dimension }}
            animate={controls}
            initial={{ scale: scaleMin, opacity: 1 }}
          />
        </>
      )
    }

    // Triangle (fill-mode only)
    return (
      <>
        <motion.div
          className="absolute blur-xl opacity-70"
          style={{ width: dimension, height: dimension }}
          animate={controls}
          initial={{ scale: scaleMin, opacity: 0.35 }}
        >
          <div className={`w-full h-full ${colors.from} ${colors.to} bg-gradient-to-br`} style={{ clipPath: 'polygon(50% 0%, 0% 100%, 100% 100%)' }} />
        </motion.div>
        <motion.div
          className={`shadow-lg will-change-transform ${colors.from} ${colors.to} bg-gradient-to-br`}
          style={{ width: dimension, height: dimension, clipPath: 'polygon(50% 0%, 0% 100%, 100% 100%)' }}
          animate={controls}
          initial={{ scale: scaleMin, opacity: 1 }}
        />
      </>
    )
  })()

  if (prefersReducedMotion && !allowOverride) {
    return (
      <div className="relative flex items-center justify-center" style={{ width: containerDim, height: containerDim }}>
        {shape === 'square' ? (
          <div className={`border-4 border-calm-500/80 ${shape === 'square' ? 'rounded-lg' : ''}`} style={{ width: dimension, height: dimension }} />
        ) : (
          <div className={`${colors.from} ${colors.to} bg-gradient-to-br`} style={{ width: dimension, height: dimension, clipPath: 'polygon(50% 0%, 0% 100%, 100% 100%)' }} />
        )}
      </div>
    )
  }

  return (
    <div className="relative flex items-center justify-center" style={{ width: containerDim, height: containerDim }}>
      {body}
    </div>
  )
}
