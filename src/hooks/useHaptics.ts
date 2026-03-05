"use client";

import { useCallback, useEffect, useRef } from "react";

type HapticPreset = "success" | "nudge" | "error" | "buzz";
type HapticInput = HapticPreset | number | number[];

interface HapticsInstance {
  trigger(input: HapticInput): Promise<void>;
  cancel(): void;
  destroy(): void;
}

let instance: HapticsInstance | null = null;
let instancePromise: Promise<HapticsInstance> | null = null;

function getInstance(): Promise<HapticsInstance> {
  if (instance) return Promise.resolve(instance);
  if (instancePromise) return instancePromise;

  instancePromise = import("web-haptics").then(({ WebHaptics }) => {
    instance = new WebHaptics() as HapticsInstance;
    return instance;
  });
  return instancePromise;
}

export function useHaptics() {
  const mounted = useRef(true);

  useEffect(() => {
    mounted.current = true;
    return () => {
      mounted.current = false;
    };
  }, []);

  const trigger = useCallback(async (input: HapticInput = "nudge") => {
    try {
      const h = await getInstance();
      if (mounted.current) h.trigger(input);
    } catch {
      // Silently fail — haptics are a progressive enhancement
    }
  }, []);

  return { trigger };
}
