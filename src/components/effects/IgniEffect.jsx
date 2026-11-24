import { useEffect, useRef } from "react";
import { useTimeout } from "../../hooks/useTimeout";
import { useReducedMotion } from "../../hooks/useReducedMotion";

const DURATION = 1200;
const EMIT_FOR = 450;

/** Create one fire particle at the bottom centre of the canvas. */
function spawn(w, h) {
  const angle = -Math.PI / 2 + (Math.random() - 0.5) * 1.3;
  const speed = 2 + Math.random() * 5;
  return {
    x: w / 2 + (Math.random() - 0.5) * w * 0.15,
    y: h * 0.8,
    vx: Math.cos(angle) * speed,
    vy: Math.sin(angle) * speed,
    size: 6 + Math.random() * 12,
    life: 1,
    decay: 0.012 + Math.random() * 0.02,
  };
}

/**
 * Igni: a burst of fire particles drawn on a <canvas>, plus an orange flash.
 * The animation loop and timers are cleaned up on unmount.
 */
export default function IgniEffect({ onDone }) {
  const canvasRef = useRef(null);
  const reduced = useReducedMotion();
  useTimeout(onDone, DURATION);

  useEffect(() => {
    if (reduced) return undefined;
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    const dpr = window.devicePixelRatio || 1;
    const { width, height } = canvas.getBoundingClientRect();
    canvas.width = width * dpr;
    canvas.height = height * dpr;
    ctx.scale(dpr, dpr);

    const particles = [];
    const start = performance.now();
    let frame;

    const tick = (now) => {
      const elapsed = now - start;
      if (elapsed < EMIT_FOR) for (let i = 0; i < 9; i++) particles.push(spawn(width, height));

      ctx.clearRect(0, 0, width, height);
      ctx.globalCompositeOperation = "lighter";
      for (let i = particles.length - 1; i >= 0; i--) {
        const p = particles[i];
        p.vy -= 0.08; // flames rise
        p.vx *= 0.98;
        p.x += p.vx;
        p.y += p.vy;
        p.life -= p.decay;
        if (p.life <= 0) {
          particles.splice(i, 1);
          continue;
        }
        const hue = 10 + p.life * 40; // yellow → orange → red
        const r = p.size * p.life;
        const g = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, r);
        g.addColorStop(0, `hsla(${hue + 10}, 100%, 70%, ${p.life})`);
        g.addColorStop(1, `hsla(${hue - 10}, 100%, 45%, 0)`);
        ctx.fillStyle = g;
        ctx.beginPath();
        ctx.arc(p.x, p.y, r, 0, Math.PI * 2);
        ctx.fill();
      }
      if (elapsed < DURATION) frame = requestAnimationFrame(tick);
    };
    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, [reduced]);

  return (
    <>
      <div className="absolute inset-0 bg-igni/25 animate-flash" />
      {!reduced && <canvas ref={canvasRef} className="absolute inset-0 size-full" />}
    </>
  );
}
