import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { categories } from "@/data/categories";
import { patterns } from "@/data/patterns";

export function CategoryRail() {
  return (
    <section className="category-rail" id="discover" aria-labelledby="category-title">
      <div className="section-heading compact"><div><span className="section-index">01</span><p>ENCONTRE SEU PONTO DE PARTIDA</p></div><h2 id="category-title">Explore por intenção.</h2><Link className="text-link" href="/categories">Todas as categorias <ArrowUpRight size={15} /></Link></div>
      <div className="category-track">
        {categories.map((category, index) => {
          const count = patterns.filter((pattern) => pattern.category === category.name).length;
          return <Link key={category.name} className={"category-tile accent-" + category.accent} href={"/explore?category=" + encodeURIComponent(category.name)}><span className="category-number">{String(index + 1).padStart(2, "0")}</span><span className="category-glyph">{category.glyph}</span><div><h3>{category.label}</h3><p>{category.description}</p></div><small>{count} {count === 1 ? "padrão" : "padrões"}</small></Link>;
        })}
      </div>
    </section>
  );
}
