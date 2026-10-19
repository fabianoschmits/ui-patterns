"use client";
import type { PatternPreviewProps } from "@/types/pattern";
import { DestinationCopy, navigationDestinations, useDestination } from "@/patterns/navigation-collection/shared";
import "../navigation-collection/collection.css";
export default function ArticulatedTerritories(_props: PatternPreviewProps) {
  const { active, activeIndex, setActiveIndex, onKeyDown } = useDestination();
  return <section className="nav-collection territories" aria-label="Territórios articulados"><header><span>Territórios articulados</span><h1>{active.label}</h1><DestinationCopy active={active} /></header><nav role="tablist" onKeyDown={onKeyDown}>{navigationDestinations.map((item, i) => <button key={item.id} role="tab" aria-selected={i === activeIndex} className={i === activeIndex ? "is-active" : ""} onClick={() => setActiveIndex(i)} style={{ "--i": i } as React.CSSProperties}><b>{item.label}</b><small>{item.detail}</small></button>)}</nav></section>;
}
