"use client";

import { useEffect, useMemo, useState } from "react";
import { useLang } from "@/components/LangProvider";
import { NIKAH_ISO, rasms } from "@/lib/invite";

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
  const { t, n, rtl } = useLang();
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

  const parts = split(phase.ms);
  const cells = [
    { v: parts.d, label: t("days") },
    { v: parts.h, label: t("hours") },
    { v: parts.m, label: t("minutes") },
    { v: parts.s, label: t("seconds") },
  ];

  return (
    <div className="flex flex-col items-center" dir={rtl ? "rtl" : "ltr"}>
      <Ornament />
      <p className="eyebrow mt-6 text-[0.58rem] text-[color:var(--color-gold)]">
        {phase.kind === "during" && phase.next
          ? `${t("next")} — ${phase.next.title}`
          : t("untilNikah")}
      </p>

      <div
        className="mt-7 grid w-full max-w-md grid-cols-4"
        role="timer"
        aria-live="off"
        aria-label="Time remaining until the nikah"
      >
        {cells.map((c, i) => (
          <div
            key={c.label}
            className={`flex flex-col items-center px-1 py-2 ${
              i > 0 ? "border-s border-[color:var(--color-sky-1)]" : ""
            }`}
          >
            <span
              className="font-display text-[clamp(2.4rem,11vw,3.8rem)] leading-none font-light text-[color:var(--color-indigo)] tabular-nums"
              suppressHydrationWarning
            >
              {now === null ? "—" : n(String(c.v).padStart(2, "0"))}
            </span>
            <span className="eyebrow mt-3 text-[0.52rem] text-[color:var(--color-gold)] opacity-90">
              {c.label}
            </span>
          </div>
        ))}
      </div>

      {phase.kind === "during" && (
        <p className="mt-6 max-w-sm text-center text-sm text-[color:var(--color-ink-soft)]">
          {t("celebrationsBegun")}
        </p>
      )}
    </div>
  );
}

/** What the countdown becomes once there is nothing left to count. */
function MarriedState({ days }: { days: number }) {
  const { t, n } = useLang();
  const years = Math.floor(days / 365);
  return (
    <div className="flex flex-col items-center text-center">
      <Ornament />
      <p className="eyebrow mt-6 text-[color:var(--color-gold)]">{t("alhamdulillah")}</p>
      <p className="font-display mt-4 text-[clamp(2rem,8vw,3rem)] leading-tight font-light text-[color:var(--color-indigo)]">
        {t("marriedOn")}
        <br />
        {n("24")} October {n("2026")}
      </p>
      <p className="mt-4 text-sm text-[color:var(--color-ink-soft)]">
        {years >= 1
          ? `${n(years)} ${t(years === 1 ? "year" : "years")} ${t("yearsTogether")}`
          : `${n(days)} ${t(days === 1 ? "day" : "daysWord")} ${t("yearsTogether")}`}
      </p>
      <p className="font-arabic mt-6 text-xl text-[color:var(--color-azure-deep)]">
        بَارَكَ اللّٰهُ لَكُمَا
      </p>
    </div>
  );
}

/** A gold rule that seats the numerals under the calendar. */
function Ornament() {
  return (
    <span className="flex items-center gap-3" aria-hidden="true">
      <span className="hairline w-16" />
      <span className="pip" />
      <span className="hairline w-16" />
    </span>
  );
}
