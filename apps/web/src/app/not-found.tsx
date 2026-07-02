import { Button } from "@hu-partner/ui";
import Link from "next/link";

import { Footer } from "@/components/layout/Footer";
import { Header } from "@/components/layout/Header";

import type * as React from "react";

export default function NotFound(): React.JSX.Element {
  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main id="main" className="flex-1 flex flex-col items-center justify-center p-4 text-center">
        <h1 className="text-6xl font-display font-bold mb-4 text-foreground">404</h1>
        <h2 className="text-2xl font-display font-semibold mb-6 text-foreground">Page Not Found</h2>
        <p className="text-muted-foreground mb-8 max-w-md">
          The page you are looking for does not exist, has been moved, or is temporarily unavailable.
        </p>
        <Button asChild>
          <Link href="/">Return to Home</Link>
        </Button>
      </main>
      <Footer />
    </div>
  );
}
