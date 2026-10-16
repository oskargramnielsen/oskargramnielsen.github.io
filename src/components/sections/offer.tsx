'use client';

import { useRef } from 'react';
import type { Dict } from '@/content';
import { useStep, useViewProgress } from '@/lib/motion';
import { cn } from '@/lib/utils';
import { Bubble, Divider, Thread, ThreadHead, Typing } from '../scenes/bits';

/** Line icons for the ways to meet, in the order of t.meet.options. */
const MEET_ICONS = [
  <path key="home" d="M4 11.5 12 5l8 6.5M6.5 10v9h11v-9M10 19v-5h4v5" />,
  <path key="video" d="M4 7.5h11v9H4zM15 11l5-3v8l-5-3" />,
  <path key="phone" d="M7 4h3l1.5 4-2 1.3a10 10 0 0 0 5.2 5.2L16 12.5l4 1.5v3a2 2 0 0 1-2 2A15 15 0 0 1 5 6a2 2 0 0 1 2-2Z" />,
  <path key="chat" d="M5 6h14v9H10l-4 3.5V15H5z" />,
];

/**
 * How it actually goes, shown as the conversation a client would have with me.
 * The steps on the left light up as the thread plays. How we meet is up to the client.
 */
export default function Offer({ t }: { t: Dict['process'] }) {
  const ref = useRef<HTMLDivElement>(null);
  const p = useViewProgress(ref, ['start 0.85', 'end 0.7']);
  const step = useStep(p, [0.04, 0.1, 0.16, 0.25, 0.32, 0.4, 0.48, 0.55, 0.64, 0.7, 0.78, 0.86]);
  const phase = step >= 12 ? 4 : step >= 9 ? 3 : step >= 7 ? 2 : step >= 6 ? 1 : 0;
  const th = t.thread;

  return (
    <section id="how" className="wrap scroll-mt-20 pt-16 md:pt-24">
      <div className="grid items-center gap-10 lg:grid-cols-[1fr_1fr] lg:gap-20">
        <div>
          <h2 className="text-[clamp(32px,4.2vw,62px)] leading-[1.02] font-semibold tracking-[-0.03em]">{t.title}</h2>
          <p className="mt-4 max-w-[520px] text-lg text-body md:text-xl">{t.intro}</p>
          <ol className="relative mt-8 md:mt-10">
            {t.steps.map((s, i) => (
              <li
                key={s.title}
                className={cn(
                  'relative grid grid-cols-[34px_1fr] pb-6 transition-opacity duration-500 last:pb-0',
                  phase >= i ? 'opacity-100' : 'opacity-35',
                )}
              >
                {/* The line down to the next step fills once this step is done. */}
                {i < t.steps.length - 1 && (
                  <span aria-hidden className="absolute top-5 bottom-0 left-[7px] w-px bg-hair">
                    <span
                      className={cn(
                        'block h-full origin-top bg-bot transition-transform duration-700 ease-out-expo',
                        phase > i ? 'scale-y-100' : 'scale-y-0',
                      )}
                    />
                  </span>
                )}
                <span
                  className={cn(
                    'relative mt-[5px] size-[15px] rounded-full border-2 transition-colors duration-500',
                    phase > i || (phase === i && i === t.steps.length - 1)
                      ? 'border-bot bg-bot'
                      : phase === i
                        ? 'border-bot bg-card'
                        : 'border-hair bg-card',
                  )}
                />
                <div>
                  <p className={cn('text-[12px] transition-colors', phase === i ? 'text-bot' : 'text-muted')}>{s.when}</p>
                  <h3 className="mt-0.5 text-[19px] leading-snug font-semibold tracking-[-0.01em] md:text-[21px]">{s.title}</h3>
                  <p className="mt-1 max-w-[480px] text-[15px] leading-snug text-muted md:text-base">{s.text}</p>
                </div>
              </li>
            ))}
          </ol>
        </div>

        <div ref={ref} className="mx-auto w-full max-w-[440px] overflow-hidden rounded-[22px] border border-hair bg-card">
          <ThreadHead name="Oskar" status={th.status} initials="OG" />
          <Thread className="h-[460px]">
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
            {step >= 4 && (
              <Bubble key="you2a" side="right">
                {th.you2a}
              </Bubble>
            )}
            {step >= 5 && (
              <Bubble key="me2" side="left">
                {th.me2}
              </Bubble>
            )}
            {step >= 6 && <Divider key="visit">{th.visit}</Divider>}
            {step === 7 && <Typing key="t2" side="left" />}
            {step >= 8 && (
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
            {step >= 9 && (
              <Bubble key="you2" side="right" meta={step >= 10 ? th.seen : undefined}>
                {th.you2}
              </Bubble>
            )}
            {step === 11 && <Typing key="t3" side="left" bot />}
            {step >= 12 && (
              <Bubble key="bot" side="left" bot>
                <span className="mb-0.5 block font-mono text-[10.5px] opacity-80">{th.botName}</span>
                {th.bot}
              </Bubble>
            )}
          </Thread>
        </div>
      </div>

      {/* How we meet is up to the client. */}
      <div className="mt-12 flex flex-col gap-4 border-y border-hair py-6 md:mt-16 lg:flex-row lg:items-center lg:gap-10">
        <div className="lg:w-[300px] lg:shrink-0">
          <h3 className="text-[19px] leading-snug font-semibold tracking-[-0.01em] md:text-[21px]">{t.meet.title}</h3>
          <p className="mt-1 text-[14px] leading-snug text-muted md:text-[15px]">{t.meet.note}</p>
        </div>
        <ul className="grid flex-1 grid-cols-2 gap-2 sm:grid-cols-4">
          {t.meet.options.map((o, i) => (
            <li key={o} className="flex items-center gap-3 rounded-full border border-hair bg-card py-2 pr-4 pl-2 text-[15px] md:text-base">
              <span className="grid size-9 shrink-0 place-items-center rounded-full bg-shade">
                <svg
                  viewBox="0 0 24 24"
                  className="size-[18px]"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.7"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  aria-hidden
                >
                  {MEET_ICONS[i]}
                </svg>
              </span>
              {o}
            </li>
          ))}
        </ul>
      </div>

      <div className="mt-6 grid gap-px border border-hair bg-hair md:mt-8 md:grid-cols-3">
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
