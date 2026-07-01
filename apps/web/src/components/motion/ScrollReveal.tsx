"use client";

import { useRef } from "react";
import { useGSAP } from "@gsap/react";
import { createScrollReveal } from "@/lib/gsap-utils";

export function ScrollReveal({ children, className }: { children: React.ReactNode; className?: string }) {
  const container = useRef<HTMLDivElement>(null);

  useGSAP(() => {
    if (container.current) {
      // Respect user motion preferences
      const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
      if (!prefersReducedMotion) {
        createScrollReveal(container.current);
      }
    }
  }, { scope: container });

  return (
    <div ref={container} className={className}>
      {children}
    </div>
  );
}
