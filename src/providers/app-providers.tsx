"use client";

import { FavoritesProvider } from "@/providers/favorites-provider";
import { ThemeProvider } from "@/providers/theme-provider";

export function AppProviders({ children }: { children: React.ReactNode }) {
  return (
    <ThemeProvider>
      <FavoritesProvider>{children}</FavoritesProvider>
    </ThemeProvider>
  );
}
