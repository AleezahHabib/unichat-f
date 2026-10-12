"use client";

import { useReducedMotion, type HTMLMotionProps } from "motion/react";

export const VIEWPORT_CONFIG = {
  once: true,
  margin: "-60px",
} as const;

export function useRevealMotion() {
  const shouldReduceMotion = useReducedMotion();

  const headingProps: HTMLMotionProps<"div"> = shouldReduceMotion
    ? { initial: false }
    : {
        initial: { opacity: 0, y: 20 },
        whileInView: { opacity: 1, y: 0 },
        viewport: VIEWPORT_CONFIG,
        transition: { duration: 0.45, ease: "easeOut" },
      };

  const singleFadeProps: HTMLMotionProps<"div"> = shouldReduceMotion
    ? { initial: false }
    : {
        initial: { opacity: 0 },
        whileInView: { opacity: 1 },
        viewport: VIEWPORT_CONFIG,
        transition: { duration: 0.45, ease: "easeOut" },
      };

  return {
    shouldReduceMotion,
    headingProps,
    singleFadeProps,
  };
}
