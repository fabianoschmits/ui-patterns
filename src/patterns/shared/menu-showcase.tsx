"use client";

import type { CSSProperties, ReactNode } from "react";
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

export function MenuShowcase({
  eyebrow,
  title,
  description,
  accent,
  onAccentChange,
  accents = MENU_ACCENTS,
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
  return (
    <div
      className={cn("menu-show", className)}
      style={{ "--menu-accent": accent, ...style } as CSSProperties}
    >
      <div className="menu-show-body">
        <header className="menu-show-head">
          <span>{eyebrow}</span>
          <h2>{title}</h2>
          <p>{description}</p>

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

          <div className="menu-show-slot">{children}</div>
        </header>

        <div className="menu-show-swatches" role="group" aria-label="Cor de destaque">
          {accents.map((swatch) => (
            <button
              key={swatch.value}
              type="button"
              className={cn("menu-show-swatch", accent === swatch.value && "is-selected")}
              style={{ background: swatch.value }}
              aria-label={swatch.name}
              aria-pressed={accent === swatch.value}
              onClick={() => onAccentChange(swatch.value)}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
