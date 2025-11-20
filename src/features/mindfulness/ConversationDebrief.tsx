"use client"

import { useState } from 'react'
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import ShareInline from '@/components/ShareInline'

interface DebriefFields {
  whatHappened: string
  whatWentOkay: string
  whatToLetGo: string
}

export default function ConversationDebrief() {
  const [fields, setFields] = useState<DebriefFields>({
    whatHappened: '',
    whatWentOkay: '',
    whatToLetGo: '',
  })

  const onChange = (field: keyof DebriefFields, value: string) => {
    setFields((prev) => ({ ...prev, [field]: value }))
  }

  const onClear = () => {
    setFields({ whatHappened: '', whatWentOkay: '', whatToLetGo: '' })
  }

  return (
    <Card className="max-w-md mx-auto">
      <CardHeader className="text-center">
        <CardTitle>After‑Conversation De‑Brief</CardTitle>
        <CardDescription>Gently come down from a tough social moment</CardDescription>
      </CardHeader>

      <CardContent className="space-y-6">
        <div className="space-y-3 text-sm">
          <div>
            <label className="block font-medium text-gray-700 mb-1">
              1. What actually happened?
            </label>
            <p className="text-xs text-gray-500 mb-2">
              Stick to simple facts, like a short summary you might tell a neutral observer.
            </p>
            <textarea
              rows={2}
              className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-calm-500 focus:border-calm-500"
              value={fields.whatHappened}
              onChange={(e) => onChange('whatHappened', e.target.value)}
            />
          </div>

          <div>
            <label className="block font-medium text-gray-700 mb-1">
              2. What went even slightly okay?
            </label>
            <p className="text-xs text-gray-500 mb-2">
              It might be as small as &quot;I stayed in the room&quot; or &quot;I took a breath
              before answering.&quot;
            </p>
            <textarea
              rows={2}
              className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-calm-500 focus:border-calm-500"
              value={fields.whatWentOkay}
              onChange={(e) => onChange('whatWentOkay', e.target.value)}
            />
          </div>

          <div>
            <label className="block font-medium text-gray-700 mb-1">
              3. What can you gently let go of for now?
            </label>
            <p className="text-xs text-gray-500 mb-2">
              For example: replaying every line, guessing what others think, or trying to fix the
              past.
            </p>
            <textarea
              rows={2}
              className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-calm-500 focus:border-calm-500"
              value={fields.whatToLetGo}
              onChange={(e) => onChange('whatToLetGo', e.target.value)}
            />
          </div>
        </div>

        <div className="text-xs text-gray-600 bg-calm-50 border border-calm-100 p-3 rounded-md">
          You may still feel stirred up afterward. That is okay. This exercise is meant to soften
          the harshest self‑criticism and bring a bit more balance.
        </div>

        <div className="flex justify-between items-center gap-3">
          <Button variant="outline" size="sm" onClick={onClear}>
            Clear
          </Button>
          <p className="text-[11px] text-gray-500 text-right flex-1">
            Pairing this with a calming practice (like a breath exercise) can help your body catch
            up with the reflection you&apos;ve done.
          </p>
        </div>
      </CardContent>

      <div className="px-6 pb-6">
        <ShareInline
          title="After‑Conversation De‑Brief"
          text="Gently de‑brief after a tough conversation on CalmMyself."
        />
      </div>
    </Card>
  )
}


