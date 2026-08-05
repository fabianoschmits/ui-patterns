"use client";

import { useState } from "react";
import { Bell, CalendarDays, Home, Mail, Search, UserRound } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import type { PatternPreviewProps } from "@/types/pattern";
import "./dock.css";

const dockItems = [
  { icon: Home, label: "Início" },
  { icon: Search, label: "Buscar" },
  { icon: CalendarDays, label: "Agenda" },
  { icon: Mail, label: "Msgs" },
  { icon: Bell, label: "Avisos" },
  { icon: UserRound, label: "Perfil" },
];

export default function NavigationDock(_props: PatternPreviewProps) {
  const [active, setActive] = useState("Início");

  return (
    <div className="dock-show">
      <div className="dock-show-bloom" aria-hidden="true" />
      <div className="dock-show-body">
        <header className="dock-show-head">
          <span>Dock</span>
          <h2>{active}</h2>
          <p>Toque um ícone — a cápsula líquida acompanha.</p>
        </header>

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
      </div>
    </div>
  );
}
