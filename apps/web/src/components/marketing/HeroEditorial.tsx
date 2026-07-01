import * as React from "react";

interface HeroEditorialProps {
  headline: string;
  subheadline?: string;
  children?: React.ReactNode;
}

export function HeroEditorial({ headline, subheadline, children }: HeroEditorialProps) {
  return (
    <section className="w-full py-24 md:py-32 flex flex-col items-center text-center px-4">
      <h1 className="font-display text-4xl md:text-6xl lg:text-7xl font-bold tracking-tight max-w-4xl text-foreground">
        {headline}
      </h1>
      {subheadline && (
        <p className="mt-6 text-lg md:text-xl text-muted-foreground max-w-2xl leading-relaxed">
          {subheadline}
        </p>
      )}
      {children && <div className="mt-10 flex gap-4">{children}</div>}
    </section>
  );
}
