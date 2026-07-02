import * as React from "react";

import { OfferCard } from "@/components/domain/offers/OfferCard";
import { EmptyState } from "@/components/marketing/EmptyState";

interface PartnerOffersListProps {
  offers: Array<{ id: string; title: string; partnerName: string; expirationDate: string }>;
}

export function PartnerOffersList({ offers }: PartnerOffersListProps): React.JSX.Element {
  if (!offers || offers.length === 0) {
    return <EmptyState title="No active offers" description="This partner does not have any active offers at the moment." />;
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      {offers.map((offer): React.JSX.Element => (
        <OfferCard 
          key={offer.id} 
          id={offer.id} 
          title={offer.title} 
          partnerName={offer.partnerName} 
          expirationDate={offer.expirationDate} 
        />
      ))}
    </div>
  );
}
