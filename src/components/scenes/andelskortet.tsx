'use client';

import { motion, useTransform, type MotionValue } from 'motion/react';
import type { Dict } from '@/content';
import { mapDots, mapLabels, mapLakes, mapParks, mapPath, mapViewBox } from '@/content/map';
import { seg, useStep } from '@/lib/motion';
import { cn } from '@/lib/utils';
import { Appear, Banner } from './bits';

const H = 560;
const open = mapDots.filter((d) => d[2]);

export default function Andelskortet({ p, t }: { p: MotionValue<number>; t: Dict['work']['andelskortet'] }) {
  const scanY = useTransform(p, (v) => seg(v, 0.05, 0.6) * H);
  const users = useTransform(p, (v) => Math.round(24485 * seg(v, 0.62, 0.85)).toLocaleString('da-DK'));
  const step = useStep(p, [0.62, 0.78, 0.84, 0.9]);

  return (
    <div className="relative h-[440px] sm:h-[520px] lg:absolute lg:inset-0 lg:h-auto">
      <svg viewBox={mapViewBox} preserveAspectRatio="xMidYMid meet" className="absolute inset-0 size-full" aria-hidden>
        <defs>
          <clipPath id="ak-scan">
            <motion.rect x="0" y="0" width="600" height={scanY} />
          </clipPath>
        </defs>
        <path d={mapPath} className="fill-shade stroke-[#d9d6cd]" strokeWidth="1" strokeLinejoin="round" />
        <path d={mapParks} fill="#e6ebdf" />
        <path d={mapLakes} fill="#d8e2ea" />
        <g clipPath="url(#ak-scan)" className="fill-ink">
          {mapDots.map(([x, y], i) => (
            <circle key={i} cx={x} cy={y} r="2.6" opacity=".3" />
          ))}
        </g>
        <g className={cn('fill-bot transition-opacity duration-500', step >= 1 ? 'opacity-100' : 'opacity-0')}>
          {open.map(([x, y], i) => (
            <circle key={i} cx={x} cy={y} r="4" className="stroke-card" strokeWidth="1.5" />
          ))}
          {step >= 1 &&
            open
              .slice(0, 12)
              .map(([x, y], i) => (
                <circle key={i} cx={x} cy={y} r="4" className="animate-ping-dot" style={{ animationDelay: `${(i % 6) * 0.35}s` }} />
              ))}
        </g>
        {mapLabels.map(([name, x, y]) => (
          <text
            key={name}
            x={x}
            y={y}
            textAnchor="middle"
            className="fill-muted stroke-card font-mono text-[9px] tracking-[0.12em] uppercase [paint-order:stroke]"
            strokeWidth="3"
            strokeLinejoin="round"
          >
            {name}
          </text>
        ))}
        <motion.line x1="0" x2="600" y1={scanY} y2={scanY} className="stroke-bot" strokeWidth="1" opacity={step >= 1 ? 0 : 0.6} />
      </svg>

      <ul className="absolute bottom-7 left-4 space-y-1 font-mono text-[11px] text-muted">
        <li className="flex items-center gap-2">
          <span className="size-[7px] rounded-full bg-ink/30" />
          {t.legend.all}
        </li>
        <li className={cn('flex items-center gap-2 text-bot transition-opacity duration-500', step >= 1 ? 'opacity-100' : 'opacity-0')}>
          <span className="size-[8px] rounded-full bg-bot" />
          {t.legend.open}
        </li>
      </ul>

      {/* What people wrote, one mail at a time. */}
      <div className="absolute top-2 right-3 flex w-[min(290px,78%)] flex-col gap-2">
        {t.mails.map((m, i) => (
          <Appear key={m.msg} on={step >= 2 + i}>
            <Banner app={t.mailApp} time={m.time} title={m.from}>
              {m.msg}
            </Banner>
          </Appear>
        ))}
      </div>

      <div className="absolute right-4 bottom-4 text-right">
        <motion.b className="block text-[44px] leading-none font-semibold tracking-[-0.04em] md:text-[56px]">{users}</motion.b>
        <span className="font-mono text-[11px] text-muted md:text-xs">{t.users}</span>
      </div>
      <p className="absolute bottom-1 left-4 font-mono text-[10px] text-faint">{t.attribution}</p>
    </div>
  );
}
