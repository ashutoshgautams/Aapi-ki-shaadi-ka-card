"use client";

import { useEffect, useMemo, useState } from "react";
import { NIKAH_ISO, rasms } from "@/lib/invite";
import { cuspedArch } from "@/lib/mughal";

const NIKAH = new Date(NIKAH_ISO).getTime();
const FIRST = new Date(rasms[0].iso).getTime();
const LAST_END = new Date(rasms[rasms.length - 1].iso).getTime() + 4 * 3600_000;

type Phase =
  | { kind: "waiting"; ms: number }
  | { kind: "during"; next: (typeof rasms)[number] | null; ms: number }
  | { kind: "married"; days: number };

function phaseAt(now: number): Phase {
  if (now < FIRST) return { kind: "waiting", ms: NIKAH - now };
  if (now < LAST_END) {
    const next = rasms.find((r) => new Date(r.iso).getTime() > now) ?? null;
    return { kind: "during", next, ms: next ? new Date(next.iso).getTime() - now : 0 };
  }
  return { kind: "married", days: Math.floor((now - NIKAH) / 86_400_000) };
}

function split(ms: number) {
  const s = Math.max(0, Math.floor(ms / 1000));
  return {
    d: Math.floor(s / 86400),
    h: Math.floor((s % 86400) / 3600),
    m: Math.floor((s % 3600) / 60),
    s: s % 60,
  };
}

export function Countdown() {
  // Rendered inert on the server, then hydrated — the frame is identical either
  // way, so only the numerals change and nothing shifts.
  const [now, setNow] = useState<number | null>(null);

  useEffect(() => {
    setNow(Date.now());
    const id = window.setInterval(() => setNow(Date.now()), 1000);
    return () => window.clearInterval(id);
  }, []);

  const phase = useMemo<Phase>(
    () => (now === null ? { kind: "waiting", ms: NIKAH - FIRST } : phaseAt(now)),
    [now]
  );

  if (phase.kind === "married") return <MarriedState days={phase.days} />;

  const t = split(phase.ms);
  const cells = [
    { v: t.d, label: "Days" },
    { v: t.h, label: "Hours" },
    { v: t.m, label: "Minutes" },
    { v: t.s, label: "Seconds" },
  ];

  return (
    <div className="flex flex-col items-center">
      <Niche />
      <p className="eyebrow mt-6 text-[color:var(--color-azure-deep)]">
        {phase.kind === "during" && phase.next
          ? `Next — ${phase.next.title}`
          : "Until the Nikah"}
      </p>

      <div
        className="mt-5 grid w-full max-w-lg grid-cols-4"
        role="timer"
        aria-live="off"
        aria-label="Time remaining until the nikah"
      >
        {cells.map((c, i) => (
          <div
            key={c.label}
            className={`flex flex-col items-center px-1 py-2 ${
              i > 0 ? "border-l border-[color:var(--color-sky-1)]" : ""
            }`}
          >
            <span
              className="font-display text-[clamp(2.2rem,10vw,3.6rem)] leading-none font-medium text-[color:var(--color-indigo)] tabular-nums"
              suppressHydrationWarning
            >
              {now === null ? "—" : String(c.v).padStart(2, "0")}
            </span>
            <span className="eyebrow mt-2 text-[0.6rem] text-[color:var(--color-ink-soft)]">
              {c.label}
            </span>
          </div>
        ))}
      </div>

      {phase.kind === "during" && (
        <p className="mt-6 max-w-sm text-center text-sm text-[color:var(--color-ink-soft)]">
          The celebrations have begun.
        </p>
      )}
    </div>
  );
}

/** What the countdown becomes once there is nothing left to count. */
function MarriedState({ days }: { days: number }) {
  const years = Math.floor(days / 365);
  return (
    <div className="flex flex-col items-center text-center">
      <Niche />
      <p className="eyebrow mt-6 text-[color:var(--color-gold)]">Alhamdulillah</p>
      <p className="font-display mt-3 text-[clamp(1.9rem,7vw,2.9rem)] leading-tight font-medium text-[color:var(--color-indigo)]">
        They were married on
        <br />
        24 October 2026
      </p>
      <p className="mt-4 text-sm text-[color:var(--color-ink-soft)]">
        {years >= 1
          ? `${years} ${years === 1 ? "year" : "years"} together, and counting.`
          : `${days} ${days === 1 ? "day" : "days"} together, and counting.`}
      </p>
      <p className="font-arabic mt-6 text-xl text-[color:var(--color-azure-deep)]">
        بَارَكَ اللّٰهُ لَكُمَا
      </p>
    </div>
  );
}

/** A small cusped niche that sits above the numerals. */
function Niche() {
  return (
    <svg viewBox="0 0 120 80" className="h-16 w-24 text-[color:var(--color-gold)]" aria-hidden="true">
      <path
        d={cuspedArch(76, 62, 5)}
        transform="translate(60 74)"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.2"
        opacity="0.7"
      />
      <circle cx="60" cy="46" r="2.4" fill="currentColor" opacity="0.8" />
      <path d="M22 76 H98" stroke="currentColor" strokeWidth="1" opacity="0.45" />
    </svg>
  );
}
