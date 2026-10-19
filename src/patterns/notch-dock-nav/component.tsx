"use client";

import { useId } from "react";
import { motion } from "motion/react";
import type { PatternPreviewProps } from "@/types/pattern";
import { CompactMenuShowcase, useCompactMenu } from "../navigation-collection/shared";
import "./notch-dock.css";

type CompactMenu = ReturnType<typeof useCompactMenu>;

function NotchDock({ menu }: { menu: CompactMenu }) {
  const id = useId();
  const vertical = menu.orientation === "vertical";
  const activeIndex = Math.max(0, menu.items.findIndex((item) => item.id === menu.activeId));
  const center = (activeIndex + 0.5) * 100;
  const verticalWidth = menu.expanded ? 195 : 78;
  const path = vertical
    ? `M0 12 Q0 0 12 0 H${verticalWidth - 22} Q${verticalWidth} 0 ${verticalWidth} 22 V478 Q${verticalWidth} 500 ${verticalWidth - 22} 500 H12 Q0 500 0 488 V${center + 36} C0 ${center + 30} 37 ${center + 30} 37 ${center} C37 ${center - 30} 0 ${center - 30} 0 ${center - 36} Z`
    : `M12 0 H${center - 36} C${center - 30} 0 ${center - 30} 37 ${center} 37 C${center + 30} 37 ${center + 30} 0 ${center + 36} 0 H488 Q500 0 500 12 V74 Q500 96 478 96 H22 Q0 96 0 74 V12 Q0 0 12 0 Z`;
  const transition = menu.motionOff
    ? { duration: 0 }
    : { type: "spring" as const, duration: 0.38, bounce: 0.08 };

  return (
    <nav
      className="ndn-menu"
      aria-label="Navegação em dock com recorte"
      data-orientation={menu.orientation}
      data-expanded={menu.expanded}
      data-motion-off={menu.motionOff}
    >
      <svg
        key={menu.orientation}
        className="ndn-bed"
        viewBox={vertical ? `0 0 ${verticalWidth} 500` : "0 0 500 96"}
        preserveAspectRatio="none"
        aria-hidden="true"
      >
        <motion.path initial={false} animate={{ d: path }} transition={transition} />
      </svg>
      <ul className="ndn-items">
        {menu.items.map((item) => {
          const active = item.id === menu.activeId;
          const Icon = item.icon;
          return (
            <li key={item.id} className="ndn-item">
              <button
                {...menu.bindItem(item.id)}
                type="button"
                className="ndn-button"
                data-active={active}
                aria-label={item.label}
                title={!menu.expanded ? item.label : undefined}
                onClick={() => menu.select(item.id)}
              >
                <motion.span
                  className="ndn-key"
                  initial={false}
                  animate={{ x: vertical && active ? -24 : 0, y: !vertical && active ? -29 : 0 }}
                  transition={transition}
                >
                  {active && (
                    <motion.span
                      className="ndn-key-face"
                      layoutId={`${id}-key`}
                      transition={transition}
                    />
                  )}
                  <Icon size={21} strokeWidth={1.8} aria-hidden="true" />
                </motion.span>
                {menu.expanded && (
                  <motion.span
                    className="ndn-label"
                    initial={false}
                    animate={{ x: vertical && active ? -13 : 0, y: !vertical && active ? -7 : 0 }}
                    transition={transition}
                  >
                    {item.label}
                  </motion.span>
                )}
                <span className="ndn-status" aria-hidden="true" />
              </button>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}

export default function NotchDockNav({ accent }: PatternPreviewProps) {
  return (
    <CompactMenuShowcase
      name="Dock recortado"
      description="O destino selecionado se ergue e encontra um recorte no dock."
      accent={accent || "#2f6f5e"}
    >
      {(menu) => <NotchDock menu={menu} />}
    </CompactMenuShowcase>
  );
}
