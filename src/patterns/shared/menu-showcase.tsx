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

export const MENU_SURFACES: AccentSwatch[] = [
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
    scrollLeft: number;
    moved: boolean;
  } | null>(null);

  const selectByOffset = (clientX: number) => {
    const track = trackRef.current;
    if (!track) return;
    const buttons = Array.from(
      track.querySelectorAll<HTMLButtonElement>(".menu-show-swatch"),
    );
    if (!buttons.length) return;

    let best = buttons[0];
    let bestDist = Infinity;
    for (const button of buttons) {
      const rect = button.getBoundingClientRect();
      const cx = rect.left + rect.width / 2;
      const dist = Math.abs(clientX - cx);
      if (dist < bestDist) {
        bestDist = dist;
        best = button;
      }
    }
    const next = best.dataset.value;
    if (next && next !== value) onChange(next);
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
          dragRef.current = {
            pointerId: e.pointerId,
            startX: e.clientX,
            scrollLeft: track.scrollLeft,
            moved: false,
          };
          track.setPointerCapture(e.pointerId);
        }}
        onPointerMove={(e) => {
          const drag = dragRef.current;
          const track = trackRef.current;
          if (!drag || drag.pointerId !== e.pointerId || !track) return;
          const dx = e.clientX - drag.startX;
          if (Math.abs(dx) > 6) drag.moved = true;
          if (!drag.moved) return;
          track.scrollLeft = drag.scrollLeft - dx;
          selectByOffset(e.clientX);
        }}
        onPointerUp={(e) => {
          const drag = dragRef.current;
          const track = trackRef.current;
          if (!drag || drag.pointerId !== e.pointerId) return;
          if (track?.hasPointerCapture(e.pointerId)) {
            track.releasePointerCapture(e.pointerId);
          }
          if (drag.moved) selectByOffset(e.clientX);
          dragRef.current = null;
        }}
        onPointerCancel={() => {
          dragRef.current = null;
        }}
      >
        {options.map((swatch) => (
          <button
            key={swatch.value}
            type="button"
            data-value={swatch.value}
            className={cn("menu-show-swatch", value === swatch.value && "is-selected")}
            style={{
              background: swatch.value,
              ["--swatch-ring" as string]: selectedRing,
            }}
            aria-label={swatch.name}
            aria-pressed={value === swatch.value}
            onClick={() => {
              if (dragRef.current?.moved) return;
              onChange(swatch.value);
            }}
          />
        ))}
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
  const [internalSurface, setInternalSurface] = useState(MENU_SURFACES[0].value);
  const surfaceValue = surface ?? internalSurface;
  const handleSurfaceChange = onSurfaceChange ?? setInternalSurface;
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
          "--menu-surface": surfaceValue,
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
