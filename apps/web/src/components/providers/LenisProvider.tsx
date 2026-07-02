"use client";

import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Lenis from "lenis";
import { useEffect } from "react";

export function LenisProvider({ children }: { children: React.ReactNode }): JSX.Element {
  useEffect((): (() => void) | undefined => {
    const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (prefersReducedMotion) {
      return; // Do not initialize Lenis if user prefers reduced motion
    }

    const lenis = new Lenis({
      duration: 1.2,
      easing: (t): number => Math.min(1, 1.001 - Math.pow(2, -10 * t)), 
      orientation: "vertical",
      gestureOrientation: "vertical",
      smoothWheel: true,
      touchMultiplier: 2,
    });

    // Synchronize Lenis scrolling with GSAP's ScrollTrigger
    lenis.on('scroll', (): void => { ScrollTrigger.update(); });

    // Sync GSAP ticker with Lenis requestAnimationFrame
    gsap.ticker.add((time): void => {
      lenis.raf(time * 1000);
    });

    // Disable GSAP's lag smoothing to prevent jitter when syncing with Lenis
    gsap.ticker.lagSmoothing(0);

    return (): void => {
      lenis.destroy();
      gsap.ticker.remove((time): void => {
        lenis.raf(time * 1000);
      });
    };
  }, []);

  return <>{children}</>;
}
