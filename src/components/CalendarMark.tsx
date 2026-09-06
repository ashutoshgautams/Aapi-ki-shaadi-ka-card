"use client";

import { useEffect, useRef, useState } from "react";
import { useAsset } from "@/components/Asset";
import { useLang } from "@/components/LangProvider";
import { assets } from "@/lib/assets";
import { NIKAH_ISO } from "@/lib/invite";

const NIKAH = new Date(NIKAH_ISO);
const YEAR = NIKAH.getFullYear();
const MONTH = NIKAH.getMonth();
const MARKED = 24;
const SPAN = [22, 23, 24, 25];

const WEEKDAYS_EN = ["S", "M", "T", "W", "T", "F", "S"];
const WEEKDAYS_UR = ["ا", "پ", "م", "ب", "ج", "ع", "ہ"];

/**
 * October 2026 with the 24th ringed by hand. The countdown says how long away
 * it is; this says *where in the month* it falls, which is what people picture
 * when they try to hold on to a date.
 */
export function CalendarMark() {
  const { lang, n, rtl } = useLang();
  const [drawn, setDrawn] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const hasFrame = useAsset(assets.frame);

  // The ring draws itself the first time the calendar scrolls into view.
  useEffect(() => {
    const node = ref.current;
    if (!node) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      setDrawn(true);
      return;
    }
    const io = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting) {
          setDrawn(true);
          io.disconnect();
        }
      },
      { threshold: 0.35 }
    );
    io.observe(node);
    return () => io.disconnect();
  }, []);

  const first = new Date(Date.UTC(YEAR, MONTH, 1)).getUTCDay();
  const total = new Date(Date.UTC(YEAR, MONTH + 1, 0)).getUTCDate();
  const cells: (number | null)[] = [
    ...Array.from({ length: first }, () => null),
    ...Array.from({ length: total }, (_, i) => i + 1),
  ];
  while (cells.length % 7 !== 0) cells.push(null);

  // Spelled out rather than taken from Intl: server and browser can carry
  // different locale data, which would desync hydration.
  const monthName = lang === "ur" ? `اکتوبر ${n(YEAR)}` : "October";

  return (
    <div ref={ref} className="relative w-full max-w-sm" dir={rtl ? "rtl" : "ltr"}>
      {hasFrame && (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={assets.frame}
          alt=""
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 -m-6 h-[calc(100%+3rem)] w-[calc(100%+3rem)] max-w-none"
        />
      )}

      <div className="relative flex flex-col items-center px-2 py-4">
        <p className="eyebrow text-[0.55rem] text-[color:var(--color-gold)]">
          {rtl ? "بروز ہفتہ" : "Saturday"}
        </p>
        <p
          className={`mt-2 text-[color:var(--color-indigo)] ${
            rtl ? "font-urdu text-2xl" : "font-display text-[2.6rem] leading-none font-light"
          }`}
        >
          {monthName}
        </p>
        {!rtl && (
          <p className="font-display text-[1.15rem] tracking-[0.4em] text-[color:var(--color-gold)]">
            {YEAR}
          </p>
        )}

        <span className="hairline my-6 block w-24" />

        <div className="grid w-full grid-cols-7 gap-y-1.5">
          {WEEKDAYS_EN.map((d, i) => (
            <span
              key={i}
              className="eyebrow pb-3 text-center text-[0.52rem] text-[color:var(--color-gold)] opacity-80"
            >
              {rtl ? WEEKDAYS_UR[i] : d}
            </span>
          ))}

          {cells.map((day, i) => {
            if (day === null) return <span key={i} />;
            const inSpan = SPAN.includes(day);
            const isMark = day === MARKED;

            return (
              <span key={i} className="relative grid aspect-square place-items-center">
                {isMark && <Ring drawn={drawn} />}
                <span
                  className={`relative tabular-nums ${
                    isMark
                      ? "font-display text-[1.5rem] leading-none font-normal text-[color:var(--color-gold)]"
                      : inSpan
                        ? "text-sm font-medium text-[color:var(--color-azure-deep)]"
                        : "text-sm font-light text-[color:var(--color-ink-soft)]"
                  }`}
                >
                  {n(day)}
                </span>
              </span>
            );
          })}
        </div>

        <p className="font-display mt-7 text-center text-sm italic text-[color:var(--color-ink-soft)]">
          {rtl ? "۲۲ تا ۲۵ اکتوبر تقریبات" : "Celebrations run 22–25 October"}
        </p>
      </div>
    </div>
  );
}

/** A ring drawn the way a hand draws one — elliptical, tilted, overshooting. */
function Ring({ drawn }: { drawn: boolean }) {
  return (
    <svg
      viewBox="-26 -26 52 52"
      className="pointer-events-none absolute inset-0 h-full w-full overflow-visible"
      aria-hidden="true"
    >
      <path
        d={RING_PATH}
        fill="none"
        stroke="var(--color-gold)"
        strokeWidth="1.6"
        strokeLinecap="round"
        pathLength={1}
        style={{
          strokeDasharray: 1,
          strokeDashoffset: drawn ? 0 : 1,
          transition: "stroke-dashoffset 1100ms cubic-bezier(.36,.06,.2,1) 250ms",
        }}
      />
    </svg>
  );
}

/**
 * Precomputed at module load so the server and the browser emit byte-identical
 * path data — Math.sin and Math.cos are not guaranteed to agree to the last bit
 * across V8 builds, which would otherwise trip a hydration mismatch.
 */
const RING_PATH = (() => {
  const rx = 20;
  const ry = 17.5;
  const from = -0.38;
  const to = Math.PI * 2 + 0.46;
  const steps = 52;
  const tilt = -0.2;
  const pts: string[] = [];

  for (let i = 0; i <= steps; i++) {
    const a = from + ((to - from) * i) / steps;
    // a slow wobble, so the stroke is never a perfect ellipse
    const wob = 1 + Math.sin(a * 2.3) * 0.05 + Math.sin(a * 5.1) * 0.022;
    const x = Math.cos(a) * rx * wob;
    const y = Math.sin(a) * ry * wob;
    const q = (v: number) => (Math.round(v * 10) / 10).toFixed(1);
    pts.push(`${q(x * Math.cos(tilt) - y * Math.sin(tilt))} ${q(x * Math.sin(tilt) + y * Math.cos(tilt))}`);
  }

  return `M ${pts[0]} ${pts.slice(1).map((p) => `L ${p}`).join(" ")}`;
})();
