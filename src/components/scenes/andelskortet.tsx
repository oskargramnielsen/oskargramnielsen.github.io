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
// The user line is in the site's own blue.
const BLUE = '#1f3bff';

// Andelskortet's users since launch: it climbs with small dips, like the real curve. Points are
// % of the screen (x from the left, y from the top). It runs low under the text, climbs through
// the gap between the text and the window, and ends at the user count above the window.
const TRACE = [
  [0, 86],
  [4, 84],
  [8, 85],
  [12, 82.5],
  [16, 83.5],
  [20, 81],
  [24, 81.5],
  [28, 78],
  [31, 79],
  [34, 75.5],
  [37, 76.5],
  [40, 71],
  [42, 61],
  [43.5, 62],
  [45, 50],
  [46.5, 42],
  [48, 43],
  [50, 35],
  [53, 31.5],
  [55, 33],
  [58, 27],
  [61, 28],
  [64, 22],
  [66, 23.5],
  [69, 17],
  [72, 19],
  [75, 14],
  [78, 15.5],
  [81, 11],
  [84, 12.5],
  [87, 9],
  [90, 9.5],
  [93, 7.5],
  [96, 8],
  [100, 6.5],
] as const;
// Squeezed so the line ends at END, where the count sits.
const END = [84, 20] as const;
const CURVE = TRACE.map(([x, y]) => [
  x < 46 ? x : 46 + ((x - 46) * (END[0] - 46)) / (100 - 46),
  86 - ((86 - y) * (86 - END[1])) / (86 - 6.5),
]);
// Smooth: a curve through the midpoints, bending at each traced point.
const LINE =
  `M${CURVE[0][0]},${CURVE[0][1]} ` +
  CURVE.slice(1, -1)
    .map(([x, y], i) => `Q${x},${y} ${(x + CURVE[i + 2][0]) / 2},${(y + CURVE[i + 2][1]) / 2}`)
    .join(' ') +
  ` L${CURVE[CURVE.length - 1][0]},${CURVE[CURVE.length - 1][1]}`;
// The same line closed along the bottom, for the soft fill under it.
const AREA = `${LINE} L${END[0]},100 L0,100 Z`;

/** Height of the line (in %) at a given x, close enough to the smoothed curve for the moving dot. */
function yAt(x: number) {
  const k = CURVE.findIndex(([cx]) => cx >= x);
  if (k <= 0) return CURVE[0][1];
  const [x0, y0] = CURVE[k - 1];
  const [x1, y1] = CURVE[k];
  return y0 + ((y1 - y0) * (x - x0)) / (x1 - x0);
}

/** The rising visitor line with a soft fill under it, revealed left to right, a live dot at its tip. */
function Line({ grow, id, className, width }: { grow: MotionValue<number>; id: string; className: string; width: number }) {
  const clipW = useTransform(grow, (g) => g * END[0]);
  const left = useTransform(grow, (g) => `${g * END[0]}%`);
  const top = useTransform(grow, (g) => `${yAt(g * END[0])}%`);
  const shown = useTransform(grow, (g) => (g > 0.01 ? 1 : 0));
  return (
    <div className={className} aria-hidden>
      <svg viewBox="0 0 100 100" preserveAspectRatio="none" className="absolute inset-0 size-full">
        <defs>
          <clipPath id={id}>
            <motion.rect x="0" y="-5" height="110" width={clipW} />
          </clipPath>
          <linearGradient id={`${id}-fill`} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" stopColor={BLUE} stopOpacity="0.1" />
            <stop offset="0.7" stopColor={BLUE} stopOpacity="0.03" />
            <stop offset="1" stopColor={BLUE} stopOpacity="0" />
          </linearGradient>
        </defs>
        <g clipPath={`url(#${id})`}>
          <path d={AREA} fill={`url(#${id}-fill)`} />
          <path
            d={LINE}
            fill="none"
            stroke={BLUE}
            strokeWidth={width}
            strokeLinecap="round"
            strokeLinejoin="round"
            vectorEffect="non-scaling-stroke"
          />
        </g>
      </svg>
      <motion.span className="absolute size-0" style={{ left, top, opacity: shown }}>
        <span className="absolute -inset-[9px] animate-ping rounded-full opacity-30" style={{ background: BLUE }} />
        <span className="absolute -inset-[7px] rounded-full border-[3px] border-card" style={{ background: BLUE }} />
      </motion.span>
    </div>
  );
}

/** How many have used it, counting up as the line grows. */
const useUsers = (grow: MotionValue<number>) => useTransform(grow, (g) => Math.round(24485 * g).toLocaleString('da-DK'));

/** On large screens the line runs across the whole pinned screen, behind the text and the window, and ends at the count. */
export function AndelskortetBackdrop({ p, t }: { p: MotionValue<number>; t: Dict['work']['andelskortet'] }) {
  const grow = useTransform(p, (v) => seg(v, 0.1, 0.75));
  const users = useUsers(grow);
  return (
    <>
      <Line grow={grow} id="ak-grow-wide" width={5} className="absolute inset-0" />
      <div className="absolute -translate-x-full pr-2 pb-5 text-right" style={{ left: `${END[0]}%`, bottom: `${100 - END[1]}%` }}>
        <motion.b className="block text-[52px] leading-none font-semibold tracking-[-0.04em] text-bot">{users}</motion.b>
        <span className="mt-1 block text-[13px] whitespace-nowrap text-body">{t.users}</span>
      </div>
    </>
  );
}

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
  const users = useUsers(grow);
  const step = useStep(p, [0.62, 0.78, 0.84, 0.9]);

  return (
    <div className="relative flex flex-col sm:block sm:h-[600px] lg:absolute lg:inset-0 lg:h-auto">
      {/* In the back: how many people it has helped, a number that counts up and a line that only goes up. */}
      <div className="relative h-[230px] sm:absolute sm:inset-0 sm:h-auto">
        {/* Smaller screens: the line runs edge to edge behind the number and the top of the window. */}
        <Line
          grow={grow}
          id="ak-grow"
          width={5}
          className="absolute top-[64px] left-1/2 h-[170px] w-screen -translate-x-1/2 sm:top-0 sm:h-full lg:hidden"
        />
        {/* On large screens the count sits at the end of the line in the backdrop instead. */}
        <div className="absolute top-0 left-0 lg:hidden">
          <motion.b className="block text-[40px] leading-none font-semibold tracking-[-0.04em] text-bot md:text-[52px]">{users}</motion.b>
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
