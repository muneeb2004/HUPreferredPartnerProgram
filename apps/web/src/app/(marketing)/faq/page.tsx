import { type Metadata } from "next";

import { EmptyState } from "@/components/marketing/EmptyState";
import { HeroEditorial } from "@/components/marketing/HeroEditorial";

import type * as React from "react";

export const metadata: Metadata = {
  title: 'FAQ | HU Preferred Partner',
};

export default function FAQPage(): React.JSX.Element {
  return (
    <>
      <HeroEditorial 
        headline="Frequently Asked Questions"
      />
      <div className="container mx-auto max-w-3xl px-4 py-12 mb-24">
        <EmptyState title="No FAQs available" description="We are currently updating our knowledge base." />
      </div>
    </>
  );
}
