"use client";

import { useState } from "react";
import { motion } from "motion/react";
import { hosts, rasms } from "@/lib/invite";
import { cuspedArch } from "@/lib/mughal";

type State = "idle" | "sending" | "done" | "error";

const field =
  "w-full border-b border-[color:var(--color-sky-2)] bg-transparent px-1 py-2.5 text-[color:var(--color-ink)] outline-none transition-colors placeholder:text-[color:var(--color-ink-soft)]/60 focus:border-[color:var(--color-azure-deep)]";

export function Rsvp() {
  const [state, setState] = useState<State>("idle");
  const [error, setError] = useState("");
  const [attending, setAttending] = useState<"Yes" | "No" | "">("");
  const [events, setEvents] = useState<string[]>([]);

  async function submit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setState("sending");
    setError("");

    const data = new FormData(e.currentTarget);
    const res = await fetch("/api/rsvp", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name: data.get("name"),
        phone: data.get("phone"),
        attending,
        guests: data.get("guests"),
        message: data.get("message"),
        events,
      }),
    }).catch(() => null);

    const json = (await res?.json().catch(() => null)) as { ok?: boolean; error?: string } | null;

    if (json?.ok) setState("done");
    else {
      setError(json?.error ?? "Something went wrong. Please try again.");
      setState("error");
    }
  }

  if (state === "done") {
    return (
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col items-center gap-4 py-10 text-center"
      >
        <svg viewBox="0 0 120 90" className="h-20 w-24 text-[color:var(--color-gold)]" aria-hidden="true">
          <path d={cuspedArch(72, 62, 5)} transform="translate(60 84)" fill="none" stroke="currentColor" strokeWidth="1.2" opacity="0.75" />
          <path d="M46 52 L56 62 L76 40" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
        <p className="font-display text-3xl font-medium text-[color:var(--color-indigo)]">
          Thank you — it&rsquo;s recorded.
        </p>
        <p className="max-w-sm text-sm text-[color:var(--color-ink-soft)]">
          {attending === "No"
            ? "You will be missed. Your message has been passed to the family."
            : "The family will be waiting for you at Kishan Palace."}
        </p>
      </motion.div>
    );
  }

  return (
    <form onSubmit={submit} className="flex flex-col gap-7">
      <div className="grid gap-7 sm:grid-cols-2">
        <label className="flex flex-col gap-1.5">
          <span className="eyebrow text-[0.6rem] text-[color:var(--color-azure-deep)]">Your name</span>
          <input name="name" required minLength={2} className={field} placeholder="Who is writing?" />
        </label>
        <label className="flex flex-col gap-1.5">
          <span className="eyebrow text-[0.6rem] text-[color:var(--color-azure-deep)]">Phone (optional)</span>
          <input name="phone" inputMode="tel" className={field} placeholder="So we can reach you" />
        </label>
      </div>

      <fieldset className="flex flex-col gap-3">
        <legend className="eyebrow mb-1 text-[0.6rem] text-[color:var(--color-azure-deep)]">
          Will you be there?
        </legend>
        <div className="flex gap-3">
          {(["Yes", "No"] as const).map((v) => (
            <button
              key={v}
              type="button"
              onClick={() => setAttending(v)}
              aria-pressed={attending === v}
              className={`flex-1 cursor-pointer border px-5 py-3 text-sm tracking-wide transition-colors ${
                attending === v
                  ? "border-[color:var(--color-azure-deep)] bg-[color:var(--color-azure-deep)] text-white"
                  : "border-[color:var(--color-sky-2)] text-[color:var(--color-ink-soft)] hover:border-[color:var(--color-azure)]"
              }`}
            >
              {v === "Yes" ? "Yes, with joy" : "Sadly, no"}
            </button>
          ))}
        </div>
      </fieldset>

      {attending !== "No" && (
        <>
          <label className="flex flex-col gap-1.5">
            <span className="eyebrow text-[0.6rem] text-[color:var(--color-azure-deep)]">
              How many of you?
            </span>
            <input
              name="guests"
              type="number"
              min={1}
              max={20}
              defaultValue={1}
              className={`${field} tabular-nums`}
            />
          </label>

          <fieldset className="flex flex-col gap-3">
            <legend className="eyebrow mb-1 text-[0.6rem] text-[color:var(--color-azure-deep)]">
              Which rasms will you join?
            </legend>
            <div className="flex flex-wrap gap-2">
              {rasms.map((r) => {
                const on = events.includes(r.title);
                return (
                  <button
                    key={r.key}
                    type="button"
                    onClick={() =>
                      setEvents((p) => (on ? p.filter((x) => x !== r.title) : [...p, r.title]))
                    }
                    aria-pressed={on}
                    className={`cursor-pointer rounded-full border px-4 py-1.5 text-xs tracking-wide transition-colors ${
                      on
                        ? "border-[color:var(--color-gold)] bg-[color:var(--color-gold)]/12 text-[color:var(--color-indigo)]"
                        : "border-[color:var(--color-sky-2)] text-[color:var(--color-ink-soft)] hover:border-[color:var(--color-azure)]"
                    }`}
                  >
                    {r.title}
                  </button>
                );
              })}
            </div>
          </fieldset>
        </>
      )}

      <label className="flex flex-col gap-1.5">
        <span className="eyebrow text-[0.6rem] text-[color:var(--color-azure-deep)]">
          A message for Nemat &amp; Bakhtiyar
        </span>
        <textarea
          name="message"
          rows={4}
          maxLength={2000}
          className={`${field} resize-y leading-relaxed`}
          placeholder="A dua, a memory, a line of advice…"
        />
      </label>

      {state === "error" && (
        <p role="alert" className="text-sm text-[#a1442f]">
          {error}
        </p>
      )}

      <div className="flex flex-col items-start gap-3 sm:flex-row sm:items-center sm:justify-between">
        <button
          type="submit"
          disabled={state === "sending"}
          className="cursor-pointer border border-[color:var(--color-azure-deep)] bg-[color:var(--color-azure-deep)] px-8 py-3.5 text-white transition-colors hover:bg-[color:var(--color-indigo)] disabled:opacity-60"
        >
          <span className="eyebrow text-[0.62rem]">
            {state === "sending" ? "Sending…" : "Send to the family"}
          </span>
        </button>
        <p className="text-xs text-[color:var(--color-ink-soft)]">
          Kindly reply by {hosts.rsvpBy}
        </p>
      </div>
    </form>
  );
}
