"use client";

import { useState } from "react";
import { Ornament, useAsset } from "@/components/Asset";
import { CalendarMark } from "@/components/CalendarMark";
import { Countdown } from "@/components/Countdown";
import { useLang } from "@/components/LangProvider";
import { MessageBox } from "@/components/MessageBox";
import { assets } from "@/lib/assets";
import { hosts, rasms, scripture, venue } from "@/lib/invite";

const mapsHref = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(venue.mapsQuery)}`;
const calendarHref =
  "https://calendar.google.com/calendar/render?action=TEMPLATE" +
  "&text=" + encodeURIComponent("Nikah — Nemat & Bakhtiyar") +
  "&dates=20261024T143000Z/20261024T170000Z" +
  "&location=" + encodeURIComponent("Kishan Palace, Bailey Road, Patna") +
  "&details=" + encodeURIComponent("Nikah & walima dinner.");

/**
 * The invitation itself, set as one long card on a marble ground and framed
 * with the same gold double rule as the printed card.
 */
export function InviteBody() {
  const { t, rtl } = useLang();
  const hasPanel = useAsset(assets.panel);

  return (
    <div className="relative" dir={rtl ? "rtl" : "ltr"}>
      <div className="absolute inset-0 -z-10 overflow-hidden bg-[color:var(--color-sky-1)]">
        {hasPanel && (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={assets.panel}
            alt=""
            className="sticky top-0 h-svh w-full object-cover opacity-70"
          />
        )}
      </div>

      <div className="mx-auto w-full max-w-2xl px-3 py-10 sm:px-6 sm:py-20">
        <div className="invitation-card px-6 py-14 sm:px-14 sm:py-20">
          <Act id="date" title={t("saveTheDate")}>
            <div className="flex flex-col items-center gap-16">
              <CalendarMark />
              <Countdown />
            </div>
          </Act>

          <Divider />

          <Act id="programme" title={t("celebrations")} caption={t("fiveGatherings")}>
            <Programme />
          </Act>

          <Divider />

          <Act id="venue" title={t("whereToFindUs")}>
            <div className="flex flex-col items-center text-center">
              <p className="font-display text-[clamp(2.2rem,9vw,3.2rem)] leading-tight font-light text-[color:var(--color-indigo)]">
                {venue.name}
              </p>
              <span className="hairline my-6 block w-24" />
              {venue.lines.map((l) => (
                <p key={l} className="readable">
                  {l}
                </p>
              ))}
              <div className="mt-9 flex flex-wrap justify-center gap-3">
                <Action href={mapsHref} primary>
                  {t("openInMaps")}
                </Action>
                <Action href={calendarHref}>{t("addToCalendar")}</Action>
              </div>
            </div>
          </Act>

          <Divider />

          <Act id="message" title={t("leaveMessage")} caption={t("messageCaption")}>
            <MessageBox />
          </Act>

          <Divider />

          <Act>
            <div className="flex flex-col items-center text-center">
              <p className="font-arabic text-[clamp(1.25rem,5vw,1.7rem)] leading-[2.2] text-[color:var(--color-indigo)]">
                {scripture.dua}
              </p>
              <p className="font-display mt-6 max-w-md text-base leading-relaxed italic text-[color:var(--color-ink-soft)]">
                &ldquo;{scripture.duaTranslation}&rdquo;
              </p>

              <span className="hairline my-12 block w-48" />

              <p className="eyebrow">
                {t("invitedBy")}
              </p>
              <p className="font-display mt-3 text-3xl font-light text-[color:var(--color-indigo)]">
                {hosts.invitedBy}
              </p>
              {hosts.address.map((l) => (
                <p key={l} className="readable">
                  {l}
                </p>
              ))}

              <p className="readable mt-7">
                <span className="pe-2 opacity-70">{t("questions")}</span>
                {hosts.phones.map((p, i) => (
                  <span key={p.tel}>
                    {i > 0 && <span className="px-2 opacity-40">·</span>}
                    <a
                      href={`tel:${p.tel}`}
                      className="text-[color:var(--color-azure-deep)] hover:underline"
                    >
                      {p.label}
                    </a>
                  </span>
                ))}
              </p>

              <p className="font-display mt-14 max-w-sm text-[1.05rem] leading-relaxed italic text-[color:var(--color-ink-soft)]">
                {scripture.ayah}
                <span className="eyebrow mt-3 block not-italic">
                  {scripture.ayahRef}
                </span>
              </p>
            </div>
          </Act>
        </div>
      </div>
    </div>
  );
}

function Act({
  id,
  title,
  caption,
  children,
}: {
  id?: string;
  title?: string;
  caption?: string;
  children: React.ReactNode;
}) {
  return (
    <section id={id} className="scroll-mt-8 py-6">
      {title && (
        <h2 className="font-display text-center text-[clamp(2.1rem,8.5vw,3rem)] leading-tight font-light text-balance text-[color:var(--color-indigo)]">
          {title}
        </h2>
      )}
      {caption && (
        <p className="readable mx-auto mt-4 max-w-sm text-center">
          {caption}
        </p>
      )}
      <div className={title ? "mt-12" : ""}>{children}</div>
    </section>
  );
}

/** A gold ornament between sections — the supplied one, or a ruled pip. */
function Divider() {
  const hasDivider = useAsset(assets.divider);
  return (
    <div className="flex items-center justify-center gap-4 py-14" aria-hidden="true">
      {hasDivider ? (
        <Ornament src={assets.divider} className="h-8 w-auto max-w-[70%] opacity-90" />
      ) : (
        <>
          <span className="hairline w-20 sm:w-28" />
          <span className="pip" />
          <span className="hairline w-20 sm:w-28" />
        </>
      )}
    </div>
  );
}

function Programme() {
  const { t, lang } = useLang();
  const [open, setOpen] = useState<string | null>("nikah");

  return (
    <ul className="flex flex-col">
      {rasms.map((r, i) => {
        const isOpen = open === r.key;
        const isNikah = r.key === "nikah";
        return (
          <li
            key={r.key}
            className={`border-t border-[color:var(--color-sky-1)] ${
              i === rasms.length - 1 ? "border-b" : ""
            }`}
          >
            <button
              onClick={() => setOpen(isOpen ? null : r.key)}
              aria-expanded={isOpen}
              className="flex w-full cursor-pointer items-baseline gap-4 py-6 text-start"
            >
              <span
                className={`mt-2 h-1.5 w-1.5 shrink-0 rotate-45 ${
                  isNikah ? "bg-[color:var(--color-gold)]" : "bg-[color:var(--color-sky-2)]"
                }`}
              />
              <span className="min-w-0 flex-1">
                <span
                  className={`block leading-snug ${
                    lang === "ur" ? "font-urdu text-lg" : "font-display text-[1.45rem] font-light"
                  } ${isNikah ? "text-[color:var(--color-gold-ink)]" : "text-[color:var(--color-indigo)]"}`}
                >
                  {lang === "ur" ? r.urdu : r.title}
                </span>
                <span className="mt-1.5 block text-[1rem] font-medium text-[color:var(--color-ink-soft)]">
                  {r.date} · {r.time}
                </span>
                {lang === "en" && (
                  <span className="font-urdu mt-0.5 block text-base text-[color:var(--color-azure-deep)] sm:hidden">
                    {r.urdu}
                  </span>
                )}
              </span>
              {lang === "en" && (
                <span className="font-urdu hidden shrink text-base text-[color:var(--color-azure-deep)] sm:block">
                  {r.urdu}
                </span>
              )}
            </button>
            <div
              className="grid transition-[grid-template-rows] duration-300"
              style={{ gridTemplateRows: isOpen ? "1fr" : "0fr" }}
            >
              <div className="overflow-hidden">
                <p className="readable pb-6 ps-6">
                  {r.note}
                  {r.atVenue && (
                    <span className="mt-2 block text-[color:var(--color-azure-deep)]">
                      {t("atVenueLine")}
                    </span>
                  )}
                </p>
              </div>
            </div>
          </li>
        );
      })}
    </ul>
  );
}

function Action({
  href,
  children,
  primary,
}: {
  href: string;
  children: React.ReactNode;
  primary?: boolean;
}) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className={`inline-flex items-center gap-2.5 rounded-sm border px-7 py-4 text-[1.05rem] font-medium transition-colors ${
        primary
          ? "border-[color:var(--color-azure-deep)] bg-[color:var(--color-azure-deep)] text-white hover:bg-[color:var(--color-indigo)]"
          : "border-[color:var(--color-azure-deep)] text-[color:var(--color-azure-deep)] hover:bg-[color:var(--color-mist)]"
      }`}
    >
      {children}
      <svg viewBox="0 0 24 24" className="h-4 w-4 shrink-0" aria-hidden="true">
        <path
          d="M7 17 17 7M9 7h8v8"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    </a>
  );
}
