"use client";

import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";

interface FavoritesContextValue {
  favorites: string[];
  hydrated: boolean;
  isFavorite: (slug: string) => boolean;
  toggleFavorite: (slug: string) => void;
}

const STORAGE_KEY = "ui-patterns-favorites";
const FavoritesContext = createContext<FavoritesContextValue | null>(null);

export function FavoritesProvider({ children }: { children: React.ReactNode }) {
  const [favorites, setFavorites] = useState<string[]>([]);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    try {
      const stored = JSON.parse(localStorage.getItem(STORAGE_KEY) ?? "[]") as unknown;
      if (Array.isArray(stored)) setFavorites(stored.filter((item): item is string => typeof item === "string"));
    } catch {
      localStorage.removeItem(STORAGE_KEY);
    } finally {
      setHydrated(true);
    }
  }, []);

  const toggleFavorite = useCallback((slug: string) => {
    setFavorites((current) => {
      const next = current.includes(slug) ? current.filter((item) => item !== slug) : [...current, slug];
      localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
      return next;
    });
  }, []);

  const value = useMemo(
    () => ({ favorites, hydrated, isFavorite: (slug: string) => favorites.includes(slug), toggleFavorite }),
    [favorites, hydrated, toggleFavorite],
  );

  return <FavoritesContext.Provider value={value}>{children}</FavoritesContext.Provider>;
}

export function useFavorites() {
  const context = useContext(FavoritesContext);
  if (!context) throw new Error("useFavorites must be used inside FavoritesProvider");
  return context;
}
