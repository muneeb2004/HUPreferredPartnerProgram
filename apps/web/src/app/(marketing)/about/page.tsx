import { type Metadata } from "next";

import { HeroEditorial } from "@/components/marketing/HeroEditorial";
import { ValuePropositionGrid } from "@/components/marketing/ValuePropositionGrid";

export const metadata: Metadata = {
  title: 'About | HU Preferred Partner',
  description: 'Learn about the Habib University Preferred Partner platform.',
};

export default function AboutPage() {
  return (
    <>
      <HeroEditorial 
        headline="About the Program"
        subheadline="The Preferred Partner Program bridges the gap between industry leaders and the talented student body of Habib University."
      />
      <ValuePropositionGrid 
        items={[
          { id: "1", title: "For Students", description: "CMS Value Proposition Content Placeholder." },
          { id: "2", title: "For Brands", description: "CMS Value Proposition Content Placeholder." },
          { id: "3", title: "For the Community", description: "CMS Value Proposition Content Placeholder." }
        ]}
      />
    </>
  );
}
