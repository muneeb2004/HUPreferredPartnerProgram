"use client";

import { m } from "framer-motion";
import { fadeIn } from "@/lib/motion";
import { ReactNode } from "react";

export function AnimatedSection({ children, className, id }: { children: ReactNode; className?: string; id?: string }) {
  return (
    <m.section
      id={id}
      variants={fadeIn}
      initial="initial"
      whileInView="animate"
      viewport={{ once: true, margin: "-100px" }}
      className={className}
    >
      {children}
    </m.section>
  );
}
