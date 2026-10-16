'use client';

import { useRef } from 'react';
import { motion, useInView, useReducedMotion } from 'motion/react';
import type { Dict } from '@/content';

// The "price" of each line on the bill: a symbol, not a number, since every office is different.
const svg = (d: React.ReactNode, fill = false) => (
  <svg
    viewBox="0 0 24 24"
    className="size-[22px]"
    fill={fill ? 'currentColor' : 'none'}
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    aria-hidden
  >
    {d}
  </svg>
);
const SYMBOLS: Record<string, React.ReactNode> = {
  time: (
    <>
      <span className="text-[22px] leading-none">+</span>
      {svg(
        <>
          <circle cx="12" cy="12" r="8.5" />
          <path d="M12 7.5V12l3 2" />
        </>,
      )}
    </>
  ),
  check: (
    <>
      {svg(<path d="m5 12.5 4 4 10-10" />)}
      {svg(<path d="m5 12.5 4 4 10-10" />)}
    </>
  ),
  money: <span className="text-[19px] leading-none font-semibold">1×</span>,
  heart: svg(<path d="M12 19.5s-7-4.3-7-9.4A3.9 3.9 0 0 1 12 8a3.9 3.9 0 0 1 7 2.1c0 5.1-7 9.4-7 9.4Z" />, true),
  shield: svg(
    <>
      <rect x="5" y="10.5" width="14" height="10" rx="2.5" fill="currentColor" />
      <path d="M8.5 10.5V8a3.5 3.5 0 0 1 7 0v2.5" />
    </>,
  ),
  moon: <span className="text-[17px] leading-none font-semibold tracking-[-0.02em]">24/7</span>,
};

const pop = (d: number) => ({
  hidden: { opacity: 0, y: 8, scale: 0.9 },
  shown: { opacity: 1, y: 0, scale: 1, transition: { duration: 0.45, delay: d, ease: [0.2, 0.8, 0.2, 1] as const } },
});

/** Line icons for the tools that have no logo of their own. */
const TOOL_ICONS: Record<string, React.ReactNode> = {
  ai: (
    <path d="M12 3.5c.6 4.3 2.2 5.9 6.5 6.5-4.3.6-5.9 2.2-6.5 6.5-.6-4.3-2.2-5.9-6.5-6.5 4.3-.6 5.9-2.2 6.5-6.5ZM18.5 15.5c.3 1.9.9 2.6 2.5 3-1.6.3-2.2 1-2.5 3-.3-2-.9-2.7-2.5-3 1.6-.4 2.2-1.1 2.5-3Z" />
  ),
  api: <path d="M9 7.5 4.5 12 9 16.5M15 7.5l4.5 4.5-4.5 4.5M13 5.5l-2 13" />,
  db: (
    <>
      <ellipse cx="12" cy="6.5" rx="6.5" ry="2.5" />
      <path d="M5.5 6.5v11c0 1.4 2.9 2.5 6.5 2.5s6.5-1.1 6.5-2.5v-11M5.5 12c0 1.4 2.9 2.5 6.5 2.5s6.5-1.1 6.5-2.5" />
    </>
  ),
};

/** The tools on both sides, like app icons, joined in the middle by the customer's process. */
function Stack({ t }: { t: Dict['benefits']['stack'] }) {
  const group = (g: (typeof t.groups)[number], gi: number) => (
    <div key={g.name} className="flex-1">
      <p className="mb-3 text-[12px] text-muted md:text-[13px]">{g.name}</p>
      <ul className="grid grid-cols-3 gap-2 sm:grid-cols-6 md:grid-cols-3">
        {g.tools.map((tool, i) => (
          <motion.li
            key={tool.name}
            variants={pop(0.15 + gi * 0.45 + i * 0.06)}
            className="flex h-[92px] flex-col items-center justify-center gap-2 rounded-[16px] border border-hair bg-paper px-1.5 text-center"
          >
            {TOOL_ICONS[tool.icon] ? (
              <svg
                viewBox="0 0 24 24"
                className="size-8 text-bot"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.6"
                strokeLinecap="round"
                strokeLinejoin="round"
                aria-hidden
              >
                {TOOL_ICONS[tool.icon]}
              </svg>
            ) : (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={`/logos/${tool.icon}.svg`} alt="" className="size-8" loading="lazy" />
            )}
            <span className="text-[12px] leading-tight md:text-[13px]">{tool.name}</span>
          </motion.li>
        ))}
      </ul>
    </div>
  );
  const link = (
    <motion.span
      aria-hidden
      className="mx-auto block h-6 w-px origin-top bg-bot md:mx-0 md:h-px md:w-6 md:origin-left lg:w-10"
      variants={{ hidden: { scale: 0 }, shown: { scale: 1, transition: { delay: 1, duration: 0.4 } } }}
    />
  );
  return (
    <div className="flex flex-col gap-3 md:flex-row md:items-center">
      {group(t.groups[0], 0)}
      {link}
      <motion.span
        variants={pop(1.2)}
        className="mx-auto shrink-0 rounded-full bg-bot px-4 py-2.5 text-center text-[14px] font-medium text-card shadow-[0_10px_24px_-10px_#1f3bff99] md:mx-0"
      >
        {t.center}
      </motion.span>
      {link}
      {group(t.groups[1], 1)}
    </div>
  );
}

