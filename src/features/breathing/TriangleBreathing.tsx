"use client";

import { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
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

type BreathingPhase = "inhale" | "hold" | "exhale";

const PHASE_DURATION = { inhale: 4000, hold: 4000, exhale: 6000 };
const PHASE_LABELS = {
  inhale: "Breathe In",
  hold: "Hold",
  exhale: "Breathe Out",
};

const PHASES: BreathingPhase[] = ["inhale", "hold", "exhale"];

const PATTERN = PHASES.map((phase) => ({
  phase,
  label: PHASE_LABELS[phase],
  durationMs: PHASE_DURATION[phase],
}));

export default function TriangleBreathing() {
  const breath = useBreathPattern<BreathingPhase>({
    pattern: PATTERN,
  });

  const currentPhase = breath.current.phase;
  const currentPhaseDuration = breath.current.durationMs;

  // SVG triangle path tracing to visually match 4-4-6 timing
  const pathRef = useRef<SVGPathElement | null>(null);
  const [pathLen, setPathLen] = useState(300);

  useEffect(() => {
    if (pathRef.current) {
      try {
        const len = pathRef.current.getTotalLength();
        if (Number.isFinite(len) && len > 0) setPathLen(len);
      } catch {}
    }
  }, []);

  const phaseStartEnd = () => {
    // Fractions of total triangle perimeter to draw
    // Each phase traces one edge: Inhale 0->1/3, Hold 1/3->2/3, Exhale 2/3->1
    switch (currentPhase) {
      case "inhale":
        return [0, 1 / 3] as const;
      case "hold":
        return [1 / 3, 2 / 3] as const;
      case "exhale":
        return [2 / 3, 1] as const;
      default:
        return [0, 0] as const;
    }
  };

  const [startFrac, endFrac] = phaseStartEnd();
  const startOffset = pathLen * (1 - startFrac);
  const endOffset = pathLen * (1 - endFrac);

  return (
    <ToolCard>
      <ToolHeader
        title="Triangle Breathing"
        description="4-4-6 pattern with a longer exhale"
        tone="grounding"
      />
      <ToolBody>
        <ToolStage>
          <div
            data-testid="tool-visual"
            className="relative"
            style={{ width: 200, height: 200 }}
          >
            {/* Triangle path trace only (no scaling) */}
            <svg
              className="absolute"
              width={200}
              height={200}
              viewBox="0 0 180 180"
              aria-hidden="true"
            >
              <defs>
                <linearGradient id="triGrad" x1="0" y1="0" x2="1" y2="1">
                  <stop offset="0%" stopColor="#fcd34d" stopOpacity="0.9" />
                  <stop offset="100%" stopColor="#f59e0b" stopOpacity="0.9" />
                </linearGradient>
              </defs>
              {/* Track */}
              <path
                d="M90 20 L20 160 L160 160 Z"
                fill="none"
                stroke="rgba(16,24,16,0.12)"
                strokeWidth={4}
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              {/* Animated progress */}
              <motion.path
                key={`${currentPhase}-${breath.phaseIndex}-${currentPhaseDuration}-${breath.isRunning}`}
                ref={pathRef}
                d="M90 20 L20 160 L160 160 Z"
                fill="none"
                stroke="url(#triGrad)"
                strokeWidth={4}
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeDasharray={pathLen}
                initial={{ strokeDashoffset: startOffset }}
                animate={{
                  strokeDashoffset: breath.isRunning ? endOffset : startOffset,
                }}
                transition={{
                  duration: breath.isRunning ? currentPhaseDuration / 1000 : 0,
                  ease: "linear",
                }}
              />
            </svg>
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
              <div className="text-white font-medium text-sm text-center select-none">
                {breath.displaySeconds}
              </div>
            </div>
          </div>
          <PhaseReadout
            label={breath.current.label}
            detail={`Cycle ${breath.cycleCount + 1}`}
            tone="grounding"
          />
          <ToolProgress value={breath.progressPercent} tone="grounding" />
        </ToolStage>

        <ToolInfo tone="grounding">
          <p className="mb-2 text-center font-medium">Follow the triangle</p>
          <ul className="grid grid-cols-3 gap-2 text-center text-xs sm:text-sm">
            <li>Inhale 4s</li>
            <li>Hold 4s</li>
            <li>Exhale 6s</li>
          </ul>
        </ToolInfo>

        <ToolControls
          isRunning={breath.isRunning}
          isPaused={breath.isPaused}
          onToggle={breath.toggle}
          onReset={breath.reset}
          tone="grounding"
          startAriaLabel="Start breathing exercise"
          pauseAriaLabel="Pause breathing exercise"
        />
      </ToolBody>
      <ToolFooter>
        <EvidenceNote>
          Triangle breathing emphasizes a slightly longer exhale, which can
          support downshifting arousal.
          <br />
          Evidence: Controlled breathing with extended exhalation is commonly
          used to reduce physiological arousal.
        </EvidenceNote>
        <ShareInline
          title="Triangle Breathing"
          text="Practice Triangle Breathing on CalmMyself"
        />
      </ToolFooter>
    </ToolCard>
  );
}
