import { NextResponse } from "next/server";

/**
 * Relays an RSVP to a Google Form.
 *
 * The form is never shown to the visitor — they fill in our own fields and this
 * route posts them to the form's `formResponse` endpoint server-side, so the
 * form URL and its entry ids stay out of the browser.
 *
 * Configure in .env.local (see .env.example):
 *   GOOGLE_FORM_ACTION_URL   https://docs.google.com/forms/d/e/<id>/formResponse
 *   RSVP_ENTRY_NAME          entry.123456789
 *   ...one entry id per field
 */

export const runtime = "nodejs";

type Payload = {
  name?: string;
  phone?: string;
  attending?: string;
  guests?: string;
  events?: string[];
  message?: string;
};

const FIELD_ENV: Record<keyof Omit<Payload, "events">, string> = {
  name: "RSVP_ENTRY_NAME",
  phone: "RSVP_ENTRY_PHONE",
  attending: "RSVP_ENTRY_ATTENDING",
  guests: "RSVP_ENTRY_GUESTS",
  message: "RSVP_ENTRY_MESSAGE",
};

export async function POST(req: Request) {
  const action = process.env.GOOGLE_FORM_ACTION_URL;
  if (!action) {
    return NextResponse.json(
      { ok: false, error: "The RSVP form is not connected yet. Please call the family instead." },
      { status: 503 }
    );
  }

  let body: Payload;
  try {
    body = (await req.json()) as Payload;
  } catch {
    return NextResponse.json({ ok: false, error: "Could not read that." }, { status: 400 });
  }

  const name = (body.name ?? "").trim();
  if (name.length < 2) {
    return NextResponse.json({ ok: false, error: "Please tell us your name." }, { status: 400 });
  }
  if ((body.message ?? "").length > 2000) {
    return NextResponse.json(
      { ok: false, error: "That message is a little too long — please trim it a bit." },
      { status: 400 }
    );
  }

  const form = new URLSearchParams();
  for (const [field, envKey] of Object.entries(FIELD_ENV) as [
    keyof Omit<Payload, "events">,
    string,
  ][]) {
    const entry = process.env[envKey];
    const value = body[field];
    if (entry && value) form.append(entry, String(value).slice(0, 2000));
  }

  const eventsEntry = process.env.RSVP_ENTRY_EVENTS;
  if (eventsEntry && body.events?.length) {
    // Google Forms takes one repeated key per checkbox selection.
    for (const e of body.events.slice(0, 10)) form.append(eventsEntry, e);
  }

  try {
    const res = await fetch(action, {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: form.toString(),
      // Google answers with a redirect to the confirmation page.
      redirect: "follow",
    });

    if (!res.ok && res.status !== 0) {
      return NextResponse.json(
        { ok: false, error: "Google could not record that. Please try once more." },
        { status: 502 }
      );
    }
  } catch {
    return NextResponse.json(
      { ok: false, error: "We could not reach the guest list. Check your connection and retry." },
      { status: 502 }
    );
  }

  return NextResponse.json({ ok: true });
}
