"use client";

import { useCallback, useEffect, useLayoutEffect, useRef, useState, type CSSProperties, type ReactNode } from "react";
import { cn } from "@/lib/utils";
import "./menu-showcase.css";

export interface AccentSwatch {
  name: string;
  value: string;
}

export const MENU_ACCENTS: AccentSwatch[] = [
  { name: "Teal", value: "#00b0b0" },
  { name: "Aqua", value: "#14c8c0" },
  { name: "Mint", value: "#34d399" },
  { name: "Emerald", value: "#10b981" },
  { name: "Forest", value: "#2f6f5e" },
  { name: "Lime", value: "#84cc16" },
  { name: "Chartreuse", value: "#a3e635" },
  { name: "Amber", value: "#d4a017" },
  { name: "Gold", value: "#eab308" },
  { name: "Orange", value: "#f59e0b" },
  { name: "Tangerine", value: "#f97316" },
  { name: "Coral", value: "#e8725c" },
  { name: "Salmon", value: "#fb7185" },
  { name: "Rose", value: "#db6b8a" },
  { name: "Pink", value: "#ec4899" },
  { name: "Fuchsia", value: "#d946ef" },
  { name: "Orchid", value: "#c084fc" },
  { name: "Violet", value: "#8b5cf6" },
  { name: "Purple", value: "#7c3aed" },
  { name: "Indigo", value: "#6366f1" },
  { name: "Ocean", value: "#3b82f6" },
  { name: "Sky", value: "#0ea5e9" },
  { name: "Cyan", value: "#06b6d4" },
  { name: "Ice", value: "#67e8f9" },
  { name: "Slate", value: "#4b5563" },
  { name: "Steel", value: "#64748b" },
  { name: "Zinc", value: "#71717a" },
  { name: "Stone", value: "#78716c" },
  { name: "Cocoa", value: "#92400e" },
  { name: "Wine", value: "#9f1239" },
];

export const MENU_SURFACE_AUTO = "auto";

export const MENU_SURFACES: AccentSwatch[] = [
  { name: "Padrão", value: MENU_SURFACE_AUTO },
  { name: "Branco", value: "#f5f4f2" },
  { name: "Névoa", value: "#efece6" },
  { name: "Areia", value: "#e8e2d6" },
  { name: "Cinza claro", value: "#e4e3e0" },
  { name: "Pérola", value: "#dcd9d3" },
  { name: "Pedra", value: "#c8c6c1" },
  { name: "Cinza", value: "#a8a7a2" },
  { name: "Fumaça", value: "#8f8e8a" },
  { name: "Aço", value: "#73726e" },
  { name: "Grafite", value: "#565552" },
  { name: "Chumbo", value: "#3f3e3b" },
  { name: "Carvão", value: "#2c2b29" },
  { name: "Noite", value: "#1f1e1c" },
  { name: "Preto", value: "#151514" },
  { name: "Gelo", value: "#e8f4f8" },
  { name: "Água", value: "#d7eef3" },
  { name: "Menta", value: "#d8f3e7" },
  { name: "Sálvia", value: "#d6e8dc" },
  { name: "Oliva", value: "#dfe6d4" },
  { name: "Limão", value: "#eef3d4" },
  { name: "Crema", value: "#f6ecd7" },
  { name: "Pêssego", value: "#f6e0d4" },
  { name: "Blush", value: "#f3d9de" },
  { name: "Lilás", value: "#e8dff3" },
  { name: "Lavanda", value: "#ddd6f3" },
  { name: "Anil", value: "#d6def6" },
  { name: "Marinho", value: "#1e293b" },
  { name: "Floresta", value: "#1f2f28" },
  { name: "Borgonha", value: "#3b1d24" },
  { name: "Café", value: "#2a211c" },
];

export interface MenuModeOption {
  id: string;
  label: string;
}

interface MenuShowcaseProps {
  eyebrow: string;
  title: string;
  description: string;
  accent: string;
  onAccentChange: (value: string) => void;
  accents?: AccentSwatch[];
  surface?: string;
  onSurfaceChange?: (value: string) => void;
  surfaces?: AccentSwatch[];
  showSurfaceColors?: boolean;
  draggableRoulette?: boolean;
  modes?: MenuModeOption[];
  mode?: string;
  onModeChange?: (id: string) => void;
  variants?: MenuModeOption[];
  variant?: string;
  onVariantChange?: (id: string) => void;
  extras?: ReactNode;
  children: ReactNode;
  className?: string;
  style?: CSSProperties;
}

