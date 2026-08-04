import type { PatternSummary } from "@/types/pattern";
import { PatternCard } from "@/components/gallery/pattern-card";

export function PatternGrid({ patterns, emptyMessage = "Nenhum padrão encontrado." }: { patterns: PatternSummary[]; emptyMessage?: string }) {
  if (patterns.length === 0) return <div className="gallery-empty"><span>0</span><h3>Nada por aqui ainda.</h3><p>{emptyMessage}</p></div>;
  return <div className="pattern-grid">{patterns.map((pattern, index) => <PatternCard pattern={pattern} key={pattern.slug} priority={index < 2} />)}</div>;
}
