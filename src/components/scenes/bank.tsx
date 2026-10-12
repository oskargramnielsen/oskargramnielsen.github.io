'use client';

import { motion, useTransform, type MotionValue } from 'motion/react';
import type { Dict } from '@/content';
import { seg, useStep } from '@/lib/motion';
import { cn } from '@/lib/utils';
import { Appear } from './bits';

type Cat = keyof Dict['work']['bank']['categories'];

// Illustrative transactions; amounts in kr.
const TX: { text: string; amount: number; cat: Cat; conf: number }[] = [
  { text: 'NETTO 2300 KBH S', amount: -186.5, cat: 'groceries', conf: 99 },
  { text: 'DSB APP', amount: -48, cat: 'transport', conf: 97 },
  { text: 'SPOTIFY P3A1C', amount: -119, cat: 'subscriptions', conf: 99 },
  { text: 'REMA 1000 ISLANDS BRYGGE', amount: -312.25, cat: 'groceries', conf: 98 },
  { text: 'BAR 7 NØRREBRO', amount: -142, cat: 'eating', conf: 93 },
  { text: 'OVERFØRSEL NORDNET', amount: -2000, cat: 'savings', conf: 100 },
];
const BUDGETS: { cat: Cat; used: number }[] = [
  { cat: 'groceries', used: 0.62 },
  { cat: 'transport', used: 0.35 },
  { cat: 'eating', used: 0.81 },
  { cat: 'savings', used: 1 },
];
const kr = (n: number) => n.toLocaleString('da-DK', { minimumFractionDigits: 2 });

function Budget({ p, i, label, used }: { p: MotionValue<number>; i: number; label: string; used: number }) {
  const width = useTransform(p, (v) => `${used * 100 * seg(v, 0.62 + i * 0.04, 0.82 + i * 0.04)}%`);
  return (
    <div className="grid grid-cols-[96px_1fr] items-center gap-3 font-mono text-[11px] md:text-xs">
      <span className="text-muted">{label}</span>
      <div className="h-2 bg-[#ecece7]">
        <motion.div className="h-full bg-bot" style={{ width }} />
      </div>
    </div>
  );
}

export default function Bank({ p, t }: { p: MotionValue<number>; t: Dict['work']['bank'] }) {
  const rows = useStep(p, TX.map((_, i) => 0.05 + i * 0.08));
  const sorted = useStep(p, TX.map((_, i) => 0.1 + i * 0.08));
  const step = useStep(p, [0.6, 0.88]);
  const line = useTransform(p, (v) => seg(v, 0.84, 0.98));

  return (
    <div className="grid gap-5 p-4 pt-2 md:p-7 md:pt-3 lg:grid-cols-[1.3fr_1fr]">
      <ul className="font-mono text-[11px] md:text-[12px]">
        {TX.map((tx, i) => (
          <li
            key={tx.text}
            className={cn(
              'grid grid-cols-[1fr_auto] gap-x-3 gap-y-1 border-b border-hair py-2.5 transition-opacity duration-300',
              rows > i ? 'opacity-100' : 'opacity-0',
            )}
          >
            <span className="truncate">{tx.text}</span>
            <span className="text-right tabular-nums">{kr(tx.amount)}</span>
            <span
              className={cn(
                'col-span-2 justify-self-start px-1.5 py-px text-[10px] transition-colors duration-300 md:text-[11px]',
                sorted > i ? 'bg-bot-soft text-bot' : 'bg-shade text-faint',
              )}
            >
              {sorted > i ? `${t.categories[tx.cat]} · ${tx.conf}%` : '…'}
            </span>
          </li>
        ))}
      </ul>

      <Appear on={step >= 1} className="space-y-3 self-start">
        <p className="font-mono text-[11px] text-muted">{t.budgets}</p>
        {BUDGETS.map((b, i) => (
          <Budget key={b.cat} p={p} i={i} label={t.categories[b.cat]} used={b.used} />
        ))}
        <div className="pt-3">
          <svg viewBox="0 0 200 60" className="h-14 w-full" aria-hidden>
            <path d="M0 50 L200 10" className="stroke-hair" strokeDasharray="3 3" fill="none" />
            <motion.path
              d="M0 52 C30 48 40 40 60 41 S90 32 110 30 S150 20 170 17 S190 12 200 10"
              className="stroke-bot"
              strokeWidth="2"
              fill="none"
              style={{ pathLength: line }}
            />
          </svg>
          <p className={cn('font-mono text-[11px] transition-colors md:text-xs', step >= 2 ? 'text-bot' : 'text-faint')}>✓ {t.plan}</p>
        </div>
      </Appear>
    </div>
  );
}
