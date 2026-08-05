"use client";

import { useState, type CSSProperties } from "react";
import { motion } from "motion/react";
import type { PatternPreviewProps } from "@/types/pattern";
import { MenuShowcase, MENU_ACCENTS } from "@/patterns/shared/menu-showcase";
import "./indicator.css";

const items = [
  { id: "Overview", line: "Make room for good work." },
  { id: "Projects", line: "Ship less noise. More craft." },
  { id: "Journal", line: "Notes that stay quiet." },
] as const;

export default function AnimatedIndicatorNavbar(_props: PatternPreviewProps) {
  const [active, setActive] = useState<(typeof items)[number]["id"]>("Overview");
  const [accent, setAccent] = useState(MENU_ACCENTS[0].value);
  const current = items.find((item) => item.id === active) ?? items[0];

  return (
    <MenuShowcase
      className="ind-show"
      style={{ "--ind-accent": accent } as CSSProperties}
      eyebrow="Navbar"
      title={current.id}
      description={current.line}
      accent={accent}
      onAccentChange={setAccent}
    >
      <nav className="ind-show-nav" aria-label="Navbar com indicador">
        <b>
          atlas<span>·</span>
        </b>
        <div className="ind-show-tabs" role="tablist">
          {items.map((item) => {
            const isActive = active === item.id;
            return (
              <button
                key={item.id}
                type="button"
                role="tab"
                aria-selected={isActive}
                onClick={() => setActive(item.id)}
              >
                {isActive && (
                  <motion.span
                    layoutId="ind-underline"
                    className="ind-show-line"
                    transition={{ type: "spring", stiffness: 420, damping: 32 }}
                  />
                )}
                {item.id}
              </button>
            );
          })}
        </div>
      </nav>
    </MenuShowcase>
  );
}
