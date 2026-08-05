"use client";

import { useLayoutEffect, useRef, useState, type CSSProperties } from "react";
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
import { AnimatePresence, motion } from "motion/react";
import type { PatternPreviewProps } from "@/types/pattern";
import { MenuShowcase, MENU_ACCENTS } from "@/patterns/shared/menu-showcase";
import { cn } from "@/lib/utils";
import "./meniscus.css";

type Mode = "public" | "logged";

interface MenuItem {
  id: string;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
}

const publicActions: MenuItem[] = [
  { id: "home", label: "Home", icon: Home },
  { id: "login", label: "Login", icon: LogIn },
  { id: "about", label: "Sobre", icon: Info },
  { id: "help", label: "Ajuda", icon: HelpCircle },
  { id: "contact", label: "Contato", icon: Mail },
];

const loggedActions: MenuItem[] = [
  { id: "home", label: "Home", icon: Home },
  { id: "feed", label: "Feed", icon: Users },
  { id: "search", label: "Buscar", icon: Search },
  { id: "classifieds", label: "Classificados", icon: Briefcase },
  { id: "profile", label: "Perfil", icon: User },
];

const PILL_RISE = 16;
const CORNER_R = 22;
/** Clearance between the pill edge and the bar contour (outside the circle). */
const OUTSIDE_GAP = 11;

const pillSpring = {
  type: "spring" as const,
  stiffness: 380,
  damping: 24,
  mass: 0.9,
};

const riseSpring = {
  type: "spring" as const,
  stiffness: 300,
  damping: 28,
};

function roundedBar(W: number, H: number, R: number) {
  const n = (v: number) => v.toFixed(2);
  return (
    `M${n(R)} 0` +
    `L${n(W - R)} 0` +
    `A${n(R)} ${n(R)} 0 0 1 ${n(W)} ${n(R)}` +
    `L${n(W)} ${n(H - R)}` +
    `A${n(R)} ${n(R)} 0 0 1 ${n(W - R)} ${n(H)}` +
    `L${n(R)} ${n(H)}` +
    `A${n(R)} ${n(R)} 0 0 1 0 ${n(H - R)}` +
    `L0 ${n(R)}` +
    `A${n(R)} ${n(R)} 0 0 1 ${n(R)} 0` +
    `Z`
  );
}

/**
 * Bar shape with a U cut that wraps the pill from the OUTSIDE —
 * the contour goes under the circle bottom, not through its sides.
 */
function meniscusPath(
  W: number,
  H: number,
  R: number,
  cx: number,
  cy: number,
  pillR: number,
) {
  const n = (v: number) => v.toFixed(2);
  const sr = pillR + OUTSIDE_GAP;
  const bottom = cy + sr;

  // Socket must reach the top edge so we can cut a notch into the bar.
  if (bottom <= 8 || sr <= Math.abs(cy) + 1) {
    return roundedBar(W, H, R);
  }

  // Intersection of the outer socket circle with the bar's top edge (y = 0).
  const disc = sr * sr - cy * cy;
  if (disc <= 4) {
    // Center too low for a clean y=0 join — drop shoulders then arc under.
    const half = sr + 6;
    const left = Math.max(R + 4, cx - half);
    const right = Math.min(W - R - 4, cx + half);
    const deep = Math.min(bottom, H - 12);
    return (
      `M${n(R)} 0` +
      `L${n(left)} 0` +
      `C${n(left + 10)} 0 ${n(cx - sr * 0.9)} ${n(deep * 0.55)} ${n(cx)} ${n(deep)}` +
      `C${n(cx + sr * 0.9)} ${n(deep * 0.55)} ${n(right - 10)} 0 ${n(right)} 0` +
      `L${n(W - R)} 0` +
      `A${n(R)} ${n(R)} 0 0 1 ${n(W)} ${n(R)}` +
      `L${n(W)} ${n(H - R)}` +
      `A${n(R)} ${n(R)} 0 0 1 ${n(W - R)} ${n(H)}` +
      `L${n(R)} ${n(H)}` +
      `A${n(R)} ${n(R)} 0 0 1 0 ${n(H - R)}` +
      `L0 ${n(R)}` +
      `A${n(R)} ${n(R)} 0 0 1 ${n(R)} 0` +
      `Z`
    );
  }

  const spread = Math.sqrt(disc);
  const left = Math.max(R + 2, cx - spread);
  const right = Math.min(W - R - 2, cx + spread);

  // Circular arc on the OUTSIDE of the pill, through the bottom (y-down SVG).
  // large-arc=1 + sweep=1 walks the long way under the circle.
  return (
    `M${n(R)} 0` +
    `L${n(left)} 0` +
    `A${n(sr)} ${n(sr)} 0 1 1 ${n(right)} 0` +
    `L${n(W - R)} 0` +
    `A${n(R)} ${n(R)} 0 0 1 ${n(W)} ${n(R)}` +
    `L${n(W)} ${n(H - R)}` +
    `A${n(R)} ${n(R)} 0 0 1 ${n(W - R)} ${n(H)}` +
    `L${n(R)} ${n(H)}` +
    `A${n(R)} ${n(R)} 0 0 1 0 ${n(H - R)}` +
    `L0 ${n(R)}` +
    `A${n(R)} ${n(R)} 0 0 1 ${n(R)} 0` +
    `Z`
  );
}

