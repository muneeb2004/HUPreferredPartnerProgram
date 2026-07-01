import { HeroEditorial } from "@/components/marketing/HeroEditorial";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: 'Contact | HU Preferred Partner',
};

export default function ContactPage() {
  return (
    <>
      <HeroEditorial 
        headline="Get in Touch"
        subheadline="Have a question or interested in becoming a partner?"
      />
      <div className="container mx-auto max-w-3xl px-4 py-12 mb-24">
        <div className="border border-border rounded-xl p-8 bg-surface-card text-center text-muted-foreground italic">
          Contact Form Placeholder (CMS/Integration in future phases)
        </div>
      </div>
    </>
  );
}
