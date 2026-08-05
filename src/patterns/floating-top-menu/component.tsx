"use client";

import { useState, type CSSProperties } from "react";
import { ArrowUpRight, Menu } from "lucide-react";
import type { PatternPreviewProps } from "@/types/pattern";
import { MenuShowcase, MENU_ACCENTS } from "@/patterns/shared/menu-showcase";
import "./floating-top-menu.css";

const items = [
  { id: "Trabalho", line: "Projetos que pedem presença." },
  { id: "Estúdio", line: "Como o time pensa e faz." },
  { id: "Notas", line: "Observações curtas, úteis." },
];

export default function FloatingTopMenu(_props: PatternPreviewProps) {
  const [active, setActive] = useState("Trabalho");
  const [accent, setAccent] = useState(MENU_ACCENTS[6].value);
  const current = items.find((item) => item.id === active) ?? items[0];

  return (
    <MenuShowcase
      className="ftm-show"
      style={{ "--ftm-accent": accent } as CSSProperties}
      eyebrow="Menu flutuante"
      title={current.id}
      description={current.line}
      accent={accent}
      onAccentChange={setAccent}
    >
      <div className="ftm-frame">
        <div className="ftm-canvas">
          <span className="ftm-brand">
            Morrow<span>.</span>
          </span>
          <p>
            Estúdio independente
            <br />
            para marcas inquietas.
          </p>
          <button type="button" className="ftm-round" aria-label="Abrir">
            <ArrowUpRight size={16} />
          </button>
        </div>
        <nav className="ftm-nav" aria-label="Menu flutuante">
          <span className="ftm-mark">M.</span>
          {items.map((item) => (
            <button
              key={item.id}
              type="button"
              className={active === item.id ? "active" : undefined}
              onClick={() => setActive(item.id)}
            >
              {item.id}
            </button>
          ))}
          <button type="button" className="ftm-menu-icon" aria-label="Abrir navegação">
            <Menu size={15} />
          </button>
        </nav>
      </div>
    </MenuShowcase>
  );
}
