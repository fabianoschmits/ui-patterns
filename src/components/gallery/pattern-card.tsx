"use client";

import Link from "next/link";
import { ArrowUpRight, MonitorSmartphone, Sparkles } from "lucide-react";
import { FavoriteButton } from "@/components/shared/favorite-button";
import { PatternPreview } from "@/components/preview/pattern-preview";
import type { PatternSummary } from "@/types/pattern";
import { cn } from "@/lib/utils";

export function PatternCard({ pattern, priority = false }: { pattern: PatternSummary; priority?: boolean }) {
  return (
    <article className={cn("pattern-card", "accent-" + pattern.accent, "layout-" + pattern.layout, priority && "is-priority")}>
      <div className="pattern-card-preview">
        <div className="pattern-card-topline"><span>{pattern.category}</span><div>{pattern.isNew && <span className="status-badge">Novo</span>}{pattern.popular && <span className="status-badge subtle">Popular</span>}</div></div>
        <PatternPreview slug={pattern.slug} compact />
        <FavoriteButton slug={pattern.slug} />
        <Link className="preview-link" href={"/patterns/" + pattern.slug} aria-label={"Abrir " + pattern.name}><ArrowUpRight size={18} /></Link>
      </div>
      <div className="pattern-card-body">
        <div><span className="card-eyebrow">{pattern.eyebrow}</span><h3><Link href={"/patterns/" + pattern.slug}>{pattern.name}</Link></h3></div>
        <p>{pattern.description}</p>
        <footer><div>{pattern.technologies.slice(0, 2).map((tech) => <span key={tech}>{tech}</span>)}</div><span className="responsive-note"><MonitorSmartphone size={14} /> Responsivo</span></footer>
      </div>
    </article>
  );
}

export function PatternRow({ pattern, index }: { pattern: PatternSummary; index: number }) {
  return <Link className="pattern-row" href={"/patterns/" + pattern.slug}><span>{String(index + 1).padStart(2, "0")}</span><div className={"row-swatch accent-" + pattern.accent}><Sparkles size={16} /></div><div><small>{pattern.category}</small><b>{pattern.name}</b></div><p>{pattern.description}</p><ArrowUpRight size={17} /></Link>;
}
