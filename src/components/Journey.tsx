"use client";

import { useRef } from "react";
import { motion, useScroll, useTransform } from "motion/react";
import { Figure } from "@/components/art/Figures";
import { couple } from "@/lib/invite";
import { cuspedArch } from "@/lib/mughal";

/**
 * Act II. She walks the length of the colonnade; he comes the other way; they
 * meet under the centre arch. Both are seen only from behind — the invitation
 * is about the occasion, not a portrait.
 */
export function Journey() {
  const track = useRef<HTMLDivElement>(null);
  const { scrollYProgress: p } = useScroll({
    target: track,
    offset: ["start start", "end end"],
  });

  const brideX = useTransform(p, [0, 0.72], ["-18%", "26%"]);
  const groomX = useTransform(p, [0.18, 0.72], ["118%", "58%"]);
  const figureScale = useTransform(p, [0, 0.72], [0.82, 1]);
  const corridorScale = useTransform(p, [0, 1], [1.06, 1.24]);

  const brideCard = useTransform(p, [0.02, 0.14, 0.34, 0.44], [0, 1, 1, 0]);
  const groomCard = useTransform(p, [0.4, 0.52, 0.66, 0.74], [0, 1, 1, 0]);
  const meetCard = useTransform(p, [0.74, 0.85], [0, 1]);

  return (
    <section ref={track} className="relative h-[320svh]">
      <div className="sticky top-0 h-svh overflow-hidden bg-[color:var(--color-marble)]">
        <motion.div style={{ scale: corridorScale }} className="absolute inset-0">
          <Colonnade />
        </motion.div>

        {/* floor */}
        <div
          className="absolute inset-x-0 bottom-0 h-[26%]"
          style={{
            background:
              "linear-gradient(180deg, #dbeaf6 0%, #eaf3fa 38%, #ffffff 100%)",
          }}
        />

        {/* the two of them */}
        <motion.div
          style={{ x: brideX, scale: figureScale }}
          className="absolute bottom-[19%] left-0 h-[46svh] w-[26svh] origin-bottom"
        >
          <Figure variant="bride" className="h-full w-full animate-[stride_2.6s_ease-in-out_infinite]" />
        </motion.div>

        <motion.div
          style={{ x: groomX, scale: figureScale }}
          className="absolute bottom-[19%] left-0 h-[46svh] w-[26svh] origin-bottom"
        >
          <Figure
            variant="groom"
            className="h-full w-full animate-[stride_2.9s_ease-in-out_infinite] [transform:scaleX(-1)]"
          />
        </motion.div>

        {/* narration */}
        <div className="pointer-events-none absolute inset-x-0 top-[12svh] flex justify-center px-6">
          <motion.div style={{ opacity: brideCard }} className="absolute max-w-xs text-center">
            <Card
              eyebrow="The bride"
              name={`${couple.bride.honorific} ${couple.bride.name}`}
              urdu={couple.bride.urdu}
              lines={[couple.bride.line, `Daughter of ${couple.bride.parents.join(" & ")}`]}
            />
          </motion.div>

          <motion.div style={{ opacity: groomCard }} className="absolute max-w-xs text-center">
            <Card
              eyebrow="The groom"
              name={`${couple.groom.honorific} ${couple.groom.name}`}
              urdu={couple.groom.urdu}
              lines={[`Son of ${couple.groom.parents.join(" & ")}`, couple.groom.place]}
            />
          </motion.div>

          <motion.div style={{ opacity: meetCard }} className="absolute max-w-sm text-center">
            <p className="eyebrow text-[color:var(--color-gold)]">And so</p>
            <p className="font-display mt-3 text-[clamp(1.6rem,6vw,2.4rem)] leading-tight font-medium text-[color:var(--color-indigo)]">
              two families become one
            </p>
          </motion.div>
        </div>
      </div>

      <style>{`
        @keyframes stride {
          0%, 100% { transform: translateY(0) }
          50% { transform: translateY(-1.1%) }
        }
        @media (prefers-reduced-motion: reduce) {
          .animate-\\[stride_2\\.6s_ease-in-out_infinite\\],
          .animate-\\[stride_2\\.9s_ease-in-out_infinite\\] { animation: none !important }
        }
      `}</style>
    </section>
  );
}

function Card({
  eyebrow,
  name,
  urdu,
  lines,
}: {
  eyebrow: string;
  name: string;
  urdu: string;
  lines: string[];
}) {
  return (
    <>
      <p className="eyebrow text-[color:var(--color-gold)]">{eyebrow}</p>
      <p className="font-display mt-2 text-[clamp(1.7rem,6.4vw,2.5rem)] leading-tight font-medium text-[color:var(--color-indigo)]">
        {name}
      </p>
      <p className="font-urdu mt-1 text-base text-[color:var(--color-azure-deep)]">{urdu}</p>
      <div className="hairline mx-auto my-4 w-24" />
      {lines.filter(Boolean).map((l) => (
        <p key={l} className="text-sm leading-relaxed text-[color:var(--color-ink-soft)]">
          {l}
        </p>
      ))}
    </>
  );
}

/** A receding arcade — seven openings, the centre one tallest. */
function Colonnade() {
  const W = 1400;
  const H = 700;
  const base = 560;
  const bays = 7;
  const step = W / bays;

  return (
    <svg viewBox={`0 0 ${W} ${H}`} preserveAspectRatio="xMidYMax slice" className="h-full w-full" aria-hidden="true">
      <defs>
        <linearGradient id="bayLight" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#ffffff" />
          <stop offset="70%" stopColor="#dbeaf6" />
          <stop offset="100%" stopColor="#b9d7ec" />
        </linearGradient>
        <linearGradient id="pier" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stopColor="#eaf3fa" />
          <stop offset="45%" stopColor="#ffffff" />
          <stop offset="100%" stopColor="#dbeaf6" />
        </linearGradient>
      </defs>

      <rect width={W} height={H} fill="var(--color-marble)" />

      {Array.from({ length: bays }, (_, i) => {
        const cx = step * i + step / 2;
        const centreness = 1 - Math.abs(i - (bays - 1) / 2) / ((bays - 1) / 2);
        const h = 250 + centreness * 190;
        const w = step * (0.62 + centreness * 0.12);
        return (
          <g key={i}>
            {/* the lit opening */}
            <path
              d={cuspedArch(w, h, 6)}
              transform={`translate(${cx} ${base})`}
              fill="url(#bayLight)"
            />
            <path
              d={cuspedArch(w, h, 6)}
              transform={`translate(${cx} ${base})`}
              fill="none"
              stroke="var(--color-sky-2)"
              strokeWidth="1.4"
            />
            {/* piers */}
            <rect x={cx - w / 2 - 26} y={base - h * 0.62} width={20} height={h * 0.62} fill="url(#pier)" />
            <rect x={cx + w / 2 + 6} y={base - h * 0.62} width={20} height={h * 0.62} fill="url(#pier)" />
          </g>
        );
      })}

      {/* entablature */}
      <rect x={0} y={base} width={W} height={10} fill="var(--color-sky-1)" />
      <rect x={0} y={base + 10} width={W} height={H - base - 10} fill="var(--color-marble)" />
    </svg>
  );
}
