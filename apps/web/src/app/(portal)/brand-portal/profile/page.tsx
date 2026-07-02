import type * as React from "react";

export default function PortalProfilePage(): React.JSX.Element {
  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-display font-bold">Company Profile</h1>
      <div className="p-6 bg-surface-card rounded-lg border border-border">
        <p className="text-muted-foreground">Manage your company profile details here.</p>
      </div>
    </div>
  );
}
