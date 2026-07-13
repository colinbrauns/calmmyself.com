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
import { Moon, Play, RotateCcw } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import ShareInline from "@/components/ShareInline";

const STEPS = [
  {
    title: "Relax your face",
    desc: "Close your eyes. Relax every muscle in your face — forehead, jaw, around your eyes, tongue.",
    duration: 10,
  },
  {
    title: "Drop your shoulders",
    desc: "Let your shoulders fall as low as they can. Then relax your upper and lower arms, one side at a time.",
    duration: 10,
  },
  {
    title: "Relax your chest",
    desc: "Breathe out and relax your chest. Let it sink.",
    duration: 10,
  },
  {
    title: "Relax your legs",
    desc: "Relax your thighs, then your calves, then your feet. Let everything go heavy.",
    duration: 10,
  },
  {
    title: "Clear your mind",
    desc: "For 10 seconds, try to clear your mind. If thoughts come, let them pass like clouds.",
    duration: 10,
  },
  {
    title: "Imagine a calm scene",
    desc: 'Picture yourself lying in a canoe on a calm lake with blue sky above. Or lying in a black velvet hammock in a dark room. Or simply repeat "don\'t think" for 10 seconds.',
    duration: 15,
  },
  {
    title: "Drift off",
    desc: "Keep your body relaxed. Let sleep come. You're safe.",
    duration: 15,
  },
];

export default function MilitarySleep() {
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
            <div className="w-20 h-20 rounded-full bg-indigo-100 dark:bg-indigo-900/50 flex items-center justify-center mx-auto">
              <Moon className="w-10 h-10" />
            </div>
          </motion.div>
          <div>
            <h3 className="text-xl font-semibold mb-2">Sweet dreams 🌙</h3>
            <p>
              Your body is relaxed. Close your eyes and let sleep take over.
              It&apos;s okay if it takes a few tries to master this technique.
            </p>
          </div>
          <div className="flex justify-center gap-3">
            <Button onClick={reset} variant="calm" size="lg">
              Do Again
            </Button>
          </div>
          <ShareInline
            title="Military Sleep Method"
            text="Fall asleep in 2 minutes with the military sleep method on CalmMyself"
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
            <Moon className="w-5 h-5" />
            <CardTitle>Military Sleep Method</CardTitle>
          </div>
          <CardDescription>
            Used by the military to fall asleep in 2 minutes — works with
            practice
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="text-sm bg-indigo-50 dark:bg-indigo-950/30 border border-indigo-100 dark:border-indigo-900/50 p-4 rounded-xl">
            <p>
              Lie down comfortably. This method systematically relaxes your body
              from head to toe, then clears your mind. With practice, most
              people can fall asleep within 2 minutes.
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
            title="Military Sleep Method"
            text="Fall asleep in 2 minutes on CalmMyself"
          />
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="max-w-md mx-auto bg-gray-950 border-gray-800">
      <CardContent className="space-y-6 pt-6">
        <div className="flex justify-center gap-1">
          {STEPS.map((_, i) => (
            <div
              key={i}
              className={`w-5 h-1.5 rounded-full transition-colors ${i <= step ? "bg-indigo-400" : "bg-gray-700"}`}
            />
          ))}
        </div>
        <AnimatePresence mode="wait">
          <motion.div
            key={step}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="text-center space-y-4 py-6"
          >
            <p className="text-lg font-semibold">{STEPS[step].title}</p>
            <p>{STEPS[step].desc}</p>
            <div className="text-3xl font-bold">{timeLeft}s</div>
          </motion.div>
        </AnimatePresence>
      </CardContent>
    </Card>
  );
}
