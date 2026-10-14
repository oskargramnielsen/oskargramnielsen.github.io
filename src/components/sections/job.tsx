'use client';

import { motion, useReducedMotion } from 'motion/react';
import type { Dict } from '@/content';
import { site } from '@/content/site';

const ease = [0.2, 0.8, 0.2, 1] as const;

/** A Gantt chart filling in: project control. */
function Gantt() {
  const bars = [
    [14, 70, false],
    [44, 80, false],
    [70, 96, true],
    [104, 70, false],
  ] as const;
  return (
    <svg viewBox="0 0 220 110" className="h-full w-full" aria-hidden>
      {[40, 80, 120, 160, 200].map((x) => (
        <line key={x} x1={x} x2={x} y1="12" y2="100" className="stroke-hair" strokeWidth="1" />
      ))}
      {bars.map(([x, w, bot], i) => (
        <motion.rect
          key={i}
          x={x}
          y={20 + i * 20}
          height="11"
          rx="5.5"
          className={bot ? 'fill-bot' : 'fill-ink/80'}
          variants={{ hidden: { width: 0 }, shown: { width: w, transition: { duration: 0.8, delay: 0.15 + i * 0.15, ease } } }}
        />
      ))}
    </svg>
  );
}

/** A building with a question and an answer popping up beside it. */
function Building({ chat }: { chat: readonly string[] }) {
  const pop = (d: number) => ({
    hidden: { opacity: 0, scale: 0.6 },
    shown: { opacity: 1, scale: 1, transition: { duration: 0.4, delay: d, ease } },
  });
  return (
    <svg viewBox="0 0 220 110" className="h-full w-full" aria-hidden>
      <g className="fill-none stroke-ink" strokeWidth="1.6">
        <path d="M30 100V34l34-16 34 16v66" />
        {[0, 1, 2, 3].map((r) => (
          <g key={r}>
            <rect x="44" y={44 + r * 13} width="8" height="7" rx="1" />
            <rect x="60" y={44 + r * 13} width="8" height="7" rx="1" />
            <rect x="76" y={44 + r * 13} width="8" height="7" rx="1" />
          </g>
        ))}
      </g>
      <motion.g variants={pop(0.3)} style={{ transformOrigin: '110px 34px' }}>
        <rect x="106" y="22" width="104" height="24" rx="12" className="fill-ink" />
        <text x="158" y="37.5" textAnchor="middle" className="fill-paper text-[9px]">
          {chat[0]}
        </text>
      </motion.g>
      <motion.g variants={pop(0.9)} style={{ transformOrigin: '104px 68px' }}>
        <rect x="100" y="56" width="116" height="24" rx="12" className="fill-bot-soft" />
        <text x="158" y="71.5" textAnchor="middle" className="fill-bot text-[9px]">
          {chat[1]}
        </text>
      </motion.g>
    </svg>
  );
}

/** A bug in a block of code that turns into a fix. */
function Repair() {
  return (
    <svg viewBox="0 0 220 110" className="h-full w-full" aria-hidden>
      {[
        [30, 120],
        [30, 90],
        [44, 110],
        [44, 70],
        [30, 100],
      ].map(([x, w], i) => (
        <rect key={i} x={x} y={18 + i * 16} width={w} height="7" rx="3.5" className={i === 2 ? 'fill-transparent' : 'fill-hair'} />
      ))}
      <motion.rect
        x="44"
        y="50"
        width="110"
        height="7"
        rx="3.5"
        variants={{ hidden: { fill: '#e5484d' }, shown: { fill: '#1f3bff', transition: { delay: 1, duration: 0.4 } } }}
      />
      <motion.g
        variants={{ hidden: { opacity: 0, scale: 0.4 }, shown: { opacity: 1, scale: 1, transition: { delay: 1.1, duration: 0.35, ease } } }}
        style={{ transformOrigin: '180px 54px' }}
      >
        <circle cx="180" cy="54" r="13" className="fill-bot" />
        <path d="m174 54 4.2 4.2 8-8.4" className="fill-none stroke-card" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
      </motion.g>
    </svg>
  );
}

export default function Job({ t }: { t: Dict['job'] }) {
  const reduce = useReducedMotion();
  return (
    <section id="work" className="wrap scroll-mt-20 pt-16 md:pt-24">
      <p className="font-mono text-[13px] text-muted">{t.label}</p>
      <h2 className="mt-3 text-[clamp(32px,4.2vw,62px)] leading-[1.02] font-semibold tracking-[-0.03em]">{t.title}</h2>
      <p className="mt-4 max-w-[640px] text-lg text-body md:text-xl">{t.body}</p>

      <ol className="mt-8 grid gap-3 md:mt-10 md:grid-cols-3">
        {t.items.map((item, i) => {
          const art = [<Gantt key="g" />, <Building key="b" chat={t.chat} />, <Repair key="r" />][i];
          return (
            <motion.li
              key={item.title}
              initial={reduce ? false : 'hidden'}
              whileInView="shown"
              viewport={{ once: true, margin: '-15% 0px' }}
              variants={{ hidden: { opacity: 0, y: 16 }, shown: { opacity: 1, y: 0, transition: { duration: 0.5, delay: i * 0.1 } } }}
              className="overflow-hidden rounded-[20px] border border-hair bg-card"
            >
              <div className="h-[120px] bg-shade px-4 py-3">{art}</div>
              <div className="p-5">
                <h3 className="text-lg leading-tight font-semibold tracking-[-0.01em]">{item.title}</h3>
                <p className="mt-1.5 text-[15px] leading-snug text-muted">{item.text}</p>
              </div>
            </motion.li>
          );
        })}
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
