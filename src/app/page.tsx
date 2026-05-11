"use client"

import { useState, useEffect } from 'react'
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import RecommendationsPanel from '@/components/RecommendationsPanel'
import ShareBar from '@/components/ShareBar'
import { useFavorites } from '@/hooks/useFavorites'
import AnimationToggle from '@/components/AnimationToggle'
import DarkModeToggle from '@/components/DarkModeToggle'
import { 
  Wind, Hand, Heart, ArrowLeft, Zap, Triangle, Maximize, Eye, Compass,
  Scan, Clock, Sparkles, MapPin, Trees, AlertTriangle, Waves
} from 'lucide-react'
import { Music2, Quote, Activity, Timer, Shuffle, Snowflake, Droplets, TreePine, Sun, CloudOff, Apple, Smile, ArrowDown, Moon, Flame } from 'lucide-react'
import { motion } from 'framer-motion'

import dynamic from 'next/dynamic'

// Lazy-loaded tool components
const BoxBreathing = dynamic(() => import('@/features/breathing/BoxBreathing'), { loading: () => <div className="animate-pulse h-64 bg-gray-200 dark:bg-gray-800 rounded-2xl" />, ssr: false })
const TriangleBreathing = dynamic(() => import('@/features/breathing/TriangleBreathing'), { loading: () => <div className="animate-pulse h-64 bg-gray-200 dark:bg-gray-800 rounded-2xl" />, ssr: false })
const PhysiologicalSigh = dynamic(() => import('@/features/breathing/PhysiologicalSigh'), { loading: () => <div className="animate-pulse h-64 bg-gray-200 dark:bg-gray-800 rounded-2xl" />, ssr: false })
const CoherentBreathing = dynamic(() => import('@/features/breathing/CoherentBreathing'), { loading: () => <div className="animate-pulse h-64 bg-gray-200 dark:bg-gray-800 rounded-2xl" />, ssr: false })
const FourSevenEight = dynamic(() => import('@/features/breathing/FourSevenEight'), { loading: () => <div className="animate-pulse h-64 bg-gray-200 dark:bg-gray-800 rounded-2xl" />, ssr: false })
const AlternateNostril = dynamic(() => import('@/features/breathing/AlternateNostril'), { loading: () => <div className="animate-pulse h-64 bg-gray-200 dark:bg-gray-800 rounded-2xl" />, ssr: false })
const FiveThreeOne = dynamic(() => import('@/features/grounding/FiveThreeOne'), { loading: () => <div className="animate-pulse h-64 bg-gray-200 dark:bg-gray-800 rounded-2xl" />, ssr: false })
const BodyScan = dynamic(() => import('@/features/grounding/BodyScan'), { loading: () => <div className="animate-pulse h-64 bg-gray-200 dark:bg-gray-800 rounded-2xl" />, ssr: false })
const EmergencyGrounding = dynamic(() => import('@/features/grounding/EmergencyGrounding'), { loading: () => <div className="animate-pulse h-64 bg-gray-200 dark:bg-gray-800 rounded-2xl" />, ssr: false })
const EFTTapping = dynamic(() => import('@/features/grounding/EFTTapping'), { loading: () => <div className="animate-pulse h-64 bg-gray-200 dark:bg-gray-800 rounded-2xl" />, ssr: false })
const DiveReflex = dynamic(() => import('@/features/grounding/DiveReflex'), { loading: () => <div className="animate-pulse h-64 bg-gray-200 dark:bg-gray-800 rounded-2xl" />, ssr: false })
const GroundedCountdown = dynamic(() => import('@/features/grounding/GroundedCountdown'), { loading: () => <div className="animate-pulse h-64 bg-gray-200 dark:bg-gray-800 rounded-2xl" />, ssr: false })
const TemperatureTextureScan = dynamic(() => import('@/features/grounding/TemperatureTextureScan'), { loading: () => <div className="animate-pulse h-64 bg-gray-200 dark:bg-gray-800 rounded-2xl" />, ssr: false })
const MicroMovementCheckIn = dynamic(() => import('@/features/grounding/MicroMovementCheckIn'), { loading: () => <div className="animate-pulse h-64 bg-gray-200 dark:bg-gray-800 rounded-2xl" />, ssr: false })
const MicroBreakTimer = dynamic(() => import('@/features/grounding/MicroBreakTimer'), { loading: () => <div className="animate-pulse h-64 bg-gray-200 dark:bg-gray-800 rounded-2xl" />, ssr: false })
const ProgressiveMuscleRelaxation = dynamic(() => import('@/features/progressive-relaxation/ProgressiveMuscleRelaxation'), { loading: () => <div className="animate-pulse h-64 bg-gray-200 dark:bg-gray-800 rounded-2xl" />, ssr: false })
const BodyMelt = dynamic(() => import('@/features/progressive-relaxation/BodyMelt'), { loading: () => <div className="animate-pulse h-64 bg-gray-200 dark:bg-gray-800 rounded-2xl" />, ssr: false })
const BreathingSpace = dynamic(() => import('@/features/mindfulness/BreathingSpace'), { loading: () => <div className="animate-pulse h-64 bg-gray-200 dark:bg-gray-800 rounded-2xl" />, ssr: false })
const PresentMoment = dynamic(() => import('@/features/mindfulness/PresentMoment'), { loading: () => <div className="animate-pulse h-64 bg-gray-200 dark:bg-gray-800 rounded-2xl" />, ssr: false })
const LovingKindness = dynamic(() => import('@/features/mindfulness/LovingKindness'), { loading: () => <div className="animate-pulse h-64 bg-gray-200 dark:bg-gray-800 rounded-2xl" />, ssr: false })
const AffirmationsMantras = dynamic(() => import('@/features/mindfulness/AffirmationsMantras'), { loading: () => <div className="animate-pulse h-64 bg-gray-200 dark:bg-gray-800 rounded-2xl" />, ssr: false })
const SelfCompassionBreak = dynamic(() => import('@/features/mindfulness/SelfCompassionBreak'), { loading: () => <div className="animate-pulse h-64 bg-gray-200 dark:bg-gray-800 rounded-2xl" />, ssr: false })
const CompassionateJournaling = dynamic(() => import('@/features/mindfulness/CompassionateJournaling'), { loading: () => <div className="animate-pulse h-64 bg-gray-200 dark:bg-gray-800 rounded-2xl" />, ssr: false })
const UrgeSurfing = dynamic(() => import('@/features/mindfulness/UrgeSurfing'), { loading: () => <div className="animate-pulse h-64 bg-gray-200 dark:bg-gray-800 rounded-2xl" />, ssr: false })
const LandTheDay = dynamic(() => import('@/features/mindfulness/LandTheDay'), { loading: () => <div className="animate-pulse h-64 bg-gray-200 dark:bg-gray-800 rounded-2xl" />, ssr: false })
const WorryParkingLot = dynamic(() => import('@/features/mindfulness/WorryParkingLot'), { loading: () => <div className="animate-pulse h-64 bg-gray-200 dark:bg-gray-800 rounded-2xl" />, ssr: false })
const ConversationPrep = dynamic(() => import('@/features/mindfulness/ConversationPrep'), { loading: () => <div className="animate-pulse h-64 bg-gray-200 dark:bg-gray-800 rounded-2xl" />, ssr: false })
const ConversationDebrief = dynamic(() => import('@/features/mindfulness/ConversationDebrief'), { loading: () => <div className="animate-pulse h-64 bg-gray-200 dark:bg-gray-800 rounded-2xl" />, ssr: false })
const ValuesCompass = dynamic(() => import('@/features/mindfulness/ValuesCompass'), { loading: () => <div className="animate-pulse h-64 bg-gray-200 dark:bg-gray-800 rounded-2xl" />, ssr: false })
const FutureYouPostcard = dynamic(() => import('@/features/mindfulness/FutureYouPostcard'), { loading: () => <div className="animate-pulse h-64 bg-gray-200 dark:bg-gray-800 rounded-2xl" />, ssr: false })
const SafePlace = dynamic(() => import('@/features/visualization/SafePlace'), { loading: () => <div className="animate-pulse h-64 bg-gray-200 dark:bg-gray-800 rounded-2xl" />, ssr: false })
const NatureScenes = dynamic(() => import('@/features/visualization/NatureScenes'), { loading: () => <div className="animate-pulse h-64 bg-gray-200 dark:bg-gray-800 rounded-2xl" />, ssr: false })
const CloudVisualization = dynamic(() => import('@/features/visualization/CloudVisualization'), { loading: () => <div className="animate-pulse h-64 bg-gray-200 dark:bg-gray-800 rounded-2xl" />, ssr: false })
const ThoughtsOnScreen = dynamic(() => import('@/features/visualization/ThoughtsOnScreen'), { loading: () => <div className="animate-pulse h-64 bg-gray-200 dark:bg-gray-800 rounded-2xl" />, ssr: false })
const SoundFrequencies = dynamic(() => import('@/features/sound/SoundFrequencies'), { loading: () => <div className="animate-pulse h-64 bg-gray-200 dark:bg-gray-800 rounded-2xl" />, ssr: false })
const NoiseAndAmbience = dynamic(() => import('@/features/sound/NoiseAndAmbience'), { loading: () => <div className="animate-pulse h-64 bg-gray-200 dark:bg-gray-800 rounded-2xl" />, ssr: false })
const AnchorPhraseBreath = dynamic(() => import('@/features/breathing/AnchorPhraseBreath'), { loading: () => <div className="animate-pulse h-64 bg-gray-200 dark:bg-gray-800 rounded-2xl" />, ssr: false })
const ThreeBreathReset = dynamic(() => import('@/features/breathing/ThreeBreathReset'), { loading: () => <div className="animate-pulse h-64 bg-gray-200 dark:bg-gray-800 rounded-2xl" />, ssr: false })
const QuickAccessMode = dynamic(() => import('@/features/quick-access/QuickAccessMode'), { loading: () => <div className="animate-pulse h-64 bg-gray-200 dark:bg-gray-800 rounded-2xl" />, ssr: false })
const ButterflyHug = dynamic(() => import('@/features/grounding/ButterflyHug'), { loading: () => <div className="animate-pulse h-64 bg-gray-200 dark:bg-gray-800 rounded-2xl" />, ssr: false })
const EyeMovement = dynamic(() => import('@/features/grounding/EyeMovement'), { loading: () => <div className="animate-pulse h-64 bg-gray-200 dark:bg-gray-800 rounded-2xl" />, ssr: false })
const PeripheralVision = dynamic(() => import('@/features/mindfulness/PeripheralVision'), { loading: () => <div className="animate-pulse h-64 bg-gray-200 dark:bg-gray-800 rounded-2xl" />, ssr: false })
const VagalHumming = dynamic(() => import('@/features/breathing/VagalHumming'), { loading: () => <div className="animate-pulse h-64 bg-gray-200 dark:bg-gray-800 rounded-2xl" />, ssr: false })
const CompassionateTouch = dynamic(() => import('@/features/grounding/CompassionateTouch'), { loading: () => <div className="animate-pulse h-64 bg-gray-200 dark:bg-gray-800 rounded-2xl" />, ssr: false })
const ShakeItOff = dynamic(() => import('@/features/grounding/ShakeItOff'), { loading: () => <div className="animate-pulse h-64 bg-gray-200 dark:bg-gray-800 rounded-2xl" />, ssr: false })
const OrientingLook = dynamic(() => import('@/features/grounding/OrientingLook'), { loading: () => <div className="animate-pulse h-64 bg-gray-200 dark:bg-gray-800 rounded-2xl" />, ssr: false })
const BellowsBreath = dynamic(() => import('@/features/breathing/BellowsBreath'), { loading: () => <div className="animate-pulse h-64 bg-gray-200 dark:bg-gray-800 rounded-2xl" />, ssr: false })
const OceanBreath = dynamic(() => import('@/features/breathing/OceanBreath'), { loading: () => <div className="animate-pulse h-64 bg-gray-200 dark:bg-gray-800 rounded-2xl" />, ssr: false })
const ColdWaterHands = dynamic(() => import('@/features/grounding/ColdWaterHands'), { loading: () => <div className="animate-pulse h-64 bg-gray-200 dark:bg-gray-800 rounded-2xl" />, ssr: false })
const NameFiveThings = dynamic(() => import('@/features/grounding/NameFiveThings'), { loading: () => <div className="animate-pulse h-64 bg-gray-200 dark:bg-gray-800 rounded-2xl" />, ssr: false })
const RootingExercise = dynamic(() => import('@/features/grounding/RootingExercise'), { loading: () => <div className="animate-pulse h-64 bg-gray-200 dark:bg-gray-800 rounded-2xl" />, ssr: false })
const GratitudeList = dynamic(() => import('@/features/mindfulness/GratitudeList'), { loading: () => <div className="animate-pulse h-64 bg-gray-200 dark:bg-gray-800 rounded-2xl" />, ssr: false })
const ThoughtDefusion = dynamic(() => import('@/features/mindfulness/ThoughtDefusion'), { loading: () => <div className="animate-pulse h-64 bg-gray-200 dark:bg-gray-800 rounded-2xl" />, ssr: false })
const MindfulEating = dynamic(() => import('@/features/mindfulness/MindfulEating'), { loading: () => <div className="animate-pulse h-64 bg-gray-200 dark:bg-gray-800 rounded-2xl" />, ssr: false })
const JawRelease = dynamic(() => import('@/features/body/JawRelease'), { loading: () => <div className="animate-pulse h-64 bg-gray-200 dark:bg-gray-800 rounded-2xl" />, ssr: false })
const ShoulderDrop = dynamic(() => import('@/features/body/ShoulderDrop'), { loading: () => <div className="animate-pulse h-64 bg-gray-200 dark:bg-gray-800 rounded-2xl" />, ssr: false })
const HandMassage = dynamic(() => import('@/features/body/HandMassage'), { loading: () => <div className="animate-pulse h-64 bg-gray-200 dark:bg-gray-800 rounded-2xl" />, ssr: false })
const MilitarySleep = dynamic(() => import('@/features/sleep/MilitarySleep'), { loading: () => <div className="animate-pulse h-64 bg-gray-200 dark:bg-gray-800 rounded-2xl" />, ssr: false })
const SleepCountdown = dynamic(() => import('@/features/sleep/SleepCountdown'), { loading: () => <div className="animate-pulse h-64 bg-gray-200 dark:bg-gray-800 rounded-2xl" />, ssr: false })
const PanicFirstAid = dynamic(() => import('@/features/crisis/PanicFirstAid'), { loading: () => <div className="animate-pulse h-64 bg-gray-200 dark:bg-gray-800 rounded-2xl" />, ssr: false })
const AngerCooldown = dynamic(() => import('@/features/crisis/AngerCooldown'), { loading: () => <div className="animate-pulse h-64 bg-gray-200 dark:bg-gray-800 rounded-2xl" />, ssr: false })

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
  | 'butterfly-hug'
  | 'eye-movement'
  | 'peripheral-vision'
  | 'vagal-humming'
  | 'compassionate-touch'
  | 'shake-it-off'
  | 'orienting-look'
  | 'bellows-breath'
  | 'ocean-breath'
  | 'cold-water-hands'
  | 'name-five-things'
  | 'rooting-exercise'
  | 'gratitude-list'
  | 'thought-defusion'
  | 'mindful-eating'
  | 'jaw-release'
  | 'shoulder-drop'
  | 'hand-massage'
  | 'military-sleep'
  | 'sleep-countdown'
  | 'panic-first-aid'
  | 'anger-cooldown'

