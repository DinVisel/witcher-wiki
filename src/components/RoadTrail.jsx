import { useEffect, useMemo, useRef, useState } from "react";
import { buildRoad, pointAtY, seeded, toRoman } from "../utils/road";
import { useMediaQuery } from "../hooks/useMediaQuery";
import { useIsScrolling } from "../hooks/useIsScrolling";
import { useJournal } from "../hooks/useJournal";
import { useSound } from "../hooks/useSound";
import { useTimeout } from "../hooks/useTimeout";
import Roach from "./mascots/Roach";
import Geralt from "./mascots/Geralt";
import Traveller from "./mascots/Traveller";

/**
 * Travellers on the road. `gap` = they stand in the gap above that chapter
 * (so they're never hidden by a book); `at` is the fallback position (0–1).
 */
const TRAVELLERS = [
  { kind: "merchant", gap: 3, at: 0.3, label: "A pedlar on the road", lines: ["“Care for a round of cards,", "witcher? Winner takes all.”"] },
  { kind: "dog", gap: 6, at: 0.56, label: "A stray dog", lines: ["Woof! The dog trots along", "beside Roach for a while."] },
  { kind: "drowner", gap: 9, at: 0.82, label: "Something in a puddle", lines: ["Grrblbl… a drowner! Next", "time, bring a silver sword."] },
];

const BUBBLE_W = 178;
const DUST = ["[animation-delay:0ms]", "[animation-delay:200ms]", "[animation-delay:400ms]"];

/**
 * The winding road on the Story page, drawn in two SVG layers:
 * - behind the chapter books: the dirt road (on md+ it swings across the full
 *   width, disappearing behind the books), trees, grass, a milestone in the gap
 *   above each chapter and a campfire at the end;
 * - in front of the books: the travellers, speech bubbles and Roach with Geralt.
 * While riding, Roach stays at 45% of the screen height and follows the road's
 * curve there; her position is an SVG transform attribute (drawing data), not a CSS style.
 * Roach is alive: she swishes her tail and nods while waiting, rears when Geralt
 * mounts, kicks up dust while galloping and rears with a neigh when patted.
 *
 * Props: stage ("idle" | "jumping" | "riding"), onJump, onDismount,
 * listRef (the <ol> of chapters, used to place milestones and travellers).
 */
