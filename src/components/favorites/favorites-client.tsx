"use client";

import Link from "next/link";
import { Heart, Sparkles } from "lucide-react";
import { patterns } from "@/data/patterns";
import { useFavorites } from "@/providers/favorites-provider";
import { PatternGrid } from "@/components/gallery/pattern-grid";

export function FavoritesClient() { const { favorites, hydrated } = useFavorites(); const saved = patterns.filter((pattern) => favorites.includes(pattern.slug)); if (!hydrated) return <div className="favorites-loading">Carregando sua coleção…</div>; if (saved.length === 0) return <div className="favorites-empty"><span><Heart size={22} /></span><h2>Sua coleção começa aqui.</h2><p>Salve padrões enquanto explora e eles estarão esperando por você neste espaço.</p><Link className="button" href="/explore">Explorar padrões <Sparkles size={15} /></Link></div>; return <PatternGrid patterns={saved} emptyMessage="Você ainda não salvou nenhum padrão." />; }