function ChipGroup({
  label,
  options,
  value,
  onChange,
}: {
  label: string;
  options: MenuModeOption[];
  value?: string;
  onChange: (id: string) => void;
}) {
  return (
    <div className="menu-show-mode" role="group" aria-label={label}>
      {options.map((option) => (
        <button
          key={option.id}
          type="button"
          className={value === option.id ? "active" : undefined}
          onClick={() => onChange(option.id)}
        >
          {option.label}
        </button>
      ))}
    </div>
  );
}

function ColorRoulette({
  label,
  options,
  value,
  onChange,
  draggable = false,
}: {
  label: string;
  options: AccentSwatch[];
  value: string;
  onChange: (value: string) => void;
  draggable?: boolean;
}) {
  const trackRef = useRef<HTMLDivElement>(null);
  const settleRef = useRef(0);
  const scrollFrameRef = useRef(0);
  const inertiaFrameRef = useRef(0);
  const ignoreTimerRef = useRef(0);
  const ignoreScrollRef = useRef(false);
  const draggingRef = useRef(false);
  const glidingRef = useRef(false);
  const blockClickRef = useRef(false);
  const valueRef = useRef(value);
  const onChangeRef = useRef(onChange);
  const dragRef = useRef({
    pointerId: -1,
    startX: 0,
    startScrollLeft: 0,
    lastX: 0,
    lastAt: 0,
    velocity: 0,
    moved: false,
    samples: [] as Array<{ x: number; at: number }>,
  });
  const [isDragging, setIsDragging] = useState(false);
  const [isGliding, setIsGliding] = useState(false);
  const labelId = label.replace(/\s+/g, "-").toLowerCase();
  valueRef.current = value;
  onChangeRef.current = onChange;

  const selectedIndex = Math.max(
    0,
    options.findIndex((option) => option.value === value),
  );

  const centerOnIndex = useCallback(
    (index: number, behavior: ScrollBehavior = "smooth") => {
      const track = trackRef.current;
      const button = track?.querySelectorAll<HTMLElement>(".menu-show-swatch")[index];
      if (!track || !button) return;
      const trackRect = track.getBoundingClientRect();
      const buttonRect = button.getBoundingClientRect();
      const delta =
        buttonRect.left +
        buttonRect.width / 2 -
        (trackRect.left + trackRect.width / 2);
      if (Math.abs(delta) < 1) return;
      ignoreScrollRef.current = true;
      track.scrollBy({ left: delta, behavior });
      window.clearTimeout(ignoreTimerRef.current);
      ignoreTimerRef.current = window.setTimeout(
        () => {
          ignoreScrollRef.current = false;
        },
        behavior === "smooth" ? 420 : 32,
      );
    },
    [],
  );

  const pickCenter = useCallback(
    (snap = true) => {
      const track = trackRef.current;
      if (!track || ignoreScrollRef.current) return;
      const buttons = Array.from(
        track.querySelectorAll<HTMLElement>(".menu-show-swatch"),
      );
      if (!buttons.length) return;
      const mid = track.getBoundingClientRect().left + track.clientWidth / 2;
      let bestIndex = 0;
      let bestDist = Infinity;
      buttons.forEach((button, index) => {
        const rect = button.getBoundingClientRect();
        const dist = Math.abs(rect.left + rect.width / 2 - mid);
        if (dist < bestDist) {
          bestDist = dist;
          bestIndex = index;
        }
      });
      const next = options[bestIndex];
      if (!next) return;
      if (next.value !== valueRef.current) {
        valueRef.current = next.value;
        onChangeRef.current(next.value);
      }
      if (snap) centerOnIndex(bestIndex, "smooth");
    },
    [centerOnIndex, options],
  );

  useLayoutEffect(() => {
    centerOnIndex(selectedIndex, "auto");
  }, [centerOnIndex, options.length]);

  useEffect(() => {
    if (ignoreScrollRef.current || draggingRef.current || glidingRef.current) return;
    centerOnIndex(selectedIndex, "smooth");
  }, [centerOnIndex, selectedIndex]);

  useEffect(() => {
    return () => {
      window.clearTimeout(settleRef.current);
      window.clearTimeout(ignoreTimerRef.current);
      window.cancelAnimationFrame(scrollFrameRef.current);
      window.cancelAnimationFrame(inertiaFrameRef.current);
    };
  }, []);

  const updateCenterFromScroll = useCallback(() => {
    window.cancelAnimationFrame(scrollFrameRef.current);
    scrollFrameRef.current = window.requestAnimationFrame(() => {
      pickCenter(false);
    });
  }, [pickCenter]);

  const startInertia = useCallback(
    (track: HTMLDivElement, initialVelocity: number) => {
      window.cancelAnimationFrame(inertiaFrameRef.current);
      let velocity = Math.max(-3.8, Math.min(3.8, initialVelocity));
      if (Math.abs(velocity) < 0.045) {
        glidingRef.current = false;
        setIsGliding(false);
        window.requestAnimationFrame(() => pickCenter(true));
        return;
      }

      glidingRef.current = true;
      setIsGliding(true);
      let previous = performance.now();

      const glide = (now: number) => {
        const dt = Math.min(now - previous, 32);
        previous = now;
        const before = track.scrollLeft;
        track.scrollLeft = before + velocity * dt;
        const travelled = Math.abs(track.scrollLeft - before);
        pickCenter(false);

        velocity *= Math.pow(0.94, dt / 16.67);
        if (travelled > 0.05 && Math.abs(velocity) > 0.018) {
          inertiaFrameRef.current = window.requestAnimationFrame(glide);
          return;
        }

        inertiaFrameRef.current = 0;
        glidingRef.current = false;
        setIsGliding(false);
        window.requestAnimationFrame(() => pickCenter(true));
      };

      inertiaFrameRef.current = window.requestAnimationFrame(glide);
    },
    [pickCenter],
  );

  const updateDragPosition = useCallback(
    (track: HTMLDivElement, clientX: number, now: number) => {
      const drag = dragRef.current;
      const delta = clientX - drag.startX;
      if (!drag.moved && Math.abs(delta) < 3) return false;

      drag.moved = true;
      drag.lastX = clientX;
      drag.lastAt = now;
      drag.samples.push({ x: clientX, at: now });
      const cutoff = now - 140;
      while (drag.samples.length > 2 && drag.samples[0].at < cutoff) {
        drag.samples.shift();
      }

      const first = drag.samples[0];
      const last = drag.samples[drag.samples.length - 1];
      const elapsed = Math.max(last.at - first.at, 1);
      drag.velocity = -(last.x - first.x) / elapsed;
      track.scrollLeft = drag.startScrollLeft - delta;
      pickCenter(false);
      return true;
    },
    [pickCenter],
  );

  const finishDrag = useCallback(
    (track: HTMLDivElement, pointerId: number, allowInertia = true) => {
      if (!draggable || dragRef.current.pointerId !== pointerId) return;
      const moved = dragRef.current.moved;
      if (track.hasPointerCapture(pointerId)) {
        track.releasePointerCapture(pointerId);
      }
      dragRef.current.pointerId = -1;
      draggingRef.current = false;
      setIsDragging(false);
      blockClickRef.current = moved;
      window.setTimeout(() => {
        blockClickRef.current = false;
      }, 80);
      const idleFor = Math.max(0, performance.now() - dragRef.current.lastAt);
      const releaseVelocity = dragRef.current.velocity * Math.exp(-idleFor / 160);
      if (!moved) return;
      if (allowInertia) startInertia(track, releaseVelocity);
      else window.requestAnimationFrame(() => pickCenter(true));
    },
    [draggable, pickCenter, startInertia],
  );

  return (
    <div className="menu-show-roulette">
      <span className="menu-show-swatch-label">{label}</span>
      <div className="menu-show-roulette-frame">
        <div className="menu-show-roulette-fade menu-show-roulette-fade-left" aria-hidden="true" />
        <div className="menu-show-roulette-fade menu-show-roulette-fade-right" aria-hidden="true" />
        <div className="menu-show-roulette-lens" aria-hidden="true" />
        <div
          ref={trackRef}
          className={cn(
            "menu-show-roulette-track",
            draggable && "is-draggable",
            isDragging && "is-dragging",
            isGliding && "is-gliding",
          )}
          role="listbox"
          aria-label={label}
          aria-activedescendant={`swatch-${labelId}-${value}`}
          onScroll={() => {
            if (ignoreScrollRef.current) return;
            if (draggable) updateCenterFromScroll();
            window.clearTimeout(settleRef.current);
            if (!draggingRef.current) {
              if (!glidingRef.current) {
                settleRef.current = window.setTimeout(
                  () => pickCenter(true),
                  draggable ? 120 : 80,
                );
              }
            }
          }}
          onPointerDown={(event) => {
            if (!draggable) return;
            if (event.pointerType === "mouse" && event.button !== 0) return;
            const track = event.currentTarget;
            window.clearTimeout(settleRef.current);
            window.cancelAnimationFrame(inertiaFrameRef.current);
            inertiaFrameRef.current = 0;
            glidingRef.current = false;
            setIsGliding(false);
            ignoreScrollRef.current = false;
            const now = performance.now();
            dragRef.current = {
              pointerId: event.pointerId,
              startX: event.clientX,
              startScrollLeft: track.scrollLeft,
              lastX: event.clientX,
              lastAt: now,
              velocity: 0,
              moved: false,
              samples: [{ x: event.clientX, at: now }],
            };
            draggingRef.current = true;
            setIsDragging(true);
            track.setPointerCapture(event.pointerId);
          }}
          onPointerMove={(event) => {
            if (!draggable || dragRef.current.pointerId !== event.pointerId) return;
            if (updateDragPosition(event.currentTarget, event.clientX, performance.now())) {
              event.preventDefault();
            }
          }}
          onPointerUp={(event) => {
            updateDragPosition(event.currentTarget, event.clientX, performance.now());
            finishDrag(event.currentTarget, event.pointerId);
          }}
          onPointerCancel={(event) => {
            finishDrag(event.currentTarget, event.pointerId, false);
          }}
        >
          {options.map((swatch) => {
            const isAuto = swatch.value === MENU_SURFACE_AUTO;
            const selected = value === swatch.value;
            return (
              <button
                key={swatch.value}
                id={`swatch-${labelId}-${swatch.value}`}
                type="button"
                role="option"
                aria-selected={selected}
                aria-label={swatch.name}
                title={swatch.name}
                className={cn(
                  "menu-show-swatch",
                  isAuto && "is-auto",
                  selected && "is-selected",
                )}
                style={isAuto ? undefined : { background: swatch.value }}
                onClick={(event) => {
                  if (blockClickRef.current) {
                    event.preventDefault();
                    return;
                  }
                  window.cancelAnimationFrame(inertiaFrameRef.current);
                  inertiaFrameRef.current = 0;
                  glidingRef.current = false;
                  setIsGliding(false);
                  valueRef.current = swatch.value;
                  onChange(swatch.value);
                  const index = options.findIndex((item) => item.value === swatch.value);
                  if (index >= 0) centerOnIndex(index, "smooth");
                }}
              />
            );
          })}
        </div>
      </div>
    </div>
  );
}

