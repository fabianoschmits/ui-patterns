"use client";

import {
  useId,
  useEffect,
  useRef,
  useState,
  type CSSProperties,
  type ReactNode,
} from "react";
import { Check, Columns2, PencilLine, Rows2 } from "lucide-react";
import { LayoutGroup, motion } from "motion/react";
import type { PatternPreviewProps } from "@/types/pattern";
import { cn } from "@/lib/utils";
import { ColorRoulette, MENU_ACCENTS } from "@/patterns/shared/menu-showcase";
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
  stiffness: 240,
  damping: 22,
  mass: 1.15,
};

export const utilityQuickSpring = {
  type: "spring" as const,
  stiffness: 380,
  damping: 24,
  mass: 0.9,
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
  compact = false,
  children,
}: UtilityShowcaseProps) {
  const uid = useId().replace(/:/g, "");
  const [orientation, setOrientation] =
    useState<UtilityOrientation>("horizontal");
  const [size, setSize] = useState<UtilitySize>(compact ? "small" : "medium");
  const [activeAccent, setActiveAccent] = useState(MENU_ACCENTS[0].value);
  const [editing, setEditing] = useState(false);
  const contentRef = useRef<HTMLDivElement>(null);
  const variant = { orientation, size };
  const content = typeof children === "function" ? children(variant) : children;

  useEffect(() => {
    const root = contentRef.current;
    if (!root || !editing) return;

    const enableEditableData = () => {
      const candidates = root.querySelectorAll<HTMLElement>(
        "h2, h3, p, .u-main b, .u-main strong, .u-main small, .u-main .data-status",
      );
      candidates.forEach((element) => {
        if (element.closest("button, .utility-controls, .utility-palette")) return;
        if (!element.textContent?.trim()) return;
        element.setAttribute("contenteditable", "plaintext-only");
        element.setAttribute("spellcheck", "false");
        element.setAttribute("title", "Clique para editar este dado");
        element.classList.add("utility-live-edit");
      });
    };

    enableEditableData();
    const observer = new MutationObserver(enableEditableData);
    observer.observe(root, { childList: true, subtree: true });

    return () => {
      observer.disconnect();
      root.querySelectorAll<HTMLElement>(".utility-live-edit").forEach((element) => {
        element.removeAttribute("contenteditable");
        element.removeAttribute("spellcheck");
        element.removeAttribute("title");
        element.classList.remove("utility-live-edit");
      });
    };
  }, [editing, orientation, size]);

  return (
    <div
      className={cn("utility-show", compact && "is-compact")}
      style={{
        "--utility-accent": activeAccent,
        "--menu-accent": activeAccent,
      } as CSSProperties}
    >
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
                    <motion.button
                      layout
                      key={value}
                      type="button"
                      className={active ? "is-active" : undefined}
                      aria-pressed={active}
                      onClick={() => setOrientation(value)}
                      whileTap={{ scale: 0.9 }}
                      transition={utilitySpring}
                    >
                      {active ? (
                        <motion.span
                          layoutId={`utility-orientation-${uid}`}
                          className="utility-control-pill"
                          initial={false}
                          transition={utilityQuickSpring}
                        />
                      ) : null}
                      <Icon size={14} strokeWidth={1.8} />
                      <span>{label}</span>
                    </motion.button>
                  );
                })}
              </div>

              <div className="utility-segment utility-size-switch" role="group" aria-label="Tamanho">
                {sizes.map((option) => {
                  const active = size === option.value;
                  return (
                    <motion.button
                      layout
                      key={option.value}
                      type="button"
                      className={active ? "is-active" : undefined}
                      aria-label={option.label}
                      aria-pressed={active}
                      onClick={() => setSize(option.value)}
                      whileTap={{ scale: 0.88 }}
                      transition={utilitySpring}
                    >
                      {active ? (
                        <motion.span
                          layoutId={`utility-size-${uid}`}
                          className="utility-control-pill"
                          initial={false}
                          transition={utilityQuickSpring}
                        />
                      ) : null}
                      <span>{option.short}</span>
                    </motion.button>
                  );
                })}
              </div>

              <motion.button
                type="button"
                className={cn("utility-edit-toggle", editing && "is-active")}
                aria-pressed={editing}
                onClick={() => setEditing((value) => !value)}
                whileTap={{ scale: 0.92 }}
                transition={utilityQuickSpring}
              >
                {editing ? <Check size={14} /> : <PencilLine size={14} />}
                <span>{editing ? "Concluir" : "Editar dados"}</span>
              </motion.button>
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
            animate={{
              borderRadius: orientation === "vertical" ? 34 : size === "small" ? 20 : 28,
            }}
            transition={utilitySpring}
            aria-label={`${title} — ${orientation === "horizontal" ? "horizontal" : "vertical"}, tamanho ${size}`}
          >
            <div className="utility-glass" aria-hidden="true">
              <span className="utility-glass-base" />
              <span className="utility-glass-tint" />
              <span className="utility-glass-shine" />
              <span className="utility-glass-rim" />
              <motion.span
                key={`${orientation}-${size}`}
                className="utility-glass-wave"
                initial={orientation === "horizontal" ? { opacity: 0, x: "-115%" } : { opacity: 0, y: "-115%" }}
                animate={orientation === "horizontal" ? { opacity: [0, 0.72, 0], x: "115%" } : { opacity: [0, 0.72, 0], y: "115%" }}
                transition={{ duration: 0.72, ease: [0.22, 0.8, 0.2, 1] }}
              />
            </div>
            <motion.div
              ref={contentRef}
              layout
              className={cn("utility-card-content", editing && "is-editing")}
              transition={utilitySpring}
            >
              {content}
            </motion.div>
          </motion.section>
        </LayoutGroup>
      </main>

      {!compact ? (
        <div className="utility-palette">
          <ColorRoulette
            label="Cor do componente"
            options={MENU_ACCENTS}
            value={activeAccent}
            onChange={setActiveAccent}
            draggable
          />
        </div>
      ) : null}
    </div>
  );
}
