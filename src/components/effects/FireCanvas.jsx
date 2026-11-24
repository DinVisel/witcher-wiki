import { useEffect, useRef } from "react";
import { useReducedMotion } from "../../hooks/useReducedMotion";

/** Pre-rendered soft glow sprites, one per flame colour (drawing these is much cheaper than gradients). */
function makeSprites() {
  return ["255,230,150", "255,150,40", "230,70,20", "160,20,10"].map((rgb) => {
    const c = document.createElement("canvas");
    c.width = c.height = 64;
    const g = c.getContext("2d");
    const grad = g.createRadialGradient(32, 32, 0, 32, 32, 32);
    grad.addColorStop(0, `rgba(${rgb},1)`);
    grad.addColorStop(1, `rgba(${rgb},0)`);
    g.fillStyle = grad;
    g.fillRect(0, 0, 64, 64);
    return c;
  });
}

/**
 * A wall of fire along the bottom edge plus embers drifting up, drawn on a
 * <canvas> that fills its parent. `flare` makes the fire roar (used on Enter).
 * The loop and the resize observer are cleaned up on unmount.
 */
export default function FireCanvas({ flare = false }) {
  const canvasRef = useRef(null);
  const flareRef = useRef(flare);
  const reduced = useReducedMotion();

  useEffect(() => {
    flareRef.current = flare;
  }, [flare]);

  useEffect(() => {
    if (reduced) return undefined;
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    const sprites = makeSprites();
    // Fire is soft, so draw at half resolution and let CSS scale it up (much cheaper to fill).
    const dpr = 0.5;
    let w = 0;
    let h = 0;
    const resize = () => {
      const r = canvas.getBoundingClientRect();
      w = r.width;
      h = r.height;
      canvas.width = w * dpr;
      canvas.height = h * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };
    resize();
    const observer = new ResizeObserver(resize);
    observer.observe(canvas);

    const flames = [];
    const embers = [];
    let last = performance.now();
    let frame;

    const tick = (now) => {
      const dt = Math.min(50, now - last) / 16.67;
      last = now;
      const boost = flareRef.current ? 3 : 1;

      for (let i = 0; i < (w / 110) * boost * dt; i++) {
        flames.push({
          x: Math.random() * w,
          y: h + 20,
          vx: (Math.random() - 0.5) * 0.8,
          vy: -(2.2 + Math.random() * 3.2) * (flareRef.current ? 1.8 : 1),
          size: 60 + Math.random() * 90,
          life: 1,
          decay: 0.008 + Math.random() * 0.01,
        });
      }
      if (Math.random() < 0.6 * boost) {
        embers.push({
          x: Math.random() * w,
          y: h,
          vy: -(0.7 + Math.random() * 1.8),
          size: 3 + Math.random() * 5,
          life: 1,
          decay: 0.0025 + Math.random() * 0.004,
          phase: Math.random() * Math.PI * 2,
        });
      }

      ctx.clearRect(0, 0, w, h);
      ctx.globalCompositeOperation = "lighter";

      for (let i = flames.length - 1; i >= 0; i--) {
        const p = flames[i];
        p.x += p.vx * dt;
        p.y += p.vy * dt;
        p.life -= p.decay * dt;
        if (p.life <= 0) {
          flames.splice(i, 1);
          continue;
        }
        const s = p.size * (0.4 + p.life * 0.6);
        const sprite = sprites[p.life > 0.75 ? 0 : p.life > 0.5 ? 1 : p.life > 0.25 ? 2 : 3];
        ctx.globalAlpha = p.life * 0.45;
        ctx.drawImage(sprite, p.x - s / 2, p.y - s / 2, s, s);
      }

      for (let i = embers.length - 1; i >= 0; i--) {
        const e = embers[i];
        e.x += Math.sin(now / 600 + e.phase) * 0.5 * dt;
        e.y += e.vy * dt;
        e.life -= e.decay * dt;
        if (e.life <= 0 || e.y < -10) {
          embers.splice(i, 1);
          continue;
        }
        ctx.globalAlpha = Math.min(1, e.life * 1.4);
        ctx.drawImage(sprites[e.life > 0.5 ? 1 : 2], e.x - e.size / 2, e.y - e.size / 2, e.size, e.size);
      }
      ctx.globalAlpha = 1;
      frame = requestAnimationFrame(tick);
    };
    frame = requestAnimationFrame(tick);

    return () => {
      cancelAnimationFrame(frame);
      observer.disconnect();
    };
  }, [reduced]);

  return (
    <div aria-hidden="true" className="pointer-events-none absolute inset-0">
      {/* static glow so the scene is lit even with reduced motion */}
      <div className="absolute inset-x-0 bottom-0 h-2/5 bg-linear-to-t from-igni/45 via-blood/25 to-transparent" />
      {!reduced && <canvas ref={canvasRef} className="absolute inset-0 size-full" />}
    </div>
  );
}
