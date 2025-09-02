"use client"

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import RecommendationEngine, { RecommendationContext } from '@/lib/recommendations'
import { Sparkles, Clock, Zap, TrendingUp, RefreshCw } from 'lucide-react'

interface Tool {
  id: string
  title: string
  description: string
  duration: string
  category: string
}

interface RecommendationsPanelProps {
  tools: Tool[]
  onSelectTool: (toolId: string) => void
}

export default function RecommendationsPanel({ tools, onSelectTool }: RecommendationsPanelProps) {
  const [recommendations, setRecommendations] = useState<string[]>([])
  const [insight, setInsight] = useState<string>('')
  const [context, setContext] = useState<RecommendationContext>({
    timeOfDay: RecommendationEngine.getTimeOfDay(),
    dayOfWeek: new Date().getDay()
  })
  const [timeAvailable, setTimeAvailable] = useState<'quick' | 'moderate' | 'long'>('moderate')
  const [stressLevel, setStressLevel] = useState<'high' | 'medium' | 'low'>('medium')

  const updateRecommendations = () => {
    const newContext: RecommendationContext = {
      ...context,
      timeAvailable,
      recentStress: stressLevel
    }
    
    const recs = RecommendationEngine.getRecommendations(newContext)
    setRecommendations(recs)
    setInsight(RecommendationEngine.getInsight())
  }

  useEffect(() => {
    updateRecommendations()
  }, [timeAvailable, stressLevel])

  const getRecommendedTools = () => {
    return recommendations
      .map(recId => tools.find(tool => tool.id === recId))
      .filter(Boolean) as Tool[]
  }

  const getStressIcon = (level: string) => {
    switch (level) {
      case 'high': return '🔴'
      case 'medium': return '🟡' 
      case 'low': return '🟢'
      default: return '🟡'
    }
  }

  const getTimeIcon = (time: string) => {
    switch (time) {
      case 'quick': return '⚡'
      case 'moderate': return '⏰'
      case 'long': return '🧘'
      default: return '⏰'
    }
  }

  const listVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.06 } },
  }
  const itemVariants = {
    hidden: { opacity: 0, y: 8 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.3, ease: 'easeOut' } },
  }

  return (
    <Card className="mb-8 bg-gradient-to-r from-purple-50 to-pink-50 border-purple-200">
      <CardHeader>
        <div className="flex items-center space-x-2">
          <Sparkles className="w-5 h-5 text-purple-600" />
          <CardTitle className="text-purple-800">Personalized Recommendations</CardTitle>
        </div>
        <CardDescription className="text-purple-700">
          Based on your preferences and current needs
        </CardDescription>
      </CardHeader>
      
      <CardContent className="space-y-6">
        {/* Context Selection */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-purple-700 mb-2">
              How are you feeling?
            </label>
            <div className="grid grid-cols-3 gap-1">
              {(['high', 'medium', 'low'] as const).map((level) => (
                <Button
                  key={level}
                  onClick={() => setStressLevel(level)}
                  variant={stressLevel === level ? 'calm' : 'outline'}
                  size="sm"
                  className={`text-xs ${
                    stressLevel === level ? 'bg-purple-600 hover:bg-purple-700' : ''
                  }`}
                >
                  {getStressIcon(level)} {level === 'high' ? 'Stressed' : level === 'medium' ? 'Okay' : 'Calm'}
                </Button>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-purple-700 mb-2">
              Time available?
            </label>
            <div className="grid grid-cols-3 gap-1">
              {(['quick', 'moderate', 'long'] as const).map((time) => (
                <Button
                  key={time}
                  onClick={() => setTimeAvailable(time)}
                  variant={timeAvailable === time ? 'calm' : 'outline'}
                  size="sm"
                  className={`text-xs ${
                    timeAvailable === time ? 'bg-purple-600 hover:bg-purple-700' : ''
                  }`}
                >
                  {getTimeIcon(time)} {time === 'quick' ? '<3min' : time === 'moderate' ? '3-10min' : '10min+'}
                </Button>
              ))}
            </div>
          </div>
        </div>

        {/* Insight */}
        <AnimatePresence mode="wait">
          {insight && (
            <motion.div
              key={insight}
              className="bg-white/60 rounded-lg p-3 border border-purple-200"
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.25, ease: 'easeOut' }}
            >
              <div className="flex items-start space-x-2">
                <TrendingUp className="w-4 h-4 text-purple-600 mt-0.5 flex-shrink-0" />
                <p className="text-sm text-purple-800">{insight}</p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Recommended Tools */}
        <div>
          <div className="flex items-center justify-between mb-3">
            <h3 className="font-medium text-purple-800">Suggested for you right now:</h3>
            <Button
              onClick={updateRecommendations}
              variant="ghost"
              size="sm"
              className="text-purple-600 hover:text-purple-700 p-1"
            >
              <RefreshCw size={16} />
            </Button>
          </div>
          
          <motion.div className="grid grid-cols-1 md:grid-cols-2 gap-3" variants={listVariants} initial="hidden" animate="visible">
            {getRecommendedTools().slice(0, 4).map((tool, index) => (
              <motion.div key={tool.id} variants={itemVariants} whileHover={{ y: -2, scale: 1.01 }} whileTap={{ scale: 0.995 }}>
                <Card 
                  className="cursor-pointer bg-white/80 border-purple-100 hover:border-purple-300 transition-colors"
                  onClick={() => onSelectTool(tool.id)}
                >
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="font-medium text-purple-900 text-sm">{tool.title}</h4>
                      {index === 0 && (
                        <span className="text-xs bg-purple-100 text-purple-700 px-2 py-1 rounded-full">Top Pick</span>
                      )}
                    </div>
                    <p className="text-xs text-purple-600 mb-2">{tool.description}</p>
                    <div className="flex items-center justify-between">
                      <span className="text-xs text-purple-500">{tool.duration}</span>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="text-xs text-purple-600 hover:text-purple-700 p-1 h-auto"
                        onClick={(e) => {
                          e.stopPropagation()
                          onSelectTool(tool.id)
                        }}
                      >
                        Try Now →
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </motion.div>

          {getRecommendedTools().length === 0 && (
            <div className="text-center py-4 text-purple-600">
              <Sparkles className="w-8 h-8 mx-auto mb-2 opacity-50" />
              <p className="text-sm">Use a few tools to get personalized recommendations!</p>
            </div>
          )}
        </div>

        {/* Quick Stats */}
        <div className="bg-white/40 rounded-lg p-3">
          <p className="text-xs text-purple-600 text-center">
            💡 The more you use CalmMyself, the smarter these recommendations become
          </p>
        </div>
      </CardContent>
    </Card>
  )
}
