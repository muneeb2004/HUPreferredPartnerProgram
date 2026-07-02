"use client";

import { m } from "framer-motion";
import { type ReactNode } from "react";

import { fadeIn } from "@/lib/motion";


export function FadeIn({ children, className }: { children: ReactNode; className?: string }): React.JSX.Element {
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
