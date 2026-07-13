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
import ShareInline from "@/components/ShareInline";
import { motion, AnimatePresence } from "framer-motion";
import { CheckCircle2, RotateCcw, ArrowLeft, Moon } from "lucide-react";

const SunsetVisualizer = ({ stepIndex }: { stepIndex: number }) => (
  <div className="relative h-40 w-full rounded-xl overflow-hidden mb-6 border border-gray-200 dark:border-gray-700">
    <motion.div
      className="absolute inset-0"
      initial={false}
      animate={{
        background:
          stepIndex === 0
            ? "linear-gradient(180deg, #bae6fd 0%, #e0f2fe 100%)"
            : stepIndex === 1
              ? "linear-gradient(180deg, #fdba74 0%, #ffedd5 100%)"
              : "linear-gradient(180deg, #818cf8 0%, #c4b5fd 100%)",
      }}
      transition={{ duration: 1.5 }}
    />
    <motion.div
      className="absolute left-1/2 w-16 h-16 rounded-full shadow-lg"
      style={{ x: "-50%" }}
      initial={false}
      animate={{
        top: stepIndex === 0 ? "15%" : stepIndex === 1 ? "45%" : "85%",
        backgroundColor: stepIndex === 2 ? "#fbbf24" : "#fde047",
        boxShadow:
          stepIndex === 2
            ? "0 0 30px rgba(251, 191, 36, 0.4)"
            : "0 0 40px rgba(253, 224, 71, 0.6)",
      }}
      transition={{ duration: 1.5, type: "spring", bounce: 0.2 }}
    />
    <div className="absolute bottom-0 w-full h-12 bg-gradient-to-t from-emerald-900/20 to-transparent" />
  </div>
);

type StepId = "breath" | "gratitude" | "let-go";

interface Step {
  id: StepId;
  title: string;
  prompt: string;
  helper: string;
}

const STEPS: Step[] = [
  {
    id: "breath",
    title: "3 gentle breaths",
    prompt: "Take three slow, comfortable breaths.",
    helper: 'On each exhale, imagine the day "landing" a little more.',
  },
  {
    id: "gratitude",
    title: "2 things that were okay enough",
    prompt:
      "Name two things that went okay, or were even slightly good, today.",
    helper:
      "They can be very small: a text, a meal, a moment of quiet, a joke.",
  },
  {
    id: "let-go",
    title: "1 thing for tomorrow-you",
    prompt: "Pick one thing you are handing to tomorrow-you to handle.",
    helper:
      "You might write it down somewhere safe and give yourself permission to pause on it now.",
  },
];

export default function LandTheDay() {
  const [stepIndex, setStepIndex] = useState(0);
  const [gratitudes, setGratitudes] = useState(["", ""]);
  const [tomorrowItem, setTomorrowItem] = useState("");
  const [completed, setCompleted] = useState(false);

  const step = STEPS[stepIndex];
  const isLast = stepIndex === STEPS.length - 1;
  const progress = ((stepIndex + 1) / STEPS.length) * 100;

  const next = () => {
    if (!isLast) setStepIndex((i) => i + 1);
    else setCompleted(true);
  };

  const back = () => {
    if (stepIndex > 0) setStepIndex((i) => i - 1);
  };

  const reset = () => {
    setStepIndex(0);
    setGratitudes(["", ""]);
    setTomorrowItem("");
    setCompleted(false);
  };

  if (completed) {
    return (
      <Card className="max-w-md mx-auto">
        <CardContent className="text-center py-12 space-y-5">
          <motion.div
            className="relative h-32 w-full rounded-xl overflow-hidden mb-2"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          >
            <div className="absolute inset-0 bg-gradient-to-b from-indigo-900 to-purple-950" />
            <motion.div
              className="absolute left-1/2 top-6 -translate-x-1/2"
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.3, type: "spring" }}
            >
              <Moon className="w-10 h-10" />
            </motion.div>
            {[...Array(12)].map((_, i) => (
              <motion.div
                key={i}
                className="absolute w-1 h-1 bg-white rounded-full"
                style={{
                  left: `${10 + Math.random() * 80}%`,
                  top: `${10 + Math.random() * 60}%`,
                }}
                initial={{ opacity: 0 }}
                animate={{ opacity: [0, 0.8, 0] }}
                transition={{
                  delay: 0.5 + i * 0.1,
                  duration: 2,
                  repeat: Infinity,
                }}
              />
            ))}
          </motion.div>
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
          >
            <h3 className="text-xl font-semibold">Day landed 🌙</h3>
            <p className="mt-2 text-sm">
              You gave this day a gentle close. Tomorrow can wait — tonight, you
              rest.
            </p>
          </motion.div>
          <div className="flex gap-3 justify-center pt-2">
            <Button onClick={reset} variant="calm" size="lg" className="gap-2">
              <RotateCcw size={16} /> Do Again
            </Button>
            <Button
              onClick={() => window.history.back()}
              variant="outline"
              size="lg"
              className="gap-2"
            >
              <ArrowLeft size={16} /> Back
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="max-w-md mx-auto">
      <CardHeader className="text-center">
        <CardTitle>Land the Day</CardTitle>
        <CardDescription>Short evening check‑in before bed</CardDescription>
      </CardHeader>

      <CardContent className="space-y-6">
        <SunsetVisualizer stepIndex={stepIndex} />

        <div className="flex items-center justify-between text-sm">
          <span>
            Step {stepIndex + 1} of {STEPS.length}
          </span>
        </div>
        <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
          <div
            className="bg-indigo-400 h-2 rounded-full transition-all duration-300"
            style={{ width: `${progress}%` }}
          />
        </div>

        <AnimatePresence mode="wait">
          <motion.div
            key={stepIndex}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            className="space-y-3"
          >
            <h3 className="text-lg font-semibold text-center">{step.title}</h3>
            <p className="text-sm text-center">{step.prompt}</p>
            <p className="text-xs text-center">{step.helper}</p>
          </motion.div>
        </AnimatePresence>

        {step.id === "gratitude" && (
          <div className="space-y-2">
            {gratitudes.map((g, i) => (
              <input
                key={i}
                type="text"
                className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-xl bg-white dark:bg-gray-800 placeholder-gray-400 dark:placeholder-gray-500 text-sm focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                placeholder={`Thing ${i + 1} that was okay enough`}
                value={g}
                onChange={(e) => {
                  const next = [...gratitudes];
                  next[i] = e.target.value;
                  setGratitudes(next);
                }}
              />
            ))}
          </div>
        )}

        {step.id === "let-go" && (
          <input
            type="text"
            className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-xl bg-white dark:bg-gray-800 placeholder-gray-400 dark:placeholder-gray-500 text-sm focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
            placeholder="Tomorrow‑you will handle..."
            value={tomorrowItem}
            onChange={(e) => setTomorrowItem(e.target.value)}
          />
        )}

        <div className="flex justify-between gap-3">
          <Button
            variant="outline"
            size="sm"
            onClick={back}
            disabled={stepIndex === 0}
          >
            Back
          </Button>
          <Button variant="calm" size="lg" onClick={next}>
            {isLast ? "Finish" : "Next"}
          </Button>
        </div>
      </CardContent>

      <div className="px-6 pb-6 pt-0">
        <div className="pt-4 mt-2 border-t border-gray-100 dark:border-gray-800">
          <ShareInline
            title="Land the Day"
            text="Use a brief Land the Day check‑in before bed on CalmMyself."
          />
        </div>
      </div>
    </Card>
  );
}
