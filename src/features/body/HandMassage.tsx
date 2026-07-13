"use client";

import { useState, useEffect, useCallback } from "react";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Hand, Play, RotateCcw } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import ShareInline from "@/components/ShareInline";

const STEPS = [
  {
    title: "Palm press",
    desc: "Press your thumb into the center of your opposite palm. Make slow, firm circles.",
    duration: 15,
  },
  {
    title: "Thumb circles — base",
    desc: "Move your thumb to the base of each finger on your palm side. Circle each spot.",
    duration: 15,
  },
  {
    title: "Finger pull — index & middle",
    desc: "Gently pull your index finger from base to tip, then your middle finger.",
    duration: 15,
  },
  {
    title: "Finger pull — ring & pinky",
    desc: "Now pull your ring finger, then your pinky. Gentle, steady pressure.",
    duration: 15,
  },
  {
    title: "Thumb massage",
    desc: "Massage the fleshy part of your thumb with the opposite thumb. This is an acupressure point.",
    duration: 15,
  },
  {
    title: "Web space press",
    desc: "Press the web between thumb and index finger. Hold and breathe. Known stress relief point.",
    duration: 15,
  },
  {
    title: "Wrist circles",
    desc: "Gently rotate your wrist in slow circles, 5 each direction.",
    duration: 15,
  },
  {
    title: "Switch hands",
    desc: "Now repeat on the other hand. Start with palm press circles.",
    duration: 15,
  },
];

export default function HandMassage() {
  const [step, setStep] = useState(-1);
  const [timeLeft, setTimeLeft] = useState(0);
  const [completed, setCompleted] = useState(false);

  const startStep = useCallback((idx: number) => {
    setStep(idx);
    setTimeLeft(STEPS[idx].duration);
  }, []);

  useEffect(() => {
    if (step < 0 || completed) return;
    const id = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          if (step < STEPS.length - 1) startStep(step + 1);
          else setCompleted(true);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(id);
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
            <div className="w-20 h-20 rounded-full bg-amber-100 dark:bg-amber-900/50 flex items-center justify-center mx-auto">
              <Hand className="w-10 h-10" />
            </div>
          </motion.div>
          <div>
            <h3 className="text-xl font-semibold mb-2">Hands refreshed 🤲</h3>
            <p>
              Your hands carry so much tension. Notice the warmth and relaxation
              flowing through them.
            </p>
          </div>
          <div className="flex justify-center gap-3">
            <Button onClick={reset} variant="calm" size="lg">
              Do Again
            </Button>
          </div>
          <ShareInline
            title="Hand Massage"
            text="Self-hand massage guide on CalmMyself"
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
            <Hand className="w-5 h-5" />
            <CardTitle>Hand Massage</CardTitle>
          </div>
          <CardDescription>
            A guided self-massage for your hands — 2 minutes of gentle care
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
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
            title="Hand Massage"
            text="Self-hand massage guide on CalmMyself"
          />
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="max-w-md mx-auto">
      <CardHeader className="text-center">
        <div className="flex items-center justify-center gap-2 mb-2">
          <Hand className="w-5 h-5" />
          <CardTitle>Hand Massage</CardTitle>
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="flex justify-center gap-1">
          {STEPS.map((_, i) => (
            <div
              key={i}
              className={`w-4 h-1.5 rounded-full transition-colors ${i <= step ? "bg-amber-500" : "bg-gray-200 dark:bg-gray-700"}`}
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
            <p className="text-sm">
              Step {step + 1} of {STEPS.length}
            </p>
            <p className="text-lg font-semibold">{STEPS[step].title}</p>
            <p>{STEPS[step].desc}</p>
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
