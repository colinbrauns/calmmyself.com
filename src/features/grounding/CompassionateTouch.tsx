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

const POSITIONS = [
  {
    title: "Hand on Heart",
    instruction:
      "Place one hand on your heart. Feel the warmth of your hand, the rhythm of your heartbeat.",
    duration: 30,
    svg: { cx: 100, cy: 95, label: "heart" },
  },
  {
    title: "Hand on Belly",
    instruction:
      "Place one hand on your belly. Feel it rise and fall with each breath.",
    duration: 30,
    svg: { cx: 100, cy: 135, label: "belly" },
  },
  {
    title: "Self-Hug",
    instruction:
      "Give yourself a gentle hug. Wrap your arms around yourself and squeeze gently.",
    duration: 30,
    svg: { cx: 100, cy: 110, label: "hug", wide: true },
  },
  {
    title: "Cup Your Face",
    instruction:
      "Cup your face gently in your hands. Feel the warmth and tenderness.",
    duration: 30,
    svg: { cx: 100, cy: 50, label: "face" },
  },
  {
    title: "Hold Your Own Hand",
    instruction:
      "Hold your own hand gently. Squeeze as if comforting a friend.",
    duration: 30,
    svg: { cx: 100, cy: 170, label: "hand" },
  },
];

export default function CompassionateTouch() {
  const [isRunning, setIsRunning] = useState(false);
  const [posIndex, setPosIndex] = useState(0);
  const [posTime, setPosTime] = useState(0);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const pos = POSITIONS[posIndex];

  const start = useCallback(() => {
    setIsRunning(true);
    setPosIndex(0);
    setPosTime(POSITIONS[0].duration);
  }, []);

  const stop = useCallback(() => {
    setIsRunning(false);
    if (timerRef.current) clearInterval(timerRef.current);
    timerRef.current = null;
  }, []);

  useEffect(() => {
    if (!isRunning) return;
    timerRef.current = setInterval(() => {
      setPosTime((prev) => {
        if (prev <= 1) {
          setPosIndex((pi) => {
            if (pi >= POSITIONS.length - 1) {
              stop();
              return pi;
            }
            const next = pi + 1;
            setPosTime(POSITIONS[next].duration);
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
            <Heart className="w-5 h-5" />
            Self-Compassionate Touch
          </CardTitle>
          <CardDescription>
            Gentle self-hold techniques to activate oxytocin and calm
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {!isRunning ? (
            <>
              <div className="bg-rose-50/50 dark:bg-rose-950/20 border border-rose-200 dark:border-rose-900/50 rounded-xl p-4 text-sm space-y-2">
                <p>
                  Self-touch activates oxytocin — the same &quot;bonding
                  hormone&quot; released during hugs. This guided sequence walks
                  you through five gentle positions.
                </p>
                <p className="text-xs">Duration: ~2.5 minutes</p>
              </div>
              <Button onClick={start} className="w-full">
                Begin
              </Button>
            </>
          ) : (
            <>
              <AnimatePresence mode="wait">
                <motion.div
                  key={posIndex}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -8 }}
                  className="space-y-4"
                >
                  {/* SVG body with highlight */}
                  <div className="flex justify-center">
                    <svg viewBox="0 0 200 220" className="h-40 w-auto">
                      {/* Head */}
                      <ellipse
                        cx="100"
                        cy="40"
                        rx="25"
                        ry="30"
                        fill="none"
                        stroke="#fda4af"
                        strokeWidth="1.5"
                      />
                      {/* Torso */}
                      <path
                        d="M70,70 L70,160 Q70,180 100,180 Q130,180 130,160 L130,70"
                        fill="none"
                        stroke="#fda4af"
                        strokeWidth="1.5"
                      />
                      {/* Arms */}
                      <path
                        d="M70,80 L30,140"
                        fill="none"
                        stroke="#fda4af"
                        strokeWidth="1.5"
                      />
                      <path
                        d="M130,80 L170,140"
                        fill="none"
                        stroke="#fda4af"
                        strokeWidth="1.5"
                      />
                      {/* Highlight */}
                      <motion.circle
                        cx={pos.svg.cx}
                        cy={pos.svg.cy}
                        r={pos.svg.wide ? 30 : 18}
                        fill="rgba(251,113,133,0.2)"
                        stroke="#fb7185"
                        strokeWidth="1.5"
                        animate={{
                          scale: [1, 1.1, 1],
                          opacity: [0.6, 0.9, 0.6],
                        }}
                        transition={{ duration: 2, repeat: Infinity }}
                      />
                    </svg>
                  </div>

                  <div className="text-center space-y-2">
                    <p className="text-lg font-medium">{pos.title}</p>
                    <p className="text-sm">{pos.instruction}</p>
                    <p className="text-2xl font-mono font-bold">{posTime}s</p>
                    <p className="text-xs">
                      {posIndex + 1} of {POSITIONS.length}
                    </p>
                  </div>
                </motion.div>
              </AnimatePresence>

              {/* Progress */}
              <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-1.5">
                <motion.div
                  className="h-full bg-rose-400 rounded-full"
                  animate={{
                    width: `${((posIndex + 1) / POSITIONS.length) * 100}%`,
                  }}
                />
              </div>

              <Button onClick={stop} variant="outline" className="w-full">
                Stop
              </Button>
            </>
          )}

          <div className="border-t border-gray-200 dark:border-gray-700 pt-4">
            <ShareInline title="Self-Compassionate Touch" />
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}
