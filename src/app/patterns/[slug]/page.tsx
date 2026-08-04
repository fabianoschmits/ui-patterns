import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, ArrowRight, Check, Code2, Eye, Keyboard, Smartphone, Terminal, Zap } from "lucide-react";
import { getPatternBySlug, getRelatedPatterns, patterns } from "@/data/patterns";
import { PatternLab } from "@/components/pattern-lab/pattern-lab";
import { PatternPreview } from "@/components/preview/pattern-preview";

export function generateStaticParams() { return patterns.map((pattern) => ({ slug: pattern.slug })); }

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const pattern = getPatternBySlug(slug);
  if (!pattern) return { title: "Padrão não encontrado" };
  return { title: pattern.name, description: pattern.description, openGraph: { title: pattern.name + " — UI Patterns", description: pattern.description } };
}

export default async function PatternPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const pattern = getPatternBySlug(slug);
  if (!pattern) notFound();
  const related = getRelatedPatterns(slug, pattern.category);
  return <article className={"pattern-detail accent-" + pattern.accent}>
    <section className="detail-hero"><div className="detail-breadcrumb"><Link href="/explore"><ArrowLeft size={14} /> Explorar</Link><span>/</span><span>{pattern.category}</span></div><div className="detail-hero-copy"><span className="detail-kicker">{pattern.eyebrow} <i /> {pattern.isNew ? "Recém-chegado" : "Padrão estudado"}</span><h1>{pattern.name}</h1><p>{pattern.description}</p></div><PatternLab pattern={pattern} /></section>
    <section className="detail-story"><div className="story-sticky"><span className="section-index">01 — 04</span><p>A anatomia<br />do padrão.</p><span className="story-progress"><i /></span></div><div className="story-content"><div className="story-intro"><span className="story-label">POR QUE FUNCIONA</span><p>{getStoryIntro(pattern.slug)}</p></div><div className="story-feature-grid">{getFeatures(pattern.slug).map((feature, index) => <div key={feature}><span>0{index + 1}</span><h3>{feature}</h3><i /></div>)}</div><div className="story-annotation"><Zap size={18} /><p>O movimento comunica estado. Cada transição tem uma função: revelar, orientar ou confirmar.</p></div></div></section>
    <section className="detail-preview-band"><div className="detail-band-heading"><div><span className="section-index">02 — 04</span><p>EM FUNCIONAMENTO</p></div><h2>Veja a interação<br /><em>antes do código.</em></h2></div><div className="detail-band-preview"><PatternPreview slug={pattern.slug} /></div></section>
    <section className="detail-implementation"><div className="implementation-heading"><span className="section-index">03 — 04</span><div><p>DA IDEIA À INTERFACE</p><h2>Leve o padrão<br /><em>para produção.</em></h2></div><Code2 size={27} /></div><PatternLab pattern={pattern} mode="code" /></section>
    <section className="detail-notes"><div className="notes-heading"><span className="section-index">04 — 04</span><h2>Detalhes que<br /><em>fazem diferença.</em></h2></div><div className="notes-grid"><NoteCard icon={<Keyboard size={19} />} title="Acessibilidade" items={getNotes(pattern.slug, "a11y")} /><NoteCard icon={<Smartphone size={19} />} title="Responsividade" items={getNotes(pattern.slug, "responsive")} /><NoteCard icon={<Terminal size={19} />} title="Stack" items={["React + TypeScript", "Tailwind CSS", pattern.dependencies.length ? pattern.dependencies.join(" + ") : "Sem dependências externas"]} /></div></section>
    {related.length > 0 && <section className="detail-related"><div className="section-heading compact"><div><span className="section-index">PRÓXIMO</span><p>CONTINUE EXPLORANDO</p></div><h2>Mais em {pattern.category.toLowerCase()}.</h2><Link className="text-link" href="/explore">Ver biblioteca <ArrowRight size={15} /></Link></div><div className="related-grid">{related.map((item) => <Link className="related-item" href={"/patterns/" + item.slug} key={item.slug}><span className={"related-art accent-" + item.accent}><Eye size={18} /></span><div><small>{item.eyebrow}</small><b>{item.name}</b></div><ArrowRight size={16} /></Link>)}</div></section>}
  </article>;
}

function NoteCard({ icon, title, items }: { icon: React.ReactNode; title: string; items: string[] }) { return <div className="note-card"><span className="note-icon">{icon}</span><h3>{title}</h3><ul>{items.map((item) => <li key={item}><Check size={13} />{item}</li>)}</ul></div>; }
function getStoryIntro(slug: string) { const intros: Record<string, string> = { "expandable-sidebar": "A melhor sidebar muda de largura sem mudar a orientação. Quando o espaço aperta, os ícones continuam sendo um mapa; quando sobra, os rótulos devolvem contexto.", "command-palette": "Uma intenção bem atendida parece quase instantânea. A paleta reduz distância entre pensamento e ação, sem pedir que a pessoa memorize onde cada comando mora.", "modern-product-card": "Um bom card de produto não grita. Ele cria uma sequência tranquila: reconhecer, comparar, escolher e agir.", "soft-transition-modal": "Foco não precisa ser ruptura. O diálogo entra como uma camada de atenção, preserva a história da tela e sai deixando tudo no lugar." }; return intros[slug] || "Um padrão forte transforma uma decisão recorrente em uma sequência clara, familiar e agradável de repetir."; }
function getFeatures(slug: string) { const features: Record<string, string[]> = { "expandable-sidebar": ["Contexto que acompanha", "Compacto quando precisa", "Estado ativo sem ruído", "Perfil sempre à mão"], "modern-mega-menu": ["Arquitetura legível", "Conteúdo em camadas", "Destaque com propósito", "Rotas fáceis de comparar"], "command-palette": ["Busca que entende", "Atalhos visíveis", "Grupos que orientam", "Feedback imediato"] }; return features[slug] || ["Hierarquia perceptível", "Estados bem definidos", "Movimento intencional", "Adaptação responsiva"]; }
function getNotes(slug: string, type: "a11y" | "responsive") { const notes: Record<string, string[]> = { "expandable-sidebar-a11y": ["Foco visível em todos os itens", "Navegação sem depender de hover", "Estado exposto ao leitor de tela"], "expandable-sidebar-responsive": ["Compacta por padrão no mobile", "Largura fluida no tablet", "Alvos de toque de 44 px"], "command-palette-a11y": ["Navegação por setas", "Enter executa", "Escape fecha com retorno de foco"], "soft-transition-modal-a11y": ["Foco entra no diálogo", "Escape fecha", "Retorno ao gatilho"], "soft-transition-modal-responsive": ["Ancora na base no celular", "Campos ocupam a largura", "Conteúdo pode rolar"] }; return notes[slug + "-" + type] || (type === "a11y" ? ["HTML semântico", "Foco visível", "Estados anunciados"] : ["Mobile-first", "Layout fluido", "Sem overflow horizontal"]); }
