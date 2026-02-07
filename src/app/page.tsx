"use client"

import { useState } from 'react'
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import BoxBreathing from '@/features/breathing/BoxBreathing'
import TriangleBreathing from '@/features/breathing/TriangleBreathing'
import PhysiologicalSigh from '@/features/breathing/PhysiologicalSigh'
import CoherentBreathing from '@/features/breathing/CoherentBreathing'
import FourSevenEight from '@/features/breathing/FourSevenEight'
import AlternateNostril from '@/features/breathing/AlternateNostril'
import FiveThreeOne from '@/features/grounding/FiveThreeOne'
import BodyScan from '@/features/grounding/BodyScan'
import EmergencyGrounding from '@/features/grounding/EmergencyGrounding'
import EFTTapping from '@/features/grounding/EFTTapping'
import DiveReflex from '@/features/grounding/DiveReflex'
import ProgressiveMuscleRelaxation from '@/features/progressive-relaxation/ProgressiveMuscleRelaxation'
import BreathingSpace from '@/features/mindfulness/BreathingSpace'
import PresentMoment from '@/features/mindfulness/PresentMoment'
import LovingKindness from '@/features/mindfulness/LovingKindness'
import AffirmationsMantras from '@/features/mindfulness/AffirmationsMantras'
import SafePlace from '@/features/visualization/SafePlace'
import NatureScenes from '@/features/visualization/NatureScenes'
import SoundFrequencies from '@/features/sound/SoundFrequencies'
import NoiseAndAmbience from '@/features/sound/NoiseAndAmbience'
import QuickAccessMode from '@/features/quick-access/QuickAccessMode'
import RecommendationsPanel from '@/components/RecommendationsPanel'
import ShareBar from '@/components/ShareBar'
import AnimationToggle from '@/components/AnimationToggle'
import AmbientBackground from '@/components/AmbientBackground'
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
import { Music2, Quote, Activity, Timer, Shuffle, Snowflake } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'

type ActiveTool =
  | 'home'
  | 'quick-access'
  | 'box-breathing'
  | 'triangle-breathing'
  | 'physiological-sigh'
  | 'coherent-breathing'
  | 'four-seven-eight'
  | 'alternate-nostril'
  | '5-4-3-2-1'
  | 'body-scan'
  | 'eft-tapping'
  | 'dive-reflex'
  | 'emergency-grounding'
  | 'progressive-relaxation'
  | 'breathing-space'
  | 'present-moment'
  | 'loving-kindness'
  | 'affirmations-mantras'
  | 'safe-place'
  | 'nature-scenes'
  | 'sound-frequencies'
  | 'noise-ambience'

