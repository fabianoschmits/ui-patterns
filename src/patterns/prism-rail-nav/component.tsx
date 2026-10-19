"use client";

import { useId, useState } from "react";
import { ChevronRight } from "lucide-react";
import { LayoutGroup, motion } from "motion/react";
import { CompactMenuShowcase, useCompactMenu } from "@/patterns/navigation-collection/shared";
import type { PatternPreviewProps } from "@/types/pattern";
import "./prism-rail.css";

type Menu = ReturnType<typeof useCompactMenu>;

function PrismRail({ menu }: { menu: Menu }) {
  const groupId = useId();
  const [keyboard, setKeyboard] = useState(false);
  const vertical = menu.orientation === "vertical";
  const instant = menu.motionOff || keyboard;
  const transition = instant ? { duration: 0 } : { type: "spring" as const, stiffness: 420, damping: 32, mass: 0.75 };

  return (
    <LayoutGroup id={groupId}>
      <motion.nav
        layout
        aria-label="Menu Prism Rail"
        className="prism-rail"
        data-orientation={menu.orientation}
        data-expanded={menu.expanded}
        data-motion-off={instant}
        onKeyDownCapture={() => setKeyboard(true)}
        onPointerDownCapture={() => setKeyboard(false)}
        transition={transition}
      >
        <span className="prism-rail-channel" aria-hidden="true" />
        {menu.items.map((item) => {
          const selected = menu.activeId === item.id;
          const Icon = item.icon;
          return (
            <motion.button
              layout
              key={item.id}
              type="button"
              {...menu.bindItem(item.id)}
              className="prism-rail-key"
              data-selected={selected}
              aria-label={item.label}
              title={!menu.expanded ? item.label : undefined}
              onClick={() => menu.select(item.id)}
              transition={transition}
              whileTap={instant ? undefined : { scale: 0.97 }}
            >
              <motion.span
                className="prism-rail-face"
                aria-hidden="true"
                animate={{ x: vertical && selected ? 4 : 0, y: !vertical && selected ? -3 : 0 }}
                transition={transition}
              />
              {selected ? (
                <motion.span
                  layoutId="prism-cursor"
                  className="prism-rail-cursor"
                  aria-hidden="true"
                  transition={transition}
                />
              ) : null}
              <motion.span
                className="prism-rail-glyph"
                animate={{ x: vertical && selected ? 4 : 0, y: !vertical && selected ? -3 : 0 }}
                transition={transition}
              >
                <Icon size={19} strokeWidth={selected ? 2.2 : 1.65} aria-hidden="true" />
              </motion.span>
              {menu.expanded ? <span className="prism-rail-label">{item.label}</span> : null}
              {vertical && menu.expanded ? (
                <motion.span className="prism-rail-chevron" animate={{ opacity: selected ? 1 : 0, x: selected ? 0 : -4 }} transition={transition}>
                  <ChevronRight size={13} aria-hidden="true" />
                </motion.span>
              ) : null}
            </motion.button>
          );
        })}
      </motion.nav>
    </LayoutGroup>
  );
}

export default function PrismRailNavDemo({ accent }: PatternPreviewProps) {
  return (
    <CompactMenuShowcase name="Trilho prisma" defaultOrientation="vertical" description="Teclas chanfradas, trilho preciso e um cursor que acompanha cada escolha." accent={accent || "#315b70"}>
      {(menu) => <PrismRail menu={menu} />}
    </CompactMenuShowcase>
  );
}
