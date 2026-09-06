"use client";

import { useEffect, useRef } from "react";

/**
 * Dust caught in light. Kept deliberately sparse and slow — it should register
 * as air in the room, not as a particle effect.
 */
export function Motes({ count = 26, className = "" }: { count?: number; className?: string }) {
  const ref = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const cv = ref.current;
    if (!cv) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const ctx = cv.getContext("2d");
    if (!ctx) return;

    let raf = 0;
    const dpr = Math.min(window.devicePixelRatio || 1, 2);

    const resize = () => {
      const r = cv.getBoundingClientRect();
      cv.width = r.width * dpr;
      cv.height = r.height * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };
    resize();

    const w = () => cv.width / dpr;
    const h = () => cv.height / dpr;

    const motes = Array.from({ length: count }, () => ({
      x: Math.random() * w(),
      y: Math.random() * h(),
      r: 0.8 + Math.random() * 2.4,
      vy: -(0.08 + Math.random() * 0.22),
      vx: (Math.random() - 0.5) * 0.14,
      a: 0.12 + Math.random() * 0.3,
      p: Math.random() * Math.PI * 2,
    }));

    const draw = (t: number) => {
      ctx.clearRect(0, 0, w(), h());
      for (const m of motes) {
        m.y += m.vy;
        m.x += m.vx + Math.sin(t / 2600 + m.p) * 0.16;
        if (m.y < -8) {
          m.y = h() + 8;
          m.x = Math.random() * w();
        }
        ctx.beginPath();
        ctx.arc(m.x, m.y, m.r, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(176, 141, 76, ${m.a})`;
        ctx.fill();
      }
      raf = requestAnimationFrame(draw);
    };

    raf = requestAnimationFrame(draw);
    window.addEventListener("resize", resize);
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", resize);
    };
  }, [count]);

  return <canvas ref={ref} className={className} aria-hidden="true" />;
}
