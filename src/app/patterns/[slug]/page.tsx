import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getPatternBySlug, patterns } from "@/data/patterns";
import { PatternPreview } from "@/components/preview/pattern-preview";
import { TransitionLink } from "@/components/transitions/transition-link";

const immersiveSlugs = new Set([
  "quick-action-menu",
  "meniscus-liquid-nav",
  "liquid-glass-nav",
  "expandable-sidebar",
  "floating-top-menu",
  "navigation-dock",
  "animated-indicator-navbar",
  "fullscreen-mobile-menu",
]);

const canvasImmersiveSlugs = immersiveSlugs;

export function generateStaticParams() {
  return patterns.map((pattern) => ({ slug: pattern.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const pattern = getPatternBySlug(slug);
  if (!pattern) return { title: "Padrão não encontrado" };
  return {
    title: pattern.name,
    description: pattern.description,
  };
}

export default async function PatternPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const pattern = getPatternBySlug(slug);
  if (!pattern) notFound();

  const immersive = immersiveSlugs.has(slug);
  const canvasImmersive = canvasImmersiveSlugs.has(slug);

  return (
    <div
      className={`pattern-stage accent-${pattern.accent}${immersive ? " is-immersive" : ""}${canvasImmersive ? " is-canvas" : ""}`}
    >
      <TransitionLink className="stage-back" href="/">
        ← UI Patterns
      </TransitionLink>

      <div className="stage-frame">
        <PatternPreview slug={pattern.slug} />
      </div>

      {!immersive && (
        <footer className="stage-footer">
          <div className="stage-copy">
            <span>{pattern.category}</span>
            <h1>{pattern.name}</h1>
          </div>
        </footer>
      )}
    </div>
  );
}
