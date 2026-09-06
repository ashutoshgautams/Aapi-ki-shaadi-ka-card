/**
 * Procedural Mughal architectural geometry.
 *
 * Everything the mahal is built from — cusped arches, onion domes, chhatris,
 * jaali lattices — is generated here rather than hand-authored, so the whole
 * skyline stays proportionally consistent and can be re-scaled at will.
 *
 * Coordinate convention: arches and domes spring from y = 0 and grow upward
 * (negative y), centred on x = 0. Callers place them with a transform.
 */

type Pt = [number, number];

/**
 * Samples the left half of a two-centred pointed arch, from the left springing
 * point (-w/2, 0) up to the apex (0, -h).
 *
 * A two-centred arch is struck from a centre that sits *past* the middle of the
 * springing line: with half-span `s` and rise `h`, the centre offset `c`
 * satisfies R = c + s and c² + h² = R², giving c = (h² - s²) / 2s. When h > s
 * the arch is pointed; when h = s it degenerates to a semicircle, which is why
 * squat openings still come out correct.
 */
function archSamples(w: number, h: number, n: number): Pt[] {
  const s = w / 2;
  const c = (h * h - s * s) / (2 * s);
  const R = c + s;
  const th0 = Math.PI;
  const th1 = 2 * Math.PI + Math.atan2(-h, -c);
  return Array.from({ length: n + 1 }, (_, i) => {
    const th = th0 + ((th1 - th0) * i) / n;
    return [c + R * Math.cos(th), R * Math.sin(th)] as Pt;
  });
}

/** Bulges each span between samples toward `focus`, carving the cusps. */
function scallop(pts: Pt[], focus: Pt, depth: number): string {
  let d = "";
  for (let i = 1; i < pts.length; i++) {
    const [px, py] = pts[i - 1];
    const [x, y] = pts[i];
    const mx = (px + x) / 2;
    const my = (py + y) / 2;
    const nx = focus[0] - mx;
    const ny = focus[1] - my;
    const len = Math.hypot(nx, ny) || 1;
    const k = Math.hypot(x - px, y - py) * depth;
    d += ` Q ${(mx + (nx / len) * k).toFixed(2)} ${(my + (ny / len) * k).toFixed(2)} ${x.toFixed(2)} ${y.toFixed(2)}`;
  }
  return d;
}

/**
 * A multifoil (cusped) arch — the scalloped opening that defines Mughal
 * facades. `lobes` counts the scallops per side; 5–9 reads well.
 */
export function cuspedArch(w: number, h: number, lobes = 6, depth = 0.4): string {
  const left = archSamples(w, h, lobes);
  const right = [...left].reverse().map(([x, y]) => [-x, y] as Pt);
  const focus: Pt = [0, -h * 0.42];
  return (
    `M ${left[0][0].toFixed(2)} ${left[0][1].toFixed(2)}` +
    scallop(left, focus, depth) +
    scallop(right, focus, depth) +
    " Z"
  );
}

/** A plain pointed arch — used for the recessed iwan behind a cusped one. */
export function pointedArch(w: number, h: number): string {
  const left = archSamples(w, h, 28);
  const right = [...left].reverse().map(([x, y]) => [-x, y] as Pt);
  const line = (pts: Pt[]) =>
    pts
      .slice(1)
      .map(([x, y]) => ` L ${x.toFixed(2)} ${y.toFixed(2)}`)
      .join("");
  return `M ${left[0][0].toFixed(2)} ${left[0][1].toFixed(2)}${line(left)}${line(right)} Z`;
}

/**
 * A bulbous onion dome with its constricted neck and a finial spike —
 * the silhouette that makes a skyline read as Mughal rather than generic.
 */