const CATEGORY_COLORS: Record<string, { border: string; bg: string; accent: string }> = {
  'Quick Access': { border: 'border-l-yellow-500', bg: 'bg-yellow-50/30', accent: 'text-yellow-600' },
  'Crisis Support': { border: 'border-l-red-500', bg: 'bg-red-50/30', accent: 'text-red-600' },
  'Breathing': { border: 'border-l-blue-500', bg: 'bg-blue-50/30', accent: 'text-blue-600' },
  'Grounding': { border: 'border-l-amber-500', bg: 'bg-amber-50/30', accent: 'text-amber-600' },
  'Mindfulness': { border: 'border-l-purple-500', bg: 'bg-purple-50/30', accent: 'text-purple-600' },
  'Relaxation': { border: 'border-l-teal-500', bg: 'bg-teal-50/30', accent: 'text-teal-600' },
  'Visualization': { border: 'border-l-emerald-500', bg: 'bg-emerald-50/30', accent: 'text-emerald-600' },
  'Sound': { border: 'border-l-orange-500', bg: 'bg-orange-50/30', accent: 'text-orange-600' },
}

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
    id: 'coherent-breathing' as const,
    title: 'Coherent Breathing (6 bpm)',
    description: '5s inhale and 5s exhale to balance HRV',
    category: 'Breathing',
    duration: '3-10 minutes',
    icon: Activity,
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
  {
    id: 'four-seven-eight' as const,
    title: '4\u20117\u20118 Breathing',
    description: '4s inhale, 7s hold, 8s slow exhale',
    category: 'Breathing',
    duration: '2-5 minutes',
    icon: Timer,
    color: 'calm'
  },
  {
    id: 'alternate-nostril' as const,
    title: 'Alternate Nostril',
    description: 'Balanced left/right breathing to steady focus',
    category: 'Breathing',
    duration: '3-8 minutes',
    icon: Shuffle,
    color: 'grounding'
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
    id: 'eft-tapping' as const,
    title: 'EFT Tapping',
    description: 'Gentle acupoint tapping sequence for relief',
    category: 'Grounding',
    duration: '3-8 minutes',
    icon: Hand,
    color: 'grounding'
  },
  {
    id: 'dive-reflex' as const,
    title: 'Dive Reflex Activation',
    description: 'Cold stimulus to trigger calming reflex',
    category: 'Grounding',
    duration: '30-60 seconds',
    icon: Snowflake,
    color: 'calm'
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
    id: 'affirmations-mantras' as const,
    title: 'Affirmations & Mantras',
    description: 'Supportive phrases to guide attention kindly',
    category: 'Mindfulness',
    duration: '1-5 minutes',
    icon: Quote,
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
  ,
  // Sound Tools
  {
    id: 'sound-frequencies' as const,
    title: 'Calming Sounds',
    description: 'Gentle tone generator with smooth fades',
    category: 'Sound',
    duration: '1-10 minutes',
    icon: Music2,
    color: 'grounding'
  },
  {
    id: 'noise-ambience' as const,
    title: 'Noise & Ambience',
    description: 'White/pink/brown/blue noise and ocean/rain',
    category: 'Sound',
    duration: '1-60 minutes',
    icon: Waves,
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
  'Visualization': tools.filter(tool => tool.category === 'Visualization'),
  'Sound': tools.filter(tool => tool.category === 'Sound')
}

// Map tool IDs to their category for ambient background
const toolCategoryMap: Record<string, string> = {}
tools.forEach(t => { toolCategoryMap[t.id] = t.category })

export default function HomePage() {
  const [activeTool, setActiveTool] = useState<ActiveTool>('home')

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.06 } },
  }
  const itemVariants = {
    hidden: { opacity: 0, y: 8 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.35, ease: 'easeOut' } },
  }

  // Tool rendering functions
  const renderTool = () => {
    switch (activeTool) {
      case 'quick-access': return <QuickAccessMode />
      case 'box-breathing': return <BoxBreathing />
      case 'triangle-breathing': return <TriangleBreathing />
      case 'physiological-sigh': return <PhysiologicalSigh />
      case 'coherent-breathing': return <CoherentBreathing />
      case 'four-seven-eight': return <FourSevenEight />
      case 'alternate-nostril': return <AlternateNostril />
      case '5-4-3-2-1': return <FiveThreeOne />
      case 'body-scan': return <BodyScan />
      case 'eft-tapping': return <EFTTapping />
      case 'dive-reflex': return <DiveReflex />
      case 'emergency-grounding': return <EmergencyGrounding />
      case 'progressive-relaxation': return <ProgressiveMuscleRelaxation />
      case 'breathing-space': return <BreathingSpace />
      case 'present-moment': return <PresentMoment />
      case 'loving-kindness': return <LovingKindness />
      case 'affirmations-mantras': return <AffirmationsMantras />
      case 'safe-place': return <SafePlace />
      case 'nature-scenes': return <NatureScenes />
      case 'sound-frequencies': return <SoundFrequencies />
      case 'noise-ambience': return <NoiseAndAmbience />
      default: return null
    }
  }

  if (activeTool !== 'home') {
    const category = toolCategoryMap[activeTool] ?? 'Breathing'
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
        <AmbientBackground category={category}>
          {renderTool()}
        </AmbientBackground>
      </div>
    )
  }

  return (
    <div className="max-w-6xl mx-auto">
      {/* Header */}
      <motion.div
        className="text-center mb-12"
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.45, ease: 'easeOut' }}
      >
        <div className="flex items-center justify-center space-x-3 mb-4">
          <motion.div animate={{ y: [0, -2, 0] }} transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}>
            <Heart className="w-8 h-8 text-calm-600" />
          </motion.div>
          <h1 className="text-4xl font-bold text-calm-800">CalmMyself</h1>
        </div>
        <p className="text-xl text-gray-600 mb-2">Your personal toolbox for nervous system regulation</p>
        <div className="flex items-center justify-center gap-3">
          <p className="text-sm text-gray-500">Evidence-based calming techniques with smart recommendations</p>
          <AnimationToggle />
        </div>
      </motion.div>

      {/* Share */}
      <ShareBar />

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
      <div className="bg-red-50 border-2 border-red-300 rounded-lg p-4 mb-8 shadow-sm">
        <div className="flex items-start space-x-3">
          <div className="flex-shrink-0">
            <div className="w-8 h-8 bg-red-100 rounded-full flex items-center justify-center border border-red-200">
              <AlertTriangle className="w-4 h-4 text-red-600" />
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
              className="ml-4 border-red-400 text-red-700 hover:bg-red-100 flex-shrink-0 font-semibold"
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
          const catColors = CATEGORY_COLORS[categoryName] ?? CATEGORY_COLORS['Breathing']
          const isQuickAccessCategory = categoryName === 'Quick Access'
          const isEmergencyCategory = categoryName === 'Emergency'

          return (
            <motion.div key={categoryName} initial={{ opacity: 0, y: 8 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, amount: 0.2 }} transition={{ duration: 0.4, ease: 'easeOut' }}>
              <div className={`rounded-xl p-4 ${catColors.bg}`}>
                <h2 className="text-xl font-semibold text-gray-800 mb-4 flex items-center">
                  {categoryName === 'Quick Access' && <Zap className="w-5 h-5 text-yellow-600 mr-2" />}
                  {categoryName === 'Emergency' && <AlertTriangle className="w-5 h-5 text-red-600 mr-2" />}
                  {categoryName === 'Breathing' && <Wind className="w-5 h-5 text-blue-600 mr-2" />}
                  {categoryName === 'Grounding' && <Hand className="w-5 h-5 text-amber-600 mr-2" />}
                  {categoryName === 'Mindfulness' && <Sparkles className="w-5 h-5 text-purple-600 mr-2" />}
                  {categoryName === 'Relaxation' && <Waves className="w-5 h-5 text-teal-600 mr-2" />}
                  {categoryName === 'Visualization' && <Trees className="w-5 h-5 text-emerald-600 mr-2" />}
                  {categoryName === 'Sound' && <Music2 className="w-5 h-5 text-orange-600 mr-2" />}
                  {categoryName}
                  <span className="ml-2 text-sm text-gray-500 font-normal">
                    ({categoryTools.length} tool{categoryTools.length !== 1 ? 's' : ''})
                  </span>
                </h2>

                <motion.div
                  className={`grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4`}
                  variants={containerVariants} initial="hidden" whileInView="visible" viewport={{ once: true, amount: 0.2 }}
                >
                  {categoryTools.map((tool, idx) => {
                    const Icon = tool.icon
                    const isEmergency = tool.category === 'Crisis Support'
                    const isQuickAccess = tool.category === 'Quick Access'
                    const toolCatColors = CATEGORY_COLORS[tool.category] ?? CATEGORY_COLORS['Breathing']

                    return (
                      <motion.div
                        key={tool.id}
                        variants={itemVariants}
                        whileHover={{ y: -4, scale: 1.02 }}
                        whileTap={{ scale: 0.995 }}
                        className={isQuickAccess ? 'md:col-span-2 lg:col-span-3' : ''}
                      >
                        <Card
                          className={`transition-all duration-200 cursor-pointer border-l-4 ${toolCatColors.border} ${
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
                              <motion.div animate={{ y: [0, -2, 0] }} transition={{ duration: 5, repeat: Infinity, ease: 'easeInOut', delay: idx * 0.1 }}>
                                <Icon size={24} />
                              </motion.div>
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
                      </motion.div>
                    )
                  })}
                </motion.div>
              </div>
            </motion.div>
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
