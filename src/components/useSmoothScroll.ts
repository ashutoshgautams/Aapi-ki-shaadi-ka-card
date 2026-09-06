"use client";

import { useEffect } from "react";

/**
 * Eased scrolling, which the parallax acts depend on to feel like camera moves
 * rather than jumps. Skipped entirely when the visitor asks for reduced motion.
 */
export function useSmoothScroll(enabled: boolean) {
  useEffect(() => {
    if (!enabled) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    let lenis: {
      raf: (t: number) => void;
      destroy: () => void;
      scrollTo: (target: number | string | HTMLElement, opts?: { immediate?: boolean }) => void;
    } | null = null;
    let raf = 0;
    let cancelled = false;

    void import("lenis").then(({ default: Lenis }) => {
      if (cancelled) return;
      lenis = new Lenis({ duration: 1.1, smoothWheel: true });
      const loop = (t: number) => {
        lenis?.raf(t);
        raf = requestAnimationFrame(loop);
      };
      raf = requestAnimationFrame(loop);

      // Note: #hash deep links do not survive Lenis taking over the scroll
      // position, and the page's images make the correct offset unknowable
      // until well after load. Nothing in the interface links to a section, so
      // the ids stay for reference and the page always opens at the top.
      lenis.scrollTo(0, { immediate: true });
    });

    return () => {
      cancelled = true;
      cancelAnimationFrame(raf);
      lenis?.destroy();
    };
  }, [enabled]);
}
