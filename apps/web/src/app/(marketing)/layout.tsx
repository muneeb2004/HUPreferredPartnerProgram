import { Footer } from "@/components/layout/Footer";
import { Header } from "@/components/layout/Header";

import type * as React from "react";

export default function MarketingLayout({ children }: { children: React.ReactNode }): React.JSX.Element {
  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main id="main" className="flex-1 flex flex-col">
        {children}
      </main>
      <Footer />
    </div>
  );
}
