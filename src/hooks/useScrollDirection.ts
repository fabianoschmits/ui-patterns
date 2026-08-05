"use client";

import { useEffect, useRef, useState } from "react";

export function useScrollDirection(containerRef?: React.RefObject<HTMLElement | null>) {
  const [isVisible, setIsVisible] = useState(true);
  const lastScrollY = useRef(0);
  const reappearTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    const target = containerRef?.current ?? window;

    const getY = () => {
      if (containerRef?.current) return containerRef.current.scrollTop;
      return window.scrollY;
    };

    const handleScroll = () => {
      const currentScrollY = getY();

      if (reappearTimeoutRef.current) {
        clearTimeout(reappearTimeoutRef.current);
        reappearTimeoutRef.current = null;
      }

      if (currentScrollY <= 0) {
        setIsVisible(true);
        lastScrollY.current = currentScrollY;
        return;
      }

      if (currentScrollY > lastScrollY.current + 4) {
        setIsVisible(false);
      } else if (currentScrollY < lastScrollY.current - 4) {
        setIsVisible(true);
      }

      lastScrollY.current = currentScrollY;

      reappearTimeoutRef.current = setTimeout(() => {
        setIsVisible(true);
      }, 3000);
    };

    let ticking = false;
    const scrollHandler = () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          handleScroll();
          ticking = false;
        });
        ticking = true;
      }
    };

    target.addEventListener("scroll", scrollHandler, { passive: true });
    return () => {
      target.removeEventListener("scroll", scrollHandler);
      if (reappearTimeoutRef.current) clearTimeout(reappearTimeoutRef.current);
    };
  }, [containerRef]);

  return { isVisible };
}
