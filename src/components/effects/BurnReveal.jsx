import { useLayoutEffect, useRef } from "react";
import { useTimeout } from "../../hooks/useTimeout";
import { useReducedMotion } from "../../hooks/useReducedMotion";

const DURATION = 1800; // ms
const CELL = 4; // CSS pixels per simulated cell; the canvas is scaled up smoothly
const EDGE = 0.07; // width of the glowing burn front
const CHAR = 0.05; // width of the scorched band ahead of it
const SHEET = [26, 4, 6]; // same dark crimson as the welcome page

/**
 * Burn "field": every cell gets a value; it burns when the threshold passes it.
 * Distance from the origin makes the hole spread outward, value noise makes the edge ragged.
 */
function burnField(w, h, ox, oy) {
  const grid = 9;
  const gw = Math.ceil(w / grid) + 2;
  const rnd = Float32Array.from({ length: gw * (Math.ceil(h / grid) + 2) }, Math.random);
  const r = (x, y) => rnd[y * gw + x];
  const smooth = (t) => t * t * (3 - 2 * t);
  const maxD = Math.hypot(Math.max(ox, 1 - ox) * w, Math.max(oy, 1 - oy) * h);
  const field = new Float32Array(w * h);
  for (let y = 0; y < h; y++) {
    for (let x = 0; x < w; x++) {
      const gx = x / grid;
      const gy = y / grid;
      const x0 = Math.floor(gx);
      const y0 = Math.floor(gy);
      const sx = smooth(gx - x0);
      const sy = smooth(gy - y0);
      const top = r(x0, y0) + (r(x0 + 1, y0) - r(x0, y0)) * sx;
      const bottom = r(x0, y0 + 1) + (r(x0 + 1, y0 + 1) - r(x0, y0 + 1)) * sx;
      const noise = top + (bottom - top) * sy;
      const d = Math.hypot(x - ox * w, y - oy * h) / maxD;
      field[y * w + x] = d * 0.7 + noise * 0.3 + Math.random() * 0.04;
    }
  }
  return field;
}

/** Paint one frame for burn threshold `t` into RGBA pixel data. */
function paint(data, field, t) {
  for (let i = 0; i < field.length; i++) {
    const v = field[i];
    const k = i * 4;
    if (v < t - EDGE) {
      data[k + 3] = 0; // burnt away
    } else if (v < t) {
      const a = (v - (t - EDGE)) / EDGE; // 0 = about to vanish, 1 = fresh flame
      data[k] = 255;
      data[k + 1] = 60 + 180 * a * a;
      data[k + 2] = 10 + 110 * a * a * a;
      data[k + 3] = 255 * Math.min(1, a * 1.6);
    } else if (v < t + CHAR) {
      const s = (v - t) / CHAR; // scorched: black → sheet colour
      data[k] = 10 + (SHEET[0] - 10) * s;
      data[k + 1] = 3 + (SHEET[1] - 3) * s;
      data[k + 2] = 2 + (SHEET[2] - 2) * s;
      data[k + 3] = 255;
    } else {
      data[k] = SHEET[0];
      data[k + 1] = SHEET[1];
      data[k + 2] = SHEET[2];
      data[k + 3] = 255;
    }
  }
}

/**
 * Full-screen dark sheet that burns away from the centre, revealing the page
 * underneath. Calls onDone when finished. Reduced motion → a simple fade.
 */
export default function BurnReveal({ onDone }) {
  const canvasRef = useRef(null);
  const reduced = useReducedMotion();
  useTimeout(onDone, reduced ? 900 : DURATION + 80);

  // Layout effect: the first frame is painted before the browser shows the page.
  useLayoutEffect(() => {
    if (reduced) return undefined;
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    const w = Math.ceil(window.innerWidth / CELL);
    const h = Math.ceil(window.innerHeight / CELL);
    canvas.width = w;
    canvas.height = h;
    const field = burnField(w, h, 0.5, 0.45);
    const image = ctx.createImageData(w, h);
    paint(image.data, field, 0);
    ctx.putImageData(image, 0, 0);

    const start = performance.now();
    let frame;
    const tick = (now) => {
      const progress = Math.min(1, (now - start) / DURATION);
      paint(image.data, field, progress * (1.1 + EDGE));
      ctx.putImageData(image, 0, 0);
      if (progress < 1) frame = requestAnimationFrame(tick);
    };
    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, [reduced]);

  if (reduced) {
    return <div aria-hidden="true" className="pointer-events-none fixed inset-0 z-[60] bg-velvet-dark animate-fade-out" />;
  }
  return <canvas ref={canvasRef} aria-hidden="true" className="pointer-events-none fixed inset-0 z-[60] size-full" />;
}
