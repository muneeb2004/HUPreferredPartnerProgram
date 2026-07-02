"use client";

import * as React from "react";

export function PDFViewerClient({ url }: { url: string }): React.JSX.Element {
  // In a real implementation (Phase 7), this might use react-pdf or a robust iframe solution
  return (
    <div className="w-full aspect-[3/4] md:aspect-auto md:h-[800px] border border-border rounded-lg overflow-hidden bg-muted flex flex-col items-center justify-center">
      <p className="text-muted-foreground mb-4 italic">PDF Viewer Client Placeholder</p>
      <a href={url} target="_blank" rel="noreferrer" className="text-sm font-medium text-brand-primary hover:underline focus-visible:outline-brand-primary rounded-sm focus-visible:ring-2 focus-visible:ring-brand-primary">
        Download PDF directly
      </a>
    </div>
  );
}
