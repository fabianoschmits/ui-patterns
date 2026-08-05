"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import type { PatternPreviewProps } from "@/types/pattern";
import "./indicator.css";

const items = ["Overview", "Projects", "Journal"] as const;

export default function AnimatedIndicatorNavbar(_props: PatternPreviewProps) {
  const [active, setActive] = useState<(typeof items)[number]>("Overview");

  return (
    <div className="ind-show">
      <div className="ind-show-bloom" aria-hidden="true" />
      <div className="ind-show-card">
        <nav className="ind-show-nav" aria-label="Navbar com indicador">
          <b>
            atlas<span>·</span>
          </b>
          <div className="ind-show-tabs" role="tablist">
            {items.map((item) => {
              const isActive = active === item;
              return (
                <button
                  key={item}
                  type="button"
                  role="tab"
                  aria-selected={isActive}
                  onClick={() => setActive(item)}
                >
                  {isActive && (
                    <motion.span
                      layoutId="ind-underline"
                      className="ind-show-line"
                      transition={{ type: "spring", stiffness: 420, damping: 32 }}
                    />
                  )}
                  {item}
                </button>
              );
            })}
          </div>
        </nav>

        <AnimatePresence mode="wait">
          <motion.div
            key={active}
            className="ind-show-panel"
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.32, ease: [0.22, 0.61, 0.28, 1] }}
          >
            <small>/{active.toLowerCase()}</small>
            <h2>
              {active === "Overview" && <>Make room<br /><em>for good work.</em></>}
              {active === "Projects" && <>Ship less<br /><em>noise. More craft.</em></>}
              {active === "Journal" && <>Notes that<br /><em>stay quiet.</em></>}
            </h2>
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}
