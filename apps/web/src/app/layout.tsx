import type { Metadata } from 'next';
import { Inter, Playfair_Display, JetBrains_Mono } from 'next/font/google';
import '../styles/globals.css';
import { ThemeProvider } from '@/components/providers/ThemeProvider';
import { LenisProvider } from '@/components/providers/LenisProvider';
import { MotionProvider } from '@/components/providers/MotionProvider';
import { ErrorBoundary } from '@/components/providers/ErrorBoundary';
// ThreeProvider loaded lazy to prevent blocking
import dynamic from 'next/dynamic';
const ThreeProvider = dynamic(() => import('@/components/providers/ThreeProvider').then(mod => mod.ThreeProvider), { ssr: false });

const inter = Inter({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-body',
  weight: ['400', '500', '600', '700'],
});

const playfair = Playfair_Display({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-display',
  weight: ['600', '700', '800', '900'],
});

const jetbrains = JetBrains_Mono({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-mono',
  weight: ['400', '500'],
});

export const metadata: Metadata = {
  title: {
    default: 'HU Preferred Partner',
    template: '%s | HU Preferred Partner',
  },
  description:
    'Habib University Preferred Partner Platform — connecting students with exclusive brand partnerships and offers.',
  metadataBase: new URL(
    process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000',
  ),
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning className={`${playfair.variable} ${inter.variable} ${jetbrains.variable}`}>
      <body className="font-body antialiased bg-surface-page text-foreground min-h-screen flex flex-col selection:bg-brand-primary/20">
        <a href="#main" className="sr-only focus:not-sr-only focus:absolute focus:z-[100] focus:p-4 focus:bg-background focus:text-foreground focus:outline-brand-primary">
          Skip to main content
        </a>
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
          <LenisProvider>
            <MotionProvider>
              <ThreeProvider>
                <ErrorBoundary>
                  {children}
                </ErrorBoundary>
              </ThreeProvider>
            </MotionProvider>
          </LenisProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
