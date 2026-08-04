"use client";

import { useMemo, useState } from "react";
import { Filter, ListFilter, Search, SlidersHorizontal, X } from "lucide-react";
import { categories } from "@/data/categories";
import { patterns } from "@/data/patterns";
import { filterPatterns, type GallerySort } from "@/lib/patterns";
import { PatternGrid } from "@/components/gallery/pattern-grid";

const flagOptions = ["Responsivo", "Animado", "Minimalista", "Mobile", "Escuro", "Sem dependências", "React", "Tailwind"];

export function ExploreClient({ initialQuery = "", initialCategory = "Todos", initialSort = "curated" as GallerySort }: { initialQuery?: string; initialCategory?: string; initialSort?: GallerySort }) {
  const [query, setQuery] = useState(initialQuery);
  const [category, setCategory] = useState(initialCategory);
  const [flags, setFlags] = useState<string[]>([]);
  const [sort, setSort] = useState<GallerySort>(initialSort);
  const [filtersOpen, setFiltersOpen] = useState(false);
  const result = useMemo(() => filterPatterns(patterns, { query, category, flags, sort }), [query, category, flags, sort]);
  const activeCount = (category !== "Todos" ? 1 : 0) + flags.length;

  function toggleFlag(flag: string) { setFlags((current) => current.includes(flag) ? current.filter((item) => item !== flag) : [...current, flag]); }

  return <div className="explore-shell"><div className="explore-toolbar"><div className="explore-search"><Search size={18} /><input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Pesquisar por nome, tag ou tecnologia…" aria-label="Pesquisar na galeria" />{query && <button onClick={() => setQuery("")} aria-label="Limpar busca"><X size={15} /></button>}</div><button className="filter-toggle" onClick={() => setFiltersOpen((value) => !value)} aria-expanded={filtersOpen}><SlidersHorizontal size={16} /> Filtros {activeCount > 0 && <span>{activeCount}</span>}</button><label className="sort-select"><ListFilter size={15} /><span>Ordenar</span><select value={sort} onChange={(event) => setSort(event.target.value as GallerySort)} aria-label="Ordenar padrões"><option value="curated">Curadoria</option><option value="recent">Mais recentes</option><option value="popular">Mais populares</option><option value="name">Ordem alfabética</option></select></label></div><div className={filtersOpen ? "explore-filters is-open" : "explore-filters"}><div className="filter-group"><span><Filter size={14} /> Categoria</span><div className="filter-pills">{["Todos", ...categories.map((item) => item.name)].map((item) => <button key={item} className={category === item ? "active" : ""} onClick={() => setCategory(item)}>{item}</button>)}</div></div><div className="filter-group"><span><SlidersHorizontal size={14} /> Atributos</span><div className="filter-pills">{flagOptions.map((flag) => <button key={flag} className={flags.includes(flag) ? "active" : ""} onClick={() => toggleFlag(flag)}>{flag}</button>)}</div></div></div><div className="result-line"><span><b>{result.length}</b> {result.length === 1 ? "padrão encontrado" : "padrões encontrados"}</span>{(query || category !== "Todos" || flags.length > 0) && <button onClick={() => { setQuery(""); setCategory("Todos"); setFlags([]); }}>Limpar filtros</button>}</div><PatternGrid patterns={result} emptyMessage="Tente outra palavra, categoria ou combinação de filtros." /></div>;
}
