'use client';

import { motion, useTransform, type MotionValue } from 'motion/react';
import type { Dict } from '@/content';
import { seg, useStep } from '@/lib/motion';
import { cn } from '@/lib/utils';

// From the scraper's result emails: [model, colourway, asking price, resale price].
const DEALS = [
  ['Nike SB React Leo', 'Electro Orange', 1530, 661],
  ['Nike SB Blazer Mid', 'Grant Taylor 98', 1179, 696],
  ['Nike Dunk Low', 'Midnight Navy', 925, 1997],
  ['New Balance 2002R', 'Rain Cloud', 1400, 1180],
] as const;
const MAX = 2200;
const kr = (n: number) => n.toLocaleString('da-DK');

function Row({ p, i, t }: { p: MotionValue<number>; i: number; t: Dict['work']['sneakers'] }) {
  const [name, colour, ask, resale] = DEALS[i];
  const k = useTransform(p, (v) => seg(v, 0.08 + i * 0.15, 0.25 + i * 0.15));
  const askW = useTransform(k, (v) => `${(ask / MAX) * 100 * v}%`);
  const resW = useTransform(k, (v) => `${(resale / MAX) * 100 * seg(v, 0.3, 1)}%`);
  const gain = useTransform(k, (v) => {
    if (v < 0.5) return '';
    const g = Math.round((resale - ask) * seg(v, 0.5, 1));
    return (g > 0 ? '+' : '') + kr(g);
  });
  const opacity = useTransform(k, (v) => (v > 0 ? 1 : 0.3));
  const good = resale > ask;

  return (
    <motion.li style={{ opacity }} className="grid grid-cols-[1fr_auto] gap-x-4 gap-y-2 border-b border-hair py-3.5 text-[12px] sm:grid-cols-[150px_1fr_72px] sm:items-center md:text-[13px]">
      <div className="font-mono">
        <b className="block text-[13px] font-semibold md:text-sm">{name}</b>
        {colour}
      </div>
      <motion.div className={cn('row-span-2 self-center text-right font-mono text-[15px] font-semibold sm:order-last sm:row-span-1', good ? 'text-bot' : 'text-faint')}>
        {gain}
      </motion.div>
      <div className="grid gap-1.5 font-mono">
        {[
          [askW, `${t.asking} ${kr(ask)} kr`, 'bg-ink'],
          [resW, `${t.resells} ${kr(resale)} kr`, 'bg-bot'],
        ].map(([w, label, color]) => (
          <div key={label as string} className="grid grid-cols-[1fr_96px] items-center gap-2.5">
            <div className="relative h-3 bg-[#ecece7] md:h-3.5">
              <motion.i className={cn('absolute inset-y-0 left-0', color as string)} style={{ width: w as MotionValue<string> }} />
            </div>
            <span className="text-[11px] whitespace-nowrap text-muted">{label as string}</span>
          </div>
        ))}
      </div>
    </motion.li>
  );
}

export default function Sneakers({ p, t }: { p: MotionValue<number>; t: Dict['work']['sneakers'] }) {
  const step = useStep(p, [0.8]);
  return (
    <div className="flex h-full flex-col p-4 pt-1 md:p-7 md:pt-2">
      <ul>
        {DEALS.map((_, i) => (
          <Row key={i} p={p} i={i} t={t} />
        ))}
      </ul>
      <div className="mt-auto overflow-hidden pt-5">
        <div
          className={cn(
            'border border-bot bg-bot-soft p-3.5 font-mono text-[12px] transition-transform duration-700 ease-out-expo md:text-[13px]',
            step >= 1 ? 'translate-y-0' : 'translate-y-[140%]',
          )}
        >
          <p className="mb-1 text-[11px] text-bot">{t.mailLabel}</p>
          {t.mail}
        </div>
      </div>
    </div>
  );
}
