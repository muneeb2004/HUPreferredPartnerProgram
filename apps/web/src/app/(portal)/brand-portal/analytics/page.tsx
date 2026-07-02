import type * as React from "react";

export default function PortalAnalyticsPage(): React.JSX.Element {
  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-display font-bold">Analytics</h1>
      <div className="p-6 bg-surface-card rounded-lg border border-border">
        <p className="text-muted-foreground">View your offer performance and analytics here.</p>
      </div>
    </div>
  );
}
