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
  { name: "Autenticação", label: "Autenticação", description: "Entradas seguras, claras e acolhedoras.", accent: "mint", glyph: "◎" },
  { name: "Produtividade", label: "Produtividade", description: "Fluxos que removem esforço do trabalho cotidiano.", accent: "blue", glyph: "✦" },
  { name: "Comunicação", label: "Comunicação", description: "Conversas, avisos e colaboração com contexto.", accent: "peach", glyph: "◌" },
  { name: "E-commerce", label: "E-commerce", description: "Decisões de compra simples, seguras e fluidas.", accent: "cream", glyph: "◇" },
  { name: "Dados", label: "Dados", description: "Informação densa transformada em ação compreensível.", accent: "blue", glyph: "▦" },
  { name: "Formulários", label: "Formulários", description: "Configurações e escolhas com feedback imediato.", accent: "mint", glyph: "⌁" },
];
