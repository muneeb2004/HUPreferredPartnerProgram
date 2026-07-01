import { HeroEditorial } from "@/components/marketing/HeroEditorial";
import { EmptyState } from "@/components/marketing/EmptyState";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: 'FAQ | HU Preferred Partner',
};

export default function FAQPage() {
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
