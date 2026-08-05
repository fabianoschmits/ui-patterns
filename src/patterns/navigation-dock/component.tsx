"use client";

import { useState, type CSSProperties } from "react";
import { Bell, CalendarDays, Home, Mail, Search, UserRound } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import type { PatternPreviewProps } from "@/types/pattern";
import { MenuShowcase, MENU_ACCENTS } from "@/patterns/shared/menu-showcase";
import "./dock.css";

const dockItems = [
  { icon: Home, label: "Início", line: "Volte ao começo sem perder o ritmo." },
  { icon: Search, label: "Buscar", line: "Ache rápido o que importa agora." },
  { icon: CalendarDays, label: "Agenda", line: "O dia, organizado em um toque." },
  { icon: Mail, label: "Msgs", line: "Conversas curtas, respostas claras." },
  { icon: Bell, label: "Avisos", line: "Só o que merece sua atenção." },
  { icon: UserRound, label: "Perfil", line: "Você, no centro do dock." },
];

export default function NavigationDock(_props: PatternPreviewProps) {
  const [active, setActive] = useState("Início");
  const [accent, setAccent] = useState(MENU_ACCENTS[2].value);
  const current = dockItems.find((item) => item.label === active) ?? dockItems[0];

  return (
    <MenuShowcase
      className="dock-show"
      style={{ "--dock-accent": accent } as CSSProperties}
      eyebrow="Dock"
      title={current.label}
      description={current.line}
      accent={accent}
      onAccentChange={setAccent}
    >
      <nav className="dock-show-bar" aria-label="Dock de navegação">
        {dockItems.map(({ icon: Icon, label }) => {
          const isActive = active === label;
          return (
            <button
              key={label}
              type="button"
              className="dock-show-item"
              aria-current={isActive ? "page" : undefined}
              onClick={() => setActive(label)}
            >
              <span className="dock-show-slot">
                <AnimatePresence>
                  {isActive && (
                    <motion.span
                      layoutId="dock-pill"
                      className="dock-show-pill"
                      initial={{ opacity: 0, scaleX: 1.4, scaleY: 0.6 }}
                      animate={{ opacity: 1, scaleX: 1, scaleY: 1 }}
                      exit={{ opacity: 0, scaleX: 0.6, scaleY: 1.3 }}
                      transition={{ type: "spring", stiffness: 380, damping: 26 }}
                    />
                  )}
                </AnimatePresence>
                <Icon className={isActive ? "is-active" : undefined} size={isActive ? 20 : 18} />
              </span>
              <span className={isActive ? "is-active" : undefined}>{label}</span>
            </button>
          );
        })}
      </nav>
    </MenuShowcase>
  );
}
