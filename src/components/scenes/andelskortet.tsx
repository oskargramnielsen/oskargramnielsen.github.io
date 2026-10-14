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
  const users = useTransform(p, (v) => Math.round(24485 * seg(v, 0.62, 0.85)).toLocaleString('da-DK'));
  const step = useStep(p, [0.62, 0.78, 0.84, 0.9]);

  return (
    <div className="relative flex h-[480px] flex-col overflow-hidden rounded-[18px] border border-hair bg-card shadow-[0_30px_60px_-40px_#00000040] sm:h-[540px] lg:absolute lg:inset-0 lg:h-auto">
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

        {/* How many people it has helped: the point of the whole thing. */}
        <div className="absolute right-3 bottom-3 flex items-center gap-3 rounded-2xl bg-card py-3 pr-4 pl-3 shadow-[0_10px_30px_-10px_#00000055]">
          <span className="grid size-10 place-items-center rounded-full md:size-12" style={{ background: '#e7efe9', color: GREEN }}>
            <svg
              viewBox="0 0 24 24"
              className="size-5 md:size-6"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.8"
              strokeLinecap="round"
              aria-hidden
            >
              <circle cx="9" cy="8.5" r="3" />
              <path d="M3.5 19c.6-3 2.8-4.8 5.5-4.8s4.9 1.8 5.5 4.8" />
              <circle cx="16.5" cy="9.5" r="2.4" />
              <path d="M15.5 14.4c2.6-.3 4.5 1.3 5 4.1" />
            </svg>
          </span>
          <span>
            <motion.b className="block text-[34px] leading-none font-semibold tracking-[-0.04em] md:text-[46px]" style={{ color: GREEN }}>
              {users}
            </motion.b>
            <span className="mt-1 block text-[12px] text-body md:text-[13px]">{t.users}</span>
          </span>
        </div>

        {/* What people wrote, one mail at a time. */}
        <div className="absolute top-3 right-3 flex w-[min(290px,78%)] flex-col gap-2">
          {t.mails.map((m, i) => (
            <Appear key={m.msg} on={step >= 2 + i}>
              <Banner app={t.mailApp} time={m.time} title={m.from}>
                {m.msg}
              </Banner>
            </Appear>
          ))}
        </div>
      </div>
      <p className="shrink-0 bg-card px-3 py-1 text-right text-[9.5px] text-faint">{t.attribution}</p>
    </div>
  );
}
