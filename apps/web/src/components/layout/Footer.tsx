import Link from "next/link";

import type * as React from "react";

export function Footer(): React.JSX.Element {
  return (
    <footer className="w-full border-t border-border bg-surface-page py-12 md:py-16 mt-auto" aria-labelledby="footer-heading">
      <h2 id="footer-heading" className="sr-only">Footer</h2>
      <div className="container mx-auto px-4 md:px-8 lg:px-12 max-w-7xl">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="col-span-1 md:col-span-1">
            <span className="font-display font-bold text-xl text-foreground">HU Preferred Partner</span>
            <p className="mt-4 text-sm text-muted-foreground leading-relaxed">
              Connecting students with exclusive brand partnerships and opportunities.
            </p>
          </div>
          <div>
            <h3 className="text-sm font-semibold mb-4 text-foreground">Platform</h3>
            <ul className="space-y-3">
              <li><Link href="/partners" className="text-sm text-muted-foreground hover:text-foreground transition-colors focus-visible:outline-brand-primary rounded-sm focus-visible:ring-2 focus-visible:ring-brand-primary">Browse Partners</Link></li>
              <li><Link href="/offers" className="text-sm text-muted-foreground hover:text-foreground transition-colors focus-visible:outline-brand-primary rounded-sm focus-visible:ring-2 focus-visible:ring-brand-primary">All Offers</Link></li>
              {/* Partner links to be injected via CMS in Phase 8 */}
              <li><div className="text-sm text-muted-foreground italic" aria-hidden="true">CMS Links Placeholder</div></li>
            </ul>
          </div>
          <div>
            <h3 className="text-sm font-semibold mb-4 text-foreground">Support</h3>
            <ul className="space-y-3">
              <li><Link href="/faq" className="text-sm text-muted-foreground hover:text-foreground transition-colors focus-visible:outline-brand-primary rounded-sm focus-visible:ring-2 focus-visible:ring-brand-primary">FAQ</Link></li>
              <li><Link href="/contact" className="text-sm text-muted-foreground hover:text-foreground transition-colors focus-visible:outline-brand-primary rounded-sm focus-visible:ring-2 focus-visible:ring-brand-primary">Contact Us</Link></li>
            </ul>
          </div>
          <div>
            <h3 className="text-sm font-semibold mb-4 text-foreground">Stay Updated</h3>
            <p className="text-sm text-muted-foreground mb-4">Subscribe to our newsletter for the latest partner offers.</p>
            {/* CMS Newsletter Placeholder (Phase 7) */}
            <div className="w-full h-10 bg-muted/50 rounded flex items-center justify-center text-xs text-muted-foreground border border-dashed border-border" aria-hidden="true">
              Newsletter Form Placeholder
            </div>
          </div>
        </div>
        <div className="mt-12 pt-8 border-t border-border flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-sm text-muted-foreground">
            &copy; {new Date().getFullYear()} Habib University. All rights reserved.
          </p>
          <div className="flex gap-4">
            <Link href="/privacy" className="text-sm text-muted-foreground hover:text-foreground transition-colors focus-visible:outline-brand-primary rounded-sm focus-visible:ring-2 focus-visible:ring-brand-primary">Privacy Policy</Link>
            <Link href="/terms" className="text-sm text-muted-foreground hover:text-foreground transition-colors focus-visible:outline-brand-primary rounded-sm focus-visible:ring-2 focus-visible:ring-brand-primary">Terms of Service</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
