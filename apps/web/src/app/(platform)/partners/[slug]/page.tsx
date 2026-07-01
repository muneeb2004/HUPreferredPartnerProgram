import { PartnerHero } from "@/components/domain/partners/PartnerHero";
import { PartnerOffersList } from "@/components/domain/partners/PartnerOffersList";
import { Metadata } from "next";

export const revalidate = 3600; // ISR 1 hour

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  return {
    title: `${slug} | HU Preferred Partner`,
  };
}

export default async function PartnerDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  
  return (
    <>
      <PartnerHero 
        name={`Partner Name Placeholder (${slug})`} 
        description="Partner description placeholder. This content will be populated via the CMS in Phase 8."
      />
      
      <section className="mt-12">
        <h2 className="font-display text-2xl font-bold mb-6 text-foreground">Active Offers</h2>
        <PartnerOffersList offers={[]} />
      </section>
      
      <section className="mt-16 pt-16 border-t border-border">
        <h2 className="font-display text-2xl font-bold mb-6 text-foreground">About the Brand</h2>
        <div className="prose prose-neutral dark:prose-invert max-w-none">
          <p className="text-muted-foreground italic">CMS Rich Text Content Placeholder.</p>
        </div>
      </section>
    </>
  );
}
