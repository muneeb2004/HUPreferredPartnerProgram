import * as React from "react";

import { EmptyState } from "@/components/marketing/EmptyState";

import { OfferCard } from "./OfferCard";

interface OfferGridProps {
  offers: Array<{ id: string; title: string; partnerName: string; expirationDate: string }>;
}

export function OfferGrid({ offers }: OfferGridProps): React.JSX.Element {
  if (!offers || offers.length === 0) {
    return <EmptyState title="No offers found" description="We couldn't find any offers matching your criteria." />;
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {offers.map((o): React.JSX.Element => (
        <OfferCard key={o.id} id={o.id} title={o.title} partnerName={o.partnerName} expirationDate={o.expirationDate} />
      ))}
    </div>
  );
}
