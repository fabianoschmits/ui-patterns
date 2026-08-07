"use client";

import {
  useId,
  useEffect,
  useRef,
  useState,
  type CSSProperties,
  type ReactNode,
} from "react";
import { Bell, Check, Columns2, PencilLine, Rows2, Search, Wifi } from "lucide-react";
import { AnimatePresence, LayoutGroup, MotionConfig, motion } from "motion/react";
import type { PatternPreviewProps } from "@/types/pattern";
import { cn } from "@/lib/utils";
import {
  ColorRoulette,
  MENU_ACCENTS,
  MENU_SURFACE_AUTO,
  MENU_SURFACES,
} from "@/patterns/shared/menu-showcase";
import "./utility-showcase.css";
import "./utility-components.css";
import "./utility-glass-panels.css";

export type UtilityOrientation = "horizontal" | "vertical";
export type UtilitySize = "small" | "medium" | "large";
export type UtilityFrame = "narrow" | "standard" | "wide";

export interface UtilityVariant {
  orientation: UtilityOrientation;
  size: UtilitySize;
}

interface UtilityShowcaseProps extends PatternPreviewProps {
  eyebrow: string;
  title: string;
  description: string;
  accent?: string;
  frame?: UtilityFrame;
  showAppChrome?: boolean;
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

export type UtilityLiquidIndicatorTone = "solid" | "soft" | "outline";

export function UtilityLiquidIndicator({
  layoutId,
  tone = "solid",
  className,
}: {
  layoutId: string;
  tone?: UtilityLiquidIndicatorTone;
  className?: string;
}) {
  return (
    <motion.span
      layoutId={layoutId}
      className={cn("u-liquid-indicator", `is-${tone}`, className)}
      initial={{ opacity: 0, scaleX: 1.32, scaleY: 0.68 }}
      animate={{ opacity: 1, scaleX: 1, scaleY: 1 }}
      exit={{ opacity: 0, scaleX: 0.68, scaleY: 1.28 }}
      transition={utilityQuickSpring}
      aria-hidden="true"
    />
  );
}

const sizes: Array<{ value: UtilitySize; label: string; short: string }> = [
  { value: "small", label: "Pequeno", short: "P" },
  { value: "medium", label: "Médio", short: "M" },
  { value: "large", label: "Grande", short: "G" },
];

function getAccentInk(color: string) {
  const value = color.replace("#", "");
  if (!/^[0-9a-f]{6}$/i.test(value)) return "#ffffff";

  const channels = [0, 2, 4].map((offset) => {
    const channel = Number.parseInt(value.slice(offset, offset + 2), 16) / 255;
    return channel <= 0.04045
      ? channel / 12.92
      : ((channel + 0.055) / 1.055) ** 2.4;
  });
  const luminance = channels[0] * 0.2126 + channels[1] * 0.7152 + channels[2] * 0.0722;

  return luminance > 0.18 ? "#000000" : "#ffffff";
}

export function UtilityShowcase({
  eyebrow,
  title,
  description,
  compact = false,
  frame = "standard",
  showAppChrome = true,
  children,
}: UtilityShowcaseProps) {
  const uid = useId().replace(/:/g, "");
  const [orientation, setOrientation] =
    useState<UtilityOrientation>("horizontal");
  const [size, setSize] = useState<UtilitySize>(compact ? "small" : "medium");
  const [activeAccent, setActiveAccent] = useState(MENU_ACCENTS[0].value);
  const [activeSurface, setActiveSurface] = useState(MENU_SURFACE_AUTO);
  const [editing, setEditing] = useState(false);
  const [workspaceSearch, setWorkspaceSearch] = useState("");
  const [showNotifications, setShowNotifications] = useState(false);
  const contentRef = useRef<HTMLDivElement>(null);
  const hasAppChrome = !compact && showAppChrome;
  const variant = { orientation, size };
  const content = typeof children === "function" ? children(variant) : children;
  const resolvedSurface = activeSurface === MENU_SURFACE_AUTO ? "var(--canvas)" : activeSurface;

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
    <MotionConfig reducedMotion="user" transition={utilitySpring}>
      <div
        className={cn("utility-show", compact && "is-compact")}
        style={{
          "--utility-accent": activeAccent,
          "--utility-accent-ink": getAccentInk(activeAccent),
          "--menu-accent": activeAccent,
          "--utility-card-surface": resolvedSurface,
          "--menu-surface": resolvedSurface,
        } as CSSProperties}
      >
      <div className="utility-show-body">
        {!compact ? (
          <div className="utility-show-top">
            <header className="utility-show-head">
              <span>{eyebrow}</span>
              <h1>{title}</h1>
              <p>{description}</p>
            </header>

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
                        <UtilityLiquidIndicator
                          layoutId={`utility-orientation-${uid}`}
                          className="utility-control-pill"
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
                        <UtilityLiquidIndicator
                          layoutId={`utility-size-${uid}`}
                          className="utility-control-pill"
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
          </div>
        ) : null}

        <main className="utility-stage">
        <LayoutGroup id={`utility-card-${uid}`}>
          <motion.section
            layout
            className={cn(
              "utility-card",
              `is-${orientation}`,
              `is-${size}`,
              `is-frame-${frame}`,
            )}
            data-orientation={orientation}
            data-size={size}
            data-frame={frame}
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
              className={cn(
                "utility-card-content",
                hasAppChrome && "has-appbar",
                editing && "is-editing",
              )}
              transition={utilitySpring}
            >
              {hasAppChrome ? (
                <div className="utility-appbar">
                  <div className="utility-appbrand">
                    <span className="utility-appmark"><Columns2 size={14} /></span>
                    <span>
                      <b>{title}</b>
                      <small>Workspace principal</small>
                    </span>
                  </div>

                  <label className="utility-appsearch">
                    <Search size={14} />
                    <input
                      value={workspaceSearch}
                      onChange={(event) => setWorkspaceSearch(event.target.value)}
                      placeholder="Buscar nesta tela"
                      aria-label="Buscar nesta tela"
                    />
                    <kbd>⌘ K</kbd>
                  </label>

                  <div className="utility-appstatus" role="status">
                    <Wifi size={13} />
                    <span>Sincronizado</span>
                  </div>

                  <div className="utility-appactions">
                    <motion.button
                      type="button"
                      aria-label="Abrir notificações"
                      aria-expanded={showNotifications}
                      onClick={() => setShowNotifications((value) => !value)}
                      whileTap={{ scale: 0.9 }}
                      transition={utilityQuickSpring}
                    >
                      <Bell size={14} />
                      <i />
                    </motion.button>
                    <span className="utility-appavatar" aria-label="Conta de Marina Souza">MS</span>
                  </div>

                  <AnimatePresence>
                    {showNotifications ? (
                      <motion.div
                        className="utility-appnotifications"
                        initial={{ opacity: 0, y: -8, scale: 0.96 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: -6, scale: 0.97 }}
                        transition={utilityQuickSpring}
                      >
                        <span className="u-kicker">Agora</span>
                        <b>Seu workspace está atualizado</b>
                        <small>Todos os dados desta tela foram sincronizados.</small>
                      </motion.div>
                    ) : null}
                  </AnimatePresence>
                </div>
              ) : null}
              <motion.div
                layout
                className="utility-app-view"
                transition={utilitySpring}
              >
                {content}
              </motion.div>
            </motion.div>
          </motion.section>
        </LayoutGroup>
        </main>

        {!compact ? (
          <div className="utility-palette">
            <ColorRoulette
              label="Destaque"
              options={MENU_ACCENTS}
              value={activeAccent}
              onChange={setActiveAccent}
              draggable
            />
            <ColorRoulette
              label="Componente"
              options={MENU_SURFACES}
              value={activeSurface}
              onChange={setActiveSurface}
              draggable
            />
          </div>
        ) : null}
        </div>
      </div>
    </MotionConfig>
  );
}
