import { Skeleton } from "@hu-partner/ui";

import type * as React from "react";

export default function GlobalLoading(): React.JSX.Element {
  return (
    <div className="w-full flex-1 flex flex-col animate-in fade-in duration-500">
      <div className="container mx-auto px-4 md:px-8 lg:px-12 py-12 w-full space-y-8 max-w-7xl">
        <Skeleton className="h-12 w-[250px] bg-muted/50" />
        <div className="space-y-4">
          <Skeleton className="h-4 w-full bg-muted/50" />
          <Skeleton className="h-4 w-[90%] bg-muted/50" />
          <Skeleton className="h-4 w-[80%] bg-muted/50" />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-8">
          <Skeleton className="h-[200px] w-full bg-muted/50" />
          <Skeleton className="h-[200px] w-full bg-muted/50" />
          <Skeleton className="h-[200px] w-full bg-muted/50" />
        </div>
      </div>
    </div>
  );
}