export function MenuShowcase({
  eyebrow,
  title,
  description,
  accent,
  onAccentChange,
  accents = MENU_ACCENTS,
  surface,
  onSurfaceChange,
  surfaces = MENU_SURFACES,
  showSurfaceColors = true,
  draggableRoulette = false,
  modes,
  mode,
  onModeChange,
  variants,
  variant,
  onVariantChange,
  extras,
  children,
  className,
  style,
}: MenuShowcaseProps) {
  const [internalSurface, setInternalSurface] = useState(MENU_SURFACE_AUTO);
  const surfaceValue = surface ?? internalSurface;
  const handleSurfaceChange = onSurfaceChange ?? setInternalSurface;
  const resolvedSurface =
    surfaceValue === MENU_SURFACE_AUTO ? "var(--canvas)" : surfaceValue;
  const hasControls =
    Boolean(modes && onModeChange) ||
    Boolean(variants && onVariantChange) ||
    Boolean(extras);

  return (
    <div
      className={cn("menu-show", className)}
      style={
        {
          "--menu-accent": accent,
          "--menu-surface": resolvedSurface,
          ...style,
        } as CSSProperties
      }
    >
      <div className="menu-show-body">
        <div className="menu-show-top">
          <header className="menu-show-head">
            <span>{eyebrow}</span>
            <h2>{title}</h2>
            <p>{description}</p>
          </header>

          {hasControls ? (
            <div className="menu-show-controls">
              {modes && onModeChange ? (
                <ChipGroup
                  label="Modo do menu"
                  options={modes}
                  value={mode}
                  onChange={onModeChange}
                />
              ) : null}

              {variants && onVariantChange ? (
                <ChipGroup
                  label="Variação do menu"
                  options={variants}
                  value={variant}
                  onChange={onVariantChange}
                />
              ) : null}

              {extras}
            </div>
          ) : null}
        </div>

        <div className="menu-show-stage">
          <div className="menu-show-slot">{children}</div>
        </div>

        <div className="menu-show-palette">
          <ColorRoulette
            label="Indicador"
            options={accents}
            value={accent}
            onChange={onAccentChange}
            draggable={draggableRoulette}
          />

          {showSurfaceColors ? (
            <ColorRoulette
              label="Menu"
              options={surfaces}
              value={surfaceValue}
              onChange={handleSurfaceChange}
              draggable={draggableRoulette}
            />
          ) : null}
        </div>
      </div>
    </div>
  );
}
