"use client";

import { m } from "framer-motion";
import { slideUp } from "@/lib/motion";
import { ReactNode } from "react";

export function Reveal({ children, className }: { children: ReactNode; className?: string }) {
  return (
    <m.div
      variants={slideUp}
      initial="initial"
      whileInView="animate"
      viewport={{ once: true, margin: "-50px" }}
      exit="exit"
      className={className}
    >
      {children}
    </m.div>
  );
}
