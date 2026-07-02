import { type Metadata } from "next";

import { OfferGrid } from "@/components/domain/offers/OfferGrid";
import { SectionHeading } from "@/components/marketing/SectionHeading";

export const metadata: Metadata = {
  title: 'Offers | HU Preferred Partner',
  description: 'Browse active offers from our partners.',
};

export default function OffersPage() {
  return (
    <>
      <SectionHeading 
        title="Active Offers" 
        subtitle="Current discounts and opportunities available to you." 
      />
      {/* Filtering UI placeholder (Phase 5) */}
      <div className="mb-8 p-4 border border-border rounded-lg bg-surface-card/50 text-sm text-muted-foreground italic">
        Offer Filters Placeholder
      </div>
      <OfferGrid offers={[]} />
    </>
  );
}
