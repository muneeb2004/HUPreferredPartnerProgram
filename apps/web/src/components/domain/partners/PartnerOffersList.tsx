import * as React from "react";
import { EmptyState } from "@/components/marketing/EmptyState";
import { OfferCard } from "@/components/domain/offers/OfferCard";

interface PartnerOffersListProps {
  offers: Array<{ id: string; title: string; partnerName: string; expirationDate: string }>;
}

export function PartnerOffersList({ offers }: PartnerOffersListProps) {
  if (!offers || offers.length === 0) {
    return <EmptyState title="No active offers" description="This partner does not have any active offers at the moment." />;
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      {offers.map((offer) => (
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
