import Link from "next/link";
import { MobileNav } from "./MobileNav";

export function Header() {
  return (
    <header className="sticky top-0 z-40 w-full backdrop-blur-md bg-surface-page/85 border-b border-border shadow-elevation-sm">
      <div className="container mx-auto px-4 md:px-8 lg:px-12 max-w-7xl h-16 flex items-center justify-between">
        <Link href="/" className="font-display font-bold text-xl tracking-tight focus-visible:outline-brand-primary rounded-sm focus-visible:ring-2 focus-visible:ring-brand-primary">
          HU Preferred Partner
        </Link>
        <nav className="hidden md:flex items-center gap-8" aria-label="Main Navigation">
          <Link href="/partners" className="text-sm font-medium text-foreground/80 hover:text-brand-primary transition-colors focus-visible:outline-brand-primary rounded-sm focus-visible:ring-2 focus-visible:ring-brand-primary">Partners</Link>
          <Link href="/catalogue" className="text-sm font-medium text-foreground/80 hover:text-brand-primary transition-colors focus-visible:outline-brand-primary rounded-sm focus-visible:ring-2 focus-visible:ring-brand-primary">Catalogue</Link>
          <Link href="/login" className="text-sm font-medium px-4 py-2 bg-foreground text-background rounded-md hover:bg-foreground/90 transition-colors focus-visible:outline-brand-primary rounded-sm focus-visible:ring-2 focus-visible:ring-brand-primary">Login</Link>
        </nav>
        <div className="md:hidden">
          <MobileNav />
        </div>
      </div>
    </header>
  );
}