type QuickFilterId = 'panic' | 'sleep' | 'work' | 'low-energy'

// Category color config
const categoryColors: Record<string, { bg: string; iconBg: string; iconText: string; border: string; hoverBorder: string; hoverShadow: string; darkBg: string; darkBorder: string; darkHoverBorder: string; darkIconBg: string }> = {
  'Breathing': { bg: 'bg-white/80', iconBg: 'bg-sky-50', iconText: 'text-sky-600', border: 'border-sky-100', hoverBorder: 'hover:border-sky-200', hoverShadow: 'hover:shadow-sky-100/50', darkBg: 'dark:bg-gray-900/80', darkBorder: 'dark:border-sky-900/50', darkHoverBorder: 'dark:hover:border-sky-800', darkIconBg: 'dark:bg-sky-950' },
  'Grounding': { bg: 'bg-white/80', iconBg: 'bg-emerald-50', iconText: 'text-emerald-600', border: 'border-emerald-100', hoverBorder: 'hover:border-emerald-200', hoverShadow: 'hover:shadow-emerald-100/50', darkBg: 'dark:bg-gray-900/80', darkBorder: 'dark:border-emerald-900/50', darkHoverBorder: 'dark:hover:border-emerald-800', darkIconBg: 'dark:bg-emerald-950' },
  'Mindfulness': { bg: 'bg-white/80', iconBg: 'bg-violet-50', iconText: 'text-violet-600', border: 'border-violet-100', hoverBorder: 'hover:border-violet-200', hoverShadow: 'hover:shadow-violet-100/50', darkBg: 'dark:bg-gray-900/80', darkBorder: 'dark:border-violet-900/50', darkHoverBorder: 'dark:hover:border-violet-800', darkIconBg: 'dark:bg-violet-950' },
  'Relaxation': { bg: 'bg-white/80', iconBg: 'bg-teal-50', iconText: 'text-teal-600', border: 'border-teal-100', hoverBorder: 'hover:border-teal-200', hoverShadow: 'hover:shadow-teal-100/50', darkBg: 'dark:bg-gray-900/80', darkBorder: 'dark:border-teal-900/50', darkHoverBorder: 'dark:hover:border-teal-800', darkIconBg: 'dark:bg-teal-950' },
  'Visualization': { bg: 'bg-white/80', iconBg: 'bg-amber-50', iconText: 'text-amber-600', border: 'border-amber-100', hoverBorder: 'hover:border-amber-200', hoverShadow: 'hover:shadow-amber-100/50', darkBg: 'dark:bg-gray-900/80', darkBorder: 'dark:border-amber-900/50', darkHoverBorder: 'dark:hover:border-amber-800', darkIconBg: 'dark:bg-amber-950' },
  'Sound': { bg: 'bg-white/80', iconBg: 'bg-indigo-50', iconText: 'text-indigo-600', border: 'border-indigo-100', hoverBorder: 'hover:border-indigo-200', hoverShadow: 'hover:shadow-indigo-100/50', darkBg: 'dark:bg-gray-900/80', darkBorder: 'dark:border-indigo-900/50', darkHoverBorder: 'dark:hover:border-indigo-800', darkIconBg: 'dark:bg-indigo-950' },
  'Crisis Support': { bg: 'bg-white/80', iconBg: 'bg-rose-50', iconText: 'text-rose-500', border: 'border-rose-100', hoverBorder: 'hover:border-rose-200', hoverShadow: 'hover:shadow-rose-100/50', darkBg: 'dark:bg-gray-900/80', darkBorder: 'dark:border-rose-900/50', darkHoverBorder: 'dark:hover:border-rose-800', darkIconBg: 'dark:bg-rose-950' },
  'Body': { bg: 'bg-white/80', iconBg: 'bg-purple-50', iconText: 'text-purple-600', border: 'border-purple-100', hoverBorder: 'hover:border-purple-200', hoverShadow: 'hover:shadow-purple-100/50', darkBg: 'dark:bg-gray-900/80', darkBorder: 'dark:border-purple-900/50', darkHoverBorder: 'dark:hover:border-purple-800', darkIconBg: 'dark:bg-purple-950' },
  'Sleep': { bg: 'bg-white/80', iconBg: 'bg-indigo-50', iconText: 'text-indigo-600', border: 'border-indigo-100', hoverBorder: 'hover:border-indigo-200', hoverShadow: 'hover:shadow-indigo-100/50', darkBg: 'dark:bg-gray-900/80', darkBorder: 'dark:border-indigo-900/50', darkHoverBorder: 'dark:hover:border-indigo-800', darkIconBg: 'dark:bg-indigo-950' },
  'Quick Access': { bg: 'bg-white/80', iconBg: 'bg-amber-50', iconText: 'text-amber-600', border: 'border-amber-100', hoverBorder: 'hover:border-amber-200', hoverShadow: 'hover:shadow-amber-100/50', darkBg: 'dark:bg-gray-900/80', darkBorder: 'dark:border-amber-900/50', darkHoverBorder: 'dark:hover:border-amber-800', darkIconBg: 'dark:bg-amber-950' },
  'Favorites': { bg: 'bg-white/80', iconBg: 'bg-pink-50', iconText: 'text-pink-500', border: 'border-pink-100', hoverBorder: 'hover:border-pink-200', hoverShadow: 'hover:shadow-pink-100/50', darkBg: 'dark:bg-gray-900/80', darkBorder: 'dark:border-pink-900/50', darkHoverBorder: 'dark:hover:border-pink-800', darkIconBg: 'dark:bg-pink-950' },
}

