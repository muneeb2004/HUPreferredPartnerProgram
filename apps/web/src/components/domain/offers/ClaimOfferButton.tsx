"use client";

import React from "react";
import { trackEvent } from "@/lib/analytics/analytics";

interface ClaimOfferButtonProps {
  offerId: string;
  className?: string;
}

export function ClaimOfferButton({ offerId, className }: ClaimOfferButtonProps) {
  const handleClaim = () => {
    trackEvent({
      eventType: 'OFFER_CLICK',
      entityId: offerId,
      entityType: 'OFFER',
    });
    
    // Add logic here to redirect or open claim modal
    console.log(`Claiming offer ${offerId}`);
  };

  return (
    <button 
      onClick={handleClaim}
      className={className || "px-6 py-3 bg-brand-primary text-white font-medium rounded-md focus-visible:outline-brand-primary focus-visible:ring-2 focus-visible:ring-brand-primary hover:bg-brand-primary/90 transition-colors"}
    >
      Claim Offer
    </button>
  );
}
