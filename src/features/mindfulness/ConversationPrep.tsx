"use client"

import { useState } from 'react'
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import ShareInline from '@/components/ShareInline'

interface PrepFields {
  value: string
  control: string
  phrase: string
}

export default function ConversationPrep() {
  const [fields, setFields] = useState<PrepFields>({
    value: '',
    control: '',
    phrase: '',
  })

  const onChange = (field: keyof PrepFields, value: string) => {
    setFields((prev) => ({ ...prev, [field]: value }))
  }

  const onClear = () => {
    setFields({ value: '', control: '', phrase: '' })
  }

  return (
    <Card className="max-w-md mx-auto">
      <CardHeader className="text-center">
        <CardTitle>Before‑Conversation Prep</CardTitle>
        <CardDescription>Get oriented before a hard talk or social situation</CardDescription>
      </CardHeader>

      <CardContent className="space-y-6">
        <div className="space-y-3 text-sm">
          <div>
            <label className="block font-medium text-gray-700 mb-1">
              1. What matters most here?
            </label>
            <p className="text-xs text-gray-500 mb-2">
              For example: honesty, kindness, clarity, staying present, listening.
            </p>
            <input
              type="text"
              className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-calm-500 focus:border-calm-500"
              value={fields.value}
              onChange={(e) => onChange('value', e.target.value)}
            />
          </div>

          <div>
            <label className="block font-medium text-gray-700 mb-1">
              2. What is in your control?
            </label>
            <p className="text-xs text-gray-500 mb-2">
              Your tone, what you say (or don&apos;t), how long you stay, whether you take breaks.
            </p>
            <textarea
              rows={2}
              className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-calm-500 focus:border-calm-500"
              value={fields.control}
              onChange={(e) => onChange('control', e.target.value)}
            />
          </div>

          <div>
            <label className="block font-medium text-gray-700 mb-1">
              3. One phrase to carry in
            </label>
            <p className="text-xs text-gray-500 mb-2">
              E.g. &quot;I can pause if I need to&quot;, &quot;I can come back to what matters&quot;,
              or &quot;It is okay not to be perfect.&quot;
            </p>
            <input
              type="text"
              className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-calm-500 focus:border-calm-500"
              value={fields.phrase}
              onChange={(e) => onChange('phrase', e.target.value)}
            />
          </div>
        </div>

        <div className="text-xs text-gray-600 bg-calm-50 border border-calm-100 p-3 rounded-md">
          You can glance at these notes or repeat your phrase quietly just before going in. They
          are there to support you, not to create pressure to perform.
        </div>

        <div className="flex justify-between items-center gap-3">
          <Button variant="outline" size="sm" onClick={onClear}>
            Clear
          </Button>
          <p className="text-[11px] text-gray-500 text-right flex-1">
            Pairing this with a few calm breaths or grounding steps can further steady you.
          </p>
        </div>
      </CardContent>

      <div className="px-6 pb-6">
        <ShareInline
          title="Before‑Conversation Prep"
          text="Prep for hard conversations with a short values‑based exercise on CalmMyself."
        />
      </div>
    </Card>
  )
}


