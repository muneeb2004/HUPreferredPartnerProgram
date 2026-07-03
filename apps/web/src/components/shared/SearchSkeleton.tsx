import React from "react";
import { Skeleton } from "@hu-partner/ui";

export function SearchSkeleton() {
  return (
    <div className="flex flex-col gap-3">
      {Array.from({ length: 4 }).map((_, i) => (
        <div key={i} className="flex flex-col gap-2 p-3 rounded-lg border border-border/50">
          <div className="flex items-center gap-2">
            <Skeleton className="w-4 h-4 rounded-full" />
            <Skeleton className="h-4 w-1/3" />
          </div>
          <Skeleton className="h-3 w-full mt-1" />
          <Skeleton className="h-3 w-4/5" />
          <div className="flex items-center gap-2 mt-2">
            <Skeleton className="h-4 w-12" />
            <Skeleton className="h-4 w-10" />
          </div>
        </div>
      ))}
    </div>
  );
}
