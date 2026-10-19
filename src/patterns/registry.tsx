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
  "notch-dock-nav": dynamic(() => import("./notch-dock-nav/component"), { loading }),
  "prism-rail-nav": dynamic(() => import("./prism-rail-nav/component"), { loading }),
  "folding-tabs-nav": dynamic(() => import("./folding-tabs-nav/component"), { loading }),
  "expanding-island-nav": dynamic(() => import("./expanding-island-nav/component"), { loading }),
  "magnetic-tiles-nav": dynamic(() => import("./magnetic-tiles-nav/component"), { loading }),
  "ribbon-track-nav": dynamic(() => import("./ribbon-track-nav/component"), { loading }),
  "orbit-ring-nav": dynamic(() => import("./orbit-ring-nav/component"), { loading }),
  "fan-action-nav": dynamic(() => import("./fan-action-nav/component"), { loading }),
  "corner-hinge-nav": dynamic(() => import("./corner-hinge-nav/component"), { loading }),
  "fitpro-corner-nav": dynamic(() => import("./fitpro-corner-nav/component"), { loading }),
  "stacked-deck-nav": dynamic(() => import("./stacked-deck-nav/component"), { loading }),
  "auth-portal": dynamic(() => import("./utilities/auth-portal/component"), { loading }),
  "smart-search": dynamic(() => import("./utilities/smart-search/component"), { loading }),
  "notification-center": dynamic(() => import("./utilities/notification-center/component"), { loading }),
  "user-profile": dynamic(() => import("./utilities/user-profile/component"), { loading }),
  "account-settings": dynamic(() => import("./utilities/account-settings/component"), { loading }),
  "file-upload-center": dynamic(() => import("./utilities/file-upload-center/component"), { loading }),
  "booking-calendar": dynamic(() => import("./utilities/booking-calendar/component"), { loading }),
  "share-access-panel": dynamic(() => import("./utilities/share-access-panel/component"), { loading }),
  "support-chat": dynamic(() => import("./utilities/support-chat/component"), { loading }),
  "shopping-cart": dynamic(() => import("./utilities/shopping-cart/component"), { loading }),
  "checkout-flow": dynamic(() => import("./utilities/checkout-flow/component"), { loading }),
  "filter-builder": dynamic(() => import("./utilities/filter-builder/component"), { loading }),
  "onboarding-checklist": dynamic(() => import("./utilities/onboarding-checklist/component"), { loading }),
  "activity-timeline": dynamic(() => import("./utilities/activity-timeline/component"), { loading }),
  "data-table-tools": dynamic(() => import("./utilities/data-table-tools/component"), { loading }),
};
