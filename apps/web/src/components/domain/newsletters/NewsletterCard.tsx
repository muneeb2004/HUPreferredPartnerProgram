import Link from "next/link";

interface NewsletterCardProps {
  slug: string;
  title: string;
  date: string;
  excerpt: string;
}

export function NewsletterCard({ slug, title, date, excerpt }: NewsletterCardProps) {
  return (
    <Link href={`/newsletters/${slug}`} className="group block focus-visible:outline-brand-primary rounded-xl focus-visible:ring-2 focus-visible:ring-brand-primary">
      <article className="p-6 rounded-xl border border-border bg-surface-card hover:border-foreground/20 transition-all hover:translate-y-[-2px] hover:shadow-elevation-md h-full flex flex-col">
        <time className="text-xs font-medium text-muted-foreground mb-3 block" dateTime={date}>{date}</time>
        <h3 className="font-semibold text-xl text-foreground mb-3 group-hover:text-brand-primary transition-colors">{title}</h3>
        <p className="text-sm text-muted-foreground line-clamp-3 leading-relaxed mb-6 flex-1">{excerpt}</p>
        <span className="text-sm font-medium text-foreground mt-auto">Read Issue &rarr;</span>
      </article>
    </Link>
  );
}
