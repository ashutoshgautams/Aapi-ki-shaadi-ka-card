import { readFile } from "node:fs/promises";
import { join } from "node:path";
import { ImageResponse } from "next/og";

/**
 * The browser tab and WhatsApp chat icon.
 *
 * The brass seal from the doors, on the invitation's indigo. Generated rather
 * than shipped as a static .ico so the mark stays in step with the artwork,
 * and drawn on an opaque ground because a transparent icon renders black on
 * an iOS home screen.
 */
export const runtime = "nodejs";
export const size = { width: 256, height: 256 };
export const contentType = "image/png";

/** How much of the 256px square the medallion fills. */
const MARK = 214;

export async function sealMark(): Promise<string | null> {
  // A reduced copy: Satori silently drops a data URL built from the
  // full-resolution seal.
  for (const name of ["seal-mark.png", "seal.png"]) {
    try {
      const buf = await readFile(join(process.cwd(), "public", "images", name));
      return `data:image/png;base64,${buf.toString("base64")}`;
    } catch {
      // try the next one
    }
  }
  return null;
}

export default async function Icon() {
  const seal = await sealMark();

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          backgroundColor: "#14304A",
        }}
      >
        {seal ? (
          // Centred as a flex child rather than a background: Satori ignores
          // background-position, which left the medallion sitting up and left.
          // eslint-disable-next-line @next/next/no-img-element
          <img src={seal} alt="" width={MARK} height={MARK} />
        ) : (
          <div style={{ display: "flex", color: "#DCC188", fontSize: MARK * 0.6, fontFamily: "serif" }}>
            &amp;
          </div>
        )}
      </div>
    ),
    size
  );
}
