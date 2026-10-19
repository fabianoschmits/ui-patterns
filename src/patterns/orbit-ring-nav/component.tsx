"use client";

import { AnimatePresence, motion } from "motion/react";
import type { CSSProperties } from "react";
import type { PatternPreviewProps } from "@/types/pattern";
import { CompactMenuShowcase, type CompactMenuState } from "@/patterns/navigation-collection/shared";
import "./orbit-ring.css";

function OrbitRing({ menu }: { menu: CompactMenuState }) {
  const { items, activeId, activeItem, select, bindItem, expanded, orientation, motionOff } = menu;
  const isVertical = orientation === "vertical";
  const radiusX = isVertical ? 86 : 102;
  const radiusY = isVertical ? 102 : 93;
  const ActiveIcon = activeItem.icon;
  const transition = motionOff ? { duration: 0 } : { duration: 0.2, ease: [0.22, 0.78, 0.24, 1] as const };

  return (
    <nav
      className="orr-nav"
      aria-label="Navegação em órbita"
      data-orientation={orientation}
      data-expanded={expanded}
      data-motion-off={motionOff}
    >
      <svg className="orr-track" viewBox="0 0 284 284" fill="none" aria-hidden="true">
        <ellipse cx="142" cy="142" rx={radiusX} ry={radiusY} />
      </svg>
      <div className="orr-center" aria-hidden="true">
        <AnimatePresence initial={false} mode="wait">
          <motion.span
            key={activeItem.id}
            className="orr-current"
            initial={motionOff ? false : { opacity: 0, y: 4 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: motionOff ? 0 : -3 }}
            transition={transition}
          >
            <ActiveIcon size={24} strokeWidth={1.7} />
            <span>{activeItem.label}</span>
          </motion.span>
        </AnimatePresence>
        <span className="orr-center-dot" />
      </div>

      {items.map((item, index) => {
        const angle = (-90 + (index * 360) / items.length) * Math.PI / 180;
        const Icon = item.icon;
        const selected = activeId === item.id;
        return (
          <button
            key={item.id}
            {...bindItem(item.id)}
            type="button"
            className={`orr-item${selected ? " is-active" : ""}`}
            style={{ "--orr-x": `${Math.cos(angle) * radiusX}px`, "--orr-y": `${Math.sin(angle) * radiusY}px` } as CSSProperties}
            aria-label={item.label}
            title={!expanded ? item.label : undefined}
            onClick={() => select(item.id)}
          >
            <span className="orr-icon"><Icon size={19} strokeWidth={1.7} /></span>
            {expanded ? <span className="orr-label">{item.label}</span> : null}
          </button>
        );
      })}
    </nav>
  );
}

export default function OrbitRingNavDemo(props: PatternPreviewProps) {
  return (
    <CompactMenuShowcase
      name="Anel orbital"
      description="Cinco destinos ao redor da página atual."
      accent={props.accent ?? "#315b70"}
    >
      {(menu) => <OrbitRing menu={menu} />}
    </CompactMenuShowcase>
  );
}
