"use client";

import { useState } from "react";
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
import "./expandable-sidebar.css";

const spring = { type: "spring" as const, stiffness: 380, damping: 26, mass: 0.85 };

const items = [
  { icon: LayoutGrid, label: "Visão geral" },
  { icon: Users, label: "Equipe" },
  { icon: MessageCircle, label: "Mensagens", count: 4 },
  { icon: Settings, label: "Ajustes" },
];

export default function ExpandableSidebar(_props: PatternPreviewProps) {
  const [expanded, setExpanded] = useState(true);
  const [active, setActive] = useState("Visão geral");

  return (
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
          <div className="esb-stats">
            <div className="esb-stat">
              <small>Projetos ativos</small>
              <b>12</b>
              <i />
            </div>
            <div className="esb-stat">
              <small>Foco da equipe</small>
              <b>86%</b>
              <i />
            </div>
          </div>
          <div className="esb-lines">
            <i />
            <i />
            <i />
          </div>
        </section>
      </div>
    </div>
  );
}
