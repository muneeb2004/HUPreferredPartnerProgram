"use client";

import { m } from "framer-motion";
import { fadeIn } from "@/lib/motion";
import { ReactNode } from "react";

export function FadeIn({ children, className }: { children: ReactNode; className?: string }) {
  return (
    <m.div
      variants={fadeIn}
      initial="initial"
      whileInView="animate"
      viewport={{ once: true, margin: "-100px" }}
      exit="exit"
      className={className}
    >
      {children}
    </m.div>
  );
}
