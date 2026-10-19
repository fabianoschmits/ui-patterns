"use client";
import type { PatternPreviewProps } from "@/types/pattern";
import { DestinationCopy, navigationDestinations, useDestination } from "@/patterns/navigation-collection/shared";
import "../navigation-collection/collection.css";
export default function NavigationScore(_props: PatternPreviewProps) {
  const { active, activeIndex, setActiveIndex, onKeyDown } = useDestination(3);
  return <section className="nav-collection score" aria-label="Partitura de navegação"><header><span>Partitura de navegação</span><h1>{active.label}</h1><DestinationCopy active={active} /></header><nav role="tablist" onKeyDown={onKeyDown}>{navigationDestinations.map((item, i) => <button key={item.id} role="tab" aria-selected={i === activeIndex} className={i === activeIndex ? "is-active" : ""} onClick={() => setActiveIndex(i)}><i /><span>{item.label}</span></button>)}</nav></section>;
}
