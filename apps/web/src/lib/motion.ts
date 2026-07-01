import type { Variants } from "framer-motion";

/**
 * Reusable Framer Motion configurations and easing curves
 * aligning with the Design System's motion tokens.
 */

export const easings = {
  // Snappy, energetic easing (standard UI interactions)
  fast: [0.4, 0, 0.2, 1],
  // Smooth, deliberate easing (page transitions, large elements)
  base: [0.4, 0, 0.2, 1],
  // Majestic, slow easing (hero elements, 3D reveals)
  slow: [0.4, 0, 0.2, 1],
  // Decelerated easing (entering elements)
  easeOut: [0, 0, 0.2, 1],
  // Accelerated easing (exiting elements)
  easeIn: [0.4, 0, 1, 1],
};

export const durations = {
  fast: 0.15,
  base: 0.25,
  slow: 0.35,
};

export const fadeIn: Variants = {
  initial: { opacity: 0 },
  animate: { opacity: 1, transition: { duration: durations.base, ease: easings.base } },
  exit: { opacity: 0, transition: { duration: durations.fast, ease: easings.fast } },
};

export const slideUp: Variants = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0, transition: { duration: durations.base, ease: easings.easeOut } },
  exit: { opacity: 0, y: -20, transition: { duration: durations.fast, ease: easings.easeIn } },
};

export const staggerContainer: Variants = {
  initial: {},
  animate: {
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.1,
    },
  },
};

export const modalTransition: Variants = {
  initial: { opacity: 0, scale: 0.95 },
  animate: { opacity: 1, scale: 1, transition: { duration: durations.base, ease: easings.easeOut } },
  exit: { opacity: 0, scale: 0.95, transition: { duration: durations.fast, ease: easings.easeIn } },
};
