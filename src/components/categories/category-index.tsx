import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { categories } from "@/data/categories";
import { patterns } from "@/data/patterns";
import { PatternRow } from "@/components/gallery/pattern-card";

export function CategoryIndex() {
  return <div className="category-index">{categories.map((category, index) => { const items = patterns.filter((pattern) => pattern.category === category.name); return <section className={"category-block accent-" + category.accent} key={category.name}><div className="category-block-heading"><span>{String(index + 1).padStart(2, "0")}</span><div><h2>{category.label}</h2><p>{category.description}</p></div><Link className="text-link" href={"/explore?category=" + encodeURIComponent(category.name)}>Ver todos <ArrowUpRight size={15} /></Link></div><div className="category-block-items">{items.map((pattern, itemIndex) => <PatternRow pattern={pattern} index={itemIndex} key={pattern.slug} />)}</div></section>; })}</div>;
}
