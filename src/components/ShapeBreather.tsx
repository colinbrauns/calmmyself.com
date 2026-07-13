"use client";

import { useEffect, useMemo } from "react";
import { motion, useAnimationControls } from "framer-motion";
import type { CyclePhase } from "@/components/BreathingCycle";
import { useMotionPreferences } from "@/components/MotionPreferences";
import { getBreathEase, getBreathTargetScale } from "@/lib/breathingMotion";

interface ShapeBreatherProps {
  shape: "square" | "triangle" | "circle" | "flower";
  phase: CyclePhase;
  durationMs: number;
  isActive: boolean;
  size?: number;
  colors?: { from: string; to: string };
  scaleMin?: number;
  scaleMax?: number;
  styleMode?: "fill" | "stroke";
  strokeClass?: string;
}

export default function ShapeBreather({
  shape,
  phase,
  durationMs,
  isActive,
  size = 112,
  colors = { from: "from-calm-300", to: "to-calm-500" },
  scaleMin = 1,
  scaleMax = 1.5,
  styleMode = "fill",
  strokeClass = "",
}: ShapeBreatherProps) {
  const controls = useAnimationControls();
  const { animationsEnabled } = useMotionPreferences();

  const targetScale = getBreathTargetScale(phase, scaleMin, scaleMax);
  const ease = useMemo(() => getBreathEase(phase), [phase]);

  useEffect(() => {
    if (!isActive || !animationsEnabled) {
      controls.stop();
      controls.set({ scale: scaleMin });
      return;
    }

    controls.start({
      scale: targetScale,
      transition: {
        duration: durationMs / 1000,
        ease,
      },
    });
  }, [
    animationsEnabled,
    controls,
    durationMs,
    ease,
    isActive,
    scaleMin,
    targetScale,
  ]);

  const containerDim = size * (shape === "flower" ? scaleMax * 1.6 : scaleMax);
  const dimension = `${size}px`;

  const body = (() => {
    switch (shape) {
      case "square":
        if (styleMode === "stroke") {
          return (
            <>
              <motion.div
                className="absolute rounded-xl blur-xl opacity-70"
                style={{ width: dimension, height: dimension }}
                animate={controls}
                initial={{ scale: scaleMin, opacity: 0.35 }}
              >
                <div
                  className={`h-full w-full rounded-lg bg-gradient-to-br ${colors.from} ${colors.to}`}
                />
              </motion.div>
              <motion.div
                className={`will-change-transform rounded-lg border-4 border-current ${strokeClass}`}
                style={{
                  width: dimension,
                  height: dimension,
                  background: "transparent",
                }}
                animate={controls}
                initial={{ scale: scaleMin, opacity: 1 }}
              />
              {isActive && (
                <motion.div
                  key={`${phase}`}
                  className={`absolute rounded-lg bg-gradient-to-br ${colors.from} ${colors.to}`}
                  style={{ width: dimension, height: dimension, opacity: 0.18 }}
                  initial={{ scale: 0.92, opacity: 0.18 }}
                  animate={{ scale: 1.12, opacity: 0 }}
                  transition={{ duration: 0.8, ease: "easeOut" }}
                />
              )}
            </>
          );
        }
        return (
          <>
            <motion.div
              className="absolute rounded-xl blur-xl opacity-70"
              style={{ width: dimension, height: dimension }}
              animate={controls}
              initial={{ scale: scaleMin, opacity: 0.35 }}
            >
              <div
                className={`h-full w-full rounded-lg bg-gradient-to-br ${colors.from} ${colors.to}`}
              />
            </motion.div>
            <motion.div
              className={`will-change-transform rounded-lg bg-gradient-to-br ${colors.from} ${colors.to} shadow-[0_0_45px_rgba(255,255,255,0.35)]`}
              style={{ width: dimension, height: dimension }}
              animate={controls}
              initial={{ scale: scaleMin, opacity: 1 }}
            />
          </>
        );
      case "circle":
        return (
          <>
            <motion.div
              className="absolute rounded-full blur-xl opacity-70"
              style={{ width: dimension, height: dimension }}
              animate={controls}
              initial={{ scale: scaleMin, opacity: 0.3 }}
            >
              <div
                className={`h-full w-full rounded-full bg-gradient-to-br ${colors.from} ${colors.to}`}
              />
            </motion.div>
            <motion.div
              className={`will-change-transform rounded-full bg-gradient-to-br ${colors.from} ${colors.to} shadow-[0_0_50px_rgba(255,255,255,0.4)]`}
              style={{ width: dimension, height: dimension }}
              animate={controls}
              initial={{ scale: scaleMin, opacity: 1 }}
            />
            {isActive && (
              <motion.div
                key={`${phase}-circle-ripple`}
                className="absolute rounded-full border-2 border-white/40"
                style={{ width: dimension, height: dimension }}
                initial={{ scale: 0.9, opacity: 0.25 }}
                animate={{ scale: 1.25, opacity: 0 }}
                transition={{ duration: 1.1, ease: "easeOut" }}
              />
            )}
          </>
        );
      case "triangle":
        return (
          <>
            <motion.div
              className="absolute blur-xl opacity-70"
              style={{ width: dimension, height: dimension }}
              animate={controls}
              initial={{ scale: scaleMin, opacity: 0.35 }}
            >
              <div
                className={`h-full w-full bg-gradient-to-br ${colors.from} ${colors.to}`}
                style={{ clipPath: "polygon(50% 0%, 0% 100%, 100% 100%)" }}
              />
            </motion.div>
            <motion.div
              className={`will-change-transform bg-gradient-to-br ${colors.from} ${colors.to} shadow-[0_12px_35px_rgba(0,0,0,0.25)]`}
              style={{
                width: dimension,
                height: dimension,
                clipPath: "polygon(50% 0%, 0% 100%, 100% 100%)",
              }}
              animate={controls}
              initial={{ scale: scaleMin, opacity: 1 }}
            />
          </>
        );
      case "flower": {
        const petalCount = 6;
        const petalWidth = size * 0.55;
        const petalHeight = size * 1.05;
        const petals = Array.from({ length: petalCount }).map((_, index) => {
          const rotation = (360 / petalCount) * index;
          return (
            <motion.div
              key={`petal-${index}`}
              className="absolute inset-0 flex items-start justify-center"
              style={{ rotate: rotation }}
            >
              <motion.div
                className={`will-change-transform bg-gradient-to-br ${colors.from} ${colors.to} opacity-80`}
                style={{
                  width: `${petalWidth}px`,
                  height: `${petalHeight}px`,
                  borderRadius: `${petalWidth}px`,
                  transformOrigin: "50% 85%",
                  boxShadow: "0 0 28px rgba(255,255,255,0.25)",
                }}
                animate={controls}
                initial={{ scale: scaleMin, opacity: 0.6 }}
              />
            </motion.div>
          );
        });

        return (
          <>
            <motion.div
              className="absolute inset-0 rounded-full blur-3xl opacity-60"
              animate={controls}
              initial={{ scale: scaleMin, opacity: 0.45 }}
              style={{
                background: `radial-gradient(circle at 50% 50%, rgba(255,255,255,0.18), transparent 70%)`,
              }}
            />
            {petals}
            <motion.div
              className={`relative z-10 rounded-full bg-gradient-to-br ${colors.from} ${colors.to} shadow-[0_0_35px_rgba(255,255,255,0.35)]`}
              style={{ width: `${size * 0.65}px`, height: `${size * 0.65}px` }}
              animate={controls}
              initial={{ scale: scaleMin, opacity: 1 }}
            />
            {isActive && (
              <motion.div
                key={`${phase}-flower-pulse`}
                className="absolute rounded-full border border-white/40"
                style={{ width: `${size * 1.1}px`, height: `${size * 1.1}px` }}
                initial={{ scale: 0.95, opacity: 0.25 }}
                animate={{ scale: 1.25, opacity: 0 }}
                transition={{ duration: 1, ease: "easeOut" }}
              />
            )}
          </>
        );
      }
      default:
        return null;
    }
  })();

  if (!animationsEnabled) {
    return (
      <div
        className="relative flex items-center justify-center"
        style={{ width: containerDim, height: containerDim }}
      >
        {(() => {
          switch (shape) {
            case "square":
              return (
                <div
                  style={{
                    width: dimension,
                    height: dimension,
                    borderRadius: "16px",
                    border: "4px solid rgba(14,165,233,0.45)",
                  }}
                />
              );
            case "circle":
              return (
                <div
                  className={`${colors.from} ${colors.to} bg-gradient-to-br`}
                  style={{
                    width: dimension,
                    height: dimension,
                    borderRadius: "50%",
                  }}
                />
              );
            case "triangle":
              return (
                <div
                  className={`${colors.from} ${colors.to} bg-gradient-to-br`}
                  style={{
                    width: dimension,
                    height: dimension,
                    clipPath: "polygon(50% 0%, 0% 100%, 100% 100%)",
                  }}
                />
              );
            case "flower":
              return (
                <div
                  className={`${colors.from} ${colors.to} bg-gradient-to-br opacity-80`}
                  style={{
                    width: `${size}px`,
                    height: `${size}px`,
                    borderRadius: "50%",
                  }}
                />
              );
            default:
              return null;
          }
        })()}
      </div>
    );
  }

  return (
    <div
      className="relative flex items-center justify-center"
      style={{ width: containerDim, height: containerDim }}
    >
      {body}
    </div>
  );
}