export default function RoadTrail({ stage, onJump, onDismount, listRef }) {
  const rootRef = useRef(null);
  const wide = useMediaQuery("(min-width: 48rem)");
  // w/h: road area; gaps: y of the gap above each chapter; below: page height under the area; vh: window height
  const [box, setBox] = useState({ w: 0, h: 0, gaps: [], below: 0, vh: 0 });
  const [anchorY, setAnchorY] = useState(null);
  const [bubble, setBubble] = useState(null);
  const [greeted, setGreeted] = useState([]);
  const [rear, setRear] = useState(0); // pats so far; each one replays the rear-up animation
  const [heart, setHeart] = useState(null);
  const riding = stage === "riding";
  const galloping = useIsScrolling(riding);
  const { unlock } = useJournal();
  const play = useSound(0.6);

  // Measure the road area and the chapter positions (re-measured on resize / image loads).
  useEffect(() => {
    const root = rootRef.current;
    const list = listRef.current;
    if (!root || !list) return undefined;
    const measure = () => {
      const gaps = [...list.children].map((li) => list.offsetTop + li.offsetTop - 24);
      const bottom = root.getBoundingClientRect().bottom + window.scrollY;
      const below = document.documentElement.scrollHeight - bottom;
      setBox({ w: root.clientWidth, h: root.clientHeight, gaps, below, vh: window.innerHeight });
    };
    const observer = new ResizeObserver(measure);
    observer.observe(root);
    observer.observe(list);
    window.addEventListener("resize", measure);
    return () => {
      observer.disconnect();
      window.removeEventListener("resize", measure);
    };
  }, [listRef]);

  const road = useMemo(() => {
    if (!box.w) return null;
    const cx = wide ? box.w / 2 : 32;
    const startY = wide ? 104 : 56;
    // The rider rides at 45% of the screen height, so at the very bottom of the
    // page she can only get this far: end the road there (it has room after the last book).
    const reachable = box.h - 0.55 * box.vh + box.below - 8;
    const endY = Math.max(startY + 200, Math.min(box.h - 40, reachable));
    return {
      cx,
      startY,
      endY,
      width: wide ? 26 : 14,
      // md+: swing almost edge to edge, behind the books; phones: stay in the left gutter
      ...buildRoad({ cx, amplitude: wide ? box.w / 2 - 70 : 12, startY, endY, segment: wide ? 560 : 240 }),
    };
  }, [box.w, box.h, box.vh, box.below, wide]);

  // Track where 45% of the screen height falls on the road (once per animation frame).
  useEffect(() => {
    if (!road) return undefined;
    let frame = 0;
    const update = () => {
      frame = 0;
      const top = rootRef.current?.getBoundingClientRect().top ?? 0;
      setAnchorY(window.innerHeight * 0.45 - top);
    };
    const onScroll = () => {
      if (!frame) frame = requestAnimationFrame(update);
    };
    frame = requestAnimationFrame(update);
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, [road]);

  const riderY = road ? (riding && anchorY != null ? Math.min(Math.max(anchorY, road.startY), road.endY) : road.startY) : 0;
  const reachedEnd = Boolean(road) && riding && riderY >= road.endY - 1;

  useEffect(() => {
    if (reachedEnd) unlock("ride");
  }, [reachedEnd, unlock]);
  useEffect(() => {
    if (greeted.length === TRAVELLERS.length) unlock("travellers");
  }, [greeted, unlock]);
  useTimeout(() => setBubble(null), bubble ? 3500 : null);
  useTimeout(() => setHeart(null), heart ? 1200 : null);

  const greet = (kind) => {
    setBubble(kind);
    setGreeted((g) => (g.includes(kind) ? g : [...g, kind]));
  };
  const pat = () => {
    setRear((r) => r + 1);
    setHeart((h) => (h ?? 0) + 1);
    play("neigh.wav");
  };

  // Where each traveller stands: in a gap between books when the chapters are measured.
  const travellerY = (t) =>
    box.gaps[t.gap] != null && box.gaps[t.gap] > road.startY && box.gaps[t.gap] < road.endY
      ? box.gaps[t.gap]
      : road.startY + t.at * (road.endY - road.startY);

  // Static scenery, rebuilt only when the road changes.
  const scenery = useMemo(() => {
    if (!road) return null;
    const items = [];
    const gap = wide ? 120 : 110;
    for (let y = road.startY + 60, i = 0; y < road.endY - 30; y += gap, i++) {
      const p = pointAtY(road.samples, y + seeded(i) * 40);
      const side = i % 2 === 0 ? 1 : -1;
      const x = p.x + side * (road.width / 2 + (wide ? 16 : 8) + seeded(i + 99) * (wide ? 18 : 4));
      const s = wide ? 1 : 0.6;
      if (x < 6 || x > box.w - 6) continue;
      items.push(
        seeded(i + 7) > 0.45 ? (
          <g key={`t${i}`} transform={`translate(${x} ${p.y}) scale(${s})`}>
            <rect x="-1.5" y="-2" width="3" height="8" className="fill-[#3b2414]" />
            <path d="M0 -26 L9 -8 L4 -8 L11 2 L-11 2 L-4 -8 L-9 -8Z" className="fill-[#1f3a24] stroke-[#12241a]" strokeWidth="1" />
          </g>
        ) : (
          <g key={`g${i}`} transform={`translate(${x} ${p.y}) scale(${s})`} className="stroke-[#4c6b2f]" strokeWidth="1.6" strokeLinecap="round">
            <path d="M-5 2 L-7 -6 M0 2 L0 -9 M5 2 L7 -6" />
          </g>
        ),
      );
    }
    // a milestone in the gap above every chapter (so it's never behind a book)
    box.gaps.forEach((gy, i) => {
      if (gy < road.startY + 40 || gy > road.endY) return;
      const p = pointAtY(road.samples, gy);
      const side = p.x > box.w - 60 ? -1 : 1;
      const x = p.x + side * (road.width / 2 + (wide ? 14 : 4));
      items.push(
        <g key={`m${i}`} transform={`translate(${x} ${gy + 8}) scale(${wide ? 1 : 0.7})`}>
          <rect x="-2" y="-6" width="4" height="16" className="fill-[#3b2414]" />
          <rect x="-13" y="-20" width="26" height="15" rx="2" className="fill-[#7a5434] stroke-gold/70" strokeWidth="1" />
          <text x="0" y="-9" textAnchor="middle" className="fill-parchment font-display text-[9px] font-bold">
            {toRoman(i + 1)}
          </text>
        </g>,
      );
    });
    // the end of the road: a campfire and a sign
    const end = road.samples[road.samples.length - 1];
    items.push(
      <g key="end" transform={`translate(${end.x} ${end.y + 6}) scale(${wide ? 1 : 0.7})`}>
        <ellipse cx="0" cy="10" rx="30" ry="8" className="fill-igni/20" />
        <path d="M-12 10 L12 4 M-12 4 L12 10" className="stroke-[#3b2414]" strokeWidth="4" strokeLinecap="round" />
        <path d="M0 -18 C8 -8 9 0 0 6 C-9 0 -8 -8 0 -18Z" className="fill-igni motion-safe:animate-pulse" />
        <path d="M0 -8 C4 -3 4 1 0 5 C-4 1 -4 -3 0 -8Z" className="fill-quen" />
        <text x="0" y="34" textAnchor="middle" className="fill-parchment/80 font-display text-[10px] tracking-widest">
          THE PATH GOES ON
        </text>
      </g>,
    );
    return items;
  }, [road, box.gaps, box.w, wide]);

  if (!road) return <div ref={rootRef} className="pointer-events-none absolute inset-0" />;

  const rider = pointAtY(road.samples, riderY);
  const facing = rider.dx < -0.05 ? -1 : 1;
  const rw = wide ? 96 : 44;
  const rh = rw * (128 / 124);
  const gw = wide ? 24 : 12;
  const tw = wide ? 30 : 18;

  return (
    <div ref={rootRef} className="pointer-events-none absolute inset-0">
      {/* behind the books: the road and the scenery */}
      <svg width={box.w} height={box.h} className="absolute inset-0 z-0" aria-hidden="true">
        <path d={road.d} className="fill-none stroke-[#24120a]" strokeWidth={road.width + 8} strokeLinecap="round" />
        <path d={road.d} className="fill-none stroke-[#7a5434]" strokeWidth={road.width} strokeLinecap="round" />
        <path d={road.d} className="fill-none stroke-[#a77d53]/70" strokeWidth={wide ? 3 : 2} strokeDasharray="2 12" strokeLinecap="round" />
        {scenery}
      </svg>

      {/* in front of the books: travellers and the rider */}
      <svg width={box.w} height={box.h} className="absolute inset-0 z-20">
        {TRAVELLERS.map((t) => {
          const ty = travellerY(t);
          const p = pointAtY(road.samples, ty);
          const bx = p.x + tw / 2 + 6 + BUBBLE_W > box.w ? p.x - tw / 2 - 6 - BUBBLE_W : p.x + tw / 2 + 6;
          return (
            <g key={t.kind}>
              <g
                role="button"
                tabIndex={0}
                aria-label={`${t.label} — say hello`}
                onClick={() => greet(t.kind)}
                onKeyDown={(e) => {
                  if (e.key === "Enter" || e.key === " ") {
                    e.preventDefault();
                    greet(t.kind);
                  }
                }}
                className="pointer-events-auto cursor-pointer outline-none [&:focus-visible>svg]:drop-shadow-[0_0_6px_rgb(255_201_74)] [&:hover>svg]:drop-shadow-[0_0_6px_rgb(255_201_74)]"
              >
                <Traveller kind={t.kind} x={p.x - tw / 2} y={p.y - tw + 4} width={tw} height={tw} />
              </g>
              {bubble === t.kind && (
                <g className="motion-safe:animate-fade-in" role="status">
                  <rect x={bx} y={p.y - tw - 30} width={BUBBLE_W} height="38" rx="6" className="fill-parchment stroke-gold" strokeWidth="1" />
                  <text x={bx + 8} y={p.y - tw - 15} className="fill-ink font-body text-[10.5px]">
                    {t.lines[0]}
                  </text>
                  <text x={bx + 8} y={p.y - tw - 2} className="fill-ink font-body text-[10.5px]">
                    {t.lines[1]}
                  </text>
                </g>
              )}
            </g>
          );
        })}

        {/* Geralt waits beside Roach, then leaps into the saddle */}
        {!riding && (
          <g transform={`translate(${wide ? rider.x - rw / 2 - gw : rider.x + rw / 2} ${rider.y - gw * 2.05})`}>
            <g className={stage === "jumping" ? "origin-bottom [transform-box:fill-box] motion-safe:animate-jump-on motion-reduce:opacity-0" : ""}>
              <Geralt className="" width={gw} height={gw * 2.1} />
            </g>
          </g>
        )}

        {/* dust kicked up behind the hooves while galloping */}
        {galloping && (
          <g transform={`translate(${rider.x - facing * rw * 0.42} ${rider.y - 2})`} aria-hidden="true">
            {DUST.map((delay, i) => (
              <circle
                key={delay}
                cx={-facing * i * 7}
                cy={-i * 2}
                r={wide ? 6 : 3}
                className={`fill-parchment/40 origin-center [transform-box:fill-box] motion-safe:animate-dust ${delay}`}
              />
            ))}
          </g>
        )}

        {/* Roach (with her rider) on the road; flipped when the road heads left; pat her! */}
        <g transform={`translate(${rider.x} ${rider.y})`}>
          <g transform={facing < 0 ? "scale(-1 1)" : undefined}>
            {/* a new key replays the rear-up: when Geralt mounts and on every pat */}
            <g
              key={`${riding}-${rear}`}
              role="button"
              tabIndex={0}
              aria-label="Pat Roach"
              onClick={pat}
              onKeyDown={(e) => {
                if (e.key === "Enter" || e.key === " ") {
                  e.preventDefault();
                  pat();
                }
              }}
              className={`pointer-events-auto cursor-pointer outline-none origin-bottom-left [transform-box:fill-box] ${rear || riding ? "motion-safe:animate-rear" : ""}`}
            >
              <Roach
                rider={riding}
                galloping={galloping}
                className="drop-shadow-[0_6px_6px_rgb(0_0_0/0.6)]"
                x={-rw / 2}
                y={-rh * 0.93}
                width={rw}
                height={rh}
              />
            </g>
          </g>
          {heart && (
            <text
              key={heart}
              x="0"
              y={-rh * 0.95}
              textAnchor="middle"
              className="fill-[#ff5a6a] text-[18px] motion-safe:animate-float-up"
              aria-hidden="true"
            >
              ♥
            </text>
          )}
        </g>
      </svg>

      {/* call to action under the waiting horse */}
      <div
        className={`pointer-events-auto absolute z-20 flex w-max flex-col gap-1 ${
          wide ? "left-1/2 top-[124px] -translate-x-1/2 items-center" : "left-0 top-[72px] items-start"
        }`}
      >
        {riding ? (
          <>
            <button
              type="button"
              onClick={onDismount}
              className="rounded-sm border border-gold/60 bg-ink/80 px-3 py-1 font-display text-xs tracking-widest text-gold transition hover:bg-gold/15"
            >
              Dismount
            </button>
            <p className="text-xs text-parchment/70">Scroll — Roach follows the road through the story. (You can pat her.)</p>
          </>
        ) : (
          <button
            type="button"
            onClick={onJump}
            disabled={stage === "jumping"}
            className="rounded-sm border-2 border-gold/80 bg-linear-to-b from-velvet to-velvet-dark px-4 py-2 font-display text-sm font-bold tracking-[0.2em] text-parchment shadow-[0_0_24px_rgb(255_106_26/0.35)] transition hover:shadow-[0_0_36px_rgb(255_106_26/0.6)] disabled:opacity-70"
          >
            Jump on Roach
          </button>
        )}
      </div>
    </div>
  );
}
