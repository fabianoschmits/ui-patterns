"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import type { ComponentProps, MouseEvent } from "react";

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

  function onClick(event: MouseEvent<HTMLAnchorElement>) {
    props.onClick?.(event);
    if (event.defaultPrevented) return;
    if (event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
    if (typeof href !== "string" || href.startsWith("http") || href.startsWith("mailto:")) return;

    event.preventDefault();

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
    <Link href={href} className={className} {...props} onClick={onClick}>
      {children}
    </Link>
  );
}
