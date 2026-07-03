import { type Metadata } from "next";

import { OfferDetailHeader } from "@/components/domain/offers/OfferDetailHeader";
import { OfferAnalyticsTracker } from "@/components/domain/offers/OfferAnalyticsTracker";
import { ClaimOfferButton } from "@/components/domain/offers/ClaimOfferButton";

import type * as React from "react";

export const revalidate = 3600; // ISR 1 hour

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }): Promise<Metadata> {
  const { id } = await params;
  return {
    title: `Offer ${id} | HU Preferred Partner`,
  };
}

export default async function OfferDetailPage({ params }: { params: Promise<{ id: string }> }): Promise<React.JSX.Element> {
  const { id } = await params;
  
  return (
    <>
      <OfferAnalyticsTracker offerId={id} />
      <OfferDetailHeader 
        title={`Offer Title Placeholder (${id})`}
        partnerName="Partner Name Placeholder"
        partnerSlug="partner-slug"
        expirationDate="YYYY-MM-DD"
      />
      
      <section className="prose prose-neutral dark:prose-invert max-w-3xl">
        <p className="text-muted-foreground italic">CMS Offer Description Placeholder.</p>
      </section>
      
      <div className="mt-12 p-6 border border-border rounded-xl bg-surface-card max-w-3xl">
        <h3 className="font-display text-xl font-bold mb-4">How to claim</h3>
        <p className="text-muted-foreground italic mb-6">CMS Redemption Instructions Placeholder.</p>
        <ClaimOfferButton offerId={id} />
      </div>
    </>
  );
}
