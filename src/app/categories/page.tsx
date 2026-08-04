import type { Metadata } from "next";
import { CategoryIndex } from "@/components/categories/category-index";
export const metadata: Metadata = { title: "Categorias", description: "Explore os padrões UI Patterns por categoria." };
export default function CategoriesPage() { return <section className="page-shell categories-page"><div className="page-intro"><span className="section-index">ÍNDICE</span><h1>Comece pelo<br /><em>contexto.</em></h1><p>De uma navegação que orienta a um modal que resolve: cada categoria é uma lente diferente para explorar a interface.</p></div><CategoryIndex /></section>; }
