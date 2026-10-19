"use client";

import { useId } from "react";
import { AnimatePresence, motion } from "motion/react";
import type { PatternPreviewProps } from "@/types/pattern";
import { CompactMenuShowcase, useCompactMenu } from "../navigation-collection/shared";
import "./expanding-island.css";

type CompactMenu = ReturnType<typeof useCompactMenu>;

function ExpandingIsland({ menu }: { menu: CompactMenu }) {
  const id = useId();
  const transition = menu.motionOff
    ? { duration: 0 }
    : { type: "spring" as const, duration: 0.36, bounce: 0.06 };

  return (
    <nav
      className="ein-menu"
      aria-label="Navegação em ilha expansível"
      data-orientation={menu.orientation}
      data-expanded={menu.expanded}
      data-motion-off={menu.motionOff}
    >
      <motion.ul className="ein-island" layout transition={transition}>
        {menu.items.map((item) => {
          const active = menu.activeId === item.id;
          const Icon = item.icon;
          return (
            <motion.li key={item.id} className="ein-item" layout transition={transition}>
              <motion.button
                {...menu.bindItem(item.id)}
                type="button"
                className="ein-button"
                data-active={active}
                aria-label={item.label}
                title={!active || !menu.expanded ? item.label : undefined}
                onClick={() => menu.select(item.id)}
                layout
                transition={transition}
                whileTap={menu.motionOff ? undefined : { scale: 0.96 }}
              >
                {active && <motion.span className="ein-selected" layoutId={`${id}-selected`} transition={transition} />}
                <motion.span className="ein-icon" layout="position" transition={transition}>
                  <Icon size={20} strokeWidth={1.9} aria-hidden="true" />
                </motion.span>
                <AnimatePresence initial={false} mode="popLayout">
                  {active && menu.expanded && (
                    <motion.span
                      key={item.id}
                      className="ein-label"
                      initial={menu.motionOff ? false : { opacity: 0, x: -5, filter: "blur(2px)" }}
                      animate={{ opacity: 1, x: 0, filter: "blur(0px)" }}
                      exit={{ opacity: 0, x: -2, filter: "blur(1px)" }}
                      transition={{ duration: menu.motionOff ? 0 : 0.2, ease: [0.22, 1, 0.36, 1] }}
                    >
                      {item.label}
                    </motion.span>
                  )}
                </AnimatePresence>
              </motion.button>
            </motion.li>
          );
        })}
      </motion.ul>
    </nav>
  );
}

export default function ExpandingIslandNav({ accent }: PatternPreviewProps) {
  return (
    <CompactMenuShowcase
      name="Ilha expansível"
      description="Uma ilha compacta abre espaço apenas para o destino em uso."
      accent={accent || "#575488"}
    >
      {(menu) => <ExpandingIsland menu={menu} />}
    </CompactMenuShowcase>
  );
}
