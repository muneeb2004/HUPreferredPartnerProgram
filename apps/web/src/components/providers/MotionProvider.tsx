"use client";

import { MotionConfig } from "framer-motion";

export function MotionProvider({ children }: { children: React.ReactNode }) {
  // reducedMotion="user" ensures all framer-motion animations respect user OS settings
  return <MotionConfig reducedMotion="user">{children}</MotionConfig>;
}
