"use client"

import { useCallback, useMemo } from 'react'
import { Button } from '@/components/ui/Button'
import { Card, CardContent } from '@/components/ui/Card'
import { Share2, Mail, Twitter, Facebook, Linkedin, Link2 } from 'lucide-react'

interface ShareBarProps {
  title?: string
  text?: string
}

export default function ShareBar({ title = 'CalmMyself', text = 'A free, evidence‑informed calming toolbox.' }: ShareBarProps) {
  const url = useMemo(() => (typeof window !== 'undefined' ? window.location.href : 'https://calmmyself.com'), [])
  const sharePayload = { title, text, url }

  const canWebShare = typeof navigator !== 'undefined' && !!(navigator as any).share

  const onWebShare = useCallback(async () => {
    try {
      if ((navigator as any).share) {
        await (navigator as any).share(sharePayload)
      }
    } catch {}
  }, [sharePayload])

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
    <Card className="mb-8 bg-white/70">
      <CardContent className="p-4 flex items-center justify-between gap-2">
        <div className="text-sm text-gray-700">Share CalmMyself with someone who could use a moment of calm</div>
        <div className="flex items-center gap-2">
          {canWebShare && (
            <Button onClick={onWebShare} variant="calm" size="sm" className="flex items-center gap-1">
              <Share2 size={16} /> Share
            </Button>
          )}
          <a href={links.twitter} target="_blank" rel="noopener noreferrer" aria-label="Share on Twitter">
            <Button variant="outline" size="icon"><Twitter size={16} /></Button>
          </a>
          <a href={links.facebook} target="_blank" rel="noopener noreferrer" aria-label="Share on Facebook">
            <Button variant="outline" size="icon"><Facebook size={16} /></Button>
          </a>
          <a href={links.linkedin} target="_blank" rel="noopener noreferrer" aria-label="Share on LinkedIn">
            <Button variant="outline" size="icon"><Linkedin size={16} /></Button>
          </a>
          <a href={links.email} aria-label="Share via Email">
            <Button variant="outline" size="icon"><Mail size={16} /></Button>
          </a>
          {!canWebShare && (
            <Button
              variant="ghost"
              size="sm"
              className="hidden md:inline-flex"
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

