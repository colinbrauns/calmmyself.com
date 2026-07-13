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
import ShareInline from "@/components/ShareInline";

interface Step {
  title: string;
  body: string;
}

const STEPS: Step[] = [
  {
    title: "Notice what is hard",
    body: 'Gently acknowledge that this moment is painful or difficult. You might silently say: "This is really hard right now."',
  },
  {
    title: "Remember you are not alone",
    body: 'Many people struggle in similar ways. You might say: "Struggle is part of being human. Other people feel this too."',
  },
  {
    title: "Offer yourself kindness",
    body: 'Choose a simple, kind phrase you can honestly offer yourself. For example: "May I be gentle with myself in this moment."',
  },
];

const SUGGESTED_PHRASES = [
  "May I be kind to myself.",
  "May I give myself the same care I would give a friend.",
  "May I be patient with myself while I learn.",
];

export default function SelfCompassionBreak() {
  const [stepIndex, setStepIndex] = useState(0);
  const [selectedPhrase, setSelectedPhrase] = useState<string>(
    SUGGESTED_PHRASES[0],
  );

  const step = STEPS[stepIndex];
  const isLastStep = stepIndex === STEPS.length - 1;

  const onNext = () => {
    if (!isLastStep) {
      setStepIndex((i) => i + 1);
    }
  };

  const onBack = () => {
    if (stepIndex > 0) {
      setStepIndex((i) => i - 1);
    }
  };

  const progressPct = ((stepIndex + 1) / STEPS.length) * 100;

  return (
    <Card className="max-w-md mx-auto">
      <CardHeader className="text-center">
        <CardTitle>Self‑Compassion Break</CardTitle>
        <CardDescription>
          A brief, science‑informed practice to turn kindness toward yourself
        </CardDescription>
      </CardHeader>

      <CardContent className="space-y-6">
        {/* Progress */}
        <div className="flex items-center justify-between text-sm">
          <span>
            Step {stepIndex + 1} of {STEPS.length}
          </span>
          <span>{isLastStep ? "Kindness phrase" : "Brief reflection"}</span>
        </div>
        <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
          <div
            className="bg-sky-500 h-2 rounded-full transition-all duration-300"
            style={{ width: `${progressPct}%` }}
          />
        </div>

        {/* Current step */}
        <div className="space-y-3">
          <h3 className="text-lg font-semibold text-center">{step.title}</h3>
          <p className="text-sm text-center whitespace-pre-line">{step.body}</p>
        </div>

        {/* Phrase selection on last step */}
        {isLastStep && (
          <div className="space-y-3">
            <p className="text-xs text-center">
              Pick a phrase that feels believable enough, or write your own.
            </p>
            <div className="space-y-2">
              {SUGGESTED_PHRASES.map((phrase) => (
                <button
                  key={phrase}
                  type="button"
                  onClick={() => setSelectedPhrase(phrase)}
                  className={`w-full text-left text-sm px-3 py-2 rounded-xl border transition-colors ${selectedPhrase === phrase ? "border-calm-400 bg-calm-50 dark:bg-gray-800/50" : "border-gray-200 bg-white hover:border-calm-300"}`}
                >
                  {phrase}
                </button>
              ))}
            </div>
            <textarea
              className="w-full mt-2 p-2 border border-gray-300 dark:border-gray-600 rounded-xl bg-white dark:bg-gray-800 placeholder-gray-400 dark:placeholder-gray-500 text-sm focus:ring-2 focus:ring-calm-500 focus:border-calm-500"
              rows={2}
              value={selectedPhrase}
              onChange={(e) => setSelectedPhrase(e.target.value)}
              aria-label="Edit or write your own kindness phrase"
            />
          </div>
        )}

        {/* Gentle reminder */}
        <div className="text-xs bg-gray-50 dark:bg-gray-800/50 border border-gray-200 dark:border-gray-700 p-3 rounded-xl">
          This is not about fixing anything quickly. It is about briefly
          acknowledging difficulty, remembering you&apos;re not alone, and
          turning a small amount of warmth toward yourself.
        </div>

        {/* Controls */}
        <div className="flex justify-between items-center gap-3">
          <Button
            variant="outline"
            size="sm"
            onClick={onBack}
            disabled={stepIndex === 0}
            aria-label="Go to previous step"
          >
            Back
          </Button>
          {!isLastStep ? (
            <Button
              variant="calm"
              size="lg"
              onClick={onNext}
              className="ml-auto"
              aria-label="Go to next step"
            >
              Next
            </Button>
          ) : (
            <div className="text-xs text-right flex-1">
              You can repeat this phrase silently a few times with a slow,
              comfortable breath.
            </div>
          )}
        </div>
      </CardContent>

      <div className="px-6 pb-6 pt-0">
        <div className="pt-4 mt-2 border-t border-gray-100 dark:border-gray-800">
          <ShareInline
            title="Self-Compassion Break"
            text="Try a brief self‑compassion break on CalmMyself."
          />
        </div>
      </div>
    </Card>
  );
}
