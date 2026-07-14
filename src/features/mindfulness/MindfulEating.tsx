"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Apple, Play, RotateCcw } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import ShareInline from "@/components/ShareInline";

const STEPS = [
  {
    title: "Look",
    desc: "Really look at the food. Notice its colors, shape, and textures.",
    duration: 20,
  },
  {
    title: "Smell",
    desc: "Bring it close and inhale. What do you notice?",
    duration: 15,
  },
  {
    title: "Place in mouth",
    desc: "Place one bite in your mouth. Don't chew yet — just feel it.",
    duration: 15,
  },
  {
    title: "Notice texture",
    desc: "Explore the texture with your tongue. Smooth? Rough? Soft?",
    duration: 20,
  },
  {
    title: "Chew slowly",
    desc: "Chew very slowly. Notice how the flavor changes with each chew.",
    duration: 30,
  },
  {
    title: "Taste changes",
    desc: "Pay attention to how the taste evolves. What layers can you find?",
    duration: 20,
  },
  {
    title: "Swallow",
    desc: "When ready, swallow mindfully. Follow the sensation.",
    duration: 15,
  },
];

export default function MindfulEating() {
  const [step, setStep] = useState(-1);
  const [timeLeft, setTimeLeft] = useState(0);
  const [completed, setCompleted] = useState(false);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const startStep = useCallback((idx: number) => {
    setStep(idx);
    setTimeLeft(STEPS[idx].duration);
  }, []);

  useEffect(() => {
    if (step < 0 || completed) return;
    timerRef.current = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          if (step < STEPS.length - 1) startStep(step + 1);
          else setCompleted(true);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [step, completed, startStep]);

  const reset = () => {
    setStep(-1);
    setTimeLeft(0);
    setCompleted(false);
  };

  if (completed) {
    return (
      <Card className="max-w-md mx-auto">
        <CardContent className="text-center py-12 space-y-6">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: "spring" }}
          >
            {" "}
            <div className="w-20 h-20 rounded-full bg-green-100 dark:bg-green-900/50 flex items-center justify-center mx-auto">
              {" "}
              <Apple className="w-10 h-10" />{" "}
            </div>{" "}
          </motion.div>{" "}
          <div>
            {" "}
            <h3 className="text-xl font-semibold mb-2">
              Mindful moment complete 🍃
            </h3>{" "}
            <p>
              You just experienced one bite with full presence. That&apos;s all
              mindfulness is — full attention to this moment.
            </p>
          </div>
          <div className="flex justify-center gap-3">
            <Button onClick={reset} variant="calm" size="lg">
              Do Again
            </Button>
          </div>
          <ShareInline
            title="Mindful Eating"
            text="Mindful eating practice on CalmMyself"
          />
        </CardContent>
      </Card>
    );
  }

  if (step < 0) {
    return (
      <Card className="max-w-md mx-auto">
        <CardHeader className="text-center">
          <div className="flex items-center justify-center gap-2 mb-2">
            <Apple className="w-5 h-5" />
            <CardTitle>Mindful Eating</CardTitle>
          </div>
          <CardDescription>
            Experience one bite with complete presence (~3 minutes)
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="text-sm bg-green-50 dark:bg-green-950/30 border border-green-100 dark:border-green-900/50 p-4 rounded-xl">
            <p>
              Grab a small piece of food — a raisin, a nut, a piece of
              chocolate. This exercise guides you through eating one bite with
              full mindful awareness.
            </p>
          </div>
          <div className="flex justify-center">
            <Button
              onClick={() => startStep(0)}
              variant="calm"
              size="lg"
              className="flex items-center gap-2"
            >
              <Play size={18} /> Begin
            </Button>
          </div>
          <ShareInline
            title="Mindful Eating"
            text="Mindful eating practice on CalmMyself"
          />
        </CardContent>
      </Card>
    );
  }

  const current = STEPS[step];

  return (
    <Card className="max-w-md mx-auto">
      <CardHeader className="text-center">
        <div className="flex items-center justify-center gap-2 mb-2">
          <Apple className="w-5 h-5" />
          <CardTitle>Mindful Eating</CardTitle>
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="flex justify-center gap-1">
          {STEPS.map((_, i) => (
            <div
              key={i}
              className={`w-5 h-1.5 rounded-full transition-colors ${i <= step ? "bg-green-500" : "bg-gray-200 dark:bg-gray-700"}`}
            />
          ))}
        </div>
        <AnimatePresence mode="wait">
          <motion.div
            key={step}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="text-center space-y-4 py-4"
          >
            <p className="text-lg font-semibold">{current.title}</p>
            <p>{current.desc}</p>
            <div className="text-3xl font-bold">{timeLeft}s</div>
          </motion.div>
        </AnimatePresence>
        <div className="flex justify-center">
          <Button
            onClick={reset}
            variant="outline"
            size="lg"
            className="flex items-center gap-2"
          >
            <RotateCcw size={18} /> Start Over
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
