"use client";

import { useCallback, useEffect, useId, useLayoutEffect, useRef, useState, type CSSProperties } from "react";
import {
  Briefcase,
  ChevronsLeft,
  ChevronsRight,
  HelpCircle,
  Home,
  Info,
  LogIn,
  Mail,
  Search,
  User,
  Users,
} from "lucide-react";
import { AnimatePresence, LayoutGroup, motion } from "motion/react";
import type { PatternPreviewProps } from "@/types/pattern";
import { MenuShowcase, MENU_ACCENTS } from "@/patterns/shared/menu-showcase";
import { cn } from "@/lib/utils";
import "./meniscus.css";

type Mode = "public" | "logged";
type Orientation = "horizontal" | "vertical";
type Side = "left" | "right";

const gooey = {
  type: "spring" as const,
  stiffness: 240,
  damping: 22,
  mass: 1.15,
};

const pillSpring = {
  type: "spring" as const,
  stiffness: 380,
  damping: 24,
  mass: 0.9,
};

interface MeniscusItem {
  id: string;
  label: string;
  Icon: React.ComponentType<{ className?: string; strokeWidth?: number }>;
}

const publicActions: MeniscusItem[] = [
  { id: "home", label: "Home", Icon: Home },
  { id: "login", label: "Login", Icon: LogIn },
  { id: "about", label: "Sobre", Icon: Info },
  { id: "help", label: "Ajuda", Icon: HelpCircle },
  { id: "contact", label: "Contato", Icon: Mail },
];

const loggedActions: MeniscusItem[] = [
  { id: "home", label: "Home", Icon: Home },
  { id: "feed", label: "Feed", Icon: Users },
  { id: "search", label: "Buscar", Icon: Search },
  { id: "classifieds", label: "Classificados", Icon: Briefcase },
  { id: "profile", label: "Perfil", Icon: User },
];

const clamp = (v: number, a: number, b: number) => (v < a ? a : v > b ? b : v);
const smooth = (t: number) => t * t * (3 - 2 * t);
const reach = (s: number, rb: number, by: number) =>
  Math.sqrt(Math.max((s + rb) ** 2 - (s - by) ** 2, 1));

function centerWithin(
  element: HTMLElement,
  ancestor: HTMLElement,
  axis: "x" | "y",
) {
  let value = axis === "x" ? element.offsetWidth / 2 : element.offsetHeight / 2;
  let node: HTMLElement | null = element;

  while (node && node !== ancestor) {
    value += axis === "x" ? node.offsetLeft : node.offsetTop;
    node = node.offsetParent as HTMLElement | null;
  }

  return value;
}

function troughTop(
  W: number,
  H: number,
  R: number,
  bx: number,
  by: number,
  rb: number,
  sL: number,
  sR: number,
) {
  const wing = (s: number, side: number) => {
    const L = s + rb;
    const half = reach(s, rb, by);
    const sx = bx + side * half;
    return {
      sx,
      tx: sx + ((bx - sx) / L) * s,
      ty: s + ((by - s) / L) * s,
    };
  };
  const A = wing(sL, -1);
  const B = wing(sR, +1);
  const a0 = Math.atan2(A.ty - by, A.tx - bx);
  const a1 = Math.atan2(B.ty - by, B.tx - bx);
  let sweep = ((a0 - a1) * 180) / Math.PI;
  while (sweep < 0) sweep += 360;
  const large = sweep > 180 ? 1 : 0;
  const n = (v: number) => v.toFixed(2);
  return (
    `M0 ${n(R)}` +
    `A${n(R)} ${n(R)} 0 0 1 ${n(R)} 0` +
    `L${n(clamp(A.sx, R, W - R))} 0` +
    `A${n(sL)} ${n(sL)} 0 0 1 ${n(A.tx)} ${n(A.ty)}` +
    `A${n(rb)} ${n(rb)} 0 ${large} 0 ${n(B.tx)} ${n(B.ty)}` +
    `A${n(sR)} ${n(sR)} 0 0 1 ${n(clamp(B.sx, R, W - R))} 0` +
    `L${n(W - R)} 0` +
    `A${n(R)} ${n(R)} 0 0 1 ${n(W)} ${n(R)}` +
    `L${n(W)} ${n(H - R)}` +
    `A${n(R)} ${n(R)} 0 0 1 ${n(W - R)} ${n(H)}` +
    `L${n(R)} ${n(H)}` +
    `A${n(R)} ${n(R)} 0 0 1 0 ${n(H - R)}` +
    `Z`
  );
}

