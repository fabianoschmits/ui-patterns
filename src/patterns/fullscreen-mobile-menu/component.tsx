"use client";

import { useState, type CSSProperties } from "react";
import { ArrowUpRight, Menu, X } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import type { PatternPreviewProps } from "@/types/pattern";
import { MenuShowcase, MENU_ACCENTS } from "@/patterns/shared/menu-showcase";
import "./fullscreen-mobile-menu.css";

const items = [
  { id: "Coleções", line: "Objetos para o cotidiano." },
  { id: "Journal", line: "Notas da marca, sem pressa." },
  { id: "Sobre", line: "Quem faz, e por quê." },
];

export default function FullscreenMobileMenu(_props: PatternPreviewProps) {
  const [open, setOpen] = useState(true);
  const [active, setActive] = useState("Coleções");
  const [accent, setAccent] = useState(MENU_ACCENTS[1].value);
  const current = items.find((item) => item.id === active) ?? items[0];

  return (
    <MenuShowcase
      className="fmm-show"
      style={{ "--fmm-accent": accent } as CSSProperties}
      eyebrow="Menu mobile"
      title={open ? active : "Solace"}
      description={open ? current.line : "Abra o menu para navegar."}
      accent={accent}
      onAccentChange={setAccent}
    >
      <div className="fmm-device">
        <header className="fmm-top">
          <b>SOLACE</b>
          <button
            type="button"
            onClick={() => setOpen((v) => !v)}
            aria-label="Alternar menu"
          >
            {open ? <X size={18} /> : <Menu size={18} />}
          </button>
        </header>

        <AnimatePresence mode="wait" initial={false}>
          {open ? (
            <motion.div
              key="menu"
              className="fmm-layer"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.28 }}
            >
              <small>MENU</small>
              {items.map((item, index) => (
                <button
                  key={item.id}
                  type="button"
                  className={active === item.id ? "active" : undefined}
                  onClick={() => setActive(item.id)}
                >
                  <span>0{index + 1}</span>
                  {item.id}
                  <ArrowUpRight size={16} />
                </button>
              ))}
            </motion.div>
          ) : (
            <motion.div
              key="home"
              className="fmm-home"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.28 }}
            >
              <span>01 — 04</span>
              <div className="fmm-photo" aria-hidden="true" />
              <h3>
                Objetos para
                <br />
                um cotidiano gentil.
              </h3>
              <button type="button" onClick={() => setOpen(true)}>
                Explorar coleção <ArrowUpRight size={14} />
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </MenuShowcase>
  );
}
