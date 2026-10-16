'use client';

import { motion, useTransform, type MotionValue } from 'motion/react';
import type { Dict } from '@/content';
import { seg, useStep } from '@/lib/motion';
import { cn } from '@/lib/utils';
import { Appear, Bubble, Divider, Thread, ThreadHead, Typing } from './bits';

// The agent always wrote in Danish. Personal details from the original are removed.
const MESSAGE =
  'Hej! Vi er meget interesserede i jeres andelsbolig. Vi er købegodkendt og fleksible med overtagelse. Vil I sende dokumenterne? Vi kommer gerne og ser den, når det passer jer.';
const TYPE_FROM = 0.32;
const TYPE_TO = 0.6;

export default function Housing({ p, t }: { p: MotionValue<number>; t: Dict['work']['housing'] }) {
  const step = useStep(p, [0.04, 0.1, 0.16, 0.22, 0.28, TYPE_FROM, 0.63, 0.72, 0.8, 0.9]);
  const typed = useTransform(p, (v) => MESSAGE.slice(0, Math.round(MESSAGE.length * seg(v, TYPE_FROM, TYPE_TO))));
  const writing = step >= 6 && step < 7;

  return (
    <div className="grid items-center gap-5 p-4 pt-3 md:grid-cols-[.8fr_1.2fr] md:gap-7 md:p-7">
      {/* The listing and the agent's checks. */}
      <div>
        <Appear on={step >= 1}>
          <div className="border border-hair bg-card p-3">
            {/* Stock photo (Unsplash), not the real apartment. */}
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/images/apartment.jpg" alt={t.photo} loading="lazy" className="mb-3 aspect-[16/9] w-full object-cover" />
            <p className="text-[15px] font-semibold">{t.listingTitle}</p>
            <p className="text-[13px] text-muted">{t.listingMeta}</p>
          </div>
        </Appear>
        <ul className="mt-3 font-mono text-[12px]">
          {t.checks.map((c, i) => (
            <li
              key={c}
              className={cn(
                'flex justify-between border-b border-hair py-1.5 transition-opacity duration-300',
                step >= i + 2 ? 'opacity-100' : 'opacity-25',
              )}
            >
              <span>{c}</span>
              <span className="text-bot">✓</span>
            </li>
          ))}
        </ul>
      </div>

      {/* The conversation with the seller, as it looked on my phone. */}
      <div className="overflow-hidden rounded-[22px] border border-hair bg-card">
        <ThreadHead name={t.seller} status={t.sellerStatus} initials="S" />
        <Thread className="h-[300px] md:h-[330px]">
          {step >= 1 && <Divider key="posted">{t.posted} · 21:10</Divider>}
          {step >= 7 && (
            <Bubble key="msg" side="right" bot meta={step >= 9 ? `${t.seen}` : `${t.sent} · 21:11`}>
              {MESSAGE}
            </Bubble>
          )}
          {step >= 8 && <Divider key="day">{t.nextDay}</Divider>}
          {step === 8 && <Typing key="typing" side="left" />}
          {step >= 9 && (
            <Bubble key="reply" side="left">
              {t.reply}
            </Bubble>
          )}
          {step >= 10 && (
            <Bubble key="me" side="right">
              {t.myReply}
            </Bubble>
          )}
        </Thread>

        {/* Composer: the agent writes here, then the message is sent. */}
        <div className="flex items-end gap-2 border-t border-hair px-3 py-2.5">
          <div
            className={cn(
              'min-h-9 flex-1 rounded-[18px] border px-3.5 py-2 text-[13px] leading-snug transition-colors',
              writing ? 'border-bot text-ink' : 'border-hair text-faint',
            )}
          >
            {writing ? (
              <>
                <span className="block font-mono text-[10.5px] text-bot">{t.writing}</span>
                <motion.span>{typed}</motion.span>
                <span className="ml-0.5 inline-block h-[13px] w-[6px] animate-caret bg-bot align-[-2px]" />
              </>
            ) : (
              'Aa'
            )}
          </div>
          <span
            className={cn(
              'grid size-9 shrink-0 place-items-center rounded-full text-card transition-colors',
              writing ? 'bg-bot' : 'bg-hair',
            )}
            aria-hidden
          >
            ↑
          </span>
        </div>
      </div>
    </div>
  );
}
