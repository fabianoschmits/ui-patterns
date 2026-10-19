import type { PatternSummary } from "@/types/pattern";

type NavigationInput = Pick<PatternSummary, "slug" | "name" | "eyebrow" | "description" | "accent" | "tags">;
const definitions: NavigationInput[] = [
  { slug: "notch-dock-nav", name: "Dock recortado", eyebrow: "Encaixe e elevação", description: "Um recorte na base acolhe a tecla ativa, que se eleva com uma mola curta.", accent: "mint", tags: ["dock", "notch", "navigation", "motion"] },
  { slug: "prism-rail-nav", name: "Trilho prisma", eyebrow: "Teclas em relevo", description: "Navegação com teclas chanfradas, cursor lateral e expansão dos rótulos.", accent: "blue", tags: ["sidebar", "rail", "tactile", "motion"] },
  { slug: "folding-tabs-nav", name: "Abas dobradas", eyebrow: "Uma dobra por destino", description: "Abas com dobradiças revelam a seção escolhida em uma barra compacta.", accent: "cream", tags: ["tabs", "fold", "navigation", "motion"] },
  { slug: "expanding-island-nav", name: "Ilha expansível", eyebrow: "Espaço para a seleção", description: "A ilha ativa revela seu nome enquanto os outros destinos permanecem em ícones.", accent: "lavender", tags: ["island", "expand", "compact", "motion"] },
  { slug: "magnetic-tiles-nav", name: "Teclas magnéticas", eyebrow: "Peças independentes", description: "Cada destino tem sua tecla: elevação, inclinação e resposta das peças vizinhas.", accent: "mint", tags: ["dock", "tiles", "magnetic", "motion"] },
  { slug: "ribbon-track-nav", name: "Fita de navegação", eyebrow: "Cursor em colchetes", description: "Uma fita segmentada conduz a seleção com colchetes móveis e rótulos discretos.", accent: "peach", tags: ["ribbon", "bracket", "navigation", "motion"] },
  { slug: "orbit-ring-nav", name: "Anel orbital", eyebrow: "Destinos ao redor", description: "Cinco destinos em um anel compacto, com a seleção no centro e marcação radial.", accent: "blue", tags: ["radial", "ring", "navigation", "motion"] },
  { slug: "fan-action-nav", name: "Leque de ações", eyebrow: "Abrir em um gesto", description: "Um gatilho desdobra os destinos em leque com abertura sequenciada e retorno suave.", accent: "cream", tags: ["fan", "expand", "navigation", "motion"] },
  { slug: "corner-hinge-nav", name: "Menu de canto", eyebrow: "Duas direções", description: "Braços articulados abrem uma navegação de canto com destinos sempre ao alcance.", accent: "lavender", tags: ["corner", "hinge", "compact", "motion"] },
  { slug: "fitpro-corner-nav", name: "Menu de Canto Fit Pro Player", eyebrow: "Articulação dupla & Mais", description: "Menu de canto escamoteável com design Fit Pro Player, barra horizontal de drag & scrub e haste vertical articulada acionada por seta para opções adicionais.", accent: "mint", tags: ["corner", "hinge", "fitproplayer", "drag", "scrub", "motion"] },
  { slug: "stacked-deck-nav", name: "Pilha retrátil", eyebrow: "Camadas de atalhos", description: "Uma pilha compacta se abre em uma lista de destinos e recolhe após a escolha.", accent: "peach", tags: ["stack", "dropdown", "compact", "motion"] },
];

export const navigationPatterns: PatternSummary[] = definitions.map((definition) => ({
  ...definition,
  id: `pat_${definition.slug.replaceAll("-", "_")}`,
  category: "Navegação",
  status: "stable",
  featured: true,
  isNew: true,
  popular: false,
  technologies: ["React", "TypeScript", "Motion"],
  dependencies: ["motion", "lucide-react"],
  responsive: true,
  supportedThemes: ["light", "dark"],
  animated: true,
  minimal: true,
  layout: "wide",
  collection: "Menus em movimento",
  createdAt: "2026-10-18",
  updatedAt: "2026-10-18",
}));
