import * as React from "react";

export function PartnerHero({ name, description }: { name: string; description: string }): JSX.Element {
  return (
    <header className="w-full py-16 border-b border-border mb-12">
      <div className="flex items-center gap-6 mb-8">
        <div className="w-24 h-24 rounded-lg bg-muted flex items-center justify-center shrink-0">
          <span className="font-display font-bold text-3xl text-muted-foreground">{name.charAt(0)}</span>
        </div>
        <h1 className="font-display text-4xl md:text-5xl font-bold text-foreground">{name}</h1>
      </div>
      <p className="text-lg text-muted-foreground max-w-3xl leading-relaxed">{description}</p>
    </header>
  );
}
