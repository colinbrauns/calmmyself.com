"use client";

import { useState, useMemo } from "react";
import { Heart } from "lucide-react";
import ShareInline from "@/components/ShareInline";
import { motion, AnimatePresence } from "framer-motion";
import { useBreathPattern } from "@/hooks/useBreathPattern";
import {
  ToolBody,
  ToolCard,
  ToolControls,
  ToolFooter,
  ToolHeader,
  ToolProgress,
} from "@/components/CalmTool";

const DEFAULT_PHRASES = [
  "Right now, I am safe enough.",
  "This is hard, and I am doing my best.",
  "One breath, at a time is enough.",
];

const PATTERN = [
  { phase: "inhale", label: "Inhale", durationMs: 4000 },
  { phase: "exhale", label: "Exhale", durationMs: 4000 },
] as const;

function ExpandingRings({
  isActive,
  phase,
}: {
  isActive: boolean;
  phase: "inhale" | "exhale";
}) {
  const isInhale = phase === "inhale";
  const rings = [0, 1, 2, 3];

  return (
    <svg
      width={220}
      height={220}
      viewBox="0 0 220 220"
      className="absolute inset-0 m-auto"
    >
      {rings.map((i) => {
        const baseR = 20 + i * 20;
        const expandedR = baseR + 15;
        const contractedR = baseR - 5;
        const target = isActive ? (isInhale ? expandedR : contractedR) : baseR;
        const opacity = 0.25 - i * 0.05;

        return (
          <motion.circle
            key={i}
            cx={110}
            cy={110}
            r={target}
            fill="none"
            stroke="#8b9dc3"
            strokeWidth={1.5}
            initial={false}
            animate={{
              r: target,
              opacity: isActive ? opacity + 0.1 : opacity,
            }}
            transition={{ duration: isActive ? 3.8 : 0, ease: "easeInOut" }}
          />
        );
      })}
      {/* Center glow */}
      <motion.circle
        cx={110}
        cy={110}
        r={isActive ? (isInhale ? 35 : 15) : 20}
        fill="rgba(139, 157, 195, 0.15)"
        stroke="none"
        initial={false}
        animate={{
          r: isActive ? (isInhale ? 35 : 15) : 20,
        }}
        transition={{ duration: isActive ? 3.8 : 0, ease: "easeInOut" }}
      />
    </svg>
  );
}

export default function AnchorPhraseBreath() {
  const [phrase, setPhrase] = useState(DEFAULT_PHRASES[0]);
  const breath = useBreathPattern({
    pattern: PATTERN,
  });

  const [part1, part2] = useMemo(() => {
    if (phrase.includes(",")) {
      const parts = phrase.split(",");
      return [parts[0].trim(), parts.slice(1).join(",").trim()];
    }
    if (phrase.includes(".")) {
      const parts = phrase.split(".");
      if (parts[0] && parts[1] && parts[1].trim() !== "") {
        return [parts[0].trim(), parts.slice(1).join(".").trim()];
      }
    }
    const words = phrase.split(" ");
    const mid = Math.ceil(words.length / 2);
    return [words.slice(0, mid).join(" "), words.slice(mid).join(" ")];
  }, [phrase]);

  const isActive = breath.isRunning;
  const phase = breath.current.phase;

  return (
    <ToolCard>
      <ToolHeader
        icon={Heart}
        title="Anchor Phrase + Breath"
        description="Pair a gentle phrase with 4s in, 4s out"
      />

      <ToolBody className="space-y-6">
        {/* Visual Pacer with Expanding Rings */}
        <div className="relative flex h-64 items-center justify-center overflow-hidden rounded-lg border border-sky-100 bg-sky-50/70 dark:border-sky-900/40 dark:bg-gray-800/50">
          <ExpandingRings isActive={isActive} phase={phase} />

          {/* Text Display */}
          <div className="z-10 max-w-[200px] text-center px-4">
            <AnimatePresence mode="wait">
              <motion.div
                key={isActive ? phase : "idle"}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.5 }}
                className="text-lg font-medium"
              >
                {!isActive ? (
                  <span className="text-sm">Press Play to Begin</span>
                ) : phase === "inhale" ? (
                  <>
                    <motion.div
                      className="text-xs uppercase tracking-widest mb-1"
                      animate={{ letterSpacing: ["0.1em", "0.2em", "0.1em"] }}
                      transition={{ duration: 4, repeat: Infinity }}
                    >
                      Inhale
                    </motion.div>
                    <motion.div
                      animate={{ scale: [1, 1.05, 1] }}
                      transition={{ duration: 4, repeat: Infinity }}
                    >
                      {part1}
                    </motion.div>
                  </>
                ) : (
                  <>
                    <motion.div
                      className="text-xs uppercase tracking-widest mb-1"
                      animate={{ letterSpacing: ["0.2em", "0.1em", "0.2em"] }}
                      transition={{ duration: 4, repeat: Infinity }}
                    >
                      Exhale
                    </motion.div>
                    <motion.div
                      animate={{ scale: [1.05, 1, 1.05] }}
                      transition={{ duration: 4, repeat: Infinity }}
                    >
                      {part2}
                    </motion.div>
                  </>
                )}
              </motion.div>
            </AnimatePresence>
          </div>
        </div>

        <div className="space-y-5">
          <ToolControls
            isRunning={isActive}
            isPaused={breath.isPaused}
            onToggle={breath.toggle}
            onReset={breath.reset}
            resetDisabled={breath.status === "idle"}
          />

          <div className="flex flex-col items-center gap-2">
            <div className="text-sm">
              Breaths completed:{" "}
              <span className="font-semibold">{breath.cycleCount}</span>
            </div>
            <ToolProgress
              value={Math.min((breath.cycleCount / 10) * 100, 100)}
              className="max-w-xs"
            />
          </div>

          <div className="space-y-3 pt-4 border-t border-gray-100">
            <label className="block text-center text-xs font-medium uppercase tracking-wide">
              Anchor phrase
            </label>
            <textarea
              className="w-full resize-none rounded-lg border border-gray-300 bg-white p-3 text-center text-sm placeholder-gray-400 focus:border-calm-500 focus:ring-2 focus:ring-calm-500 dark:border-gray-600 dark:bg-gray-800 dark:placeholder-gray-500"
              rows={2}
              value={phrase}
              onChange={(e) => setPhrase(e.target.value)}
              aria-label="Anchor phrase"
            />
            <div className="flex flex-wrap justify-center gap-2">
              {DEFAULT_PHRASES.map((p) => (
                <button
                  key={p}
                  type="button"
                  onClick={() => setPhrase(p)}
                  className="px-2 py-1 rounded-full border border-gray-200 bg-white hover:border-calm-300 transition-colors"
                >
                  {p}
                </button>
              ))}
            </div>
          </div>
        </div>
      </ToolBody>

      <ToolFooter>
        <ShareInline
          title="Anchor Phrase + Breath"
          text="Pair a gentle phrase with your breath on CalmMyself."
        />
      </ToolFooter>
    </ToolCard>
  );
}
