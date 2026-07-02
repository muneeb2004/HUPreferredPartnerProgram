"use client";

import { ThemeProvider as NextThemesProvider } from "next-themes";
import * as React from "react";

import type { ThemeProviderProps } from "next-themes";

export function ThemeProvider({ children, ...props }: ThemeProviderProps): React.JSX.Element {
  return <NextThemesProvider {...props}>{children}</NextThemesProvider>;
}
