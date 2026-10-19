"use client";

import { useEffect, useRef, useState, type PointerEvent as ReactPointerEvent } from "react";
import {
  Home,
  Calendar,
  Dumbbell,
  Play,
  BarChart3,
  ChevronUp,
  X,
  CornerUpRight,
  User,
  BookOpen,
  History,
  Activity,
  Briefcase,
  Settings,
  HelpCircle,
  Move,
  Flame,
  CheckCircle2,
} from "lucide-react";
import { motion, AnimatePresence, LayoutGroup } from "motion/react";
import type { PatternPreviewProps } from "@/types/pattern";
import "./fitpro-corner.css";

// Tabs principais horizontais (Fit Pro Player)
interface MainTab {
  id: string;
  label: string;
  icon: typeof Home;
  isAction?: boolean;
}

const MAIN_TABS: MainTab[] = [
  { id: "home", label: "Início", icon: Home },
  { id: "plan", label: "Planos", icon: Calendar },
  { id: "workout", label: "Treinar", icon: Dumbbell, isAction: true },
  { id: "stats", label: "Evolução", icon: BarChart3 },
];

// Links do "Mais" verticais (Fit Pro Player More.jsx)
interface MoreItem {
  id: string;
  title: string;
  subtitle: string;
  icon: typeof User;
  category: string;
}

const MORE_ITEMS: MoreItem[] = [
  { id: "personal-data", title: "Dados Pessoais", subtitle: "Perfil e bio", icon: User, category: "Geral" },
  { id: "library", title: "Exercícios", subtitle: "Catálogo completo", icon: BookOpen, category: "Treino" },
  { id: "history", title: "Histórico", subtitle: "Sessões passadas", icon: History, category: "Treino" },
  { id: "body-progress", title: "Evolução Corporal", subtitle: "Medidas e peso", icon: Activity, category: "Treino" },
  { id: "professional", title: "Área Profissional", subtitle: "Alunos e programas", icon: Briefcase, category: "Pro" },
  { id: "settings", title: "Configurações", subtitle: "Preferências e tema", icon: Settings, category: "Geral" },
  { id: "support", title: "Ajuda & Suporte", subtitle: "Dúvidas e contato", icon: HelpCircle, category: "Sobre" },
];

