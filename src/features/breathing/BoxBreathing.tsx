"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import { useUsageTracking } from "@/hooks/useUsageTracking";
import ShareInline from "@/components/ShareInline";
import { useBreathPattern } from "@/hooks/useBreathPattern";
import {
  EvidenceNote,
  PhaseReadout,
  ToolBody,
  ToolCard,
  ToolControls,
  ToolFooter,
  ToolHeader,
  ToolInfo,
  ToolProgress,
  ToolStage,
} from "@/components/CalmTool";

type BreathingPhase = "inhale" | "hold1" | "exhale" | "hold2";

const PHASE_DURATION = 4000; // 4 seconds
const PHASE_LABELS = {
  inhale: "Breathe In",
  hold1: "Hold",
  exhale: "Breathe Out",
  hold2: "Hold",
};

const PHASES: BreathingPhase[] = ["inhale", "hold1", "exhale", "hold2"];

const PATTERN = PHASES.map((phase) => ({
  phase,
  label: PHASE_LABELS[phase],
  durationMs: PHASE_DURATION,
}));

export default function BoxBreathing() {
  const breath = useBreathPattern<BreathingPhase>({
    pattern: PATTERN,
  });

  // Usage tracking
  const { trackUsage } = useUsageTracking("box-breathing", breath.isRunning);

  const reset = useCallback(() => {
    if (breath.status !== "idle") {
      trackUsage(breath.cycleCount >= 3); // Consider completed if 3+ cycles
    }
    breath.reset();
  }, [breath, trackUsage]);

  const currentPhase = breath.current.phase;

  // Square path trace setup
  const pathRef = useRef<SVGPathElement | null>(null);
  const [pathLen, setPathLen] = useState(400);
  useEffect(() => {
    if (pathRef.current) {
      try {
        const len = pathRef.current.getTotalLength();
        if (Number.isFinite(len) && len > 0) setPathLen(len);
      } catch {}
    }
  }, []);

  const phaseStartEnd = () => {
    // Trace around square in 4 equal sides per phase
    switch (currentPhase) {
      case "inhale":
        return [0, 1 / 4] as const;
      case "hold1":
        return [1 / 4, 2 / 4] as const;
      case "exhale":
        return [2 / 4, 3 / 4] as const;
      case "hold2":
        return [3 / 4, 1] as const;
      default:
        return [0, 0] as const;
    }
  };
  const [startFrac, endFrac] = phaseStartEnd();
  // strokeDashoffset: pathLen = fully hidden, 0 = fully visible
  // For first phase (inhale), start at pathLen (0% visible) and animate to pathLen * 0.75 (25% visible)
  const startOffset = pathLen * (1 - startFrac);
  const endOffset = pathLen * (1 - endFrac);

  return (
    <ToolCard>
      <ToolHeader
        title="Box Breathing"
        description="4-4-4-4 pattern for calm and focus"
      />
      <ToolBody>
        <ToolStage>
          <div
            data-testid="tool-visual"
            className="relative"
            style={{ width: 200, height: 200 }}
          >
            <svg
              className="absolute"
              width={200}
              height={200}
              viewBox="0 0 180 180"
              aria-hidden="true"
            >
              {/* Track */}
              <path
                d="M20 20 H160 V160 H20 Z"
                fill="none"
                stroke="rgba(2,132,199,0.15)"
                strokeWidth={4}
                strokeLinejoin="round"
              />
              {/* Animated progress */}
              <motion.path
                key={`${currentPhase}-${breath.phaseIndex}-${breath.isRunning}`}
                ref={pathRef}
                d="M20 20 H160 V160 H20 Z"
                fill="none"
                stroke="#0ea5e9"
                strokeWidth={4}
                strokeLinejoin="round"
                strokeDasharray={pathLen}
                initial={{ strokeDashoffset: startOffset }}
                animate={{
                  strokeDashoffset: breath.isRunning ? endOffset : startOffset,
                }}
                transition={{
                  duration: breath.isRunning ? PHASE_DURATION / 1000 : 0,
                  ease: "linear",
                }}
              />
            </svg>
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
              <div className="font-semibold text-sm text-center select-none bg-white/70 rounded px-2 py-0.5">
                {breath.displaySeconds}
              </div>
            </div>
          </div>
          <PhaseReadout
            label={breath.current.label}
            detail={
              <>
                Cycle {breath.cycleCount + 1}
                {breath.cycleCount >= 3 && (
                  <span className="ml-2">Nice work.</span>
                )}
              </>
            }
          />
          <ToolProgress value={breath.progressPercent} />
        </ToolStage>

        <ToolInfo>
          <p className="mb-2 text-center font-medium">
            Follow the square sides
          </p>
          <ul className="grid grid-cols-2 gap-x-4 gap-y-1 text-xs sm:text-sm">
            <li>Inhale: top</li>
            <li>Hold: right</li>
            <li>Exhale: bottom</li>
            <li>Hold: left</li>
          </ul>
        </ToolInfo>

        <ToolControls
          isRunning={breath.isRunning}
          isPaused={breath.isPaused}
          onToggle={breath.toggle}
          onReset={reset}
          startAriaLabel="Start breathing exercise"
          pauseAriaLabel="Pause breathing exercise"
        />
      </ToolBody>
      <ToolFooter>
        <EvidenceNote>
          Equal inhale, hold, exhale, and hold phases can support calm attention
          when practiced gently.
          <br />
          Evidence: Variants of paced breathing are used across clinical
          settings to support regulation.
        </EvidenceNote>
        <ShareInline
          title="Box Breathing"
          text="Use Box Breathing on CalmMyself"
        />
      </ToolFooter>
    </ToolCard>
  );
}
