'use client';

import { useRef } from 'react';
import { motion, useTransform, type MotionValue } from 'motion/react';
import type { Dict } from '@/content';
import { seg, useStep, useViewProgress } from '@/lib/motion';
import { cn } from '@/lib/utils';

/**
 * The planner is measured in hour units: 08–16 on top, then a gap, then the night band.
 * Everything is placed in percent of the board, so it scales with the screen.
 */
const DAY = 8;
const NIGHT_TOP = 8.5;
const NIGHT_H = 2.6;
const TOTAL = NIGHT_TOP + NIGHT_H;
const pct = (u: number) => `${(u / TOTAL) * 100}%`;
const col = (d: number) => `calc(${d * 20}% + 2px)`;
const COL_W = 'calc(20% - 4px)';

// [day, start hour, hours, chore label]. Each one ends up in the night band.
const CHORES = [
  [0, 8, 2, 0],
  [1, 9, 2, 2],
  [2, 8, 1, 3],
  [3, 9, 2, 5],
  [4, 8, 1, 3],
  [0, 13, 1, 1],
  [1, 14, 1, 3],
  [2, 13, 3, 4],
  [3, 14, 1, 3],
  [4, 10, 2, 6],
] as const;
const HOURS = CHORES.reduce((n, c) => n + c[2], 0);
// [day, start hour, hours, label]. Work only a person can do, which stays.
const KEEP = [
  [0, 14, 2, 0],
  [2, 10, 2, 1],
  [4, 13, 2, 0],
] as const;
// When each annotation number appears.
const MARKS = [0.4, 0.5, 0.6, 0.7, 0.8, 0.86];

const smooth = (x: number) => x * x * (3 - 2 * x);

function Mark({ n, on, className, style }: { n: number; on: boolean; className?: string; style?: React.CSSProperties }) {
  return (
    <span
      aria-hidden
      style={style}
      className={cn(
        'absolute z-20 grid size-[18px] place-items-center rounded-full bg-ink text-[10.5px] font-semibold text-paper shadow-[0_0_0_2.5px_var(--color-card)] transition-[scale,opacity] duration-500 ease-out-expo md:size-5 md:text-[11px]',
        on ? 'scale-100 opacity-100' : 'scale-50 opacity-0',
        className,
      )}
    >
      {n}
    </span>
  );
}

/** A chore: crossed out, then it slides down into the night band and turns blue. */
function Chore({ p, i, label }: { p: MotionValue<number>; i: number; label: string }) {
  const [d, start, h] = CHORES[i];
  // Its place in the night band: one row per chore of that day.
  const k = CHORES.slice(0, i).filter((c) => c[0] === d).length;
  const strike = useTransform(p, (v) => seg(v, 0.08 + i * 0.02, 0.16 + i * 0.02));
  const move = useTransform(p, (v) => smooth(seg(v, 0.3 + i * 0.025, 0.42 + i * 0.025)));
  const top = useTransform(move, (m) => pct(start - 8 + (NIGHT_TOP + 0.2 + k * 1.12 - (start - 8)) * m));
  const height = useTransform(move, (m) => pct(h - 0.12 + (1 - (h - 0.12)) * m));
  const bg = useTransform(move, [0, 1], ['#ebe8e1', '#1f3bff']);
  const fg = useTransform(move, [0, 1], ['#333333', '#ffffff']);
  const lineOpacity = useTransform(move, [0, 0.4], [1, 0]);
  const check = useTransform(move, [0.7, 1], [0, 1]);

  return (
    <motion.div
      className="absolute z-10 overflow-hidden rounded-[7px] px-1.5 py-[3px] text-[10.5px] leading-[1.15] md:px-2 md:text-[12px]"
      style={{ left: col(d), width: COL_W, top, height, backgroundColor: bg, color: fg }}
    >
      <span className="line-clamp-2 md:pr-2.5">{label}</span>
      <motion.svg
        viewBox="0 0 100 10"
        preserveAspectRatio="none"
        className="absolute inset-x-1 top-[0.55em] h-[0.9em] w-[calc(100%-8px)]"
        style={{ opacity: lineOpacity }}
        aria-hidden
      >
        <motion.path
          d="M2 6 Q 50 2 98 5"
          fill="none"
          stroke="#1f3bff"
          strokeWidth="2.4"
          strokeLinecap="round"
          vectorEffect="non-scaling-stroke"
          style={{ pathLength: strike }}
        />
      </motion.svg>
      <motion.svg
        viewBox="0 0 12 12"
        className="absolute top-1/2 right-1.5 hidden size-2.5 -translate-y-1/2 md:block"
        style={{ opacity: check }}
        aria-hidden
      >
        <path d="m2.5 6.3 2.3 2.3 4.7-5" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
      </motion.svg>
    </motion.div>
  );
}

