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
import { TreePine, Play, ArrowRight, RotateCcw } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import ShareInline from "@/components/ShareInline";

const STEPS = [
  {
    title: "Stand and feel",
    desc: "Stand with feet hip-width apart. Feel the ground beneath you.",
    duration: 15,
  },
  {
    title: "Shift weight",
    desc: "Slowly shift your weight to the left foot, then the right. Notice the change.",
    duration: 20,
  },
  {
    title: "Press your toes",
    desc: "Press all your toes into the ground. Feel the connection.",
    duration: 15,
  },
  {
    title: "Press your heels",
    desc: "Now press your heels down firmly. Feel the stability.",
    duration: 15,
  },
  {
    title: "Imagine roots",
    desc: "Imagine roots growing from the soles of your feet deep into the earth. You are anchored.",
    duration: 25,
  },
  {
    title: "Breathe and stand",
    desc: "Take 3 slow breaths. Feel how solid and connected you are to the ground.",
    duration: 20,
  },
];

export default function RootingExercise() {
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
            <div className="w-20 h-20 rounded-full bg-emerald-100 dark:bg-emerald-900/50 flex items-center justify-center mx-auto">
              <TreePine className="w-10 h-10" />
            </div>
          </motion.div>
          <div>
            <h3 className="text-xl font-semibold mb-2">
              Rooted and grounded 🌳
            </h3>
            <p>You are connected to the earth. Carry this feeling with you.</p>
          </div>
          <div className="flex justify-center gap-3">
            <Button onClick={reset} variant="calm" size="lg">
              Do Again
            </Button>
          </div>
          <ShareInline
            title="Rooting Exercise"
            text="Feel grounded with the rooting exercise on CalmMyself"
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
            <TreePine className="w-5 h-5" />
            <CardTitle>Rooting Exercise</CardTitle>
          </div>
          <CardDescription>
            A 2-minute exercise to feel connected to the ground beneath you
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="text-sm bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-100 dark:border-emerald-900/50 p-4 rounded-xl">
            <p>
              Stand up if you can. This guided exercise will walk you through
              feeling your feet on the ground and imagining roots growing
              beneath you.
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
            title="Rooting Exercise"
            text="Feel grounded with the rooting exercise on CalmMyself"
          />
        </CardContent>
      </Card>
    );
  }

  const current = STEPS[step];
  const progress = timeLeft / current.duration;

  return (
    <Card className="max-w-md mx-auto">
      <CardHeader className="text-center">
        <div className="flex items-center justify-center gap-2 mb-2">
          <TreePine className="w-5 h-5" />
          <CardTitle>Rooting Exercise</CardTitle>
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="flex justify-center gap-1">
          {STEPS.map((_, i) => (
            <div
              key={i}
              className={`w-6 h-1.5 rounded-full transition-colors ${i <= step ? "bg-emerald-500" : "bg-gray-200 dark:bg-gray-700"}`}
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
            <div className="w-full bg-gray-100 dark:bg-gray-800 rounded-full h-1.5">
              <motion.div
                className="bg-emerald-500 h-1.5 rounded-full"
                animate={{ width: `${progress * 100}%` }}
              />
            </div>
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
