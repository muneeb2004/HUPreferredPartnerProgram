"use client";

import * as React from "react";
import Link from "next/link";
import { Dialog, DialogTrigger, DialogContent, DialogTitle, DialogDescription } from "@hu-partner/ui/components/ui/dialog";
import { Button } from "@hu-partner/ui/components/ui/button";

export function MobileNav() {
  const [open, setOpen] = React.useState(false);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm" aria-label="Open menu">Menu</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-xs fixed right-0 top-0 h-full data-[state=closed]:slide-out-to-right data-[state=open]:slide-in-from-right translate-x-0 translate-y-0 rounded-none sm:rounded-none z-[100] border-l border-border bg-background shadow-elevation-lg px-6 py-8">
        <DialogTitle className="font-display text-xl font-bold">Navigation</DialogTitle>
        <DialogDescription className="sr-only">Main navigation links for mobile.</DialogDescription>
        <nav className="flex flex-col gap-6 mt-12">
          <Link href="/partners" onClick={() => setOpen(false)} className="text-lg font-medium hover:text-brand-primary transition-colors focus-visible:outline-brand-primary rounded-sm focus-visible:ring-2 focus-visible:ring-brand-primary">Partners</Link>
          <Link href="/catalogue" onClick={() => setOpen(false)} className="text-lg font-medium hover:text-brand-primary transition-colors focus-visible:outline-brand-primary rounded-sm focus-visible:ring-2 focus-visible:ring-brand-primary">Catalogue</Link>
          <div className="h-px bg-border my-2 w-full" role="separator" />
          <Link href="/login" onClick={() => setOpen(false)} className="text-lg font-medium text-muted-foreground hover:text-foreground transition-colors focus-visible:outline-brand-primary rounded-sm focus-visible:ring-2 focus-visible:ring-brand-primary">Login</Link>
        </nav>
      </DialogContent>
    </Dialog>
  );
}
