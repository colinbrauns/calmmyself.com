// Core types for CalmMyself application

export interface CalmingTool {
  id: string
  name: string
  description: string
  category: ToolCategory
  duration?: number // in seconds
  difficulty: 'beginner' | 'intermediate' | 'advanced'
  benefits: string[]
  instructions: string[]
}

export type ToolCategory = 
  | 'breathing'
  | 'grounding' 
  | 'mindfulness'
  | 'visualization'
  | 'progressive-relaxation'

export interface BreathingPattern {
  inhale: number
  hold?: number
  exhale: number
  pause?: number
}

export interface GroundingExercise {
  type: '5-4-3-2-1' | 'body-scan' | 'nature-focus'
  prompts: string[]
}

export interface UserSession {
  toolsUsed: string[]
  duration: number
  timestamp: Date
  moodBefore?: number // 1-10 scale
  moodAfter?: number // 1-10 scale
}