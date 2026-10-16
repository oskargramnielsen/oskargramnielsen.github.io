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

// Visitors since launch, month by month: some months grow fast, some slowly, but it never goes down.
// Shape of the real curve, rounded. Drawn in a 100 x 100 box that stretches with the scene; on desktop
// it starts behind the browser window and climbs out above it.
const GROWTH = [3, 1, 4, 2, 5, 1.5, 3, 6, 2, 4, 2.5, 5, 7, 3, 4, 6, 2, 5, 8, 3, 6, 4, 7, 9, 5, 8];
const TOTAL = GROWTH.map((_, i) => GROWTH.slice(0, i + 1).reduce((a, b) => a + b, 0));
const LINE = TOTAL.map(
  (v, i) => `${i ? 'L' : 'M'}${((i / (TOTAL.length - 1)) * 98).toFixed(2)},${(46 - (v / TOTAL[TOTAL.length - 1]) * 44).toFixed(2)}`,
).join(' ');

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
  const clipW = useTransform(grow, (g) => g * 104);
  const users = useTransform(grow, (g) => Math.round(24485 * g).toLocaleString('da-DK'));
  const step = useStep(p, [0.62, 0.78, 0.84, 0.9]);

  return (
    <div className="relative flex flex-col sm:block sm:h-[600px] lg:absolute lg:inset-0 lg:h-auto">
      {/* In the back: how many people it has helped, a number that counts up and a line that only goes up. */}
      <div className="relative h-[170px] sm:absolute sm:inset-0 sm:h-auto">
        <svg
          viewBox="0 0 100 100"
          preserveAspectRatio="none"
          className="absolute inset-x-0 top-0 h-[230%] w-full overflow-visible sm:inset-0 sm:size-full"
          aria-hidden
        >
          <defs>
            <clipPath id="ak-grow">
              <motion.rect x="-2" y="-5" height="110" width={clipW} />
            </clipPath>
          </defs>
          <path
            d={LINE}
            clipPath="url(#ak-grow)"
            fill="none"
            stroke={GREEN}
            strokeWidth="3.5"
            strokeLinecap="round"
            strokeLinejoin="round"
            vectorEffect="non-scaling-stroke"
          />
        </svg>
        <div className="absolute top-0 left-0">
          <motion.b className="block text-[40px] leading-none font-semibold tracking-[-0.04em] md:text-[52px]" style={{ color: GREEN }}>
            {users}
          </motion.b>
          <span className="mt-1 block text-[13px] text-body">{t.users}</span>
        </div>
      </div>

      <div className="relative z-10 -mt-6 flex h-[420px] w-full flex-col overflow-hidden rounded-[18px] border border-hair bg-card shadow-[0_30px_60px_-30px_#00000050] sm:absolute sm:bottom-0 sm:left-0 sm:mt-0 sm:h-[80%] sm:w-[86%]">
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
