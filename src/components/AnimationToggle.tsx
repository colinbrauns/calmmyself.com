"use client";

import { Button } from "@/components/ui/Button";
import { useMotionPreferences } from "@/components/MotionPreferences";

export default function AnimationToggle() {
  const { animationsEnabled, toggleAnimations, isReady } =
    useMotionPreferences();

  if (!isReady) return null;

  return (
    <Button
      onClick={toggleAnimations}
      variant="outline"
      size="sm"
      className="ml-2"
      aria-pressed={animationsEnabled}
    >
      {animationsEnabled ? "Animations: On" : "Animations: Off"}
    </Button>
  );
}
