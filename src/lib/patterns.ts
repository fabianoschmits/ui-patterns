import type { PatternSummary } from "@/types/pattern";

export type GallerySort = "curated" | "recent" | "popular" | "name";

export interface PatternFilters {
  query: string;
  category: string;
  flags: string[];
  sort: GallerySort;
}

export function filterPatterns(patterns: PatternSummary[], filters: PatternFilters) {
  const normalizedQuery = filters.query.trim().toLocaleLowerCase("pt-BR");

  const filtered = patterns.filter((pattern) => {
    const searchable = [
      pattern.name,
      pattern.eyebrow,
      pattern.description,
      pattern.category,
      pattern.collection,
      ...pattern.tags,
      ...pattern.technologies,
    ]
      .join("  ")
      .toLocaleLowerCase("pt-BR");

    const matchesQuery = !normalizedQuery || searchable.includes(normalizedQuery);
    const matchesCategory = filters.category === "Todos" || pattern.category === filters.category;
    const matchesFlags = filters.flags.every((flag) => {
      if (flag === "Responsivo") return pattern.responsive;
      if (flag === "Animado") return pattern.animated;
      if (flag === "Minimalista") return pattern.minimal;
      if (flag === "Mobile") return pattern.tags.includes("mobile");
      if (flag === "Escuro") return pattern.supportedThemes.includes("dark");
      if (flag === "Sem dependências") return pattern.dependencies.length === 0;
      return pattern.technologies.includes(flag);
    });

    return matchesQuery && matchesCategory && matchesFlags;
  });

  return [...filtered].sort((a, b) => {
    if (filters.sort === "recent") return b.createdAt.localeCompare(a.createdAt);
    if (filters.sort === "popular") return Number(b.popular) - Number(a.popular);
    if (filters.sort === "name") return a.name.localeCompare(b.name, "pt-BR");
    return Number(b.featured) - Number(a.featured);
  });
}
