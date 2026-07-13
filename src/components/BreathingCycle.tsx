"use client";

import { useEffect, useMemo } from "react";
import { motion, useAnimationControls } from "framer-motion";
import { useMotionPreferences } from "@/components/MotionPreferences";
import {
  getBreathContainerSize,
  getBreathEase,
  getBreathTargetScale,
} from "@/lib/breathingMotion";

export type CyclePhase =
  | "inhale"
  | "inhale1"
  | "inhale2"
  | "hold"
  | "hold1"
  | "exhale"
  | "hold2";

export type BreathingPattern = Array<{
  phase: CyclePhase;
  label: string;
  durationMs: number;
}>;

export interface BreathingCycleProps {
  pattern: BreathingPattern;
  isActive: boolean;
  cycleIndex: number;
  size?: number;
  colors?: { from: string; to: string };
  scaleMin?: number;
  scaleMax?: number;
}

export default function BreathingCycle({
  pattern,
  isActive,
  cycleIndex,
  size = 96,
  colors = { from: "from-calm-300", to: "to-calm-500" },
  scaleMin = 1,
  scaleMax = 1.5,
}: BreathingCycleProps) {
  const controls = useAnimationControls();
  const { animationsEnabled } = useMotionPreferences();

  const current = pattern[cycleIndex % pattern.length];

  const targetScale = getBreathTargetScale(current.phase, scaleMin, scaleMax);
  const ease = useMemo(() => getBreathEase(current.phase), [current.phase]);

  useEffect(() => {
    if (!isActive || !animationsEnabled) {
      controls.stop();
      controls.set({ scale: scaleMin });
      return;
    }

    controls.start({
      scale: targetScale,
      transition: {
        duration: current.durationMs / 1000,
        ease,
      },
    });
  }, [
    animationsEnabled,
    controls,
    current.durationMs,
    ease,
    isActive,
    scaleMin,
    targetScale,
  ]);

  const progressRingSize = size + 16;
  const containerSize = getBreathContainerSize(progressRingSize, scaleMax);
  const dimension = `${size}px`;
  const progressRingDimension = `${progressRingSize}px`;
  const containerDimension = `${containerSize}px`;

  if (!animationsEnabled) {
    return (
      <div
        className="flex items-center justify-center"
        style={{ width: containerDimension, height: containerDimension }}
      >
        <div
          className={`rounded-full ${colors.from} ${colors.to} bg-gradient-to-br`}
          style={{ width: dimension, height: dimension }}
        />
      </div>
    );
  }

  return (
    <div
      className="relative flex items-center justify-center"
      style={{ width: containerDimension, height: containerDimension }}
    >
      {/* Outer soft glow that subtly brightens on inhale */}
      <motion.div
        className="absolute z-0 rounded-full blur-xl opacity-70"
        style={{ width: dimension, height: dimension }}
        animate={controls}
        initial={{ scale: scaleMin, opacity: 0.35 }}
      >
        <div
          className={`w-full h-full rounded-full ${colors.from} ${colors.to} bg-gradient-to-br ${isActive ? "animate-gradient-shift" : ""}`}
        />
      </motion.div>

      {/* Animated progress ring synced to current phase */}
      <motion.svg
        data-testid="breathing-progress-ring"
        className="pointer-events-none absolute z-20 will-change-transform"
        width={progressRingDimension}
        height={progressRingDimension}
        viewBox={`0 0 ${progressRingSize} ${progressRingSize}`}
        aria-hidden="true"
        animate={controls}
        initial={{ scale: scaleMin }}
      >
        {(() => {
          const r = progressRingSize / 2 - 6;
          const cx = progressRingSize / 2;
          const cy = progressRingSize / 2;
          const circumference = 2 * Math.PI * r;
          const isExhale = current.phase === "exhale";

          return (
            <g>
              {/* Track */}
              <circle
                cx={cx}
                cy={cy}
                r={r}
                className="fill-none stroke-white/10"
                strokeWidth={4}
              />
              {/* Progress */}
              {isActive && (
                <motion.circle
                  key={`${cycleIndex}-${current.phase}-${current.durationMs}`}
                  cx={cx}
                  cy={cy}
                  r={r}
                  className={`fill-none ${isExhale ? "stroke-white/70" : "stroke-white/60"}`}
                  strokeWidth={4}
                  strokeDasharray={circumference}
                  strokeDashoffset={circumference}
                  transform={`rotate(-90 ${cx} ${cy})`}
                  initial={{ strokeDashoffset: circumference }}
                  animate={{ strokeDashoffset: 0 }}
                  transition={{
                    duration: current.durationMs / 1000,
                    ease: getBreathEase(current.phase),
                  }}
                />
              )}
            </g>
          );
        })()}
      </motion.svg>

      {/* Main animated core */}
      <motion.div
        data-testid="breathing-core"
        className={`relative z-10 rounded-full ${colors.from} ${colors.to} bg-gradient-to-br shadow-lg will-change-transform`}
        style={{ width: dimension, height: dimension }}
        animate={controls}
        initial={{ scale: scaleMin, opacity: 1 }}
      />

      {/* Gentle inner ripple on phase change */}
      {isActive && (
        <motion.div
          key={`${cycleIndex}`}
          className="absolute z-30 rounded-full border-2 border-white/30"
          style={{ width: dimension, height: dimension }}
          initial={{ scale: 0.9, opacity: 0.2 }}
          animate={{ scale: 1.15, opacity: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
        />
      )}
    </div>
  );
}