export default function FitproCornerNavDemo(props: PatternPreviewProps) {
  const [open, setOpen] = useState(true);
  const [verticalOpen, setVerticalOpen] = useState(false);
  const [activeTab, setActiveTab] = useState("home");
  const [isWorkoutActive, setIsWorkoutActive] = useState(false);
  const [dragTab, setDragTab] = useState<string | null>(null);
  const [isDraggableMode, setIsDraggableMode] = useState(false);

  const containerRef = useRef<HTMLDivElement>(null);
  const horizontalArmRef = useRef<HTMLDivElement>(null);
  const tabRefs = useRef<Map<string, HTMLButtonElement>>(new Map());

  // Obter detalhes do item ativo
  const currentMain = MAIN_TABS.find((t) => t.id === activeTab);
  const currentMore = MORE_ITEMS.find((m) => m.id === activeTab);
  const activeLabel = currentMain ? currentMain.label : currentMore ? currentMore.title : "Início";
  const ActiveIcon = currentMain ? currentMain.icon : currentMore ? currentMore.icon : Home;

  // Fechar ao clicar fora
  useEffect(() => {
    if (!open && !verticalOpen) return;
    const handleOutside = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setVerticalOpen(false);
      }
    };
    document.addEventListener("mousedown", handleOutside);
    return () => document.removeEventListener("mousedown", handleOutside);
  }, [open, verticalOpen]);

  // Sistema de Drag & Scrub (arrasto contínuo para seleção como no Fit Pro Player)
  const handlePointerDown = (e: ReactPointerEvent<HTMLDivElement>) => {
    if (e.pointerType === "mouse" && e.button !== 0) return;
    if ((e.target as HTMLElement).closest(".fpp-drag-toggle-tab")) return;
    const arm = horizontalArmRef.current;
    if (!arm) return;

    arm.setPointerCapture(e.pointerId);

    const findNearest = (clientX: number) => {
      let nearestKey: string | null = null;
      let minDistance = Infinity;

      tabRefs.current.forEach((el, key) => {
        const rect = el.getBoundingClientRect();
        const center = rect.left + rect.width / 2;
        const dist = Math.abs(clientX - center);
        if (dist < minDistance) {
          minDistance = dist;
          nearestKey = key;
        }
      });
      return nearestKey;
    };

    const targetKey = findNearest(e.clientX);
    if (targetKey) setDragTab(targetKey);

    const handlePointerMove = (moveEvt: PointerEvent) => {
      const nearest = findNearest(moveEvt.clientX);
      if (nearest) setDragTab(nearest);
    };

    const handlePointerUp = (upEvt: PointerEvent) => {
      arm.removeEventListener("pointermove", handlePointerMove);
      arm.removeEventListener("pointerup", handlePointerUp);
      arm.removeEventListener("pointercancel", handlePointerUp);

      try {
        if (arm.hasPointerCapture(upEvt.pointerId)) {
          arm.releasePointerCapture(upEvt.pointerId);
        }
      } catch {}

      const finalTarget = findNearest(upEvt.clientX);
      if (finalTarget) {
        if (finalTarget === "workout") {
          setIsWorkoutActive((prev) => !prev);
          setActiveTab("workout");
        } else {
          setActiveTab(finalTarget);
        }
      }
      setDragTab(null);
    };

    arm.addEventListener("pointermove", handlePointerMove);
    arm.addEventListener("pointerup", handlePointerUp);
    arm.addEventListener("pointercancel", handlePointerUp);
  };

  const handleTabClick = (tab: MainTab) => {
    if (tab.id === "workout") {
      setIsWorkoutActive((prev) => !prev);
      setActiveTab("workout");
    } else {
      setActiveTab(tab.id);
    }
  };

  return (
    <div className="fpp-corner-wrap" ref={containerRef}>
      {/* Cenário de Fundo Simulado do Fit Pro Player */}
      <div className="fpp-screen-backdrop">
        <div className="fpp-screen-header">
          <div className="fpp-user-badge">
            <div className="fpp-avatar-circle">FS</div>
            <div className="fpp-user-text">
              <h3>Fabiano Schmits</h3>
              <p>Plano Hipertrofia A • Semana 4</p>
            </div>
          </div>

          {isWorkoutActive && (
            <motion.div
              className="fpp-active-workout-pill"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
            >
              <span className="fpp-workout-dot" />
              <span>TREINO EM ANDAMENTO (00:42)</span>
            </motion.div>
          )}
        </div>

        {/* Card de Treino do Dia */}
        <div className="fpp-mock-card">
          <div className="fpp-mock-card-title">
            <span>Treino do Dia: Peitoral & Tríceps</span>
            <span style={{ color: "#40c8e0" }}>5 exercícios</span>
          </div>
          <div className="fpp-mock-stats">
            <div className="fpp-mock-stat-item">
              <span className="fpp-mock-stat-num">52 min</span>
              <span className="fpp-mock-stat-lbl">Tempo estimado</span>
            </div>
            <div className="fpp-mock-stat-item">
              <span className="fpp-mock-stat-num">16</span>
              <span className="fpp-mock-stat-lbl">Séries totais</span>
            </div>
            <div className="fpp-mock-stat-item">
              <span className="fpp-mock-stat-num">480 kcal</span>
              <span className="fpp-mock-stat-lbl">Gasto calórico</span>
            </div>
          </div>
        </div>
      </div>

      {/* Dock de Canto Draggable / Articulado */}
      <motion.div
        className="fpp-corner-dock"
        data-draggable={isDraggableMode}
        drag={isDraggableMode}
        dragMomentum={false}
        dragConstraints={containerRef}
      >
        <div className="fpp-corner-assembly">
          {/* Trilhos Guia de Articulação */}
          {open && (
            <>
              <motion.span
                className="fpp-rail fpp-rail-h"
                initial={{ scaleX: 0 }}
                animate={{ scaleX: 1 }}
                transition={{ duration: 0.28, ease: [0.2, 0.8, 0.2, 1] }}
                style={{ transformOrigin: "left" }}
              />
              {verticalOpen && (
                <motion.span
                  className="fpp-rail fpp-rail-v"
                  initial={{ scaleY: 0 }}
                  animate={{ scaleY: 1 }}
                  style={{ height: 260, transformOrigin: "bottom" }}
                  transition={{ duration: 0.24, ease: [0.2, 0.8, 0.2, 1] }}
                />
              )}
            </>
          )}

          {/* Pivô de Canto (Trigger Principal + Seta Superior para "Mais") */}
          <div className="fpp-pivot-hub">
            {/* Seta para Cima (Abre o "Mais" do Fit Pro Player) */}
            <AnimatePresence>
              {open && (
                <motion.button
                  key="fpp-up-arrow"
                  type="button"
                  className="fpp-up-trigger"
                  data-active={verticalOpen}
                  title="Abrir links do 'Mais' do Fit Pro Player"
                  aria-label="Abrir links do Mais"
                  onClick={() => setVerticalOpen((prev) => !prev)}
                  initial={{ opacity: 0, y: 14, scale: 0.8 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: 10, scale: 0.8 }}
                  transition={{ duration: 0.2, ease: [0.2, 0.8, 0.2, 1] }}
                >
                  <ChevronUp size={22} className="fpp-up-trigger-icon" />
                </motion.button>
              )}
            </AnimatePresence>

            {/* Gatilho de Canto (Esconder / Mostrar com nome do local dentro do botão abaixo do ícone) */}
            <button
              type="button"
              className="fpp-corner-trigger"
              title={open ? "Fechar navegação" : `Local atual: ${activeLabel} • Clique para abrir`}
              aria-label={open ? "Fechar navegação" : `Local atual: ${activeLabel}`}
              onClick={() => {
                if (open) {
                  setOpen(false);
                  setVerticalOpen(false);
                } else {
                  setOpen(true);
                }
              }}
            >
              {open ? <X size={20} /> : <ActiveIcon size={20} />}
              <span className="fpp-corner-trigger-label">
                {open ? "Fechar" : activeLabel}
              </span>
              <span className="fpp-corner-dot-hinge" />
            </button>
          </div>

          {/* Haste Vertical (Links do "Mais" do Fit Pro Player) */}
          <AnimatePresence>
            {open && verticalOpen && (
              <motion.div
                className="fpp-arm-vertical"
                initial={{ opacity: 0, rotateX: -65, y: 15 }}
                animate={{ opacity: 1, rotateX: 0, y: 0 }}
                exit={{ opacity: 0, rotateX: -45, y: 10 }}
                transition={{ duration: 0.24, ease: [0.2, 0.8, 0.2, 1] }}
              >
                <div className="fpp-vertical-header">
                  <span>Mais Opções</span>
                  <small>Fit Pro Player</small>
                </div>

                {MORE_ITEMS.map((item, idx) => {
                  const Icon = item.icon;
                  const isActive = activeTab === item.id;
                  return (
                    <motion.button
                      key={item.id}
                      type="button"
                      className={`fpp-more-item${isActive ? " is-active" : ""}`}
                      onClick={() => {
                        setActiveTab(item.id);
                        setVerticalOpen(false);
                      }}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: idx * 0.03, duration: 0.18 }}
                    >
                      <div className="fpp-more-item-icon">
                        <Icon size={16} />
                      </div>
                      <div className="fpp-more-item-content">
                        <span className="fpp-more-item-title">{item.title}</span>
                        <span className="fpp-more-item-sub">{item.subtitle}</span>
                      </div>
                      {isActive && <CheckCircle2 size={14} color="#40c8e0" />}
                    </motion.button>
                  );
                })}
              </motion.div>
            )}
          </AnimatePresence>

          {/* Haste Horizontal (Links Normais com Arrasta e Solta / Scrub) */}
          <AnimatePresence>
            {open ? (
              <motion.div
                ref={horizontalArmRef}
                className="fpp-arm-horizontal"
                initial={{ opacity: 0, rotateY: -60, x: -15 }}
                animate={{ opacity: 1, rotateY: 0, x: 0 }}
                exit={{ opacity: 0, rotateY: -45, x: -10 }}
                transition={{ duration: 0.24, delay: 0.04, ease: [0.2, 0.8, 0.2, 1] }}
                onPointerDown={handlePointerDown}
              >
                <LayoutGroup id="fpp-horizontal-tabs">
                  {dragTab && (
                    <span className="fpp-scrub-indicator">
                      Deslizando: {MAIN_TABS.find((t) => t.id === dragTab)?.label}
                    </span>
                  )}

                  {MAIN_TABS.map((tab) => {
                    const Icon = tab.icon;
                    const isCurActive = (dragTab ?? activeTab) === tab.id;
                    const isDragHover = dragTab === tab.id;

                    if (tab.isAction) {
                      // Botão Start / Treino com destaque especial
                      return (
                        <button
                          key={tab.id}
                          ref={(el) => {
                            if (el) tabRefs.current.set(tab.id, el);
                            else tabRefs.current.delete(tab.id);
                          }}
                          type="button"
                          className={`fpp-tab-button is-start${isCurActive ? " is-active" : ""}${
                            isWorkoutActive ? " is-recording" : ""
                          }${isDragHover ? " is-drag-target" : ""}`}
                          onClick={() => handleTabClick(tab)}
                          title={isWorkoutActive ? "Treino ativo • Clique para pausar/finalizar" : "Iniciar Treino"}
                        >
                          {isCurActive && (
                            <motion.span
                              layoutId="fpp-active-pill"
                              className="fpp-tab-pill-bg"
                              initial={false}
                              transition={{ type: "spring", stiffness: 450, damping: 35 }}
                              aria-hidden="true"
                            />
                          )}
                          <div className="fpp-start-circle">
                            {isWorkoutActive ? <Flame size={18} /> : <Play size={18} />}
                          </div>
                          <span>{isWorkoutActive ? "Gravando" : tab.label}</span>
                        </button>
                      );
                    }

                    return (
                      <button
                        key={tab.id}
                        ref={(el) => {
                          if (el) tabRefs.current.set(tab.id, el);
                          else tabRefs.current.delete(tab.id);
                        }}
                        type="button"
                        className={`fpp-tab-button${isCurActive ? " is-active" : ""}${
                          isDragHover ? " is-drag-target" : ""
                        }`}
                        onClick={() => handleTabClick(tab)}
                      >
                        {isCurActive && (
                          <motion.span
                            layoutId="fpp-active-pill"
                            className="fpp-tab-pill-bg"
                            initial={false}
                            transition={{ type: "spring", stiffness: 450, damping: 35 }}
                            aria-hidden="true"
                          />
                        )}
                        <Icon size={19} />
                        <span>{tab.label}</span>
                      </button>
                    );
                  })}

                  {/* Divisor e Botão de Modo Arrasto Livre / Fixo dentro do Menu */}
                  <div className="fpp-arm-divider" />
                  <button
                    type="button"
                    className={`fpp-tab-button fpp-drag-toggle-tab${isDraggableMode ? " is-drag-active" : ""}`}
                    onClick={(e) => {
                      e.stopPropagation();
                      setIsDraggableMode((prev) => !prev);
                    }}
                    title={
                      isDraggableMode
                        ? "Modo arrasto livre ativo • Clique para fixar"
                        : "Modo fixo • Clique para ativar arrasto livre"
                    }
                    aria-label="Alternar modo arrasto livre"
                  >
                    <Move size={18} />
                    {isDraggableMode && <span className="fpp-drag-active-dot" />}
                  </button>
                </LayoutGroup>
              </motion.div>
            ) : null}
          </AnimatePresence>
        </div>
      </motion.div>

      {/* Painel de Controles da Demonstração */}
      <div className="fpp-demo-controls">
        <div className="fpp-control-group">
          <span style={{ fontSize: 12, color: "rgba(235, 235, 245, 0.6)" }}>Opções:</span>
          <button
            type="button"
            className={`fpp-control-btn${isWorkoutActive ? " is-active" : ""}`}
            onClick={() => setIsWorkoutActive((prev) => !prev)}
          >
            {isWorkoutActive ? "✓ Treino Ativo" : "Simular Treino Ativo"}
          </button>
          <button
            type="button"
            className={`fpp-control-btn${verticalOpen ? " is-active" : ""}`}
            onClick={() => setVerticalOpen((prev) => !prev)}
          >
            {verticalOpen ? "Ocultar 'Mais'" : "Abrir 'Mais' (Seta ⬆)"}
          </button>
        </div>

        <div className="fpp-control-group">
          <button
            type="button"
            className={`fpp-control-btn${isDraggableMode ? " is-active" : ""}`}
            onClick={() => setIsDraggableMode((prev) => !prev)}
            title="Permite mover o menu livremente pelo canvas"
          >
            <Move size={14} style={{ display: "inline", verticalAlign: "middle", marginRight: 4 }} />
            {isDraggableMode ? "✓ Modo Livre Ativo" : "Alternar Modo Livre / Fixo"}
          </button>
          <span style={{ fontSize: 11, color: "rgba(235, 235, 245, 0.4)" }}>
            Dica: arraste o mouse pela barra para seleção (scrub) ou use Livre para reposicionar
          </span>
        </div>
      </div>
    </div>
  );
}
