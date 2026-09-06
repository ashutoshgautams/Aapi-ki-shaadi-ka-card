/**
 * Every image the page can use.
 *
 * Each slot is optional: components check whether the file loaded and fall back
 * to a plain tinted surface, never to drawn ornament. Drop a file in
 * `public/images` with the matching name and it appears — nothing else to wire.
 * `public/images/README.md` carries the generation prompt for each one.
 */
export const assets = {
  /** Closed palace doors, seam dead centre. The opening. */
  doors: "/images/doors.jpg",
  /** What lies beyond the doors — a marble courtyard under sky. */
  hero: "/images/hero.jpg",
  /** A colonnade the couple walk through. */
  corridor: "/images/corridor.jpg",
  /** The bride from behind, cut out. */
  bride: "/images/bride.png",
  /** The groom from behind, cut out. */
  groom: "/images/groom.png",
  /** A gold ornament that separates sections. */
  divider: "/images/divider.png",
  /** An ornate border with an empty middle, framing the calendar. */
  frame: "/images/frame.png",
  /** The brass medallion on the doors. */
  seal: "/images/seal.png",
  /** White marble, used as a section ground. */
  panel: "/images/panel.jpg",
} as const;

export type AssetKey = keyof typeof assets;
