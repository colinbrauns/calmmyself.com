'use client'

import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { Button } from '@/components/ui/Button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/Card'
import ShapeBreather from '@/components/ShapeBreather'
import {
  Mountain,
  PauseCircle,
  PlayCircle,
  RefreshCw,
  Sparkles,
  Sun,
  Trees,
  Volume2,
  VolumeX,
  Waves,
  MicOff,
} from 'lucide-react'

interface ScenePalette {
  badgeBg: string
  badgeText: string
  accent: string
  text: string
  gradientFrom: string
  gradientTo: string
  surface: string
  glowFrom: string
  glowTo: string
}

interface SceneBackgroundConfig {
  gradient: string
  overlay: string
  particle: string
}

interface NatureScene {
  id: string
  name: string
  icon: React.ElementType
  color: string
  description: string
  visualization: string[]
  sounds: string[]
  sensations: string[]
  palette: ScenePalette
  background: SceneBackgroundConfig
  ambient: {
    url: string
    credit: string
  }
  breathing: {
    durationMs: number
  }
}

const NATURE_SCENES: NatureScene[] = [
  {
    id: 'forest',
    name: 'Peaceful Forest',
    icon: Trees,
    color: 'calm',
    description: 'A quiet woodland path dappled with sunlight',
    visualization: [
      "You're walking on a soft forest path covered with fallen leaves.",
      "Tall trees stretch up around you, their branches forming a natural canopy.",
      "Gentle rays of sunlight filter through the leaves, creating dancing patterns of light and shadow.",
      "The air is fresh and clean, filled with the scent of earth and growing things.",
      "You can hear birds singing softly in the distance and leaves rustling in a gentle breeze.",
    ],
    sounds: [
      'Gentle rustling of leaves',
      'Distant bird songs',
      'Your footsteps on the soft earth',
      'A gentle breeze through the trees',
      'Perhaps the distant sound of a stream',
    ],
    sensations: [
      'Cool, fresh air filling your lungs',
      'Soft earth beneath your feet',
      'Dappled sunlight warming your skin',
      'A gentle breeze on your face',
      'The peaceful feeling of being embraced by nature',
    ],
    palette: {
      badgeBg: 'bg-emerald-100/80',
      badgeText: 'text-emerald-900',
      accent: 'bg-emerald-500',
      text: 'text-emerald-900',
      gradientFrom: 'from-emerald-300/70',
      gradientTo: 'to-emerald-600/80',
      surface: 'bg-white/65',
      glowFrom: 'from-emerald-300',
      glowTo: 'to-emerald-600',
    },
    background: {
      gradient:
        'radial-gradient(at 20% 20%, rgba(74,222,128,0.45) 0%, transparent 55%), radial-gradient(at 80% 15%, rgba(34,197,94,0.4) 0%, transparent 45%), radial-gradient(at 30% 80%, rgba(6,95,70,0.55) 0%, transparent 52%)',
      overlay: 'bg-emerald-950/45',
      particle: 'rgba(52,211,153,0.28)',
    },
    ambient: {
      url: 'https://cdn.pixabay.com/download/audio/2022/03/15/audio_1a1b0ada55.mp3?filename=forest-birdsong-ambient-110624.mp3',
      credit: 'Forest birdsong by Pixabay (CC0)',
    },
    breathing: {
      durationMs: 7000,
    },
  },
  {
    id: 'ocean',
    name: 'Ocean Shore',
    icon: Waves,
    color: 'calm',
    description: 'A serene beach with gentle waves and warm sand',
    visualization: [
      "You're sitting on warm, soft sand at the edge of a beautiful ocean.",
      'The water is a stunning blue-green color, clear and inviting.',
      'Gentle waves roll in rhythmically, creating white foam as they meet the shore.',
      'The horizon stretches endlessly where the ocean meets the sky.',
      'Seagulls glide gracefully overhead against a backdrop of puffy white clouds.',
    ],
    sounds: [
      'Rhythmic sound of waves washing ashore',
      'Gentle hiss as water retreats over sand',
      'Seagulls calling in the distance',
      'Gentle breeze rustling through beach grass',
      'The vast, peaceful sound of the ocean',
    ],
    sensations: [
      'Warm sand beneath you',
      'Gentle ocean breeze on your skin',
      'Warm sun on your face',
      'Salt air filling your lungs',
      'Cool water touching your feet',
    ],
    palette: {
      badgeBg: 'bg-sky-100/75',
      badgeText: 'text-sky-900',
      accent: 'bg-sky-500',
      text: 'text-sky-900',
      gradientFrom: 'from-sky-300/70',
      gradientTo: 'to-cyan-500/80',
      surface: 'bg-white/60',
      glowFrom: 'from-sky-300',
      glowTo: 'to-cyan-500',
    },
    background: {
      gradient:
        'radial-gradient(at 15% 25%, rgba(125,211,252,0.45) 0%, transparent 55%), radial-gradient(at 80% 30%, rgba(56,189,248,0.45) 0%, transparent 45%), radial-gradient(at 35% 85%, rgba(14,165,233,0.4) 0%, transparent 52%)',
      overlay: 'bg-cyan-950/35',
      particle: 'rgba(56,189,248,0.35)',
    },
    ambient: {
      url: 'https://cdn.pixabay.com/download/audio/2021/08/09/audio_586d05f7f0.mp3?filename=waves-ambient-5746.mp3',
      credit: 'Ocean waves by Pixabay (CC0)',
    },
    breathing: {
      durationMs: 8000,
    },
  },
  {
    id: 'mountain',
    name: 'Mountain Peak',
    icon: Mountain,
    color: 'calm',
    description: 'A peaceful mountain summit with vast views',
    visualization: [
      "You're sitting on a comfortable rocky outcrop at the top of a beautiful mountain.",
      'Rolling hills and valleys stretch out below you in all directions.',
      'The air is crisp and clear, with unlimited visibility.',
      'Other mountain peaks rise in the distance, creating layers of blue and purple silhouettes.',
      'Above you, the sky is a brilliant blue with white clouds drifting slowly by.',
    ],
    sounds: [
      'Gentle wind through the mountain air',
      'Distant echo from the valleys below',
      'Perhaps the call of a hawk circling overhead',
      'Your own peaceful breathing',
      'The profound silence of high places',
    ],
    sensations: [
      'Cool, crisp mountain air',
      'Warm sun on your back',
      'Solid rock supporting you',
      'Gentle breeze in your hair',
      'A sense of elevation and expansiveness',
    ],
    palette: {
      badgeBg: 'bg-indigo-100/75',
      badgeText: 'text-indigo-900',
      accent: 'bg-indigo-500',
      text: 'text-indigo-900',
      gradientFrom: 'from-indigo-300/70',
      gradientTo: 'to-purple-500/75',
      surface: 'bg-white/58',
      glowFrom: 'from-indigo-300',
      glowTo: 'to-purple-500',
    },
    background: {
      gradient:
        'radial-gradient(at 20% 20%, rgba(129,140,248,0.4) 0%, transparent 55%), radial-gradient(at 80% 15%, rgba(99,102,241,0.45) 0%, transparent 45%), radial-gradient(at 30% 80%, rgba(168,85,247,0.4) 0%, transparent 52%)',
      overlay: 'bg-indigo-950/35',
      particle: 'rgba(129,140,248,0.3)',
    },
    ambient: {
      url: 'https://cdn.pixabay.com/download/audio/2021/09/29/audio_52a6f2f2d3.mp3?filename=wind-ambience-5980.mp3',
      credit: 'Mountain wind by Pixabay (CC0)',
    },
    breathing: {
      durationMs: 9000,
    },
  },
  {
    id: 'meadow',
    name: 'Sunny Meadow',
    icon: Sun,
    color: 'calm',
    description: 'A flower-filled meadow on a perfect day',
    visualization: [
      "You're lying in a beautiful meadow filled with wildflowers.",
      'Colorful blooms surround you - yellows, purples, whites, and pinks.',
      'The grass is soft and green, swaying gently in a warm breeze.',
      'Above you, the sky is a perfect blue with fluffy white clouds.',
      'Butterflies dance from flower to flower, and bees hum contentedly nearby.',
    ],
    sounds: [
      'Gentle buzzing of bees among flowers',
      'Grass and flowers swaying in the breeze',
      'Birds singing happily nearby',
      'The whisper of wind through the meadow',
      'Your own peaceful breathing',
    ],
    sensations: [
      'Soft grass beneath you',
      'Warm sunshine on your skin',
      'Gentle breeze carrying flower scents',
      'The tickle of grass around you',
      'Complete relaxation and peace',
    ],
    palette: {
      badgeBg: 'bg-amber-100/80',
      badgeText: 'text-amber-900',
      accent: 'bg-amber-500',
      text: 'text-amber-900',
      gradientFrom: 'from-amber-200/75',
      gradientTo: 'to-orange-400/80',
      surface: 'bg-white/62',
      glowFrom: 'from-amber-200',
      glowTo: 'to-orange-400',
    },
    background: {
      gradient:
        'radial-gradient(at 18% 22%, rgba(251,191,36,0.4) 0%, transparent 55%), radial-gradient(at 78% 18%, rgba(249,115,22,0.35) 0%, transparent 45%), radial-gradient(at 25% 82%, rgba(250,204,21,0.45) 0%, transparent 52%)',
      overlay: 'bg-amber-950/30',
      particle: 'rgba(250,204,21,0.32)',
    },
    ambient: {
      url: 'https://cdn.pixabay.com/download/audio/2022/07/23/audio_5a6ad4fbb0.mp3?filename=summer-meadow-115353.mp3',
      credit: 'Summer meadow by Pixabay (CC0)',
    },
    breathing: {
      durationMs: 7500,
    },
  },
]

