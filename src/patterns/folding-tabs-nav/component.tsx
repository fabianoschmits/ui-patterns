"use client";

import { motion } from "motion/react";
import type { PatternPreviewProps } from "@/types/pattern";
import { CompactMenuShowcase, useCompactMenu } from "../navigation-collection/shared";
import "./folding-tabs.css";

type CompactMenu = ReturnType<typeof useCompactMenu>;

function FoldingTabs({ menu }: { menu: CompactMenu }) {
  const vertical = menu.orientation === "vertical";
  const transition = menu.motionOff
    ? { duration: 0 }
    : { type: "spring" as const, duration: 0.36, bounce: 0.06 };

  return (
    <nav
      className="ftn-menu"
      aria-label="Navegação por abas dobráveis"
      data-orientation={menu.orientation}
      data-expanded={menu.expanded}
      data-motion-off={menu.motionOff}
    >
      <div className="ftn-spine" aria-hidden="true" />
      <ul className="ftn-tabs">
        {menu.items.map((item, index) => {
          const active = menu.activeId === item.id;
          const Icon = item.icon;
          return (
            <li key={item.id} className="ftn-tab" data-active={active}>
              <motion.button
                {...menu.bindItem(item.id)}
                type="button"
                className="ftn-button"
                aria-label={item.label}
                title={!menu.expanded ? item.label : undefined}
                onClick={() => menu.select(item.id)}
                initial={false}
                animate={{
                  x: vertical && active ? 10 : 0,
                  y: !vertical && active ? -12 : 0,
                  rotateX: vertical ? 0 : active ? 0 : 12,
                  rotateY: vertical ? active ? 0 : -7 : 0,
                }}
                whileTap={menu.motionOff ? undefined : { scale: 0.975 }}
                transition={transition}
              >
                <span className="ftn-paper" aria-hidden="true" />
                <motion.span
                  className="ftn-fold"
                  aria-hidden="true"
                  initial={false}
                  animate={{ rotateY: active ? -12 : -48, rotateX: active ? -8 : 0 }}
                  transition={transition}
                />
                <span className="ftn-content">
                  <Icon size={21} strokeWidth={1.75} aria-hidden="true" />
                  {menu.expanded && <span className="ftn-label">{item.label}</span>}
                </span>
                <span className="ftn-hinge" aria-hidden="true"><i /><i /></span>
                <span className="ftn-tab-edge" style={{ opacity: 0.12 + index * 0.025 }} aria-hidden="true" />
              </motion.button>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}

export default function FoldingTabsNav({ accent }: PatternPreviewProps) {
  return (
    <CompactMenuShowcase
      name="Abas dobradas"
      description="Abas de papel saem da lombada e se abrem para marcar o destino."
      accent={accent || "#a9573c"}
    >
      {(menu) => <FoldingTabs menu={menu} />}
    </CompactMenuShowcase>
  );
}
