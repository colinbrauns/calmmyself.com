"use client";

import { useState } from "react";
import { Card, CardContent } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Moon, RotateCcw } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import ShareInline from "@/components/ShareInline";

export default function SleepCountdown() {
  const [started, setStarted] = useState(false);
  const [current, setCurrent] = useState(300);

  const advance = () => {
    const next = current - 3;
    if (next <= 0) setCurrent(0);
    else setCurrent(next);
  };

  const reset = () => {
    setStarted(false);
    setCurrent(300);
  };

  if (!started) {
    return (
      <Card className="max-w-md mx-auto">
        <CardContent className="text-center py-12 space-y-6">
          <div className="w-16 h-16 rounded-full bg-indigo-100 dark:bg-indigo-900/50 flex items-center justify-center mx-auto">
            <Moon className="w-8 h-8" />
          </div>
          <div>
            <h3 className="text-xl font-semibold mb-2">Sleep Countdown</h3>
            <p>
              Count backward from 300 by 3s. The monotony helps your brain let
              go. Tap to advance each number.
            </p>
          </div>
          <Button onClick={() => setStarted(true)} variant="calm" size="lg">
            Start
          </Button>
          <ShareInline
            title="Sleep Countdown"
            text="Fall asleep counting backward on CalmMyself"
          />
        </CardContent>
      </Card>
    );
  }

  if (current <= 0) {
    return (
      <Card className="max-w-md mx-auto bg-gray-950 border-gray-800">
        <CardContent className="text-center py-16 space-y-6">
          <Moon className="w-12 h-12 mx-auto" />
          <h3 className="text-xl font-semibold">You made it to zero 🌙</h3>
          <p>
            If you&apos;re still awake, that&apos;s okay. Try again — most
            people drift off before reaching 0.
          </p>
          <Button onClick={reset} variant="calm" size="lg">
            Do Again
          </Button>
          <ShareInline
            title="Sleep Countdown"
            text="Fall asleep counting backward on CalmMyself"
          />
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="max-w-md mx-auto bg-gray-950 border-gray-800 min-h-[60vh] flex items-center justify-center">
      <CardContent className="text-center w-full py-12">
        <button onClick={advance} className="w-full focus:outline-none">
          <AnimatePresence mode="wait">
            <motion.div
              key={current}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 1.1 }}
              transition={{ duration: 0.3 }}
            >
              <p className="text-8xl font-light select-none">{current}</p>
            </motion.div>
          </AnimatePresence>
          <p className="mt-8 text-sm">tap to subtract 3</p>
        </button>
        <div className="mt-8">
          <Button
            onClick={reset}
            variant="outline"
            size="sm"
            className="border-gray-700"
          >
            <RotateCcw size={14} className="mr-1" /> Reset
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
