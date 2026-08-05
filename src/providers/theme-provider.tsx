"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";

type Theme = "light" | "dark";

interface ThemeToggleOptions {
  originX?: number;
  originY?: number;
}

interface ThemeContextValue {
  theme: Theme;
  toggleTheme: (options?: ThemeToggleOptions) => void;
}

const ThemeContext = createContext<ThemeContextValue | null>(null);
const STORAGE_KEY = "ui-patterns-theme";

function applyTheme(next: Theme) {
  document.documentElement.dataset.theme = next;
  document.documentElement.style.colorScheme = next;
  localStorage.setItem(STORAGE_KEY, next);
}

function prefersReducedMotion() {
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [theme, setTheme] = useState<Theme>("light");

  useEffect(() => {
    const current =
      document.documentElement.dataset.theme === "dark" ? "dark" : "light";
    setTheme(current);
  }, []);

  const toggleTheme = useCallback((options?: ThemeToggleOptions) => {
    const next: Theme = theme === "light" ? "dark" : "light";
    const root = document.documentElement;

    const commit = () => {
      applyTheme(next);
      setTheme(next);
    };

    const startViewTransition = document.startViewTransition?.bind(document);
    const canTransition =
      !prefersReducedMotion() && typeof startViewTransition === "function";

    if (!canTransition || !startViewTransition) {
      commit();
      return;
    }

    const cx = options?.originX ?? window.innerWidth - 40;
    const cy = options?.originY ?? 40;
    const reach = Math.hypot(
      Math.max(cx, window.innerWidth - cx),
      Math.max(cy, window.innerHeight - cy),
    );

    root.classList.add("theme-switching");

    const transition = startViewTransition(commit);

    transition.ready
      .then(() =>
        root.animate(
          {
            clipPath: [
              `circle(0px at ${cx}px ${cy}px)`,
              `circle(${reach}px at ${cx}px ${cy}px)`,
            ],
          },
          {
            duration: 620,
            easing: "cubic-bezier(0.4, 0, 0.15, 1)",
            pseudoElement: "::view-transition-new(root)",
          },
        ),
      )
      .catch(() => {});

    transition.finished.finally(() => {
      root.classList.remove("theme-switching");
    });
  }, [theme]);

  const value = useMemo(
    () => ({
      theme,
      toggleTheme,
    }),
    [theme, toggleTheme],
  );

  return (
    <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>
  );
}

export function useTheme() {
  const context = useContext(ThemeContext);
  if (!context) throw new Error("useTheme must be used inside ThemeProvider");
  return context;
}
