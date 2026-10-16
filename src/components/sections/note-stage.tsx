'use client';

import { useEffect, useRef } from 'react';
import { Smoke } from './smoke';

// Where each note would like to sit, in % of the stage: desktop x, y, then phone x, y.
const SPOTS: [number, number, number, number][] = [
  [4, 11, 3, 8],
  [17, 21, 28, 19],
  [87, 77, 78, 88],
  [74, 10, 78, 9],
  [87, 18, 54, 20],
  [3, 42, 3, 76],
  [77, 39, 80, 21],
  [4, 72, 4, 89],
  [88, 49, 52, 77],
  [18, 77, 28, 88],
  [15, 52, 52, 8],
  [72, 72, 78, 75],
];
// The order they get done in, so the scroll doesn't simply go left to right.
const ORDER = [3, 7, 0, 10, 5, 1, 8, 11, 2, 6, 9, 4];
const COLORS = ['#fbe98f', '#fbe98f', '#f9e27a', '#fdf0b0'];
const PHONE_MAX = 12;

const rand = (i: number) => (((Math.sin(i * 91.7) * 43758.5) % 1) + 1) % 1;
const clamp = (v: number) => Math.max(0, Math.min(1, v));
const ease = (v: number) => v * v * (3 - 2 * v);

type Note = {
  i: number;
  rank: number;
  slot: number;
  hidden: boolean;
  pos: HTMLDivElement;
  el: HTMLDivElement;
  face: HTMLDivElement;
  svg: SVGSVGElement;
  lines: [SVGPathElement, number][];
  fz: { disp: Element; m: Element[]; tint: Element };
  pe: number;
};

function lineRects(el: Element) {
  const range = document.createRange();
  range.selectNodeContents(el);
  const out: { left: number; right: number; top: number; bottom: number }[] = [];
  [...range.getClientRects()]
    .filter((r) => r.width > 2)
    .forEach((r) => {
      const last = out[out.length - 1];
      if (last && Math.abs(last.top - r.top) < 4) {
        last.left = Math.min(last.left, r.left);
        last.right = Math.max(last.right, r.right);
      } else out.push({ left: r.left, right: r.right, top: r.top, bottom: r.bottom });
    });
  return out;
}

// One hand-drawn stroke per line of text, measured on an untransformed copy of the note.
function drawStrokes(n: Note) {
  const fw = n.face.offsetWidth;
  const m = n.face.cloneNode(true) as HTMLDivElement;
  m.style.cssText = `position:fixed;left:-9999px;top:0;width:${fw}px;height:${fw}px`;
  document.body.appendChild(m);
  const b = m.getBoundingClientRect();
  const rects = lineRects(m.querySelector('[data-txt]')!);
  m.remove();
  n.svg.setAttribute('viewBox', `0 0 ${fw} ${fw}`);
  n.svg.innerHTML = rects
    .map((r, j) => {
      const x0 = r.left - b.left - 4,
        x1 = r.right - b.left + 4;
      const y = r.top - b.top + (r.bottom - r.top) * 0.58,
        w = (rand(j + n.rank) - 0.5) * 5;
      return `<path d="M${x0} ${y + w * 0.4} Q${(x0 + x1) / 2} ${y - 3 + w} ${x1} ${y - w * 0.5}"/>`;
    })
    .join('');
  n.lines = [...n.svg.querySelectorAll('path')].map((p) => {
    const L = p.getTotalLength();
    p.style.strokeDasharray = `${L}`;
    p.style.strokeDashoffset = `${L}`;
    return [p, L];
  });
}

/**
 * The hero: sticky notes with boring tasks around the headline. Scrolling
 * crosses each one out in blue and it dissolves into smoke, until only the
 * headline is left. The notes always keep clear of the text.
 */
