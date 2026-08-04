import type { Metadata } from "next";
import { ExploreClient } from "@/components/gallery/explore-client";

export const metadata: Metadata = { title: "Explorar padrões", description: "Pesquise e filtre a biblioteca de componentes UI Patterns." };

export default async function ExplorePage({ searchParams }: { searchParams: Promise<{ q?: string; category?: string; sort?: string }> }) {
  const params = await searchParams;
  const sort = params.sort === "recent" || params.sort === "popular" || params.sort === "name" ? params.sort : "curated";
  return <section className="page-shell explore-page"><div className="page-intro"><span className="section-index">EXPLORAR</span><h1>Encontre a forma<br /><em>certa para começar.</em></h1><p>Uma biblioteca viva de padrões prontos para estudar, adaptar e levar para produção.</p></div><ExploreClient initialQuery={params.q ?? ""} initialCategory={params.category ?? "Todos"} initialSort={sort} /></section>;
}
