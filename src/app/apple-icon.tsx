import { ImageResponse } from "next/og";
import { sealMark } from "./icon";

/**
 * The iOS home-screen icon. Same mark as the tab icon, at Apple's size and
 * with a little more breathing room, since iOS rounds the corners itself.
 */
export const runtime = "nodejs";
export const size = { width: 180, height: 180 };
export const contentType = "image/png";

/** How much of the 180px square the medallion fills. */
const MARK = 138;

export default async function AppleIcon() {
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
