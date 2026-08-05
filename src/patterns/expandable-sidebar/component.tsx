"use client";

import { useState, type CSSProperties } from "react";
import {
  Bell,
  ChevronLeft,
  LayoutGrid,
  MessageCircle,
  Settings,
  Sparkles,
  Users,
} from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import type { PatternPreviewProps } from "@/types/pattern";
import { MenuShowcase, MENU_ACCENTS } from "@/patterns/shared/menu-showcase";
import "./expandable-sidebar.css";

const spring = { type: "spring" as const, stiffness: 380, damping: 26, mass: 0.85 };

const items = [
  { icon: LayoutGrid, label: "Visão geral", line: "Um panorama calmo do workspace." },
  { icon: Users, label: "Equipe", line: "Quem está junto neste ciclo." },
  { icon: MessageCircle, label: "Mensagens", count: 4, line: "Quatro conversas pedindo resposta." },
  { icon: Settings, label: "Ajustes", line: "Preferências sem ruído." },
];

export default function ExpandableSidebar(_props: PatternPreviewProps) {
  const [expanded, setExpanded] = useState(true);
  const [active, setActive] = useState("Visão geral");
  const [accent, setAccent] = useState(MENU_ACCENTS[2].value);
  const current = items.find((item) => item.label === active) ?? items[0];

  return (
    <MenuShowcase
      className="esb-show"
      style={{ "--esb-accent": accent } as CSSProperties}
      eyebrow="Sidebar"
      title={current.label}
      description={current.line}
      accent={accent}
      onAccentChange={setAccent}
    >
      <div className="esb-demo">
        <div className="esb-app">
          <motion.aside
            className="esb-side"
            animate={{ width: expanded ? 158 : 56 }}
            transition={spring}
          >
            <div className="esb-brand">
              <Sparkles size={16} />
              <AnimatePresence>
                {expanded && (
                  <motion.span
                    initial={{ opacity: 0, x: -8 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -8 }}
                    transition={spring}
                  >
                    Northstar
                  </motion.span>
                )}
              </AnimatePresence>
            </div>

            <motion.button
              type="button"
              className="esb-toggle"
              onClick={() => setExpanded((v) => !v)}
              aria-label={expanded ? "Recolher menu" : "Expandir menu"}
              animate={{ rotate: expanded ? 0 : 180 }}
              transition={spring}
            >
              <ChevronLeft size={14} />
            </motion.button>

            <nav className="esb-nav" aria-label="Navegação lateral">
              {items.map(({ icon: Icon, label, count }) => {
                const isActive = active === label;
                return (
                  <button
                    key={label}
                    type="button"
                    className={"esb-item" + (isActive ? " is-active" : "")}
                    title={!expanded ? label : undefined}
                    onClick={() => setActive(label)}
                  >
                    {isActive && (
                      <motion.span
                        layoutId="esb-pill"
                        className="esb-pill"
                        transition={spring}
                      />
                    )}
                    <Icon size={16} />
                    <AnimatePresence>
                      {expanded && (
                        <motion.span
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          exit={{ opacity: 0 }}
                        >
                          {label}
                        </motion.span>
                      )}
                    </AnimatePresence>
                    {count && expanded && <span className="esb-badge">{count}</span>}
                  </button>
                );
              })}
            </nav>

            <div className="esb-user">
              <span className="esb-avatar">AM</span>
              <AnimatePresence>
                {expanded && (
                  <motion.span
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                  >
                    <b>Ana Moura</b>
                    <small>Product lead</small>
                  </motion.span>
                )}
              </AnimatePresence>
              {expanded && <Bell size={14} />}
            </div>
          </motion.aside>

          <section className="esb-main">
            <div className="esb-main-head">
              <span>
                <i className="esb-dot" /> terça, 4 de agosto
              </span>
              <span className="esb-avatar">AM</span>
            </div>
            <h3>{active}</h3>
            <p>Um espaço calmo para o seu melhor trabalho.</p>
          </section>
        </div>
      </div>
    </MenuShowcase>
  );
}
