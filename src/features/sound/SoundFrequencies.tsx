"use client";

import { useEffect, useRef, useState } from "react";
import { Button } from "@/components/ui/Button";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/Card";
import {
  Music2,
  Play,
  Pause,
  Clock,
  CheckCircle2,
  RotateCcw,
  ArrowLeft,
} from "lucide-react";
import { motion } from "framer-motion";
import ShareInline from "@/components/ShareInline";

type Preset = { id: string; name: string; hz: number };

const PRESETS: Preset[] = [
  { id: "174", name: "174 Hz \u2013 Relax", hz: 174 },
  { id: "396", name: "396 Hz \u2013 Release", hz: 396 },
  { id: "432", name: "432 Hz \u2013 Soothing", hz: 432 },
  { id: "528", name: "528 Hz \u2013 Bright", hz: 528 },
  { id: "639", name: "639 Hz \u2013 Warm", hz: 639 },
];

const DURATION_OPTIONS = [
  { label: "2 min", seconds: 120 },
  { label: "5 min", seconds: 300 },
  { label: "Free", seconds: 0 },
];

export default function SoundFrequencies() {
  const [isPlaying, setIsPlaying] = useState(false);
  const [selected, setSelected] = useState<Preset>(PRESETS[2]);
  const [volume, setVolume] = useState(0.08);
  const [duration, setDuration] = useState(120);
  const [elapsed, setElapsed] = useState(0);
  const [completed, setCompleted] = useState(false);

  const audioCtxRef = useRef<AudioContext | null>(null);
  const oscRef = useRef<OscillatorNode | null>(null);
  const gainRef = useRef<GainNode | null>(null);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(
    () => () => {
      stopTone(true);
      if (timerRef.current) clearInterval(timerRef.current);
    },
    [],
  );

  useEffect(() => {
    if (isPlaying) {
      timerRef.current = setInterval(() => {
        setElapsed((e) => {
          const next = e + 1;
          if (duration > 0 && next >= duration) {
            stopTone();
            setCompleted(true);
          }
          return next;
        });
      }, 1000);
    } else {
      if (timerRef.current) {
        clearInterval(timerRef.current);
        timerRef.current = null;
      }
    }
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [isPlaying, duration]);

  const startTone = async () => {
    if (typeof window === "undefined") return;
    type W = Window & { webkitAudioContext?: typeof AudioContext };
    const Ctor =
      (typeof AudioContext !== "undefined" ? AudioContext : undefined) ??
      (window as W).webkitAudioContext;
    if (!Ctor) return;
    if (!audioCtxRef.current) audioCtxRef.current = new Ctor();
    const ctx = audioCtxRef.current;
    stopTone(true);
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.frequency.value = selected.hz;
    osc.type = "sine";
    gain.gain.value = 0;
    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.start();
    gain.gain.linearRampToValueAtTime(volume, ctx.currentTime + 0.6);
    ctx.resume?.();
    oscRef.current = osc;
    gainRef.current = gain;
    setIsPlaying(true);
    setElapsed(0);
    setCompleted(false);
  };

  const stopTone = (immediate = false) => {
    const ctx = audioCtxRef.current;
    const osc = oscRef.current;
    const gain = gainRef.current;
    if (ctx && osc && gain) {
      if (immediate) {
        try {
          osc.stop();
        } catch {}
      } else {
        gain.gain.cancelScheduledValues(ctx.currentTime);
        gain.gain.linearRampToValueAtTime(0, ctx.currentTime + 0.6);
        setTimeout(() => {
          try {
            osc.stop();
          } catch {}
        }, 650);
      }
    }
    oscRef.current = null;
    gainRef.current = null;
    setIsPlaying(false);
  };

  const toggle = () => {
    if (isPlaying) stopTone();
    else startTone();
  };

  const onChangePreset = (p: Preset) => {
    setSelected(p);
    if (isPlaying) startTone();
  };

  const onChangeVolume = (v: number) => {
    setVolume(v);
    if (gainRef.current && audioCtxRef.current)
      gainRef.current.gain.linearRampToValueAtTime(
        v,
        audioCtxRef.current.currentTime + 0.1,
      );
  };

  const formatTime = (s: number) =>
    `${Math.floor(s / 60)}:${(s % 60).toString().padStart(2, "0")}`;

  const reset = () => {
    stopTone(true);
    setElapsed(0);
    setCompleted(false);
  };

  if (completed) {
    return (
      <Card className="max-w-md mx-auto">
        <CardContent className="text-center py-10 space-y-5">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: "spring", bounce: 0.5 }}
          >
            <CheckCircle2 className="w-16 h-16 mx-auto" />
          </motion.div>
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            <h3 className="text-xl font-semibold">
              Tone session complete \ud83c\udfb5
            </h3>
            <p className="mt-2 text-sm">
              You listened for {formatTime(duration)}. Notice the quiet that
              follows \u2014 sometimes the silence after is the most calming
              part.
            </p>
          </motion.div>
          <div className="flex gap-3 justify-center pt-2">
            <Button
              onClick={reset}
              variant="grounding"
              size="lg"
              className="gap-2"
            >
              <RotateCcw size={16} /> Listen Again
            </Button>
            <Button
              onClick={() => window.history.back()}
              variant="outline"
              size="lg"
              className="gap-2"
            >
              <ArrowLeft size={16} /> Back
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="max-w-md mx-auto">
      <CardHeader className="text-center">
        <div className="flex items-center justify-center gap-2 mb-2">
          <Music2 className="w-5 h-5" />
          <CardTitle>Calming Sounds</CardTitle>
        </div>
        <CardDescription>Gentle tones with smooth fade in/out</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {!isPlaying && elapsed === 0 && (
          <div className="flex gap-2 justify-center">
            {DURATION_OPTIONS.map((d) => (
              <Button
                key={d.seconds}
                variant={duration === d.seconds ? "grounding" : "outline"}
                size="sm"
                onClick={() => setDuration(d.seconds)}
              >
                {d.label}
              </Button>
            ))}
          </div>
        )}

        <div className="grid grid-cols-2 gap-2">
          {PRESETS.map((p) => (
            <Button
              key={p.id}
              onClick={() => onChangePreset(p)}
              variant={selected.id === p.id ? "grounding" : "outline"}
              className="truncate"
            >
              {p.name}
            </Button>
          ))}
        </div>

        {isPlaying && (
          <div className="flex items-center justify-center gap-2 bg-amber-50 dark:bg-amber-950/30 rounded-xl p-3">
            <Clock size={16} />
            <span className="text-lg font-mono">
              {duration > 0
                ? formatTime(duration - elapsed)
                : formatTime(elapsed)}
            </span>
          </div>
        )}

        {isPlaying && duration > 0 && (
          <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-1.5">
            <div
              className="bg-amber-400 h-1.5 rounded-full transition-all"
              style={{ width: `${(elapsed / duration) * 100}%` }}
            />
          </div>
        )}

        <div className="flex items-center gap-3">
          <Button
            onClick={toggle}
            variant="grounding"
            size="lg"
            className="flex items-center gap-2"
          >
            {isPlaying ? <Pause size={18} /> : <Play size={18} />}{" "}
            {isPlaying ? "Pause" : "Play"}
          </Button>
          <div className="flex-1">
            <label className="text-xs">Volume</label>
            <input
              type="range"
              min={0}
              max={0.25}
              step={0.005}
              value={volume}
              onChange={(e) => onChangeVolume(Number(e.target.value))}
              className="w-full"
            />
          </div>
        </div>

        <div
          className={`relative h-16 overflow-hidden rounded-xl bg-gradient-to-r from-amber-50 to-orange-50 dark:from-amber-950/30 dark:to-orange-950/30 ${!isPlaying ? "opacity-40" : ""}`}
        >
          <motion.div
            className="absolute inset-0 opacity-70"
            initial={{ x: "-100%" }}
            animate={{ x: "100%" }}
            transition={{ duration: 6, repeat: Infinity, ease: "linear" }}
            style={{
              background:
                "radial-gradient(60px 12px at 30% 50%, rgba(245,158,11,0.25), transparent 60%)",
            }}
          />
        </div>

        <div className="text-xs bg-gray-50 dark:bg-gray-800/50 border border-gray-200 dark:border-gray-700 p-3 rounded-xl">
          Listen at low volume. Evidence for specific &quot;healing
          frequencies&quot; varies \u2014 use what feels pleasant and calming.
        </div>
      </CardContent>
      <div className="px-6 pb-6 pt-0">
        <div className="pt-4 mt-2 border-t border-gray-100 dark:border-gray-800">
          <ShareInline
            title="Calming Sounds"
            text="Generate calming tones on CalmMyself"
          />
        </div>
      </div>
    </Card>
  );
}
