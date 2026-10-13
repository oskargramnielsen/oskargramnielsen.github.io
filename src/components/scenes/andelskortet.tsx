'use client';

import { motion, useTransform, type MotionValue } from 'motion/react';
import type { Dict } from '@/content';
import { mapDots, mapPath, mapViewBox } from '@/content/map';
import { seg, useStep } from '@/lib/motion';
import { cn } from '@/lib/utils';
import { Appear, Banner } from './bits';

const LOG = [
  'GET cvr.dk  type=andelsboligforening',
  'found website for A/B Sankt Hans',
  'parse "venteliste" → åben',
  'parse "indskud" → 300 kr',
  'found website for A/B Fælledhaven',
  'parse "venteliste" → lukket',
];
const H = 560;
const open = mapDots.filter((d) => d[2]);

export default function Andelskortet({ p, t }: { p: MotionValue<number>; t: Dict['work']['andelskortet'] }) {
  const scanY = useTransform(p, (v) => seg(v, 0.05, 0.6) * H);
  const users = useTransform(p, (v) => Math.round(24485 * seg(v, 0.62, 0.85)).toLocaleString('da-DK'));
  const lines = useStep(p, LOG.map((_, i) => 0.05 + ((i + 1) / LOG.length) * 0.55));
  const step = useStep(p, [0.62, 0.88]);

  return (
    <div className="relative h-[440px] sm:h-[520px] lg:absolute lg:inset-0 lg:h-auto">
      <svg viewBox={mapViewBox} preserveAspectRatio="xMidYMid meet" className="absolute inset-0 size-full" aria-hidden>
        <defs>
          <clipPath id="ak-scan">
            <motion.rect x="0" y="0" width="600" height={scanY} />
          </clipPath>
        </defs>
        <path d={mapPath} className="fill-shade stroke-hair" strokeWidth="1" />
        <g clipPath="url(#ak-scan)" className="fill-ink">
          {mapDots.map(([x, y], i) => (
            <circle key={i} cx={x} cy={y} r="3" opacity=".28" />
          ))}
        </g>
        <g className={cn('fill-bot transition-opacity duration-500', step >= 1 ? 'opacity-100' : 'opacity-0')}>
          {open.map(([x, y], i) => (
            <circle key={i} cx={x} cy={y} r="4" />
          ))}
          {step >= 1 &&
            open.slice(0, 12).map(([x, y], i) => (
              <circle key={i} cx={x} cy={y} r="4" className="animate-ping-dot" style={{ animationDelay: `${(i % 6) * 0.35}s` }} />
            ))}
        </g>
        <motion.line x1="0" x2="600" y1={scanY} y2={scanY} className="stroke-bot" strokeWidth="1" opacity={step >= 1 ? 0 : 0.6} />
      </svg>

      <div className="absolute bottom-6 left-4 hidden max-w-[48%] bg-card/95 px-2 py-1.5 font-mono text-[11px] leading-[1.7] text-muted sm:block">
        {LOG.slice(0, lines).map((l) => (
          <div key={l} className={l.includes('åben') ? 'text-bot' : undefined}>
            {l}
          </div>
        ))}
      </div>

      <Appear on={step >= 2} className="absolute top-2 right-3 w-[min(290px,78%)]">
        <Banner app={t.bankApp} time={t.bankTime} title={t.bankFrom}>
          {t.bankMsg}
        </Banner>
      </Appear>

      <div className="absolute right-4 bottom-4 text-right">
        <motion.b className="block text-[44px] leading-none font-semibold tracking-[-0.04em] md:text-[56px]">{users}</motion.b>
        <span className="font-mono text-[11px] text-muted md:text-xs">{t.users}</span>
      </div>
      <p className="absolute bottom-1 left-4 font-mono text-[10px] text-faint">{t.attribution}</p>
    </div>
  );
}