/** The time a chore leaves behind, written in by hand. */
function Free({ p, i, label }: { p: MotionValue<number>; i: number; label: string }) {
  const [d, start, h] = CHORES[i];
  const t = useTransform(p, (v) => smooth(seg(v, 0.5 + i * 0.025, 0.58 + i * 0.025)));
  const scale = useTransform(t, [0, 1], [0.85, 1]);
  return (
    <motion.div
      className="absolute grid place-items-center rounded-[7px] bg-[#e4eee6] px-1 text-center font-[family-name:var(--font-hand)] text-[15px] leading-[0.95] font-semibold text-[#2f5a45] md:text-[19px]"
      style={{ left: col(d), width: COL_W, top: pct(start - 8), height: pct(h - 0.12), opacity: t, scale }}
    >
      {label}
    </motion.div>
  );
}

/** Why automate: a week in a planner where the chores move to the night and free time takes their place. */
export default function Benefits({ t }: { t: Dict['benefits'] }) {
  const ref = useRef<HTMLDivElement>(null);
  const p = useViewProgress(ref, ['start 0.9', 'end 0.9']);
  const lit = useStep(p, MARKS);
  const hours = useTransform(p, (v) => `+${Math.round(HOURS * seg(v, 0.3, 0.645))} h`);

  return (
    <section id="benefits" className="wrap scroll-mt-20 pt-16 md:pt-24">
      <p className="font-mono text-[13px] text-muted">{t.label}</p>
      <h2 className="mt-3 text-[clamp(32px,4.2vw,62px)] leading-[1.02] font-semibold tracking-[-0.03em]">{t.title}</h2>

      <div className="mt-8 grid items-center gap-10 md:mt-12 lg:grid-cols-[1.35fr_.65fr] lg:gap-14">
        <div ref={ref} id="week" className="rounded-[22px] border border-hair bg-card p-3.5 shadow-[0_30px_60px_-45px_#00000040] md:p-5">
          <div className="relative flex items-end justify-between px-1 pb-3 md:pb-4">
            <p className="text-[15px] font-semibold tracking-[-0.01em] md:text-[17px]">{t.week}</p>
            <p className="relative text-right leading-none">
              <Mark n={1} on={lit >= 1} className="top-1 -left-6" />
              <motion.b className="block text-[30px] font-semibold tracking-[-0.04em] text-bot tabular-nums md:text-[40px]">
                {hours}
              </motion.b>
              <span className="mt-1 block text-[12px] text-muted md:text-[13px]">{t.perWeek}</span>
            </p>
          </div>

          <div className="grid grid-cols-[26px_1fr] md:grid-cols-[34px_1fr]">
            <div />
            <div className="grid grid-cols-5 pb-1.5 text-[11px] text-muted md:text-[12.5px]">
              {t.days.map((d) => (
                <span key={d} className="px-1.5 md:px-2">
                  {d}
                </span>
              ))}
            </div>

            {/* Hours, and the moon for the night band. */}
            <div className="relative text-[10px] text-faint md:text-[11px]">
              {[8, 10, 12, 14].map((hr) => (
                <span key={hr} className="absolute -translate-y-1/2" style={{ top: pct(hr - 8) }}>
                  {String(hr).padStart(2, '0')}
                </span>
              ))}
              <span
                className="absolute grid -translate-y-1/2 justify-items-start gap-0.5 text-muted"
                style={{ top: pct(NIGHT_TOP + NIGHT_H / 2) }}
              >
                <svg
                  viewBox="0 0 24 24"
                  className="size-4 md:size-[18px]"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.8"
                  strokeLinejoin="round"
                  aria-hidden
                >
                  <path d="M19 14.6A7.5 7.5 0 0 1 9.4 5a7.5 7.5 0 1 0 9.6 9.6Z" />
                </svg>
                <span className="text-[9.5px] md:text-[10.5px]">{t.night}</span>
              </span>
              <Mark n={2} on={lit >= 2} className="left-3 -translate-y-full md:left-4" style={{ top: pct(NIGHT_TOP + 0.3) }} />
            </div>

            <div className="relative h-[350px] sm:h-[380px] md:h-[420px]">
              {/* Hour lines and day columns. */}
              {Array.from({ length: DAY + 1 }, (_, hr) => (
                <span key={hr} className="absolute inset-x-0 border-t border-dashed border-hair" style={{ top: pct(hr) }} />
              ))}
              {[1, 2, 3, 4].map((d) => (
                <span key={d} className="absolute w-px bg-hair" style={{ left: `${d * 20}%`, top: 0, height: pct(DAY) }} />
              ))}
              <div className="absolute inset-x-0 rounded-[12px] bg-[#15171f]" style={{ top: pct(NIGHT_TOP), height: pct(NIGHT_H) }} />

              {KEEP.map(([d, start, h, l]) => (
                <div
                  key={`${d}-${start}`}
                  className="absolute rounded-[7px] border border-ink/70 bg-card px-1.5 py-1 text-[10.5px] leading-[1.15] font-medium text-ink md:px-2 md:text-[12px]"
                  style={{ left: col(d), width: COL_W, top: pct(start - 8), height: pct(h - 0.12) }}
                >
                  <span className="line-clamp-2">{t.keep[l]}</span>
                </div>
              ))}
              {CHORES.map((c, i) => (
                <Free key={`f${i}`} p={p} i={i} label={t.free[i]} />
              ))}
              {CHORES.map((c, i) => (
                <Chore key={`c${i}`} p={p} i={i} label={t.chores[c[3]]} />
              ))}

              <Mark n={4} on={lit >= 4} className="-translate-x-1/3 -translate-y-1/3" style={{ left: 0, top: 0 }} />

              {/* What it did tonight: the receipt that makes it safe to trust. */}
              <div
                className={cn(
                  'absolute right-1 z-20 w-[min(190px,52%)] rounded-[12px] border border-hair bg-card px-3 py-2.5 text-[11.5px] leading-snug shadow-[0_14px_30px_-12px_#00000055] transition-[opacity,translate] duration-500 ease-out-expo md:w-[210px] md:text-[12.5px]',
                  lit >= 5 ? 'translate-y-0 opacity-100' : 'translate-y-2 opacity-0',
                )}
                style={{ bottom: pct(NIGHT_H + 0.15) }}
              >
                <p className="text-[10.5px] text-muted md:text-[11px]">{t.log.title}</p>
                <p className="font-medium">{t.log.line}</p>
                <p className="relative mt-0.5 text-bot">✓ {t.log.ok}</p>
                <p className="mt-1 text-ink underline underline-offset-2">{t.log.see} →</p>
                <Mark n={5} on={lit >= 5} className="top-[2.4em] -left-2.5" />
                <Mark n={6} on={lit >= 6} className="bottom-2 -left-2.5" />
              </div>
            </div>
          </div>

          <p className="relative mt-2.5 ml-[26px] w-fit text-[11.5px] text-muted md:ml-[34px] md:text-[12.5px]">
            {t.builtOnce}
            <Mark n={3} on={lit >= 3} className="top-1/2 -right-1.5 -translate-y-1/2 translate-x-full" />
          </p>
        </div>

        <ol className="grid gap-x-8 sm:grid-cols-2 lg:grid-cols-1">
          {t.items.map((b, i) => (
            <li
              key={b.title}
              className={cn(
                'grid grid-cols-[30px_1fr] border-t border-hair py-3.5 transition-opacity duration-500 md:py-4',
                lit > i ? 'opacity-100' : 'opacity-35',
              )}
            >
              <span
                className={cn(
                  'mt-0.5 grid size-5 place-items-center rounded-full text-[11px] font-semibold transition-colors duration-500',
                  lit > i ? 'bg-ink text-paper' : 'bg-hair text-muted',
                )}
              >
                {i + 1}
              </span>
              <div>
                <h3 className="text-[17px] leading-tight font-semibold tracking-[-0.01em] md:text-lg">{b.title}</h3>
                <p className="mt-1 text-[14px] leading-snug text-muted md:text-[15px]">{b.text}</p>
              </div>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
