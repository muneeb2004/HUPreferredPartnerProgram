"use client";

import { m } from "framer-motion";
import { staggerContainer } from "@/lib/motion";
import { ReactNode } from "react";

export function StaggerGroup({ children, className }: { children: ReactNode; className?: string }) {
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
