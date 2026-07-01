"use client";

import { MotionConfig, LazyMotion, domAnimation } from "framer-motion";

export function MotionProvider({ children }: { children: React.ReactNode }) {
  // reducedMotion="user" ensures all framer-motion animations respect user OS settings
  // LazyMotion with domAnimation strips out domMax features for a smaller bundle
  return (
    <LazyMotion features={domAnimation} strict>
      <MotionConfig reducedMotion="user">
        {children}
      </MotionConfig>
    </LazyMotion>
  );
}
