"use client";

import { useState, type CSSProperties } from "react";
import {
  Briefcase,
  ChevronsLeft,
  ChevronsRight,
  HelpCircle,
  Home,
  Info,
  LogIn,
  Mail,
  Search,
  User,
  Users,
} from "lucide-react";
import { AnimatePresence, LayoutGroup, motion } from "motion/react";
import type { PatternPreviewProps } from "@/types/pattern";
import { MenuShowcase, MENU_ACCENTS } from "@/patterns/shared/menu-showcase";
import { cn } from "@/lib/utils";
import "./quick-action.css";

type Mode = "public" | "logged";
type Orientation = "horizontal" | "vertical";

interface QuickActionItem {
  id: string;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
}

const publicActions: QuickActionItem[] = [
  { id: "home", label: "Home", icon: Home },
  { id: "login", label: "Login", icon: LogIn },
  { id: "about", label: "Sobre", icon: Info },
  { id: "help", label: "Ajuda", icon: HelpCircle },
  { id: "contact", label: "Contato", icon: Mail },
];

const loggedActions: QuickActionItem[] = [
  { id: "home", label: "Home", icon: Home },
  { id: "feed", label: "Feed", icon: Users },
  { id: "search", label: "Buscar", icon: Search },
  { id: "classifieds", label: "Classificados", icon: Briefcase },
  { id: "profile", label: "Perfil", icon: User },
];

const gooey = {
  type: "spring" as const,
  stiffness: 240,
  damping: 22,
  mass: 1.15,
};

const pillSpring = {
  type: "spring" as const,
  stiffness: 380,
  damping: 24,
  mass: 0.9,
};

export default function QuickActionMenuDemo(_props: PatternPreviewProps) {
  const [mode, setMode] = useState<Mode>("logged");
  const [orientation, setOrientation] = useState<Orientation>("horizontal");
  const [expanded, setExpanded] = useState(true);
  const [active, setActive] = useState("home");
  const [accent, setAccent] = useState(MENU_ACCENTS[0].value);

  const actions = mode === "logged" ? loggedActions : publicActions;
  const activeLabel = actions.find((a) => a.id === active)?.label ?? "Home";
  const isVertical = orientation === "vertical";
  const isCollapsed = isVertical && !expanded;

  return (
    <MenuShowcase
      className={cn(
        "qam-show",
        isVertical && "is-vertical",
        isCollapsed && "is-collapsed",
      )}
      style={{ "--qam-accent": accent } as CSSProperties}
      eyebrow="Menu rápido"
      title={activeLabel}
      description={
        isVertical
          ? "Variante lateral — aberta com rótulos ou retraída só com ícones."
          : "Toque uma aba — a pill sobe com o ícone."
      }
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
      }}
      variants={[
        { id: "horizontal", label: "Inferior" },
        { id: "vertical", label: "Lateral" },
      ]}
      variant={orientation}
      onVariantChange={(id) => {
        setOrientation(id as Orientation);
        if (id === "horizontal") setExpanded(true);
      }}
      extras={
        isVertical ? (
          <div className="menu-show-mode" role="group" aria-label="Estado da lateral">
            <button
              type="button"
              className={expanded ? "active" : undefined}
              onClick={() => setExpanded(true)}
            >
              Aberto
            </button>
            <button
              type="button"
              className={!expanded ? "active" : undefined}
              onClick={() => setExpanded(false)}
            >
              Ícones
            </button>
          </div>
        ) : null
      }
    >
      <LayoutGroup id="qam-layout">
        <div className={cn("qam-stage", isVertical && "is-vertical")}>
          <motion.nav
            layout
            className={cn(
              "qam-bar",
              isVertical && "is-vertical",
              isCollapsed && "is-collapsed",
            )}
            aria-label="Menu rápido"
            transition={gooey}
          >
            <motion.div layout className="qam-bar-bg" transition={gooey}>
              <span className="qam-glass-base" aria-hidden="true" />
              <span className="qam-glass-tint" aria-hidden="true" />
              <span className="qam-glass-sheen" aria-hidden="true" />
              <span className="qam-glass-rim" aria-hidden="true" />
            </motion.div>

            <motion.div layout className="qam-items" transition={gooey}>
              {actions.map((action) => {
                const Icon = action.icon;
                const isActive = active === action.id;

                return (
                  <motion.button
                    layout
                    key={action.id}
                    type="button"
                    className={cn("qam-item", isActive && "is-active")}
                    aria-label={action.label}
                    aria-current={isActive ? "page" : undefined}
                    title={isCollapsed ? action.label : undefined}
                    onClick={() => setActive(action.id)}
                    transition={gooey}
                  >
                    <div className="qam-icon-slot">
                      <motion.div
                        className="qam-icon-wrap"
                        animate={isVertical ? { y: 0 } : { y: isActive ? -16 : 0 }}
                        transition={gooey}
                      >
                        <AnimatePresence>
                          {isActive && (
                            <motion.span
                              layoutId="qam-active-pill"
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

                    <AnimatePresence initial={false} mode="popLayout">
                      {!isCollapsed && (
                        <motion.span
                          key={`${action.id}-label`}
                          layout
                          className={cn("qam-label", isActive && "is-active")}
                          initial={{ opacity: 0, maxWidth: 0, scale: 0.92 }}
                          animate={{
                            opacity: 1,
                            maxWidth: 140,
                            scale: isActive && !isVertical ? 1.04 : 1,
                          }}
                          exit={{ opacity: 0, maxWidth: 0, scale: 0.92 }}
                          transition={gooey}
                        >
                          {action.label}
                        </motion.span>
                      )}
                    </AnimatePresence>
                  </motion.button>
                );
              })}
            </motion.div>

            {isVertical ? (
              <motion.button
                layout
                type="button"
                className="qam-rail-toggle"
                aria-label={expanded ? "Retrair menu" : "Expandir menu"}
                onClick={() => setExpanded((value) => !value)}
                transition={gooey}
              >
                {expanded ? <ChevronsLeft size={16} /> : <ChevronsRight size={16} />}
              </motion.button>
            ) : null}
          </motion.nav>
        </div>
      </LayoutGroup>
    </MenuShowcase>
  );
}
