"use client";

import { m } from "framer-motion";
import { fadeIn } from "@/lib/motion";
import Image, { ImageProps } from "next/image";

export function AnimatedImage(props: ImageProps) {
  return (
    <m.div
      variants={fadeIn}
      initial="initial"
      whileInView="animate"
      viewport={{ once: true, margin: "-100px" }}
      className={props.className}
      style={{ overflow: "hidden" }}
    >
      <m.div whileHover={{ scale: 1.05 }} transition={{ duration: 0.6, ease: [0.33, 1, 0.68, 1] }}>
        <Image {...props} className="w-full h-full object-cover" />
      </m.div>
    </m.div>
  );
}
