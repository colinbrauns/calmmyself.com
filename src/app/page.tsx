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
import GroundedCountdown from '@/features/grounding/GroundedCountdown'
import TemperatureTextureScan from '@/features/grounding/TemperatureTextureScan'
import MicroMovementCheckIn from '@/features/grounding/MicroMovementCheckIn'
import MicroBreakTimer from '@/features/grounding/MicroBreakTimer'
import ProgressiveMuscleRelaxation from '@/features/progressive-relaxation/ProgressiveMuscleRelaxation'
import BodyMelt from '@/features/progressive-relaxation/BodyMelt'
import BreathingSpace from '@/features/mindfulness/BreathingSpace'
import PresentMoment from '@/features/mindfulness/PresentMoment'
import LovingKindness from '@/features/mindfulness/LovingKindness'
import AffirmationsMantras from '@/features/mindfulness/AffirmationsMantras'
import SelfCompassionBreak from '@/features/mindfulness/SelfCompassionBreak'
import CompassionateJournaling from '@/features/mindfulness/CompassionateJournaling'
import UrgeSurfing from '@/features/mindfulness/UrgeSurfing'
import LandTheDay from '@/features/mindfulness/LandTheDay'
import WorryParkingLot from '@/features/mindfulness/WorryParkingLot'
import ConversationPrep from '@/features/mindfulness/ConversationPrep'
import ConversationDebrief from '@/features/mindfulness/ConversationDebrief'
import ValuesCompass from '@/features/mindfulness/ValuesCompass'
import FutureYouPostcard from '@/features/mindfulness/FutureYouPostcard'
import SafePlace from '@/features/visualization/SafePlace'
import NatureScenes from '@/features/visualization/NatureScenes'
import CloudVisualization from '@/features/visualization/CloudVisualization'
import ThoughtsOnScreen from '@/features/visualization/ThoughtsOnScreen'
import SoundFrequencies from '@/features/sound/SoundFrequencies'
import NoiseAndAmbience from '@/features/sound/NoiseAndAmbience'
import AnchorPhraseBreath from '@/features/breathing/AnchorPhraseBreath'
import ThreeBreathReset from '@/features/breathing/ThreeBreathReset'
import QuickAccessMode from '@/features/quick-access/QuickAccessMode'
import RecommendationsPanel from '@/components/RecommendationsPanel'
import ShareBar from '@/components/ShareBar'
import { useFavorites } from '@/hooks/useFavorites'
import AnimationToggle from '@/components/AnimationToggle'
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
import { motion } from 'framer-motion'

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
  | 'grounded-countdown'
  | 'progressive-relaxation'
  | 'body-melt'
  | 'breathing-space'
  | 'present-moment'
  | 'loving-kindness'
  | 'affirmations-mantras'
  | 'self-compassion'
  | 'compassionate-journaling'
  | 'urge-surfing'
  | 'land-the-day'
  | 'worry-parking-lot'
  | 'conversation-prep'
  | 'conversation-debrief'
  | 'values-compass'
  | 'future-you-postcard'
  | 'safe-place'
  | 'nature-scenes'
  | 'cloud-visualization'
  | 'thoughts-on-screen'
  | 'sound-frequencies'
  | 'noise-ambience'
  | 'anchor-phrase-breath'
  | 'three-breath-reset'
  | 'temperature-texture-scan'
  | 'micro-movement-checkin'
  | 'micro-break-timer'

