"use client";

import { useState, useCallback, useEffect } from "react";
import { Button } from "@/components/ui/Button";
import { Card, CardContent } from "@/components/ui/Card";
import { Play, Pause, RotateCcw } from "lucide-react";

interface MuscleGroup {
  name: string;
  instruction: string;
  tenseDuration: number;
  relaxDuration: number;
}

const MUSCLE_GROUPS: MuscleGroup[] = [
  {
    name: "Face & Forehead",
    instruction: "Scrunch your forehead and close your eyes tightly",
    tenseDuration: 5000,
    relaxDuration: 10000,
  },
  {
    name: "Jaw & Neck",
    instruction: "Clench your jaw and tense your neck muscles",
    tenseDuration: 5000,
    relaxDuration: 10000,
  },
  {
    name: "Shoulders",
    instruction: "Raise your shoulders up to your ears",
    tenseDuration: 5000,
    relaxDuration: 10000,
  },
  {
    name: "Arms & Hands",
    instruction: "Make fists and tense your arms",
    tenseDuration: 5000,
    relaxDuration: 10000,
  },
  {
    name: "Chest & Upper Back",
    instruction: "Arch your back and push your chest out",
    tenseDuration: 5000,
    relaxDuration: 10000,
  },
  {
    name: "Stomach",
    instruction: "Tighten your abdominal muscles",
    tenseDuration: 5000,
    relaxDuration: 10000,
  },
  {
    name: "Buttocks & Hips",
    instruction: "Squeeze your glutes and hip muscles",
    tenseDuration: 5000,
    relaxDuration: 10000,
  },
  {
    name: "Thighs",
    instruction: "Tense your quadriceps and hamstrings",
    tenseDuration: 5000,
    relaxDuration: 10000,
  },
  {
    name: "Calves & Feet",
    instruction: "Point your toes and tense your calf muscles",
    tenseDuration: 5000,
    relaxDuration: 10000,
  },
];

type Phase = "ready" | "tense" | "relax" | "complete";

function ReclinerSetupIcon() {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 96 96"
      className="mx-auto h-28 w-28"
      fill="none"
      stroke="currentColor"
      strokeWidth="4"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <circle cx="55" cy="15" r="7" />
      <path d="M51 25c6 0 10 4 11 10l2 15" />
      <path d="M50 34v18" />
      <path d="M39 48h28c10 0 17 8 17 18v16H45l-7-27c-1-4 0-7 1-7Z" />
      <path d="M83 63l8-36c1-4-1-7-5-8l-5-1-10 37" />
      <path d="M36 57H12c-5 0-8 2-8 6s3 6 8 6h27" />
      <path d="M22 69h21" />
      <path d="M45 82h37" />
    </svg>
  );
}

