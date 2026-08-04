import Link from "next/link";
import { ArrowUpRight, Smartphone, Sparkles, Workflow } from "lucide-react";

const collections = [
  { title: "SaaS, sem a cara de sempre", description: "Navegação e produtividade para produtos densos que ainda respiram.", query: "SaaS", icon: Workflow, accent: "blue", count: "04 padrões" },
  { title: "Feito para o polegar", description: "Menus e interações que tratam o celular como tela principal.", query: "Mobile", icon: Smartphone, accent: "peach", count: "03 padrões" },
  { title: "Movimento com propósito", description: "Microinterações que explicam estado, direção e contexto.", query: "Animado", icon: Sparkles, accent: "mint", count: "09 padrões" },
];

export function EditorialCollections() {
  return <section className="collections-section"><div className="section-heading"><div><span className="section-index">04</span><p>COLEÇÕES EDITORIAIS</p></div><h2>Curadoria para<br /><em>cada contexto.</em></h2><p>Atalhos conceituais para quando você sabe o problema, mas ainda procura a forma certa.</p></div><div className="collection-grid">{collections.map(({ title, description, query, icon: Icon, accent, count }, index) => <Link href={"/explore?q=" + encodeURIComponent(query)} className={"collection-item accent-" + accent} key={title}><span className="collection-index">0{index + 1}</span><Icon size={23} /><div><h3>{title}</h3><p>{description}</p></div><footer><span>{count}</span><ArrowUpRight size={16} /></footer></Link>)}</div></section>;
}
