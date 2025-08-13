'use client'

import { useEffect, useRef } from 'react'
import RecommendationEngine from '@/lib/recommendations'

export function useUsageTracking(toolId: string, isActive: boolean) {
  const startTimeRef = useRef<number | null>(null)

  // Track when tool starts
  useEffect(() => {
    if (isActive && !startTimeRef.current) {
      startTimeRef.current = Date.now()
    }
  }, [isActive])

  // Track when tool completes or stops
  const trackUsage = (completed: boolean = true) => {
    if (startTimeRef.current) {
      const duration = Math.floor((Date.now() - startTimeRef.current) / 1000)
      RecommendationEngine.recordUsage(toolId, duration, completed)
      startTimeRef.current = null
    }
  }

  // Auto-track when component unmounts (user navigates away)
  useEffect(() => {
    return () => {
      if (startTimeRef.current) {
        trackUsage(false) // Incomplete if navigating away
      }
    }
  }, [])

  return { trackUsage }
}