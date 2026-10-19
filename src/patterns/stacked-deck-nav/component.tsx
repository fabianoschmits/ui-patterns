"use client";

import { useEffect, useRef, useState } from "react";
import { motion } from "motion/react";
import { ArrowUpRight, ChevronDown, Layers2 } from "lucide-react";
import type { PatternPreviewProps } from "@/types/pattern";
import { CompactMenuShowcase, type CompactMenuState } from "@/patterns/navigation-collection/shared";
import "./deck.css";

function Deck({ menu }: { menu: CompactMenuState }) {
  const [open, setOpen] = useState(true);
  const [animateEntry, setAnimateEntry] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const focusOnOpen = useRef(false);
  const panelId = `deck-${menu.uid}`;
  const ActiveIcon = menu.activeItem.icon;

  useEffect(() => {
    if (open && focusOnOpen.current) {
      rootRef.current?.querySelector<HTMLButtonElement>("nav [aria-current='page']")?.focus();
      focusOnOpen.current = false;
    }
  }, [open]);

  useEffect(() => {
    if (!open) return;
    const closeOutside = (event: PointerEvent) => {
      if (event.target instanceof Node && !rootRef.current?.contains(event.target)) setOpen(false);
    };
    document.addEventListener("pointerdown", closeOutside);
    return () => document.removeEventListener("pointerdown", closeOutside);
  }, [open]);

  return (
    <div className="deck-menu" ref={rootRef} data-open={open} data-orientation={menu.orientation}
      onKeyDown={(event) => {
        if (event.key === "Escape" && open) { event.preventDefault(); setOpen(false); triggerRef.current?.focus(); }
      }}>
      <span className="deck-menu__back deck-menu__back--far" aria-hidden="true" />
      <span className="deck-menu__back" aria-hidden="true" />
      <button className="deck-menu__trigger" type="button" ref={triggerRef} aria-expanded={open} aria-controls={panelId}
        aria-label={`${open ? "Fechar" : "Abrir"} pilha de navegação. Página atual: ${menu.activeItem.label}`}
        onClick={() => { focusOnOpen.current = !open; if (!open) setAnimateEntry(true); setOpen(!open); }}
        onKeyDown={(event) => { if (event.key === "ArrowDown" && !open) { event.preventDefault(); focusOnOpen.current = true; setAnimateEntry(true); setOpen(true); } }}>
        <span className="deck-menu__brand"><Layers2 size={17} /> <span>Navegar</span></span>
        <span className="deck-menu__current"><ActiveIcon size={15} />{menu.expanded && menu.activeItem.label}</span>
        <motion.span animate={{ rotate: open ? 180 : 0 }} transition={{ duration: menu.motionOff ? 0 : .24 }}><ChevronDown size={15} /></motion.span>
      </button>
        {open && <motion.nav key="deck-panel" id={panelId} aria-label="Pilha retrátil" className="deck-menu__panel"
          initial={menu.motionOff || !animateEntry ? false : { opacity: 0, y: -12, scaleY: .94 }} animate={{ opacity: 1, y: 0, scaleY: 1 }}
          transition={{ duration: menu.motionOff ? 0 : .26 }}
          onBlur={(event) => { if (!event.currentTarget.parentElement?.contains(event.relatedTarget as Node | null)) setOpen(false); }}>
          {menu.items.map((item, index) => {
            const Icon = item.icon;
            const selected = item.id === menu.activeId;
            return <motion.button key={item.id} {...menu.bindItem(item.id)} type="button" className="deck-menu__item"
              aria-label={item.label} data-active={selected} title={!menu.expanded ? item.label : undefined}
              initial={menu.motionOff || !animateEntry ? false : { opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }}
              transition={{ duration: menu.motionOff ? 0 : .22, delay: menu.motionOff ? 0 : index * .035 }}
              onClick={() => { menu.select(item.id); setOpen(false); triggerRef.current?.focus(); }}>
              <span className="deck-menu__icon"><Icon size={18} strokeWidth={1.8} /></span>
              {menu.expanded && <span className="deck-menu__label">{item.label}</span>}
              {selected ? <span className="deck-menu__dot" aria-hidden="true" /> : <ArrowUpRight size={13} className="deck-menu__arrow" aria-hidden="true" />}
            </motion.button>;
          })}
        </motion.nav>}
    </div>
  );
}

export default function StackedDeckNav({ accent }: PatternPreviewProps) {
  return <CompactMenuShowcase name="Pilha retrátil" description="Abra as camadas, escolha um destino e recolha o menu em um gesto." accent={accent || "#795747"}>
    {(menu) => <Deck menu={menu} />}
  </CompactMenuShowcase>;
}
