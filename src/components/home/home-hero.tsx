"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowDown, ArrowRight, Search } from "lucide-react";
import { PatternPreview } from "@/components/preview/pattern-preview";

const quickSearches = ["Navegação", "Mobile", "SaaS", "Animações"];

export function HomeHero() {
  const router = useRouter();
  const [query, setQuery] = useState("");

  function search(value = query) {
    const normalized = value.trim();
    router.push(normalized ? "/explore?q=" + encodeURIComponent(normalized) : "/explore");
  }

  return (
    <section className="home-hero">
      <div className="hero-grid-lines" aria-hidden="true" />
      <div className="hero-floating hero-floating-sidebar" aria-hidden="true"><PatternPreview slug="quick-action-menu" compact /></div>
      <div className="hero-floating hero-floating-command" aria-hidden="true"><PatternPreview slug="meniscus-liquid-nav" compact /></div>
      <div className="hero-floating hero-floating-product" aria-hidden="true"><PatternPreview slug="liquid-glass-nav" compact /></div>
      <div className="hero-copy">
        <span className="hero-kicker"><i /> Biblioteca de interfaces · v0.1</span>
        <h1>Interfaces que transformam ideias em <em>experiências.</em></h1>
        <p>Explore componentes modernos, veja cada interação em funcionamento e leve o código necessário para o seu próximo projeto.</p>
        <form className="hero-search" onSubmit={(event) => { event.preventDefault(); search(); }} role="search">
          <Search size={20} aria-hidden="true" />
          <input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="O que você quer construir?" aria-label="Pesquisar componentes" />
          <button type="submit" aria-label="Pesquisar"><ArrowRight size={18} /></button>
        </form>
        <div className="quick-search"><span>Comece por</span>{quickSearches.map((item) => <button type="button" key={item} onClick={() => search(item)}>{item}</button>)}</div>
      </div>
      <a className="scroll-cue" href="#discover"><span>Role para explorar</span><ArrowDown size={15} /></a>
      <div className="hero-count"><strong>12</strong><span>padrões<br />interativos</span></div>
    </section>
  );
}
