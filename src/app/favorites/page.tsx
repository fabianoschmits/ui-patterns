import type { Metadata } from "next";
import { FavoritesClient } from "@/components/favorites/favorites-client";
export const metadata: Metadata = { title: "Favoritos", description: "Seus padrões salvos no UI Patterns." };
export default function FavoritesPage() { return <section className="page-shell favorites-page"><div className="page-intro"><span className="section-index">SUA COLEÇÃO</span><h1>Guardados para<br /><em>mais tarde.</em></h1><p>Uma pequena biblioteca pessoal de ideias que já encontraram seu lugar.</p></div><FavoritesClient /></section>; }
