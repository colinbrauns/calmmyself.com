'use client'

import { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

interface ConfettiPiece {
  id: number
  x: number
  y: number
  rotation: number
  color: string
  size: number
  velocityX: number
  velocityY: number
}

interface CelebrationAnimationProps {
  show: boolean
  duration?: number
}

const COLORS = ['#fbbf24', '#f59e0b', '#3b82f6', '#10b981', '#8b5cf6', '#ec4899']

export default function CelebrationAnimation({ show, duration = 3000 }: CelebrationAnimationProps) {
  const [confetti, setConfetti] = useState<ConfettiPiece[]>([])

  useEffect(() => {
    if (!show) {
      setConfetti([])
      return
    }

    // Generate confetti pieces
    const pieces: ConfettiPiece[] = []
    for (let i = 0; i < 50; i++) {
      pieces.push({
        id: i,
        x: Math.random() * 100,
        y: -10,
        rotation: Math.random() * 360,
        color: COLORS[Math.floor(Math.random() * COLORS.length)],
        size: Math.random() * 8 + 4,
        velocityX: (Math.random() - 0.5) * 100,
        velocityY: Math.random() * 50 + 100,
      })
    }
    setConfetti(pieces)

    const timer = setTimeout(() => {
      setConfetti([])
    }, duration)

    return () => clearTimeout(timer)
  }, [show, duration])

  return (
    <AnimatePresence>
      {show && (
        <div className="fixed inset-0 pointer-events-none z-50 overflow-hidden">
          {confetti.map((piece) => (
            <motion.div
              key={piece.id}
              className="absolute"
              style={{
                left: `${piece.x}%`,
                backgroundColor: piece.color,
                width: piece.size,
                height: piece.size,
                borderRadius: piece.size > 6 ? '50%' : '2px',
              }}
              initial={{
                y: piece.y,
                rotate: piece.rotation,
                opacity: 1,
              }}
              animate={{
                y: window.innerHeight + 20,
                x: piece.velocityX,
                rotate: piece.rotation + 720,
                opacity: 0,
              }}
              transition={{
                duration: duration / 1000,
                ease: 'easeIn',
              }}
              exit={{ opacity: 0 }}
            />
          ))}

          {/* Success message */}
          <motion.div
            className="absolute top-1/3 left-1/2 -translate-x-1/2 text-center"
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0, opacity: 0 }}
            transition={{ type: 'spring', stiffness: 200, damping: 15 }}
          >
            <div className="bg-white/90 backdrop-blur-sm rounded-2xl px-8 py-6 shadow-2xl border-4 border-green-400">
              <motion.div
                className="text-6xl mb-2"
                animate={{ rotate: [0, -10, 10, -10, 10, 0] }}
                transition={{ duration: 0.6, delay: 0.2 }}
              >
                🎉
              </motion.div>
              <h3 className="text-2xl font-bold text-green-600 mb-1">Great Job!</h3>
              <p className="text-gray-600">Exercise completed</p>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  )
}