const DEFAULT_BACKGROUND =
  'radial-gradient(at 18% 22%, rgba(14,165,233,0.2) 0%, transparent 55%), radial-gradient(at 70% 18%, rgba(59,130,246,0.15) 0%, transparent 50%)'

const STEP_LABELS = ['Visualize', 'Listen', 'Feel']

const SCENE_SHAPES: Record<NatureScene['id'], 'flower' | 'circle' | 'triangle' | 'square'> = {
  forest: 'flower',
  ocean: 'circle',
  mountain: 'triangle',
  meadow: 'flower',
}

function SceneBackground({
  scene,
  breathingScale,
}: {
  scene: NatureScene
  breathingScale: number
}) {
  const particles = useMemo(
    () =>
      Array.from({ length: 10 }).map((_, index) => ({
        id: `${scene.id}-particle-${index}`,
        size: 160 + Math.random() * 180,
        duration: 16 + Math.random() * 12,
        delay: Math.random() * 6,
        x: Math.random() * 100,
        y: Math.random() * 100,
      })),
    [scene.id]
  )

  return (
    <div className="absolute inset-0 -z-10 overflow-hidden rounded-3xl">
      <motion.div
        className="absolute inset-0"
        style={{
          backgroundImage: scene.background.gradient,
        }}
        animate={{ scale: breathingScale }}
        transition={{ duration: scene.breathing.durationMs / 1000, ease: 'easeInOut' }}
      />
      {particles.map((particle) => (
        <motion.span
          key={particle.id}
          className="absolute rounded-full blur-3xl"
          style={{
            width: particle.size,
            height: particle.size,
            top: `${particle.y}%`,
            left: `${particle.x}%`,
            backgroundColor: scene.background.particle,
          }}
          animate={{ y: ['0%', '-8%', '0%'], opacity: [0.12, 0.35, 0.1] }}
          transition={{
            duration: particle.duration,
            repeat: Infinity,
            ease: 'easeInOut',
            delay: particle.delay,
          }}
        />
      ))}
      <motion.div
        className={`absolute inset-0 mix-blend-screen`}
        animate={{ opacity: breathingScale > 1 ? 0.55 : 0.35 }}
        transition={{ duration: scene.breathing.durationMs / 1000 }}
        style={{ backgroundImage: `linear-gradient(135deg, rgba(255,255,255,0.12), rgba(255,255,255,0.02))` }}
      />
      <div className={`absolute inset-0 ${scene.background.overlay}`} />
    </div>
  )
}

