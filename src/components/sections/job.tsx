'use client';

import { motion, useReducedMotion } from 'motion/react';
import type { Dict } from '@/content';
import { site } from '@/content/site';

const ease = [0.2, 0.8, 0.2, 1] as const;
const pop = (d: number) => ({
  hidden: { opacity: 0, y: 8, scale: 0.94 },
  shown: { opacity: 1, y: 0, scale: 1, transition: { duration: 0.45, delay: d, ease } },
});

/** A big project schedule filling in, with today's line and a delay caught early. */
function Gantt({ t }: { t: Dict['job']['gantt'] }) {
  // [x, width] on a 360 wide canvas. The facade bar is the one running late.
  const bars = [
    [86, 70],
    [130, 64],
    [170, 96],
    [236, 70],
    [250, 80],
    [322, 26],
  ] as const;
  return (
    <svg viewBox="0 0 360 192" className="h-full w-full" aria-hidden>
      {[86, 152, 218, 284, 350].map((x) => (
        <line key={x} x1={x} x2={x} y1="8" y2="156" className="stroke-hair" strokeWidth="1" />
      ))}
      {bars.map(([x, w], i) => (
        <g key={i}>
          <text x="0" y={24 + i * 25} className="fill-muted text-[10.5px]">
            {t.rows[i]}
          </text>
          <motion.rect
            x={x}
            y={15 + i * 25}
            height="12"
            rx="6"
            className="fill-ink/80"
            variants={{ hidden: { width: 0 }, shown: { width: w, transition: { duration: 0.7, delay: 0.1 + i * 0.12, ease } } }}
          />
        </g>
      ))}
      {/* The facade is late: its bar grows past plan and turns red. */}
      <motion.rect
        x="236"
        y="90"
        height="12"
        rx="6"
        fill="#e5484d"
        variants={{ hidden: { width: 0, opacity: 0 }, shown: { width: 92, opacity: 1, transition: { duration: 0.6, delay: 1.1, ease } } }}
      />
      <motion.g variants={{ hidden: { opacity: 0 }, shown: { opacity: 1, transition: { delay: 0.8 } } }}>
        <line x1="220" x2="220" y1="4" y2="156" className="stroke-bot" strokeWidth="1.4" strokeDasharray="3 3" />
        <rect x="200" y="0" width="40" height="13" rx="6.5" className="fill-bot" />
        <text x="220" y="9.5" textAnchor="middle" className="fill-card text-[8.5px] font-medium">
          {t.today}
        </text>
      </motion.g>
      <motion.g variants={pop(1.6)} style={{ transformOrigin: '250px 176px' }}>
        <rect x="148" y="164" width="204" height="24" rx="12" className="fill-bot" />
        <circle cx="163" cy="176" r="3.5" className="fill-card" />
        <text x="174" y="180" className="fill-card text-[10.5px] font-medium">
          {t.alert}
        </text>
      </motion.g>
    </svg>
  );
}

/** A question to the company chatbot, answered with its source. */
function Chat({ t }: { t: Dict['job']['chat'] }) {
  return (
    <div className="flex h-full flex-col justify-center gap-2 text-[13px] leading-snug md:text-[14px]">
      <motion.p variants={pop(0)} className="mb-1 flex items-center gap-2 text-[12px] text-muted">
        <span className="grid size-6 place-items-center rounded-full bg-bot text-[10px] font-semibold text-card">AI</span>
        <span>
          <b className="font-medium text-ink">{t.name}</b> · {t.status}
        </span>
      </motion.p>
      <motion.p variants={pop(0.2)} className="max-w-[82%] self-end rounded-[16px] rounded-br-[5px] bg-ink px-3.5 py-2 text-paper">
        {t.q}
      </motion.p>
      <motion.div variants={pop(0.8)} className="max-w-[86%] self-start rounded-[16px] rounded-bl-[5px] bg-bot-soft px-3.5 py-2 text-bot">
        {t.a}
        <span className="mt-1.5 flex w-fit items-center gap-1.5 rounded-full bg-card px-2.5 py-1 text-[11.5px] text-ink">
          <svg
            viewBox="0 0 24 24"
            className="size-3.5"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.8"
            strokeLinejoin="round"
            aria-hidden
          >
            <path d="M6 3h8l4 4v14H6z" />
            <path d="M14 3v4h4" />
          </svg>
          {t.source}
        </span>
      </motion.div>
    </div>
  );
}

