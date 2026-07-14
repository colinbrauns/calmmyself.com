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
import {
  Eye,
  Ear,
  Hand,
  Wind,
  Coffee,
  ArrowRight,
  RotateCcw,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import ShareInline from "@/components/ShareInline";

const STEPS = [
  {
    count: 5,
    sense: "see",
    icon: Eye,
    prompt: "Name 5 things you can SEE",
    color: "emerald",
  },
  {
    count: 4,
    sense: "hear",
    icon: Ear,
    prompt: "Name 4 things you can HEAR",
    color: "amber",
  },
  {
    count: 3,
    sense: "touch",
    icon: Hand,
    prompt: "Name 3 things you can TOUCH",
    color: "violet",
  },
  {
    count: 2,
    sense: "smell",
    icon: Wind,
    prompt: "Name 2 things you can SMELL",
    color: "teal",
  },
  {
    count: 1,
    sense: "taste",
    icon: Coffee,
    prompt: "Name 1 thing you can TASTE",
    color: "rose",
  },
];

export default function NameFiveThings() {
  const [step, setStep] = useState(0);
  const [inputs, setInputs] = useState<string[][]>(
    STEPS.map((s) => Array(s.count).fill("")),
  );
  const [completed, setCompleted] = useState(false);

  const current = STEPS[step];

  const handleInput = (idx: number, value: string) => {
    const newInputs = [...inputs];
    newInputs[step] = [...newInputs[step]];
    newInputs[step][idx] = value;
    setInputs(newInputs);
  };

  const canAdvance = inputs[step]?.every((v) => v.trim().length > 0);

  const advance = () => {
    if (step < STEPS.length - 1) setStep(step + 1);
    else setCompleted(true);
  };

  const reset = () => {
    setStep(0);
    setInputs(STEPS.map((s) => Array(s.count).fill("")));
    setCompleted(false);
  };

  if (completed) {
    return (
      <Card className="max-w-md mx-auto">
        <CardContent className="py-10 space-y-6">
          <div className="text-center">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: "spring" }}
            >
              <div className="w-16 h-16 rounded-full bg-emerald-100 dark:bg-emerald-900/50 flex items-center justify-center mx-auto mb-4">
                <Eye className="w-8 h-8" />
              </div>
            </motion.div>
            <h3 className="text-xl font-semibold mb-2">
              You&apos;re here. You&apos;re grounded. 🌿
            </h3>
            <p className="text-sm mb-6">Your anchors to this moment:</p>
          </div>
          {STEPS.map((s, si) => (
            <motion.div
              key={si}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: si * 0.15 }}
              className="bg-gray-50 dark:bg-gray-800/50 rounded-xl p-3"
            >
              <p className="text-xs font-medium mb-1">
                {s.sense.toUpperCase()}
              </p>
              <div className="flex flex-wrap gap-2">
                {inputs[si].map((val, vi) => (
                  <span
                    key={vi}
                    className="text-sm bg-white dark:bg-gray-700 rounded-lg px-3 py-1 border border-gray-200 dark:border-gray-600"
                  >
                    {val}
                  </span>
                ))}
              </div>
            </motion.div>
          ))}
          <div className="flex justify-center gap-3 pt-4">
            <Button onClick={reset} variant="calm" size="lg">
              Do Again
            </Button>
          </div>
          <ShareInline
            title="Name Five Things"
            text="Grounding through your senses on CalmMyself"
          />
        </CardContent>
      </Card>
    );
  }

  const Icon = current.icon;

  return (
    <Card className="max-w-md mx-auto">
      <CardHeader className="text-center">
        <div className="flex items-center justify-center gap-2 mb-2">
          <Icon className="w-5 h-5" />
          <CardTitle>Name Five Things</CardTitle>
        </div>
        <CardDescription>
          Ground yourself by naming what your senses notice
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="flex justify-center gap-1">
          {STEPS.map((_, i) => (
            <div
              key={i}
              className={`w-8 h-1.5 rounded-full transition-colors ${i <= step ? "bg-emerald-500" : "bg-gray-200 dark:bg-gray-700"}`}
            />
          ))}
        </div>

        <AnimatePresence mode="wait">
          <motion.div
            key={step}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="space-y-4"
          >
            <p className="text-lg font-medium text-center">{current.prompt}</p>
            <div className="space-y-2">
              {inputs[step].map((val, idx) => (
                <input
                  key={idx}
                  type="text"
                  value={val}
                  onChange={(e) => handleInput(idx, e.target.value)}
                  placeholder={`${current.sense} #${idx + 1}`}
                  className="w-full px-4 py-3 rounded-xl bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 focus:outline-none focus:ring-2 focus:ring-emerald-300 dark:focus:ring-emerald-700 text-sm"
                />
              ))}
            </div>
          </motion.div>
        </AnimatePresence>

        <div className="flex justify-center">
          <Button
            onClick={advance}
            variant="calm"
            size="lg"
            disabled={!canAdvance}
            className="flex items-center gap-2"
          >
            {step < STEPS.length - 1 ? (
              <>
                <ArrowRight size={18} /> Next
              </>
            ) : (
              "Complete"
            )}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
