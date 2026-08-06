"use client";

import { useEffect, useRef, useState, type CSSProperties } from "react";
import {
  Briefcase,
  Clock3,
  ChevronsLeft,
  ChevronsRight,
  Download,
  Heart,
  HelpCircle,
  Home,
  Info,
  LogIn,
  Mail,
  MessageCircle,
  Search,
  Settings,
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
type LayerVariant = "classic" | "collection";
type SelectionLayer = "main" | "collection";

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

const collectionActions: QuickActionItem[] = [
  { id: "favorites", label: "Favoritos", icon: Heart },
  { id: "recent", label: "Recentes", icon: Clock3 },
  { id: "downloads", label: "Downloads", icon: Download },
  { id: "messages", label: "Mensagens", icon: MessageCircle },
  { id: "settings", label: "Ajustes", icon: Settings },
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
  const [layerVariant, setLayerVariant] = useState<LayerVariant>("classic");
  const [collectionOpen, setCollectionOpen] = useState(false);
  const [collectionActive, setCollectionActive] = useState("favorites");
  const [selectionLayer, setSelectionLayer] = useState<SelectionLayer>("main");
  const [accent, setAccent] = useState(MENU_ACCENTS[0].value);
  const barRef = useRef<HTMLElement>(null);
  const stackRef = useRef<HTMLDivElement>(null);
  const itemRefs = useRef<(HTMLButtonElement | null)[]>([]);
  const collectionRef = useRef<HTMLDivElement>(null);
  const collectionItemRefs = useRef<(HTMLButtonElement | null)[]>([]);
  const orientationRef = useRef(orientation);
  const actionsRef = useRef(loggedActions);
  const activeRef = useRef(active);
  const collectionActiveRef = useRef(collectionActive);
  const selectionLayerRef = useRef<SelectionLayer>(selectionLayer);

  const actions = mode === "logged" ? loggedActions : publicActions;
  actionsRef.current = actions;
  orientationRef.current = orientation;
  activeRef.current = active;
  collectionActiveRef.current = collectionActive;
  selectionLayerRef.current = selectionLayer;
  const activeLabel =
    selectionLayer === "collection"
      ? collectionActions.find((action) => action.id === collectionActive)?.label ?? "Favoritos"
      : actions.find((action) => action.id === active)?.label ?? "Home";
  const isVertical = orientation === "vertical";
  const isCollapsed = isVertical && !expanded;
  const hasCollection = layerVariant === "collection";

  useEffect(() => {
    const stack = stackRef.current;
    if (!stack) return;

    type DragTarget = { layer: SelectionLayer; id: string; distance: number };

    let pointerId: number | null = null;
    let startX = 0;
    let startY = 0;
    let lastX = 0;
    let lastY = 0;
    let moved = false;

    const nearestTarget = (clientX: number, clientY: number): DragTarget => {
      let best: DragTarget = {
        layer: "main",
        id: actionsRef.current[0]?.id ?? "home",
        distance: Infinity,
      };

      const consider = (
        element: HTMLElement | null,
        layer: SelectionLayer,
        id: string | undefined,
      ) => {
        if (!element || !id) return;
        const rect = element.getBoundingClientRect();
        const dx = clientX - (rect.left + rect.width / 2);
        const dy = clientY - (rect.top + rect.height / 2);
        const distance = Math.hypot(dx, dy);
        if (distance < best.distance) best = { layer, id, distance };
      };

      itemRefs.current.forEach((element, index) => {
        consider(element, "main", actionsRef.current[index]?.id);
      });
      if (collectionOpen) {
        collectionItemRefs.current.forEach((element, index) => {
          consider(element, "collection", collectionActions[index]?.id);
        });
      }
      return best;
    };

    const applyTarget = (target: DragTarget) => {
      if (target.layer === "collection") {
        if (
          target.id !== collectionActiveRef.current ||
          selectionLayerRef.current !== "collection"
        ) {
          collectionActiveRef.current = target.id;
          selectionLayerRef.current = "collection";
          setCollectionActive(target.id);
          setSelectionLayer("collection");
        }
        return;
      }

      if (target.id !== activeRef.current || selectionLayerRef.current !== "main") {
        activeRef.current = target.id;
        selectionLayerRef.current = "main";
        setActive(target.id);
        setSelectionLayer("main");
      }
    };

    const onDown = (event: PointerEvent) => {
      if (event.pointerType === "mouse" && event.button !== 0) return;
      pointerId = event.pointerId;
      startX = lastX = event.clientX;
      startY = lastY = event.clientY;
      moved = false;
      stack.setPointerCapture(event.pointerId);
    };

    const onMove = (event: PointerEvent) => {
      if (pointerId !== event.pointerId) return;
      lastX = event.clientX;
      lastY = event.clientY;
      if (!moved) {
        if (Math.hypot(lastX - startX, lastY - startY) < 7) return;
        moved = true;
      }
      event.preventDefault();
      applyTarget(nearestTarget(lastX, lastY));
    };

    const onUp = (event: PointerEvent) => {
      if (pointerId !== event.pointerId) return;
      pointerId = null;
      if (!moved) return;

      const clientX = event.type === "pointercancel" ? lastX : event.clientX;
      const clientY = event.type === "pointercancel" ? lastY : event.clientY;
      applyTarget(nearestTarget(clientX, clientY));

      const blockClick = (clickEvent: Event) => {
        clickEvent.preventDefault();
        clickEvent.stopPropagation();
      };
      stack.addEventListener("click", blockClick, true);
      window.setTimeout(() => stack.removeEventListener("click", blockClick, true), 0);
    };

    stack.addEventListener("pointerdown", onDown);
    stack.addEventListener("pointermove", onMove);
    stack.addEventListener("pointerup", onUp);
    stack.addEventListener("pointercancel", onUp);
    return () => {
      stack.removeEventListener("pointerdown", onDown);
      stack.removeEventListener("pointermove", onMove);
      stack.removeEventListener("pointerup", onUp);
      stack.removeEventListener("pointercancel", onUp);
    };
  }, [collectionOpen, mode, orientation, expanded]);

  useEffect(() => {
    if (!collectionOpen) return;

    const closeOutside = (event: PointerEvent) => {
      const target = event.target;
      if (target instanceof Node && stackRef.current?.contains(target)) return;
      selectionLayerRef.current = "main";
      setSelectionLayer("main");
      setCollectionOpen(false);
    };

    document.addEventListener("pointerdown", closeOutside, true);
    return () => document.removeEventListener("pointerdown", closeOutside, true);
  }, [collectionOpen]);

  return (
    <MenuShowcase
      className={cn(
        "qam-show",
        isVertical && "is-vertical",
        isCollapsed && "is-collapsed",
        hasCollection && "has-collection",
        collectionOpen && "is-collection-open",
      )}
      style={{ "--qam-accent": accent } as CSSProperties}
      eyebrow="Menu rápido"
      title={activeLabel}
      description={
        isVertical
          ? "Variante lateral — toque ou deslize entre os itens."
          : "Toque ou deslize — a pill segue o dedo."
      }
      accent={accent}
      onAccentChange={setAccent}
      draggableRoulette
      modes={[
        { id: "public", label: "Público" },
        { id: "logged", label: "Logado" },
      ]}
      mode={mode}
      onModeChange={(id) => {
        setMode(id as Mode);
        setActive("home");
        setSelectionLayer("main");
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
        <>
          <div className="menu-show-mode" role="group" aria-label="Camadas do menu">
            <button
              type="button"
              className={!hasCollection ? "active" : undefined}
              onClick={() => {
                setLayerVariant("classic");
                setCollectionOpen(false);
                setSelectionLayer("main");
              }}
            >
              Clássico
            </button>
            <button
              type="button"
              className={hasCollection ? "active" : undefined}
              onClick={() => setLayerVariant("collection")}
            >
              Coleção
            </button>
          </div>

          {isVertical ? (
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
          ) : null}
        </>
      }
    >
      <LayoutGroup id="qam-layout">
        <div className={cn("qam-stage", isVertical && "is-vertical")}>
          <motion.div
            layout
            ref={stackRef}
            className={cn(
              "qam-stack",
              isVertical && "is-vertical",
              isCollapsed && "is-collapsed",
              collectionOpen && "is-collection-open",
            )}
            transition={gooey}
          >
            <AnimatePresence initial={false}>
              {hasCollection && collectionOpen ? (
                <motion.div
                  key="qam-collection"
                  layout
                  className={cn(
                    "qam-collection",
                    isVertical && "is-vertical",
                    isCollapsed && "is-collapsed",
                  )}
                  ref={collectionRef}
                  initial={
                    isVertical
                      ? { opacity: 0, x: -28, scaleX: 0.82 }
                      : { opacity: 0, y: 28, scaleY: 0.78 }
                  }
                  animate={{ opacity: 1, x: 0, y: 0, scaleX: 1, scaleY: 1 }}
                  exit={
                    isVertical
                      ? { opacity: 0, x: -24, scaleX: 0.86 }
                      : { opacity: 0, y: 24, scaleY: 0.82 }
                  }
                  transition={gooey}
                  aria-label="Atalhos da coleção"
                >
                  <span className="qam-collection-glass" aria-hidden="true">
                    <span className="qam-glass-base" />
                    <span className="qam-glass-tint" />
                    <span className="qam-glass-sheen" />
                    <span className="qam-glass-rim" />
                  </span>
                  <div className="qam-collection-items">
                    {collectionActions.map((action, index) => {
                      const Icon = action.icon;
                      const selected =
                        selectionLayer === "collection" && collectionActive === action.id;
                      return (
                        <motion.button
                          layout
                          key={action.id}
                          ref={(element) => {
                            collectionItemRefs.current[index] = element;
                          }}
                          type="button"
                          className={cn("qam-collection-item", selected && "is-active")}
                          aria-label={action.label}
                          aria-current={selected ? "page" : undefined}
                          title={isCollapsed ? action.label : undefined}
                          onClick={() => {
                            setCollectionActive(action.id);
                            setSelectionLayer("collection");
                          }}
                          whileTap={{ scale: 0.9 }}
                          transition={gooey}
                        >
                          <span className="qam-collection-icon-slot">
                            <motion.span
                              className="qam-collection-icon-wrap"
                              animate={isVertical ? { x: 0, y: 0 } : { y: selected ? -14 : 0 }}
                              transition={gooey}
                            >
                              {selected ? (
                                <motion.span
                                  layoutId="qam-active-pill"
                                  className="qam-active-pill qam-collection-active-pill"
                                  initial={false}
                                  transition={pillSpring}
                                  aria-hidden="true"
                                />
                              ) : null}
                              <Icon
                                className={cn("qam-collection-icon", selected && "is-active")}
                              />
                            </motion.span>
                          </span>
                          {!isCollapsed ? (
                            <span className="qam-collection-label">{action.label}</span>
                          ) : null}
                        </motion.button>
                      );
                    })}
                  </div>
                </motion.div>
              ) : null}
            </AnimatePresence>

            <motion.nav
              ref={barRef}
              layout
              className={cn(
                "qam-bar",
                isVertical && "is-vertical",
                isCollapsed && "is-collapsed",
                hasCollection && "has-collection",
                collectionOpen && "is-collection-open",
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

              {hasCollection ? (
                <motion.button
                  type="button"
                  className="qam-collection-toggle"
                  aria-label={collectionOpen ? "Fechar coleção" : "Abrir coleção"}
                  aria-expanded={collectionOpen}
                  onClick={() => {
                    setCollectionOpen((value) => {
                      if (value) setSelectionLayer("main");
                      return !value;
                    });
                  }}
                  animate={{ opacity: 1 }}
                  transition={gooey}
                >
                  <span />
                </motion.button>
              ) : null}

              <motion.div layout className="qam-items" transition={gooey}>
                {actions.map((action, index) => {
                  const Icon = action.icon;
                  const isActive = selectionLayer === "main" && active === action.id;

                  return (
                    <motion.button
                      layout
                      key={action.id}
                      ref={(el) => {
                        itemRefs.current[index] = el;
                      }}
                      type="button"
                      className={cn("qam-item", isActive && "is-active")}
                      aria-label={action.label}
                      aria-current={isActive ? "page" : undefined}
                      title={isCollapsed ? action.label : undefined}
                      onClick={() => {
                        setActive(action.id);
                        setSelectionLayer("main");
                      }}
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
          </motion.div>
        </div>
      </LayoutGroup>
    </MenuShowcase>
  );
}
