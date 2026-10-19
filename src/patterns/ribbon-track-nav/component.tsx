"use client";

import { useId, useState } from "react";
import { LayoutGroup, motion } from "motion/react";
import { CompactMenuShowcase, useCompactMenu } from "@/patterns/navigation-collection/shared";
import type { PatternPreviewProps } from "@/types/pattern";
import "./ribbon-track.css";

type Menu = ReturnType<typeof useCompactMenu>;

function RibbonTrack({ menu }: { menu: Menu }) {
  const groupId = useId();
  const [keyboard, setKeyboard] = useState(false);
  const instant = menu.motionOff || keyboard;
  const transition = instant ? { duration: 0 } : { type: "spring" as const, stiffness: 460, damping: 34, mass: 0.65 };
  return (
    <LayoutGroup id={groupId}>
      <motion.nav
        layout
        className="ribbon-track"
        aria-label="Menu Ribbon Track"
        data-orientation={menu.orientation}
        data-expanded={menu.expanded}
        data-motion-off={instant}
        onKeyDownCapture={() => setKeyboard(true)}
        onPointerDownCapture={() => setKeyboard(false)}
        transition={transition}
      >
        <span className="ribbon-track-edge" aria-hidden="true" />
        {menu.items.map((item) => {
          const selected = menu.activeId === item.id;
          const Icon = item.icon;
          return (
            <motion.button
              layout
              key={item.id}
              type="button"
              {...menu.bindItem(item.id)}
              className="ribbon-track-item"
              data-selected={selected}
              aria-label={item.label}
              title={!menu.expanded ? item.label : undefined}
              onClick={() => menu.select(item.id)}
              whileTap={instant ? undefined : { scale: 0.96 }}
              transition={transition}
            >
              {selected ? <motion.span layoutId="ribbon-bracket" className="ribbon-track-bracket" aria-hidden="true" transition={transition} /> : null}
              <motion.span className="ribbon-track-glyph" animate={{ y: selected && menu.orientation === "horizontal" ? -2 : 0 }} transition={transition}>
                <Icon size={18} strokeWidth={selected ? 2.15 : 1.65} aria-hidden="true" />
              </motion.span>
              {menu.expanded ? (
                <span className="ribbon-track-label" aria-hidden="true">
                  <span>{item.label}</span><b>{item.label}</b>
                </span>
              ) : null}
              <span className="ribbon-track-tick" aria-hidden="true" />
            </motion.button>
          );
        })}
      </motion.nav>
    </LayoutGroup>
  );
}

export default function RibbonTrackNavDemo({ accent }: PatternPreviewProps) {
  return (
    <CompactMenuShowcase name="Fita de navegação" description="Uma fita segmentada: o marcador desliza e a tipografia revela a seleção." accent={accent || "#864454"}>
      {(menu) => <RibbonTrack menu={menu} />}
    </CompactMenuShowcase>
  );
}
