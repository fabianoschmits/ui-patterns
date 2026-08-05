"use client";

import { MoonStar, Sun } from "lucide-react";
import { useTheme } from "@/providers/theme-provider";

export function ThemeToggle() {
  const { theme, toggleTheme } = useTheme();

  return (
    <button
      className="icon-button"
      onClick={(event) => {
        const rect = event.currentTarget.getBoundingClientRect();
        toggleTheme({
          originX: rect.left + rect.width / 2,
          originY: rect.top + rect.height / 2,
        });
      }}
      aria-label={theme === "light" ? "Ativar tema escuro" : "Ativar tema claro"}
      type="button"
    >
      {theme === "light" ? <MoonStar size={17} /> : <Sun size={17} />}
    </button>
  );
}
