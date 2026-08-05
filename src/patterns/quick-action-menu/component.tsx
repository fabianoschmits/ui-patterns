"use client";

import { useState, type CSSProperties } from "react";
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
import "./quick-action.css";

type Mode = "public" | "logged";

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

export default function QuickActionMenuDemo(_props: PatternPreviewProps) {
  const [mode, setMode] = useState<Mode>("logged");
  const [active, setActive] = useState("home");
  const [accent, setAccent] = useState(MENU_ACCENTS[0].value);

  const actions = mode === "logged" ? loggedActions : publicActions;
  const activeLabel = actions.find((a) => a.id === active)?.label ?? "Home";

  return (
    <MenuShowcase
      className="qam-show"
      style={{ "--qam-accent": accent } as CSSProperties}
      eyebrow="Menu rápido"
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
      }}
    >
      <nav className="qam-bar" aria-label="Menu rápido">
        <div className="qam-bar-bg" />

        <div className="qam-items">
          {actions.map((action) => {
            const Icon = action.icon;
            const isActive = active === action.id;

            return (
              <button
                key={action.id}
                type="button"
                className="qam-item"
                aria-label={action.label}
                aria-current={isActive ? "page" : undefined}
                onClick={() => setActive(action.id)}
              >
                <div className="qam-icon-slot">
                  <motion.div
                    className="qam-icon-wrap"
                    animate={{ y: isActive ? -16 : 0 }}
                    transition={{ type: "spring", stiffness: 300, damping: 28 }}
                  >
                    <AnimatePresence>
                      {isActive && (
                        <motion.span
                          layoutId="qam-active-pill"
                          className="qam-active-pill"
                          initial={{ opacity: 0, scaleX: 1.45, scaleY: 0.55 }}
                          animate={{ opacity: 1, scaleX: 1, scaleY: 1 }}
                          exit={{ opacity: 0, scaleX: 0.55, scaleY: 1.4 }}
                          transition={{
                            type: "spring",
                            stiffness: 380,
                            damping: 24,
                            mass: 0.9,
                          }}
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