const defaultColors = categoryColors['Breathing']

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
    title: '3\u2011Breath Reset',
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
    description: 'Three quick tension\u2011and\u2011release regions before rest',
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
    title: 'Self\u2011Compassion Break',
    description: 'Three-step practice to turn kindness toward yourself',
    category: 'Mindfulness',
    duration: '2-4 minutes',
    icon: Heart,
    color: 'calm'
  },
  {
    id: 'land-the-day' as const,
    title: 'Land the Day',
    description: 'Short evening check\u2011in before bed',
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
    title: 'Before\u2011Conversation Prep',
    description: 'Orient to values and control before hard talks',
    category: 'Mindfulness',
    duration: '3-5 minutes',
    icon: Sparkles,
    color: 'calm'
  },
  {
    id: 'conversation-debrief' as const,
    title: 'After\u2011Conversation De\u2011Brief',
    description: 'Gently unwind post\u2011conversation spirals',
    category: 'Mindfulness',
    duration: '3-7 minutes',
    icon: Sparkles,
    color: 'grounding'
  },
  {
    id: 'values-compass' as const,
    title: 'Values Compass',
    description: 'Pick a direction and a tiny values\u2011aligned step',
    category: 'Mindfulness',
    duration: '1-3 minutes',
    icon: Heart,
    color: 'calm'
  },
  {
    id: 'future-you-postcard' as const,
    title: 'Future\u2011You Postcard',
    description: 'A tiny note from a steadier future\u2011you',
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
  },
  // Bilateral & Somatic
  {
    id: 'butterfly-hug' as const,
    title: 'Butterfly Hug',
    description: 'Bilateral tapping for calm and safety',
    category: 'Grounding',
    duration: '1-5 minutes',
    icon: Heart,
    color: 'grounding'
  },
  {
    id: 'eye-movement' as const,
    title: 'Eye Movement',
    description: 'Bilateral eye movement for processing and calm',
    category: 'Grounding',
    duration: '1-5 minutes',
    icon: Eye,
    color: 'grounding'
  },
  {
    id: 'peripheral-vision' as const,
    title: 'Peripheral Vision',
    description: 'Widen your gaze to calm the nervous system',
    category: 'Mindfulness',
    duration: '2-5 minutes',
    icon: Eye,
    color: 'calm'
  },
  {
    id: 'vagal-humming' as const,
    title: 'Vagal Humming',
    description: 'Hum to stimulate your vagus nerve',
    category: 'Breathing',
    duration: '2-5 minutes',
    icon: Music2,
    color: 'calm'
  },
  {
    id: 'compassionate-touch' as const,
    title: 'Self-Compassionate Touch',
    description: 'Gentle self-hold to activate oxytocin',
    category: 'Grounding',
    duration: '3-5 minutes',
    icon: Heart,
    color: 'grounding'
  },
  {
    id: 'shake-it-off' as const,
    title: 'Shake It Off',
    description: 'Release stored tension through guided shaking',
    category: 'Grounding',
    duration: '2-3 minutes',
    icon: Zap,
    color: 'grounding'
  },
  {
    id: 'orienting-look' as const,
    title: 'Slow Orienting Look',
    description: 'Slow head turns to signal safety',
    category: 'Grounding',
    duration: '2-3 minutes',
    icon: Compass,
    color: 'grounding'
  },

  // Breathing (new)
  {
    id: 'bellows-breath' as const,
    title: 'Bellows Breath',
    description: 'Rapid energizing breath for low energy',
    category: 'Breathing',
    duration: '1-2 minutes',
    icon: Zap,
    color: 'grounding'
  },
  {
    id: 'ocean-breath' as const,
    title: 'Ocean Breath (Ujjayi)',
    description: 'Slow breath with ocean wave rhythm',
    category: 'Breathing',
    duration: '2-5 minutes',
    icon: Waves,
    color: 'calm'
  },

  // Grounding (new)
  {
    id: 'cold-water-hands' as const,
    title: 'Cold Water Hands',
    description: 'Cold water on hands for vagal nerve activation',
    category: 'Grounding',
    duration: '30-60 seconds',
    icon: Droplets,
    color: 'calm'
  },
  {
    id: 'name-five-things' as const,
    title: 'Name Five Things',
    description: 'Type what your senses notice to ground yourself',
    category: 'Grounding',
    duration: '3-5 minutes',
    icon: Eye,
    color: 'grounding'
  },
  {
    id: 'rooting-exercise' as const,
    title: 'Rooting Exercise',
    description: 'Feel your feet and imagine roots growing down',
    category: 'Grounding',
    duration: '2 minutes',
    icon: TreePine,
    color: 'grounding'
  },

  // Mindfulness (new)
  {
    id: 'gratitude-list' as const,
    title: 'Gratitude List',
    description: 'Write 3 things you\u2019re grateful for today',
    category: 'Mindfulness',
    duration: '2-3 minutes',
    icon: Sun,
    color: 'calm'
  },
  {
    id: 'thought-defusion' as const,
    title: 'Thought Defusion',
    description: 'ACT technique to create distance from thoughts',
    category: 'Mindfulness',
    duration: '2-5 minutes',
    icon: CloudOff,
    color: 'calm'
  },
  {
    id: 'mindful-eating' as const,
    title: 'Mindful Eating',
    description: 'Experience one bite with complete presence',
    category: 'Mindfulness',
    duration: '3 minutes',
    icon: Apple,
    color: 'calm'
  },

  // Body (new category)
  {
    id: 'jaw-release' as const,
    title: 'Jaw Release',
    description: 'Release stored tension in your jaw',
    category: 'Body',
    duration: '1-2 minutes',
    icon: Smile,
    color: 'grounding'
  },
  {
    id: 'shoulder-drop' as const,
    title: 'Shoulder Drop',
    description: 'Raise, hold, and drop shoulders for relief',
    category: 'Body',
    duration: '2 minutes',
    icon: ArrowDown,
    color: 'grounding'
  },
  {
    id: 'hand-massage' as const,
    title: 'Hand Massage',
    description: 'Guided self-massage for your hands',
    category: 'Body',
    duration: '2 minutes',
    icon: Hand,
    color: 'grounding'
  },

  // Sleep (new category)
  {
    id: 'military-sleep' as const,
    title: 'Military Sleep Method',
    description: 'Fall asleep in 2 minutes with this military technique',
    category: 'Sleep',
    duration: '2 minutes',
    icon: Moon,
    color: 'calm'
  },
  {
    id: 'sleep-countdown' as const,
    title: 'Sleep Countdown',
    description: 'Count backward from 300 by 3s to induce drowsiness',
    category: 'Sleep',
    duration: '5-15 minutes',
    icon: Moon,
    color: 'calm'
  },

  // Crisis (new)
  {
    id: 'panic-first-aid' as const,
    title: 'Panic First Aid',
    description: 'Step-by-step help during a panic attack',
    category: 'Crisis Support',
    duration: '2-5 minutes',
    icon: Heart,
    color: 'grounding'
  },
  {
    id: 'anger-cooldown' as const,
    title: 'Anger Cooldown',
    description: '90-second protocol to ride out the anger wave',
    category: 'Crisis Support',
    duration: '90 seconds',
    icon: Flame,
    color: 'grounding'
  },
] as const

