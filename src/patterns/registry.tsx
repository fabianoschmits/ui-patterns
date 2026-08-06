import type { ComponentType } from "react";
import dynamic from "next/dynamic";
import type { PatternPreviewProps } from "@/types/pattern";

const loading = () => (
  <div className="preview-loading" aria-label="Carregando demonstração">
    <i />
    <i />
    <i />
  </div>
);

export const patternPreviews: Record<string, ComponentType<PatternPreviewProps>> = {
  "quick-action-menu": dynamic(() => import("./quick-action-menu/component"), { loading }),
  "meniscus-liquid-nav": dynamic(() => import("./meniscus-liquid-nav/component"), { loading }),
  "liquid-glass-nav": dynamic(() => import("./liquid-glass-nav/component"), { loading }),
};