/** Left-edge meniscus via transpose of the proven top trough. */
function troughLeft(
  W: number,
  H: number,
  R: number,
  by: number,
  bx: number,
  rb: number,
  sT: number,
  sB: number,
) {
  const top = troughTop(H, W, R, by, bx, rb, sT, sB);
  const tokens = top.match(/[MLAZ]|-?\d*\.?\d+(?:e[-+]?\d+)?/gi) ?? [];
  let i = 0;
  let out = "";
  while (i < tokens.length) {
    const cmd = tokens[i++];
    if (cmd === "Z" || cmd === "z") {
      out += "Z";
      continue;
    }
    if (cmd === "M" || cmd === "L") {
      const x = Number(tokens[i++]);
      const y = Number(tokens[i++]);
      out += `${cmd}${y.toFixed(2)} ${x.toFixed(2)}`;
      continue;
    }
    if (cmd === "A") {
      const rx = Number(tokens[i++]);
      const ry = Number(tokens[i++]);
      const rot = tokens[i++];
      const large = tokens[i++];
      const sweep = tokens[i++];
      const x = Number(tokens[i++]);
      const y = Number(tokens[i++]);
      const sweepFlip = sweep === "1" ? "0" : "1";
      out += `A${ry.toFixed(2)} ${rx.toFixed(2)} ${rot} ${large} ${sweepFlip} ${y.toFixed(2)} ${x.toFixed(2)}`;
    }
  }
  return out;
}

/** Right-edge meniscus: mirror of the left trough across the dock width. */
function troughRight(
  W: number,
  H: number,
  R: number,
  by: number,
  bxFromRight: number,
  rb: number,
  sT: number,
  sB: number,
) {
  const left = troughLeft(W, H, R, by, bxFromRight, rb, sT, sB);
  const tokens = left.match(/[MLAZ]|-?\d*\.?\d+(?:e[-+]?\d+)?/gi) ?? [];
  let i = 0;
  let out = "";
  while (i < tokens.length) {
    const cmd = tokens[i++];
    if (cmd === "Z" || cmd === "z") {
      out += "Z";
      continue;
    }
    if (cmd === "M" || cmd === "L") {
      const x = Number(tokens[i++]);
      const y = Number(tokens[i++]);
      out += `${cmd}${(W - x).toFixed(2)} ${y.toFixed(2)}`;
      continue;
    }
    if (cmd === "A") {
      const rx = Number(tokens[i++]);
      const ry = Number(tokens[i++]);
      const rot = tokens[i++];
      const large = tokens[i++];
      const sweep = tokens[i++];
      const x = Number(tokens[i++]);
      const y = Number(tokens[i++]);
      const sweepFlip = sweep === "1" ? "0" : "1";
      out += `A${rx.toFixed(2)} ${ry.toFixed(2)} ${rot} ${large} ${sweepFlip} ${(W - x).toFixed(2)} ${y.toFixed(2)}`;
    }
  }
  return out;
}

