"use client";

import { Button, type ButtonProps } from "@hu-partner/ui";
import { m } from "framer-motion";
import { type ReactNode } from "react";

export function AnimatedButton({ children, ...props }: ButtonProps & { children: ReactNode }): JSX.Element {
  return (
    <m.div
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      transition={{ duration: 0.15, ease: "easeOut" }}
      className="inline-block"
    >
      <Button {...props}>
        {children}
      </Button>
    </m.div>
  );
}
