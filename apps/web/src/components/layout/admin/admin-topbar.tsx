"use client";

import { Button } from "@hu-partner/ui";
import { Menu, ChevronRight } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import React from "react";

export function AdminTopbar({ onMenuClick }: { onMenuClick: () => void }): React.ReactElement {
  const pathname = usePathname();
  const segments = pathname.split("/").filter(Boolean);
  
  return (
    <header className="h-16 border-b border-border bg-surface-page flex items-center justify-between px-4 md:px-6 sticky top-0 z-30">
      <div className="flex items-center gap-4">
        <Button 
          variant="ghost" 
          size="icon" 
          className="md:hidden" 
          onClick={onMenuClick}
          aria-label="Open sidebar"
        >
          <Menu className="w-5 h-5" />
        </Button>
        <nav aria-label="Breadcrumb" className="hidden sm:flex items-center text-sm text-muted-foreground">
          {segments.map((segment, index): JSX.Element => {
            const isLast = index === segments.length - 1;
            const href = "/" + segments.slice(0, index + 1).join("/");
            const title = segment.charAt(0).toUpperCase() + segment.slice(1);
            
            return (
              <React.Fragment key={href}>
                {index > 0 && <ChevronRight className="w-4 h-4 mx-2" />}
                {isLast ? (
                  <span className="font-medium text-foreground">{title}</span>
                ) : (
                  <Link href={href} className="hover:text-foreground transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-primary rounded-sm">
                    {title}
                  </Link>
                )}
              </React.Fragment>
            );
          })}
        </nav>
      </div>
      
      <div className="flex items-center gap-4">
        {/* User profile dropdown placeholder */}
        <div className="w-8 h-8 rounded-full bg-muted flex items-center justify-center text-xs font-medium text-muted-foreground border border-border cursor-pointer">
          A
        </div>
      </div>
    </header>
  );
}
