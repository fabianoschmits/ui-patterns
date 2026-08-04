"use client";

import { patternPreviews } from "@/patterns/registry";
import type { PatternPreviewProps } from "@/types/pattern";

export function PatternPreview({ slug, ...props }: PatternPreviewProps & { slug: string }) {
  const Preview = patternPreviews[slug];
  if (!Preview) return <div className="preview-missing">Demonstração indisponível.</div>;
  return <Preview {...props} />;
}
