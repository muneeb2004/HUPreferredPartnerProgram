"use client";

import { Button } from "@hu-partner/ui";
import { useEffect } from "react";

import type * as React from "react";

export default function ErrorBoundary({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}): React.JSX.Element {
  useEffect((): void => {
    // In production, log this to an error reporting service
    console.error("Route segment error:", error);
  }, [error]);

  return (
    <div className="flex flex-col items-center justify-center p-8 text-center min-h-[50vh]">
      <h2 className="text-2xl font-display font-semibold mb-4 text-foreground">Something went wrong</h2>
      <p className="text-muted-foreground mb-8 max-w-md">
        We encountered an unexpected error processing this section of the application.
      </p>
      <Button onClick={(): void => reset()}>Try again</Button>
    </div>
  );
}
