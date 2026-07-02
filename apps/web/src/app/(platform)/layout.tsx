import { Footer } from "@/components/layout/Footer";
import { Header } from "@/components/layout/Header";

export default function PlatformLayout({ children }: { children: React.ReactNode }): JSX.Element {
  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main id="main" className="flex-1 flex flex-col container mx-auto px-4 md:px-8 lg:px-12 max-w-7xl py-8">
        {children}
      </main>
      <Footer />
    </div>
  );
}
