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
import { Eye } from "lucide-react";
import { motion } from "framer-motion";
import ShareInline from "@/components/ShareInline";

const PHASES = [
  { text: "Focus on the dot in the center", duration: 10, peripheral: false },
  {
    text: "Now soften your gaze... let your vision expand wide",
    duration: 10,
    peripheral: true,
  },
  {
    text: "Notice what you can see at the edges without moving your eyes",
    duration: 15,
    peripheral: true,
  },
  {
    text: "Hold this wide, soft gaze... breathe slowly",
    duration: 60,
    peripheral: true,
  },
  {
    text: "Gently bring your focus back. Notice how you feel.",
    duration: 10,
    peripheral: false,
  },
];

export default function PeripheralVision() {
  const [isRunning, setIsRunning] = useState(false);
  const [phaseIndex, setPhaseIndex] = useState(0);
  const [phaseTime, setPhaseTime] = useState(0);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const phase = PHASES[phaseIndex];

  const start = useCallback(() => {
    setIsRunning(true);
    setPhaseIndex(0);
    setPhaseTime(PHASES[0].duration);
  }, []);

  const stop = useCallback(() => {
    setIsRunning(false);
    if (timerRef.current) clearInterval(timerRef.current);
    timerRef.current = null;
  }, []);

  useEffect(() => {
    if (!isRunning) return;
    timerRef.current = setInterval(() => {
      setPhaseTime((prev) => {
        if (prev <= 1) {
          setPhaseIndex((pi) => {
            if (pi >= PHASES.length - 1) {
              stop();
              return 0;
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

  return (
    <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}>
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Eye className="w-5 h-5" />
            Peripheral Vision
          </CardTitle>
          <CardDescription>
            Shift from narrow focus to wide awareness to calm your nervous
            system
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {!isRunning ? (
            <>
              <div className="bg-gray-50 dark:bg-gray-800/50 border border-gray-200 dark:border-gray-700 rounded-xl p-4 text-sm space-y-2">
                <p>
                  When we&apos;re stressed, our vision narrows. Deliberately
                  widening your gaze activates the parasympathetic nervous
                  system.
                </p>
                <p>
                  You&apos;ll start by focusing on a central point, then
                  gradually expand your awareness to the edges of your vision.
                </p>
              </div>
              <Button onClick={start} className="w-full">
                Begin
              </Button>
            </>
          ) : (
            <>
              <div className="relative w-full h-56 bg-gray-900 dark:bg-gray-950 rounded-xl overflow-hidden flex items-center justify-center">
                {/* Central dot */}
                <div className="w-3 h-3 rounded-full bg-violet-400 z-10" />

                {/* Peripheral shimmer */}
                {phase?.peripheral && (
                  <>
                    <motion.div
                      className="absolute left-0 top-0 bottom-0 w-16"
                      animate={{ opacity: [0.05, 0.2, 0.05] }}
                      transition={{ duration: 3, repeat: Infinity }}
                      style={{
                        background:
                          "linear-gradient(to right, rgba(139,92,246,0.3), transparent)",
                      }}
                    />
                    <motion.div
                      className="absolute right-0 top-0 bottom-0 w-16"
                      animate={{ opacity: [0.05, 0.2, 0.05] }}
                      transition={{ duration: 3, repeat: Infinity, delay: 1.5 }}
                      style={{
                        background:
                          "linear-gradient(to left, rgba(139,92,246,0.3), transparent)",
                      }}
                    />
                    <motion.div
                      className="absolute top-0 left-0 right-0 h-16"
                      animate={{ opacity: [0.05, 0.15, 0.05] }}
                      transition={{ duration: 4, repeat: Infinity, delay: 0.5 }}
                      style={{
                        background:
                          "linear-gradient(to bottom, rgba(139,92,246,0.2), transparent)",
                      }}
                    />
                    <motion.div
                      className="absolute bottom-0 left-0 right-0 h-16"
                      animate={{ opacity: [0.05, 0.15, 0.05] }}
                      transition={{ duration: 4, repeat: Infinity, delay: 2 }}
                      style={{
                        background:
                          "linear-gradient(to top, rgba(139,92,246,0.2), transparent)",
                      }}
                    />
                  </>
                )}
              </div>

              <div className="text-center space-y-2">
                <p className="text-lg font-medium">{phase?.text}</p>
                <p className="text-2xl font-mono font-bold">{phaseTime}s</p>
                <p className="text-xs">
                  Step {phaseIndex + 1} of {PHASES.length}
                </p>
              </div>

              <Button onClick={stop} variant="outline" className="w-full">
                Stop
              </Button>
            </>
          )}

          <div className="border-t border-gray-200 dark:border-gray-700 pt-4">
            <ShareInline title="Peripheral Vision" />
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}
