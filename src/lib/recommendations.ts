/**
 * Personalized Tool Recommendation System
 * Uses local storage to track usage patterns and provide smart suggestions
 */

export interface ToolUsage {
  toolId: string
  timestamp: number
  duration: number
  completed: boolean
  timeOfDay: 'morning' | 'afternoon' | 'evening' | 'night'
  dayOfWeek: number // 0-6, Sunday = 0
}

export interface ToolStats {
  toolId: string
  totalUses: number
  averageDuration: number
  completionRate: number
  lastUsed: number
  preferredTimes: string[]
  effectivenessScore: number
}

export interface RecommendationContext {
  timeOfDay: 'morning' | 'afternoon' | 'evening' | 'night'
  dayOfWeek: number
  recentStress?: 'high' | 'medium' | 'low'
  timeAvailable?: 'quick' | 'moderate' | 'long'
}

// Tool categories for contextual recommendations
export const TOOL_CATEGORIES = {
  'quick-access': { category: 'quick', duration: 60, stress: ['high'] },
  'physiological-sigh': { category: 'breathing', duration: 30, stress: ['high', 'medium'] },
  'box-breathing': { category: 'breathing', duration: 300, stress: ['medium', 'low'] },
  'triangle-breathing': { category: 'breathing', duration: 480, stress: ['medium', 'low'] },
  '5-4-3-2-1': { category: 'grounding', duration: 420, stress: ['high', 'medium'] },
  'body-scan': { category: 'grounding', duration: 900, stress: ['low'] },
  'emergency-grounding': { category: 'crisis', duration: 180, stress: ['high'] },
  'progressive-relaxation': { category: 'relaxation', duration: 1200, stress: ['medium', 'low'] },
  'breathing-space': { category: 'mindfulness', duration: 180, stress: ['medium'] },
  'present-moment': { category: 'mindfulness', duration: 300, stress: ['medium', 'low'] },
  'loving-kindness': { category: 'mindfulness', duration: 600, stress: ['low'] },
  'safe-place': { category: 'visualization', duration: 900, stress: ['low'] },
  'nature-scenes': { category: 'visualization', duration: 600, stress: ['medium', 'low'] }
} as const

class RecommendationEngine {
  private static readonly STORAGE_KEY = 'calmmyself-usage'
  private static readonly STATS_KEY = 'calmmyself-stats'

  static getTimeOfDay(): 'morning' | 'afternoon' | 'evening' | 'night' {
    const hour = new Date().getHours()
    if (hour >= 5 && hour < 12) return 'morning'
    if (hour >= 12 && hour < 17) return 'afternoon'
    if (hour >= 17 && hour < 21) return 'evening'
    return 'night'
  }

  static recordUsage(toolId: string, duration: number, completed: boolean) {
    const usage: ToolUsage = {
      toolId,
      timestamp: Date.now(),
      duration,
      completed,
      timeOfDay: this.getTimeOfDay(),
      dayOfWeek: new Date().getDay()
    }

    const existingUsage = this.getUsageHistory()
    existingUsage.push(usage)

    // Keep only last 100 entries to prevent storage bloat
    if (existingUsage.length > 100) {
      existingUsage.splice(0, existingUsage.length - 100)
    }

    localStorage.setItem(this.STORAGE_KEY, JSON.stringify(existingUsage))
    this.updateStats()
  }

  static getUsageHistory(): ToolUsage[] {
    try {
      const data = localStorage.getItem(this.STORAGE_KEY)
      return data ? JSON.parse(data) : []
    } catch {
      return []
    }
  }

  static updateStats() {
    const usage = this.getUsageHistory()
    const statsMap = new Map<string, ToolStats>()

    // Calculate stats for each tool
    for (const entry of usage) {
      const existing = statsMap.get(entry.toolId) || {
        toolId: entry.toolId,
        totalUses: 0,
        averageDuration: 0,
        completionRate: 0,
        lastUsed: 0,
        preferredTimes: [],
        effectivenessScore: 0
      }

      existing.totalUses++
      existing.averageDuration = (existing.averageDuration + entry.duration) / existing.totalUses
      existing.lastUsed = Math.max(existing.lastUsed, entry.timestamp)
      
      statsMap.set(entry.toolId, existing)
    }

    // Calculate completion rates and effectiveness scores
    for (const [toolId, stats] of statsMap) {
      const toolUsage = usage.filter(u => u.toolId === toolId)
      const completed = toolUsage.filter(u => u.completed).length
      stats.completionRate = completed / toolUsage.length
      
      // Effectiveness score based on completion rate, recent usage, and frequency
      const recencyBonus = this.isRecentlyUsed(stats.lastUsed) ? 0.2 : 0
      const frequencyScore = Math.min(stats.totalUses / 10, 1) // Max score at 10+ uses
      stats.effectivenessScore = stats.completionRate * 0.6 + frequencyScore * 0.2 + recencyBonus
      
      // Calculate preferred times
      const timeUsage = toolUsage.reduce((acc, u) => {
        acc[u.timeOfDay] = (acc[u.timeOfDay] || 0) + 1
        return acc
      }, {} as Record<string, number>)
      
      stats.preferredTimes = Object.entries(timeUsage)
        .sort(([,a], [,b]) => b - a)
        .slice(0, 2)
        .map(([time]) => time)
    }

    localStorage.setItem(this.STATS_KEY, JSON.stringify(Array.from(statsMap.values())))
  }

