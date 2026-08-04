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
  { name: "Menus", label: "Menus", description: "Estruturas para revelar opções sem sobrecarregar.", accent: "blue", glyph: "≡" },
  { name: "Headers", label: "Headers", description: "Primeiras impressões claras, expressivas e úteis.", accent: "cream", glyph: "⌁" },
  { name: "Mobile", label: "Mobile", description: "Interações pensadas para toque e telas compactas.", accent: "peach", glyph: "◫" },
  { name: "Produtividade", label: "Produtividade", description: "Atalhos e comandos para fluxos velozes.", accent: "mint", glyph: "⌘" },
  { name: "E-commerce", label: "E-commerce", description: "Componentes de produto com intenção comercial.", accent: "cream", glyph: "◇" },
  { name: "Overlays", label: "Overlays", description: "Camadas focadas, modais e menus contextuais.", accent: "lavender", glyph: "□" },
];
