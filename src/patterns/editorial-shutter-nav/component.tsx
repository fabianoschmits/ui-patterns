"use client";
import type { PatternPreviewProps } from "@/types/pattern";
import { DestinationCopy, navigationDestinations, useDestination } from "@/patterns/navigation-collection/shared";
import "../navigation-collection/collection.css";
export default function EditorialShutter(_props: PatternPreviewProps) {
  const { active, activeIndex, setActiveIndex, onKeyDown } = useDestination();
  return <section className="nav-collection shutter" style={{ "--active": activeIndex } as React.CSSProperties} aria-label="Obturador editorial"><header><span>Obturador editorial</span><h1>{active.label}</h1><DestinationCopy active={active} /></header><nav role="tablist" onKeyDown={onKeyDown}>{navigationDestinations.map((item, i) => <button key={item.id} role="tab" aria-selected={i === activeIndex} className={i === activeIndex ? "is-active" : ""} onClick={() => setActiveIndex(i)} style={{ "--i": i } as React.CSSProperties}>{item.label}</button>)}</nav><div className="shutter-core" aria-hidden="true" /></section>;
}
