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
import { PreviewFrame } from "@/patterns/shared/preview-frame";
import { cn } from "@/lib/utils";
import "./quick-action.css";

type Mode = "public" | "logged";

interface QuickActionItem {
  id: string;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
}

interface AccentSwatch {
  name: string;
  value: string;
}

const accents: AccentSwatch[] = [
  { name: "Teal", value: "#00b0b0" },
  { name: "Coral", value: "#e8725c" },
  { name: "Forest", value: "#2f6f5e" },
  { name: "Amber", value: "#d4a017" },
  { name: "Slate", value: "#4b5563" },
  { name: "Rose", value: "#db6b8a" },
  { name: "Ocean", value: "#3b82f6" },
];

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

export default function QuickActionMenuDemo(props: PatternPreviewProps) {
  const [mode, setMode] = useState<Mode>("logged");
  const [active, setActive] = useState("home");
  const [accent, setAccent] = useState(accents[0].value);

  const actions = mode === "logged" ? loggedActions : publicActions;
  const activeLabel = actions.find((a) => a.id === active)?.label ?? "Home";

  return (
    <PreviewFrame {...props} className="qam-show">
      <div
        className="qam-show-body"
        style={{ "--qam-accent": accent } as CSSProperties}
      >
        <header className="qam-show-head">
          <span>Menu rápido</span>
          <h2>{activeLabel}</h2>
          <p>Toque uma aba — a pill sobe com o ícone.</p>

          <div className="qam-mode" role="group" aria-label="Modo do menu">
            <button
              type="button"
              className={mode === "public" ? "active" : undefined}
              onClick={() => {
                setMode("public");
                setActive("home");
              }}
            >
              Público
            </button>
            <button
              type="button"
              className={mode === "logged" ? "active" : undefined}
              onClick={() => {
                setMode("logged");
                setActive("home");
              }}
            >
              Logado
            </button>
          </div>

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
        </header>

        <div className="qam-swatches" role="group" aria-label="Cor de destaque">
          {accents.map((swatch) => (
            <button
              key={swatch.value}
              type="button"
              className={cn("qam-swatch", accent === swatch.value && "is-selected")}
              style={{ background: swatch.value }}
              aria-label={swatch.name}
              aria-pressed={accent === swatch.value}
              onClick={() => setAccent(swatch.value)}
            />
          ))}
        </div>
      </div>
    </PreviewFrame>
  );
}
