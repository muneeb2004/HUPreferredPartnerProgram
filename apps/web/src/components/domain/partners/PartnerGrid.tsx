import * as React from "react";

import { EmptyState } from "@/components/marketing/EmptyState";

import { PartnerCard } from "./PartnerCard";

interface PartnerGridProps {
  partners: Array<{ id: string; slug: string; name: string; description: string }>;
}

export function PartnerGrid({ partners }: PartnerGridProps) {
  if (!partners || partners.length === 0) {
    return <EmptyState title="No partners found" description="We couldn't find any partners matching your criteria." />;
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {partners.map((p) => (
        <PartnerCard key={p.id} slug={p.slug} name={p.name} description={p.description} />
      ))}
    </div>
  );
}