export default function NoteStage({ notes, children }: { notes: string[]; children: React.ReactNode }) {
  const pinRef = useRef<HTMLElement>(null);
  const stageRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const fxRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const pin = pinRef.current!,
      stage = stageRef.current!,
      content = contentRef.current!,
      fx = fxRef.current!;
    const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
    let phone = matchMedia('(max-width: 760px)').matches;
    const DPR = Math.min(2, devicePixelRatio || 1);
    // Half floats where supported, so hundreds of faint layers of smoke don't band.
    const ctx = (fx.getContext('2d', { colorType: 'float16' } as CanvasRenderingContext2DSettings) ?? fx.getContext('2d'))!;
    const smoke = new Smoke(ctx, DPR, phone ? 800 : 1600);

    const list: Note[] = [...stage.querySelectorAll<HTMLDivElement>('[data-note]')].map((pos) => {
      const i = Number(pos.dataset.note);
      const f = stage.querySelector(`#dz-${i}`)!;
      return {
        i,
        rank: ORDER.indexOf(i),
        slot: 0,
        hidden: true,
        pos,
        el: pos.firstElementChild as HTMLDivElement,
        face: pos.querySelector<HTMLDivElement>('[data-face]')!,
        svg: pos.querySelector('svg')!,
        lines: [],
        fz: { disp: f.querySelector('feDisplacementMap')!, m: [...f.querySelectorAll('feColorMatrix')], tint: f.querySelector('feFlood')! },
        pe: 0,
      };
    });
    let live: Note[] = [];

    // Each note goes to the free spot nearest to where it would like to be. A spot is free if it keeps
    // clear of every line of text, the buttons and the notes already placed. Notes that don't fit stay hidden.
    function place() {
      phone = matchMedia('(max-width: 760px)').matches;
      const W = stage.clientWidth,
        H = stage.clientHeight,
        s = stage.getBoundingClientRect(),
        pad = phone ? 12 : 20;
      const avoid: { l: number; r: number; t: number; b: number }[] = [];
      const add = (r: { left: number; right: number; top: number; bottom: number }) =>
        avoid.push({ l: r.left - s.left - pad, r: r.right - s.left + pad, t: r.top - s.top - pad, b: r.bottom - s.top + pad });
      content.querySelectorAll('[data-avoid=text]').forEach((el) => lineRects(el).forEach(add));
      content.querySelectorAll('[data-avoid=box] a').forEach((el) => add(el.getBoundingClientRect()));

      const NAV = phone ? 66 : 76,
        w = list[0].pos.offsetWidth,
        gap = phone ? 10 : 16,
        edge = phone ? 8 : 16,
        step = 6;
      const spots: { x: number; y: number }[] = [];
      for (let y = NAV; y + w <= H - edge; y += step)
        for (let x = edge; x + w <= W - edge; x += step)
          if (!avoid.some((b) => x < b.r && x + w > b.l && y < b.b && y + w > b.t)) spots.push({ x, y });

      const taken: { x: number; y: number }[] = [];
      list.forEach((n) => (n.hidden = true));
      list.forEach((n, k) => {
        if (phone && k >= PHONE_MAX) return;
        const [dx, dy, mx, my] = SPOTS[n.i];
        const wx = ((phone ? mx : dx) / 100) * W,
          wy = ((phone ? my : dy) / 100) * H;
        let best: { x: number; y: number } | null = null,
          bd = Infinity;
        for (const f of spots) {
          const d = (f.x - wx) ** 2 + (f.y - wy) ** 2;
          if (d < bd && !taken.some((t) => Math.abs(t.x - f.x) < w + gap && Math.abs(t.y - f.y) < w + gap)) {
            bd = d;
            best = f;
          }
        }
        if (!best) return;
        taken.push(best);
        n.hidden = false;
        n.pos.style.left = `${best.x}px`;
        n.pos.style.top = `${best.y}px`;
      });
      list.forEach((n) => (n.pos.style.display = n.hidden ? 'none' : ''));
      live = list.filter((n) => !n.hidden).sort((a, b) => a.rank - b.rank);
      live.forEach((n, k) => (n.slot = k));
      stage.dataset.placed = '';
    }

    function size() {
      fx.width = innerWidth * DPR;
      fx.height = innerHeight * DPR;
    }

    let raf = 0,
      prevT = 0,
      onScreen = true,
      started = false;
    const WIN = 0.26;

    function frame(now: number) {
      const dt = prevT ? Math.min(0.05, (now - prevT) / 1000) : 0;
      prevT = now;
      const r = pin.getBoundingClientRect(),
        st = stage.getBoundingClientRect();
      const p = clamp(-r.top / (r.height - innerHeight));
      ctx.clearRect(0, 0, fx.width, fx.height);

      live.forEach((n) => {
        const start = 0.03 + (n.slot / live.length) * (0.9 - WIN);
        const k = clamp((p - start) / WIN);
        // 1) crossed out, one line after the other
        const s = clamp(k / 0.38);
        n.lines.forEach(([path, L], j) => (path.style.strokeDashoffset = `${L * (1 - clamp(s * n.lines.length - j))}`));
        // 2) noise eats the paper away while smoke rises off it
        const e = clamp((k - 0.46) / 0.54),
          f = ease(e),
          c = 1 - 4.6 * f;
        const on = e > 0 && e < 1;
        n.el.style.filter = on ? `url(#dz-${n.i})` : 'none';
        if (on) {
          n.fz.disp.setAttribute('scale', (Math.pow(e, 1.3) * 34).toFixed(1));
          n.fz.m[0].setAttribute('values', `0 0 0 0 0  0 0 0 0 0  0 0 0 0 0  5 0 0 0 ${c.toFixed(3)}`);
          n.fz.m[1].setAttribute('values', `0 0 0 0 0  0 0 0 0 0  0 0 0 0 0  5 0 0 0 ${(c + 0.35).toFixed(3)}`);
          n.fz.tint.setAttribute('flood-opacity', (f * 0.3).toFixed(2));
        }
        if (e > n.pe && e < 1) {
          const w = n.pos.offsetWidth;
          smoke.emit(n.pos.offsetLeft, n.pos.offsetTop - f * 14, w, Math.round((e - n.pe) * (phone ? 170 : 260) + Math.random() * 0.6));
        }
        n.pe = e;
        n.el.style.transform = `translateY(${-f * 14}px)`;
        n.el.style.opacity = e >= 1 ? '0' : '1';
      });
      smoke.step(dt, st.left, st.top);

      if (onScreen || smoke.alive) raf = requestAnimationFrame(frame);
      else {
        raf = 0;
        ctx.clearRect(0, 0, fx.width, fx.height);
      }
    }
    const run = () => {
      if (!raf && started && !reduce) {
        prevT = 0;
        raf = requestAnimationFrame(frame);
      }
    };

    const io = new IntersectionObserver(([e]) => {
      onScreen = e.isIntersecting;
      if (onScreen) run();
    });
    io.observe(pin);

    let resizeT = 0;
    const onResize = () => {
      size();
      clearTimeout(resizeT);
      resizeT = window.setTimeout(() => {
        place();
        list.forEach(drawStrokes);
      }, 120);
    };

    let alive = true;
    document.fonts.ready.then(() => {
      if (!alive) return;
      size();
      place();
      list.forEach(drawStrokes);
      started = true;
      run();
      // The smoke textures take a moment to build, so do it before the first note needs them.
      setTimeout(() => alive && smoke.prepare(), 400);
    });
    addEventListener('resize', onResize);

    return () => {
      alive = false;
      cancelAnimationFrame(raf);
      io.disconnect();
      removeEventListener('resize', onResize);
      clearTimeout(resizeT);
    };
  }, []);

  return (
    <section ref={pinRef} className="relative h-[320vh] motion-reduce:h-svh" aria-label="Intro">
      <div ref={stageRef} className="note-stage sticky top-0 h-svh overflow-hidden">
        <div className="absolute inset-0 grid place-items-center px-5 text-center">
          <div ref={contentRef} className="max-w-[880px]">
            {children}
          </div>
        </div>
        {notes.map((text, i) => (
          <div
            key={i}
            data-note={i}
            aria-hidden
            className="note-pos"
            style={{ ['--r0' as string]: `${(rand(i) - 0.5) * 12}deg`, animationDelay: `${i * 70}ms` }}
          >
            <div className="note">
              <div data-face className="note-face" style={{ background: COLORS[i % 4], rotate: `${(rand(i) - 0.5) * 12}deg` }}>
                <div className="note-band" />
                <svg />
                <span data-txt className="relative">
                  {text}
                </span>
              </div>
            </div>
          </div>
        ))}
        <svg width="0" height="0" className="absolute" aria-hidden>
          {notes.map((_, i) => (
            <filter key={i} id={`dz-${i}`} x="-30%" y="-30%" width="160%" height="160%" colorInterpolationFilters="sRGB">
              <feTurbulence type="fractalNoise" baseFrequency="0.028" numOctaves={3} seed={i + 2} result="n" />
              <feDisplacementMap in="SourceGraphic" in2="n" scale="0" xChannelSelector="R" yChannelSelector="G" result="d" />
              <feColorMatrix in="n" type="matrix" values="0 0 0 0 0  0 0 0 0 0  0 0 0 0 0  5 0 0 0 1" result="m" />
              <feColorMatrix in="n" type="matrix" values="0 0 0 0 0  0 0 0 0 0  0 0 0 0 0  5 0 0 0 1" result="m2" />
              <feFlood floodColor="#8da0ff" floodOpacity="0" result="t" />
              <feComposite in="t" in2="d" operator="in" result="td" />
              <feMerge result="body">
                <feMergeNode in="d" />
                <feMergeNode in="td" />
              </feMerge>
              <feComposite in="body" in2="m" operator="in" result="main" />
              <feFlood floodColor="#3f5cff" result="rc" />
              <feComposite in="rc" in2="d" operator="in" result="rd" />
              <feComposite in="rd" in2="m2" operator="in" result="rim" />
              <feGaussianBlur in="rim" stdDeviation="1.4" result="rb" />
              <feMerge>
                <feMergeNode in="rb" />
                <feMergeNode in="main" />
              </feMerge>
            </filter>
          ))}
        </svg>
      </div>
      {/* Above everything, nav included, so the smoke is never cut off. */}
      <canvas ref={fxRef} aria-hidden className="pointer-events-none fixed inset-0 z-[60] h-full w-full" />
    </section>
  );
}
