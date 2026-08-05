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
  "expandable-sidebar": dynamic(() => import("./expandable-sidebar/component"), { loading }),
  "floating-top-menu": dynamic(() => import("./floating-top-menu/component"), { loading }),
  "navigation-dock": dynamic(() => import("./navigation-dock/component"), { loading }),
  "animated-indicator-navbar": dynamic(() => import("./animated-indicator-navbar/component"), { loading }),
  "command-palette": dynamic(() => import("./command-palette/component"), { loading }),
  "fullscreen-mobile-menu": dynamic(() => import("./fullscreen-mobile-menu/component"), { loading }),
  "soft-transition-modal": dynamic(() => import("./soft-transition-modal/component"), { loading }),
  "modern-product-card": dynamic(() => import("./modern-product-card/component"), { loading }),
  "elegant-context-menu": dynamic(() => import("./elegant-context-menu/component"), { loading }),
};
