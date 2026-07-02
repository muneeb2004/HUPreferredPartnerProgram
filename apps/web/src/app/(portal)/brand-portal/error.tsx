"use client";

import { Button } from "@hu-partner/ui";
import { AlertCircle } from "lucide-react";

export default function PortalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}): React.JSX.Element {
  return (
    <div className="flex h-[50vh] w-full flex-col items-center justify-center gap-4">
      <div className="flex flex-col items-center gap-2 text-center">
        <AlertCircle className="h-10 w-10 text-destructive" />
        <h2 className="text-xl font-semibold">Something went wrong!</h2>
        <p className="text-sm text-muted-foreground max-w-[500px]">
          {error.message || "An unexpected error occurred while loading the portal."}
        </p>
      </div>
      <Button onClick={(): void => reset()} variant="outline">
        Try again
      </Button>
    </div>
  );
}
