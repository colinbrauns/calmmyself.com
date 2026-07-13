"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Heart } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import ShareInline from "@/components/ShareInline";

const TEMPOS = [
  { label: "Slow", bps: 1 },
  { label: "Medium", bps: 1.5 },
  { label: "Fast", bps: 2 },
];

const DURATIONS = [1, 3, 5];

export default function ButterflyHug() {
  const [isRunning, setIsRunning] = useState(false);
  const [tempoIndex, setTempoIndex] = useState(0);
  const [durationMin, setDurationMin] = useState(3);
  const [side, setSide] = useState<"left" | "right">("left");
  const [timeLeft, setTimeLeft] = useState(0);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const tapRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const tempo = TEMPOS[tempoIndex];

  const start = useCallback(() => {
    setIsRunning(true);
    setTimeLeft(durationMin * 60);
    setSide("left");
  }, [durationMin]);

  const stop = useCallback(() => {
    setIsRunning(false);
    if (intervalRef.current) clearInterval(intervalRef.current);
    if (tapRef.current) clearInterval(tapRef.current);
    intervalRef.current = null;
    tapRef.current = null;
  }, []);

  useEffect(() => {
    if (!isRunning) return;
    intervalRef.current = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          stop();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [isRunning, stop]);

  useEffect(() => {
    if (!isRunning) return;
    const ms = 1000 / tempo.bps;
    tapRef.current = setInterval(() => {
      setSide((prev) => (prev === "left" ? "right" : "left"));
    }, ms);
    return () => {
      if (tapRef.current) clearInterval(tapRef.current);
    };
  }, [isRunning, tempo.bps]);

  const formatTime = (s: number) =>
    `${Math.floor(s / 60)}:${(s % 60).toString().padStart(2, "0")}`;

  return (
    <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}>
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Heart className="w-5 h-5" />
            Butterfly Hug
          </CardTitle>
          <CardDescription>
            WHO-endorsed bilateral stimulation for calm and safety
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {!isRunning ? (
            <>
              <div className="bg-gray-50 dark:bg-gray-800/50 border border-gray-200 dark:border-gray-700 rounded-xl p-4 text-sm space-y-2">
                <p className="font-medium">How to do it:</p>
                <ol className="list-decimal list-inside space-y-1">
                  <li>Cross your arms over your chest</li>
                  <li>Place each hand on the opposite shoulder</li>
                  <li>
                    Alternate tapping left and right in rhythm with the visual
                  </li>
                  <li>Think of a safe, calm place or just notice sensations</li>
                </ol>
              </div>

              <div>
                <p className="text-sm font-medium mb-2">Tempo</p>
                <div className="flex gap-2">
                  {TEMPOS.map((t, i) => (
                    <Button
                      key={t.label}
                      variant={tempoIndex === i ? "default" : "outline"}
                      size="sm"
                      onClick={() => setTempoIndex(i)}
                    >
                      {t.label} ({t.bps}/s)
                    </Button>
                  ))}
                </div>
              </div>

              <div>
                <p className="text-sm font-medium mb-2">Duration</p>
                <div className="flex gap-2">
                  {DURATIONS.map((d) => (
                    <Button
                      key={d}
                      variant={durationMin === d ? "default" : "outline"}
                      size="sm"
                      onClick={() => setDurationMin(d)}
                    >
                      {d} min
                    </Button>
                  ))}
                </div>
              </div>

              <Button onClick={start} className="w-full">
                Begin
              </Button>
            </>
          ) : (
            <>
              {/* Visual */}
              <div className="relative h-48 flex items-center justify-center">
                <svg viewBox="0 0 200 160" className="h-full w-auto">
                  {/* Shoulders */}
                  <ellipse
                    cx="60"
                    cy="80"
                    rx="40"
                    ry="50"
                    fill="none"
                    stroke="#d1d5db"
                    strokeWidth="1.5"
                    className="dark:stroke-gray-600"
                  />
                  <ellipse
                    cx="140"
                    cy="80"
                    rx="40"
                    ry="50"
                    fill="none"
                    stroke="#d1d5db"
                    strokeWidth="1.5"
                    className="dark:stroke-gray-600"
                  />
                  {/* Left hand on right shoulder */}
                  <motion.circle
                    cx="140"
                    cy="50"
                    r="14"
                    animate={{
                      opacity: side === "left" ? 1 : 0.2,
                      scale: side === "left" ? 1.15 : 1,
                    }}
                    transition={{ duration: 0.15 }}
                    fill="#6ee7b7"
                    className="dark:fill-emerald-400"
                  />
                  {/* Right hand on left shoulder */}
                  <motion.circle
                    cx="60"
                    cy="50"
                    r="14"
                    animate={{
                      opacity: side === "right" ? 1 : 0.2,
                      scale: side === "right" ? 1.15 : 1,
                    }}
                    transition={{ duration: 0.15 }}
                    fill="#6ee7b7"
                    className="dark:fill-emerald-400"
                  />
                  <text
                    x="100"
                    y="145"
                    textAnchor="middle"
                    className="fill-gray-500 dark:fill-gray-400 text-xs"
                    fontSize="12"
                  >
                    {side === "left" ? "Tap left..." : "Tap right..."}
                  </text>
                </svg>
              </div>

              <div className="text-center">
                <p className="text-3xl font-mono font-bold">
                  {formatTime(timeLeft)}
                </p>
                <p className="text-sm mt-1">{tempo.label} tempo</p>
              </div>

              <Button onClick={stop} variant="outline" className="w-full">
                Stop
              </Button>
            </>
          )}

          <div className="border-t border-gray-200 dark:border-gray-700 pt-4">
            <ShareInline title="Butterfly Hug" />
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}