export function onionDome(w: number, h: number): string {
  const r = w / 2;
  const neck = h * 0.14;
  const bulgeY = -(neck + h * 0.42);
  const topY = -h * 0.93;
  return [
    `M ${-r * 0.62} 0`,
    `C ${-r * 0.66} ${-neck * 0.7} ${-r} ${-neck} ${-r} ${bulgeY}`,
    `C ${-r} ${topY + h * 0.14} ${-r * 0.42} ${topY} 0 ${-h}`,
    `C ${r * 0.42} ${topY} ${r} ${topY + h * 0.14} ${r} ${bulgeY}`,
    `C ${r} ${-neck} ${r * 0.66} ${-neck * 0.7} ${r * 0.62} 0`,
    "Z",
  ]
    .map((s) => s.replace(/(-?\d+\.\d{3,})/g, (m) => (+m).toFixed(2)))
    .join(" ");
}

/** The tapering spire that crowns a dome. */
export function finial(h: number): string {
  const w = h * 0.16;
  return `M 0 0 L ${w} ${-h * 0.2} L ${w * 0.35} ${-h * 0.3} L ${w * 0.5} ${-h * 0.5} L ${w * 0.2} ${-h * 0.62} L ${w * 0.28} ${-h * 0.8} L 0 ${-h} L ${-w * 0.28} ${-h * 0.8} L ${-w * 0.2} ${-h * 0.62} L ${-w * 0.5} ${-h * 0.5} L ${-w * 0.35} ${-h * 0.3} L ${-w} ${-h * 0.2} Z`;
}

/** Merlon cresting — the row of little leaf-shaped teeth along a parapet. */
export function cresting(width: number, count: number, h: number): string {
  const step = width / count;
  let d = `M ${-width / 2} 0`;
  for (let i = 0; i < count; i++) {
    const x0 = -width / 2 + i * step;
    d += ` Q ${(x0 + step * 0.5).toFixed(2)} ${-h} ${(x0 + step).toFixed(2)} 0`;
  }
  return d;
}

export type Jaali = { paths: string[]; size: number };

/**
 * A jaali screen tile: the eight-point star-and-cross lattice carved into
 * Mughal window screens. Returned as tileable path data for a <pattern>.
 */
export function jaaliTile(size = 40): Jaali {
  const c = size / 2;
  const r = size * 0.34;
  const star: string[] = [];
  for (const rot of [0, 45]) {
    const pts: string[] = [];
    for (let i = 0; i < 4; i++) {
      const a = ((i * 90 + rot) * Math.PI) / 180;
      pts.push(`${(c + r * Math.cos(a)).toFixed(2)} ${(c + r * Math.sin(a)).toFixed(2)}`);
    }
    star.push(`M ${pts.join(" L ")} Z`);
  }
  return {
    size,
    paths: [
      ...star,
      `M ${c} 0 L ${c} ${size}`,
      `M 0 ${c} L ${size} ${c}`,
      `M 0 0 L ${size} ${size}`,
      `M ${size} 0 L 0 ${size}`,
    ],
  };
}

/** A single palace block: base + arcade + dome + finial, as layered paths. */
export type MahalBlock = {
  x: number;
  baseW: number;
  baseH: number;
  domeW: number;
  domeH: number;
  arches: number;
  chhatris: boolean;
};

/**
 * Lay out a skyline of palace blocks across `width`, tallest at the centre so
 * the composition frames whatever sits in the middle of the stage.
 */
export function skyline(width: number, blocks: number, maxH: number, seed = 1): MahalBlock[] {
  const rand = mulberry(seed);
  const out: MahalBlock[] = [];
  const step = width / blocks;
  for (let i = 0; i < blocks; i++) {
    const centreness = 1 - Math.abs(i - (blocks - 1) / 2) / ((blocks - 1) / 2 || 1);
    const scale = 0.42 + centreness * 0.58 + (rand() - 0.5) * 0.12;
    const baseW = step * (0.72 + rand() * 0.3);
    out.push({
      x: step * i + step / 2,
      baseW,
      baseH: maxH * scale * 0.62,
      domeW: baseW * (0.44 + rand() * 0.14),
      domeH: maxH * scale * 0.36,
      arches: Math.max(1, Math.round(baseW / (step * 0.3))),
      chhatris: centreness > 0.35 || rand() > 0.55,
    });
  }
  return out;
}

function mulberry(seed: number) {
  let a = seed >>> 0;
  return () => {
    a = (a + 0x6d2b79f5) >>> 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}
