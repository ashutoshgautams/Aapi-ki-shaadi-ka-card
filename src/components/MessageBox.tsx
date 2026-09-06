"use client";

import { useState } from "react";
import { motion } from "motion/react";
import { useLang } from "@/components/LangProvider";

type State = "idle" | "sending" | "done" | "error";

/**
 * Two fields and one button.
 *
 * There is deliberately no RSVP here — no attendance toggle, no head count, no
 * event picker. Guests write a line for the couple; the name is optional and
 * asked for after, because someone who only wants to send a blessing should
 * never be stopped by a form. Everything is set at full reading size.
 */
export function MessageBox() {
  const { t, rtl } = useLang();
  const [state, setState] = useState<State>("idle");
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const [name, setName] = useState("");

  async function submit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (message.trim().length < 2) {
      setError(t("needMessage"));
      setState("error");
      return;
    }

    setState("sending");
    setError("");

    const res = await fetch("/api/message", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, message }),
    }).catch(() => null);

    const json = (await res?.json().catch(() => null)) as { ok?: boolean; error?: string } | null;

    if (json?.ok) {
      setState("done");
      setMessage("");
      setName("");
    } else {
      setError(json?.error ?? "Something went wrong. Please try again.");
      setState("error");
    }
  }

  if (state === "done") {
    return (
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col items-center gap-5 py-10 text-center"
      >
        <span className="grid h-16 w-16 place-items-center rounded-full border border-[color:var(--color-gold)]/60">
          <svg viewBox="0 0 24 24" className="h-7 w-7 text-[color:var(--color-gold-ink)]" aria-hidden="true">
            <path
              d="M5 12.5 L10 17.5 L19 7"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </span>
        <p className="font-display text-[2rem] leading-tight font-light text-[color:var(--color-indigo)]">
          {t("recorded")}
        </p>
        <p className="readable max-w-sm">{t("recordedBody")}</p>
        <button
          type="button"
          onClick={() => setState("idle")}
          className="mt-2 cursor-pointer text-[1.02rem] font-medium text-[color:var(--color-azure-deep)] underline underline-offset-4"
        >
          {t("sendAnother")}
        </button>
      </motion.div>
    );
  }

  const field =
    "w-full rounded-sm border border-[color:var(--color-sky-2)] bg-white px-4 py-3.5 text-[1.05rem] leading-relaxed text-[color:var(--color-ink)] outline-none transition-colors placeholder:text-[color:var(--color-ink-soft)]/55 focus:border-[color:var(--color-azure-deep)]";

  return (
    <form onSubmit={submit} className="mx-auto flex max-w-md flex-col gap-7">
      <label className="flex flex-col gap-2.5">
        <span className="field-label">{t("yourMessage")}</span>
        <textarea
          name="message"
          rows={5}
          maxLength={2000}
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          className={`${field} resize-y`}
          placeholder={t("messagePlaceholder")}
          dir={rtl ? "rtl" : "ltr"}
        />
      </label>

      <label className="flex flex-col gap-2.5">
        <span className="field-label">
          {t("yourName")}{" "}
          <span className="font-normal text-[color:var(--color-ink-soft)]">
            ({t("optional")})
          </span>
        </span>
        <input
          name="name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className={field}
          placeholder={t("namePlaceholder")}
          dir={rtl ? "rtl" : "ltr"}
        />
      </label>

      {state === "error" && (
        <p role="alert" className="text-[1.02rem] font-medium text-[#9c3f2c]">
          {error}
        </p>
      )}

      <button
        type="submit"
        disabled={state === "sending"}
        className="w-full cursor-pointer rounded-sm border border-[color:var(--color-azure-deep)] bg-[color:var(--color-azure-deep)] px-8 py-4 text-[1.05rem] font-medium tracking-wide text-white transition-colors hover:bg-[color:var(--color-indigo)] disabled:opacity-60"
      >
        {state === "sending" ? t("sending") : t("sendMessage")}
      </button>
    </form>
  );
}
