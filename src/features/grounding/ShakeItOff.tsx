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
import { Zap } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import ShareInline from "@/components/ShareInline";

const PHASES = [
  { text: "Shake your hands", duration: 15, intensity: 0.3 },
  { text: "Shake your arms", duration: 15, intensity: 0.5 },
  { text: "Bounce on your feet", duration: 15, intensity: 0.7 },
  { text: "Let your whole body shake!", duration: 30, intensity: 1.0 },
  { text: "Gradually slow down...", duration: 15, intensity: 0.4 },
  {
    text: "Stand still. Notice how your body feels.",
    duration: 20,
    intensity: 0,
  },
];

const TOTAL_DURATION = PHASES.reduce((a, p) => a + p.duration, 0);

export default function ShakeItOff() {
  const [isRunning, setIsRunning] = useState(false);
  const [phaseIndex, setPhaseIndex] = useState(0);
  const [phaseTime, setPhaseTime] = useState(0);
  const [elapsed, setElapsed] = useState(0);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const phase = PHASES[phaseIndex];

  const start = useCallback(() => {
    setIsRunning(true);
    setPhaseIndex(0);
    setPhaseTime(PHASES[0].duration);
    setElapsed(0);
  }, []);

  const stop = useCallback(() => {
    setIsRunning(false);
    if (timerRef.current) clearInterval(timerRef.current);
    timerRef.current = null;
  }, []);

  useEffect(() => {
    if (!isRunning) return;
    timerRef.current = setInterval(() => {
      setElapsed((prev) => prev + 1);
      setPhaseTime((prev) => {
        if (prev <= 1) {
          setPhaseIndex((pi) => {
            if (pi >= PHASES.length - 1) {
              stop();
              return pi;
            }
            const next = pi + 1;
            setPhaseTime(PHASES[next].duration);
            return next;
          });
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [isRunning, stop]);

  // Particles that shake based on intensity
  const intensity = phase?.intensity ?? 0;

  return (
    <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}>
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Zap className="w-5 h-5" />
            Shake It Off
          </CardTitle>
          <CardDescription>
            Somatic stress release through guided shaking and movement
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {!isRunning ? (
            <>
              <div className="bg-gray-50 dark:bg-gray-800/50 border border-gray-200 dark:border-gray-700 rounded-xl p-4 text-sm space-y-2">
                <p>
                  Animals naturally shake after a stressful encounter to release
                  tension. This guided sequence progressively builds shaking
                  through your body, then returns to stillness.
                </p>
                <p className="text-xs">Duration: ~2 minutes</p>
              </div>
              <Button onClick={start} className="w-full">
                Begin
              </Button>
            </>
          ) : (
            <>
              {/* Visual particles */}
              <div className="relative h-48 flex items-center justify-center overflow-hidden rounded-xl bg-gray-50 dark:bg-gray-800/50">
                {Array.from({ length: 12 }).map((_, i) => (
                  <motion.div
                    key={i}
                    className="absolute w-3 h-3 rounded-full bg-amber-400/60 dark:bg-amber-300/40"
                    animate={
                      intensity > 0
                        ? {
                            x: [
                              0,
                              (Math.random() - 0.5) * 40 * intensity,
                              0,
                              (Math.random() - 0.5) * 40 * intensity,
                              0,
                            ],
                            y: [
                              0,
                              (Math.random() - 0.5) * 40 * intensity,
                              0,
                              (Math.random() - 0.5) * 40 * intensity,
                              0,
                            ],
                          }
                        : { x: 0, y: 0 }
                    }
                    transition={{
                      duration: 0.3,
                      repeat: Infinity,
                      repeatType: "loop",
                    }}
                    style={{
                      left: `${15 + (i % 4) * 25}%`,
                      top: `${15 + Math.floor(i / 4) * 30}%`,
                    }}
                  />
                ))}
                {/* Energy meter */}
                <div className="absolute bottom-3 left-3 right-3">
                  <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                    <motion.div
                      className="h-full rounded-full"
                      animate={{
                        width: `${intensity * 100}%`,
                        backgroundColor:
                          intensity > 0.7
                            ? "#f59e0b"
                            : intensity > 0
                              ? "#fbbf24"
                              : "#d1d5db",
                      }}
                      transition={{ duration: 0.5 }}
                    />
                  </div>
                </div>
              </div>

              <AnimatePresence mode="wait">
                <motion.div
                  key={phaseIndex}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="text-center space-y-2"
                >
                  <p className="text-lg font-medium">{phase?.text}</p>
                  <p className="text-2xl font-mono font-bold">{phaseTime}s</p>
                </motion.div>
              </AnimatePresence>

              {/* Overall progress */}
              <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-1.5">
                <motion.div
                  className="h-full bg-amber-400 rounded-full"
                  style={{ width: `${(elapsed / TOTAL_DURATION) * 100}%` }}
                />
              </div>
              <p className="text-xs text-center">
                Step {phaseIndex + 1} of {PHASES.length}
              </p>

              <Button onClick={stop} variant="outline" className="w-full">
                Stop
              </Button>
            </>
          )}

          <div className="border-t border-gray-200 dark:border-gray-700 pt-4">
            <ShareInline title="Shake It Off" />
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}
