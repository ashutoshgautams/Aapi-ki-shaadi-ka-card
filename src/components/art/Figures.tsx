"use client";

import { useEffect, useRef } from "react";

/**
 * The two figures, always seen from behind — never a face, so the invitation
 * stays about the occasion rather than a likeness. Cloth is the only thing that
 * moves: a dupatta and a shawl driven by a small wave loop, which reads as
 * "alive" far more convincingly than a walk cycle at this scale.
 */

const BRIDE_BODY =
  "M100 20 C114 20 122 32 122 46 C122 58 116 68 108 73 L118 78 C134 86 140 102 140 120 L146 190 L158 292 L42 292 L54 190 L60 120 C60 102 66 86 82 78 L92 73 C84 68 78 58 78 46 C78 32 86 20 100 20 Z";

const GROOM_BODY =
  "M100 22 C113 22 121 33 121 45 C121 57 115 65 108 70 L117 75 C132 82 137 96 137 112 L142 196 L124 196 L121 292 L79 292 L76 196 L58 196 L63 112 C63 96 68 82 83 75 L92 70 C85 65 79 57 79 45 C79 33 87 22 100 22 Z";

/** Turban with a fanned kalgi — reads as groom instantly, even in silhouette. */
const TURBAN =
  "M78 40 C78 24 86 12 100 12 C114 12 122 24 122 40 C122 44 118 46 112 44 C104 41 96 41 88 44 C82 46 78 44 78 40 Z";

export function Figure({
  variant,
  className = "",
}: {
  variant: "bride" | "groom";
  className?: string;
}) {
  const cloth = useRef<SVGPathElement>(null);

  useEffect(() => {
    const node = cloth.current;
    if (!node) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    let raf = 0;
    const start = performance.now();
    const bride = variant === "bride";

    const tick = (t: number) => {
      const s = (t - start) / 1000;
      const w = (i: number, amp: number) => Math.sin(s * 0.85 + i * 1.1) * amp;

      const d = bride
        ? // A long dupatta trailing off the head, back and to the left.
          `M100 30 C 76 ${34 + w(0, 7)} 48 ${44 + w(1, 10)} 10 ${52 + w(2, 13)}
           C 34 ${86 + w(2, 11)} 62 ${88 + w(1, 8)} 96 ${74 + w(0, 5)} Z`
        : // A shorter shawl off the shoulder.
          `M118 78 C 142 ${84 + w(0, 5)} 160 ${102 + w(1, 8)} 176 ${96 + w(2, 10)}
           C 162 ${126 + w(2, 9)} 140 ${126 + w(1, 6)} 122 ${112 + w(0, 4)} Z`;

      node.setAttribute("d", d.replace(/\s+/g, " "));
      raf = requestAnimationFrame(tick);
    };

    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [variant]);

  const bride = variant === "bride";

  return (
    <svg viewBox="0 0 200 300" className={className} aria-hidden="true">
      <defs>
        <linearGradient id={`fig-${variant}`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="var(--color-azure-deep)" />
          <stop offset="100%" stopColor="var(--color-indigo)" />
        </linearGradient>
      </defs>

      {/* cloth sits behind the body so it reads as trailing */}
      <path
        ref={cloth}
        d={
          bride
            ? "M100 30 C 76 34 48 44 10 52 C 34 86 62 88 96 74 Z"
            : "M118 78 C 142 84 160 102 176 96 C 162 126 140 126 122 112 Z"
        }
        fill={`url(#fig-${variant})`}
        opacity="0.42"
      />

      <path d={bride ? BRIDE_BODY : GROOM_BODY} fill={`url(#fig-${variant})`} />
      {!bride && <path d={TURBAN} fill={`url(#fig-${variant})`} />}

      {/* bride's hair knot showing under the dupatta */}
      {bride && <ellipse cx="100" cy="30" rx="19" ry="14" fill={`url(#fig-${variant})`} />}

      {/* a single gold detail each: her border, his buttons */}
      {bride ? (
        <path
          d="M44 288 L156 288"
          stroke="var(--color-gold)"
          strokeWidth="3"
          opacity="0.55"
          strokeLinecap="round"
        />
      ) : (
        <g fill="var(--color-gold)" opacity="0.5">
          <circle cx="100" cy="100" r="2.2" />
          <circle cx="100" cy="118" r="2.2" />
          <circle cx="100" cy="136" r="2.2" />
        </g>
      )}
    </svg>
  );
}
