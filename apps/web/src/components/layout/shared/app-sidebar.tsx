"use client";

import { cn } from "@hu-partner/ui";
import Link from "next/link";
import { usePathname } from "next/navigation";

import type * as React from "react";

export interface NavigationItem {
  name: string;
  href: string;
  icon: React.ComponentType<{ className?: string }>;
}

export interface AppSidebarProps {
  isOpen: boolean;
  setIsOpen: (val: boolean) => void;
  title: string;
  baseHref: string;
  navigation: NavigationItem[];
}

export function AppSidebar({ isOpen, setIsOpen, title, baseHref, navigation }: AppSidebarProps): React.ReactElement {
  const pathname = usePathname();

  return (
    <>
      {/* Mobile overlay */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-40 md:hidden" 
          onClick={(): void => setIsOpen(false)} 
          aria-hidden="true" 
        />
      )}
      
      {/* Sidebar */}
      <aside 
        className={cn(
          "fixed inset-y-0 left-0 z-50 w-64 bg-surface-card border-r border-border transition-transform transform md:relative md:translate-x-0 flex flex-col min-h-screen shrink-0",
          isOpen ? "translate-x-0" : "-translate-x-full"
        )}
      >
        <div className="p-6 border-b border-border flex items-center justify-between">
          <Link 
            href={baseHref} 
            className="font-display font-bold text-lg focus-visible:outline-none rounded-sm focus-visible:ring-2 focus-visible:ring-brand-primary"
            onClick={(): void => setIsOpen(false)}
          >
            {title}
          </Link>
        </div>
        <nav className="flex-1 flex flex-col gap-2 p-4 overflow-y-auto" aria-label="Navigation">
          {navigation.map((item): React.JSX.Element => {
            const isActive = pathname === item.href || (item.href !== baseHref && pathname.startsWith(item.href + "/"));
            const Icon = item.icon;
            return (
              <Link 
                key={item.name}
                href={item.href} 
                className={cn(
                  "flex items-center gap-3 text-sm font-medium p-2 rounded-md transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-primary",
                  isActive 
                    ? "bg-accent text-accent-foreground" 
                    : "hover:bg-muted text-muted-foreground hover:text-foreground"
                )}
                aria-current={isActive ? "page" : undefined}
                onClick={(): void => setIsOpen(false)}
              >
                <Icon className="w-4 h-4" />
                {item.name}
              </Link>
            );
          })}
        </nav>
      </aside>
    </>
  );
}
