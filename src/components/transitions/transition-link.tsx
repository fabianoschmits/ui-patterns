"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useLayoutEffect } from "react";
import type { ComponentProps, MouseEvent, PointerEvent } from "react";

const CATALOG_SCROLL_KEY = "ui-patterns:catalog-scroll";

function supportsViewTransition() {
  return typeof document !== "undefined" && "startViewTransition" in document;
}

type ViewTransitionDocument = Document & {
  startViewTransition: (callback: () => void) => void;
};

export function TransitionLink({
  href,
  children,
  className,
  ...props
}: ComponentProps<typeof Link>) {
  const router = useRouter();
  const pathname = usePathname();

  function rememberCatalogPosition() {
    if (typeof href !== "string") return;
    if (pathname !== "/" || !href.startsWith("/patterns/")) return;
    sessionStorage.setItem(
      CATALOG_SCROLL_KEY,
      JSON.stringify({ path: pathname, x: window.scrollX, y: window.scrollY }),
    );
  }

  function onPointerDown(event: PointerEvent<HTMLAnchorElement>) {
    props.onPointerDown?.(event);
    if (!event.defaultPrevented) rememberCatalogPosition();
  }

  function onClick(event: MouseEvent<HTMLAnchorElement>) {
    props.onClick?.(event);
    if (event.defaultPrevented) return;
    if (event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
    if (typeof href !== "string" || href.startsWith("http") || href.startsWith("mailto:")) return;

    event.preventDefault();

    rememberCatalogPosition();

    const go = () => router.push(href);

    if (supportsViewTransition()) {
      (document as ViewTransitionDocument).startViewTransition(() => {
        go();
      });
      return;
    }

    go();
  }

  return (
    <Link href={href} className={className} {...props} onPointerDown={onPointerDown} onClick={onClick}>
      {children}
    </Link>
  );
}

export function CatalogScrollRestorer() {
  useLayoutEffect(() => {
    const saved = sessionStorage.getItem(CATALOG_SCROLL_KEY);
    if (!saved) return;

    let position: { path: string; x: number; y: number };
    try {
      position = JSON.parse(saved) as { path: string; x: number; y: number };
    } catch {
      sessionStorage.removeItem(CATALOG_SCROLL_KEY);
      return;
    }

    if (position.path !== window.location.pathname) return;
    sessionStorage.removeItem(CATALOG_SCROLL_KEY);

    let frame = 0;
    let attempts = 0;
    const restore = () => {
      window.scrollTo(position.x, position.y);
      attempts += 1;
      if (attempts < 6) {
        frame = window.requestAnimationFrame(restore);
      }
    };

    frame = window.requestAnimationFrame(restore);
    return () => window.cancelAnimationFrame(frame);
  }, []);

  return null;
}
