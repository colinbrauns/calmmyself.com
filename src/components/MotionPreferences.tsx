"use client";

import {
  createContext,
  type ReactNode,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import { MotionConfig } from "framer-motion";

const STORAGE_KEY = "calmmyself:animations-enabled";

interface MotionPreferencesContextValue {
  animationsEnabled: boolean;
  setAnimationsEnabled: (enabled: boolean) => void;
  toggleAnimations: () => void;
  isReady: boolean;
}

const MotionPreferencesContext =
  createContext<MotionPreferencesContextValue | null>(null);

function getInitialPreference() {
  if (typeof window === "undefined") return true;

  try {
    const saved = window.localStorage.getItem(STORAGE_KEY);
    if (saved === "true") return true;
    if (saved === "false") return false;
  } catch {
    // Fall back to the system preference when storage is unavailable.
  }

  const reducedMotionQuery = window.matchMedia?.(
    "(prefers-reduced-motion: reduce)",
  );
  return reducedMotionQuery ? !reducedMotionQuery.matches : true;
}

export function MotionPreferencesProvider({
  children,
}: {
  children: ReactNode;
}) {
  const [animationsEnabled, setAnimationsEnabledState] =
    useState(getInitialPreference);
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    setIsReady(true);
  }, []);

  useEffect(() => {
    const root = document.documentElement;
    root.classList.toggle("allow-animations", animationsEnabled);

    try {
      window.localStorage.setItem(STORAGE_KEY, String(animationsEnabled));
    } catch {
      // The root class remains the source of truth for this session.
    }
  }, [animationsEnabled]);

  const value = useMemo(
    () => ({
      animationsEnabled,
      setAnimationsEnabled: setAnimationsEnabledState,
      toggleAnimations: () => setAnimationsEnabledState((enabled) => !enabled),
      isReady,
    }),
    [animationsEnabled, isReady],
  );

  return (
    <MotionPreferencesContext.Provider value={value}>
      <MotionConfig reducedMotion={animationsEnabled ? "never" : "always"}>
        {children}
      </MotionConfig>
    </MotionPreferencesContext.Provider>
  );
}

export function useMotionPreferences() {
  const context = useContext(MotionPreferencesContext);
  if (!context) {
    throw new Error(
      "useMotionPreferences must be used within MotionPreferencesProvider",
    );
  }

  return context;
}
