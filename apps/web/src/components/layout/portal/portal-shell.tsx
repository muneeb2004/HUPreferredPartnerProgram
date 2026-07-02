"use client";

import { LayoutDashboard, Store, Tag, BarChart3, Settings } from "lucide-react";
import { useState } from "react";

import { AppSidebar, type NavigationItem } from "../shared/app-sidebar";
import { AppTopbar } from "../shared/app-topbar";

const navigation: NavigationItem[] = [
  { name: "Dashboard", href: "/brand-portal", icon: LayoutDashboard },
  { name: "Company Profile", href: "/brand-portal/profile", icon: Store },
  { name: "Offers", href: "/brand-portal/offers", icon: Tag },
  { name: "Analytics", href: "/brand-portal/analytics", icon: BarChart3 },
  { name: "Settings", href: "/brand-portal/settings", icon: Settings },
];

export function PortalShell({ children }: { children: React.ReactNode }): React.ReactElement {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  return (
    <div className="flex min-h-screen flex-col md:flex-row bg-surface-page">
      <AppSidebar 
        isOpen={isSidebarOpen} 
        setIsOpen={setIsSidebarOpen} 
        title="Brand Portal"
        baseHref="/brand-portal"
        navigation={navigation}
      />
      <div className="flex-1 flex flex-col min-w-0">
        <AppTopbar onMenuClick={(): void => setIsSidebarOpen(true)} />
        <main id="main" className="flex-1 p-6 md:p-8 overflow-x-hidden">
          {children}
        </main>
      </div>
    </div>
  );
}
