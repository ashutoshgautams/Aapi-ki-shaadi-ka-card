"use client";

import { useRef, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { useLang } from "@/components/LangProvider";

type Step = "write" | "sign" | "sent";

/**
 * Write, then sign, then send.
 *
 * Splitting it in two keeps a single thing on screen at a time, so it reads as
 * a note being written rather than a form being filled in. The name is asked
 * for only after the message exists, and can be skipped outright — nobody
 * should be stopped from sending a blessing because they don't want to type
 * their name.
 */
export function MessageBox() {
  const { t, rtl } = useLang();
  const [step, setStep] = useState<Step>("write");
  const [message, setMessage] = useState("");
  const [name, setName] = useState("");
  const [error, setError] = useState("");
  const [sending, setSending] = useState(false);
  const nameRef = useRef<HTMLInputElement>(null);

  function toSign() {
    if (message.trim().length < 2) {
      setError(t("needMessage"));
      return;
    }
    setError("");
    setStep("sign");
    window.setTimeout(() => nameRef.current?.focus(), 350);
  }

  async function send(withName: boolean) {
    setSending(true);
    setError("");

    const res = await fetch("/api/message", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name: withName ? name : "", message }),
    }).catch(() => null);

    const json = (await res?.json().catch(() => null)) as { ok?: boolean; error?: string } | null;
    setSending(false);

    if (json?.ok) {
      setStep("sent");
      setMessage("");
      setName("");
    } else {
      setError(json?.error ?? "Something went wrong. Please try again.");
    }
  }

  const box =
    "w-full rounded-sm border border-[color:var(--color-sky-2)] bg-white px-4 py-3.5 text-[1.08rem] leading-relaxed text-[color:var(--color-ink)] outline-none transition-colors placeholder:text-[color:var(--color-ink-soft)]/55 focus:border-[color:var(--color-azure-deep)]";
  const primary =
    "w-full cursor-pointer rounded-sm bg-[color:var(--color-azure-deep)] px-8 py-4 text-[1.08rem] font-medium text-white transition-colors hover:bg-[color:var(--color-indigo)] disabled:opacity-60";

  return (
    <div className="mx-auto w-full max-w-md">
      <AnimatePresence mode="wait">
        {step === "write" && (
          <motion.div
            key="write"
            initial={{ opacity: 0, x: rtl ? -16 : 16 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: rtl ? 16 : -16 }}
            transition={{ duration: 0.28 }}
            className="flex flex-col gap-5"
          >
            <textarea
              rows={5}
              maxLength={2000}
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              className={`${box} resize-y`}
              placeholder={t("messagePlaceholder")}
              dir={rtl ? "rtl" : "ltr"}
              aria-label={t("yourMessage")}
            />
            {error && <Problem>{error}</Problem>}
            <button type="button" onClick={toSign} className={primary}>
              {t("continueWord")}
            </button>
          </motion.div>
        )}

        {step === "sign" && (
          <motion.div
            key="sign"
            initial={{ opacity: 0, x: rtl ? -16 : 16 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: rtl ? 16 : -16 }}
            transition={{ duration: 0.28 }}
            className="flex flex-col gap-5"
          >
            <p className="font-display text-center text-[1.6rem] leading-snug font-light text-[color:var(--color-indigo)]">
              {t("whoFrom")}
            </p>

            <input
              ref={nameRef}
              value={name}
              onChange={(e) => setName(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && void send(true)}
              className={`${box} text-center`}
              placeholder={t("yourName")}
              dir={rtl ? "rtl" : "ltr"}
              aria-label={t("yourName")}
            />

            {error && <Problem>{error}</Problem>}

            <button
              type="button"
              disabled={sending}
              onClick={() => void send(true)}
              className={primary}
            >
              {sending ? t("sending") : t("sendMessage")}
            </button>

            <div className="flex items-center justify-between gap-4">
              <button
                type="button"
                onClick={() => setStep("write")}
                className="cursor-pointer text-[1rem] text-[color:var(--color-ink-soft)] underline underline-offset-4"
              >
                {t("back")}
              </button>
              <button
                type="button"
                disabled={sending}
                onClick={() => void send(false)}
                className="cursor-pointer text-[1rem] text-[color:var(--color-azure-deep)] underline underline-offset-4"
              >
                {t("sendAnonymously")}
              </button>
            </div>
          </motion.div>
        )}

        {step === "sent" && (
          <motion.div
            key="sent"
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex flex-col items-center gap-5 py-6 text-center"
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
              onClick={() => setStep("write")}
              className="mt-1 cursor-pointer text-[1.02rem] font-medium text-[color:var(--color-azure-deep)] underline underline-offset-4"
            >
              {t("sendAnother")}
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

function Problem({ children }: { children: React.ReactNode }) {
  return (
    <p role="alert" className="text-center text-[1.02rem] font-medium text-[#9c3f2c]">
      {children}
    </p>
  );
}
