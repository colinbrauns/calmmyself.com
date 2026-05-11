"use client"

import { useCallback, useEffect, useMemo, useState } from 'react'
import { Button } from '@/components/ui/Button'
import { Card, CardContent } from '@/components/ui/Card'
import { Share2, Mail, Twitter, Facebook, Linkedin, Link2 } from 'lucide-react'

interface ShareBarProps {
  title?: string
  text?: string
}

interface WebShareNavigator extends Omit<Navigator, 'share'> {
  share?: (data?: ShareData) => Promise<void>
}

export default function ShareBar({ title = 'CalmMyself', text = 'A free, evidence‑informed calming toolbox.' }: ShareBarProps) {
  const [url, setUrl] = useState('https://calmmyself.com')
  const [canWebShare, setCanWebShare] = useState(false)
  const webSharePayload = useMemo(() => ({ title, text, url }), [title, text, url])

  useEffect(() => {
    const navigatorWithShare = navigator as WebShareNavigator
    setUrl(window.location.href)
    setCanWebShare(Boolean(navigatorWithShare.share))
  }, [])

  const onWebShare = useCallback(async () => {
    const shareFn = (navigator as WebShareNavigator).share
    if (!shareFn) return
    try {
      await shareFn(webSharePayload)
    } catch {}
  }, [webSharePayload])

  const encoded = {
    url: encodeURIComponent(url),
    text: encodeURIComponent(text),
    title: encodeURIComponent(title),
  }

  const links = {
    twitter: `https://twitter.com/intent/tweet?text=${encoded.text}&url=${encoded.url}`,
    facebook: `https://www.facebook.com/sharer/sharer.php?u=${encoded.url}`,
    linkedin: `https://www.linkedin.com/sharing/share-offsite/?url=${encoded.url}`,
    email: `mailto:?subject=${encoded.title}&body=${encoded.text}%0A%0A${encoded.url}`,
  }

  return (
    <Card className="mb-6 sm:mb-8 bg-white/70 dark:bg-gray-900/60">
      <CardContent className="p-3 sm:p-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 sm:gap-2">
        <div className="text-xs sm:text-sm text-gray-700 dark:text-gray-300 text-center sm:text-left">Share CalmMyself with someone who could use a moment of calm</div>
        <div className="flex items-center justify-center sm:justify-end gap-2 flex-wrap">
          {canWebShare && (
            <Button onClick={onWebShare} variant="calm" size="sm" className="flex items-center gap-1 touch-manipulation min-h-[44px]">
              <Share2 size={16} /> Share
            </Button>
          )}
          <a href={links.twitter} target="_blank" rel="noopener noreferrer" aria-label="Share on Twitter">
            <Button variant="outline" size="icon" className="touch-manipulation min-w-[44px] min-h-[44px]"><Twitter size={16} /></Button>
          </a>
          <a href={links.facebook} target="_blank" rel="noopener noreferrer" aria-label="Share on Facebook">
            <Button variant="outline" size="icon" className="touch-manipulation min-w-[44px] min-h-[44px]"><Facebook size={16} /></Button>
          </a>
          <a href={links.linkedin} target="_blank" rel="noopener noreferrer" aria-label="Share on LinkedIn">
            <Button variant="outline" size="icon" className="touch-manipulation min-w-[44px] min-h-[44px]"><Linkedin size={16} /></Button>
          </a>
          <a href={links.email} aria-label="Share via Email">
            <Button variant="outline" size="icon" className="touch-manipulation min-w-[44px] min-h-[44px]"><Mail size={16} /></Button>
          </a>
          {!canWebShare && (
            <Button
              variant="ghost"
              size="sm"
              className="hidden md:inline-flex touch-manipulation min-h-[44px]"
              onClick={() => navigator.clipboard?.writeText(url)}
              aria-label="Copy link"
            >
              <Link2 size={16} /> Copy Link
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  )
}