type QuickFilterId = 'panic' | 'sleep' | 'work' | 'low-energy'

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
    title: '4‑7‑8 Breathing',
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
  {
    id: 'anchor-phrase-breath' as const,
    title: 'Anchor Phrase + Breath',
    description: 'Pair a gentle phrase with each breath for quick calm',
    category: 'Breathing',
    duration: '1-3 minutes',
    icon: Heart,
    color: 'calm'
  },
  {
    id: 'three-breath-reset' as const,
    title: '3‑Breath Reset',
    description: 'Three short breaths between tasks',
    category: 'Breathing',
    duration: '30 seconds',
    icon: Wind,
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
    id: 'grounded-countdown' as const,
    title: 'Grounded Countdown',
    description: 'Count down with your steps or feet for panic and high arousal',
    category: 'Grounding',
    duration: '1-3 minutes',
    icon: Hand,
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
  {
    id: 'body-melt' as const,
    title: 'Body Melt (Mini PMR)',
    description: 'Three quick tension‑and‑release regions before rest',
    category: 'Relaxation',
    duration: '3-5 minutes',
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
    id: 'urge-surfing' as const,
    title: 'Urge Surfing',
    description: 'Ride out strong urges without needing to act on them',
    category: 'Mindfulness',
    duration: '2-5 minutes',
    icon: Sparkles,
    color: 'grounding'
  },
  {
    id: 'self-compassion' as const,
    title: 'Self‑Compassion Break',
    description: 'Three-step practice to turn kindness toward yourself',
    category: 'Mindfulness',
    duration: '2-4 minutes',
    icon: Heart,
    color: 'calm'
  },
  {
    id: 'land-the-day' as const,
    title: 'Land the Day',
    description: 'Short evening check‑in before bed',
    category: 'Mindfulness',
    duration: '3-5 minutes',
    icon: Clock,
    color: 'calm'
  },
  {
    id: 'worry-parking-lot' as const,
    title: 'Worry Parking Lot',
    description: 'Capture a worry, choose an action, and schedule it',
    category: 'Mindfulness',
    duration: '3-7 minutes',
    icon: Quote,
    color: 'grounding'
  },
  {
    id: 'conversation-prep' as const,
    title: 'Before‑Conversation Prep',
    description: 'Orient to values and control before hard talks',
    category: 'Mindfulness',
    duration: '3-5 minutes',
    icon: Sparkles,
    color: 'calm'
  },
  {
    id: 'conversation-debrief' as const,
    title: 'After‑Conversation De‑Brief',
    description: 'Gently unwind post‑conversation spirals',
    category: 'Mindfulness',
    duration: '3-7 minutes',
    icon: Sparkles,
    color: 'grounding'
  },
  {
    id: 'values-compass' as const,
    title: 'Values Compass',
    description: 'Pick a direction and a tiny values‑aligned step',
    category: 'Mindfulness',
    duration: '1-3 minutes',
    icon: Heart,
    color: 'calm'
  },
  {
    id: 'future-you-postcard' as const,
    title: 'Future‑You Postcard',
    description: 'A tiny note from a steadier future‑you',
    category: 'Mindfulness',
    duration: '1-3 minutes',
    icon: Quote,
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
  {
    id: 'compassionate-journaling' as const,
    title: 'Compassionate Journaling',
    description: 'Guided prompts to get worries out and respond kindly',
    category: 'Mindfulness',
    duration: '3-10 minutes',
    icon: Quote,
    color: 'grounding'
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
  },
  {
    id: 'cloud-visualization' as const,
    title: 'Thoughts as Clouds',
    description: 'Let thoughts drift by like clouds in the sky',
    category: 'Visualization',
    duration: '2-5 minutes',
    icon: Trees,
    color: 'calm'
  },
  {
    id: 'thoughts-on-screen' as const,
    title: 'Thoughts on a Screen',
    description: 'Watch thoughts as subtitles instead of being inside them',
    category: 'Visualization',
    duration: '2-5 minutes',
    icon: MapPin,
    color: 'calm'
  },

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
] as const

const quickFilterConfig: Record<
  QuickFilterId,
  { label: string; subtitle: string; toolIds: ActiveTool[] }
> = {
  panic: {
    label: 'Panic / Overwhelmed',
    subtitle: 'Fast-acting tools for high distress',
    toolIds: [
      'emergency-grounding',
      'physiological-sigh',
      'box-breathing',
      '5-4-3-2-1',
      'coherent-breathing',
    ],
  },
  sleep: {
    label: 'Sleep / Night',
    subtitle: 'Downshift your system before bed',
    toolIds: [
      'four-seven-eight',
      'progressive-relaxation',
      'noise-ambience',
      'sound-frequencies',
      'safe-place',
    ],
  },
  work: {
    label: 'At Work / In Public',
    subtitle: 'Subtle tools you can use anywhere',
    toolIds: [
      'coherent-breathing',
      'triangle-breathing',
      'breathing-space',
      'present-moment',
      '5-4-3-2-1',
    ],
  },
  'low-energy': {
    label: 'Low Energy',
    subtitle: 'Gentle practices when you’re worn out',
    toolIds: [
      'coherent-breathing',
      'breathing-space',
      'nature-scenes',
      'noise-ambience',
      'body-scan',
    ],
  },
}

// Group tools by category for better organization
const toolsByCategory = {
  'Quick Access': tools.filter((tool) => tool && tool.category === 'Quick Access'),
  'Emergency': tools.filter((tool) => tool && tool.category === 'Crisis Support'),
  'Breathing': tools.filter((tool) => tool && tool.category === 'Breathing'),
  'Grounding': tools.filter((tool) => tool && tool.category === 'Grounding'),
  'Mindfulness': tools.filter((tool) => tool && tool.category === 'Mindfulness'),
  'Relaxation': tools.filter((tool) => tool && tool.category === 'Relaxation'),
  'Visualization': tools.filter((tool) => tool && tool.category === 'Visualization'),
  'Sound': tools.filter((tool) => tool && tool.category === 'Sound'),
} as const

export default function HomePage() {
  const [activeTool, setActiveTool] = useState<ActiveTool>('home')
  const { favorites, isFavorite, toggleFavorite } = useFavorites()
  const [activeFilter, setActiveFilter] = useState<QuickFilterId | 'all'>('all')
  const favoriteTools = tools.filter(
    (tool) => tool && favorites.includes(tool.id),
  )
  const categorySections: { name: string; tools: typeof tools[number][] }[] = [
    ...(favoriteTools.length ? [{ name: 'Favorites', tools: favoriteTools }] : []),
    ...Object.entries(toolsByCategory).map(([name, categoryTools]) => ({
      name,
      tools: categoryTools,
    })),
  ]
  
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
      case 'grounded-countdown': return <GroundedCountdown />
      case 'progressive-relaxation': return <ProgressiveMuscleRelaxation />
      case 'body-melt': return <BodyMelt />
      case 'breathing-space': return <BreathingSpace />
      case 'present-moment': return <PresentMoment />
      case 'loving-kindness': return <LovingKindness />
      case 'affirmations-mantras': return <AffirmationsMantras />
      case 'self-compassion': return <SelfCompassionBreak />
      case 'compassionate-journaling': return <CompassionateJournaling />
      case 'urge-surfing': return <UrgeSurfing />
      case 'land-the-day': return <LandTheDay />
      case 'worry-parking-lot': return <WorryParkingLot />
      case 'conversation-prep': return <ConversationPrep />
      case 'conversation-debrief': return <ConversationDebrief />
      case 'values-compass': return <ValuesCompass />
      case 'future-you-postcard': return <FutureYouPostcard />
      case 'safe-place': return <SafePlace />
      case 'nature-scenes': return <NatureScenes />
      case 'cloud-visualization': return <CloudVisualization />
      case 'thoughts-on-screen': return <ThoughtsOnScreen />
      case 'sound-frequencies': return <SoundFrequencies />
      case 'noise-ambience': return <NoiseAndAmbience />
      case 'anchor-phrase-breath': return <AnchorPhraseBreath />
      case 'three-breath-reset': return <ThreeBreathReset />
      case 'temperature-texture-scan': return <TemperatureTextureScan />
      case 'micro-movement-checkin': return <MicroMovementCheckIn />
      case 'micro-break-timer': return <MicroBreakTimer />
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
        tools={tools.filter((tool): tool is NonNullable<typeof tool> => tool != null).map(tool => ({
          id: tool.id,
          title: tool.title,
          description: tool.description,
          duration: tool.duration,
          category: tool.category
        }))}
        onSelectTool={({ toolId }) => setActiveTool(toolId as ActiveTool)}
      />

      {/* Emergency Banner */}
      <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
        <div className="flex items-start space-x-3">
          <div className="flex-shrink-0">
            <div className="w-6 h-6 bg-red-100 rounded-full flex items-center justify-center">
              <span className="text-red-600 text-sm font-bold">!</span>
            </div>
          </div>
          <div className="flex-1 flex items-center justify-between">
            <p className="text-sm text-red-800">
              <strong>Crisis Support:</strong> If you&rsquo;re experiencing thoughts of self-harm, 
              call 988 (Suicide &amp; Crisis Lifeline) or text &ldquo;HELLO&rdquo; to 741741 (Crisis Text Line)
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

      {/* Quick Filters */}
      <div className="mb-10">
        <div className="flex items-center justify-between mb-2">
          <h2 className="text-sm font-semibold text-gray-800">
            What do you need right now?
          </h2>
          {activeFilter !== 'all' && (
            <span className="text-xs text-gray-500">
              {quickFilterConfig[activeFilter as QuickFilterId].subtitle}
            </span>
          )}
        </div>
        <div className="flex flex-wrap gap-2">
          <Button
            variant={activeFilter === 'all' ? 'calm' : 'outline'}
            size="sm"
            className="text-xs"
            onClick={() => setActiveFilter('all')}
          >
            All
          </Button>
          {(Object.keys(quickFilterConfig) as QuickFilterId[]).map((filterId) => {
            const filter = quickFilterConfig[filterId]
            const isActive = activeFilter === filterId
            return (
              <Button
                key={filterId}
                variant={isActive ? 'calm' : 'outline'}
                size="sm"
                className={`text-xs ${
                  isActive ? 'bg-purple-600 hover:bg-purple-700 text-white' : ''
                }`}
                onClick={() => setActiveFilter(filterId)}
              >
                {filter.label}
              </Button>
            )
          })}
        </div>
      </div>

      {/* Tool Categories */}
      <div className="space-y-8">
        {categorySections.map(({ name: categoryName, tools: categoryTools }) => {
          if (categoryTools.length === 0) return null
          const isFavoritesSection = categoryName === 'Favorites'
          return (
            <motion.div key={categoryName} initial={{ opacity: 0, y: 8 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, amount: 0.2 }} transition={{ duration: 0.4, ease: 'easeOut' }}>
              <h2 className="text-xl font-semibold text-gray-800 mb-4 flex items-center">
                {!isFavoritesSection && categoryName === 'Quick Access' && (
                  <Zap className="w-5 h-5 text-yellow-600 mr-2" />
                )}
                {!isFavoritesSection && categoryName === 'Emergency' && (
                  <AlertTriangle className="w-5 h-5 text-red-600 mr-2" />
                )}
                {!isFavoritesSection && categoryName === 'Breathing' && (
                  <Wind className="w-5 h-5 text-blue-600 mr-2" />
                )}
                {!isFavoritesSection && categoryName === 'Grounding' && (
                  <Hand className="w-5 h-5 text-green-600 mr-2" />
                )}
                {!isFavoritesSection && categoryName === 'Mindfulness' && (
                  <Sparkles className="w-5 h-5 text-purple-600 mr-2" />
                )}
                {!isFavoritesSection && categoryName === 'Relaxation' && (
                  <Waves className="w-5 h-5 text-teal-600 mr-2" />
                )}
                {!isFavoritesSection && categoryName === 'Visualization' && (
                  <Trees className="w-5 h-5 text-emerald-600 mr-2" />
                )}
                {!isFavoritesSection && categoryName === 'Sound' && (
                  <Music2 className="w-5 h-5 text-teal-700 mr-2" />
                )}
                {isFavoritesSection && (
                  <Heart className="w-5 h-5 text-pink-600 mr-2" />
                )}
                {categoryName}
                <span className="ml-2 text-sm text-gray-500 font-normal">
                  ({categoryTools.length} tool{categoryTools.length !== 1 ? 's' : ''})
                </span>
              </h2>
              
              <motion.div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4" variants={containerVariants} initial="hidden" whileInView="visible" viewport={{ once: true, amount: 0.2 }}>
                {categoryTools.map((tool, idx) => {
                  const Icon = tool.icon
                  const isEmergency = categoryName === 'Emergency'
                  const isQuickAccess = categoryName === 'Quick Access'
                  const isHighlighted =
                    activeFilter !== 'all' &&
                    categoryName !== 'Favorites' &&
                    quickFilterConfig[activeFilter as QuickFilterId].toolIds.includes(
                      tool.id,
                    )
                  
                  return (
                    <motion.div key={tool.id} variants={itemVariants} whileHover={{ y: -4, scale: 1.02 }} whileTap={{ scale: 0.995 }}>
                      <Card 
                        className={`transition-all duration-200 cursor-pointer ${
                          isEmergency
                            ? 'border-red-200 bg-red-50'
                            : isQuickAccess
                              ? 'border-yellow-200 bg-yellow-50'
                              : ''
                        } ${
                          isHighlighted
                            ? 'border-purple-300 ring-1 ring-purple-200 bg-purple-50/70'
                            : ''
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
                              <div className="flex items-start justify-between gap-2">
                                <CardTitle className={`text-lg ${
                                  isEmergency ? 'text-red-800' : 
                                  isQuickAccess ? 'text-yellow-800' : ''
                                }`}>
                                  {tool.title}
                                </CardTitle>
                                {!isEmergency && (
                                  <button
                                    type="button"
                                    onClick={(e) => {
                                      e.stopPropagation()
                                      toggleFavorite(tool.id)
                                    }}
                                    aria-label={
                                      isFavorite(tool.id)
                                        ? 'Remove from favorites'
                                        : 'Add to favorites'
                                    }
                                    className="text-xs text-pink-500 hover:text-pink-600 focus-visible:outline-none"
                                  >
                                    <Heart
                                      size={16}
                                      className={
                                        isFavorite(tool.id)
                                          ? 'fill-pink-200 text-pink-600'
                                          : 'text-gray-300'
                                      }
                                    />
                                  </button>
                                )}
                              </div>
                              {isHighlighted && !isEmergency && !isQuickAccess && (
                                <span className="inline-block mt-1 text-[11px] font-medium text-purple-700 bg-purple-100 px-2 py-0.5 rounded-full">
                                  Good for {quickFilterConfig[activeFilter as QuickFilterId].label.toLowerCase()}
                                </span>
                              )}
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
