"use client";

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

type BreathingPhase = "inhale1" | "inhale2" | "exhale";

const PATTERN = [
  { phase: "inhale1", label: "First inhale", durationMs: 2000 },
  { phase: "inhale2", label: "Second inhale", durationMs: 1000 },
  { phase: "exhale", label: "Long exhale", durationMs: 6000 },
] as const;

function DoublePulseVisual({
  phase,
  progress,
  isActive,
}: {
  phase: BreathingPhase;
  progress: number;
  isActive: boolean;
}) {
  // Inner circle: expands on inhale1, stays on inhale2, shrinks on exhale
  // Outer circle: stays small on inhale1, expands on inhale2, shrinks on exhale
  let innerScale = 0.4;
  let outerScale = 0.3;

  if (isActive) {
    if (phase === "inhale1") {
      innerScale = 0.4 + (progress / 100) * 0.35;
      outerScale = 0.3;
    } else if (phase === "inhale2") {
      innerScale = 0.75;
      outerScale = 0.3 + (progress / 100) * 0.7;
    } else {
      // exhale: both shrink
      innerScale = 0.75 - (progress / 100) * 0.35;
      outerScale = 1.0 - (progress / 100) * 0.7;
    }
  }

  const size = 200;
  const cx = size / 2;
  const cy = size / 2;
  const outerRadius = 80 * outerScale;
  const innerRadius = 50 * innerScale;
  const circleTransition = {
    duration: isActive ? 0.15 : 0,
    ease: "linear" as const,
  };

  const isInhaling = phase === "inhale1" || phase === "inhale2";

  return (
    <div
      data-testid="tool-visual"
      className="relative"
      style={{ width: size, height: size }}
    >
      <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
        {/* Outer circle */}
        <motion.circle
          cx={cx}
          cy={cy}
          r={outerRadius}
          fill="none"
          stroke={phase === "inhale2" && isActive ? "#3b82f6" : "#93c5fd"}
          strokeWidth={3}
          initial={false}
          animate={{ r: outerRadius }}
          transition={circleTransition}
          opacity={isActive ? (outerScale > 0.35 ? 0.8 : 0.3) : 0.3}
        />
        <motion.circle
          cx={cx}
          cy={cy}
          r={outerRadius}
          fill={`rgba(59, 130, 246, ${isActive ? 0.08 : 0.05})`}
          stroke="none"
          initial={false}
          animate={{ r: outerRadius }}
          transition={circleTransition}
        />

        {/* Inner circle */}
        <motion.circle
          cx={cx}
          cy={cy}
          r={innerRadius}
          fill={`rgba(59, 130, 246, ${isActive ? 0.15 : 0.1})`}
          stroke={phase === "inhale1" && isActive ? "#2563eb" : "#60a5fa"}
          strokeWidth={3}
          initial={false}
          animate={{ r: innerRadius }}
          transition={circleTransition}
        />

        {/* Breath direction arrows */}
        {isActive && isInhaling && (
          <>
            <motion.path
              d={`M ${cx} ${cy - 55 * innerScale} L ${cx - 6} ${cy - 55 * innerScale + 10} M ${cx} ${cy - 55 * innerScale} L ${cx + 6} ${cy - 55 * innerScale + 10}`}
              stroke="#2563eb"
              strokeWidth={2}
              fill="none"
              animate={{ opacity: [0.3, 0.8, 0.3] }}
              transition={{ duration: 1, repeat: Infinity }}
            />
            <motion.path
              d={`M ${cx} ${cy + 55 * innerScale} L ${cx - 6} ${cy + 55 * innerScale - 10} M ${cx} ${cy + 55 * innerScale} L ${cx + 6} ${cy + 55 * innerScale - 10}`}
              stroke="#2563eb"
              strokeWidth={2}
              fill="none"
              animate={{ opacity: [0.3, 0.8, 0.3] }}
              transition={{ duration: 1, repeat: Infinity }}
            />
          </>
        )}
        {isActive && phase === "exhale" && (
          <>
            <motion.path
              d={`M ${cx} ${cy - 55 * innerScale} L ${cx - 6} ${cy - 55 * innerScale - 10} M ${cx} ${cy - 55 * innerScale} L ${cx + 6} ${cy - 55 * innerScale - 10}`}
              stroke="#60a5fa"
              strokeWidth={2}
              fill="none"
              animate={{ opacity: [0.3, 0.8, 0.3] }}
              transition={{ duration: 1.5, repeat: Infinity }}
            />
            <motion.path
              d={`M ${cx} ${cy + 55 * innerScale} L ${cx - 6} ${cy + 55 * innerScale + 10} M ${cx} ${cy + 55 * innerScale} L ${cx + 6} ${cy + 55 * innerScale + 10}`}
              stroke="#60a5fa"
              strokeWidth={2}
              fill="none"
              animate={{ opacity: [0.3, 0.8, 0.3] }}
              transition={{ duration: 1.5, repeat: Infinity }}
            />
          </>
        )}
      </svg>

      {/* Inhale dots indicator */}
      <div className="absolute top-2 left-1/2 -translate-x-1/2 flex gap-2">
        <div
          className={`w-3 h-3 rounded-full border-2 transition-all duration-300 ${isActive && (phase === "inhale1" || phase === "inhale2" || phase === "exhale") ? "bg-blue-500 border-blue-500" : "bg-transparent border-blue-300"}`}
        />
        <div
          className={`w-3 h-3 rounded-full border-2 transition-all duration-300 ${isActive && (phase === "inhale2" || phase === "exhale") ? "bg-blue-500 border-blue-500" : "bg-transparent border-blue-300"}`}
        />
      </div>
    </div>
  );
}

export default function PhysiologicalSigh() {
  const breath = useBreathPattern<BreathingPhase>({
    pattern: PATTERN,
  });

  return (
    <ToolCard>
      <ToolHeader
        title="Physiological Sigh"
        description="Double inhale with a long exhale"
      />
      <ToolBody>
        <ToolStage>
          {/* Double Pulse Visualization */}
          <DoublePulseVisual
            phase={breath.current.phase}
            progress={breath.progressPercent}
            isActive={breath.isRunning}
          />
          <PhaseReadout
            label={breath.current.label}
            detail={`Cycle ${breath.cycleCount + 1}`}
          />
          <ToolProgress value={breath.progressPercent} />
        </ToolStage>

        <ToolInfo>
          <ul className="grid gap-1 text-xs sm:text-sm">
            <li>
              <strong>First inhale:</strong> fill lower lungs, 2s
            </li>
            <li>
              <strong>Second inhale:</strong> gently top up, 1s
            </li>
            <li>
              <strong>Long exhale:</strong> release slowly, 6s
            </li>
          </ul>
        </ToolInfo>

        <ToolControls
          isRunning={breath.isRunning}
          isPaused={breath.isPaused}
          onToggle={breath.toggle}
          onReset={breath.reset}
        />
      </ToolBody>
      <ToolFooter>
        <EvidenceNote>
          The physiological sigh has been shown to rapidly reduce autonomic
          arousal in lab settings.
          <br />
          Evidence:{" "}
          <a
            className="underline"
            href="https://www.cell.com/cell-reports-medicine/fulltext/S2666-3791(22)00434-3"
            target="_blank"
            rel="noopener noreferrer"
          >
            Cell Reports Medicine (2023) — Brief structured respiration
            practices vs. mindfulness
          </a>
          .
        </EvidenceNote>
        <ShareInline
          title="Physiological Sigh"
          text="Use the physiological sigh on CalmMyself"
        />
      </ToolFooter>
    </ToolCard>
  );
}
