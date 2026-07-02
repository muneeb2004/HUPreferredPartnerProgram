import { type Metadata } from "next";

import { PartnerGrid } from "@/components/domain/partners/PartnerGrid";
import { SectionHeading } from "@/components/marketing/SectionHeading";

import type * as React from "react";

export const metadata: Metadata = {
  title: 'Partners | HU Preferred Partner',
  description: 'Browse our exclusive brand partners.',
};

export default function PartnersPage(): React.JSX.Element {
  return (
    <>
      <SectionHeading 
        title="Our Partners" 
        subtitle="Discover brands offering exclusive benefits to the HU community." 
      />
      {/* Filtering UI placeholder (Phase 5) */}
      <div className="mb-8 p-4 border border-border rounded-lg bg-surface-card/50 text-sm text-muted-foreground italic">
        Partner Filters Placeholder (Categories, Search)
      </div>
      <PartnerGrid partners={[]} />
    </>
  );
}
