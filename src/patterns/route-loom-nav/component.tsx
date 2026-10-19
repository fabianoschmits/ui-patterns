"use client";
import type { PatternPreviewProps } from "@/types/pattern";
import { DestinationCopy, navigationDestinations, useDestination } from "@/patterns/navigation-collection/shared";
import "../navigation-collection/collection.css";
export default function RouteLoom(_props: PatternPreviewProps) {
  const { active, activeIndex, setActiveIndex, onKeyDown } = useDestination(2);
  return <section className="nav-collection loom" aria-label="Tear de rotas"><header><span>Tear de rotas</span><h1>{active.label}</h1><DestinationCopy active={active} /></header><div className="loom-grid" role="tablist" onKeyDown={onKeyDown}>{navigationDestinations.map((item, i) => <button key={item.id} role="tab" aria-selected={i === activeIndex} className={i === activeIndex ? "is-active" : ""} onClick={() => setActiveIndex(i)}><span>Área {i + 1}</span><b>{item.label}</b><em>Tarefa</em></button>)}</div></section>;
}
