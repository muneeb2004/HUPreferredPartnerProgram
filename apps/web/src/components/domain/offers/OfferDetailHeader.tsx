import Link from "next/link";
import * as React from "react";

import { OfferExpirationBadge } from "./OfferExpirationBadge";

interface OfferDetailHeaderProps {
  title: string;
  partnerName: string;
  partnerSlug: string;
  expirationDate: string;
}

export function OfferDetailHeader({ title, partnerName, partnerSlug, expirationDate }: OfferDetailHeaderProps): JSX.Element {
  return (
    <header className="w-full py-12 border-b border-border mb-12">
      <Link href={`/partners/${partnerSlug}`} className="inline-block text-sm font-medium text-brand-primary hover:underline mb-4 focus-visible:outline-brand-primary rounded-sm focus-visible:ring-2 focus-visible:ring-brand-primary">
        {partnerName}
      </Link>
      <h1 className="font-display text-3xl md:text-5xl font-bold text-foreground mb-6">{title}</h1>
      <OfferExpirationBadge date={expirationDate} />
    </header>
  );
}
