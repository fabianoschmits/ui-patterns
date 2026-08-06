import type { PatternAccent, PatternCategory } from "@/types/pattern";

export interface CategoryRecord {
  name: PatternCategory;
  label: string;
  description: string;
  accent: PatternAccent;
  glyph: string;
}

export const categories: CategoryRecord[] = [
  { name: "Navegação", label: "Navegação", description: "Barras, docks e trilhas que mantêm o contexto.", accent: "lavender", glyph: "↗" },
];
