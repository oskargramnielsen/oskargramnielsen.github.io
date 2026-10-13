'use client';

import { motion, useTransform, type MotionValue } from 'motion/react';
import type { Dict } from '@/content';
import { seg, useStep } from '@/lib/motion';
import { cn } from '@/lib/utils';
import { Bubble, Divider, Thread, ThreadHead, Typing } from './bits';

// Illustrative: the same car found on four sites, prices in kr.
const SOURCES = [
  ['Facebook Marketplace', 139900],
  ['DBA', 134500],
  ['Bilbasen', 149900],
  ['AutoUncle', 146500],
] as const;
const MARKET = 149900;
const kr = (n: number) => n.toLocaleString('da-DK');
const best = Math.min(...SOURCES.map(([, v]) => v));

function Source({ p, i }: { p: MotionValue<number>; i: number }) {
  const [name, price] = SOURCES[i];
  const k = useTransform(p, (v) => seg(v, 0.16 + i * 0.1, 0.26 + i * 0.1));
  const width = useTransform(k, (v) => `${(price / MARKET) * 100 * v}%`);
  const opacity = useTransform(k, (v) => (v > 0 ? 1 : 0.3));
  const cheapest = price === best;

  return (
    <motion.li style={{ opacity }} className="grid grid-cols-[1fr_auto] items-center gap-x-3 gap-y-1 py-1.5 text-[12px]">
      <span className={cn(cheapest && 'font-semibold')}>{name}</span>
      <span className={cn('font-mono', cheapest ? 'text-bot' : 'text-muted')}>{kr(price)}</span>
      <div className="col-span-2 h-2 rounded-full bg-card">
        <motion.div className={cn('h-full rounded-full', cheapest ? 'bg-bot' : 'bg-ink/70')} style={{ width }} />
      </div>
    </motion.li>
  );
}

export default function Cars({ p, t }: { p: MotionValue<number>; t: Dict['work']['cars'] }) {
  const step = useStep(p, [0.04, 0.1, 0.62, 0.7, 0.84]);
  const rows = useTransform(p, (v) => kr(Math.round(48210 * seg(v, 0.1, 0.6))));

  return (
    <div className="p-4 pt-3 md:p-7">
      <div className="mx-auto max-w-[460px] overflow-hidden rounded-[22px] border border-hair bg-card">
        <ThreadHead name="car-scraper" status={t.status} initials="C" bot />
        <Thread className="h-[440px] md:h-[470px]">
          {step >= 1 && <Divider key="time">07:30</Divider>}
          {step === 1 && <Typing key="t1" side="left" bot />}
          {step >= 2 && (
            <Bubble key="table" side="left" bot className="w-[300px] max-w-full md:w-[340px]">
              <p className="text-[13px]">
                <b className="font-semibold text-ink">{t.car}</b>
              </p>
              <p className="mb-1 font-mono text-[11px]">
                <motion.span>{rows}</motion.span> {t.listings}
              </p>
              <ul className="text-ink">
                {SOURCES.map((_, i) => (
                  <Source key={i} p={p} i={i} />
                ))}
              </ul>
            </Bubble>
          )}
          {step === 3 && <Typing key="t2" side="left" bot />}
          {step >= 4 && (
            <Bubble key="deal" side="left" bot>
              {t.found}
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
