"use client";

import { useState } from "react";
import { Countdown } from "@/components/Countdown";
import { Rsvp } from "@/components/Rsvp";
import { JaaliBand } from "@/components/art/Mahal";
import { hosts, rasms, scripture, venue } from "@/lib/invite";

const mapsHref = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(venue.mapsQuery)}`;
const calendarHref =
  "https://calendar.google.com/calendar/render?action=TEMPLATE" +
  "&text=" + encodeURIComponent("Nikah — Nemat & Bakhtiyar") +
  "&dates=20261024T143000Z/20261024T170000Z" +
  "&location=" + encodeURIComponent("Kishan Palace, Bailey Road, Patna") +
  "&details=" + encodeURIComponent("Nikah & walima dinner.");

export function InviteBody() {
  return (
    <div className="relative bg-[color:var(--color-marble)]">
      <Act>
        <Countdown />
      </Act>

      <Divider />

      <Act title="The celebrations" caption="Five gatherings across four days.">
        <Programme />
      </Act>

      <Divider />

      <Act title="Where to find us">
        <div className="flex flex-col items-center text-center">
          <p className="font-display text-[clamp(1.9rem,7vw,2.6rem)] font-medium text-[color:var(--color-indigo)]">
            {venue.name}
          </p>
          {venue.lines.map((l) => (
            <p key={l} className="text-sm text-[color:var(--color-ink-soft)]">
              {l}
            </p>
          ))}
          <div className="mt-8 flex flex-wrap justify-center gap-3">
            <Action href={mapsHref} primary>
              Open in Maps
            </Action>
            <Action href={calendarHref}>Add the Nikah to calendar</Action>
          </div>
        </div>
      </Act>

      <Divider />

      <Act
        title="Will you join us?"
        caption="Fill this in here — it goes straight to the family's list. Nothing else to open."
      >
        <Rsvp />
      </Act>

      <Divider />

      <Act>
        <div className="flex flex-col items-center text-center">
          <p className="font-arabic text-[clamp(1.15rem,4.4vw,1.55rem)] leading-loose text-[color:var(--color-indigo)]">
            {scripture.dua}
          </p>
          <p className="mt-5 max-w-md text-sm italic text-[color:var(--color-ink-soft)]">
            &ldquo;{scripture.duaTranslation}&rdquo;
          </p>

          <div className="hairline my-10 w-48" />

          <p className="eyebrow text-[0.58rem] text-[color:var(--color-ink-soft)]">Invited by</p>
          <p className="font-display mt-2 text-2xl font-medium text-[color:var(--color-indigo)]">
            {hosts.invitedBy}
          </p>
          {hosts.address.map((l) => (
            <p key={l} className="text-sm text-[color:var(--color-ink-soft)]">
              {l}
            </p>
          ))}

          <p className="mt-6 text-sm text-[color:var(--color-ink-soft)]">
            {hosts.phones.map((p, i) => (
              <span key={p.tel}>
                {i > 0 && <span className="px-2 opacity-40">·</span>}
                <a href={`tel:${p.tel}`} className="text-[color:var(--color-azure-deep)] hover:underline">
                  {p.label}
                </a>
              </span>
            ))}
          </p>

          <p className="mt-12 max-w-sm text-xs leading-relaxed text-[color:var(--color-ink-soft)]">
            {scripture.ayah}
            <span className="mt-1 block opacity-70">— {scripture.ayahRef}</span>
          </p>
        </div>
      </Act>
    </div>
  );
}

function Act({
  title,
  caption,
  children,
}: {
  title?: string;
  caption?: string;
  children: React.ReactNode;
}) {
  return (
    <section className="mx-auto w-full max-w-2xl px-6 py-20 sm:py-28">
      {title && (
        <h2 className="font-display text-center text-[clamp(1.9rem,7vw,2.6rem)] leading-tight font-medium text-balance text-[color:var(--color-indigo)]">
          {title}
        </h2>
      )}
      {caption && (
        <p className="mx-auto mt-3 max-w-sm text-center text-sm text-[color:var(--color-ink-soft)]">
          {caption}
        </p>
      )}
      <div className={title ? "mt-12" : ""}>{children}</div>
    </section>
  );
}

function Divider() {
  return (
    <div className="mx-auto flex w-full max-w-2xl items-center gap-5 px-6" aria-hidden="true">
      <span className="hairline flex-1" />
      <JaaliBand className="h-6 w-24 opacity-70" />
      <span className="hairline flex-1" />
    </div>
  );
}

function Programme() {
  const [open, setOpen] = useState<string | null>("nikah");

  return (
    <ul className="flex flex-col">
      {rasms.map((r, i) => {
        const isOpen = open === r.key;
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
              className="flex w-full cursor-pointer items-baseline gap-4 py-5 text-left"
            >
              <span
                className={`mt-1 h-2 w-2 shrink-0 rotate-45 transition-colors ${
                  r.key === "nikah"
                    ? "bg-[color:var(--color-gold)]"
                    : "bg-[color:var(--color-sky-2)]"
                }`}
              />
              <span className="flex-1">
                <span className="font-display block text-xl leading-snug font-medium text-[color:var(--color-indigo)]">
                  {r.title}
                </span>
                <span className="mt-0.5 block text-xs tracking-wide text-[color:var(--color-ink-soft)]">
                  {r.date} · {r.time}
                </span>
              </span>
              <span className="font-urdu shrink-0 text-sm text-[color:var(--color-azure-deep)]">
                {r.urdu}
              </span>
            </button>
            <div
              className="grid transition-[grid-template-rows] duration-300"
              style={{ gridTemplateRows: isOpen ? "1fr" : "0fr" }}
            >
              <div className="overflow-hidden">
                <p className="pb-5 pl-6 text-sm leading-relaxed text-[color:var(--color-ink-soft)]">
                  {r.note}
                  {r.atVenue && (
                    <span className="mt-1 block text-[color:var(--color-azure-deep)]">
                      At {venue.name}, Bailey Road, Patna.
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
      className={`eyebrow border px-6 py-3 text-[0.6rem] transition-colors ${
        primary
          ? "border-[color:var(--color-azure-deep)] bg-[color:var(--color-azure-deep)] text-white hover:bg-[color:var(--color-indigo)]"
          : "border-[color:var(--color-sky-2)] text-[color:var(--color-azure-deep)] hover:border-[color:var(--color-azure-deep)]"
      }`}
    >
      {children}
    </a>
  );
}
