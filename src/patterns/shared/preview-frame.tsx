"use client";

import type { CSSProperties, ReactNode } from "react";
import type { PatternPreviewProps } from "@/types/pattern";
import { cn } from "@/lib/utils";

interface PreviewFrameProps extends PatternPreviewProps {
  children: ReactNode;
  className?: string;
}

export function PreviewFrame({ children, className, compact, theme = "light", accent = "#6e59d9", radius = 12, shadow = 35, speed = 1, density = 1 }: PreviewFrameProps) {
  const style = {
    "--demo-accent": accent,
    "--demo-radius": radius + "px",
    "--demo-shadow": shadow / 100,
    "--demo-speed": speed + "s",
    "--demo-density": density,
  } as CSSProperties;

  return <div className={cn("pattern-demo", "demo-theme-" + theme, compact && "is-compact", className)} style={style}>{children}</div>;
}

export function DemoAvatar({ label = "AM", tone = "violet" }: { label?: string; tone?: string }) {
  return <span className={cn("demo-avatar", "tone-" + tone)} aria-hidden="true">{label}</span>;
}
