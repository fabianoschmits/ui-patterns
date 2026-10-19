"use client";

import { useState, type KeyboardEvent } from "react";

export const navigationDestinations = [
  { id: "atelier", label: "Ateliê", detail: "Ideias em elaboração" },
  { id: "arquivo", label: "Arquivo", detail: "Histórias e referências" },
  { id: "agenda", label: "Agenda", detail: "Ritmo dos próximos dias" },
  { id: "pessoas", label: "Pessoas", detail: "Colaborações em curso" },
] as const;

export type NavigationDestination = (typeof navigationDestinations)[number];

export function useDestination(initial = 0) {
  const [activeIndex, setActiveIndex] = useState(initial);
  const active = navigationDestinations[activeIndex];
  const onKeyDown = (event: KeyboardEvent<HTMLElement>) => {
    const steps: Record<string, number> = { ArrowRight: 1, ArrowDown: 1, ArrowLeft: -1, ArrowUp: -1 };
    if (!(event.key in steps)) return;
    event.preventDefault();
    setActiveIndex((index) => (index + steps[event.key] + navigationDestinations.length) % navigationDestinations.length);
  };
  return { active, activeIndex, setActiveIndex, onKeyDown };
}

export function DestinationCopy({ active }: { active: NavigationDestination }) {
  return <p className="nav-collection-copy">{active.detail}</p>;
}
