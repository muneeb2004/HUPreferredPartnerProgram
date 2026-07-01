import { Inter, JetBrains_Mono } from 'next/font/google';

/**
 * Primary font — used for all body text and UI.
 */
export const inter = Inter({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-inter',
});

/**
 * Monospace font — used for code snippets and technical content.
 */
export const jetbrainsMono = JetBrains_Mono({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-mono',
});
