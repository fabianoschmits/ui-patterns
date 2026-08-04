import type { PatternSummary } from "@/types/pattern";

export const patterns: PatternSummary[] = [
  {
    id: "pat_001", slug: "expandable-sidebar", name: "Sidebar expansível", eyebrow: "Workspace fluido",
    description: "Uma navegação lateral que preserva contexto ao alternar entre modo compacto e expandido.",
    category: "Navegação", tags: ["sidebar", "dashboard", "animated", "mobile"], status: "stable", featured: true, isNew: false, popular: true,
    technologies: ["React", "TypeScript", "Tailwind"], dependencies: ["lucide-react", "motion"], responsive: true, supportedThemes: ["light", "dark"], animated: true, minimal: true, accent: "lavender", layout: "tall", collection: "SaaS essencial", createdAt: "2026-02-14", updatedAt: "2026-07-28",
  },
  {
    id: "pat_002", slug: "floating-top-menu", name: "Menu superior flutuante", eyebrow: "Navegação leve",
    description: "Uma barra suspensa com ações agrupadas, presença sutil e comportamento responsivo.",
    category: "Navegação", tags: ["navbar", "floating", "landing", "minimal"], status: "stable", featured: true, isNew: false, popular: true,
    technologies: ["React", "TypeScript", "Tailwind"], dependencies: [], responsive: true, supportedThemes: ["light", "dark"], animated: true, minimal: true, accent: "blue", layout: "wide", collection: "Landing precisa", createdAt: "2026-03-05", updatedAt: "2026-07-15",
  },
  {
    id: "pat_003", slug: "modern-mega-menu", name: "Mega menu moderno", eyebrow: "Arquitetura visível",
    description: "Conteúdo hierárquico organizado em uma superfície editorial que orienta sem interromper.",
    category: "Menus", tags: ["mega-menu", "navigation", "content-rich"], status: "stable", featured: true, isNew: true, popular: true,
    technologies: ["React", "TypeScript", "Tailwind"], dependencies: ["motion"], responsive: true, supportedThemes: ["light", "dark"], animated: true, minimal: false, accent: "mint", layout: "wide", collection: "Navegação editorial", createdAt: "2026-07-18", updatedAt: "2026-08-01",
  },
  {
    id: "pat_004", slug: "fullscreen-mobile-menu", name: "Menu mobile imersivo", eyebrow: "Navegação ao alcance",
    description: "Menu de tela cheia para toque, com hierarquia tipográfica e transições progressivas.",
    category: "Mobile", tags: ["mobile", "fullscreen", "menu", "touch"], status: "stable", featured: false, isNew: true, popular: false,
    technologies: ["React", "TypeScript", "Tailwind"], dependencies: ["motion"], responsive: true, supportedThemes: ["light", "dark"], animated: true, minimal: true, accent: "peach", layout: "tall", collection: "Mobile first", createdAt: "2026-07-24", updatedAt: "2026-08-02",
  },
  {
    id: "pat_005", slug: "command-palette", name: "Paleta de comandos", eyebrow: "Tudo em poucos toques",
    description: "Busca acionável com atalhos de teclado, agrupamento semântico e navegação por setas.",
    category: "Produtividade", tags: ["command", "search", "keyboard", "dashboard"], status: "stable", featured: true, isNew: false, popular: true,
    technologies: ["React", "TypeScript", "Tailwind"], dependencies: [], responsive: true, supportedThemes: ["light", "dark"], animated: true, minimal: true, accent: "lavender", layout: "standard", collection: "Produtividade", createdAt: "2026-01-20", updatedAt: "2026-07-30",
  },
  {
    id: "pat_006", slug: "navigation-dock", name: "Dock de navegação", eyebrow: "Ações ancoradas",
    description: "Um dock responsivo com ampliação contextual e estados de atividade bem definidos.",
    category: "Navegação", tags: ["dock", "navigation", "animated", "mobile"], status: "stable", featured: false, isNew: false, popular: true,
    technologies: ["React", "TypeScript", "Tailwind"], dependencies: ["lucide-react"], responsive: true, supportedThemes: ["light", "dark"], animated: true, minimal: true, accent: "blue", layout: "standard", collection: "Navegação expressiva", createdAt: "2026-04-11", updatedAt: "2026-07-22",
  },
  {
    id: "pat_007", slug: "animated-indicator-navbar", name: "Navbar com indicador", eyebrow: "Estado que acompanha",
    description: "Indicador elástico acompanha a seção ativa e torna a mudança de contexto instantânea.",
    category: "Navegação", tags: ["navbar", "indicator", "animated", "minimal"], status: "stable", featured: false, isNew: false, popular: false,
    technologies: ["React", "TypeScript", "Tailwind"], dependencies: ["motion"], responsive: true, supportedThemes: ["light", "dark"], animated: true, minimal: true, accent: "mint", layout: "wide", collection: "Microinterações", createdAt: "2026-05-08", updatedAt: "2026-07-20",
  },
  {
    id: "pat_008", slug: "nested-sidebar", name: "Menu lateral com submenus", eyebrow: "Profundidade organizada",
    description: "Navegação em árvore com expansão independente, contadores e leitura clara de hierarquia.",
    category: "Menus", tags: ["sidebar", "submenu", "dashboard", "tree"], status: "stable", featured: false, isNew: false, popular: false,
    technologies: ["React", "TypeScript", "Tailwind"], dependencies: [], responsive: true, supportedThemes: ["light", "dark"], animated: true, minimal: false, accent: "cream", layout: "tall", collection: "SaaS essencial", createdAt: "2026-03-28", updatedAt: "2026-07-12",
  },
  {
    id: "pat_009", slug: "landing-page-header", name: "Header para landing page", eyebrow: "Narrativa em primeiro plano",
    description: "Hero editorial com prova social, chamadas claras e composição modular adaptável.",
    category: "Headers", tags: ["header", "hero", "landing", "marketing"], status: "stable", featured: true, isNew: true, popular: true,
    technologies: ["React", "TypeScript", "Tailwind"], dependencies: [], responsive: true, supportedThemes: ["light", "dark"], animated: true, minimal: false, accent: "cream", layout: "wide", collection: "Landing precisa", createdAt: "2026-07-29", updatedAt: "2026-08-03",
  },
  {
    id: "pat_010", slug: "elegant-context-menu", name: "Menu contextual elegante", eyebrow: "Ação no lugar certo",
    description: "Ações contextuais agrupadas por intenção, com foco de teclado e comandos destrutivos distintos.",
    category: "Overlays", tags: ["context-menu", "overlay", "keyboard", "actions"], status: "stable", featured: false, isNew: false, popular: false,
    technologies: ["React", "TypeScript", "Tailwind"], dependencies: [], responsive: true, supportedThemes: ["light", "dark"], animated: true, minimal: true, accent: "peach", layout: "standard", collection: "Microinterações", createdAt: "2026-06-04", updatedAt: "2026-07-18",
  },
  {
    id: "pat_011", slug: "modern-product-card", name: "Card de produto moderno", eyebrow: "Produto com presença",
    description: "Card comercial com galeria de cores, favorito e ação de compra sem sacrificar a composição.",
    category: "E-commerce", tags: ["product", "card", "ecommerce", "responsive"], status: "stable", featured: true, isNew: false, popular: true,
    technologies: ["React", "TypeScript", "Tailwind"], dependencies: ["lucide-react"], responsive: true, supportedThemes: ["light", "dark"], animated: true, minimal: false, accent: "mint", layout: "tall", collection: "E-commerce sereno", createdAt: "2026-05-21", updatedAt: "2026-07-26",
  },
  {
    id: "pat_012", slug: "soft-transition-modal", name: "Modal de transição suave", eyebrow: "Foco sem ruptura",
    description: "Um diálogo acessível que organiza decisões com transição contida e retorno seguro de foco.",
    category: "Overlays", tags: ["modal", "dialog", "focus", "animated"], status: "stable", featured: false, isNew: true, popular: false,
    technologies: ["React", "TypeScript", "Tailwind"], dependencies: [], responsive: true, supportedThemes: ["light", "dark"], animated: true, minimal: true, accent: "lavender", layout: "standard", collection: "Overlays tranquilos", createdAt: "2026-07-12", updatedAt: "2026-08-02",
  },
];

export function getPatternBySlug(slug: string) {
  return patterns.find((pattern) => pattern.slug === slug);
}

export function getRelatedPatterns(slug: string, category: string) {
  return patterns.filter((pattern) => pattern.slug !== slug && pattern.category === category).slice(0, 3);
}
