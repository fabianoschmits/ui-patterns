"use client";

import { useCallback, useEffect, useId, useMemo, useRef, useState } from "react";
import {
  Camera,
  Home,
  MessageCircle,
  Settings,
  User,
} from "lucide-react";
import type { PatternPreviewProps } from "@/types/pattern";
import { MenuShowcase, MENU_ACCENTS } from "@/patterns/shared/menu-showcase";
import "./meniscus.css";

const TABS = [
  { id: "home", label: "Home", title: "Início", line: "Tudo, em uma superfície só.", Icon: Home },
  { id: "profile", label: "Perfil", title: "Perfil", line: "Você, como o app te vê.", Icon: User },
  { id: "messages", label: "Msgs", title: "Mensagens", line: "Três não lidas. Todas gentis.", Icon: MessageCircle },
  { id: "camera", label: "Câmera", title: "Câmera", line: "Aponte. Já focou.", Icon: Camera },
  { id: "settings", label: "Ajustes", title: "Ajustes", line: "Menos interruptores. Melhores padrões.", Icon: Settings },
] as const;

function hexToRgb(hex: string): [number, number, number] {
  const h = hex.replace("#", "");
  const n = parseInt(h.length === 3 ? h.replace(/./g, "$&$&") : h, 16);
  return [(n >> 16) & 255, (n >> 8) & 255, n & 255];
}

function mixRgb(a: [number, number, number], b: [number, number, number], t: number) {
  return `${Math.round(a[0] + (b[0] - a[0]) * t)} ${Math.round(a[1] + (b[1] - a[1]) * t)} ${Math.round(a[2] + (b[2] - a[2]) * t)}`;
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
      s,
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
  const [current, setCurrent] = useState(0);
  const [ready, setReady] = useState(false);
  const [box, setBox] = useState({ w: 400, h: 80 });
  const [accent, setAccent] = useState(MENU_ACCENTS[0].value);
  const accentRgb = useMemo(() => hexToRgb(accent), [accent]);

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

    let near = 0;
    let nd = Infinity;
    tabRefs.current.forEach((tab, i) => {
      if (!tab) return;
      const dx = Math.abs(G.x - G.slots[i]);
      if (dx < nd) {
        nd = dx;
        near = i;
      }
      tab.style.setProperty("--t", smooth(clamp(1 - dx / (G.span * 0.55), 0, 1)).toFixed(3));
      tab.style.setProperty("--acc", accent);
    });

    const side = G.x >= G.slots[near] ? 1 : -1;
    const other = clamp(near + side, 0, TABS.length - 1);
    const t = other === near ? 0 : clamp(Math.abs(G.x - G.slots[near]) / G.span, 0, 1);
    root.style.setProperty("--glow-rgb", mixRgb(accentRgb, accentRgb, t));
  }, [accent, accentRgb]);

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
    G.slots = tabRefs.current.map((tab) => {
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
    const room = G.slots[0] - G.R - 6;
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
      const next = ((i % TABS.length) + TABS.length) % TABS.length;
      currentRef.current = next;
      setCurrent(next);
      const G = physics.current;
      if (!G.slots.length) return;
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
      const idx = currentRef.current;
      const slot = G.slots[idx] ?? G.slots[0] ?? 0;
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
  }, [measure, paint, run]);

  useEffect(() => {
    paint();
  }, [accent, paint]);

  useEffect(() => {
    const dock = dockRef.current;
    if (!dock) return;
    let pid: number | null = null;

    const onDown = (e: PointerEvent) => {
      if (e.button !== 0 && e.pointerType === "mouse") return;
      pid = e.pointerId;
      dock.setPointerCapture(e.pointerId);
      physics.current.dragging = true;
      physics.current.moved = false;
    };
    const onMove = (e: PointerEvent) => {
      if (pid !== e.pointerId || !physics.current.dragging) return;
      const r = dock.getBoundingClientRect();
      const G = physics.current;
      G.target = clamp(e.clientX - r.left, G.slots[0], G.slots[G.slots.length - 1]);
      G.moved = true;
      run();
    };
    const onUp = (e: PointerEvent) => {
      if (pid !== e.pointerId) return;
      pid = null;
      const G = physics.current;
      const wasDrag = G.moved;
      G.dragging = false;
      G.moved = false;

      // Clicks are handled by each tab's onClick. Drag-release snaps to nearest.
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
  }, [run, select]);

  const onKeyDown = (e: React.KeyboardEvent) => {
    const step = ({ ArrowRight: 1, ArrowDown: 1, ArrowLeft: -1, ArrowUp: -1 } as Record<string, number>)[e.key];
    let next: number | null = null;
    if (step) next = current + step;
    else if (e.key === "Home") next = 0;
    else if (e.key === "End") next = TABS.length - 1;
    if (next === null) return;
    e.preventDefault();
    select(next, { focus: true });
  };

  const active = TABS[current];

  return (
    <MenuShowcase
      className="meniscus-show"
      eyebrow="Meniscus"
      title={active.title}
      description={active.line}
      accent={accent}
      onAccentChange={setAccent}
    >
      <div
        className="meniscus"
        ref={rootRef}
        style={{ ["--glow-rgb" as string]: mixRgb(accentRgb, accentRgb, 0) }}
      >
        <div className={`meniscus-dock${ready ? " is-ready" : ""}`} ref={dockRef}>
          <span className="meniscus-cast" aria-hidden="true" />
          <svg className="meniscus-skin" viewBox={`0 0 ${box.w} ${box.h}`} preserveAspectRatio="none" aria-hidden="true">
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
          <div className="meniscus-tabs" role="tablist" aria-label="Navegação Meniscus" onKeyDown={onKeyDown}>
            {TABS.map((tab, i) => {
              const Icon = tab.Icon;
              return (
                <button
                  key={tab.id}
                  ref={(el) => {
                    tabRefs.current[i] = el;
                  }}
                  type="button"
                  role="tab"
                  className="meniscus-tab"
                  aria-selected={current === i}
                  tabIndex={current === i ? 0 : -1}
                  style={{ ["--acc" as string]: accent }}
                  onClick={() => select(i)}
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
