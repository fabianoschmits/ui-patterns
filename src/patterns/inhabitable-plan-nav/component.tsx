"use client";
import type { PatternPreviewProps } from "@/types/pattern";
import { DestinationCopy, navigationDestinations, useDestination } from "@/patterns/navigation-collection/shared";
import "../navigation-collection/collection.css";
export default function InhabitablePlan(_props: PatternPreviewProps) {
  const { active, activeIndex, setActiveIndex, onKeyDown } = useDestination(1);
  return <section className="nav-collection plan" aria-label="Planta habitável"><header><span>Planta habitável</span><h1>{active.label}</h1><DestinationCopy active={active} /></header><div className="plan-map" role="tablist" onKeyDown={onKeyDown}>{navigationDestinations.map((item, i) => <button key={item.id} role="tab" aria-selected={i === activeIndex} className={i === activeIndex ? "is-active" : ""} onClick={() => setActiveIndex(i)}><i />{item.label}</button>)}</div></section>;
}