export default function MeniscusLiquidNav(_props: PatternPreviewProps) {
  const uid = useId().replace(/:/g, "");
  const rootRef = useRef<HTMLDivElement>(null);
  const dockRef = useRef<HTMLDivElement>(null);
  const glassRef = useRef<HTMLDivElement>(null);
  const skinRef = useRef<SVGSVGElement>(null);
  const fillRef = useRef<SVGPathElement>(null);
  const clipRef = useRef<SVGPathElement>(null);
  const beadRef = useRef<HTMLSpanElement>(null);
  const tabRefs = useRef<(HTMLButtonElement | null)[]>([]);
  const currentRef = useRef(0);
  const actionsRef = useRef(loggedActions);
  const orientationRef = useRef<Orientation>("horizontal");
  const sideRef = useRef<Side>("left");

  const [mode, setMode] = useState<Mode>("logged");
  const [orientation, setOrientation] = useState<Orientation>("horizontal");
  const [side, setSide] = useState<Side>("left");
  const [expanded, setExpanded] = useState(true);
  const [current, setCurrent] = useState(0);
  const [ready, setReady] = useState(false);
  const [box, setBox] = useState({ w: 400, h: 48 });
  const [accent, setAccent] = useState(MENU_ACCENTS[0].value);

  const actions = mode === "logged" ? loggedActions : publicActions;
  actionsRef.current = actions;
  orientationRef.current = orientation;
  sideRef.current = side;
  const isVertical = orientation === "vertical";
  const isCollapsed = isVertical && !expanded;
  const isRight = isVertical && side === "right";
  const active = actions[current] ?? actions[0];

  const physics = useRef({
    x: 0,
    v: 0,
    target: 0,
    dragging: false,
    moved: false,
    slots: [] as number[],
    span: 80,
    W: 0,
    H: 0,
    R: 20,
    D: 56,
    RB: 35,
    S: 17,
    CX: 0,
    CY: 0,
    raf: 0,
    last: 0,
  });

  currentRef.current = current;

  const paint = useCallback(() => {
    const G = physics.current;
    const fill = fillRef.current;
    const bead = beadRef.current;
    const root = rootRef.current;
    if (!fill || !bead || !root || G.W < 40) return;

    const vertical = orientationRef.current === "vertical";
    const onRight = vertical && sideRef.current === "right";
    const q = clamp(G.v / 1100, -1, 1) * (G.dragging ? 0.5 : 1);
    const mag = Math.abs(q);
    const sA = clamp(G.S * (1 + 0.06 * mag + 0.4 * q), G.S * 0.55, G.S * 2.1);
    const sB = clamp(G.S * (1 + 0.06 * mag - 0.4 * q), G.S * 0.55, G.S * 2.1);

    const applyShape = (d: string) => {
      fill.setAttribute("d", d);
      clipRef.current?.setAttribute("d", d);
      const glass = glassRef.current;
      if (glass) {
        const clip = `path('${d}')`;
        glass.style.clipPath = clip;
        glass.style.setProperty("-webkit-clip-path", clip);
      }
    };

    if (vertical) {
      // CX is absolute bead X; left trough expects distance from the left edge.
      const bx = onRight ? G.W - G.CX : G.CX;
      applyShape(
        onRight
          ? troughRight(G.W, G.H, G.R, G.x, bx, G.RB, sA, sB)
          : troughLeft(G.W, G.H, G.R, G.x, bx, G.RB, sA, sB),
      );
      const sy = 1 + 0.07 * mag;
      bead.style.transform = `translate3d(0,${G.x.toFixed(2)}px,0) scale(${(1 / sy).toFixed(3)},${sy.toFixed(3)})`;
    } else {
      applyShape(troughTop(G.W, G.H, G.R, G.x, G.CY, G.RB, sA, sB));
      const sx = 1 + 0.07 * mag;
      bead.style.transform = `translate3d(${G.x.toFixed(2)}px,0,0) scale(${sx.toFixed(3)},${(1 / sx).toFixed(3)})`;
    }

    tabRefs.current.forEach((tab, i) => {
      if (!tab) return;
      const dx = Math.abs(G.x - (G.slots[i] ?? 0));
      tab.style.setProperty("--t", smooth(clamp(1 - dx / (G.span * 0.55), 0, 1)).toFixed(3));
    });
  }, []);

  const run = useCallback(() => {
    const G = physics.current;
    if (G.raf) return;
    G.last = performance.now();
    const loop = (now: number) => {
      G.raf = 0;
      const dt = Math.min((now - G.last) / 1000, 1 / 30);
      G.last = now;
      const K = G.dragging ? 900 : pillSpring.stiffness / pillSpring.mass;
      const C = G.dragging ? 52 : pillSpring.damping / pillSpring.mass;
      let step = dt;
      while (step > 0) {
        const h = Math.min(step, 1 / 240);
        G.v += (-K * (G.x - G.target) - C * G.v) * h;
        G.x += G.v * h;
        step -= h;
      }
      paint();
      if (Math.abs(G.x - G.target) > 0.05 || Math.abs(G.v) > 0.6 || G.dragging) {
        G.raf = requestAnimationFrame(loop);
      } else {
        G.x = G.target;
        G.v = 0;
        paint();
      }
    };
    G.raf = requestAnimationFrame(loop);
  }, [paint]);

  const measure = useCallback(() => {
    const dock = dockRef.current;
    if (!dock) return false;
    const W = Math.round(dock.offsetWidth);
    const H = Math.round(dock.offsetHeight);
    if (W < 40 || H < 24) return false;

    const G = physics.current;
    const vertical = orientationRef.current === "vertical";
    const count = actionsRef.current.length;
    G.slots = Array.from({ length: count }, (_, i) => {
      const tab = tabRefs.current[i];
      if (!tab) return 0;
      const slotEl = tab.querySelector<HTMLElement>(".meniscus-icon-slot");
      return centerWithin(vertical ? (slotEl ?? tab) : tab, dock, vertical ? "y" : "x");
    });
    G.span = G.slots.length > 1 ? G.slots[1] - G.slots[0] : vertical ? H : W;
    G.W = W;
    G.H = H;
    G.R = vertical
      ? clamp(W * 0.26, 18, 24)
      : clamp(Math.min(W, H) * 0.42, 14, 22);
    const onRight = vertical && sideRef.current === "right";
    G.CX = onRight ? W : 0;
    G.CY = 0;

    const axis = vertical ? W : H;
    // Keep the bead compact — do not scale it up just because the bar got wider.
    let D = Math.min(
      axis * (vertical ? 0.66 : 0.78),
      G.span * (vertical ? 0.68 : 0.7),
      vertical ? 50 : 41,
    );
    // Extra corner clearance so the trough never eats into the rounded ends.
    const edgeRoom = (G.slots[0] ?? (vertical ? H : W) / 2) - G.R - (vertical ? 25 : 22);
    for (let i = 0; i < 5; i++) {
      const hw = reach(D * 0.22, D / 2 + 5, 0);
      if (hw <= edgeRoom) break;
      D *= edgeRoom / Math.max(hw, 1);
    }
    const preferred = Math.max(Math.round(D), vertical ? 40 : 34);
    const preferredReach = reach(preferred * 0.22, preferred / 2 + 5, 0);
    G.D =
      preferredReach <= edgeRoom
        ? preferred
        : Math.max(Math.round(D), vertical ? 32 : 28);
    G.S = G.D * 0.22;
    G.RB = G.D / 2 + 5;

    dock.style.setProperty("--dock-r", `${G.R.toFixed(1)}px`);
    dock.style.setProperty("--bead-d", `${G.D}px`);
    dock.style.setProperty("--bead-cx", `${G.CX}px`);
    dock.style.setProperty("--bead-cy", `${G.CY}px`);

    // Rise must land the icon dead-center in the bead.
    if (vertical) {
      const sample =
        tabRefs.current[currentRef.current] ?? tabRefs.current[0] ?? null;
      const slotEl = sample?.querySelector<HTMLElement>(".meniscus-icon-slot");
      const iconCx = slotEl
        ? centerWithin(slotEl, dock, "x")
        : W * 0.35;
      const rise = onRight
        ? Math.max(G.CX - iconCx, G.D * 0.45)
        : Math.max(iconCx - G.CX, G.D * 0.45);
      dock.style.setProperty("--rise", `${rise.toFixed(1)}px`);
    } else {
      dock.style.setProperty("--rise", `${(H / 2 - G.CY).toFixed(1)}px`);
    }

    // Keep SVG viewBox in sync before paint — avoids a one-frame drop-shadow glitch.
    skinRef.current?.setAttribute("viewBox", `0 0 ${W} ${H}`);
    setBox((prev) => (prev.w === W && prev.h === H ? prev : { w: W, h: H }));
    return true;
  }, []);

  const select = useCallback(
    (i: number, { focus = false, animate = true } = {}) => {
      const len = actionsRef.current.length;
      const next = ((i % len) + len) % len;
      currentRef.current = next;
      setCurrent(next);
      const G = physics.current;
      if (!G.slots.length || G.slots[next] == null) return;
      const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
      if (!animate || reduced) {
        G.x = G.target = G.slots[next];
        G.v = 0;
        paint();
      } else {
        G.target = G.slots[next];
        run();
      }
      if (focus) tabRefs.current[next]?.focus();
    },
    [paint, run],
  );

  const syncToActive = useCallback(() => {
    if (!measure()) return;
    const G = physics.current;
    const slot = G.slots[currentRef.current] ?? G.slots[0] ?? 0;
    cancelAnimationFrame(G.raf);
    G.raf = 0;
    G.x = G.target = slot;
    G.v = 0;
    paint();
    setReady(true);
  }, [measure, paint]);

  useLayoutEffect(() => {
    syncToActive();

    const ro = new ResizeObserver(() => {
      syncToActive();
    });
    if (dockRef.current) ro.observe(dockRef.current);

    return () => {
      ro.disconnect();
      cancelAnimationFrame(physics.current.raf);
      physics.current.raf = 0;
    };
  }, [syncToActive, mode, orientation, expanded, side]);

  useEffect(() => {
    paint();
  }, [accent, paint]);

  useEffect(() => {
    const dock = dockRef.current;
    if (!dock) return;

    let pid: number | null = null;
    let start = 0;
    let capturing = false;

    const onDown = (e: PointerEvent) => {
      if (e.button !== 0 && e.pointerType === "mouse") return;
      pid = e.pointerId;
      start = orientationRef.current === "vertical" ? e.clientY : e.clientX;
      capturing = false;
      physics.current.dragging = false;
      physics.current.moved = false;
    };

    const onMove = (e: PointerEvent) => {
      if (pid !== e.pointerId) return;
      const vertical = orientationRef.current === "vertical";
      const pos = vertical ? e.clientY : e.clientX;
      if (!capturing) {
        if (Math.abs(pos - start) < 8) return;
        capturing = true;
        physics.current.dragging = true;
        physics.current.moved = true;
        dock.setPointerCapture(e.pointerId);
      }
      const r = dock.getBoundingClientRect();
      const G = physics.current;
      if (!G.slots.length) return;
      const local = vertical ? pos - r.top : pos - r.left;
      G.target = clamp(local, G.slots[0], G.slots[G.slots.length - 1]);
      run();
    };

    const onUp = (e: PointerEvent) => {
      if (pid !== e.pointerId) return;
      pid = null;
      const G = physics.current;
      const wasDrag = G.moved;
      G.dragging = false;
      G.moved = false;
      if (!wasDrag) return;

      let near = 0;
      let nd = Infinity;
      G.slots.forEach((s, i) => {
        const d = Math.abs(G.x - s);
        if (d < nd) {
          nd = d;
          near = i;
        }
      });
      select(near, { animate: true });

      const block = (ev: Event) => {
        ev.preventDefault();
        ev.stopPropagation();
        dock.removeEventListener("click", block, true);
      };
      dock.addEventListener("click", block, true);
    };

    dock.addEventListener("pointerdown", onDown);
    dock.addEventListener("pointermove", onMove);
    dock.addEventListener("pointerup", onUp);
    dock.addEventListener("pointercancel", onUp);
    return () => {
      dock.removeEventListener("pointerdown", onDown);
      dock.removeEventListener("pointermove", onMove);
      dock.removeEventListener("pointerup", onUp);
      dock.removeEventListener("pointercancel", onUp);
    };
  }, [run, select, mode, orientation]);

  const onKeyDown = (e: React.KeyboardEvent) => {
    const step = ({ ArrowRight: 1, ArrowDown: 1, ArrowLeft: -1, ArrowUp: -1 } as Record<string, number>)[e.key];
    let next: number | null = null;
    if (step) next = current + step;
    else if (e.key === "Home") next = 0;
    else if (e.key === "End") next = actions.length - 1;
    if (next === null) return;
    e.preventDefault();
    select(next, { focus: true });
  };

  const onTabClick = (index: number) => (e: React.MouseEvent) => {
    e.preventDefault();
    select(index, { animate: true });
  };

  return (
    <MenuShowcase
      className={cn(
        "meniscus-show",
        isVertical && "is-vertical",
        isCollapsed && "is-collapsed",
        isRight && "is-right",
      )}
      eyebrow="Meniscus"
      title={active.label}
      description={
        isVertical
          ? "Variante lateral — a gota desliza no menisco da lateral."
          : "Toque ou deslize — a gota arrasta o menisco atrás dela."
      }
      accent={accent}
      onAccentChange={setAccent}
      modes={[
        { id: "public", label: "Público" },
        { id: "logged", label: "Logado" },
      ]}
      mode={mode}
      onModeChange={(id) => {
        setMode(id as Mode);
        setCurrent(0);
        currentRef.current = 0;
      }}
      variants={[
        { id: "horizontal", label: "Inferior" },
        { id: "vertical", label: "Lateral" },
      ]}
      variant={orientation}
      onVariantChange={(id) => {
        setOrientation(id as Orientation);
        if (id === "horizontal") setExpanded(true);
      }}
      extras={
        isVertical ? (
          <div className="menu-show-mode" role="group" aria-label="Estado da lateral">
            <button
              type="button"
              className={expanded ? "active" : undefined}
              onClick={() => {
                setExpanded(true);
              }}
            >
              Aberto
            </button>
            <button
              type="button"
              className={!expanded ? "active" : undefined}
              onClick={() => {
                setExpanded(false);
              }}
            >
              Ícones
            </button>
          </div>
        ) : null
      }
    >
      <LayoutGroup id="meniscus-layout">
        <div className={cn("meniscus-stage", isVertical && "is-vertical")}>
          <motion.div
            layout
            className={cn(
              "meniscus",
              isVertical && "is-vertical",
              isCollapsed && "is-collapsed",
              isRight && "is-right",
            )}
            ref={rootRef}
            style={
              {
                "--glow": accent,
                "--menu-accent": accent,
              } as CSSProperties
            }
            transition={gooey}
          >
            <motion.div
              layout
              className={cn(
                "meniscus-dock",
                ready && "is-ready",
                isVertical && "is-vertical",
                isCollapsed && "is-collapsed",
                isRight && "is-right",
              )}
              ref={dockRef}
              transition={gooey}
              onLayoutAnimationComplete={syncToActive}
            >
              <motion.div
                layout
                className="meniscus-glass"
                ref={glassRef}
                aria-hidden="true"
                transition={gooey}
              >
                <span className="meniscus-glass-base" />
                <span className="meniscus-glass-tint" />
                <span className="meniscus-glass-sheen" />
                <span className="meniscus-glass-rim" />
              </motion.div>
              <svg
                className="meniscus-skin"
                ref={skinRef}
                viewBox={`0 0 ${box.w} ${box.h}`}
                preserveAspectRatio="none"
                aria-hidden="true"
              >
                <defs>
                  <clipPath id={`mnClip-${uid}`} clipPathUnits="userSpaceOnUse">
                    <path ref={clipRef} d="" />
                  </clipPath>
                </defs>
                <path ref={fillRef} className="meniscus-fill" d="" />
              </svg>
              <span className="meniscus-bead" ref={beadRef} aria-hidden="true" />
              <motion.div
                layout
                className="meniscus-tabs"
                role="tablist"
                aria-label="Navegação Meniscus"
                onKeyDown={onKeyDown}
                transition={gooey}
              >
                {actions.map((tab, i) => {
                  const Icon = tab.Icon;
                  return (
                    <motion.button
                      layout
                      key={`${mode}-${tab.id}`}
                      ref={(el) => {
                        tabRefs.current[i] = el;
                      }}
                      type="button"
                      role="tab"
                      className="meniscus-tab"
                      aria-label={tab.label}
                      aria-selected={current === i}
                      tabIndex={current === i ? 0 : -1}
                      title={isCollapsed ? tab.label : undefined}
                      onClick={onTabClick(i)}
                      transition={gooey}
                    >
                      <span className="meniscus-icon-slot">
                        <Icon className="meniscus-icon" strokeWidth={1.8} />
                      </span>
                      <AnimatePresence initial={false} mode="popLayout">
                        {!isCollapsed ? (
                          <motion.span
                            key={`${tab.id}-label`}
                            layout
                            className="meniscus-label"
                            initial={{ opacity: 0, maxWidth: 0, scale: 0.92 }}
                            animate={{ opacity: 1, maxWidth: 160, scale: 1 }}
                            exit={{ opacity: 0, maxWidth: 0, scale: 0.92 }}
                            transition={gooey}
                          >
                            {tab.label}
                          </motion.span>
                        ) : null}
                      </AnimatePresence>
                    </motion.button>
                  );
                })}
              </motion.div>

              {isVertical ? (
                <motion.button
                  layout
                  type="button"
                  className="meniscus-rail-toggle"
                  aria-label={expanded ? "Retrair menu" : "Expandir menu"}
                  transition={gooey}
                  onClick={() => {
                    setExpanded((value) => !value);
                  }}
                >
                  {isRight
                    ? expanded
                      ? <ChevronsRight size={16} />
                      : <ChevronsLeft size={16} />
                    : expanded
                      ? <ChevronsLeft size={16} />
                      : <ChevronsRight size={16} />}
                </motion.button>
              ) : null}
            </motion.div>
          </motion.div>

          <AnimatePresence initial={false}>
            {isVertical ? (
              <motion.div
                key="side-toggle"
                className="meniscus-side-toggle menu-show-mode"
                role="group"
                aria-label="Lado do menu"
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 6 }}
                transition={gooey}
              >
                <button
                  type="button"
                  className={side === "left" ? "active" : undefined}
                  onClick={() => {
                    setSide("left");
                  }}
                >
                  Esquerda
                </button>
                <button
                  type="button"
                  className={side === "right" ? "active" : undefined}
                  onClick={() => {
                    setSide("right");
                  }}
                >
                  Direita
                </button>
              </motion.div>
            ) : null}
          </AnimatePresence>
        </div>
      </LayoutGroup>
    </MenuShowcase>
  );
}
