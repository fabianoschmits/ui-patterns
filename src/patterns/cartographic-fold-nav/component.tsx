"use client";
import type { PatternPreviewProps } from "@/types/pattern";
import { DestinationCopy, navigationDestinations, useDestination } from "@/patterns/navigation-collection/shared";
import "../navigation-collection/collection.css";
export default function CartographicFold(_props: PatternPreviewProps) {
  const { active, activeIndex, setActiveIndex, onKeyDown } = useDestination(3);
  return <section className="nav-collection fold" aria-label="Dobra cartográfica"><header><span>Dobra cartográfica</span><h1>{active.label}</h1><DestinationCopy active={active} /></header><nav role="tablist" onKeyDown={onKeyDown}>{navigationDestinations.map((item, i) => <button key={item.id} role="tab" aria-selected={i === activeIndex} className={i === activeIndex ? "is-active" : ""} onClick={() => setActiveIndex(i)}><span>{String(i + 1).padStart(2, "0")}</span><b>{item.label}</b></button>)}</nav></section>;
}
