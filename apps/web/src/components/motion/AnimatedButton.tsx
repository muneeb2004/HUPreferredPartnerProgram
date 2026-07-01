"use client";

import { m } from "framer-motion";
import { ReactNode } from "react";
import { Button, ButtonProps } from "@/components/ui/button";

export function AnimatedButton({ children, ...props }: ButtonProps & { children: ReactNode }) {
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
