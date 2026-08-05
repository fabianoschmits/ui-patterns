"use client";

import { useId } from "react";
import { useTheme } from "@/providers/theme-provider";

export function ThemeFab() {
  const { theme, toggleTheme } = useTheme();
  const maskId = useId().replace(/:/g, "");

  return (
    <button
      type="button"
      className="theme-fab"
      aria-label={theme === "light" ? "Ativar tema escuro" : "Ativar tema claro"}
      onClick={(event) => {
        const rect = event.currentTarget.getBoundingClientRect();
        toggleTheme({
          originX: rect.left + rect.width / 2,
          originY: rect.top + rect.height / 2,
        });
      }}
    >
      <svg className="theme-fab-svg" viewBox="0 0 24 24" aria-hidden="true">
        <mask
          id={maskId}
          maskUnits="userSpaceOnUse"
          x="0"
          y="0"
          width="24"
          height="24"
        >
          <rect width="24" height="24" fill="#fff" />
          <circle className="theme-fab-cut" cx="12" cy="12" r="7" fill="#000" />
        </mask>
        <g className="theme-fab-rays">
          <path d="M12 2.4v2.1M12 19.5v2.1M2.4 12h2.1M19.5 12h2.1M5.2 5.2l1.5 1.5M17.3 17.3l1.5 1.5M18.8 5.2l-1.5 1.5M6.7 17.3l-1.5 1.5" />
        </g>
        <circle
          className="theme-fab-disc"
          cx="12"
          cy="12"
          r="4.3"
          mask={`url(#${maskId})`}
        />
      </svg>
    </button>
  );
}
