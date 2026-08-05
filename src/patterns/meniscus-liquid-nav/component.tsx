"use client";

import { useCallback, useEffect, useId, useMemo, useRef, useState } from "react";
import {
  Briefcase,
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
import "./meniscus.css";

type Mode = "public" | "logged";

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

function trough(
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

export default function MeniscusLiquidNav(_props: PatternPreviewProps) {
  const uid = useId().replace(/:/g, "");
  const rootRef = useRef<HTMLDivElement>(null);
  const dockRef = useRef<HTMLDivElement>(null);
  const fillRef = useRef<SVGPathElement>(null);
  const beadRef = useRef<HTMLSpanElement>(null);
  const tabRefs = useRef<(HTMLButtonElement | null)[]>([]);
  const currentRef = useRef(0);
  const actionsRef = useRef(loggedActions);

  const [mode, setMode] = useState<Mode>("logged");
  const [current, setCurrent] = useState(0);
  const [ready, setReady] = useState(false);
  const [box, setBox] = useState({ w: 400, h: 80 });
  const [accent, setAccent] = useState(MENU_ACCENTS[0].value);

  const actions = mode === "logged" ? loggedActions : publicActions;
  actionsRef.current = actions;
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
    R: 17,
    D: 56,
    RB: 35,
    S: 17,
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

    const q = clamp(G.v / 1100, -1, 1) * (G.dragging ? 0.5 : 1);
    const mag = Math.abs(q);
    const sL = clamp(G.S * (1 + 0.06 * mag + 0.4 * q), G.S * 0.55, G.S * 2.1);
    const sR = clamp(G.S * (1 + 0.06 * mag - 0.4 * q), G.S * 0.55, G.S * 2.1);

    fill.setAttribute("d", trough(G.W, G.H, G.R, G.x, G.CY, G.RB, sL, sR));

    const sx = 1 + 0.07 * mag;
    bead.style.transform = `translate3d(${G.x.toFixed(2)}px,0,0) scale(${sx.toFixed(3)},${(1 / sx).toFixed(3)})`;

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
    const count = actionsRef.current.length;
    G.slots = Array.from({ length: count }, (_, i) => {
      const tab = tabRefs.current[i];
      if (!tab) return 0;
      const b = tab.getBoundingClientRect();
      return b.left - r.left + b.width / 2;
    });
    G.span = G.slots.length > 1 ? G.slots[1] - G.slots[0] : W;
    G.W = W;
    G.H = H;
    G.R = clamp(H * 0.2, 13, 20);
    G.CY = 0;

    let D = Math.min(H * 0.68, G.span * 0.78);
    const room = (G.slots[0] ?? W / 2) - G.R - 6;
    for (let i = 0; i < 3; i++) {
      const hw = reach(D * 0.22, D / 2 + 6, G.CY);
      if (hw <= room) break;
      D *= room / hw;
    }
    G.D = Math.max(Math.round(D), 30);
    G.S = G.D * 0.22;
    G.RB = G.D / 2 + 6;

    dock.style.setProperty("--dock-r", `${G.R.toFixed(1)}px`);
    dock.style.setProperty("--bead-d", `${G.D}px`);
    dock.style.setProperty("--bead-cy", `${G.CY}px`);
    dock.style.setProperty("--rise", `${(H / 2 - G.CY).toFixed(1)}px`);
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

  // Measure on mount / resize — never reset on tab change (that killed click animation).
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
  }, [measure, paint, run, mode]);

  useEffect(() => {
    paint();
  }, [accent, paint]);

  // Drag only after a movement threshold so clicks reach the tab buttons.
  useEffect(() => {
    const dock = dockRef.current;
    if (!dock) return;

    let pid: number | null = null;
    let startX = 0;
    let capturing = false;

    const onDown = (e: PointerEvent) => {
      if (e.button !== 0 && e.pointerType === "mouse") return;
      pid = e.pointerId;
      startX = e.clientX;
      capturing = false;
      physics.current.dragging = false;
      physics.current.moved = false;
    };

    const onMove = (e: PointerEvent) => {
      if (pid !== e.pointerId) return;
      if (!capturing) {
        if (Math.abs(e.clientX - startX) < 8) return;
        capturing = true;
        physics.current.dragging = true;
        physics.current.moved = true;
        dock.setPointerCapture(e.pointerId);
      }
      const r = dock.getBoundingClientRect();
      const G = physics.current;
      if (!G.slots.length) return;
      G.target = clamp(e.clientX - r.left, G.slots[0], G.slots[G.slots.length - 1]);
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
  }, [run, select, mode]);

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
      className="meniscus-show"
      eyebrow="Meniscus"
      title={active.label}
      description="Toque uma aba — a gota arrasta o menisco atrás dela."
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
    >
      <div
        className="meniscus"
        ref={rootRef}
        style={{ ["--glow-rgb" as string]: rgbString(accentRgb) }}
      >
        <div className={`meniscus-dock${ready ? " is-ready" : ""}`} ref={dockRef}>
          <span className="meniscus-cast" aria-hidden="true" />
          <svg
            className="meniscus-skin"
            viewBox={`0 0 ${box.w} ${box.h}`}
            preserveAspectRatio="none"
            aria-hidden="true"
          >
            <defs>
              <linearGradient id={`mnPlate-${uid}`} x1="0" y1="0" x2="0" y2="1">
                <stop className="meniscus-plate-hi" offset="0" />
                <stop className="meniscus-plate-lo" offset="1" />
              </linearGradient>
              <linearGradient id={`mnRim-${uid}`} x1="0" y1="0" x2="0" y2="1">
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
                  onClick={onTabClick(i)}
                >
                  <Icon className="meniscus-icon" strokeWidth={1.8} />
                  <span className="meniscus-label">{tab.label}</span>
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </MenuShowcase>
  );
}