export default function MeniscusLiquidNav(_props: PatternPreviewProps) {
  const [mode, setMode] = useState<Mode>("logged");
  const [active, setActive] = useState("home");
  const [accent, setAccent] = useState(MENU_ACCENTS[0].value);
  const [shaped, setShaped] = useState(false);

  const surfaceRef = useRef<HTMLDivElement>(null);
  const pathRef = useRef<SVGPathElement>(null);
  const svgRef = useRef<SVGSVGElement>(null);
  const itemRefs = useRef<(HTMLButtonElement | null)[]>([]);
  const boxRef = useRef({ w: 400, h: 68 });
  const pillRef = useRef({ cx: 0, cy: 0, r: 22 });
  const rafRef = useRef(0);
  const trackingRef = useRef(false);

  const actions = mode === "logged" ? loggedActions : publicActions;
  const activeLabel = actions.find((a) => a.id === active)?.label ?? "Home";
  const activeIndex = Math.max(0, actions.findIndex((a) => a.id === active));

  const paintFromPill = (pill: { cx: number; cy: number; r: number }) => {
    const { w, h } = boxRef.current;
    if (!pathRef.current || w < 40) return;
    pathRef.current.setAttribute(
      "d",
      meniscusPath(w, h, CORNER_R, pill.cx, pill.cy, pill.r),
    );
  };

  const readBox = () => {
    const surface = surfaceRef.current;
    if (!surface) return false;
    const br = surface.getBoundingClientRect();
    const w = Math.round(br.width);
    const h = Math.round(br.height);
    if (w < 40 || h < 30) return false;
    boxRef.current = { w, h };
    svgRef.current?.setAttribute("viewBox", `0 0 ${w} ${h}`);
    return true;
  };

  /** Live geometry of the active pill relative to the bar surface. */
  const readPill = () => {
    const surface = surfaceRef.current;
    if (!surface) return null;
    const br = surface.getBoundingClientRect();

    const live = surface.parentElement?.querySelector(
      ".qam-active-pill",
    ) as HTMLElement | null;
    if (live) {
      const pr = live.getBoundingClientRect();
      if (pr.width > 8) {
        return {
          cx: pr.left - br.left + pr.width / 2,
          cy: pr.top - br.top + pr.height / 2,
          r: pr.width / 2,
        };
      }
    }

    const btn = itemRefs.current[activeIndex];
    const wrap = btn?.querySelector(".qam-icon-wrap") as HTMLElement | null;
    if (!wrap) return null;
    const wr = wrap.getBoundingClientRect();
    return {
      cx: wr.left - br.left + wr.width / 2,
      cy: wr.top - br.top + wr.height / 2,
      r: wr.width / 2,
    };
  };

  const stopTracking = () => {
    trackingRef.current = false;
    if (rafRef.current) {
      cancelAnimationFrame(rafRef.current);
      rafRef.current = 0;
    }
  };

  /** Keep the contour locked to the pill (including during layoutId travel). */
  const trackPill = (frames = 90) => {
    stopTracking();
    trackingRef.current = true;
    let left = frames;

    const tick = () => {
      if (!trackingRef.current) return;
      if (!readBox()) {
        rafRef.current = requestAnimationFrame(tick);
        return;
      }
      const pill = readPill();
      if (pill) {
        pillRef.current = pill;
        paintFromPill(pill);
        setShaped(true);
      }
      left -= 1;
      if (left > 0) {
        rafRef.current = requestAnimationFrame(tick);
      } else {
        trackingRef.current = false;
        rafRef.current = 0;
      }
    };

    rafRef.current = requestAnimationFrame(tick);
  };

  useLayoutEffect(() => {
    trackPill(activeIndex === 0 && !shaped ? 12 : 75);
    return stopTracking;
  }, [activeIndex, mode]);

  useLayoutEffect(() => {
    const surface = surfaceRef.current;
    if (!surface) return;
    const ro = new ResizeObserver(() => {
      if (!readBox()) return;
      const pill = readPill();
      if (!pill) return;
      pillRef.current = pill;
      paintFromPill(pill);
      setShaped(true);
    });
    ro.observe(surface);
    return () => ro.disconnect();
  }, [mode, activeIndex]);

  return (
    <MenuShowcase
      className="meniscus-show"
      style={{ "--qam-accent": accent } as CSSProperties}
      eyebrow="Meniscus"
      title={activeLabel}
      description="Toque uma aba — a pill sobe com o ícone."
      accent={accent}
      onAccentChange={setAccent}
      modes={[
        { id: "public", label: "Público" },
        { id: "logged", label: "Logado" },
      ]}
      mode={mode}
      onModeChange={(id) => {
        setMode(id as Mode);
        setActive("home");
        setShaped(false);
      }}
    >
      <nav className={cn("qam-bar", "meniscus-bar", shaped && "is-shaped")} aria-label="Meniscus">
        <div className="meniscus-surface" ref={surfaceRef}>
          <div className="qam-bar-bg meniscus-bar-flat" aria-hidden="true" />
          <svg
            ref={svgRef}
            className="meniscus-bar-skin"
            viewBox="0 0 400 68"
            preserveAspectRatio="none"
            aria-hidden="true"
          >
            <path ref={pathRef} className="meniscus-bar-fill" d="" />
          </svg>
        </div>

        <div className="qam-items" key={mode}>
          {actions.map((action, index) => {
            const Icon = action.icon;
            const isActive = active === action.id;

            return (
              <button
                key={action.id}
                ref={(el) => {
                  itemRefs.current[index] = el;
                }}
                type="button"
                className="qam-item"
                aria-label={action.label}
                aria-current={isActive ? "page" : undefined}
                onClick={() => setActive(action.id)}
              >
                <div className="qam-icon-slot">
                  <motion.div
                    className="qam-icon-wrap"
                    animate={{ y: isActive ? -PILL_RISE : 0 }}
                    transition={riseSpring}
                    onAnimationComplete={() => {
                      if (isActive) trackPill(20);
                    }}
                  >
                    <AnimatePresence initial={false}>
                      {isActive && (
                        <motion.span
                          layoutId="meniscus-active-pill"
                          className="qam-active-pill"
                          initial={{ opacity: 0, scaleX: 1.45, scaleY: 0.55 }}
                          animate={{ opacity: 1, scaleX: 1, scaleY: 1 }}
                          exit={{ opacity: 0, scaleX: 0.55, scaleY: 1.4 }}
                          transition={pillSpring}
                        />
                      )}
                    </AnimatePresence>
                    <Icon className={cn("qam-icon", isActive && "is-active")} />
                  </motion.div>
                </div>

                <motion.span
                  className={cn("qam-label", isActive && "is-active")}
                  animate={{ scale: isActive ? 1.04 : 1 }}
                  transition={{ type: "spring", stiffness: 280, damping: 28 }}
                >
                  {action.label}
                </motion.span>
              </button>
            );
          })}
        </div>
      </nav>
    </MenuShowcase>
  );
}
