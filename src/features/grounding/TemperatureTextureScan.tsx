"use client";

import { useState } from "react";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { motion, AnimatePresence } from "framer-motion";
import {
  Thermometer,
  CheckCircle2,
  RotateCcw,
  ArrowLeft,
  ArrowRight,
} from "lucide-react";
import ShareInline from "@/components/ShareInline";

type Mode = "temperature" | "texture";

interface ScanStep {
  label: string;
  placeholder: string;
  emoji: string;
}

const TEMPERATURE_STEPS: ScanStep[] = [
  {
    label: "Find something cool",
    placeholder: "e.g. a glass, metal, air from a vent",
    emoji: "\u2744\ufe0f",
  },
  {
    label: "Find something neutral",
    placeholder: "e.g. your desk, clothing, a book",
    emoji: "\u2796",
  },
  {
    label: "Find something warm",
    placeholder: "e.g. a mug, your own skin, a blanket",
    emoji: "\u2600\ufe0f",
  },
];

const TEXTURE_STEPS: ScanStep[] = [
  {
    label: "Find something smooth",
    placeholder: "e.g. phone screen, mug, fabric",
    emoji: "\u2728",
  },
  {
    label: "Find something rough",
    placeholder: "e.g. carpet, paper, a wall",
    emoji: "\ud83e\udea8",
  },
  {
    label: "Find something soft",
    placeholder: "e.g. pillow, clothing, hair",
    emoji: "\ud83e\uddf8",
  },
];

export default function TemperatureTextureScan() {
  const [mode, setMode] = useState<Mode>("temperature");
  const [stepIndex, setStepIndex] = useState(0);
  const [notes, setNotes] = useState(["", "", ""]);
  const [completed, setCompleted] = useState(false);

  const steps = mode === "temperature" ? TEMPERATURE_STEPS : TEXTURE_STEPS;
  const step = steps[stepIndex];
  const isLast = stepIndex === steps.length - 1;

  const switchMode = (m: Mode) => {
    setMode(m);
    setStepIndex(0);
    setNotes(["", "", ""]);
    setCompleted(false);
  };

  const next = () => {
    if (!isLast) setStepIndex((i) => i + 1);
    else setCompleted(true);
  };

  const back = () => {
    if (stepIndex > 0) setStepIndex((i) => i - 1);
  };

  const reset = () => {
    setStepIndex(0);
    setNotes(["", "", ""]);
    setCompleted(false);
  };

  if (completed) {
    return (
      <Card className="max-w-md mx-auto">
        <CardContent className="text-center py-10 space-y-5">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: "spring", bounce: 0.5 }}
          >
            <CheckCircle2 className="w-16 h-16 mx-auto" />
          </motion.div>
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            <h3 className="text-xl font-semibold">
              Senses re-engaged \ud83d\udc9a
            </h3>
            <p className="mt-2 text-sm">
              You gently reconnected with the physical world through touch. That
              small act of noticing is grounding in itself.
            </p>
          </motion.div>
          <div className="flex gap-3 justify-center pt-2">
            <Button
              onClick={() =>
                switchMode(mode === "temperature" ? "texture" : "temperature")
              }
              variant="grounding"
              size="lg"
              className="gap-2"
            >
              Try {mode === "temperature" ? "Texture" : "Temperature"}
            </Button>
            <Button
              onClick={reset}
              variant="outline"
              size="lg"
              className="gap-2"
            >
              <RotateCcw size={16} /> Redo
            </Button>
          </div>
          <Button
            onClick={() => window.history.back()}
            variant="ghost"
            size="sm"
            className="gap-2"
          >
            <ArrowLeft size={16} /> Back to exercises
          </Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="max-w-md mx-auto">
      <CardHeader className="text-center">
        <div className="flex items-center justify-center gap-2 mb-2">
          <Thermometer className="w-5 h-5" />
          <CardTitle>Temperature & Texture Scan</CardTitle>
        </div>
        <CardDescription>
          Gently re-engage with the world through touch
        </CardDescription>
      </CardHeader>

      <CardContent className="space-y-6">
        <div className="flex justify-center gap-2">
          <Button
            variant={mode === "temperature" ? "grounding" : "outline"}
            size="sm"
            onClick={() => switchMode("temperature")}
          >
            Temperature
          </Button>
          <Button
            variant={mode === "texture" ? "grounding" : "outline"}
            size="sm"
            onClick={() => switchMode("texture")}
          >
            Texture
          </Button>
        </div>

        <div className="flex items-center justify-between text-sm">
          <span>
            Step {stepIndex + 1} of {steps.length}
          </span>
        </div>
        <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
          <div
            className="bg-amber-400 h-2 rounded-full transition-all duration-300"
            style={{ width: `${((stepIndex + 1) / steps.length) * 100}%` }}
          />
        </div>

        <AnimatePresence mode="wait">
          <motion.div
            key={`${mode}-${stepIndex}`}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="space-y-3"
          >
            <div className="text-center">
              <span className="text-3xl">{step.emoji}</span>
              <h3 className="text-lg font-semibold mt-2">{step.label}</h3>
              <p className="text-xs mt-1">
                Touch it gently. Notice the sensation.
              </p>
            </div>
            <input
              type="text"
              className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-xl bg-white dark:bg-gray-800 placeholder-gray-400 dark:placeholder-gray-500 focus:ring-2 focus:ring-amber-500 focus:border-amber-500"
              placeholder={step.placeholder}
              value={notes[stepIndex]}
              onChange={(e) => {
                const next = [...notes];
                next[stepIndex] = e.target.value;
                setNotes(next);
              }}
            />
          </motion.div>
        </AnimatePresence>

        <div className="flex justify-between gap-3">
          <Button
            variant="outline"
            size="sm"
            onClick={back}
            disabled={stepIndex === 0}
          >
            <ArrowLeft size={16} />
          </Button>
          <Button
            variant="grounding"
            size="lg"
            onClick={next}
            className="gap-2"
          >
            {isLast ? "Finish" : "Next"} {!isLast && <ArrowRight size={16} />}
          </Button>
        </div>
      </CardContent>

      <div className="px-6 pb-6 pt-0">
        <div className="pt-4 mt-2 border-t border-gray-100 dark:border-gray-800">
          <ShareInline
            title="Temperature & Texture Scan"
            text="Try a brief temperature and texture scan on CalmMyself."
          />
        </div>
      </div>
    </Card>
  );
}
