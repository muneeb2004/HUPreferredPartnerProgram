"use client";

import { Canvas } from "@react-three/fiber";
import { Suspense, ReactNode } from "react";

interface ThreeProviderProps {
  children: ReactNode;
}

export function ThreeProvider({ children }: ThreeProviderProps) {
  return (
    <div className="absolute inset-0 z-base -z-10 w-full h-full pointer-events-none">
      <Canvas
        camera={{ position: [0, 0, 5], fov: 45 }}
        dpr={[1, 2]}
        gl={{ antialias: true, alpha: true, powerPreference: "high-performance" }}
      >
        <Suspense fallback={null}>
          {children}
        </Suspense>
      </Canvas>
    </div>
  );
}
