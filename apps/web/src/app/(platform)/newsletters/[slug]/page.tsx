import { PDFViewerClient } from "@/components/domain/newsletters/PDFViewerClient";
import { Metadata } from "next";
import Link from "next/link";

export const revalidate = 3600; // ISR 1 hour

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  return {
    title: `Newsletter ${slug} | HU Preferred Partner`,
  };
}

export default async function NewsletterDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  
  return (
    <>
      <div className="mb-8">
        <Link href="/newsletters" className="text-sm font-medium text-brand-primary hover:underline focus-visible:outline-brand-primary rounded-sm focus-visible:ring-2 focus-visible:ring-brand-primary">&larr; Back to Archive</Link>
      </div>
      <header className="mb-8">
        <time className="text-sm font-medium text-muted-foreground mb-2 block">YYYY-MM-DD</time>
        <h1 className="font-display text-3xl md:text-4xl font-bold text-foreground">Newsletter Title Placeholder ({slug})</h1>
      </header>
      
      <PDFViewerClient url="/placeholder.pdf" />
    </>
  );
}
