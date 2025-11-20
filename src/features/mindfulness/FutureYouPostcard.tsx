"use client"

import { useState } from 'react'
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import ShareInline from '@/components/ShareInline'

export default function FutureYouPostcard() {
  const [message, setMessage] = useState('')

  const onClear = () => {
    setMessage('')
  }

  return (
    <Card className="max-w-md mx-auto">
      <CardHeader className="text-center">
        <CardTitle>Future-You Postcard</CardTitle>
        <CardDescription>
          What would a steadier future-you thank you for today?
        </CardDescription>
      </CardHeader>

      <CardContent className="space-y-6">
        <div className="relative rounded-lg border border-calm-200 bg-calm-50 p-4">
          <p className="text-xs text-gray-600 mb-2 text-center">
            Imagine you receive a small postcard from a future version of you who is a bit more
            steady and resourced.
          </p>
          <textarea
            rows={4}
            className="w-full p-2 border border-calm-200 rounded-md text-sm focus:ring-2 focus:ring-calm-500 focus:border-calm-500 bg-white"
            placeholder={'"Dear me, today I would be grateful if you..."'}
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            aria-label="Write a short note from future-you"
          />
        </div>

        <p className="text-xs text-gray-600 text-center">
          The note can be very simple. The goal is to gently shift from threat-mode to values-mode,
          even for a sentence or two.
        </p>

        <div className="flex justify-center gap-3">
          <Button variant="outline" size="sm" onClick={onClear}>
            Clear
          </Button>
        </div>
      </CardContent>

      <div className="px-6 pb-6">
        <ShareInline
          title="Future-You Postcard"
          text="Write a tiny Future-You Postcard on CalmMyself."
        />
      </div>
    </Card>
  )
}

