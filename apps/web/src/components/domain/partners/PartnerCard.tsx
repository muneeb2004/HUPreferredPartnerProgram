import Link from "next/link";

interface PartnerCardProps {
  slug: string;
  name: string;
  description: string;
  logoUrl?: string; // Phase 8 CMS placeholder
}

export function PartnerCard({ slug, name, description, logoUrl }: PartnerCardProps) {
  return (
    <Link href={`/partners/${slug}`} className="group block h-full focus-visible:outline-brand-primary rounded-xl focus-visible:ring-2 focus-visible:ring-brand-primary">
      <article className="h-full flex flex-col p-6 rounded-xl border border-border bg-surface-card hover:border-foreground/20 transition-all hover:translate-y-[-2px] hover:shadow-elevation-md">
        <div className="w-16 h-16 rounded-md bg-muted flex items-center justify-center mb-6 shrink-0 overflow-hidden relative">
          {logoUrl ? (
            <div className="text-xs text-muted-foreground italic">CMS Logo Placeholder</div>
          ) : (
            <span className="font-display font-bold text-xl text-muted-foreground">{name.charAt(0)}</span>
          )}
        </div>
        <h3 className="font-semibold text-lg text-foreground mb-2 group-hover:text-brand-primary transition-colors">{name}</h3>
        <p className="text-sm text-muted-foreground line-clamp-3 leading-relaxed">{description}</p>
      </article>
    </Link>
  );
}
