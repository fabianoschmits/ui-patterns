"use client";
import type { PatternPreviewProps } from "@/types/pattern";
import { DestinationCopy, navigationDestinations, useDestination } from "@/patterns/navigation-collection/shared";
import "../navigation-collection/collection.css";
export default function ArchiveDrawers(_props: PatternPreviewProps) {
  const { active, activeIndex, setActiveIndex, onKeyDown } = useDestination();
  return <section className="nav-collection archive" aria-label="Arquivo de gavetas"><header><span>Arquivo de gavetas</span><h1>{active.label}</h1><DestinationCopy active={active} /></header><nav role="tablist" onKeyDown={onKeyDown}>{navigationDestinations.map((item, i) => <button key={item.id} role="tab" aria-selected={i === activeIndex} className={i === activeIndex ? "is-active" : ""} onClick={() => setActiveIndex(i)}><span>Índice {i + 1}</span><b>{item.label}</b><small>{i === activeIndex ? "aberta" : "fechada"}</small></button>)}</nav></section>;
}
