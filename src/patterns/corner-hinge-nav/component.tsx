"use client";

import { useEffect, useRef, useState, type KeyboardEvent } from "react";
import { CornerUpRight, X } from "lucide-react";
import { motion } from "motion/react";
import type { PatternPreviewProps } from "@/types/pattern";
import { CompactMenuShowcase, type CompactMenuItem, type CompactMenuState } from "@/patterns/navigation-collection/shared";
import "./corner-hinge.css";

function CornerHinge({ menu }: { menu: CompactMenuState }) {
  const { uid, items, activeId, activeItem, select, bindItem, expanded, orientation, motionOff } = menu;
  const [open, setOpen] = useState(true);
  const [animateEntry, setAnimateEntry] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);
  const navRef = useRef<HTMLElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const focusOnOpen = useRef(false);
  const verticalItems = items.slice(0, orientation === "vertical" ? 3 : 2);
  const horizontalItems = items.slice(verticalItems.length);
  const navId = `corner-navigation-${uid}`;

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

  const destination = (item: CompactMenuItem) => {
    const Icon = item.icon;
    return (
      <button
        key={item.id}
        {...bindItem(item.id)}
        type="button"
        className={`ch-item${activeId === item.id ? " is-active" : ""}`}
        aria-label={item.label}
        title={!expanded ? item.label : undefined}
        onClick={() => { select(item.id); close(true); }}
      >
        <Icon size={18} strokeWidth={1.7} />
        {expanded ? <span>{item.label}</span> : null}
      </button>
    );
  };

  return (
    <div ref={rootRef} className="ch-nav" data-open={open} data-expanded={expanded} data-orientation={orientation} data-motion-off={motionOff} onKeyDown={onKeyDown}>
      {open ? (
        <nav ref={navRef} id={navId} className="ch-arms" aria-label="Navegação de canto">
          <span className="ch-rail ch-rail-vertical" style={{ height: verticalItems.length * 52 + 12 }} aria-hidden="true" />
          <span className="ch-rail ch-rail-horizontal" aria-hidden="true" />
          <motion.div
            className="ch-arm ch-arm-vertical"
            initial={motionOff || !animateEntry ? false : { opacity: 0, rotateX: -68, y: 12 }}
            animate={{ opacity: 1, rotateX: 0, y: 0 }}
            transition={motionOff ? { duration: 0 } : { duration: 0.24, ease: [0.2, 0.8, 0.25, 1] }}
          >
            {verticalItems.map(destination)}
          </motion.div>
          <motion.div
            className="ch-arm ch-arm-horizontal"
            initial={motionOff || !animateEntry ? false : { opacity: 0, rotateY: -68, x: -12 }}
            animate={{ opacity: 1, rotateY: 0, x: 0 }}
            transition={motionOff ? { duration: 0 } : { duration: 0.22, delay: 0.055, ease: [0.2, 0.8, 0.25, 1] }}
          >
            {horizontalItems.map(destination)}
          </motion.div>
        </nav>
      ) : <span className="ch-current" aria-hidden="true">{activeItem.label}</span>}

      <button
        ref={triggerRef}
        className="ch-trigger"
        type="button"
        aria-label={open ? "Fechar navegação de canto" : `Abrir navegação de canto. Página atual: ${activeItem.label}`}
        aria-expanded={open}
        aria-controls={navId}
        title={open ? "Fechar menu" : "Abrir menu"}
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
        {open ? <X size={20} strokeWidth={1.8} /> : <CornerUpRight size={21} strokeWidth={1.8} />}
        <span className="ch-hinge-point" aria-hidden="true" />
      </button>
    </div>
  );
}

export default function CornerHingeNavDemo(props: PatternPreviewProps) {
  return (
    <CompactMenuShowcase name="Canto articulado" description="Uma esquina abre dois caminhos de navegação." accent={props.accent ?? "#795747"}>
      {(menu) => <CornerHinge menu={menu} />}
    </CompactMenuShowcase>
  );
}
