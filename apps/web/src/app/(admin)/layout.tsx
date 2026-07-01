import Link from "next/link";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen flex-col md:flex-row bg-surface-page">
      <aside className="w-full md:w-64 border-r border-border bg-surface-card flex flex-col shrink-0 min-h-screen">
        <div className="p-6 border-b border-border">
          <Link href="/admin" className="font-display font-bold text-lg focus-visible:outline-brand-primary rounded-sm focus-visible:ring-2 focus-visible:ring-brand-primary">Admin Dashboard</Link>
        </div>
        <nav className="flex flex-col gap-2 p-4" aria-label="Admin Navigation">
          <Link href="/admin/partners" className="text-sm font-medium p-2 rounded-md hover:bg-muted text-muted-foreground hover:text-foreground transition-colors focus-visible:outline-brand-primary focus-visible:ring-2 focus-visible:ring-brand-primary">Partners</Link>
          <Link href="/admin/offers" className="text-sm font-medium p-2 rounded-md hover:bg-muted text-muted-foreground hover:text-foreground transition-colors focus-visible:outline-brand-primary focus-visible:ring-2 focus-visible:ring-brand-primary">Offers</Link>
          {/* Phase 10: additional links */}
        </nav>
      </aside>
      <div className="flex-1 flex flex-col min-w-0">
        <header className="h-16 border-b border-border bg-surface-page flex items-center px-6 sticky top-0 z-30">
          <div className="text-sm font-medium text-muted-foreground" aria-hidden="true">Admin Topbar Placeholder</div>
        </header>
        <main id="main" className="flex-1 p-6 md:p-8 overflow-x-hidden">
          {children}
        </main>
      </div>
    </div>
  );
}
