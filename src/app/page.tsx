'use client'

import { useState } from 'react'
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import BoxBreathing from '@/features/breathing/BoxBreathing'
import TriangleBreathing from '@/features/breathing/TriangleBreathing'
import PhysiologicalSigh from '@/features/breathing/PhysiologicalSigh'
import FiveThreeOne from '@/features/grounding/FiveThreeOne'
import BodyScan from '@/features/grounding/BodyScan'
import EmergencyGrounding from '@/features/grounding/EmergencyGrounding'
import ProgressiveMuscleRelaxation from '@/features/progressive-relaxation/ProgressiveMuscleRelaxation'
import BreathingSpace from '@/features/mindfulness/BreathingSpace'
import PresentMoment from '@/features/mindfulness/PresentMoment'
import LovingKindness from '@/features/mindfulness/LovingKindness'
import SafePlace from '@/features/visualization/SafePlace'
import NatureScenes from '@/features/visualization/NatureScenes'
import QuickAccessMode from '@/features/quick-access/QuickAccessMode'
import RecommendationsPanel from '@/components/RecommendationsPanel'
import { 
  Wind, 
  Hand, 
  Heart, 
  ArrowLeft, 
  Zap, 
  Triangle, 
  Maximize,
  Scan,
  Clock,
  Sparkles,
  MapPin,
  Trees,
  AlertTriangle,
  Waves
} from 'lucide-react'

type ActiveTool = 
  | 'home' 
  | 'quick-access'
  | 'box-breathing' 
  | 'triangle-breathing'
  | 'physiological-sigh'
  | '5-4-3-2-1'
  | 'body-scan'
  | 'emergency-grounding'
  | 'progressive-relaxation'
  | 'breathing-space'
  | 'present-moment'
  | 'loving-kindness'
  | 'safe-place'
  | 'nature-scenes'

const tools = [
  // Quick Access
  {
    id: 'quick-access' as const,
    title: 'Quick Access Mode',
    description: '60 seconds of rapid-fire calming techniques',
    category: 'Quick Access',
    duration: '1 minute',
    icon: Zap,
    color: 'grounding'
  },

  // Breathing Tools
  {
    id: 'box-breathing' as const,
    title: 'Box Breathing',
    description: '4-4-4-4 breathing pattern for calm and focus',
    category: 'Breathing',
    duration: '2-5 minutes',
    icon: Wind,
    color: 'calm'
  },
  {
    id: 'triangle-breathing' as const,
    title: 'Triangle Breathing',
    description: '4-4-6 pattern for relaxation and stress relief',
    category: 'Breathing',
    duration: '3-8 minutes',
    icon: Triangle,
    color: 'grounding'
  },
  {
    id: 'physiological-sigh' as const,
    title: 'Physiological Sigh',
    description: 'Double inhale + long exhale for rapid calm',
    category: 'Breathing',
    duration: '30 seconds',
    icon: Zap,
    color: 'calm'
  },
  
  // Grounding Tools
  {
    id: '5-4-3-2-1' as const,
    title: '5-4-3-2-1 Grounding',
    description: 'Use your senses to anchor to the present moment',
    category: 'Grounding',
    duration: '3-7 minutes',
    icon: Hand,
    color: 'grounding'
  },
  {
    id: 'body-scan' as const,
    title: 'Body Scan',
    description: 'Mindfully scan through your body from head to toe',
    category: 'Grounding',
    duration: '5-15 minutes',
    icon: Scan,
    color: 'grounding'
  },
  {
    id: 'emergency-grounding' as const,
    title: 'Emergency Grounding',
    description: 'Quick grounding protocol for overwhelming moments',
    category: 'Crisis Support',
    duration: '2-3 minutes',
    icon: AlertTriangle,
    color: 'grounding'
  },

  // Progressive Relaxation
  {
    id: 'progressive-relaxation' as const,
    title: 'Progressive Muscle Relaxation',
    description: 'Systematically tense and relax muscle groups',
    category: 'Relaxation',
    duration: '10-20 minutes',
    icon: Maximize,
    color: 'grounding'
  },

  // Mindfulness Tools
  {
    id: 'breathing-space' as const,
    title: '3-Minute Breathing Space',
    description: 'A short mindfulness practice for any moment',
    category: 'Mindfulness',
    duration: '3 minutes',
    icon: Clock,
    color: 'calm'
  },
  {
    id: 'present-moment' as const,
    title: 'Present Moment Awareness',
    description: 'Simple questions to anchor you in the now',
    category: 'Mindfulness',
    duration: 'Flexible',
    icon: Sparkles,
    color: 'calm'
  },
  {
    id: 'loving-kindness' as const,
    title: 'Loving-Kindness',
    description: 'Cultivate compassion for yourself and others',
    category: 'Mindfulness',
    duration: '5-10 minutes',
    icon: Heart,
    color: 'calm'
  },

  // Visualization Tools
  {
    id: 'safe-place' as const,
    title: 'Safe Place Visualization',
    description: 'Create a mental sanctuary you can visit anytime',
    category: 'Visualization',
    duration: '10-15 minutes',
    icon: MapPin,
    color: 'grounding'
  },
  {
    id: 'nature-scenes' as const,
    title: 'Calming Nature Scenes',
    description: 'Guided visualization through peaceful natural settings',
    category: 'Visualization',
    duration: '5-10 minutes',
    icon: Trees,
    color: 'grounding'
  }
]

