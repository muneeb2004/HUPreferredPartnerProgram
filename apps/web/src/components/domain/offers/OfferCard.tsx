import Link from "next/link";
import { OfferExpirationBadge } from "./OfferExpirationBadge";

interface OfferCardProps {
  id: string;
  title: string;
  partnerName: string;
  expirationDate: string;
}

export function OfferCard({ id, title, partnerName, expirationDate }: OfferCardProps) {
  return (
    <Link href={`/offers/${id}`} className="group block focus-visible:outline-brand-primary rounded-xl focus-visible:ring-2 focus-visible:ring-brand-primary">
      <article className="p-6 rounded-xl border border-border bg-surface-card hover:border-foreground/20 transition-all hover:translate-y-[-2px] hover:shadow-elevation-md flex flex-col gap-4 h-full">
        <div>
          <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider mb-2">{partnerName}</p>
          <h3 className="font-semibold text-lg text-foreground group-hover:text-brand-primary transition-colors">{title}</h3>
        </div>
        <div className="mt-auto pt-4 flex items-center justify-between border-t border-border">
          <OfferExpirationBadge date={expirationDate} />
          <span className="text-sm font-medium text-foreground">View Offer &rarr;</span>
        </div>
      </article>
    </Link>
  );
}
