"use client";

import { useState, useEffect, useRef } from "react";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Flame, Play, RotateCcw } from "lucide-react";
import { motion } from "framer-motion";
import ShareInline from "@/components/ShareInline";

const TOTAL = 90;

const MESSAGES: { time: number; text: string }[] = [
  {
    time: 90,
    text: "A chemical wave of anger lasts about 90 seconds. Let's ride it out.",
  },
  { time: 75, text: "Breathe. Don't speak yet. That's okay." },
  {
    time: 60,
    text: "Where do you feel it in your body? Chest? Jaw? Fists? Just notice.",
  },
  { time: 45, text: "The wave is cresting. You're doing great." },
  { time: 30, text: "It's already fading. Your body is processing it." },
  { time: 15, text: "Almost there. The chemical surge is passing." },
  { time: 5, text: "You made it." },
];

export default function AngerCooldown() {
  const [started, setStarted] = useState(false);
  const [remaining, setRemaining] = useState(TOTAL);
  const [completed, setCompleted] = useState(false);

  useEffect(() => {
    if (!started || completed) return;
    const id = setInterval(() => {
      setRemaining((prev) => {
        if (prev <= 1) {
          setCompleted(true);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(id);
  }, [started, completed]);

  const reset = () => {
    setStarted(false);
    setRemaining(TOTAL);
    setCompleted(false);
  };
  const progress = 1 - remaining / TOTAL;
  const currentMessage = MESSAGES.filter((m) => remaining <= m.time).pop();

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
              <Flame className="w-10 h-10" />
            </div>
          </motion.div>
          <div>
            <h3 className="text-xl font-semibold mb-2">
              The 90 seconds are up.
            </h3>
            <p className="text-lg mb-2">The chemical wave has passed.</p>
            <p>
              Any anger you still feel is being fueled by thoughts, not
              chemicals. You can choose what to do next with a clearer mind.
            </p>
          </div>
          <div className="flex justify-center gap-3">
            <Button onClick={reset} variant="calm" size="lg">
              Do Again
            </Button>
          </div>
          <ShareInline
            title="Anger Cooldown"
            text="90-second anger cooldown on CalmMyself"
          />
        </CardContent>
      </Card>
    );
  }

  if (!started) {
    return (
      <Card className="max-w-md mx-auto">
        <CardHeader className="text-center">
          <div className="flex items-center justify-center gap-2 mb-2">
            <Flame className="w-5 h-5" />
            <CardTitle>Anger Cooldown</CardTitle>
          </div>
          <CardDescription>
            90 seconds to let the chemical wave of anger pass
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="text-sm bg-orange-50 dark:bg-orange-950/30 border border-orange-100 dark:border-orange-900/50 p-4 rounded-xl">
            <p>
              Neuroscience shows that the chemical surge of an emotion lasts
              about 90 seconds. After that, any remaining anger is being
              re-triggered by your thoughts. This timer helps you ride out the
              wave.
            </p>
          </div>
          <div className="flex justify-center">
            <Button
              onClick={() => setStarted(true)}
              variant="calm"
              size="lg"
              className="flex items-center gap-2"
            >
              <Play size={18} /> Start 90 Seconds
            </Button>
          </div>
          <ShareInline
            title="Anger Cooldown"
            text="90-second anger cooldown on CalmMyself"
          />
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="max-w-md mx-auto">
      <CardContent className="py-8 space-y-8">
        <div className="text-center">
          <motion.p
            className="text-6xl font-light"
            key={remaining}
            initial={{ scale: 1.1 }}
            animate={{ scale: 1 }}
          >
            {remaining}
          </motion.p>
          <p className="text-sm mt-2">seconds remaining</p>
        </div>

        <div className="w-full bg-gray-100 dark:bg-gray-800 rounded-full h-2">
          <motion.div
            className="h-2 rounded-full bg-gradient-to-r from-orange-500 to-emerald-500"
            animate={{ width: `${progress * 100}%` }}
            transition={{ duration: 0.5 }}
          />
        </div>

        {currentMessage && (
          <motion.p
            key={currentMessage.text}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center font-medium"
          >
            {currentMessage.text}
          </motion.p>
        )}
      </CardContent>
    </Card>
  );
}
