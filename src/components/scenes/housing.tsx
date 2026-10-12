'use client';

import { motion, useTransform, type MotionValue } from 'motion/react';
import type { Dict } from '@/content';
import { seg, useStep } from '@/lib/motion';
import { cn } from '@/lib/utils';
import { Appear, Note } from './bits';

// The agent always wrote in Danish. Personal details from the original are removed.
const MESSAGE =
  'Hej! Vi er meget interesserede i jeres andelsbolig. Vi er købegodkendt og fleksible med overtagelse. Vil I sende dokumenterne, så vi kan gå videre med banken? Vi kommer gerne og ser lejligheden, når det passer jer.';
const REPLY = '“Vi vil gerne invitere jer til åbent hus.”';

export default function Housing({ p, t }: { p: MotionValue<number>; t: Dict['work']['housing'] }) {
  const step = useStep(p, [0.04, 0.12, 0.19, 0.26, 0.33, 0.4, 0.8, 0.9]);
  const typed = useTransform(p, (v) => MESSAGE.slice(0, Math.round(MESSAGE.length * seg(v, 0.42, 0.78))));

  return (
    <div className="grid gap-5 p-4 pt-3 md:grid-cols-2 md:gap-7 md:p-7 md:pt-5">
      <div className="space-y-5">
        <Appear on={step >= 1}>
          <div className="border border-hair bg-card p-3.5">
            <div className="mb-3 hidden h-28 place-items-center bg-[repeating-linear-gradient(135deg,#f1f0ec_0_8px,#f7f6f2_8px_16px)] font-mono text-[11px] text-faint sm:grid">
              {t.photo}
            </div>
            <p className="text-[15px] font-semibold">{t.listingTitle}</p>
            <p className="text-[13px] text-muted">{t.listingMeta}</p>
          </div>
        </Appear>
        <ul className="font-mono text-[12px] md:text-[13px]">
          {t.checks.map((c, i) => (
            <li
              key={c}
              className={cn(
                'flex justify-between border-b border-hair py-2 transition-opacity duration-300',
                step >= i + 2 ? 'opacity-100' : 'opacity-25',
              )}
            >
              <span>{c}</span>
              <span className="text-bot">✓</span>
            </li>
          ))}
        </ul>
      </div>

      <div className="space-y-5">
        <Appear on={step >= 6}>
          <Note bot label={t.msgLabel} className="min-h-[188px] md:min-h-[220px]">
            <motion.span>{typed}</motion.span>
            <span className="ml-0.5 inline-block h-[15px] w-[7px] animate-caret bg-bot align-[-2px]" />
          </Note>
        </Appear>
        <Appear on={step >= 7}>
          <dl className="font-mono text-[12px] md:text-[13px]">
            <div className="flex justify-between border-b border-hair py-2">
              <dt>{t.posted}</dt>
              <dd>21:10</dd>
            </div>
            <div className="flex justify-between border-b border-hair py-2">
              <dt>{t.sent}</dt>
              <dd className="text-bot">21:11</dd>
            </div>
          </dl>
        </Appear>
        <Appear on={step >= 8}>
          <Note label={t.replyLabel}>{REPLY}</Note>
        </Appear>
      </div>
    </div>
  );
}
