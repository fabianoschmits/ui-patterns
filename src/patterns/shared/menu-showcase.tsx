"use client";

import { useState, type CSSProperties, type ReactNode } from "react";
import { cn } from "@/lib/utils";
import "./menu-showcase.css";

export interface AccentSwatch {
  name: string;
  value: string;
}

export const MENU_ACCENTS: AccentSwatch[] = [
  { name: "Teal", value: "#00b0b0" },
  { name: "Coral", value: "#e8725c" },
  { name: "Forest", value: "#2f6f5e" },
  { name: "Amber", value: "#d4a017" },
  { name: "Slate", value: "#4b5563" },
  { name: "Rose", value: "#db6b8a" },
  { name: "Ocean", value: "#3b82f6" },
];

export const MENU_SURFACES: AccentSwatch[] = [
  { name: "Branco", value: "#f5f4f2" },
  { name: "Cinza claro", value: "#e4e3e0" },
  { name: "Pedra", value: "#c8c6c1" },
  { name: "Fumaça", value: "#8f8e8a" },
  { name: "Grafite", value: "#565552" },
  { name: "Carvão", value: "#2c2b29" },
  { name: "Preto", value: "#151514" },
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
  return (
    <div className="menu-show-swatch-row">
      <span className="menu-show-swatch-label">{label}</span>
      <div className="menu-show-swatches" role="group" aria-label={label}>
        {options.map((swatch) => (
          <button
            key={swatch.value}
            type="button"
            className={cn("menu-show-swatch", value === swatch.value && "is-selected")}
            style={{
              background: swatch.value,
              ["--swatch-ring" as string]: selectedRing,
            }}
            aria-label={swatch.name}
            aria-pressed={value === swatch.value}
            onClick={() => onChange(swatch.value)}
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
