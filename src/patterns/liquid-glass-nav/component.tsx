"use client";

import { useEffect, useLayoutEffect, useRef, useState, type CSSProperties } from "react";
import { AnimatePresence, motion } from "motion/react";
import type { PatternPreviewProps } from "@/types/pattern";
import { MenuShowcase, MENU_ACCENTS } from "@/patterns/shared/menu-showcase";
import "./lucid.css";

const SEGS = [
  {
    id: "today",
    label: "Today",
    title: "Today",
    line: "O dia, em uma barra de vidro.",
    icon: (
      <svg viewBox="0 0 24 24" aria-hidden="true">
        <rect x="4.2" y="6" width="15.6" height="14" rx="2.6" />
        <path d="M8.4 3.9v4M15.6 3.9v4M4.2 11h15.6" />
      </svg>
    ),
  },
  {
    id: "inbox",
    label: "Inbox",
    title: "Inbox",
    line: "Mensagens que cabem na mão.",
    icon: (
      <svg viewBox="0 0 24 24" aria-hidden="true">
        <path d="M4.2 13.6 6.5 6a2 2 0 0 1 1.9-1.4h7.2A2 2 0 0 1 17.5 6l2.3 7.6" />
        <path d="M4.2 13.6h4.4l1 2.5h4.8l1-2.5h4.4v4a2 2 0 0 1-2 2H6.2a2 2 0 0 1-2-2Z" />
      </svg>
    ),
  },
  {
    id: "tasks",
    label: "Tasks",
    title: "Tasks",
    line: "Poucas tarefas. Melhor foco.",
    icon: (
      <svg viewBox="0 0 24 24" aria-hidden="true">
        <path d="m4.3 7.5 1.6 1.6 3-3.2M4.3 16.1l1.6 1.6 3-3.2" />
        <path d="M12.4 7.6h7.3M12.4 16.2h7.3" />
      </svg>
    ),
  },
] as const;

export default function LiquidGlassNav(_props: PatternPreviewProps) {
  const [theme, setTheme] = useState<"light" | "dark">("light");
  const [active, setActive] = useState(0);
  const [pill, setPill] = useState({ x: 0, w: 0 });
  const [stretch, setStretch] = useState(1);
  const [accent, setAccent] = useState(MENU_ACCENTS[0].value);
  const segRefs = useRef<(HTMLButtonElement | null)[]>([]);
  const prevX = useRef(0);

  const measure = () => {
    const el = segRefs.current[active];
    if (!el) return;
    const parent = el.parentElement;
    if (!parent) return;
    const pr = parent.getBoundingClientRect();
    const r = el.getBoundingClientRect();
    const x = r.left - pr.left;
    const w = r.width;
    const dx = Math.abs(x - prevX.current);
    prevX.current = x;
    setStretch(dx > 4 ? 1 + Math.min(dx / 140, 0.35) : 1);
    setPill({ x, w });
    window.setTimeout(() => setStretch(1), 280);
  };

  useLayoutEffect(() => {
    measure();
  }, [active]);

  useEffect(() => {
    const onResize = () => measure();
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, [active]);

  const onKeyDown = (e: React.KeyboardEvent) => {
    const step = ({ ArrowRight: 1, ArrowDown: 1, ArrowLeft: -1, ArrowUp: -1 } as Record<string, number>)[e.key];
    let next: number | null = null;
    if (step) next = (active + step + SEGS.length) % SEGS.length;
    else if (e.key === "Home") next = 0;
    else if (e.key === "End") next = SEGS.length - 1;
    if (next === null) return;
    e.preventDefault();
    setActive(next);
    segRefs.current[next]?.focus();
  };

  const current = SEGS[active];

  return (
    <MenuShowcase
      className="lucid-show"
      eyebrow="Liquid Glass"
      title={current.title}
      description={current.line}
      accent={accent}
      onAccentChange={setAccent}
      draggableRoulette
    >
      <div
        className="lucid-demo"
        data-theme={theme}
        style={{ "--lucid-accent": accent } as CSSProperties}
      >
        <div className="lucid">
          <span className="lucid-base" aria-hidden="true" />
          <span className="lucid-tint" aria-hidden="true" />
          <span className="lucid-sheen" aria-hidden="true" />
          <span className="lucid-rim" aria-hidden="true" />

          <div
            className="lucid-seg"
            role="radiogroup"
            aria-label="Seções"
            onKeyDown={onKeyDown}
          >
            <motion.span
              className="lucid-pill"
              aria-hidden="true"
              animate={{
                x: pill.x,
                width: pill.w,
                scaleX: stretch,
              }}
              transition={{ type: "spring", stiffness: 380, damping: 28, mass: 0.85 }}
              style={{ originX: stretch > 1 ? 0.15 : 0.5 }}
            />

            {SEGS.map((seg, i) => (
              <button
                key={seg.id}
                ref={(el) => {
                  segRefs.current[i] = el;
                }}
                type="button"
                role="radio"
                className="lucid-btn"
                aria-checked={active === i}
                tabIndex={active === i ? 0 : -1}
                onClick={() => setActive(i)}
              >
                <span className="lucid-icon">{seg.icon}</span>
                <span className="lucid-label">{seg.label}</span>
              </button>
            ))}
          </div>

          <span className="lucid-sep" aria-hidden="true" />

          <button
            type="button"
            className="lucid-theme"
            aria-label={theme === "light" ? "Ativar tema escuro" : "Ativar tema claro"}
            onClick={() => setTheme((t) => (t === "light" ? "dark" : "light"))}
          >
            <AnimatePresence mode="wait" initial={false}>
              <motion.span
                key={theme}
                initial={{ opacity: 0, rotate: -40, scale: 0.7 }}
                animate={{ opacity: 1, rotate: 0, scale: 1 }}
                exit={{ opacity: 0, rotate: 40, scale: 0.7 }}
                transition={{ duration: 0.28 }}
              >
                {theme === "light" ? "☀" : "☾"}
              </motion.span>
            </AnimatePresence>
          </button>
        </div>
      </div>
    </MenuShowcase>
  );
}
