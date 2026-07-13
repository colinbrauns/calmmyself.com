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
import { Mail, Send, CheckCircle2, RotateCcw, ArrowLeft } from "lucide-react";
import ShareInline from "@/components/ShareInline";

const PROMPTS = [
  "What would a steadier future-you thank you for today?",
  "What small act of care would they notice?",
  "What would they want you to know right now?",
];

export default function FutureYouPostcard() {
  const [step, setStep] = useState(0);
  const [message, setMessage] = useState("");
  const [sent, setSent] = useState(false);

  const send = () => {
    if (message.trim()) setSent(true);
  };

  const reset = () => {
    setStep(0);
    setMessage("");
    setSent(false);
  };

  if (sent) {
    return (
      <Card className="max-w-md mx-auto">
        <CardContent className="text-center py-12 space-y-5">
          <motion.div
            initial={{ y: 20, opacity: 0, rotate: -5 }}
            animate={{ y: 0, opacity: 1, rotate: 2 }}
            transition={{ type: "spring", bounce: 0.4 }}
            className="bg-amber-50 dark:bg-amber-950/30 border-2 border-amber-200 dark:border-amber-800/50 rounded-xl p-6 max-w-xs mx-auto shadow-md"
          >
            <div className="text-xs font-bold uppercase tracking-wider mb-3 flex items-center justify-center gap-1">
              <Mail size={12} /> Postcard
            </div>
            <p className="text-sm italic leading-relaxed">
              &ldquo;{message}&rdquo;
            </p>
            <div className="mt-3 text-xs text-right">&mdash; future you</div>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
          >
            <h3 className="text-xl font-semibold">
              Postcard sent to yourself \u2728
            </h3>
            <p className="mt-2 text-sm">
              That small shift from threat to values can make more difference
              than you think.
            </p>
          </motion.div>
          <div className="flex gap-3 justify-center pt-2">
            <Button onClick={reset} variant="calm" size="lg" className="gap-2">
              <RotateCcw size={16} /> Write Another
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
        <div className="flex items-center justify-center gap-2 mb-2">
          <Mail className="w-5 h-5" />
          <CardTitle>Future-You Postcard</CardTitle>
        </div>
        <CardDescription>
          A tiny note from a steadier version of you
        </CardDescription>
      </CardHeader>

      <CardContent className="space-y-6">
        <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-1.5">
          <div
            className="bg-amber-400 h-1.5 rounded-full transition-all duration-300"
            style={{ width: `${((step + 1) / PROMPTS.length) * 100}%` }}
          />
        </div>

        <div className="flex gap-1 justify-center">
          {PROMPTS.map((_, i) => (
            <button
              key={i}
              onClick={() => setStep(i)}
              className={`w-2 h-2 rounded-full transition-colors ${i === step ? "bg-amber-500" : "bg-gray-300 dark:bg-gray-600"}`}
            />
          ))}
        </div>

        <AnimatePresence mode="wait">
          <motion.div
            key={step}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="bg-amber-50 dark:bg-gray-800/50 border border-amber-100 dark:border-gray-700 rounded-xl p-5"
          >
            <p className="text-sm text-center mb-4 font-medium">
              {PROMPTS[step]}
            </p>
            <textarea
              rows={4}
              className="w-full p-3 border border-amber-200 dark:border-gray-600 rounded-xl bg-white dark:bg-gray-800 placeholder-gray-400 dark:placeholder-gray-500 text-sm focus:ring-2 focus:ring-amber-400 focus:border-amber-400"
              placeholder="Dear me..."
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              aria-label="Write a short note from future-you"
            />
          </motion.div>
        </AnimatePresence>

        <p className="text-xs text-center">
          The note can be very simple. The goal is to gently shift from
          threat-mode to values-mode.
        </p>

        <div className="flex justify-center gap-3">
          <Button
            variant="calm"
            size="lg"
            onClick={send}
            disabled={!message.trim()}
            className="gap-2"
          >
            <Send size={16} /> Send Postcard
          </Button>
        </div>
      </CardContent>

      <div className="px-6 pb-6 pt-0">
        <div className="pt-4 mt-2 border-t border-gray-100 dark:border-gray-800">
          <ShareInline
            title="Future-You Postcard"
            text="Write a tiny Future-You Postcard on CalmMyself."
          />
        </div>
      </div>
    </Card>
  );
}
