'use client';

import { motion, useTransform, type MotionValue } from 'motion/react';
import type { Dict } from '@/content';
import { mapDots, mapLabels, mapLakes, mapLand, mapParks, mapViewBox } from '@/content/map';
import { seg, useStep } from '@/lib/motion';
import { cn } from '@/lib/utils';
import { Appear, Banner } from './bits';

const H = 600;
const open = mapDots.filter((d) => d[2]);
// Andelskortet's own colours: its green, and a light map like the CARTO tiles it uses.
const GREEN = '#3a5d50';

// Visitors per month since launch, new and returning, stacked. Shape of the real curve, rounded.
const NEW = [
  120, 260, 420, 380, 450, 520, 610, 580, 700, 820, 760, 900, 980, 1050, 990, 1120, 1240, 1180, 1300, 1420, 1380, 1500, 1610, 1560, 1700,
  1820,
];
const RET = [
  20, 60, 110, 120, 150, 180, 220, 230, 260, 300, 310, 340, 380, 400, 410, 450, 480, 490, 520, 560, 570, 600, 640, 650, 690, 720,
];
const GW = 300;
const GH = 100;
const gx = (i: number) => (i / (NEW.length - 1)) * GW;
const gy = (v: number) => GH - (v / 2600) * GH;
const area = (top: number[], bottom: number[]) =>
  `M${top.map((v, i) => `${gx(i)},${gy(v)}`).join(' L')} L${bottom
    .map((v, i) => `${gx(i)},${gy(v)}`)
    .reverse()
    .join(' L')} Z`;
const STACK = NEW.map((v, i) => v + RET[i]);
const NEW_AREA = area(
  NEW,
  NEW.map(() => 0),
);
const RET_AREA = area(STACK, NEW);

/** The house-in-a-circle marker andelskortet.dk uses for open waiting lists. */
const House = () => (
  <symbol id="ak-house" viewBox="0 0 647.8 647.8">
    <circle cx="323.9" cy="323.9" r="306.4" fill="#fff" stroke={GREEN} strokeWidth="44" />
    <path fill={GREEN} d="m326.4,90.7l-236.7,225.4 25.4,21.4 211.3-200.6 211.3,200.6 25.4-21.4z" />
    <path fill={GREEN} d="m157.3,329v167.4h135.2v-140.9h67.6v140.9h135.3v-167.4l-169-160.6z" />
  </symbol>
);

const HouseIcon = ({ className }: { className?: string }) => (
  <svg viewBox="0 0 647.8 647.8" className={className} aria-hidden>
    <use href="#ak-house" />
  </svg>
);

