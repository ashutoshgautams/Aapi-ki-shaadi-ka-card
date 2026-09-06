"use client";

import { createContext, useContext, useEffect, useMemo, useState } from "react";
import { digits, translate, type Key, type Lang } from "@/lib/i18n";

type Ctx = {
  lang: Lang;
  rtl: boolean;
  setLang: (l: Lang) => void;
  t: (k: Key) => string;
  n: (v: string | number) => string;
};

const LangCtx = createContext<Ctx | null>(null);

export function LangProvider({ children }: { children: React.ReactNode }) {
  const [lang, setLang] = useState<Lang>("en");

  useEffect(() => {
    const saved = window.localStorage.getItem("invite-lang");
    if (saved === "ur" || saved === "en") setLang(saved);
  }, []);

  useEffect(() => {
    window.localStorage.setItem("invite-lang", lang);
    document.documentElement.lang = lang === "ur" ? "ur" : "en";
  }, [lang]);

  const value = useMemo<Ctx>(
    () => ({
      lang,
      rtl: lang === "ur",
      setLang,
      t: (k) => translate(k, lang),
      n: (v) => digits(v, lang),
    }),
    [lang]
  );

  return <LangCtx.Provider value={value}>{children}</LangCtx.Provider>;
}

export function useLang() {
  const ctx = useContext(LangCtx);
  if (!ctx) throw new Error("useLang must be used inside <LangProvider>");
  return ctx;
}

/** The language switch. Sits opposite the music control. */
export function LangToggle() {
  const { lang, setLang } = useLang();
  return (
    <button
      onClick={() => setLang(lang === "en" ? "ur" : "en")}
      className="fixed bottom-4 left-4 z-40 cursor-pointer rounded-full border border-[color:var(--color-sky-1)] bg-[color:var(--color-paper)]/90 px-4 py-2.5 backdrop-blur transition-colors hover:border-[color:var(--color-azure)]"
      aria-label={lang === "en" ? "اردو میں دیکھیں" : "Read in English"}
    >
      <span
        className={
          lang === "en"
            ? "font-urdu text-sm leading-none text-[color:var(--color-azure-deep)]"
            : "eyebrow text-[0.6rem] text-[color:var(--color-azure-deep)]"
        }
      >
        {lang === "en" ? "اردو" : "English"}
      </span>
    </button>
  );
}
