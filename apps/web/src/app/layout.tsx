import dynamic from 'next/dynamic';
import { Inter, Playfair_Display, JetBrains_Mono } from 'next/font/google';


import { ErrorBoundary } from '@/components/providers/ErrorBoundary';
import { LenisProvider } from '@/components/providers/LenisProvider';
import { MotionProvider } from '@/components/providers/MotionProvider';
import { ThemeProvider } from '@/components/providers/ThemeProvider';

import type { Metadata } from 'next';
import type * as React from 'react';

import '../styles/globals.css';

// ThreeProvider loaded lazy to prevent blocking
const ThreeProvider = dynamic(
  (): Promise<React.ComponentType<{ children: React.ReactNode }>> =>
    import('@/components/providers/ThreeProvider').then((mod) => mod.ThreeProvider as React.ComponentType<{ children: React.ReactNode }>)
);

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
}>): React.JSX.Element {
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
