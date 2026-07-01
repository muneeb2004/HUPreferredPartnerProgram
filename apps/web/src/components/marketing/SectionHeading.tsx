import * as React from "react";

export function SectionHeading({ title, subtitle }: { title: string; subtitle?: string }) {
  return (
    <div className="flex flex-col gap-2 mb-12">
      <h2 className="font-display text-3xl md:text-4xl font-bold text-foreground">{title}</h2>
      {subtitle && <p className="text-lg text-muted-foreground">{subtitle}</p>}
    </div>
  );
}
