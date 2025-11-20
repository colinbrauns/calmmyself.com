"use client"

import { useState } from 'react'
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import ShareInline from '@/components/ShareInline'

type Mode = 'temperature' | 'texture'

interface ItemPrompt {
  label: string
  placeholder: string
}

const TEMPERATURE_ITEMS: ItemPrompt[] = [
  { label: 'Cool', placeholder: 'Something cool (e.g. glass, air, metal)' },
  { label: 'Neutral', placeholder: 'Something neutral (e.g. table, clothing)' },
  { label: 'Warm', placeholder: 'Something warm (e.g. mug, skin, blanket)' },
]

const TEXTURE_ITEMS: ItemPrompt[] = [
  { label: 'Smooth', placeholder: 'Something smooth (e.g. phone, mug, fabric)' },
  { label: 'Rough', placeholder: 'Something rough (e.g. rug, paper, wall)' },
  { label: 'Soft', placeholder: 'Something soft (e.g. pillow, clothing)' },
]

export default function TemperatureTextureScan() {
  const [mode, setMode] = useState<Mode>('temperature')
  const [temperatureNotes, setTemperatureNotes] = useState<string[]>(['', '', ''])
  const [textureNotes, setTextureNotes] = useState<string[]>(['', '', ''])

  const items = mode === 'temperature' ? TEMPERATURE_ITEMS : TEXTURE_ITEMS
  const notes = mode === 'temperature' ? temperatureNotes : textureNotes

  const setNote = (index: number, value: string) => {
    if (mode === 'temperature') {
      const next = [...temperatureNotes]
      next[index] = value
      setTemperatureNotes(next)
    } else {
      const next = [...textureNotes]
      next[index] = value
      setTextureNotes(next)
    }
  }

  const clear = () => {
    setTemperatureNotes(['', '', ''])
    setTextureNotes(['', '', ''])
  }

  return (
    <Card className="max-w-md mx-auto">
      <CardHeader className="text-center">
        <CardTitle>Temperature &amp; Texture Scan</CardTitle>
        <CardDescription>Gently re‑engage with the world through touch</CardDescription>
      </CardHeader>

      <CardContent className="space-y-6">
        <div className="flex justify-center gap-2">
          <Button
            variant={mode === 'temperature' ? 'grounding' : 'outline'}
            size="sm"
            onClick={() => setMode('temperature')}
          >
            Temperature
          </Button>
          <Button
            variant={mode === 'texture' ? 'grounding' : 'outline'}
            size="sm"
            onClick={() => setMode('texture')}
          >
            Texture
          </Button>
        </div>

        <div className="text-xs text-gray-600 bg-grounding-50 border border-grounding-100 p-3 rounded-md">
          Move slowly and gently. There is no need to force sensations—just notice what is already
          there in things around you.
        </div>

        <div className="space-y-3 text-sm">
          {items.map((item, index) => (
            <div key={item.label}>
              <label className="block font-medium text-gray-700 mb-1">{item.label}</label>
              <input
                type="text"
                className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-grounding-500 focus:border-grounding-500"
                placeholder={item.placeholder}
                value={notes[index]}
                onChange={(e) => setNote(index, e.target.value)}
                aria-label={item.placeholder}
              />
            </div>
          ))}
        </div>

        <div className="flex justify-between items-center gap-3">
          <Button variant="outline" size="sm" onClick={clear}>
            Clear
          </Button>
          <p className="text-[11px] text-gray-500 text-right flex-1">
            You might repeat this scan once or twice, or switch modes, if you find it gently
            helpful.
          </p>
        </div>
      </CardContent>

      <div className="px-6 pb-6">
        <ShareInline
          title="Temperature & Texture Scan"
          text="Try a brief temperature and texture scan for numbness or dissociation on CalmMyself."
        />
      </div>
    </Card>
  )
}


