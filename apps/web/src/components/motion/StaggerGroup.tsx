"use client";

import { m } from "framer-motion";
import { type ReactNode } from "react";

import { staggerContainer } from "@/lib/motion";

export function StaggerGroup({ children, className }: { children: ReactNode; className?: string }): JSX.Element {
  return (
    <m.div
      variants={staggerContainer}
      initial="initial"
      whileInView="animate"
      viewport={{ once: true, margin: "-50px" }}
      className={className}
    >
      {children}
    </m.div>
  );
}
