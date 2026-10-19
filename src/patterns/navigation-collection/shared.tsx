"use client";

import { useId, useRef, useState, useSyncExternalStore, type CSSProperties, type KeyboardEvent, type ReactNode } from "react";
import { BookOpen, Compass, Heart, Home, Layers3, LogIn, MessageCircle, Search, User, type LucideIcon } from "lucide-react";
import { MotionConfig } from "motion/react";
import { MenuShowcase, type AccentSwatch } from "@/patterns/shared/menu-showcase";
import "./compact.css";

export interface CompactMenuItem { id: string; label: string; icon: LucideIcon }
const memberItems: CompactMenuItem[] = [
  { id: "home", label: "Início", icon: Home },
  { id: "explore", label: "Explorar", icon: Compass },
  { id: "saved", label: "Salvos", icon: Heart },
  { id: "messages", label: "Conversas", icon: MessageCircle },
  { id: "profile", label: "Perfil", icon: User },
];
const publicItems: CompactMenuItem[] = [
  { id: "home", label: "Início", icon: Home },
  { id: "explore", label: "Explorar", icon: Search },
  { id: "collections", label: "Coleções", icon: Layers3 },
  { id: "about", label: "Sobre", icon: BookOpen },
  { id: "login", label: "Entrar", icon: LogIn },
];
export const COMPACT_ACCENTS: AccentSwatch[] = [
  { name: "Floresta", value: "#2f6f5e" }, { name: "Petróleo", value: "#315b70" },
  { name: "Borgonha", value: "#864454" }, { name: "Argila", value: "#a9573c" },
  { name: "Oliva", value: "#687344" }, { name: "Índigo", value: "#575488" },
  { name: "Grafite", value: "#4c5059" }, { name: "Café", value: "#795747" },
];

function subscribeReducedMotion(listener: () => void) {
  const preference = window.matchMedia("(prefers-reduced-motion: reduce)");
  preference.addEventListener("change", listener);
  return () => preference.removeEventListener("change", listener);
}
const getReducedMotion = () => window.matchMedia("(prefers-reduced-motion: reduce)").matches;
const getServerReducedMotion = () => false;
const subscribeHydration = () => () => {};
const getClientReady = () => true;
const getServerReady = () => false;

export function useCompactMenu(initialOrientation: "horizontal" | "vertical" = "horizontal") {
  const uid = useId();
  const reduced = useSyncExternalStore(subscribeReducedMotion, getReducedMotion, getServerReducedMotion);
  const ready = useSyncExternalStore(subscribeHydration, getClientReady, getServerReady);
  const [activeId, setActiveId] = useState("home");
  const [mode, setMode] = useState("logged");
  const [orientation, setOrientation] = useState(initialOrientation);
  const [expanded, setExpanded] = useState(true);
  const [keyboard, setKeyboard] = useState(false);
  const refs = useRef(new Map<string, HTMLButtonElement>());
  const items = mode === "logged" ? memberItems : publicItems;
  const activeItem = items.find((item) => item.id === activeId) ?? items[0];
  const select = (id: string) => { if (items.some((item) => item.id === id)) setActiveId(id); };
  const bindItem = (id: string) => ({
    ref: (element: HTMLButtonElement | null) => { if (element) refs.current.set(id, element); else refs.current.delete(id); },
    tabIndex: activeId === id ? 0 : -1,
    "aria-current": activeId === id ? "page" as const : undefined,
    onKeyDown: (event: KeyboardEvent<HTMLButtonElement>) => {
      const index = items.findIndex((item) => item.id === id);
      const steps: Record<string, number> = { ArrowRight: 1, ArrowDown: 1, ArrowLeft: -1, ArrowUp: -1 };
      const next = event.key === "Home" ? 0 : event.key === "End" ? items.length - 1
        : event.key in steps ? (index + steps[event.key] + items.length) % items.length : null;
      if (next === null) return;
      event.preventDefault();
      setKeyboard(true);
      setActiveId(items[next].id);
      refs.current.get(items[next].id)?.focus();
    },
  });
  return { uid, ready, items, activeId, activeItem, select, bindItem, motionOff: Boolean(reduced) || keyboard,
    orientation, expanded, mode, setMode: (value: string) => { setMode(value); setActiveId("home"); },
    setOrientation, setExpanded, setKeyboard };
}
export type CompactMenuState = ReturnType<typeof useCompactMenu>;

export function CompactMenuShowcase({ name, description, accent: initialAccent = "#2f6f5e", defaultOrientation = "horizontal", children }: {
  name: string; description: string; accent?: string;
  defaultOrientation?: "horizontal" | "vertical";
  children: ReactNode | ((menu: CompactMenuState) => ReactNode);
}) {
  const menu = useCompactMenu(defaultOrientation);
  const [accent, setAccent] = useState(initialAccent);
  const [surface, setSurface] = useState("auto");
  const surfaceLightness = surface === "auto" ? null : [1, 3, 5].reduce((sum, offset, i) =>
    sum + parseInt(surface.slice(offset, offset + 2), 16) * [.2126, .7152, .0722][i], 0);
  const surfaceInk = surfaceLightness === null ? "var(--ink)" : surfaceLightness > 135 ? "#1a1b1f" : "#f2efe8";
  return (
    <MotionConfig reducedMotion="user" transition={menu.motionOff ? { duration: 0 } : { type: "spring", stiffness: 360, damping: 30 }}>
      <MenuShowcase className={`compact-menu-show${menu.motionOff ? " cm-motion-off" : ""}`} eyebrow={name}
        title={menu.activeItem.label} description={description} accent={accent} onAccentChange={setAccent}
        accents={COMPACT_ACCENTS} surface={surface} onSurfaceChange={setSurface} draggableRoulette
        modes={[{ id: "public", label: "Público" }, { id: "logged", label: "Logado" }]} mode={menu.mode} onModeChange={menu.setMode}
        variants={[{ id: "horizontal", label: "Horizontal" }, { id: "vertical", label: "Vertical" }]}
        variant={menu.orientation} onVariantChange={(id) => menu.setOrientation(id as "horizontal" | "vertical")}
        extras={<div className="menu-show-mode" role="group" aria-label="Rótulos do menu">
          <button type="button" className={menu.expanded ? "active" : undefined} aria-pressed={menu.expanded} onClick={() => menu.setExpanded(true)}>Rótulos</button>
          <button type="button" className={!menu.expanded ? "active" : undefined} aria-pressed={!menu.expanded} onClick={() => menu.setExpanded(false)}>Ícones</button>
        </div>}
        style={{ "--cm-accent": accent, "--cm-surface": surface === "auto" ? "var(--canvas)" : surface,
          "--cm-ink": surfaceInk, "--cm-muted": "color-mix(in srgb, var(--cm-ink) 66%, transparent)" } as CSSProperties}>
        <div className="cm-demo" data-ready={menu.ready} data-orientation={menu.orientation} data-expanded={menu.expanded}
          onPointerDownCapture={() => menu.setKeyboard(false)} onKeyDownCapture={() => menu.setKeyboard(true)}>
          {typeof children === "function" ? children(menu) : children}
        </div>
      </MenuShowcase>
    </MotionConfig>
  );
}
