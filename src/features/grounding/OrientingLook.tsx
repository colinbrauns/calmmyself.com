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
import { Compass } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import ShareInline from "@/components/ShareInline";

const STEPS = [
  {
    text: "Slowly turn your head to the right... notice what you see",
    duration: 10,
    arrow: 90,
  },
  {
    text: "Let your eyes rest on something that catches your attention",
    duration: 8,
    arrow: 90,
  },
  { text: "Slowly turn back to center", duration: 6, arrow: 0 },
  { text: "Now slowly turn your head to the left", duration: 10, arrow: -90 },
  { text: "Notice colors, shapes, textures", duration: 8, arrow: -90 },
  { text: "Slowly return to center", duration: 6, arrow: 0 },
  { text: "Look up... notice the ceiling or sky", duration: 8, arrow: -180 },
  {
    text: "Look down... notice the ground beneath you",
    duration: 8,
    arrow: 180,
  },
  { text: "Take a breath. You're safe here.", duration: 10, arrow: 0 },
];

export default function OrientingLook() {
  const [isRunning, setIsRunning] = useState(false);
  const [stepIndex, setStepIndex] = useState(0);
  const [stepTime, setStepTime] = useState(0);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const step = STEPS[stepIndex];

  const start = useCallback(() => {
    setIsRunning(true);
    setStepIndex(0);
    setStepTime(STEPS[0].duration);
  }, []);

  const stop = useCallback(() => {
    setIsRunning(false);
    if (timerRef.current) clearInterval(timerRef.current);
    timerRef.current = null;
  }, []);

  useEffect(() => {
    if (!isRunning) return;
    timerRef.current = setInterval(() => {
      setStepTime((prev) => {
        if (prev <= 1) {
          setStepIndex((si) => {
            if (si >= STEPS.length - 1) {
              stop();
              return si;
            }
            const next = si + 1;
            setStepTime(STEPS[next].duration);
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
            <Compass className="w-5 h-5 " />
            Slow Orienting Look
          </CardTitle>
          <CardDescription>
            Polyvagal safety signaling through slow, mindful looking
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {!isRunning ? (
            <>
              <div className="bg-gray-50 dark:bg-gray-800/50 border border-gray-200 dark:border-gray-700 rounded-xl p-4 text-sm   space-y-2">
                <p>
                  Slowly turning your head and taking in your environment
                  signals safety to your nervous system. This ancient orienting
                  response helps shift you out of fight-or-flight.
                </p>
                <p className="text-xs  ">Duration: ~1.5 minutes</p>
              </div>
              <Button onClick={start} className="w-full">
                Begin
              </Button>
            </>
          ) : (
            <>
              {/* Directional compass */}
              <div className="flex justify-center">
                <div className="relative w-32 h-32">
                  <div className="absolute inset-0 rounded-full border-2 border-gray-200 dark:border-gray-700" />
                  <div className="absolute inset-0 flex items-center justify-center">
                    <motion.div
                      animate={{ rotate: step?.arrow ?? 0 }}
                      transition={{ duration: 1, ease: "easeInOut" }}
                    >
                      <svg viewBox="0 0 40 40" className="w-12 h-12">
                        <path d="M20 4 L24 18 L20 16 L16 18 Z" fill="#10b981" />
                        <circle cx="20" cy="20" r="3" fill="#6b7280" />
                      </svg>
                    </motion.div>
                  </div>
                  {/* Cardinal labels */}
                  <span className="absolute top-1 left-1/2 -translate-x-1/2   ">
                    Up
                  </span>
                  <span className="absolute bottom-1 left-1/2 -translate-x-1/2   ">
                    Down
                  </span>
                  <span className="absolute left-1 top-1/2 -translate-y-1/2   ">
                    L
                  </span>
                  <span className="absolute right-1 top-1/2 -translate-y-1/2   ">
                    R
                  </span>
                </div>
              </div>

              <AnimatePresence mode="wait">
                <motion.div
                  key={stepIndex}
                  initial={{ opacity: 0, y: 6 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -6 }}
                  className="text-center space-y-2"
                >
                  <p className="text-lg font-medium  ">{step?.text}</p>
                  <p className="text-2xl font-mono font-bold  ">{stepTime}s</p>
                </motion.div>
              </AnimatePresence>

              {/* Progress */}
              <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-1.5">
                <motion.div
                  className="h-full bg-emerald-400 rounded-full"
                  animate={{
                    width: `${((stepIndex + 1) / STEPS.length) * 100}%`,
                  }}
                />
              </div>
              <p className="text-xs text-center  ">
                Step {stepIndex + 1} of {STEPS.length}
              </p>

              <Button onClick={stop} variant="outline" className="w-full">
                Stop
              </Button>
            </>
          )}

          <div className="border-t border-gray-200 dark:border-gray-700 pt-4">
            <ShareInline title="Slow Orienting Look" />
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}
