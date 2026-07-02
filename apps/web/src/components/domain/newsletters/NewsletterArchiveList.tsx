import * as React from "react";

import { EmptyState } from "@/components/marketing/EmptyState";

import { NewsletterCard } from "./NewsletterCard";

interface NewsletterArchiveListProps {
  newsletters: Array<{ id: string; slug: string; title: string; date: string; excerpt: string }>;
}

export function NewsletterArchiveList({ newsletters }: NewsletterArchiveListProps): JSX.Element {
  if (!newsletters || newsletters.length === 0) {
    return <EmptyState title="No newsletters found" description="There are no past issues to display right now." />;
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {newsletters.map((n): JSX.Element => (
        <NewsletterCard key={n.id} slug={n.slug} title={n.title} date={n.date} excerpt={n.excerpt} />
      ))}
    </div>
  );
}