export default function Andelskortet({ p, t }: { p: MotionValue<number>; t: Dict['work']['andelskortet'] }) {
  const scanY = useTransform(p, (v) => seg(v, 0.05, 0.6) * H);
  const grow = useTransform(p, (v) => seg(v, 0.1, 0.75));
  const users = useTransform(grow, (g) => Math.round(24485 * g).toLocaleString('da-DK'));
  const clipW = useTransform(grow, (g) => g * GW);
  const step = useStep(p, [0.62, 0.78, 0.84, 0.9]);

  return (
    <div className="relative flex flex-col sm:block sm:h-[600px] lg:absolute lg:inset-0 lg:h-auto">
      {/* In the back: how many people it has helped, month by month. */}
      <div className="relative flex h-[200px] w-[92%] flex-col self-end rounded-[18px] border border-hair bg-card px-4 pt-3.5 pb-12 shadow-[0_20px_40px_-30px_#00000040] sm:absolute sm:top-0 sm:right-0 sm:h-[42%] sm:w-[66%] sm:px-5 sm:pt-4 sm:pb-[84px]">
        <div className="flex items-start justify-between gap-3">
          <div>
            <motion.b className="block text-[30px] leading-none font-semibold tracking-[-0.04em] md:text-[40px]" style={{ color: GREEN }}>
              {users}
            </motion.b>
            <span className="mt-1 block text-[12px] text-body md:text-[13px]">{t.users}</span>
          </div>
          <div className="text-right text-[10.5px] leading-snug text-muted md:text-[11.5px]">
            <p className="mb-0.5 text-ink">{t.graph.title}</p>
            <p className="flex items-center justify-end gap-1.5">
              <span className="size-2 rounded-full" style={{ background: GREEN }} />
              {t.graph.layers[0]}
              <span className="ml-1.5 size-2 rounded-full bg-[#a8c6b6]" />
              {t.graph.layers[1]}
            </p>
          </div>
        </div>
        <svg viewBox={`0 0 ${GW} ${GH}`} preserveAspectRatio="none" className="mt-2 min-h-0 w-full flex-1" aria-hidden>
          <defs>
            <clipPath id="ak-grow">
              <motion.rect x="0" y="0" height={GH} width={clipW} />
            </clipPath>
          </defs>
          {[0.25, 0.5, 0.75].map((f) => (
            <line key={f} x1="0" x2={GW} y1={GH * f} y2={GH * f} stroke="#ecebe6" strokeWidth="1" vectorEffect="non-scaling-stroke" />
          ))}
          <g clipPath="url(#ak-grow)">
            <path d={RET_AREA} fill="#a8c6b6" />
            <path d={NEW_AREA} fill={GREEN} />
          </g>
        </svg>
        <div className="flex justify-between pt-1 text-[10px] text-faint">
          <span>{t.graph.from}</span>
          <span>{t.graph.to}</span>
        </div>
      </div>

      <div className="relative z-10 -mt-10 flex h-[400px] w-full flex-col overflow-hidden rounded-[18px] border border-hair bg-card shadow-[0_30px_60px_-30px_#00000050] sm:absolute sm:bottom-0 sm:left-0 sm:mt-0 sm:h-[70%] sm:w-[86%]">
        {/* Browser bar */}
        <div className="flex h-9 shrink-0 items-center gap-3 border-b border-hair bg-shade px-3.5">
          <div className="flex gap-1.5" aria-hidden>
            {[0, 1, 2].map((i) => (
              <span key={i} className="size-2.5 rounded-full bg-hair" />
            ))}
          </div>
          <span className="mx-auto w-full max-w-[260px] truncate rounded-full bg-card px-3 py-1 text-center text-[11px] text-muted">
            {t.url}
          </span>
          <span className="w-[42px]" aria-hidden />
        </div>

        {/* The site's own header */}
        <div className="flex shrink-0 items-center gap-2.5 bg-[#f7f2ea] px-4 py-3">
          <svg viewBox="0 0 647.8 647.8" className="size-7 shrink-0" aria-hidden>
            <House />
            <use href="#ak-house" />
          </svg>
          <b className="text-[15px] font-semibold tracking-[-0.01em]" style={{ color: GREEN }}>
            Andelskortet
          </b>
          <span className="ml-auto hidden truncate text-[13px] font-medium sm:block" style={{ color: GREEN }}>
            {t.heading}
          </span>
        </div>

        <div className="relative flex-1 overflow-hidden bg-[#d5dcdf]">
          <svg viewBox={mapViewBox} preserveAspectRatio="xMidYMid slice" className="absolute inset-0 size-full" aria-hidden>
            <defs>
              <clipPath id="ak-scan">
                <motion.rect x="0" y="0" width="600" height={scanY} />
              </clipPath>
            </defs>
            <path d={mapLand} fill="#f7f6f3" stroke="#ecebe6" strokeWidth="0.8" strokeLinejoin="round" />
            <path d={mapParks} fill="#e4ebdf" />
            <path d={mapLakes} fill="#d5dcdf" />

            {/* Every co-op the scraper has read so far. */}
            <g clipPath="url(#ak-scan)">
              {mapDots.map(([x, y], i) => (
                <circle key={i} cx={x} cy={y} r="2.4" fill="#fff" stroke="#9a9a9a" strokeWidth="1.1" />
              ))}
            </g>
            {/* Then the ones with an open waiting list get their house. */}
            <g className={cn('transition-opacity duration-500', step >= 1 ? 'opacity-100' : 'opacity-0')}>
              {step >= 1 &&
                open
                  .slice(0, 10)
                  .map(([x, y], i) => (
                    <circle
                      key={`ping-${i}`}
                      cx={x}
                      cy={y}
                      r="7"
                      fill={GREEN}
                      className="animate-ping-dot"
                      style={{ animationDelay: `${(i % 5) * 0.4}s` }}
                    />
                  ))}
              {open.map(([x, y], i) => (
                <use key={i} href="#ak-house" x={x - 7} y={y - 7} width="14" height="14" />
              ))}
            </g>
            {mapLabels.map(([name, x, y]) => (
              <text
                key={name}
                x={x}
                y={y}
                textAnchor="middle"
                className="fill-[#9a9a96] stroke-[#f7f6f3] text-[8.5px] font-medium tracking-[0.14em] uppercase [paint-order:stroke]"
                strokeWidth="3"
                strokeLinejoin="round"
              >
                {name}
              </text>
            ))}
            <motion.line x1="0" x2="600" y1={scanY} y2={scanY} className="stroke-bot" strokeWidth="1.2" opacity={step >= 1 ? 0 : 0.7} />
          </svg>

          <div className="absolute top-3 left-3 flex w-[min(250px,62%)] items-center gap-2 rounded-full bg-card px-3.5 py-2 text-[11.5px] text-faint shadow-[0_6px_18px_-8px_#00000040]">
            <svg viewBox="0 0 24 24" className="size-3.5 shrink-0" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden>
              <circle cx="11" cy="11" r="6.5" />
              <path d="m16 16 4 4" strokeLinecap="round" />
            </svg>
            <span className="truncate">{t.search}</span>
          </div>

          <ul className="absolute bottom-3 left-3 space-y-1.5 rounded-xl bg-card px-3 py-2.5 text-[11.5px] text-body shadow-[0_6px_18px_-8px_#00000040]">
            <li className={cn('flex items-center gap-2 transition-opacity duration-500', step >= 1 ? 'opacity-100' : 'opacity-40')}>
              <HouseIcon className="size-3.5" />
              {t.legend.open}
            </li>
            <li className="flex items-center gap-2">
              <span className="mx-[3px] size-2 rounded-full border-[1.5px] border-[#9a9a9a] bg-card" />
              {t.legend.all}
            </li>
          </ul>
        </div>
        <p className="shrink-0 bg-card px-3 py-1 text-right text-[9.5px] text-faint">{t.attribution}</p>
      </div>

      {/* What people wrote, one mail at a time, outside the map. */}
      <div className="relative z-20 -mt-6 ml-auto flex w-[88%] flex-col gap-2 sm:absolute sm:right-0 sm:bottom-[4%] sm:mt-0 sm:w-[min(290px,44%)]">
        {t.mails.map((m, i) => (
          <Appear key={m.msg} on={step >= 2 + i}>
            <Banner app={t.mailApp} time={m.time} title={m.from}>
              {m.msg}
            </Banner>
          </Appear>
        ))}
      </div>
    </div>
  );
}
