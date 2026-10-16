'use client';

import { motion, useTransform, type MotionValue } from 'motion/react';
import type { Dict } from '@/content';
import { seg, useStep } from '@/lib/motion';
import { cn } from '@/lib/utils';
import { Bubble, Thread, ThreadHead, Typing } from './bits';

type B = Dict['work']['bank'];
type Cat = keyof B['categories'];

// Illustrative transactions; amounts in kr. `flag` marks what the bank agent points out.
const TX: { text: string; amount: number; cat: Cat; flag?: keyof B['flags'] }[] = [
  { text: 'NETTO 2300 KBH S', amount: -186.5, cat: 'groceries' },
  { text: 'PARKERING KBH', amount: -38, cat: 'transport', flag: 'twice' },
  { text: 'PARKERING KBH', amount: -38, cat: 'transport', flag: 'twice' },
  { text: 'MOBILABONNEMENT', amount: -299, cat: 'bills', flag: 'cheaper' },
  { text: 'INDBOFORSIKRING', amount: -214, cat: 'bills', flag: 'cheaper' },
  { text: 'OVERFØRSEL NORDNET', amount: -2000, cat: 'savings' },
];
const SAVED = 4860;
const kr = (n: number) => n.toLocaleString('da-DK', { minimumFractionDigits: 2 });

export default function Bank({ p, t }: { p: MotionValue<number>; t: B }) {
  const rows = useStep(
    p,
    TX.map((_, i) => 0.03 + i * 0.045),
  );
  const sorted = useStep(
    p,
    TX.map((_, i) => 0.06 + i * 0.045),
  );
  const step = useStep(p, [0.34, 0.38, 0.43, 0.5, 0.55, 0.62, 0.67, 0.74, 0.79, 0.88]);
  const saved = useTransform(p, (v) => Math.round(SAVED * seg(v, 0.6, 0.86)).toLocaleString('da-DK'));
  const flagged = step >= 1;

  return (
    <div className="grid items-center gap-5 p-4 pt-2 md:p-7 lg:grid-cols-[1fr_1.1fr]">
      <div>
        <ul className="font-mono text-[11px] md:text-[12px]">
          {TX.map((tx, i) => (
            <li
              key={i}
              className={cn(
                'grid grid-cols-[1fr_auto] items-center gap-x-3 gap-y-1 border-b border-hair py-2 transition-opacity duration-300',
                rows > i ? 'opacity-100' : 'opacity-0',
              )}
            >
              <span className="truncate">{tx.text}</span>
              <span className="text-right">{kr(tx.amount)}</span>
              <span className="col-span-2 flex gap-1.5 text-[10px] md:text-[11px]">
                <span
                  className={cn('px-1.5 py-px transition-colors duration-300', sorted > i ? 'bg-bot-soft text-bot' : 'bg-shade text-faint')}
                >
                  {sorted > i ? t.categories[tx.cat] : '…'}
                </span>
                {tx.flag && (
                  <span
                    className={cn('bg-bot px-1.5 py-px text-card transition-opacity duration-300', flagged ? 'opacity-100' : 'opacity-0')}
                  >
                    {t.flags[tx.flag]}
                  </span>
                )}
              </span>
            </li>
          ))}
        </ul>
        <div className={cn('mt-4 transition-opacity duration-500', step >= 6 ? 'opacity-100' : 'opacity-0')}>
          <motion.b className="block text-[40px] leading-none font-semibold tracking-[-0.04em] text-bot md:text-[48px]">{saved}</motion.b>
          <span className="font-mono text-[11px] text-muted md:text-xs">{t.saved}</span>
        </div>
      </div>

      <div className="overflow-hidden rounded-[22px] border border-hair bg-card">
        <ThreadHead name="bank" status={t.status} initials="B" bot />
        <Thread className="h-[320px] md:h-[360px]">
          {step === 2 && <Typing key="t1" side="left" bot />}
          {step >= 3 && (
            <Bubble key="m1" side="left" bot>
              {t.messages[0]}
            </Bubble>
          )}
          {step === 4 && <Typing key="t2" side="left" bot />}
          {step >= 5 && (
            <Bubble key="m2" side="left" bot>
              {t.messages[1]}
            </Bubble>
          )}
          {step === 6 && <Typing key="t3" side="left" bot />}
          {step >= 7 && (
            <Bubble key="m3" side="left" bot>
              {t.messages[2]}
            </Bubble>
          )}
          {step === 8 && <Typing key="t4" side="left" bot />}
          {step >= 9 && (
            <Bubble key="m4" side="left" bot>
              {t.messages[3]}
            </Bubble>
          )}
          {step >= 10 && (
            <Bubble key="me" side="right" meta={t.seen}>
              {t.reply}
            </Bubble>
          )}
        </Thread>
      </div>
    </div>
  );
}
