"use client";

import { Inter, Playfair_Display } from "next/font/google";

const inter = Inter({ subsets: ["latin"] });
const playfair = Playfair_Display({ subsets: ["latin"] });

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <html lang="en" className={`${inter.className} ${playfair.className}`}>
      <body>
        <div className="flex min-h-screen flex-col items-center justify-center p-4 text-center bg-white text-black">
          <h2 className="text-2xl font-semibold mb-4">A critical error occurred</h2>
          <p className="text-gray-500 mb-8 max-w-md">
            The application shell failed to load completely.
          </p>
          <button
            className="px-4 py-2 bg-black text-white rounded-md font-medium"
            onClick={() => reset()}
          >
            Try again
          </button>
        </div>
      </body>
    </html>
  );
}
