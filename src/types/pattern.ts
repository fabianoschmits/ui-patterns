import type { ComponentType } from "react";

export type PatternCategory =
  | "Navegação"
  | "Menus"
  | "Headers"
  | "Mobile"
  | "Produtividade"
  | "E-commerce"
  | "Overlays"
  | "Autenticação"
  | "Comunicação"
  | "Dados"
  | "Formulários";

export type PatternAccent = "lavender" | "blue" | "mint" | "peach" | "cream";
export type PatternDevice = "desktop" | "tablet" | "mobile";
export type PreviewTheme = "light" | "dark";

export interface PatternSummary {
  id: string;
  slug: string;
  name: string;
  eyebrow: string;
  description: string;
  category: PatternCategory;
  tags: string[];
  status: "stable" | "beta";
  featured: boolean;
  isNew: boolean;
  popular: boolean;
  technologies: string[];
  dependencies: string[];
  responsive: boolean;
  supportedThemes: PreviewTheme[];
  animated: boolean;
  minimal: boolean;
  accent: PatternAccent;
  layout: "wide" | "standard" | "tall";
  collection: string;
  createdAt: string;
  updatedAt: string;
}

export interface PatternProp {
  name: string;
  type: string;
  defaultValue: string;
  description: string;
}

export interface SourceFile {
  name: string;
  language: "tsx" | "css" | "ts" | "bash";
  code: string;
}

export interface PatternMetadata {
  introduction: string;
  features: string[];
  installation: string[];
  usage: string;
  props: PatternProp[];
  accessibility: string[];
  responsiveNotes: string[];
}

export interface PatternDetail extends PatternSummary, PatternMetadata {
  sourceFiles: SourceFile[];
}

export interface PatternPreviewProps {
  compact?: boolean;
  theme?: PreviewTheme;
  accent?: string;
  radius?: number;
  shadow?: number;
  speed?: number;
  density?: number;
}

export type PatternPreviewComponent = ComponentType<PatternPreviewProps>;
