'use client';

import { useRef } from 'react';
import type { Dict } from '@/content';
import { useStep, useViewProgress } from '@/lib/motion';
import { cn } from '@/lib/utils';
import { Bubble, Thread, ThreadHead, Typing } from '../scenes/bits';

/**
 * The method, shown as the conversation a client would have with me.
 * The steps on the left light up as the thread plays.
 */
export default function Offer({ t }: { t: Dict['process'] }) {
  const ref = useRef<HTMLDivElement>(null);
  const p = useViewProgress(ref, ['start 0.85', 'end 0.7']);
  const step = useStep(p, [0.05, 0.18, 0.26, 0.38, 0.46, 0.6, 0.72, 0.8, 0.9]);
  const phase = step >= 8 ? 2 : step >= 3 ? 1 : 0;
  const th = t.thread;

  return (
    <section id="how" className="wrap scroll-mt-20 pt-16 md:pt-24">
      <div className="grid items-center gap-10 lg:grid-cols-[1fr_1fr] lg:gap-20">
        <div>
          <h2 className="text-[clamp(32px,4.2vw,62px)] leading-[1.02] font-semibold tracking-[-0.03em]">{t.title}</h2>
          <ol className="mt-8 md:mt-10">
            {t.steps.map((s, i) => (
              <li
                key={s}
                className={cn(
                  'grid grid-cols-[40px_1fr] border-t border-hair py-4 text-xl leading-snug tracking-[-0.01em] transition-opacity duration-500 md:text-2xl',
                  phase >= i ? 'opacity-100' : 'opacity-30',
                )}
              >
                <span className={cn('pt-1.5 font-mono text-sm transition-colors', phase === i ? 'text-bot' : 'text-muted')}>
                  {String(i + 1).padStart(2, '0')}
                </span>
                {s}
              </li>
            ))}
          </ol>
        </div>

        <div ref={ref} className="mx-auto w-full max-w-[440px] overflow-hidden rounded-[22px] border border-hair bg-card">
          <ThreadHead name="Oskar" status={th.status} initials="OG" />
          <Thread className="h-[420px]">
            {step >= 1 && (
              <Bubble key="you1" side="right">
                {th.you1}
              </Bubble>
            )}
            {step === 2 && <Typing key="t1" side="left" />}
            {step >= 3 && (
              <Bubble key="me1" side="left">
                {th.me1}
              </Bubble>
            )}
            {step === 4 && <Typing key="t2" side="left" />}
            {step >= 5 && (
              <Bubble key="plan" side="left" className="w-[260px] max-w-full p-0">
                <div className="flex items-center gap-3 border-b border-hair px-3.5 py-2.5">
                  <span className="grid h-9 w-7 place-items-center border border-ink bg-card font-mono text-[9px]">PDF</span>
                  <span className="min-w-0">
                    <b className="block truncate text-[14px] font-medium">{th.planTitle}</b>
                    <span className="font-mono text-[11px] text-bot">{th.free}</span>
                  </span>
                </div>
                <ul className="px-3.5 py-2 font-mono text-[11.5px] leading-[1.8] text-muted">
                  {th.planItems.map((it) => (
                    <li key={it}>· {it}</li>
                  ))}
                </ul>
              </Bubble>
            )}
            {step >= 6 && (
              <Bubble key="you2" side="right" meta={step >= 7 ? th.seen : undefined}>
                {th.you2}
              </Bubble>
            )}
            {step === 8 && <Typing key="t3" side="left" bot />}
            {step >= 9 && (
              <Bubble key="bot" side="left" bot>
                <span className="mb-0.5 block font-mono text-[10.5px] opacity-80">{th.botName}</span>
                {th.bot}
              </Bubble>
            )}
          </Thread>
        </div>
      </div>

      <div className="mt-10 grid gap-px border border-hair bg-hair md:mt-14 md:grid-cols-3">
        {t.pricing.items.map((it, i) => (
          <div key={it.label} className="bg-paper p-5 md:p-6">
            <span className="font-mono text-[12px] text-muted">{it.label}</span>
            <b className={cn('mt-1 block text-[28px] leading-tight font-semibold tracking-[-0.03em]', i === 0 && 'text-bot')}>{it.price}</b>
            <p className="mt-2 text-[15px] leading-snug text-body">{it.note}</p>
          </div>
        ))}
      </div>
      <p className="mt-3 font-mono text-[11px] text-muted">{t.pricing.footnote}</p>
    </section>
  );
}
