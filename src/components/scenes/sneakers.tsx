'use client';

import { motion, useTransform, type MotionValue } from 'motion/react';
import type { Dict } from '@/content';
import { seg, useStep } from '@/lib/motion';
import { cn } from '@/lib/utils';
import { Bubble, Divider, Thread, ThreadHead, Typing } from './bits';

// From the scraper's result emails: [model, colourway, asking price, resale price].
const DEALS = [
  ['Nike SB React Leo', 'Electro Orange', 1530, 661],
  ['Nike SB Blazer Mid', 'Grant Taylor 98', 1179, 696],
  ['Nike Dunk Low', 'Midnight Navy', 925, 1997],
  ['New Balance 2002R', 'Rain Cloud', 1400, 1180],
] as const;
const MAX = 2000;
const kr = (n: number) => n.toLocaleString('da-DK');

function Row({ p, i, t }: { p: MotionValue<number>; i: number; t: Dict['work']['sneakers'] }) {
  const [name, colour, ask, resale] = DEALS[i];
  const k = useTransform(p, (v) => seg(v, 0.14 + i * 0.12, 0.3 + i * 0.12));
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
    <motion.li style={{ opacity }} className={cn('border-t border-bot/15 py-2 first:border-t-0', good && 'text-ink')}>
      <div className="flex items-baseline justify-between gap-3 text-[12px]">
        <span className="truncate">
          <b className="font-semibold">{name}</b> <span className="text-muted">{colour}</span>
        </span>
        <motion.b className={cn('font-mono text-[13px]', good ? 'text-bot' : 'text-faint')}>{gain}</motion.b>
      </div>
      <div className="mt-1.5 grid gap-1">
        {(
          [
            [askW, `${t.asking} ${kr(ask)}`, 'bg-ink'],
            [resW, `${t.resells} ${kr(resale)}`, 'bg-bot'],
          ] as const
        ).map(([w, label, color]) => (
          <div key={label} className="grid grid-cols-[1fr_92px] items-center gap-2 font-mono text-[10.5px] text-muted">
            <div className="relative h-2 rounded-full bg-card">
              <motion.i className={cn('absolute inset-y-0 left-0 rounded-full', color)} style={{ width: w }} />
            </div>
            <span className="whitespace-nowrap">{label} kr</span>
          </div>
        ))}
      </div>
    </motion.li>
  );
}

export default function Sneakers({ p, t }: { p: MotionValue<number>; t: Dict['work']['sneakers'] }) {
  const step = useStep(p, [0.04, 0.1, 0.66, 0.72, 0.84]);

  return (
    <div className="p-4 pt-3 md:p-7">
      <div className="mx-auto max-w-[460px] overflow-hidden rounded-[22px] border border-hair bg-card">
        <ThreadHead name="sneaker-scraper" status={t.status} initials="S" bot />
        <Thread className="h-[440px] md:h-[470px]">
          {step >= 1 && <Divider key="time">14:12</Divider>}
          {step === 1 && <Typing key="t1" side="left" bot />}
          {step >= 2 && (
            <Bubble key="table" side="left" bot className="w-[300px] max-w-full md:w-[340px]">
              <p className="mb-1 text-[13px]">{t.checked}</p>
              <ul className="text-ink">
                {DEALS.map((_, i) => (
                  <Row key={i} p={p} i={i} t={t} />
                ))}
              </ul>
            </Bubble>
          )}
          {step === 3 && <Typing key="t2" side="left" bot />}
          {step >= 4 && (
            <Bubble key="deal" side="left" bot>
              {t.mail}
            </Bubble>
          )}
          {step >= 5 && (
            <Bubble key="me" side="right" meta={t.seen}>
              {t.reply}
            </Bubble>
          )}
        </Thread>
      </div>
    </div>
  );
}
