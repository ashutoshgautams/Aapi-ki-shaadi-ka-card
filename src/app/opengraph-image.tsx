import { readFile } from "node:fs/promises";
import { join } from "node:path";
import { ImageResponse } from "next/og";

/**
 * The card WhatsApp, iMessage and Facebook show when the link is shared.
 *
 * It is generated from the same hero photograph the site opens with, and its
 * wording follows the printed invitation — Gayasuddin Ahmad requesting your
 * presence — so a forwarded link reads like the card itself rather than a URL.
 */
export const runtime = "nodejs";
export const alt =
  "Mr. Gayasuddin Ahmad requests the honour of your presence at the marriage of his granddaughter Dr. Nemat Aafreen to Er. Bakhtiyar Alam";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

/** Google serves TrueType to a plain user agent, which is what Satori needs. */
async function cormorant(weight: 400 | 600): Promise<ArrayBuffer | null> {
  try {
    const css = await fetch(
      `https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@${weight}`,
      { headers: { "User-Agent": "Mozilla/5.0" } }
    ).then((r) => r.text());
    const url = css.match(/src:\s*url\((https:[^)]+)\)/)?.[1];
    if (!url) return null;
    return await fetch(url).then((r) => r.arrayBuffer());
  } catch {
    return null;
  }
}

/**
 * Reads the pre-sized backdrop. It has to be a small file: the image is inlined
 * as a base64 data URL, and Satori silently drops one built from a multi-megabyte
 * photograph. `og-bg.jpg` is hero.jpg cropped to 1200x630 at ~145 KB.
 */
async function background(): Promise<string | null> {
  for (const name of ["og-bg.jpg", "doors.jpg"]) {
    try {
      const buf = await readFile(join(process.cwd(), "public", "images", name));
      return `data:image/jpeg;base64,${buf.toString("base64")}`;
    } catch {
      // try the next one
    }
  }
  return null;
}

export default async function Image() {
  const [regular, semibold, bg] = await Promise.all([
    cormorant(400),
    cormorant(600),
    background(),
  ]);

  const fonts = [
    regular && { name: "Cormorant", data: regular, weight: 400 as const, style: "normal" as const },
    semibold && { name: "Cormorant", data: semibold, weight: 600 as const, style: "normal" as const },
  ].filter(Boolean) as { name: string; data: ArrayBuffer; weight: 400 | 600; style: "normal" }[];

  const serif = fonts.length ? "Cormorant" : "serif";

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          position: "relative",
          backgroundColor: "#EAF3FA",
          // Set as a background rather than an absolutely-positioned <img>:
          // Satori still flex-aligns absolute children, which left the photo
          // pillarboxed with black bars down both sides.
          ...(bg
            ? {
                backgroundImage: `url(${bg})`,
                backgroundSize: "1200px 630px",
                backgroundPosition: "center",
              }
            : {}),
          fontFamily: serif,
        }}
      >

        {/* The words sit on a card with the printed invitation's gold rule,
            rather than straight on the photograph — the courtyard is far too
            busy under the date line to read type over it. */}
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            padding: "52px 80px",
            margin: "0 64px",
            textAlign: "center",
            backgroundColor: "rgba(255,255,255,0.93)",
            border: "1px solid rgba(176,141,76,0.85)",
            outline: "1px solid rgba(176,141,76,0.3)",
            outlineOffset: 7,
            boxShadow: "0 30px 70px rgba(20,48,74,0.28)",
          }}
        >
          <div
            style={{
              display: "flex",
              fontSize: 27,
              color: "#85661F",
              letterSpacing: 5,
              textTransform: "uppercase",
              fontWeight: 600,
            }}
          >
            Mr. Gayasuddin Ahmad
          </div>

          {/* Satori needs an explicit display on any element with more than one
              child, so the two lines are separate flex rows rather than a <br>. */}
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              fontSize: 30,
              color: "#46607A",
              marginTop: 18,
              lineHeight: 1.45,
            }}
          >
            <div style={{ display: "flex" }}>requests the honour of your presence at the</div>
            <div style={{ display: "flex" }}>marriage ceremony of his granddaughter</div>
          </div>

          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 26,
              marginTop: 26,
              color: "#14304A",
              fontWeight: 600,
              fontSize: 78,
            }}
          >
            <span>Nemat</span>
            <span style={{ fontSize: 44, color: "#B08D4C", fontWeight: 400 }}>&</span>
            <span>Bakhtiyar</span>
          </div>

          <div style={{ display: "flex", width: 260, height: 1, background: "#B08D4C", marginTop: 30 }} />

          <div
            style={{
              display: "flex",
              fontSize: 30,
              color: "#17293C",
              marginTop: 26,
              letterSpacing: 2,
            }}
          >
            {"Saturday, 24 October 2026 · Kishan Palace, Patna"}
          </div>
        </div>
      </div>
    ),
    { ...size, fonts }
  );
}
