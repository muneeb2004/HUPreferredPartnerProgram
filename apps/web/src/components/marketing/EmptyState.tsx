import * as React from "react";

export function EmptyState({ title, description }: { title: string; description: string }): React.JSX.Element {
  return (
    <div className="w-full py-24 flex flex-col items-center justify-center text-center border-2 border-dashed border-border rounded-lg bg-surface-card/50">
      <h3 className="font-display text-xl font-semibold text-foreground mb-2">{title}</h3>
      <p className="text-muted-foreground max-w-md">{description}</p>
    </div>
  );
}
