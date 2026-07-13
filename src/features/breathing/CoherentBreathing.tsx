"use client";

import { Activity } from "lucide-react";
import BreathingCycle, {
  type BreathingPattern,
} from "@/components/BreathingCycle";
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
  ToolProgress,
  ToolStage,
} from "@/components/CalmTool";

const PATTERN: BreathingPattern = [
  { phase: "inhale", label: "Inhale", durationMs: 5000 },
  { phase: "exhale", label: "Exhale", durationMs: 5000 },
];

const MAX_CYCLES = 6;

export default function CoherentBreathing() {
  const breath = useBreathPattern({
    pattern: PATTERN,
    maxCycles: MAX_CYCLES,
  });

  const currentLabel = breath.current.label;
  const cycleLabel = Math.min(breath.cycleCount + 1, MAX_CYCLES);

  return (
    <ToolCard>
      <ToolHeader
        icon={Activity}
        title="Coherent Breathing (6 bpm)"
        description="5s inhale, 5s exhale, steady rhythm"
      />
      <ToolBody>
        <ToolStage>
          <div
            data-testid="tool-visual"
            className="relative flex items-center justify-center"
          >
            <BreathingCycle
              pattern={PATTERN}
              isActive={breath.isRunning}
              cycleIndex={breath.phaseIndex}
              size={112}
              colors={{ from: "from-calm-300", to: "to-calm-500" }}
              scaleMin={1}
              scaleMax={1.5}
            />
            <div className="pointer-events-none absolute inset-0 flex items-center justify-center text-white font-medium text-sm select-none">
              {breath.displaySeconds}
            </div>
          </div>
          <PhaseReadout
            label={currentLabel}
            detail={
              breath.isComplete
                ? `Complete: ${MAX_CYCLES} cycles finished`
                : `Cycle ${cycleLabel} of ${MAX_CYCLES}`
            }
          />
          <ToolProgress value={breath.progressPercent} />
        </ToolStage>
        <ToolControls
          isRunning={breath.isRunning}
          isPaused={breath.isPaused}
          onToggle={breath.toggle}
          onReset={breath.reset}
        />
      </ToolBody>
      <ToolFooter>
        <EvidenceNote>
          Coherent breathing can support autonomic balance and HRV. Breathe
          softly without strain.
          <br />
          Evidence: Search for "HRV biofeedback coherent breathing randomized
          controlled trial".
        </EvidenceNote>
        <ShareInline
          title="Coherent Breathing"
          text="Try coherent breathing (6 bpm) on CalmMyself"
        />
      </ToolFooter>
    </ToolCard>
  );
}