export default function NatureScenes() {
  const [selectedScene, setSelectedScene] = useState<NatureScene | null>(null)
  const [currentStep, setCurrentStep] = useState(0)
  const [currentLineIndex, setCurrentLineIndex] = useState(0)
  const [breathPhase, setBreathPhase] = useState<'expand' | 'release'>('expand')
  const [isAudioEnabled, setIsAudioEnabled] = useState(false)
  const [volume, setVolume] = useState(0.55)
  const [autoJourney, setAutoJourney] = useState(false)
  const audioRef = useRef<HTMLAudioElement | null>(null)
  const journeyTimerRef = useRef<NodeJS.Timeout | null>(null)
  const speechSupported = typeof window !== 'undefined' && 'speechSynthesis' in window

  const currentContent = useMemo(() => {
    if (!selectedScene) return []
    if (currentStep === 0) return selectedScene.visualization
    if (currentStep === 1) return selectedScene.sounds
    return selectedScene.sensations
  }, [selectedScene, currentStep])

  const totalLines = selectedScene
    ? selectedScene.visualization.length + selectedScene.sounds.length + selectedScene.sensations.length
    : 0

  const currentLineNumber = useMemo(() => {
    if (!selectedScene) return 0
    const priorVisualization = currentStep >= 1 ? selectedScene.visualization.length : 0
    const priorSounds = currentStep >= 2 ? selectedScene.sounds.length : 0
    return priorVisualization + priorSounds + currentLineIndex + 1
  }, [currentLineIndex, currentStep, selectedScene])

  const isComplete =
    !!selectedScene &&
    currentStep === 2 &&
    currentLineIndex === selectedScene.sensations.length - 1

  useEffect(() => {
    if (!selectedScene) {
      setBreathPhase('expand')
      return
    }
    setBreathPhase('expand')
    const interval = setInterval(
      () => setBreathPhase((phase) => (phase === 'expand' ? 'release' : 'expand')),
      selectedScene.breathing.durationMs
    )
    return () => clearInterval(interval)
  }, [selectedScene])

  const breathingScale = breathPhase === 'expand' ? 1.12 : 0.92

  useEffect(() => {
    if (!selectedScene) {
      audioRef.current?.pause()
      audioRef.current = null
      setIsAudioEnabled(false)
      return
    }
    const audio = new Audio(selectedScene.ambient.url)
    audio.loop = true
    audioRef.current = audio
    return () => {
      audio.pause()
    }
  }, [selectedScene])

  useEffect(() => {
    const audio = audioRef.current
    if (!audio) return
    audio.volume = volume
  }, [volume])

  useEffect(() => {
    const audio = audioRef.current
    if (!audio) return
    if (isAudioEnabled) {
      audio.volume = volume
      audio
        .play()
        .catch(() => {
          setIsAudioEnabled(false)
        })
    } else {
      audio.pause()
    }
  }, [isAudioEnabled, volume])

  const handleAdvance = useCallback(() => {
    if (!selectedScene) return
    if (currentLineIndex < currentContent.length - 1) {
      setCurrentLineIndex((index) => index + 1)
    } else if (currentStep < 2) {
      setCurrentStep((step) => step + 1)
      setCurrentLineIndex(0)
    }
  }, [currentContent.length, currentLineIndex, currentStep, selectedScene])

  useEffect(() => {
    return () => {
      if (journeyTimerRef.current) {
        clearTimeout(journeyTimerRef.current)
      }
      if (speechSupported) {
        window.speechSynthesis.cancel()
      }
    }
  }, [speechSupported])

  useEffect(() => {
    if (!selectedScene || !autoJourney) {
      if (journeyTimerRef.current) {
        clearTimeout(journeyTimerRef.current)
        journeyTimerRef.current = null
      }
      if (speechSupported) {
        window.speechSynthesis.cancel()
      }
      return
    }

    if (isComplete) {
      setAutoJourney(false)
      return
    }

    const activeLine = currentContent[currentLineIndex]
    if (!activeLine) return

    if (speechSupported) {
      window.speechSynthesis.cancel()
      const utterance = new SpeechSynthesisUtterance(activeLine)
      utterance.rate = 0.92
      utterance.pitch = 1
      utterance.volume = 0.95
      window.speechSynthesis.speak(utterance)
    }

    const words = activeLine.split(/\s+/).length
    const estimatedDuration = Math.max(words * 600, 5200)

    journeyTimerRef.current = setTimeout(() => {
      handleAdvance()
    }, estimatedDuration)

    return () => {
      if (journeyTimerRef.current) {
        clearTimeout(journeyTimerRef.current)
        journeyTimerRef.current = null
      }
    }
  }, [
    autoJourney,
    currentContent,
    currentLineIndex,
    handleAdvance,
    isComplete,
    selectedScene,
    speechSupported,
  ])

  const resetScene = useCallback(() => {
    setSelectedScene(null)
    setCurrentStep(0)
    setCurrentLineIndex(0)
    setAutoJourney(false)
    setIsAudioEnabled(false)
    if (speechSupported) {
      window.speechSynthesis.cancel()
    }
  }, [speechSupported])

  const handlePrev = useCallback(() => {
    if (currentLineIndex > 0) {
      setCurrentLineIndex((index) => index - 1)
      return
    }
    if (currentStep > 0 && selectedScene) {
      const prevStep = currentStep - 1
      setCurrentStep(prevStep)
      const prevContent =
        prevStep === 1
          ? selectedScene.sounds
          : prevStep === 0
          ? selectedScene.visualization
          : selectedScene.sensations
      setCurrentLineIndex(prevContent.length - 1)
    }
  }, [currentLineIndex, currentStep, selectedScene])

  const toggleAudio = useCallback(() => {
    setIsAudioEnabled((enabled) => !enabled)
  }, [])

  const toggleAutoJourney = useCallback(() => {
    setAutoJourney((enabled) => !enabled)
  }, [])

  if (!selectedScene) {
    return (
      <div className="relative mx-auto max-w-4xl">
        <div
          className="absolute inset-0 -z-10 rounded-3xl opacity-80 blur-3xl"
          style={{ backgroundImage: DEFAULT_BACKGROUND }}
        />
        <Card className="mx-auto max-w-xl bg-white/80 backdrop-blur-xl">
          <CardHeader className="text-center">
            <CardTitle>Calming Nature Scenes</CardTitle>
            <CardDescription>
              Choose a natural setting for guided visualization
            </CardDescription>
          </CardHeader>

          <CardContent className="space-y-4">
            {NATURE_SCENES.map((scene) => {
              const Icon = scene.icon
              return (
                <Card
                  key={scene.id}
                  className="cursor-pointer border-2 border-white/60 bg-white/70 transition duration-200 hover:-translate-y-1 hover:border-white hover:shadow-lg"
                  onClick={() => setSelectedScene(scene)}
                >
                  <CardContent className="flex items-start gap-4 p-4">
                    <motion.div
                      className={`flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-xl bg-white/70 text-calm-700 shadow-inner`}
                      animate={{ y: [0, -3, 0] }}
                      transition={{ duration: 4.5, repeat: Infinity, ease: 'easeInOut' }}
                    >
                      <Icon size={26} />
                    </motion.div>
                    <div>
                      <h3 className="text-lg font-semibold text-calm-900">{scene.name}</h3>
                      <p className="text-sm text-gray-600">{scene.description}</p>
                    </div>
                  </CardContent>
                </Card>
              )
            })}
          </CardContent>
        </Card>
      </div>
    )
  }

  const palette = selectedScene.palette
  const Icon = selectedScene.icon

  return (
    <div className="relative mx-auto max-w-3xl">
      <SceneBackground scene={selectedScene} breathingScale={breathingScale} />
      <div className="relative z-10 overflow-hidden rounded-3xl border border-white/25 bg-white/55 p-6 shadow-2xl backdrop-blur-xl sm:p-8">
        <header className="text-center">
          <div className="relative mx-auto mb-6 flex h-36 w-36 items-center justify-center sm:h-44 sm:w-44">
            <ShapeBreather
              shape={SCENE_SHAPES[selectedScene.id] ?? 'circle'}
              phase={breathPhase === 'expand' ? 'inhale' : 'exhale'}
              durationMs={selectedScene.breathing.durationMs}
              isActive
              size={140}
              colors={{ from: selectedScene.palette.glowFrom, to: selectedScene.palette.glowTo }}
              scaleMin={0.85}
              scaleMax={1.2}
              styleMode="fill"
            />
          </div>
          <div
            className={`mx-auto mb-4 inline-flex items-center gap-2 rounded-full px-4 py-2 text-sm font-medium shadow-sm ${palette.badgeBg} ${palette.badgeText}`}
          >
            <Icon size={20} />
            {selectedScene.name}
          </div>
          <h2 className={`text-2xl font-semibold tracking-tight ${palette.text}`}>
            {STEP_LABELS[currentStep]} • {currentLineNumber} of {totalLines}
          </h2>
          <p className="mt-2 text-sm text-gray-600">{selectedScene.description}</p>
        </header>

        <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
          <div className="flex items-center gap-3 rounded-full bg-white/60 px-4 py-2 text-sm text-gray-700 shadow-sm">
            <Button variant="ghost" size="icon" onClick={toggleAudio} aria-label="Toggle ambient audio">
              {isAudioEnabled ? <Volume2 size={18} /> : <VolumeX size={18} />}
            </Button>
            <input
              type="range"
              min={0}
              max={1}
              step={0.05}
              value={volume}
              onChange={(event) => setVolume(Number(event.target.value))}
              className="w-24 accent-calm-500"
              aria-label="Ambient volume"
            />
            <span className="text-xs uppercase tracking-wide text-gray-500">Ambient</span>
          </div>

          <Button
            variant={autoJourney ? 'calm' : 'outline'}
            size="sm"
            onClick={toggleAutoJourney}
            className="flex items-center gap-2"
          >
            {autoJourney ? <PauseCircle size={18} /> : <PlayCircle size={18} />}
            Auto Journey
            {speechSupported ? <Sparkles size={16} className="text-amber-400" /> : <MicOff size={16} />}
          </Button>
        </div>

        <div className="mt-8 space-y-6">
          <div className="h-2 w-full overflow-hidden rounded-full bg-white/70">
            <motion.div
              className={`${palette.accent} h-full origin-left rounded-full`}
              animate={{ width: `${(currentLineNumber / totalLines) * 100}%` }}
              transition={{ duration: 0.4, ease: 'easeOut' }}
            />
          </div>

          <div className="flex justify-center gap-4 text-sm font-semibold">
            {STEP_LABELS.map((step, idx) => (
              <div key={step} className="text-center">
                <div
                  className={`mx-auto flex h-9 w-9 items-center justify-center rounded-full border text-xs ${
                    idx === currentStep
                      ? `${palette.accent} text-white border-transparent`
                      : idx < currentStep
                      ? 'border-emerald-200 bg-emerald-500 text-white'
                      : 'border-white/60 bg-white/50 text-gray-500'
                  }`}
                >
                  {idx + 1}
                </div>
                <span className="mt-2 block text-xs uppercase tracking-wide text-gray-500">{step}</span>
              </div>
            ))}
          </div>

          <div
            className={`relative overflow-hidden rounded-2xl border border-white/40 p-6 text-center shadow-inner ${palette.surface}`}
          >
            <motion.div
              className={`absolute inset-0 bg-gradient-to-br opacity-40`}
              initial={{ opacity: 0.3 }}
              animate={{
                opacity: breathPhase === 'expand' ? 0.55 : 0.3,
              }}
              transition={{ duration: selectedScene.breathing.durationMs / 1000 }}
              style={{
                backgroundImage: `linear-gradient(135deg, rgba(255,255,255,0.4), rgba(255,255,255,0.05))`,
              }}
            />
            <AnimatePresence mode="wait">
              <motion.p
                key={`${currentStep}-${currentLineIndex}`}
                className={`relative z-10 text-lg leading-relaxed ${palette.text}`}
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -16 }}
                transition={{ duration: 0.4, ease: 'easeOut' }}
              >
                {currentContent[currentLineIndex]}
              </motion.p>
            </AnimatePresence>
          </div>

          <div className="rounded-xl bg-white/60 p-4 text-center text-sm text-gray-600 shadow-sm">
            {currentStep === 0 && 'Close your eyes and picture this scene in detail.'}
            {currentStep === 1 && 'Tune into the soundscape. What layers of sound can you pick out?'}
            {currentStep === 2 && 'Notice how your body responds. Let the sensations invite calm.'}
          </div>
        </div>

        <div className="mt-8 flex flex-col gap-3 sm:flex-row">
          <Button
            onClick={handlePrev}
            variant="outline"
            size="lg"
            className="flex-1"
            disabled={currentStep === 0 && currentLineIndex === 0}
          >
            Previous
          </Button>

          <Button
            onClick={() => {
              if (isComplete) {
                resetScene()
              } else {
                handleAdvance()
              }
            }}
            variant="calm"
            size="lg"
            className="flex-1"
          >
            {isComplete ? 'Complete' : 'Next'}
          </Button>
        </div>

        <div className="mt-6 flex flex-col items-center gap-2 text-center text-xs text-gray-600 sm:flex-row sm:justify-between">
          <button
            onClick={resetScene}
            className="inline-flex items-center gap-2 text-sm text-calm-700 transition hover:text-calm-900"
          >
            <RefreshCw size={16} />
            Choose a different scene
          </button>
          <p>Ambient: {selectedScene.ambient.credit}</p>
        </div>
      </div>
    </div>
  )
}