export default function ProgressiveMuscleRelaxation() {
  const [currentGroup, setCurrentGroup] = useState(0);
  const [phase, setPhase] = useState<Phase>("ready");
  const [timeRemaining, setTimeRemaining] = useState(0);
  const [isActive, setIsActive] = useState(false);
  const [completedGroups, setCompletedGroups] = useState<number[]>([]);

  const currentMuscleGroup = MUSCLE_GROUPS[currentGroup];

  const startTensePhase = useCallback(() => {
    setPhase("tense");
    setTimeRemaining(currentMuscleGroup.tenseDuration);
    setIsActive(true);
  }, [currentMuscleGroup]);

  const startRelaxPhase = useCallback(() => {
    setPhase("relax");
    setTimeRemaining(currentMuscleGroup.relaxDuration);
  }, [currentMuscleGroup]);

  const nextGroup = useCallback(() => {
    setCompletedGroups((prev) => [...prev, currentGroup]);
    if (currentGroup < MUSCLE_GROUPS.length - 1) {
      setCurrentGroup(currentGroup + 1);
      setPhase("ready");
      setIsActive(false);
      setTimeRemaining(0);
    } else {
      setPhase("complete");
      setIsActive(false);
    }
  }, [currentGroup]);

  const reset = useCallback(() => {
    setCurrentGroup(0);
    setPhase("ready");
    setTimeRemaining(0);
    setIsActive(false);
    setCompletedGroups([]);
  }, []);

  useEffect(() => {
    let interval: NodeJS.Timeout | null = null;

    if (isActive && timeRemaining > 0) {
      interval = setInterval(() => {
        setTimeRemaining((time) => {
          if (time <= 100) {
            if (phase === "tense") {
              startRelaxPhase();
              return currentMuscleGroup.relaxDuration;
            } else if (phase === "relax") {
              nextGroup();
              return 0;
            }
            return 0;
          }
          return time - 100;
        });
      }, 100);
    }

    return () => {
      if (interval) clearInterval(interval);
    };
  }, [
    isActive,
    timeRemaining,
    phase,
    startRelaxPhase,
    nextGroup,
    currentMuscleGroup,
  ]);

  if (phase === "complete") {
    return (
      <div className="mx-auto max-w-4xl text-center">
        <h1 className="tool-page-title mb-3">Progressive Muscle Relaxation</h1>
        <Card className="mx-auto max-w-md rounded-[1.25rem]">
          <CardContent className="text-center py-8">
            <div className="w-16 h-16 bg-[#eef0f3] rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-2xl">✨</span>
            </div>
            <h2 className="text-2xl font-semibold mb-2">All done</h2>
            <p className="mb-6">
              Take a quiet moment to notice how your body feels now.
            </p>
            <Button onClick={reset} variant="grounding" size="lg">
              Start Again
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (phase === "ready") {
    return (
      <div className="mx-auto max-w-4xl text-center">
        <h1 className="tool-page-title mb-3">Progressive Muscle Relaxation</h1>

        <Card className="mx-auto max-w-md rounded-[1.25rem] border-0 px-7 py-8 shadow-sm">
          <CardContent className="space-y-6 p-0">
            <ReclinerSetupIcon />

            <p className="tool-body-text mx-auto max-w-sm text-left">
              Get in a comfortable position, either seated in a chair or lying
              down.
            </p>

            <div className="tool-aside-text mx-auto max-w-sm rounded-lg border border-[#dde1e7] bg-[#f8f8fa] p-4 text-left">
              <strong>How it works:</strong> Tense each muscle group for 5
              seconds, then relax for 10 seconds. Pay attention to the contrast
              between tension and relaxation.
            </div>

            <Button
              onClick={startTensePhase}
              variant="grounding"
              size="lg"
              className="tool-action-text h-auto w-full max-w-sm px-6 py-4 font-medium text-white"
            >
              I&rsquo;m ready to begin
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-4xl text-center">
      <h1 className="tool-page-title mb-3">Progressive Muscle Relaxation</h1>
      <Card className="mx-auto max-w-md rounded-[1.25rem]">
        <CardContent className="space-y-6 px-5 py-8 sm:px-7">
          {/* Progress */}
          <div className="flex items-center justify-between text-sm">
            <span>
              Muscle Group {currentGroup + 1} of {MUSCLE_GROUPS.length}
            </span>
            <span>{completedGroups.length} completed</span>
          </div>

          <div className="w-full bg-[#e1e5ea] rounded-full h-2">
            <div
              className="bg-[#707e9b] h-2 rounded-full transition-all duration-300"
              style={{
                width: `${(completedGroups.length / MUSCLE_GROUPS.length) * 100}%`,
              }}
            />
          </div>

          {/* Current Muscle Group */}
          <div className="text-center">
            <h2 className="text-2xl font-semibold mb-2">
              {currentMuscleGroup.name}
            </h2>
            <p className="mb-4">{currentMuscleGroup.instruction}</p>
          </div>

          {/* Phase Display */}
          <div className="bg-[#eef0f3] rounded-xl p-4 text-center">
            {phase === "tense" && (
              <>
                <p className="font-bold text-lg mb-2">Tense</p>
                <p className="text-sm mb-2">{currentMuscleGroup.instruction}</p>
                <div className="text-2xl font-bold">
                  {Math.ceil(timeRemaining / 1000)}
                </div>
              </>
            )}

            {phase === "relax" && (
              <>
                <p className="font-bold text-lg mb-2">Relax</p>
                <p className="text-sm mb-2">
                  Let go gently. Notice the difference as your body softens.
                </p>
                <div className="text-2xl font-bold">
                  {Math.ceil(timeRemaining / 1000)}
                </div>
              </>
            )}
          </div>

          {/* Instructions */}
          <div className="tool-aside-text text-center bg-[#eef0f3] p-3 rounded-xl">
            <p className="font-medium mb-1">How it works:</p>
            <p>
              Tense each muscle group for 5 seconds, then relax for 10 seconds.
              Pay attention to the contrast between tension and relaxation.
            </p>
          </div>

          {/* Controls */}
          <div className="flex justify-center space-x-3">
            {(phase === "tense" || phase === "relax") && (
              <Button
                onClick={() => setIsActive(!isActive)}
                variant={isActive ? "outline" : "grounding"}
                size="lg"
                className="flex items-center space-x-2"
              >
                {isActive ? <Pause size={20} /> : <Play size={20} />}
                <span>{isActive ? "Pause" : "Resume"}</span>
              </Button>
            )}

            <Button
              onClick={reset}
              variant="outline"
              size="lg"
              className="flex items-center space-x-2"
              aria-label="Reset exercise"
            >
              <RotateCcw size={20} />
              <span>Reset</span>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
