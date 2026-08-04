"use client";

import { MoonStar, Sun } from "lucide-react";
import { useTheme } from "@/providers/theme-provider";

export function ThemeToggle() {
  const { theme, toggleTheme } = useTheme();
  return (
    <button className="icon-button" onClick={toggleTheme} aria-label={theme === "light" ? "Ativar tema escuro" : "Ativar tema claro"} type="button">
      {theme === "light" ? <MoonStar size={17} /> : <Sun size={17} />}
    </button>
  );
}
