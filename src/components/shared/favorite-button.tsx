"use client";

import { Heart } from "lucide-react";
import { useFavorites } from "@/providers/favorites-provider";
import { cn } from "@/lib/utils";

export function FavoriteButton({ slug, label = false }: { slug: string; label?: boolean }) {
  const { isFavorite, toggleFavorite } = useFavorites();
  const active = isFavorite(slug);

  return (
    <button
      className={cn(label ? "favorite-label" : "card-favorite", active && "is-active")}
      type="button"
      onClick={(event) => { event.preventDefault(); event.stopPropagation(); toggleFavorite(slug); }}
      aria-pressed={active}
      aria-label={active ? "Remover dos favoritos" : "Adicionar aos favoritos"}
    >
      <Heart size={label ? 16 : 18} fill={active ? "currentColor" : "none"} />
      {label && <span>{active ? "Salvo" : "Favoritar"}</span>}
    </button>
  );
}
