"use client"

import { useCallback, useMemo } from 'react'
import { Button } from '@/components/ui/Button'
import { Share2, Link2 } from 'lucide-react'

interface WebShareNavigator extends Omit<Navigator, 'share'> {
  share?: (data?: ShareData) => Promise<void>
}

interface ShareInlineProps {
  title?: string
  text?: string
}

export default function ShareInline({ title = 'CalmMyself', text = 'A free, evidence‑informed calming toolbox.' }: ShareInlineProps) {
  const url = useMemo(() => (typeof window !== 'undefined' ? window.location.href : 'https://calmmyself.com'), [])
  const navigatorWithShare = typeof navigator !== 'undefined' ? (navigator as WebShareNavigator) : undefined
  const shareFn = navigatorWithShare?.share
  const canWebShare = Boolean(shareFn)

  const handleShare = useCallback(async () => {
    try {
      if (shareFn) {
        await shareFn({ title, text, url })
      } else {
        await navigator.clipboard?.writeText(url)
      }
    } catch {}
  }, [shareFn, text, title, url])

  return (
    <div className="flex items-center justify-between bg-white/60 border border-calm-100 rounded-md p-2">
      <span className="text-xs text-gray-600">Share this practice</span>
      <Button onClick={handleShare} variant="outline" size="sm" className="flex items-center gap-2">
        {canWebShare ? <Share2 size={16}/> : <Link2 size={16}/>} Share
      </Button>
    </div>
  )
}
