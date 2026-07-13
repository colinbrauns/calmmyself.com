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
  MessageCircle,
  CheckCircle2,
  RotateCcw,
  ArrowLeft,
  ArrowRight,
} from "lucide-react";
import ShareInline from "@/components/ShareInline";

interface PrepStep {
  label: string;
  description: string;
  placeholder: string;
  inputType: "input" | "textarea";
}

const STEPS: PrepStep[] = [
  {
    label: "What matters most here?",
    description:
      "For example: honesty, kindness, clarity, staying present, listening.",
    placeholder: "e.g. Being honest but kind...",
    inputType: "input",
  },
  {
    label: "What is in your control?",
    description:
      "Your tone, what you say (or don't), how long you stay, whether you take breaks.",
    placeholder: "e.g. My tone of voice, taking pauses...",
    inputType: "textarea",
  },
  {
    label: "One phrase to carry in",
    description: "A short anchor phrase you can return to if things get tough.",
    placeholder: 'e.g. "I can pause if I need to"',
    inputType: "input",
  },
];

export default function ConversationPrep() {
  const [stepIndex, setStepIndex] = useState(0);
  const [answers, setAnswers] = useState(["", "", ""]);
  const [completed, setCompleted] = useState(false);

  const step = STEPS[stepIndex];
  const isLast = stepIndex === STEPS.length - 1;

  const setAnswer = (value: string) => {
    const next = [...answers];
    next[stepIndex] = value;
    setAnswers(next);
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
    setAnswers(["", "", ""]);
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
            {" "}
            <CheckCircle2 className="w-16 h-16 mx-auto" />{" "}
          </motion.div>{" "}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            {" "}
            <h3 className="text-xl font-semibold">
              You&apos;re ready \ud83d\udcaa
            </h3>{" "}
            <p className="mt-2 text-sm">
              {" "}
              You&apos;ve oriented yourself. Take a breath and carry your phrase
              with you.{" "}
            </p>{" "}
          </motion.div>{" "}
          {answers[2] && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5 }}
              className="bg-green-50 dark:bg-green-950/30 border border-green-200 dark:border-green-800/50 rounded-xl p-4 max-w-xs mx-auto"
            >
              {" "}
              <p className="text-xs font-bold uppercase mb-1">
                Your phrase
              </p>{" "}
              <p className="text-sm italic">&ldquo;{answers[2]}&rdquo;</p>{" "}
            </motion.div>
          )}{" "}
          <div className="flex gap-3 justify-center pt-2">
            {" "}
            <Button onClick={reset} variant="calm" size="lg" className="gap-2">
              {" "}
              <RotateCcw size={16} /> Do Again{" "}
            </Button>{" "}
            <Button
              onClick={() => window.history.back()}
              variant="outline"
              size="lg"
              className="gap-2"
            >
              {" "}
              <ArrowLeft size={16} /> Back{" "}
            </Button>{" "}
          </div>{" "}
        </CardContent>{" "}
      </Card>
    );
  }
  return (
    <Card className="max-w-md mx-auto">
      {" "}
      <CardHeader className="text-center">
        {" "}
        <div className="flex items-center justify-center gap-2 mb-2">
          {" "}
          <MessageCircle className="w-5 h-5" />{" "}
          <CardTitle>Before\u2011Conversation Prep</CardTitle>{" "}
        </div>{" "}
        <CardDescription>
          Get oriented before a hard talk or social situation
        </CardDescription>{" "}
      </CardHeader>{" "}
      <CardContent className="space-y-6">
        {" "}
        <div className="flex items-center justify-between text-sm">
          {" "}
          <span>
            Step {stepIndex + 1} of {STEPS.length}
          </span>{" "}
        </div>{" "}
        <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
          {" "}
          <div
            className="bg-green-400 h-2 rounded-full transition-all duration-300"
            style={{ width: `${((stepIndex + 1) / STEPS.length) * 100}%` }}
          />{" "}
        </div>{" "}
        <AnimatePresence mode="wait">
          {" "}
          <motion.div
            key={stepIndex}
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -30 }}
            className="space-y-3"
          >
            {" "}
            <label className="block font-medium">{step.label}</label>{" "}
            <p className="text-xs">{step.description}</p>{" "}
            {step.inputType === "input" ? (
              <input
                type="text"
                className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-xl bg-white dark:bg-gray-800 placeholder-gray-400 dark:placeholder-gray-500 focus:ring-2 focus:ring-green-500 focus:border-green-500"
                placeholder={step.placeholder}
                value={answers[stepIndex]}
                onChange={(e) => setAnswer(e.target.value)}
              />
            ) : (
              <textarea
                rows={3}
                className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-xl bg-white dark:bg-gray-800 placeholder-gray-400 dark:placeholder-gray-500 focus:ring-2 focus:ring-green-500 focus:border-green-500"
                placeholder={step.placeholder}
                value={answers[stepIndex]}
                onChange={(e) => setAnswer(e.target.value)}
              />
            )}
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
          <Button variant="calm" size="lg" onClick={next} className="gap-2">
            {isLast ? "Ready" : "Next"} {!isLast && <ArrowRight size={16} />}
          </Button>
        </div>
      </CardContent>
      <div className="px-6 pb-6 pt-0">
        <div className="pt-4 mt-2 border-t border-gray-100 dark:border-gray-800">
          <ShareInline
            title="Before\u2011Conversation Prep"
            text="Prep for hard conversations with a short values-based exercise on CalmMyself."
          />
        </div>
      </div>
    </Card>
  );
}
