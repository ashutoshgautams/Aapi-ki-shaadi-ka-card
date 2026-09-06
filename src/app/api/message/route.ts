import { NextResponse } from "next/server";

/**
 * Relays a guest's message to a Google Form.
 *
 * The form is never shown to the guest — they fill in two plain fields here and
 * this route posts them to the form's `formResponse` endpoint server-side, so
 * the form URL and its entry ids stay out of the browser.
 *
 * Configure in .env.local (see .env.example):
 *   GOOGLE_FORM_ACTION_URL   https://docs.google.com/forms/d/e/<id>/formResponse
 *   FORM_ENTRY_NAME          entry.123456789   (optional field)
 *   FORM_ENTRY_MESSAGE       entry.987654321
 */

export const runtime = "nodejs";

export async function POST(req: Request) {
  const action = process.env.GOOGLE_FORM_ACTION_URL;
  const messageEntry = process.env.FORM_ENTRY_MESSAGE;

  if (!action || !messageEntry) {
    return NextResponse.json(
      { ok: false, error: "Messages are not connected yet. Please call the family instead." },
      { status: 503 }
    );
  }

  let body: { name?: string; message?: string };
  try {
    body = (await req.json()) as { name?: string; message?: string };
  } catch {
    return NextResponse.json({ ok: false, error: "Could not read that." }, { status: 400 });
  }

  const message = (body.message ?? "").trim();
  const name = (body.name ?? "").trim();

  if (message.length < 2) {
    return NextResponse.json(
      { ok: false, error: "Please write a message first." },
      { status: 400 }
    );
  }
  if (message.length > 2000) {
    return NextResponse.json(
      { ok: false, error: "That message is a little too long — please trim it a bit." },
      { status: 400 }
    );
  }

  const form = new URLSearchParams();
  form.append(messageEntry, message);

  const nameEntry = process.env.FORM_ENTRY_NAME;
  if (nameEntry) form.append(nameEntry, name || "Anonymous");

  try {
    const res = await fetch(action, {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: form.toString(),
      redirect: "follow",
    });

    if (!res.ok) {
      return NextResponse.json(
        { ok: false, error: "Google could not record that. Please try once more." },
        { status: 502 }
      );
    }
  } catch {
    return NextResponse.json(
      { ok: false, error: "We could not send that. Check your connection and try again." },
      { status: 502 }
    );
  }

  return NextResponse.json({ ok: true });
}