const quickFilterConfig: Record<
  QuickFilterId,
  { label: string; subtitle: string; toolIds: ActiveTool[] }
> = {
  panic: {
    label: 'Panic',
    subtitle: 'Fast-acting tools for high distress',
    toolIds: [
      'emergency-grounding',
      'panic-first-aid',
      'physiological-sigh',
      'box-breathing',
      '5-4-3-2-1',
    ],
  },
  sleep: {
    label: 'Sleep',
    subtitle: 'Downshift your system before bed',
    toolIds: [
      'four-seven-eight',
      'progressive-relaxation',
      'military-sleep',
      'sleep-countdown',
      'noise-ambience',
    ],
  },
  work: {
    label: 'At Work',
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
    subtitle: 'Gentle practices when you\u2019re worn out',
    toolIds: [
      'coherent-breathing',
      'breathing-space',
      'bellows-breath',
      'nature-scenes',
      'body-scan',
    ],
  },
}

// Categories to display (excluding Quick Access and Crisis Support which are shown in hero)
const displayCategories = ['Breathing', 'Grounding', 'Mindfulness', 'Body', 'Relaxation', 'Sleep', 'Visualization', 'Sound'] as const

const categoryIcons: Record<string, typeof Wind> = {
  'Breathing': Wind,
  'Grounding': Hand,
  'Mindfulness': Sparkles,
  'Relaxation': Waves,
  'Visualization': Trees,
  'Sound': Music2,
  'Body': Smile,
  'Sleep': Moon,
  'Favorites': Heart,
}

