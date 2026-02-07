'use client'

import { motion, useReducedMotion } from 'framer-motion'
import { type ReactNode } from 'react'

const CATEGORY_GRADIENTS: Record<string, { from: string; to: string; via?: string }> = {
  'Breathing': { from: 'from-blue-50', to: 'to-sky-100', via: 'via-blue-50/50' },
  'Grounding': { from: 'from-amber-50', to: 'to-yellow-100', via: 'via-orange-50/50' },
  'Mindfulness': { from: 'from-purple-50', to: 'to-violet-100', via: 'via-purple-50/50' },
  'Relaxation': { from: 'from-teal-50', to: 'to-cyan-100', via: 'via-teal-50/50' },
  'Visualization': { from: 'from-emerald-50', to: 'to-green-100', via: 'via-emerald-50/50' },
  'Sound': { from: 'from-amber-50', to: 'to-orange-100', via: 'via-yellow-50/50' },
  'Quick Access': { from: 'from-yellow-50', to: 'to-amber-100', via: 'via-yellow-50/50' },
  'Crisis Support': { from: 'from-red-50', to: 'to-rose-100', via: 'via-red-50/50' },
}

interface AmbientBackgroundProps {
  category: string
  children: ReactNode
}

export default function AmbientBackground({ category, children }: AmbientBackgroundProps) {
  const prefersReducedMotion = useReducedMotion()
  const gradient = CATEGORY_GRADIENTS[category] ?? CATEGORY_GRADIENTS['Breathing']

  return (
    <div className="relative min-h-[60vh]">
      {/* Static gradient base */}
      <div className={`absolute inset-0 bg-gradient-to-br ${gradient.from} ${gradient.via ?? ''} ${gradient.to} -z-10 rounded-2xl`} />

      {/* Animated radial overlay for non-reduced-motion users */}
      {!prefersReducedMotion && (
        <motion.div
          className="absolute inset-0 -z-10 rounded-2xl opacity-30"
          style={{
            background: 'radial-gradient(ellipse at 30% 40%, rgba(255,255,255,0.8) 0%, transparent 70%)',
          }}
          animate={{
            background: [
              'radial-gradient(ellipse at 30% 40%, rgba(255,255,255,0.8) 0%, transparent 70%)',
              'radial-gradient(ellipse at 70% 60%, rgba(255,255,255,0.8) 0%, transparent 70%)',
              'radial-gradient(ellipse at 50% 30%, rgba(255,255,255,0.8) 0%, transparent 70%)',
              'radial-gradient(ellipse at 30% 40%, rgba(255,255,255,0.8) 0%, transparent 70%)',
            ],
          }}
          transition={{ duration: 15, repeat: Infinity, ease: 'easeInOut' }}
        />
      )}

      {/* Content */}
      <div className="relative z-0 py-4 px-2">
        {children}
      </div>
    </div>
  )
}
