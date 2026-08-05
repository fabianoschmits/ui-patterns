"use client";

import { useRef, useState, type CSSProperties, type ReactNode } from "react";
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

function SwatchRow({
  label,
  options,
  value,
  onChange,
  selectedRing,
}: {
  label: string;
  options: AccentSwatch[];
  value: string;
  onChange: (value: string) => void;
  selectedRing: string;
}) {
  const trackRef = useRef<HTMLDivElement>(null);
  const dragRef = useRef<{
    pointerId: number;
    startX: number;
    startIndex: number;
    lastIndex: number;
    moved: boolean;
  } | null>(null);

  const clampIndex = (index: number) =>
    Math.max(0, Math.min(options.length - 1, index));

  const scrollSwatchIntoView = (index: number) => {
    const track = trackRef.current;
    const button = track?.querySelectorAll<HTMLButtonElement>(".menu-show-swatch")[
      index
    ];
    button?.scrollIntoView({ inline: "center", block: "nearest", behavior: "smooth" });
  };

  const applyIndex = (index: number) => {
    const next = options[clampIndex(index)];
    if (!next) return;
    if (next.value !== value) onChange(next.value);
    scrollSwatchIntoView(clampIndex(index));
  };

  return (
    <div className="menu-show-swatch-row">
      <span className="menu-show-swatch-label">{label}</span>
      <div
        ref={trackRef}
        className="menu-show-swatches"
        role="group"
        aria-label={label}
        onPointerDown={(e) => {
          if (e.button !== 0) return;
          const track = trackRef.current;
          if (!track) return;
          const startIndex = Math.max(
            0,
            options.findIndex((option) => option.value === value),
          );
          dragRef.current = {
            pointerId: e.pointerId,
            startX: e.clientX,
            startIndex,
            lastIndex: startIndex,
            moved: false,
          };
          track.setPointerCapture(e.pointerId);
        }}
        onPointerMove={(e) => {
          const drag = dragRef.current;
          if (!drag || drag.pointerId !== e.pointerId) return;
          const dx = e.clientX - drag.startX;
          if (Math.abs(dx) < 10) return;
          drag.moved = true;
          // Drag left → next colors; drag right → previous colors
          const step = 22;
          const nextIndex = clampIndex(drag.startIndex - Math.round(dx / step));
          if (nextIndex !== drag.lastIndex) {
            drag.lastIndex = nextIndex;
            applyIndex(nextIndex);
          }
        }}
        onPointerUp={(e) => {
          const drag = dragRef.current;
          const track = trackRef.current;
          if (!drag || drag.pointerId !== e.pointerId) return;
          if (track?.hasPointerCapture(e.pointerId)) {
            track.releasePointerCapture(e.pointerId);
          }
          if (drag.moved) applyIndex(drag.lastIndex);
          dragRef.current = null;
        }}
        onPointerCancel={() => {
          dragRef.current = null;
        }}
      >
        {options.map((swatch) => {
          const isAuto = swatch.value === MENU_SURFACE_AUTO;
          return (
            <button
              key={swatch.value}
              type="button"
              data-value={swatch.value}
              className={cn(
                "menu-show-swatch",
                isAuto && "is-auto",
                value === swatch.value && "is-selected",
              )}
              style={
                isAuto
                  ? { ["--swatch-ring" as string]: selectedRing }
                  : {
                      background: swatch.value,
                      ["--swatch-ring" as string]: selectedRing,
                    }
              }
              aria-label={swatch.name}
              aria-pressed={value === swatch.value}
              onClick={() => {
                if (dragRef.current?.moved) return;
                onChange(swatch.value);
                const index = options.findIndex((option) => option.value === swatch.value);
                if (index >= 0) scrollSwatchIntoView(index);
              }}
            />
          );
        })}
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
          <SwatchRow
            label="Indicador"
            options={accents}
            value={accent}
            onChange={onAccentChange}
            selectedRing={accent}
          />

          {showSurfaceColors ? (
            <SwatchRow
              label="Menu"
              options={surfaces}
              value={surfaceValue}
              onChange={handleSurfaceChange}
              selectedRing={accent}
            />
          ) : null}
        </div>
      </div>
    </div>
  );
}
