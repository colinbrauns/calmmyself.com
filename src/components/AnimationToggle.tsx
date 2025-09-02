"use client"

import { useEffect, useState } from 'react'
import { Button } from '@/components/ui/Button'

export default function AnimationToggle() {
  const [enabled, setEnabled] = useState(false)
  const [supported, setSupported] = useState(false)

  useEffect(() => {
    setSupported(typeof window !== 'undefined')
    const initial = typeof document !== 'undefined' && document.documentElement.classList.contains('allow-animations')
    setEnabled(initial)
  }, [])

  useEffect(() => {
    if (!supported) return
    const root = document.documentElement
    if (enabled) root.classList.add('allow-animations')
    else root.classList.remove('allow-animations')
  }, [enabled, supported])

  if (!supported) return null

  return (
    <Button
      onClick={() => setEnabled((v) => !v)}
      variant="outline"
      size="sm"
      className="ml-2"
      aria-pressed={enabled}
    >
      {enabled ? 'Animations: On' : 'Animations: Off'}
    </Button>
  )
}

