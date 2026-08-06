"use client";

import {
  useId,
  useState,
  type CSSProperties,
  type ReactNode,
} from "react";
import { Columns2, Rows2 } from "lucide-react";
import { LayoutGroup, motion } from "motion/react";
import type { PatternPreviewProps } from "@/types/pattern";
import { cn } from "@/lib/utils";
import "./utility-showcase.css";
import "./utility-components.css";

export type UtilityOrientation = "horizontal" | "vertical";
export type UtilitySize = "small" | "medium" | "large";

export interface UtilityVariant {
  orientation: UtilityOrientation;
  size: UtilitySize;
}

interface UtilityShowcaseProps extends PatternPreviewProps {
  eyebrow: string;
  title: string;
  description: string;
  accent?: string;
  children: ReactNode | ((variant: UtilityVariant) => ReactNode);
}

export const utilitySpring = {
  type: "spring" as const,
  stiffness: 260,
  damping: 25,
  mass: 0.95,
};

export const utilityQuickSpring = {
  type: "spring" as const,
  stiffness: 420,
  damping: 29,
  mass: 0.78,
};

const sizes: Array<{ value: UtilitySize; label: string; short: string }> = [
  { value: "small", label: "Pequeno", short: "P" },
  { value: "medium", label: "Médio", short: "M" },
  { value: "large", label: "Grande", short: "G" },
];

export function UtilityShowcase({
  eyebrow,
  title,
  description,
  accent = "#11b6ae",
  compact = false,
  children,
}: UtilityShowcaseProps) {
  const uid = useId().replace(/:/g, "");
  const [orientation, setOrientation] =
    useState<UtilityOrientation>("horizontal");
  const [size, setSize] = useState<UtilitySize>(compact ? "small" : "medium");
  const variant = { orientation, size };
  const content = typeof children === "function" ? children(variant) : children;

  return (
    <div
      className={cn("utility-show", compact && "is-compact")}
      style={{ "--utility-accent": accent } as CSSProperties}
    >
      <div className="utility-aurora" aria-hidden="true">
        <i />
        <i />
        <i />
      </div>

      {!compact ? (
        <header className="utility-show-head">
          <div className="utility-heading">
            <span>{eyebrow}</span>
            <motion.h1 layout transition={utilitySpring}>
              {title}
            </motion.h1>
            <p>{description}</p>
          </div>

          <LayoutGroup id={`utility-controls-${uid}`}>
            <div className="utility-controls" aria-label="Variações do componente">
              <div className="utility-segment" role="group" aria-label="Orientação">
                {(
                  [
                    ["horizontal", Columns2, "Horizontal"],
                    ["vertical", Rows2, "Vertical"],
                  ] as const
                ).map(([value, Icon, label]) => {
                  const active = orientation === value;
                  return (
                    <button
                      key={value}
                      type="button"
                      className={active ? "is-active" : undefined}
                      aria-pressed={active}
                      onClick={() => setOrientation(value)}
                    >
                      {active ? (
                        <motion.span
                          layoutId={`utility-orientation-${uid}`}
                          className="utility-control-pill"
                          transition={utilityQuickSpring}
                        />
                      ) : null}
                      <Icon size={14} strokeWidth={1.8} />
                      <span>{label}</span>
                    </button>
                  );
                })}
              </div>

              <div className="utility-segment utility-size-switch" role="group" aria-label="Tamanho">
                {sizes.map((option) => {
                  const active = size === option.value;
                  return (
                    <button
                      key={option.value}
                      type="button"
                      className={active ? "is-active" : undefined}
                      aria-label={option.label}
                      aria-pressed={active}
                      onClick={() => setSize(option.value)}
                    >
                      {active ? (
                        <motion.span
                          layoutId={`utility-size-${uid}`}
                          className="utility-control-pill"
                          transition={utilityQuickSpring}
                        />
                      ) : null}
                      <span>{option.short}</span>
                    </button>
                  );
                })}
              </div>
            </div>
          </LayoutGroup>
        </header>
      ) : null}

      <main className="utility-stage">
        <LayoutGroup id={`utility-card-${uid}`}>
          <motion.section
            layout
            className={cn(
              "utility-card",
              `is-${orientation}`,
              `is-${size}`,
            )}
            data-orientation={orientation}
            data-size={size}
            transition={utilitySpring}
            aria-label={`${title} — ${orientation === "horizontal" ? "horizontal" : "vertical"}, tamanho ${size}`}
          >
            <div className="utility-glass" aria-hidden="true">
              <span className="utility-glass-base" />
              <span className="utility-glass-tint" />
              <span className="utility-glass-shine" />
              <span className="utility-glass-rim" />
            </div>
            <motion.div layout className="utility-card-content" transition={utilitySpring}>
              {content}
            </motion.div>
          </motion.section>
        </LayoutGroup>
      </main>
    </div>
  );
}