/** The bill: a printer slides out the week, itemised. Every benefit is a line, and the total is your hours back. */
function Bill({ t, seen }: { t: Dict['benefits']; seen: boolean }) {
  const reduce = useReducedMotion();
  const b = t.bill;
  return (
    <div className="mx-auto w-full max-w-[540px]">
      <div className="relative z-10 flex h-14 items-center justify-between rounded-[18px] bg-ink px-5 shadow-[0_24px_40px_-24px_#00000099]">
        <span className="font-mono text-[11px] tracking-[0.25em] text-white/45 uppercase">{b.printer}</span>
        <span className="flex items-center gap-2 font-mono text-[11px] text-white/60">
          <span className="size-2 animate-pulse rounded-full bg-[#3ddc84]" />
          {b.printing}
        </span>
        <span aria-hidden className="absolute inset-x-6 -bottom-1 h-2 rounded-full bg-[#050608]" />
      </div>
      <div className="-mt-1 overflow-hidden px-4 pb-8">
        <motion.div
          initial={reduce ? false : { y: '-101%' }}
          animate={seen ? { y: 0 } : undefined}
          transition={{ duration: 2.2, ease: [0.35, 0.5, 0.25, 1] }}
          className="drop-shadow-[0_8px_10px_#0000001f]"
        >
          <div className="bg-card px-6 pt-7 pb-12 [mask:conic-gradient(from_-45deg_at_bottom,#0000,#000_1deg_89deg,#0000_90deg)_50%/18px_100%] sm:px-8">
            <div className="flex items-baseline justify-between gap-4">
              <p className="text-[20px] font-semibold tracking-[-0.02em] sm:text-[22px]">{b.title}</p>
              <p className="shrink-0 font-mono text-[12px] text-muted">{b.when}</p>
            </div>
            <div className="my-5 border-t border-dashed border-ink/25" />
            <ul className="space-y-4">
              {t.items.map((item) => (
                <li key={item.title} className="flex items-center gap-3">
                  <div className="min-w-0">
                    <p className="text-[16px] leading-tight font-semibold">{item.title}</p>
                    <p className="mt-0.5 text-[13.5px] leading-snug text-muted">{item.text}</p>
                  </div>
                  <span aria-hidden className="h-px min-w-4 flex-1 translate-y-1 border-b border-dotted border-ink/30" />
                  <span className="flex shrink-0 items-center gap-0.5 font-mono text-bot">{SYMBOLS[item.icon]}</span>
                </li>
              ))}
            </ul>
            <div className="my-5 border-t border-dashed border-ink/25" />
            <div className="flex items-baseline justify-between gap-4">
              <p className="text-[15px] font-semibold">{b.pay}</p>
              <p className="font-mono text-[15px] font-semibold">{b.payValue}</p>
            </div>
            <div className="mt-3 flex items-end justify-between gap-4">
              <div>
                <p className="text-[15px] font-semibold">{b.get}</p>
                <p className="text-[13px] text-muted">{b.getText}</p>
              </div>
              <p className="text-right text-[clamp(30px,3.2vw,44px)] leading-none font-semibold tracking-[-0.04em] text-bot">
                {b.getValue}
              </p>
            </div>
            <div className="mt-6 flex items-center justify-between gap-4">
              <div
                aria-hidden
                className="h-8 w-32 shrink-0 bg-[repeating-linear-gradient(90deg,#16171c_0_2px,transparent_2px_4px,#16171c_4px_5px,transparent_5px_8px)] sm:w-40"
              />
              <p className="text-right font-mono text-[10.5px] tracking-[0.15em] text-muted uppercase">{b.footer}</p>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}

/** Why automate at all: the bill and a note next to it. */
export default function Benefits({ t }: { t: Dict['benefits'] }) {
  const reduce = useReducedMotion();
  const ref = useRef<HTMLDivElement>(null);
  const seen = useInView(ref, { once: true, margin: '-25% 0px' });
  return (
    <section id="benefits" className="wrap scroll-mt-20 pt-16 md:pt-24">
      <p className="font-mono text-[13px] text-muted">{t.label}</p>
      <h2 className="mt-3 text-[clamp(32px,4.2vw,62px)] leading-[1.02] font-semibold tracking-[-0.03em]">{t.title}</h2>
      <div ref={ref} className="mt-8 grid items-center gap-8 md:mt-12 lg:grid-cols-[minmax(0,540px)_1fr] lg:gap-16">
        <Bill t={t} seen={seen} />
        <div className="text-center lg:text-left">
          <p className="-rotate-2 font-[family-name:var(--font-hand)] text-[clamp(34px,3.4vw,52px)] leading-[1.05] font-semibold whitespace-pre-line text-bot">
            {t.bill.note}
          </p>
          <p className="mx-auto mt-5 max-w-[440px] text-[16px] leading-relaxed text-body md:text-[17px] lg:mx-0">{t.bill.text}</p>
        </div>
      </div>

      <motion.div
        initial={reduce ? false : 'hidden'}
        whileInView="shown"
        viewport={{ once: true, margin: '-15% 0px' }}
        variants={{ hidden: { opacity: 0, y: 16 }, shown: { opacity: 1, y: 0, transition: { duration: 0.5 } } }}
        className="mt-6 grid gap-6 rounded-[24px] border border-hair bg-card p-5 md:mt-10 md:p-7 xl:grid-cols-[.55fr_1.45fr] xl:items-center xl:gap-10"
      >
        <div>
          <h3 className="text-[22px] leading-tight font-semibold tracking-[-0.02em] md:text-[28px]">{t.stack.title}</h3>
          <p className="mt-2 text-[15px] leading-snug text-body md:text-base">{t.stack.text}</p>
        </div>
        <Stack t={t.stack} />
      </motion.div>
    </section>
  );
}
