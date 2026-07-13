"use client";

import { useState } from "react";
import { Card, CardContent } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Heart, ArrowRight, RotateCcw } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import ShareInline from "@/components/ShareInline";

const STEPS = [
  {
    title: "You're having a panic attack.",
    subtitle: "You are safe. This will pass.",
    desc: "Panic attacks feel terrifying but they cannot hurt you. Your body is trying to protect you — it just got the signal wrong.",
    color: "",
  },
  {
    title: "This will pass.",
    subtitle: "It always does.",
    desc: "Panic attacks typically peak within 10 minutes and fade. You have survived every single one so far.",
    color: "",
  },
  {
    title: "Slow your breath.",
    subtitle: "In through your nose... out through your mouth.",
    desc: "Breathe in for 4 counts. Out for 6 counts. Your exhale being longer than your inhale tells your body to calm down.",
    color: "",
  },
  {
    title: "Name where you are.",
    subtitle: "Say it out loud if you can.",
    desc: '"I am in [place]. It is [time]. I am [your name]." This anchors your brain to reality.',
    color: "",
  },
  {
    title: "Feel your feet.",
    subtitle: "Press them into the ground.",
    desc: "Wiggle your toes. Press your heels down. You are here. You are solid. The ground is holding you.",
    color: "",
  },
  {
    title: "Cold water or ice.",
    subtitle: "If available — hands, wrists, or face.",
    desc: "Cold activates your dive reflex, which slows your heart rate. Even splashing cold water on your wrists helps.",
    color: "",
  },
];

export default function PanicFirstAid() {
  const [step, setStep] = useState(0);
  const [completed, setCompleted] = useState(false);

  const advance = () => {
    if (step < STEPS.length - 1) setStep(step + 1);
    else setCompleted(true);
  };
  const reset = () => {
    setStep(0);
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
              <Heart className="w-10 h-10 " />
            </div>
          </motion.div>
          <div>
            <h3 className="text-2xl font-semibold   mb-2">You did it. 💚</h3>
            <p className="  text-lg">
              The wave is passing. Stay gentle with yourself. There&apos;s no
              rush to do anything next.
            </p>
          </div>
          <div className="flex justify-center gap-3">
            <Button onClick={reset} variant="calm" size="lg">
              Start Over
            </Button>
          </div>
          <ShareInline
            title="Panic First Aid"
            text="Panic attack first aid on CalmMyself"
          />
        </CardContent>
      </Card>
    );
  }

  const current = STEPS[step];

  return (
    <Card className="max-w-md mx-auto">
      <CardContent className="py-8 space-y-8">
        <AnimatePresence mode="wait">
          <motion.div
            key={step}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.4 }}
            className="text-center space-y-4"
          >
            <p className={`text-2xl sm:text-3xl font-bold ${current.color}`}>
              {current.title}
            </p>
            <p className="text-lg   font-medium">{current.subtitle}</p>
            <p className=" ">{current.desc}</p>
          </motion.div>
        </AnimatePresence>

        <div className="flex justify-center gap-1">
          {STEPS.map((_, i) => (
            <div
              key={i}
              className={`w-8 h-2 rounded-full transition-colors ${i <= step ? "bg-emerald-400" : "bg-gray-200 dark:bg-gray-700"}`}
            />
          ))}
        </div>

        <div className="flex justify-center">
          <Button
            onClick={advance}
            variant="calm"
            size="lg"
            className="text-lg px-8 py-4 flex items-center gap-2"
          >
            {step < STEPS.length - 1 ? (
              <>
                <ArrowRight size={20} /> Next Step
              </>
            ) : (
              "I'm okay"
            )}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
