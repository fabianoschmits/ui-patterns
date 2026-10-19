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
  "articulated-territories-nav": dynamic(() => import("./articulated-territories-nav/component"), { loading }),
  "inhabitable-plan-nav": dynamic(() => import("./inhabitable-plan-nav/component"), { loading }),
  "route-loom-nav": dynamic(() => import("./route-loom-nav/component"), { loading }),
  "editorial-shutter-nav": dynamic(() => import("./editorial-shutter-nav/component"), { loading }),
  "cartographic-fold-nav": dynamic(() => import("./cartographic-fold-nav/component"), { loading }),
  "archive-drawers-nav": dynamic(() => import("./archive-drawers-nav/component"), { loading }),
  "portal-sequence-nav": dynamic(() => import("./portal-sequence-nav/component"), { loading }),
  "destination-mobile-nav": dynamic(() => import("./destination-mobile-nav/component"), { loading }),
  "navigation-score": dynamic(() => import("./navigation-score/component"), { loading }),
  "layered-collage-nav": dynamic(() => import("./layered-collage-nav/component"), { loading }),
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
