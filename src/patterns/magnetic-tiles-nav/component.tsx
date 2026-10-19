"use client";

import { useState } from "react";
import { motion } from "motion/react";
import { CompactMenuShowcase, useCompactMenu } from "@/patterns/navigation-collection/shared";
import type { PatternPreviewProps } from "@/types/pattern";
import "./magnetic-tiles.css";

type Menu = ReturnType<typeof useCompactMenu>;

function MagneticTiles({ menu }: { menu: Menu }) {
  const [hovered, setHovered] = useState<number | null>(null);
  const [keyboard, setKeyboard] = useState(false);
  const vertical = menu.orientation === "vertical";
  const instant = menu.motionOff || keyboard;
  const transition = instant ? { duration: 0 } : { type: "spring" as const, stiffness: 390, damping: 24, mass: 0.7 };

  return (
    <motion.nav
      layout
      className="magnetic-tiles"
      aria-label="Menu Magnetic Tiles"
      data-orientation={menu.orientation}
      data-expanded={menu.expanded}
      data-motion-off={instant}
      onPointerLeave={() => setHovered(null)}
      onKeyDownCapture={() => { setKeyboard(true); setHovered(null); }}
      onPointerDownCapture={() => setKeyboard(false)}
      transition={transition}
    >
      <span className="magnetic-tiles-plinth" aria-hidden="true" />
      {menu.items.map((item, index) => {
        const Icon = item.icon;
        const selected = menu.activeId === item.id;
        const distance = hovered === null ? 10 : index - hovered;
        const hover = distance === 0;
        const neighbor = Math.abs(distance) === 1;
        const lift = hover ? 12 : selected ? 7 : neighbor ? 3 : 0;
        return (
          <motion.button
            layout
            key={item.id}
            type="button"
            {...menu.bindItem(item.id)}
            className="magnetic-tiles-item"
            data-selected={selected}
            aria-label={item.label}
            title={!menu.expanded ? item.label : undefined}
            onPointerEnter={(event) => { if (event.pointerType !== "touch") { setKeyboard(false); setHovered(index); } }}
            onClick={() => menu.select(item.id)}
            whileTap={instant ? undefined : { scale: 0.96 }}
            transition={transition}
          >
            <motion.span
              className="magnetic-tiles-tile"
              animate={{ x: vertical ? lift * 0.55 : 0, y: vertical ? 0 : -lift, rotateX: !instant && hover ? 9 : 0, rotateY: !instant && neighbor ? distance * -7 : 0, rotateZ: !instant && neighbor ? distance * 2 : 0, scale: hover ? 1.045 : 1 }}
              transition={transition}
            >
              <span className="magnetic-tiles-rim" aria-hidden="true" />
              <Icon size={21} strokeWidth={selected ? 2.2 : 1.65} aria-hidden="true" />
              <span className="magnetic-tiles-groove" aria-hidden="true"><i /><i /><i /></span>
            </motion.span>
            {menu.expanded ? <span className="magnetic-tiles-label">{item.label}</span> : null}
            <span className="magnetic-tiles-status" aria-hidden="true"><i /><i /></span>
          </motion.button>
        );
      })}
    </motion.nav>
  );
}

export default function MagneticTilesNavDemo({ accent }: PatternPreviewProps) {
  return (
    <CompactMenuShowcase name="Teclas magnéticas" description="Peças independentes se elevam e respondem ao movimento dos seus vizinhos." accent={accent || "#795747"}>
      {(menu) => <MagneticTiles menu={menu} />}
    </CompactMenuShowcase>
  );
}
