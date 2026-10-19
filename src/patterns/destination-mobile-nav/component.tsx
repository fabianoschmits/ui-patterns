"use client";
import type { PatternPreviewProps } from "@/types/pattern";
import { DestinationCopy, navigationDestinations, useDestination } from "@/patterns/navigation-collection/shared";
import "../navigation-collection/collection.css";
export default function DestinationMobile(_props: PatternPreviewProps) {
  const { active, activeIndex, setActiveIndex, onKeyDown } = useDestination(2);
  return <section className="nav-collection mobile-nav" aria-label="Móbile de destinos"><header><span>Móbile de destinos</span><h1>{active.label}</h1><DestinationCopy active={active} /></header><nav role="tablist" onKeyDown={onKeyDown}>{navigationDestinations.map((item, i) => <button key={item.id} role="tab" aria-selected={i === activeIndex} className={i === activeIndex ? "is-active" : ""} onClick={() => setActiveIndex(i)} style={{ "--i": i } as React.CSSProperties}><i /><b>{item.label}</b></button>)}</nav></section>;
}
