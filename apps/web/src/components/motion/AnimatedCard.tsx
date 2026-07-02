"use client";

import { m } from "framer-motion";
import { type ReactNode } from "react";

import { slideUp } from "@/lib/motion";

export function AnimatedCard({ children, className }: { children: ReactNode; className?: string }): JSX.Element {
  return (
    <m.div
      variants={slideUp}
      initial="initial"
      whileInView="animate"
      whileHover={{ y: -5, transition: { duration: 0.2, ease: "easeOut" } }}
      viewport={{ once: true, margin: "-50px" }}
      className={className}
    >
      {children}
    </m.div>
  );
}
