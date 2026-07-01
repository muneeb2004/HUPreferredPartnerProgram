import * as React from "react";
import { NewsletterCard } from "./NewsletterCard";
import { EmptyState } from "@/components/marketing/EmptyState";

interface NewsletterArchiveListProps {
  newsletters: Array<{ id: string; slug: string; title: string; date: string; excerpt: string }>;
}

export function NewsletterArchiveList({ newsletters }: NewsletterArchiveListProps) {
  if (!newsletters || newsletters.length === 0) {
    return <EmptyState title="No newsletters found" description="There are no past issues to display right now." />;
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {newsletters.map((n) => (
        <NewsletterCard key={n.id} slug={n.slug} title={n.title} date={n.date} excerpt={n.excerpt} />
      ))}
    </div>
  );
}