  static getToolStats(): ToolStats[] {
    try {
      const data = localStorage.getItem(this.STATS_KEY)
      return data ? JSON.parse(data) : []
    } catch {
      return []
    }
  }

  static isRecentlyUsed(timestamp: number): boolean {
    const dayInMs = 24 * 60 * 60 * 1000
    return Date.now() - timestamp < dayInMs
  }

  static getRecommendations(context: RecommendationContext): string[] {
    const stats = this.getToolStats()
    const recommendations: Array<{toolId: string, score: number, reason: string}> = []

    // Get all available tools
    const allTools = Object.keys(TOOL_CATEGORIES) as Array<keyof typeof TOOL_CATEGORIES>

    for (const toolId of allTools) {
      const toolInfo = TOOL_CATEGORIES[toolId]
      const toolStats = stats.find(s => s.toolId === toolId)
      
      let score = 0
      const reasons: string[] = []

      // Base score from historical effectiveness
      if (toolStats && toolStats.totalUses > 0) {
        score += toolStats.effectivenessScore * 50
        if (toolStats.completionRate > 0.7) {
          reasons.push('high completion rate')
        }
      } else {
        // New user bonus for essential tools
        if (['quick-access', 'physiological-sigh', '5-4-3-2-1'].includes(toolId)) {
          score += 20
          reasons.push('great for beginners')
        }
      }

      // Time-based scoring
      if (context.timeAvailable) {
        const toolDuration = toolInfo.duration
        if (context.timeAvailable === 'quick' && toolDuration <= 180) {
          score += 25
          reasons.push('fits your time')
        } else if (context.timeAvailable === 'moderate' && toolDuration <= 600) {
          score += 20
          reasons.push('good time fit')
        } else if (context.timeAvailable === 'long' && toolDuration > 600) {
          score += 15
          reasons.push('thorough approach')
        }
      }

      // Stress level matching
      if (context.recentStress && (toolInfo.stress as readonly string[]).includes(context.recentStress)) {
        score += 30
        reasons.push(`ideal for ${context.recentStress} stress`)
      }

      // Time of day preference
      if (toolStats && toolStats.preferredTimes.includes(context.timeOfDay)) {
        score += 15
        reasons.push(`you often use this ${context.timeOfDay}`)
      }

      // Recency penalty to encourage variety
      if (toolStats && this.isRecentlyUsed(toolStats.lastUsed)) {
        score -= 10
      } else if (toolStats && toolStats.totalUses > 0) {
        reasons.push('try again')
      }

      // Special contextual boosts
      if (context.timeOfDay === 'morning' && ['breathing-space', 'present-moment'].includes(toolId)) {
        score += 10
        reasons.push('great morning start')
      }
      
      if (context.timeOfDay === 'evening' && ['body-scan', 'progressive-relaxation'].includes(toolId)) {
        score += 10
        reasons.push('perfect for winding down')
      }

      if (score > 0) {
        recommendations.push({
          toolId,
          score,
          reason: reasons.slice(0, 2).join(', ')
        })
      }
    }

    // Sort by score and return top 4 recommendations
    return recommendations
      .sort((a, b) => b.score - a.score)
      .slice(0, 4)
      .map(r => r.toolId)
  }

  static getInsight(): string {
    const stats = this.getToolStats()
    const usage = this.getUsageHistory()
    
    if (usage.length === 0) {
      return "Welcome! Try different tools to discover what works best for you."
    }

    const totalSessions = usage.length
    const completedSessions = usage.filter(u => u.completed).length
    const completionRate = completedSessions / totalSessions

    const mostUsedTool = stats.reduce((prev, current) => 
      prev.totalUses > current.totalUses ? prev : current
    )

    const currentTime = this.getTimeOfDay()
    const timeUsage = usage.filter(u => u.timeOfDay === currentTime).length
    const timePreference = timeUsage / usage.length > 0.4

    const insights = []

    if (completionRate > 0.8) {
      insights.push("You have excellent follow-through! ✨")
    } else if (completionRate > 0.6) {
      insights.push("You're building good habits! 💪")
    }

    if (mostUsedTool && mostUsedTool.totalUses > 3) {
      insights.push(`${mostUsedTool.toolId.replace('-', ' ')} seems to work well for you`)
    }

    if (timePreference) {
      insights.push(`You tend to practice in the ${currentTime}`)
    }

    if (usage.length > 10) {
      const recentWeek = usage.filter(u => Date.now() - u.timestamp < 7 * 24 * 60 * 60 * 1000)
      if (recentWeek.length > 5) {
        insights.push("You've been very consistent this week! 🎉")
      }
    }

    return insights.length > 0 ? insights[0] : "Keep exploring to find your perfect techniques!"
  }
}

export default RecommendationEngine