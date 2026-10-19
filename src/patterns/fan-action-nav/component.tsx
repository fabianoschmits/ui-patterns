"use client";

import { useEffect, useRef, useState, type CSSProperties, type KeyboardEvent } from "react";
import { ArrowUpRight, Check, ChevronUp, X } from "lucide-react";
import { motion } from "motion/react";
import type { PatternPreviewProps } from "@/types/pattern";
import { CompactMenuShowcase, type CompactMenuState } from "@/patterns/navigation-collection/shared";
import "./fan-action.css";

function FanActions({ menu }: { menu: CompactMenuState }) {
  const { items, activeId, activeItem, select, bindItem, expanded, orientation, motionOff, uid } = menu;
  const [open, setOpen] = useState(true);
  const [animateEntry, setAnimateEntry] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);
  const navRef = useRef<HTMLElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const focusOnOpen = useRef(false);
  const ActiveIcon = activeItem.icon;
  const isVertical = orientation === "vertical";
  const navId = `fan-navigation-${uid}`;

  const focusCurrent = () => {
    const nav = navRef.current;
    (nav?.querySelector<HTMLButtonElement>('[aria-current="page"]') ?? nav?.querySelector<HTMLButtonElement>("button"))?.focus();
  };

  useEffect(() => {
    if (!open) return;
    const closeOutside = (event: PointerEvent) => {
      if (event.target instanceof Node && !rootRef.current?.contains(event.target)) setOpen(false);
    };
    document.addEventListener("pointerdown", closeOutside, true);
    return () => document.removeEventListener("pointerdown", closeOutside, true);
  }, [open]);

  useEffect(() => {
    if (!open || !focusOnOpen.current) return;
    focusOnOpen.current = false;
    focusCurrent();
  }, [open]);

  const close = (restoreFocus: boolean) => {
    setOpen(false);
    if (restoreFocus) triggerRef.current?.focus();
  };

  const onKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
    if (event.key !== "Escape" || !open) return;
    event.preventDefault();
    event.stopPropagation();
    close(true);
  };

  return (
    <div
      ref={rootRef}
      className="fan-nav"
      data-open={open}
      data-expanded={expanded}
      data-orientation={orientation}
      data-motion-off={motionOff}
      onKeyDown={onKeyDown}
    >
      {open ? (
        <nav ref={navRef} id={navId} className="fan-leaves" aria-label="Navegação em leque">
          {items.map((item, index) => {
            const Icon = item.icon;
            const selected = activeId === item.id;
            const offset = isVertical ? index * 12 : (items.length - 1 - index) * 12;
            return (
              <motion.button
                key={item.id}
                {...bindItem(item.id)}
                type="button"
                className={`fan-leaf${selected ? " is-active" : ""}`}
                style={{
                  "--fan-indent": `${offset}px`,
                  "--fan-row": index,
                  transformOrigin: `${isVertical ? "calc(100% - 22px)" : "22px"} ${244 - index * 47}px`,
                } as CSSProperties}
                initial={motionOff || !animateEntry ? false : { opacity: 0, rotate: isVertical ? 11 : -11, y: 12 }}
                animate={{ opacity: 1, rotate: 0, y: 0 }}
                transition={motionOff ? { duration: 0 } : { duration: 0.23, delay: (items.length - 1 - index) * 0.025, ease: [0.2, 0.8, 0.25, 1] }}
                aria-label={item.label}
                title={!expanded ? item.label : undefined}
                onClick={() => { select(item.id); close(true); }}
              >
                <span className="fan-leaf-icon"><Icon size={17} strokeWidth={1.7} /></span>
                {expanded ? <><span className="fan-leaf-label">{item.label}</span>{selected ? <Check className="fan-leaf-end" size={14} /> : <ArrowUpRight className="fan-leaf-end" size={14} />}</> : null}
              </motion.button>
            );
          })}
        </nav>
      ) : null}

      <button
        ref={triggerRef}
        type="button"
        className="fan-trigger"
        aria-label={open ? "Fechar navegação em leque" : `Abrir navegação em leque. Página atual: ${activeItem.label}`}
        aria-expanded={open}
        aria-controls={navId}
        title={!expanded ? (open ? "Fechar menu" : "Abrir menu") : undefined}
        onClick={(event) => {
          if (open) close(false);
          else { focusOnOpen.current = event.detail === 0; setAnimateEntry(true); setOpen(true); }
        }}
        onKeyDown={(event) => {
          if (event.key !== "ArrowDown" && event.key !== "ArrowUp") return;
          event.preventDefault();
          if (open) focusCurrent();
          else { focusOnOpen.current = true; setAnimateEntry(true); setOpen(true); }
        }}
      >
        <span className="fan-trigger-pivot">{open ? <X size={18} strokeWidth={1.8} /> : <ActiveIcon size={18} strokeWidth={1.8} />}</span>
        {expanded ? <><span>{open ? "Fechar menu" : activeItem.label}</span><ChevronUp className="fan-trigger-chevron" size={15} /></> : null}
      </button>
    </div>
  );
}

export default function FanActionNavDemo(props: PatternPreviewProps) {
  return (
    <CompactMenuShowcase name="Leque de ações" description="Os atalhos se abrem a partir de uma única dobradiça." accent={props.accent ?? "#687344"}>
      {(menu) => <FanActions menu={menu} />}
    </CompactMenuShowcase>
  );
}
