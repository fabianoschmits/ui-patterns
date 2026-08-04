import Link from "next/link";
import { ArrowRight, ArrowUpRight } from "lucide-react";
import { patterns } from "@/data/patterns";
import { PatternCard, PatternRow } from "@/components/gallery/pattern-card";

export function FeaturedGallery() {
  const featured = patterns.filter((pattern) => pattern.featured).slice(0, 4);
  const recent = [...patterns].sort((a, b) => b.createdAt.localeCompare(a.createdAt)).slice(0, 5);
  return (
    <>
      <section className="featured-section">
        <div className="section-heading"><div><span className="section-index">02</span><p>SELEÇÃO DO ESTÚDIO</p></div><h2>Padrões que merecem<br /><em>ser explorados.</em></h2><p>Componentes escolhidos por sua utilidade, clareza e pequenos momentos de surpresa.</p></div>
        <div className="featured-grid">{featured.map((pattern, index) => <PatternCard pattern={pattern} key={pattern.slug} priority={index < 2} />)}</div>
        <Link className="button outline-button section-action" href="/explore">Explorar todos os padrões <ArrowRight size={16} /></Link>
      </section>
      <section className="latest-section">
        <div className="section-heading compact"><div><span className="section-index">03</span><p>ACABOU DE CHEGAR</p></div><h2>Novos no laboratório.</h2><Link className="text-link" href="/explore?sort=recent">Ver novidades <ArrowUpRight size={15} /></Link></div>
        <div className="pattern-rows">{recent.map((pattern, index) => <PatternRow pattern={pattern} index={index} key={pattern.slug} />)}</div>
      </section>
    </>
  );
}
