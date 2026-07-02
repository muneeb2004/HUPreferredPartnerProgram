"use client";

import { cn } from "@hu-partner/ui";
import { LayoutDashboard, Users, Tag, Mail, Store } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";

const navigation = [
  { name: "Dashboard", href: "/admin", icon: LayoutDashboard },
  { name: "Partners", href: "/admin/partners", icon: Store },
  { name: "Offers", href: "/admin/offers", icon: Tag },
  { name: "Users", href: "/admin/users", icon: Users },
  { name: "Newsletters", href: "/admin/newsletters", icon: Mail },
];

export function AdminSidebar({ isOpen, setIsOpen }: { isOpen: boolean, setIsOpen: (val: boolean) => void }): React.ReactElement {
  const pathname = usePathname();

  return (
    <>
      {/* Mobile overlay */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-40 md:hidden" 
          onClick={() => setIsOpen(false)} 
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
            href="/admin" 
            className="font-display font-bold text-lg focus-visible:outline-none rounded-sm focus-visible:ring-2 focus-visible:ring-brand-primary"
            onClick={() => setIsOpen(false)}
          >
            Admin Dashboard
          </Link>
        </div>
        <nav className="flex-1 flex flex-col gap-2 p-4 overflow-y-auto" aria-label="Admin Navigation">
          {navigation.map((item) => {
            const isActive = pathname === item.href || (item.href !== "/admin" && pathname.startsWith(item.href + "/"));
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
                onClick={() => setIsOpen(false)}
              >
                <item.icon className="w-4 h-4" />
                {item.name}
              </Link>
            );
          })}
        </nav>
      </aside>
    </>
  );
}