export default function HomePage() {
  const [activeTool, setActiveTool] = useState<ActiveTool>('home')
  const [mounted, setMounted] = useState(false)
  const { favorites, isFavorite, toggleFavorite } = useFavorites()
  const [activeFilter, setActiveFilter] = useState<QuickFilterId | 'all'>('all')
  const [showRecommendations, setShowRecommendations] = useState(false)

  // Read tool from URL on mount (client-side only)
  useEffect(() => {
    setMounted(true)
    const params = new URLSearchParams(window.location.search)
    const tool = params.get("tool")
    if (tool && tool !== "home") {
      setActiveTool(tool as ActiveTool)
      window.history.replaceState({ tool }, "", `?tool=${tool}`)
    }

    const handlePopState = (e: PopStateEvent) => {
      const state = e.state as { tool?: string } | null
      setActiveTool((state?.tool as ActiveTool) || "home")
    }
    window.addEventListener("popstate", handlePopState)
    return () => window.removeEventListener("popstate", handlePopState)
  }, [])

  const navigateToTool = (tool: ActiveTool) => {
    setActiveTool(tool)
    if (tool === 'home') {
      window.history.pushState({ tool: 'home' }, '', '/')
    } else {
      window.history.pushState({ tool }, '', `?tool=${tool}`)
    }
  }

  const favoriteTools = tools.filter(
    (tool) => tool && favorites.includes(tool.id),
  )

  // Show loading skeleton while checking URL for deep link
  if (!mounted) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-green-50 to-white dark:from-gray-900 dark:to-gray-950">
        <div className="max-w-4xl mx-auto px-4 py-12">
          <div className="animate-pulse space-y-4">
            <div className="h-8 bg-gray-200 dark:bg-gray-800 rounded w-48 mx-auto" />
            <div className="h-4 bg-gray-200 dark:bg-gray-800 rounded w-64 mx-auto" />
            <div className="h-64 bg-gray-200 dark:bg-gray-800 rounded-2xl mt-8" />
          </div>
        </div>
      </div>
    )
  }

  // Tool rendering
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
case 'butterfly-hug': return <ButterflyHug />
      case 'eye-movement': return <EyeMovement />
      case 'peripheral-vision': return <PeripheralVision />
      case 'vagal-humming': return <VagalHumming />
      case 'compassionate-touch': return <CompassionateTouch />
      case 'shake-it-off': return <ShakeItOff />
      case 'orienting-look': return <OrientingLook />
      case 'bellows-breath': return <BellowsBreath />
      case 'ocean-breath': return <OceanBreath />
      case 'cold-water-hands': return <ColdWaterHands />
      case 'name-five-things': return <NameFiveThings />
      case 'rooting-exercise': return <RootingExercise />
      case 'gratitude-list': return <GratitudeList />
      case 'thought-defusion': return <ThoughtDefusion />
      case 'mindful-eating': return <MindfulEating />
      case 'jaw-release': return <JawRelease />
      case 'shoulder-drop': return <ShoulderDrop />
      case 'hand-massage': return <HandMassage />
      case 'military-sleep': return <MilitarySleep />
      case 'sleep-countdown': return <SleepCountdown />
      case 'panic-first-aid': return <PanicFirstAid />
      case 'anger-cooldown': return <AngerCooldown />
      default: return null
    }
  }

  // Get filtered tools for a category
  const getFilteredTools = (categoryTools: typeof tools[number][]) => {
    if (activeFilter === 'all') return categoryTools
    const filterToolIds = quickFilterConfig[activeFilter as QuickFilterId].toolIds
    return categoryTools.filter(t => filterToolIds.includes(t.id))
  }

  // Active tool view
  if (activeTool !== 'home') {
    return (
      <div className="max-w-4xl mx-auto">
        <button
          onClick={() => navigateToTool('home')}
          className="mb-6 flex items-center gap-2 text-sm text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 transition-colors"
        >
          <ArrowLeft size={16} />
          Back to tools
        </button>
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          {renderTool()}
        </motion.div>
      </div>
    )
  }

  return (
    <div className="max-w-6xl mx-auto">
      {/* Sticky Header */}
      <header className="sticky top-0 z-50 -mx-4 px-4 mb-8">
        <div className="backdrop-blur-xl bg-white/70 dark:bg-gray-900/70 border border-gray-100 dark:border-gray-800 rounded-2xl shadow-sm px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Heart className="w-5 h-5 text-sky-500" />
            <span className="font-semibold text-gray-800 dark:text-gray-200">CalmMyself</span>
          </div>
          <div className="flex items-center gap-1">
            <a href="/about" className="text-sm text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 transition-colors">About</a>
            <DarkModeToggle />
            <AnimationToggle />
          </div>
        </div>
      </header>

      {/* Hero */}
      <motion.div
        className="text-center mb-10 sm:mb-12 px-4"
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: 'easeOut' }}
      >
        <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-gray-800 dark:text-gray-100 mb-3 tracking-tight">
          Take a breath.
        </h1>
        <p className="text-lg sm:text-xl text-gray-500 dark:text-gray-400 font-light">
          You&rsquo;re in the right place.
        </p>
      </motion.div>

      {/* Quick Start Cards */}
      <div className="grid grid-cols-3 gap-3 sm:gap-4 mb-8 px-1">
        <motion.button
          onClick={() => navigateToTool('emergency-grounding')}
          className="group relative p-4 sm:p-6 rounded-2xl bg-gradient-to-br from-rose-50 to-amber-50 dark:from-rose-950/50 dark:to-amber-950/50 border border-rose-100 dark:border-rose-900/50 hover:border-rose-200 dark:hover:border-rose-800 hover:shadow-lg hover:shadow-rose-100/50 transition-all duration-300 text-center"
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.1 }}
          whileHover={{ y: -2 }}
          whileTap={{ scale: 0.98 }}
        >
          <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl bg-rose-100 dark:bg-rose-900/50 flex items-center justify-center mx-auto mb-2 sm:mb-3 group-hover:bg-rose-200 dark:group-hover:bg-rose-900/70 transition-colors">
            <Heart size={20} className="text-rose-500 sm:w-6 sm:h-6" />
          </div>
          <p className="font-medium text-gray-800 dark:text-gray-200 text-xs sm:text-sm">I need help now</p>
        </motion.button>

        <motion.button
          onClick={() => navigateToTool('physiological-sigh')}
          className="group relative p-4 sm:p-6 rounded-2xl bg-gradient-to-br from-sky-50 to-cyan-50 dark:from-sky-950/50 dark:to-cyan-950/50 border border-sky-100 dark:border-sky-900/50 hover:border-sky-200 dark:hover:border-sky-800 hover:shadow-lg hover:shadow-sky-100/50 transition-all duration-300 text-center"
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.15 }}
          whileHover={{ y: -2 }}
          whileTap={{ scale: 0.98 }}
        >
          <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl bg-sky-100 dark:bg-sky-900/50 flex items-center justify-center mx-auto mb-2 sm:mb-3 group-hover:bg-sky-200 dark:group-hover:bg-sky-900/70 transition-colors">
            <Wind size={20} className="text-sky-600 sm:w-6 sm:h-6" />
          </div>
          <p className="font-medium text-gray-800 dark:text-gray-200 text-xs sm:text-sm">Just breathe</p>
        </motion.button>

        <motion.button
          onClick={() => navigateToTool('quick-access')}
          className="group relative p-4 sm:p-6 rounded-2xl bg-gradient-to-br from-violet-50 to-purple-50 dark:from-violet-950/50 dark:to-purple-950/50 border border-violet-100 dark:border-violet-900/50 hover:border-violet-200 dark:hover:border-violet-800 hover:shadow-lg hover:shadow-violet-100/50 transition-all duration-300 text-center"
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.2 }}
          whileHover={{ y: -2 }}
          whileTap={{ scale: 0.98 }}
        >
          <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl bg-violet-100 dark:bg-violet-900/50 flex items-center justify-center mx-auto mb-2 sm:mb-3 group-hover:bg-violet-200 dark:group-hover:bg-violet-900/70 transition-colors">
            <Zap size={20} className="text-violet-600 sm:w-6 sm:h-6" />
          </div>
          <p className="font-medium text-gray-800 dark:text-gray-200 text-xs sm:text-sm">Quick mode</p>
        </motion.button>
      </div>

      {/* Crisis support - gentle, not alarming */}
      <div className="rounded-2xl bg-gradient-to-r from-rose-50/80 to-amber-50/80 dark:from-rose-950/50 dark:to-amber-950/50 border border-rose-100/60 dark:border-rose-900/50 p-4 mb-8">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-full bg-rose-100 dark:bg-rose-900/50 flex items-center justify-center flex-shrink-0">
            <Heart size={14} className="text-rose-400" />
          </div>
          <p className="text-sm text-gray-600 dark:text-gray-400 flex-1">
            Need immediate support? Call <strong className="text-gray-700 dark:text-gray-300">988</strong> or text <strong className="text-gray-700 dark:text-gray-300">HELLO</strong> to 741741
          </p>
        </div>
      </div>

      {/* Quick Filters */}
      <div className="mb-8">
        <p className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">What do you need?</p>
        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => setActiveFilter('all')}
            className={`px-4 py-2 rounded-xl text-sm font-medium transition-all duration-200 ${
              activeFilter === 'all'
                ? 'bg-gray-900 text-white shadow-sm dark:bg-gray-100 dark:text-gray-900'
                : 'bg-white/80 text-gray-600 border border-gray-200 hover:border-gray-300 hover:bg-white dark:bg-gray-800/80 dark:text-gray-400 dark:border-gray-700 dark:hover:border-gray-600 dark:hover:bg-gray-800'
            }`}
          >
            All
          </button>
          {(Object.keys(quickFilterConfig) as QuickFilterId[]).map((filterId) => (
            <button
              key={filterId}
              onClick={() => setActiveFilter(activeFilter === filterId ? 'all' : filterId)}
              className={`px-4 py-2 rounded-xl text-sm font-medium transition-all duration-200 ${
                activeFilter === filterId
                  ? 'bg-gray-900 text-white shadow-sm dark:bg-gray-100 dark:text-gray-900'
                  : 'bg-white/80 text-gray-600 border border-gray-200 hover:border-gray-300 hover:bg-white dark:bg-gray-800/80 dark:text-gray-400 dark:border-gray-700 dark:hover:border-gray-600 dark:hover:bg-gray-800'
              }`}
            >
              {quickFilterConfig[filterId].label}
            </button>
          ))}
        </div>
        {activeFilter !== 'all' && (
          <p className="text-xs text-gray-400 dark:text-gray-500 mt-2">{quickFilterConfig[activeFilter as QuickFilterId].subtitle}</p>
        )}
      </div>

      {/* Favorites Section */}
      {favoriteTools.length > 0 && activeFilter === 'all' && (
        <div className="mb-8">
          <h2 className="text-base font-semibold text-gray-800 dark:text-gray-200 mb-3 flex items-center gap-2">
            <Heart className="w-4 h-4 text-pink-500" />
            Favorites
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3">
            {favoriteTools.map((tool) => {
              const Icon = tool.icon
              const colors = categoryColors[tool.category] || defaultColors
              return (
                <div
                  key={`fav-${tool.id}`}
                  onClick={() => navigateToTool(tool.id)}
                  className={`group relative p-4 rounded-2xl ${colors.bg} ${colors.darkBg} backdrop-blur-sm border ${colors.border} ${colors.darkBorder} ${colors.hoverBorder} ${colors.darkHoverBorder} hover:shadow-lg ${colors.hoverShadow} transition-all duration-300 cursor-pointer`}
                >
                  <div className="flex items-start gap-3">
                    <div className={`w-10 h-10 rounded-xl ${colors.iconBg} ${colors.darkIconBg} flex items-center justify-center group-hover:scale-105 transition-transform`}>
                      <Icon size={18} className={colors.iconText} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="font-medium text-gray-900 dark:text-gray-100 text-sm">{tool.title}</h3>
                      <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5 line-clamp-1">{tool.description}</p>
                      <span className="inline-block mt-1.5 text-[10px] px-2 py-0.5 rounded-full bg-gray-100/80 dark:bg-gray-800 text-gray-400 dark:text-gray-500">
                        {tool.duration}
                      </span>
                    </div>
                    <button
                      onClick={(e) => { e.stopPropagation(); toggleFavorite(tool.id); }}
                      className="flex-shrink-0 p-1"
                      aria-label="Remove from favorites"
                    >
                      <Heart size={14} className="fill-pink-200 text-pink-500" />
                    </button>
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      )}

      {/* Tool Categories */}
      <div className="space-y-8">
        {displayCategories.map((categoryName) => {
          const categoryTools = tools.filter(t => t.category === categoryName)
          const filteredTools = getFilteredTools(categoryTools)
          if (filteredTools.length === 0) return null
          const colors = categoryColors[categoryName] || defaultColors
          const CatIcon = categoryIcons[categoryName] || Wind

          return (
            <motion.section
              key={categoryName}
              initial={{ opacity: 1 }}
              animate={{ opacity: 1 }}
            >
              <h2 className="text-base font-semibold text-gray-800 dark:text-gray-200 mb-3 flex items-center gap-2">
                <CatIcon className={`w-4 h-4 ${colors.iconText}`} />
                {categoryName}
                <span className="text-xs text-gray-400 dark:text-gray-500 font-normal">({filteredTools.length})</span>
              </h2>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3">
                {filteredTools.map((tool) => {
                  const Icon = tool.icon
                  const isHighlighted = activeFilter !== 'all' && quickFilterConfig[activeFilter as QuickFilterId].toolIds.includes(tool.id)
                  return (
                    <motion.div
                      key={tool.id}
                      initial={{ opacity: 1, y: 0 }}
                      animate={{ opacity: 1, y: 0 }}
                      whileHover={{ y: -2 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      <div
                        onClick={() => navigateToTool(tool.id)}
                        className={`group relative p-4 rounded-2xl ${colors.bg} ${colors.darkBg} backdrop-blur-sm border ${
                          isHighlighted ? 'border-purple-200 ring-1 ring-purple-100 dark:border-purple-800 dark:ring-purple-900' : `${colors.border} ${colors.darkBorder}`
                        } ${colors.hoverBorder} ${colors.darkHoverBorder} hover:shadow-lg ${colors.hoverShadow} transition-all duration-300 cursor-pointer`}
                      >
                        <div className="flex items-start gap-3">
                          <div className={`w-10 h-10 rounded-xl ${colors.iconBg} ${colors.darkIconBg} flex items-center justify-center group-hover:scale-105 transition-transform flex-shrink-0`}>
                            <Icon size={18} className={colors.iconText} />
                          </div>
                          <div className="flex-1 min-w-0">
                            <h3 className="font-medium text-gray-900 dark:text-gray-100 text-sm">{tool.title}</h3>
                            <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5 line-clamp-1">{tool.description}</p>
                            <div className="flex items-center gap-2 mt-1.5">
                              <span className="text-[10px] px-2 py-0.5 rounded-full bg-gray-100/80 dark:bg-gray-800 text-gray-400 dark:text-gray-500">
                                {tool.duration}
                              </span>
                              {isHighlighted && (
                                <span className="text-[10px] px-2 py-0.5 rounded-full bg-purple-100 dark:bg-purple-900/50 text-purple-600 dark:text-purple-300 font-medium">
                                  Recommended
                                </span>
                              )}
                            </div>
                          </div>
                          <button
                            onClick={(e) => { e.stopPropagation(); toggleFavorite(tool.id); }}
                            className="flex-shrink-0 p-1 touch-manipulation"
                            aria-label={isFavorite(tool.id) ? 'Remove from favorites' : 'Add to favorites'}
                          >
                            <Heart
                              size={14}
                              className={`transition-colors ${
                                isFavorite(tool.id) ? 'fill-pink-200 text-pink-500' : 'text-gray-200 hover:text-pink-300 dark:text-gray-700 dark:hover:text-pink-400'
                              }`}
                            />
                          </button>
                        </div>
                      </div>
                    </motion.div>
                  )
                })}
              </div>
            </motion.section>
          )
        })}
      </div>

      {/* Recommendations - collapsible */}
      <div className="mt-10">
        <button
          onClick={() => setShowRecommendations(!showRecommendations)}
          className="flex items-center gap-2 text-sm text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 transition-colors mb-4"
        >
          <Sparkles size={14} />
          <span>{showRecommendations ? 'Hide' : 'Show'} personalized recommendations</span>
          <motion.span animate={{ rotate: showRecommendations ? 180 : 0 }} transition={{ duration: 0.2 }}>
            ▾
          </motion.span>
        </button>
        {showRecommendations && (
          <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} transition={{ duration: 0.3 }}>
            <RecommendationsPanel
              tools={tools.filter((tool): tool is NonNullable<typeof tool> => tool != null).map(tool => ({
                id: tool.id,
                title: tool.title,
                description: tool.description,
                duration: tool.duration,
                category: tool.category
              }))}
              onSelectTool={({ toolId }) => navigateToTool(toolId as ActiveTool)}
            />
          </motion.div>
        )}
      </div>

      {/* Footer */}
      <footer className="mt-16 border-t border-gray-100 dark:border-gray-800 pt-8 pb-12">
        <div className="flex flex-col items-center gap-6">
          <ShareBar />
          <div className="text-center text-xs text-gray-400 dark:text-gray-500 space-y-1">
            <p>Evidence-based techniques for general wellness. Not a replacement for professional care.</p>
            <div className="flex items-center gap-3 mb-2"><a href="/about" className="text-xs text-gray-400 dark:text-gray-500 hover:text-gray-600 dark:hover:text-gray-300 transition-colors">About</a><span className="text-gray-300 dark:text-gray-600">·</span><a href="/privacy" className="text-xs text-gray-400 dark:text-gray-500 hover:text-gray-600 dark:hover:text-gray-300 transition-colors">Privacy</a></div>
            <p>No data collection &middot; Offline ready &middot; Free forever</p>
          </div>
        </div>
      </footer>
    </div>
  )
}
