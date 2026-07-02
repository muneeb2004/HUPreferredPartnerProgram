import * as React from "react";

interface Proposition {
  id: string;
  title: string;
  description: string;
}

export function ValuePropositionGrid({ items }: { items: Proposition[] }): React.JSX.Element {
  return (
    <section className="w-full py-24 bg-surface-card px-4 md:px-8 lg:px-12">
      <div className="container mx-auto max-w-7xl grid grid-cols-1 md:grid-cols-3 gap-12">
        {items.map((item): React.JSX.Element => (
          <div key={item.id} className="flex flex-col gap-4">
            <h3 className="font-display font-semibold text-2xl text-foreground">{item.title}</h3>
            <p className="text-muted-foreground leading-relaxed">{item.description}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
