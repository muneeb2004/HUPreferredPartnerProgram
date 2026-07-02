import Link from "next/link";

import { Footer } from "@/components/layout/Footer";

import type * as React from "react";

export default function BrandPortalLayout({ children }: { children: React.ReactNode }): React.JSX.Element {
  return (
    <div className="flex min-h-screen flex-col bg-surface-page">
      <header className="h-16 border-b border-border bg-surface-card flex items-center px-6 sticky top-0 z-30 justify-between">
        <Link href="/portal" className="font-display font-bold text-lg focus-visible:outline-brand-primary rounded-sm focus-visible:ring-2 focus-visible:ring-brand-primary">Brand Portal</Link>
        <nav aria-label="Brand Portal Navigation">
          <span className="text-sm font-medium text-muted-foreground" aria-hidden="true">Brand Nav Placeholder</span>
        </nav>
      </header>
      <main id="main" className="flex-1 container mx-auto px-4 md:px-8 lg:px-12 max-w-7xl py-8">
        {children}
      </main>
      <Footer />
    </div>
  );
}