// Group tools by category for better organization
const toolsByCategory = {
  'Quick Access': tools.filter(tool => tool.category === 'Quick Access'),
  'Emergency': tools.filter(tool => tool.category === 'Crisis Support'),
  'Breathing': tools.filter(tool => tool.category === 'Breathing'),
  'Grounding': tools.filter(tool => tool.category === 'Grounding'),
  'Mindfulness': tools.filter(tool => tool.category === 'Mindfulness'),
  'Relaxation': tools.filter(tool => tool.category === 'Relaxation'),
  'Visualization': tools.filter(tool => tool.category === 'Visualization')
}

export default function HomePage() {
  const [activeTool, setActiveTool] = useState<ActiveTool>('home')

  // Tool rendering functions
  const renderTool = () => {
    switch (activeTool) {
      case 'quick-access': return <QuickAccessMode />
      case 'box-breathing': return <BoxBreathing />
      case 'triangle-breathing': return <TriangleBreathing />
      case 'physiological-sigh': return <PhysiologicalSigh />
      case '5-4-3-2-1': return <FiveThreeOne />
      case 'body-scan': return <BodyScan />
      case 'emergency-grounding': return <EmergencyGrounding />
      case 'progressive-relaxation': return <ProgressiveMuscleRelaxation />
      case 'breathing-space': return <BreathingSpace />
      case 'present-moment': return <PresentMoment />
      case 'loving-kindness': return <LovingKindness />
      case 'safe-place': return <SafePlace />
      case 'nature-scenes': return <NatureScenes />
      default: return null
    }
  }

  if (activeTool !== 'home') {
    return (
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center mb-6">
          <Button
            variant="ghost"
            onClick={() => setActiveTool('home')}
            className="flex items-center space-x-2 text-calm-700"
          >
            <ArrowLeft size={20} />
            <span>Back to Tools</span>
          </Button>
        </div>
        {renderTool()}
      </div>
    )
  }

  return (
    <div className="max-w-6xl mx-auto">
      {/* Header */}
      <div className="text-center mb-12">
        <div className="flex items-center justify-center space-x-3 mb-4">
          <Heart className="w-8 h-8 text-calm-600" />
          <h1 className="text-4xl font-bold text-calm-800">
            CalmMyself
          </h1>
        </div>
        <p className="text-xl text-gray-600 mb-2">
          Your personal toolbox for nervous system regulation
        </p>
        <p className="text-sm text-gray-500">
          13 evidence-based calming techniques with smart recommendations
        </p>
      </div>

      {/* Recommendations Panel */}
      <RecommendationsPanel 
        tools={tools.map(tool => ({
          id: tool.id,
          title: tool.title,
          description: tool.description,
          duration: tool.duration,
          category: tool.category
        }))}
        onSelectTool={(toolId) => setActiveTool(toolId as ActiveTool)}
      />

      {/* Emergency Banner */}
      <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-8">
        <div className="flex items-start space-x-3">
          <div className="flex-shrink-0">
            <div className="w-6 h-6 bg-red-100 rounded-full flex items-center justify-center">
              <span className="text-red-600 text-sm font-bold">!</span>
            </div>
          </div>
          <div className="flex-1 flex items-center justify-between">
            <p className="text-sm text-red-800">
              <strong>Crisis Support:</strong> If you're experiencing thoughts of self-harm, 
              call 988 (Suicide & Crisis Lifeline) or text "HELLO" to 741741 (Crisis Text Line)
            </p>
            <Button
              onClick={() => setActiveTool('emergency-grounding')}
              variant="outline"
              size="sm"
              className="ml-4 border-red-300 text-red-700 hover:bg-red-50 flex-shrink-0"
            >
              Emergency Tool
            </Button>
          </div>
        </div>
      </div>

      {/* Tool Categories */}
      <div className="space-y-8">
        {Object.entries(toolsByCategory).map(([categoryName, categoryTools]) => {
          if (categoryTools.length === 0) return null
          
          return (
            <div key={categoryName}>
              <h2 className="text-xl font-semibold text-gray-800 mb-4 flex items-center">
                {categoryName === 'Quick Access' && <Zap className="w-5 h-5 text-yellow-600 mr-2" />}
                {categoryName === 'Emergency' && <AlertTriangle className="w-5 h-5 text-red-600 mr-2" />}
                {categoryName === 'Breathing' && <Wind className="w-5 h-5 text-blue-600 mr-2" />}
                {categoryName === 'Grounding' && <Hand className="w-5 h-5 text-green-600 mr-2" />}
                {categoryName === 'Mindfulness' && <Sparkles className="w-5 h-5 text-purple-600 mr-2" />}
                {categoryName === 'Relaxation' && <Waves className="w-5 h-5 text-teal-600 mr-2" />}
                {categoryName === 'Visualization' && <Trees className="w-5 h-5 text-emerald-600 mr-2" />}
                {categoryName}
                <span className="ml-2 text-sm text-gray-500 font-normal">
                  ({categoryTools.length} tool{categoryTools.length !== 1 ? 's' : ''})
                </span>
              </h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {categoryTools.map((tool) => {
                  const Icon = tool.icon
                  const isEmergency = categoryName === 'Emergency'
                  const isQuickAccess = categoryName === 'Quick Access'
                  
                  return (
                    <Card 
                      key={tool.id} 
                      className={`transition-all duration-200 hover:scale-105 cursor-pointer ${
                        isEmergency ? 'border-red-200 bg-red-50' : 
                        isQuickAccess ? 'border-yellow-200 bg-yellow-50' : ''
                      }`}
                    >
                      <CardHeader>
                        <div className="flex items-start space-x-3">
                          <div className={`flex-shrink-0 w-12 h-12 rounded-lg flex items-center justify-center ${
                            isEmergency 
                              ? 'bg-red-100 text-red-700'
                              : isQuickAccess
                                ? 'bg-yellow-100 text-yellow-700'
                                : tool.color === 'calm' 
                                  ? 'bg-calm-100 text-calm-700' 
                                  : 'bg-grounding-100 text-grounding-700'
                          }`}>
                            <Icon size={24} />
                          </div>
                          <div className="flex-1">
                            <CardTitle className={`text-lg ${
                              isEmergency ? 'text-red-800' : 
                              isQuickAccess ? 'text-yellow-800' : ''
                            }`}>
                              {tool.title}
                            </CardTitle>
                            <div className={`flex items-center space-x-2 text-xs mt-1 ${
                              isEmergency ? 'text-red-600' : 
                              isQuickAccess ? 'text-yellow-600' : 'text-gray-500'
                            }`}>
                              <span>{tool.category}</span>
                              <span>•</span>
                              <span>{tool.duration}</span>
                            </div>
                          </div>
                        </div>
                      </CardHeader>
                      <CardContent>
                        <CardDescription className={`mb-4 ${
                          isEmergency ? 'text-red-700' : 
                          isQuickAccess ? 'text-yellow-700' : ''
                        }`}>
                          {tool.description}
                        </CardDescription>
                        <Button
                          onClick={() => setActiveTool(tool.id)}
                          variant={isEmergency ? 'outline' : 
                                   isQuickAccess ? 'outline' : 
                                   (tool.color as 'calm' | 'grounding')}
                          className={`w-full ${
                            isEmergency ? 'border-red-300 text-red-700 hover:bg-red-100' :
                            isQuickAccess ? 'border-yellow-300 text-yellow-700 hover:bg-yellow-100' : ''
                          }`}
                        >
                          {isEmergency ? 'Use Now' : 
                           isQuickAccess ? 'Quick Start' : 'Start Exercise'}
                        </Button>
                      </CardContent>
                    </Card>
                  )
                })}
              </div>
            </div>
          )
        })}
      </div>

      {/* Footer */}
      <div className="mt-16 text-center text-sm text-gray-500 border-t border-gray-200 pt-8">
        <p className="mb-2">
          All techniques are evidence-based and designed for general wellness. 
          Not a replacement for professional mental health care.
        </p>
        <p className="text-xs">
          Built with accessibility, privacy, and user safety as top priorities. 
          No data collection • Offline ready • Free forever
        </p>
      </div>
    </div>
  )
}