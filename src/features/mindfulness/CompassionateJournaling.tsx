"use client"

import { useEffect, useState } from 'react'
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import ShareInline from '@/components/ShareInline'

const STORAGE_KEY = 'calmmyself:journal:last-entry'

interface JournalEntry {
  situation: string
  thoughts: string
  kindResponse: string
}

export default function CompassionateJournaling() {
  const [entry, setEntry] = useState<JournalEntry>({
    situation: '',
    thoughts: '',
    kindResponse: '',
  })

  // Load last entry from localStorage (if any)
  useEffect(() => {
    if (typeof window === 'undefined') return
    try {
      const raw = window.localStorage.getItem(STORAGE_KEY)
      if (!raw) return
      const parsed = JSON.parse(raw) as Partial<JournalEntry>
      setEntry((prev) => ({
        situation: parsed.situation ?? prev.situation,
        thoughts: parsed.thoughts ?? prev.thoughts,
        kindResponse: parsed.kindResponse ?? prev.kindResponse,
      }))
    } catch {
      // Ignore parsing errors – journaling is optional convenience
    }
  }, [])

  // Persist entry locally when it changes
  useEffect(() => {
    if (typeof window === 'undefined') return
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(entry))
    } catch {
      // Ignore storage errors
    }
  }, [entry])

  const onChangeField = (field: keyof JournalEntry, value: string) => {
    setEntry((prev) => ({ ...prev, [field]: value }))
  }

  const onClear = () => {
    setEntry({ situation: '', thoughts: '', kindResponse: '' })
  }

  return (
    <Card className="max-w-md mx-auto">
      <CardHeader className="text-center">
        <CardTitle>Compassionate Journaling</CardTitle>
        <CardDescription>
          A quick, private space to get worries out and respond kindly
        </CardDescription>
      </CardHeader>

      <CardContent className="space-y-6">
        <div className="text-xs text-gray-600 bg-grounding-50 border border-grounding-100 p-3 rounded-md">
          Nothing is stored on a server. Entries stay in your browser only and
          you can clear them at any time.
        </div>

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              1. What happened?
            </label>
            <p className="text-xs text-gray-500 mb-2">
              Briefly describe the situation or what&apos;s on your mind.
            </p>
            <textarea
              className="w-full p-2 border border-gray-300 rounded-md text-sm focus:ring-2 focus:ring-grounding-500 focus:border-grounding-500"
              rows={3}
              value={entry.situation}
              onChange={(e) => onChangeField('situation', e.target.value)}
              aria-label="Describe what happened"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              2. What is your mind saying?
            </label>
            <p className="text-xs text-gray-500 mb-2">
              Capture any looping thoughts, worries, or stories your mind is
              telling.
            </p>
            <textarea
              className="w-full p-2 border border-gray-300 rounded-md text-sm focus:ring-2 focus:ring-grounding-500 focus:border-grounding-500"
              rows={3}
              value={entry.thoughts}
              onChange={(e) => onChangeField('thoughts', e.target.value)}
              aria-label="Write down your thoughts or worries"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              3. What would you say to a close friend in this spot?
            </label>
            <p className="text-xs text-gray-500 mb-2">
              Let that kinder voice speak to you as well, even if just a
              little.
            </p>
            <textarea
              className="w-full p-2 border border-gray-300 rounded-md text-sm focus:ring-2 focus:ring-grounding-500 focus:border-grounding-500"
              rows={3}
              value={entry.kindResponse}
              onChange={(e) => onChangeField('kindResponse', e.target.value)}
              aria-label="Write a kinder response to yourself"
            />
          </div>
        </div>

        <div className="flex justify-between items-center gap-3">
          <Button
            variant="outline"
            size="sm"
            onClick={onClear}
            aria-label="Clear journaling fields"
          >
            Clear
          </Button>
          <p className="text-[11px] text-gray-500 text-right flex-1">
            You don&apos;t need to get this perfect. The goal is simply to get
            things out of your head and offer even a small dose of kindness.
          </p>
        </div>
      </CardContent>

      <div className="px-6 pb-6">
        <ShareInline
          title="Compassionate Journaling"
          text="Try a brief compassionate journaling exercise on CalmMyself."
        />
      </div>
    </Card>
  )
}


