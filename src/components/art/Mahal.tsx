"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { cresting, cuspedArch, finial, jaaliTile, onionDome, skyline } from "@/lib/mughal";

/**
 * A silhouetted palace skyline. Two depths are drawn from the same generator
 * with different seeds and scales, so the parallax layers agree architecturally
 * without repeating.
 */
export function MahalSkyline({
  depth,
  className = "",
}: {
  depth: "far" | "mid";
  className?: string;
}) {
  const W = 1200;
  const H = 460;
  const cfg =
    depth === "far"
      ? { blocks: 9, maxH: 300, seed: 7, fill: "var(--color-sky-2)", opacity: 0.55 }
      : { blocks: 5, maxH: 420, seed: 3, fill: "var(--color-sky-3)", opacity: 0.85 };

  const blocks = useMemo(
    () => skyline(W, cfg.blocks, cfg.maxH, cfg.seed),
    [cfg.blocks, cfg.maxH, cfg.seed]
  );

  return (
    <svg
      viewBox={`0 0 ${W} ${H}`}
      preserveAspectRatio="xMidYMax slice"
      className={className}
      aria-hidden="true"
    >
      <g fill={cfg.fill} opacity={cfg.opacity}>
        {blocks.map((b, i) => {
          const ground = H;
          const roof = ground - b.baseH;
          return (
            <g key={i} transform={`translate(${b.x} 0)`}>
              {/* body */}
              <rect x={-b.baseW / 2} y={roof} width={b.baseW} height={b.baseH} />
              {/* parapet cresting */}
              <path d={cresting(b.baseW, Math.max(4, Math.round(b.baseW / 22)), 9)} transform={`translate(0 ${roof})`} />
              {/* drum + dome + finial */}
              <rect x={-b.domeW * 0.42} y={roof - b.domeH * 0.16} width={b.domeW * 0.84} height={b.domeH * 0.18} />
              <path d={onionDome(b.domeW, b.domeH)} transform={`translate(0 ${roof - b.domeH * 0.14})`} />
              <path d={finial(b.domeH * 0.34)} transform={`translate(0 ${roof - b.domeH * 1.1})`} />
              {/* corner chhatris */}
              {b.chhatris &&
                [-1, 1].map((s) => (
                  <g key={s} transform={`translate(${(s * b.baseW) / 2.35} ${roof + 6})`}>
                    <rect x={-b.domeW * 0.24} y={-b.domeH * 0.34} width={b.domeW * 0.48} height={b.domeH * 0.34} />
                    <path d={onionDome(b.domeW * 0.46, b.domeH * 0.34)} transform={`translate(0 ${-b.domeH * 0.34})`} />
                    <path d={finial(b.domeH * 0.14)} transform={`translate(0 ${-b.domeH * 0.68})`} />
                  </g>
                ))}
            </g>
          );
        })}
      </g>
    </svg>
  );
}

/**
 * The foreground iwan — a cusped arch cut out of a marble wall. Whatever the
 * stage places behind this reads as being seen *through* the palace.
 */
export function ArchFrame({ className = "" }: { className?: string }) {
  // The frame is drawn at the element's real pixel size rather than a fixed
  // viewBox, so the opening keeps sensible proportions on a phone and on a wide
  // desktop without any cropping or distortion.
  const [box, ref] = useElementSize();
  const W = box.w;
  const H = box.h;

  // On a phone the opening has to be nearly the full width or the wall crops
  // the invitation text; on a wide screen it becomes a portrait iwan again.
  const narrow = W < 700;
  const archW = narrow ? W * 0.94 : Math.min(W * 0.6, H * 0.78);
  const archH = Math.min(H * 0.9, archW * (narrow ? 1.75 : 1.45));
  const springY = H * 0.98;
  const tile = useMemo(() => jaaliTile(38), []);

  const hole = cuspedArch(archW, archH, 7);

  return (
    <svg
      ref={ref}
      viewBox={`0 0 ${W} ${H}`}
      preserveAspectRatio="none"
      className={className}
      aria-hidden="true"
    >
      <defs>
        <pattern id="jaali" width={tile.size} height={tile.size} patternUnits="userSpaceOnUse">
          <g stroke="var(--color-sky-2)" strokeWidth="1" fill="none" opacity="0.9">
            {tile.paths.map((d, i) => (
              <path key={i} d={d} />
            ))}
          </g>
        </pattern>
        <linearGradient id="marbleWall" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="var(--color-paper)" />
          <stop offset="62%" stopColor="var(--color-marble)" />
          <stop offset="100%" stopColor="var(--color-mist)" />
        </linearGradient>
      </defs>

      {/* The opening is masked out rather than drawn as a compound path, so the
          cusps stay crisp and the flanking jaali can be clipped by the same edge. */}
      <mask id="archMask">
        <rect width={W} height={H} fill="white" />
        <path d={hole} transform={`translate(${W / 2} ${springY})`} fill="black" />
      </mask>

      <g mask="url(#archMask)">
        <rect width={W} height={H} fill="url(#marbleWall)" />
        {/* jaali panels flanking the opening */}
        {[0, 1].map((side) => {
          const pw = Math.max(0, (W - archW) / 2 - 34);
          return (
            <rect
              key={side}
              x={side === 0 ? 0 : W - pw}
              y={H * 0.16}
              width={pw}
              height={H}
              fill="url(#jaali)"
              opacity="0.5"
            />
          );
        })}
        {/* pilasters flanking the opening */}
        <rect x={(W - archW) / 2 - 26} y={0} width={9} height={H} fill="var(--color-sky-1)" opacity="0.8" />
        <rect x={(W + archW) / 2 + 17} y={0} width={9} height={H} fill="var(--color-sky-1)" opacity="0.8" />
      </g>

      {/* gold outline tracing the cusps */}
      <path
        d={hole}
        transform={`translate(${W / 2} ${springY})`}
        fill="none"
        stroke="var(--color-gold)"
        strokeWidth="1.6"
        opacity="0.65"
      />
      <path
        d={cuspedArch(archW + 34, archH + 30, 7)}
        transform={`translate(${W / 2} ${springY})`}
        fill="none"
        stroke="var(--color-gold)"
        strokeWidth="0.8"
        opacity="0.35"
      />
    </svg>
  );
}

/** Tracks an SVG element's rendered size so it can be drawn in real pixels. */
function useElementSize() {
  const [box, setBox] = useState({ w: 1000, h: 700 });
  const ref = useRef<SVGSVGElement>(null);

  useEffect(() => {
    const node = ref.current;
    if (!node) return;
    const ro = new ResizeObserver(([entry]) => {
      const { width, height } = entry.contentRect;
      if (width > 0 && height > 0) setBox({ w: Math.round(width), h: Math.round(height) });
    });
    ro.observe(node);
    return () => ro.disconnect();
  }, []);

  return [box, ref] as const;
}

/** A jaali-screened band, used as a section divider. */
export function JaaliBand({ className = "" }: { className?: string }) {
  const tile = useMemo(() => jaaliTile(34), []);
  return (
    <svg viewBox="0 0 400 34" preserveAspectRatio="none" className={className} aria-hidden="true">
      <defs>
        <pattern id="jaaliBand" width={tile.size} height={tile.size} patternUnits="userSpaceOnUse">
          <g stroke="var(--color-sky-2)" strokeWidth="0.9" fill="none">
            {tile.paths.map((d, i) => (
              <path key={i} d={d} />
            ))}
          </g>
        </pattern>
      </defs>
      <rect width="400" height="34" fill="url(#jaaliBand)" />
    </svg>
  );
}
