"use client";

import { useCallback, useEffect, useId, useMemo, useRef, useState } from "react";
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
import type { PatternPreviewProps } from "@/types/pattern";
import { MenuShowcase, MENU_ACCENTS } from "@/patterns/shared/menu-showcase";
import { cn } from "@/lib/utils";
import "./meniscus.css";

type Mode = "public" | "logged";
type Orientation = "horizontal" | "vertical";

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

function hexToRgb(hex: string): [number, number, number] {
  const h = hex.replace("#", "");
  const n = parseInt(h.length === 3 ? h.replace(/./g, "$&$&") : h, 16);
  return [(n >> 16) & 255, (n >> 8) & 255, n & 255];
}

function rgbString(rgb: [number, number, number]) {
  return `${rgb[0]} ${rgb[1]} ${rgb[2]}`;
}

const clamp = (v: number, a: number, b: number) => (v < a ? a : v > b ? b : v);
const smooth = (t: number) => t * t * (3 - 2 * t);
const reach = (s: number, rb: number, by: number) =>
  Math.sqrt(Math.max((s + rb) ** 2 - (s - by) ** 2, 1));

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

export default function MeniscusLiquidNav(_props: PatternPreviewProps) {
  const uid = useId().replace(/:/g, "");
  const rootRef = useRef<HTMLDivElement>(null);
  const dockRef = useRef<HTMLDivElement>(null);
  const fillRef = useRef<SVGPathElement>(null);
  const beadRef = useRef<HTMLSpanElement>(null);
  const tabRefs = useRef<(HTMLButtonElement | null)[]>([]);
  const currentRef = useRef(0);
  const actionsRef = useRef(loggedActions);
  const orientationRef = useRef<Orientation>("horizontal");

  const [mode, setMode] = useState<Mode>("logged");
  const [orientation, setOrientation] = useState<Orientation>("horizontal");
  const [expanded, setExpanded] = useState(true);
  const [current, setCurrent] = useState(0);
  const [ready, setReady] = useState(false);
  const [box, setBox] = useState({ w: 400, h: 80 });
  const [accent, setAccent] = useState(MENU_ACCENTS[0].value);

  const actions = mode === "logged" ? loggedActions : publicActions;
  actionsRef.current = actions;
  orientationRef.current = orientation;
  const isVertical = orientation === "vertical";
  const isCollapsed = isVertical && !expanded;
  const accentRgb = useMemo(() => hexToRgb(accent), [accent]);
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
    const q = clamp(G.v / 1100, -1, 1) * (G.dragging ? 0.5 : 1);
    const mag = Math.abs(q);
    const sA = clamp(G.S * (1 + 0.06 * mag + 0.4 * q), G.S * 0.55, G.S * 2.1);
    const sB = clamp(G.S * (1 + 0.06 * mag - 0.4 * q), G.S * 0.55, G.S * 2.1);

    if (vertical) {
      fill.setAttribute("d", troughLeft(G.W, G.H, G.R, G.x, G.CX, G.RB, sA, sB));
      const sy = 1 + 0.07 * mag;
      bead.style.transform = `translate3d(0,${G.x.toFixed(2)}px,0) scale(${(1 / sy).toFixed(3)},${sy.toFixed(3)})`;
    } else {
      fill.setAttribute("d", troughTop(G.W, G.H, G.R, G.x, G.CY, G.RB, sA, sB));
      const sx = 1 + 0.07 * mag;
      bead.style.transform = `translate3d(${G.x.toFixed(2)}px,0,0) scale(${sx.toFixed(3)},${(1 / sx).toFixed(3)})`;
    }

    tabRefs.current.forEach((tab, i) => {
      if (!tab) return;
      const dx = Math.abs(G.x - (G.slots[i] ?? 0));
      tab.style.setProperty("--t", smooth(clamp(1 - dx / (G.span * 0.55), 0, 1)).toFixed(3));
    });

    root.style.setProperty("--glow-rgb", rgbString(accentRgb));
  }, [accentRgb]);

  const run = useCallback(() => {
    const G = physics.current;
    if (G.raf) return;
    G.last = performance.now();
    const loop = (now: number) => {
      G.raf = 0;
      const dt = Math.min((now - G.last) / 1000, 1 / 30);
      G.last = now;
      const K = G.dragging ? 900 : 142;
      const C = G.dragging ? 52 : 19.3;
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
    const r = dock.getBoundingClientRect();
    const W = Math.round(r.width);
    const H = Math.round(r.height);
    if (W < 40 || H < 30) return false;

    const G = physics.current;
    const vertical = orientationRef.current === "vertical";
    const count = actionsRef.current.length;
    G.slots = Array.from({ length: count }, (_, i) => {
      const tab = tabRefs.current[i];
      if (!tab) return 0;
      const slotEl = tab.querySelector(".meniscus-icon-slot");
      const b = (slotEl ?? tab).getBoundingClientRect();
      return vertical
        ? b.top - r.top + b.height / 2
        : b.left - r.left + b.width / 2;
    });
    G.span = G.slots.length > 1 ? G.slots[1] - G.slots[0] : vertical ? H : W;
    G.W = W;
    G.H = H;
    G.R = vertical
      ? clamp(W * 0.26, 18, 24)
      : clamp(Math.min(W, H) * 0.34, 20, 30);
    G.CX = 0;
    G.CY = 0;

    const axis = vertical ? W : H;
    let D = Math.min(axis * (vertical ? 0.7 : 0.88), G.span * (vertical ? 0.72 : 0.82));
    // Extra corner clearance so the trough never eats into the rounded ends.
    const edgeRoom = (G.slots[0] ?? (vertical ? H : W) / 2) - G.R - (vertical ? 18 : 16);
    for (let i = 0; i < 5; i++) {
      const hw = reach(D * 0.22, D / 2 + 5, 0);
      if (hw <= edgeRoom) break;
      D *= edgeRoom / Math.max(hw, 1);
    }
    const preferred = Math.max(Math.round(D), vertical ? 44 : 42);
    const preferredReach = reach(preferred * 0.22, preferred / 2 + 5, 0);
    G.D =
      preferredReach <= edgeRoom
        ? preferred
        : Math.max(Math.round(D), vertical ? 34 : 32);
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
      const slotEl = sample?.querySelector(".meniscus-icon-slot");
      const sb = (slotEl ?? sample)?.getBoundingClientRect();
      const iconCx = sb ? sb.left - r.left + sb.width / 2 : W * 0.35;
      const rise = Math.max(iconCx - G.CX, G.D * 0.45);
      dock.style.setProperty("--rise", `${rise.toFixed(1)}px`);
    } else {
      dock.style.setProperty("--rise", `${(H / 2 - G.CY).toFixed(1)}px`);
    }
    setBox({ w: W, h: H });
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

  useEffect(() => {
    const sync = (forceSnap: boolean) => {
      if (!measure()) return;
      const G = physics.current;
      const slot = G.slots[currentRef.current] ?? G.slots[0] ?? 0;
      if (forceSnap) {
        G.x = G.target = slot;
        G.v = 0;
        paint();
      } else {
        G.target = slot;
        if (!G.dragging) run();
        else paint();
      }
      setReady(true);
    };

    sync(true);
    const ro = new ResizeObserver(() => sync(false));
    if (dockRef.current) ro.observe(dockRef.current);
    return () => {
      ro.disconnect();
      cancelAnimationFrame(physics.current.raf);
      physics.current.raf = 0;
    };
  }, [measure, paint, run, mode, orientation, expanded]);

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
        setReady(false);
      }}
      variants={[
        { id: "horizontal", label: "Inferior" },
        { id: "vertical", label: "Lateral" },
      ]}
      variant={orientation}
      onVariantChange={(id) => {
        setOrientation(id as Orientation);
        if (id === "horizontal") setExpanded(true);
        setReady(false);
      }}
      extras={
        isVertical ? (
          <div className="menu-show-mode" role="group" aria-label="Estado da lateral">
            <button
              type="button"
              className={expanded ? "active" : undefined}
              onClick={() => {
                setExpanded(true);
                setReady(false);
              }}
            >
              Aberto
            </button>
            <button
              type="button"
              className={!expanded ? "active" : undefined}
              onClick={() => {
                setExpanded(false);
                setReady(false);
              }}
            >
              Ícones
            </button>
          </div>
        ) : null
      }
    >
      <div className={cn("meniscus-stage", isVertical && "is-vertical")}>
        <div
          className={cn("meniscus", isVertical && "is-vertical", isCollapsed && "is-collapsed")}
          ref={rootRef}
          style={{ ["--glow-rgb" as string]: rgbString(accentRgb) }}
        >
          <div
            className={cn(
              "meniscus-dock",
              ready && "is-ready",
              isVertical && "is-vertical",
              isCollapsed && "is-collapsed",
            )}
            ref={dockRef}
          >
            <svg
              className="meniscus-skin"
              viewBox={`0 0 ${box.w} ${box.h}`}
              preserveAspectRatio="none"
              aria-hidden="true"
            >
              <defs>
                <linearGradient
                  id={`mnPlate-${uid}`}
                  x1={isVertical ? "1" : "0"}
                  y1="0"
                  x2={isVertical ? "0" : "0"}
                  y2={isVertical ? "0" : "1"}
                >
                  <stop className="meniscus-plate-hi" offset="0" />
                  <stop className="meniscus-plate-lo" offset="1" />
                </linearGradient>
                <linearGradient
                  id={`mnRim-${uid}`}
                  x1={isVertical ? "1" : "0"}
                  y1="0"
                  x2={isVertical ? "0" : "0"}
                  y2={isVertical ? "0" : "1"}
                >
                  <stop className="meniscus-rim-hi" offset="0" />
                  <stop className="meniscus-rim-lo" offset="1" />
                </linearGradient>
              </defs>
              <path
                ref={fillRef}
                className="meniscus-fill"
                style={{ fill: `url(#mnPlate-${uid})`, stroke: `url(#mnRim-${uid})` }}
                d=""
              />
            </svg>
            <span className="meniscus-bead" ref={beadRef} aria-hidden="true" />
            <div
              className="meniscus-tabs"
              role="tablist"
              aria-label="Navegação Meniscus"
              onKeyDown={onKeyDown}
            >
              {actions.map((tab, i) => {
                const Icon = tab.Icon;
                return (
                  <button
                    key={`${mode}-${orientation}-${expanded}-${tab.id}`}
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
                  >
                    <span className="meniscus-icon-slot">
                      <Icon className="meniscus-icon" strokeWidth={1.8} />
                    </span>
                    {!isCollapsed ? <span className="meniscus-label">{tab.label}</span> : null}
                  </button>
                );
              })}
            </div>

            {isVertical ? (
              <button
                type="button"
                className="meniscus-rail-toggle"
                aria-label={expanded ? "Retrair menu" : "Expandir menu"}
                onClick={() => {
                  setExpanded((value) => !value);
                  setReady(false);
                }}
              >
                {expanded ? <ChevronsLeft size={16} /> : <ChevronsRight size={16} />}
              </button>
            ) : null}
          </div>
        </div>
      </div>
    </MenuShowcase>
  );
}
