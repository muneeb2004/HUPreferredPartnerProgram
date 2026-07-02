import { type Metadata } from "next";

import { PartnerGrid } from "@/components/domain/partners/PartnerGrid";
import { HeroEditorial } from "@/components/marketing/HeroEditorial";
import { SectionHeading } from "@/components/marketing/SectionHeading";

import type * as React from "react";

export const metadata: Metadata = {
  title: 'Home | HU Preferred Partner',
  description: 'Connecting students with exclusive brand partnerships.',
};

export default function HomePage(): React.JSX.Element {
  return (
    <>
      <HeroEditorial 
        headline="Exclusive Partnerships for Habib Students"
        subheadline="Access curated offers, discounts, and opportunities from top brands directly through your university portal."
      />
      <section className="container mx-auto max-w-7xl px-4 md:px-8 lg:px-12 py-24">
        <SectionHeading 
          title="Featured Partners" 
          subtitle="Discover brands offering exclusive benefits to the HU community." 
        />
        {/* Phase 8: Data fetching placeholder */}
        <PartnerGrid partners={[]} />
      </section>
    </>
  );
}