/** The tools on both sides, joined in the middle by the customer's process. */
function Stack({ t }: { t: Dict['job']['stack'] }) {
  const group = (g: (typeof t.groups)[number], gi: number) => (
    <div key={g.name} className="flex-1">
      <p className="mb-2 text-[12px] text-muted">{g.name}</p>
      <div className="flex flex-wrap gap-1.5">
        {g.tools.map((tool, i) => (
          <motion.span
            key={tool}
            variants={pop(0.15 + gi * 0.5 + i * 0.07)}
            className="rounded-full border border-hair bg-card px-3 py-1.5 text-[13px] whitespace-nowrap md:text-[14px]"
          >
            {tool}
          </motion.span>
        ))}
      </div>
    </div>
  );
  const link = (d: number) => (
    <motion.span
      aria-hidden
      className="mx-auto block h-5 w-px origin-top bg-bot md:mx-0 md:h-px md:w-8 md:origin-left lg:w-12"
      variants={{ hidden: { scale: 0 }, shown: { scale: 1, transition: { delay: d, duration: 0.4 } } }}
    />
  );
  return (
    <div className="flex flex-col gap-3 md:flex-row md:items-center md:gap-3">
      {group(t.groups[0], 0)}
      {link(1)}
      <motion.span
        variants={pop(1.2)}
        className="mx-auto shrink-0 rounded-full bg-bot px-4 py-2.5 text-center text-[14px] font-medium text-card shadow-[0_10px_24px_-10px_#1f3bff99] md:mx-0"
      >
        {t.center}
      </motion.span>
      {link(1)}
      {group(t.groups[1], 1)}
    </div>
  );
}

export default function Job({ t }: { t: Dict['job'] }) {
  const reduce = useReducedMotion();
  const reveal = (i: number) => ({
    initial: reduce ? false : ('hidden' as const),
    whileInView: 'shown',
    viewport: { once: true, margin: '-15% 0px' },
    variants: { hidden: { opacity: 0, y: 16 }, shown: { opacity: 1, y: 0, transition: { duration: 0.5, delay: i * 0.1 } } },
  });

  return (
    <section id="work" className="wrap scroll-mt-20 pt-16 md:pt-24">
      <p className="font-mono text-[13px] text-muted">{t.label}</p>
      <h2 className="mt-3 text-[clamp(32px,4.2vw,62px)] leading-[1.02] font-semibold tracking-[-0.03em]">{t.title}</h2>
      <p className="mt-4 max-w-[640px] text-lg text-body md:text-xl">{t.body}</p>

      <ol className="mt-8 grid gap-3 md:mt-10 lg:grid-cols-2 lg:gap-4">
        {t.items.map((item, i) => (
          <motion.li key={item.title} {...reveal(i)} className="flex flex-col overflow-hidden rounded-[24px] border border-hair bg-card">
            <div className="h-[220px] bg-shade px-5 py-5 md:h-[280px] md:px-8 md:py-6">
              {i === 0 ? <Gantt t={t.gantt} /> : <Chat t={t.chat} />}
            </div>
            <div className="flex flex-1 flex-col p-5 md:p-7">
              <h3 className="text-[22px] leading-tight font-semibold tracking-[-0.02em] md:text-[28px]">{item.title}</h3>
              <p className="mt-2 text-[15px] leading-snug text-body md:text-base">{item.text}</p>
              <p className="mt-auto pt-4 text-[15px] text-muted md:text-base">
                <b className="font-medium text-ink">{t.forYou}</b> {item.forYou}
              </p>
            </div>
          </motion.li>
        ))}
        <motion.li
          {...reveal(2)}
          className="grid gap-6 rounded-[24px] border border-hair bg-card p-5 md:p-7 lg:col-span-2 lg:grid-cols-[.8fr_1.2fr] lg:items-center lg:gap-12"
        >
          <div>
            <h3 className="text-[22px] leading-tight font-semibold tracking-[-0.02em] md:text-[28px]">{t.stack.title}</h3>
            <p className="mt-2 text-[15px] leading-snug text-body md:text-base">{t.stack.text}</p>
          </div>
          <Stack t={t.stack} />
        </motion.li>
      </ol>

      <div className="mt-5 flex flex-wrap items-center gap-x-5 gap-y-2 text-[14px] text-muted">
        <span className="font-medium text-bot">{t.privacy}</span>
        {t.facts.map((f) => (
          <span key={f.k}>
            <span className="text-faint">{f.k}</span> {f.v}
          </span>
        ))}
        <a href={site.cv} download className="text-ink underline underline-offset-4 hover:text-bot">
          {t.cvLabel} · {t.cv}
        </a>
      </div>
    </section>
  );
}
