// Geometry for the winding road on the Story page (pure math, no DOM).

/** Cubic Bézier coordinate for t in [0, 1]. */
function bezier(p0, p1, p2, p3, t) {
  const u = 1 - t;
  return u * u * u * p0 + 3 * u * u * t * p1 + 3 * u * t * t * p2 + t * t * t * p3;
}

/**
 * A road that winds left and right around `cx` while going down from startY to endY.
 * Each bend is a cubic curve whose control points are vertical, so y always
 * increases along the road (which makes "where is the road at height y" easy).
 * Returns { d } for an SVG <path> and `samples` (points along the road, top to bottom).
 */
export function buildRoad({ cx, amplitude, startY, endY, segment }) {
  const bends = Math.max(1, Math.round((endY - startY) / segment));
  const step = (endY - startY) / bends;
  let d = `M ${cx} ${startY}`;
  const samples = [];
  let x0 = cx;
  let y0 = startY;

  for (let i = 0; i < bends; i++) {
    const y1 = startY + step * (i + 1);
    const x1 = i === bends - 1 ? cx : cx + (i % 2 === 0 ? amplitude : -amplitude);
    const c1y = y0 + step / 2;
    const c2y = y1 - step / 2;
    d += ` C ${x0} ${c1y} ${x1} ${c2y} ${x1} ${y1}`;
    for (let k = 0; k < 32; k++) {
      const t = k / 32;
      samples.push({ x: bezier(x0, x0, x1, x1, t), y: bezier(y0, c1y, c2y, y1, t) });
    }
    x0 = x1;
    y0 = y1;
  }
  samples.push({ x: x0, y: y0 });
  return { d, samples };
}

/**
 * The point on the road at height y (clamped to the road's ends), plus `dx`,
 * the road's horizontal direction there (> 0 heading right, < 0 heading left).
 */
export function pointAtY(samples, y) {
  const first = samples[0];
  const last = samples[samples.length - 1];
  if (y <= first.y) return { x: first.x, y: first.y, dx: samples[1].x - first.x };
  if (y >= last.y) return { x: last.x, y: last.y, dx: last.x - samples[samples.length - 2].x };

  let lo = 0;
  let hi = samples.length - 1;
  while (hi - lo > 1) {
    const mid = (lo + hi) >> 1;
    if (samples[mid].y <= y) lo = mid;
    else hi = mid;
  }
  const a = samples[lo];
  const b = samples[hi];
  const t = (y - a.y) / (b.y - a.y || 1);
  return { x: a.x + (b.x - a.x) * t, y, dx: b.x - a.x };
}

/** Deterministic pseudo-random number in [0, 1) for scenery placement. */
export function seeded(i) {
  const s = Math.sin(i * 12.9898 + 78.233) * 43758.5453;
  return s - Math.floor(s);
}

/** Roman numerals for milestones (1–39). */
export function toRoman(n) {
  const tens = ["", "X", "XX", "XXX"];
  const ones = ["", "I", "II", "III", "IV", "V", "VI", "VII", "VIII", "IX"];
  return tens[Math.floor(n / 10)] + ones[n % 10];
}
