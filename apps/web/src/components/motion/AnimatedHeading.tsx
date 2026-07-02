"use client";

import { m } from "framer-motion";
import { type ReactNode } from "react";

import { slideUp } from "@/lib/motion";

export function AnimatedHeading({ 
  children, 
  className,
  as: Component = 'h2' 
}: { 
  children: ReactNode; 
  className?: string;
  as?: 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6';
}): JSX.Element {
  const MotionComponent = m[Component];
  
  return (
    <MotionComponent
      variants={slideUp}
      initial="initial"
      whileInView="animate"
      viewport={{ once: true, margin: "-50px" }}
      className={className}
    >
      {children}
    </MotionComponent>
  );
}
