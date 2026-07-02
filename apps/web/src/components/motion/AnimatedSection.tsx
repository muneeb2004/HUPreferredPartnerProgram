"use client";

import { m } from "framer-motion";
import { type ReactNode } from "react";

import { fadeIn } from "@/lib/motion";


export function AnimatedSection({ children, className, id }: { children: ReactNode; className?: string; id?: string }): React.JSX.Element {
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
