'use client';

import { motion, useReducedMotion } from 'motion/react';
import type { Dict } from '@/content';

const draw = {
  hidden: { pathLength: 0, opacity: 0 },
  shown: { pathLength: 1, opacity: 1, transition: { duration: 0.9, ease: 'easeOut' as const } },
};

/** Small line icons that draw themselves when the card scrolls in. */
export const ICONS: Record<string, React.ReactNode> = {
  time: (
    <>
      <motion.circle cx="12" cy="12" r="8.5" variants={draw} />
      <motion.path d="M12 7.5V12l3 2" variants={draw} />
    </>
  ),
  check: (
    <>
      <motion.circle cx="12" cy="12" r="8.5" variants={draw} />
      <motion.path d="m8.3 12.2 2.5 2.5 5-5.2" variants={draw} />
    </>
  ),
  money: (
    <>
      <motion.rect x="3.5" y="6.5" width="17" height="11" rx="2" variants={draw} />
      <motion.circle cx="12" cy="12" r="2.6" variants={draw} />
      <motion.path d="M6.5 9.5v.01M17.5 14.5v.01" variants={draw} />
    </>
  ),
  heart: <motion.path d="M12 19.5s-7-4.3-7-9.4A3.9 3.9 0 0 1 12 8a3.9 3.9 0 0 1 7 2.1c0 5.1-7 9.4-7 9.4Z" variants={draw} />,
  shield: (
    <>
      <motion.path d="M12 3.5 5 6.2v5.3c0 4.3 3 7.6 7 9 4-1.4 7-4.7 7-9V6.2l-7-2.7Z" variants={draw} />
      <motion.path d="m9 12 2.2 2.2L15.2 10" variants={draw} />
    </>
  ),
  moon: <motion.path d="M19 14.6A7.5 7.5 0 0 1 9.4 5a7.5 7.5 0 1 0 9.6 9.6Z" variants={draw} />,
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

/** Why automate at all: a few short benefits, each with an icon. */
export default function Benefits({ t }: { t: Dict['benefits'] }) {
  const reduce = useReducedMotion();
  return (
    <section id="benefits" className="wrap scroll-mt-20 pt-16 md:pt-24">
      <p className="font-mono text-[13px] text-muted">{t.label}</p>
      <h2 className="mt-3 text-[clamp(32px,4.2vw,62px)] leading-[1.02] font-semibold tracking-[-0.03em]">{t.title}</h2>
      <ul className="mt-7 grid gap-2.5 sm:grid-cols-2 md:mt-10 md:gap-3 lg:grid-cols-3">
        {t.items.map((b, i) => (
          <motion.li
            key={b.title}
            initial={reduce ? false : 'hidden'}
            whileInView="shown"
            viewport={{ once: true, margin: '-10% 0px' }}
            variants={{
              hidden: { opacity: 0, y: 16 },
              shown: { opacity: 1, y: 0, transition: { duration: 0.5, delay: (i % 3) * 0.08, when: 'beforeChildren' } },
            }}
            className="group flex gap-4 rounded-[20px] border border-hair bg-card p-4 transition-[border-color,translate] duration-300 hover:-translate-y-0.5 hover:border-bot/40 sm:block md:p-6"
          >
            <span className="grid size-10 shrink-0 place-items-center rounded-full bg-bot-soft text-bot md:size-11">
              <svg
                viewBox="0 0 24 24"
                className="size-5 md:size-[22px]"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.7"
                strokeLinecap="round"
                strokeLinejoin="round"
                aria-hidden
              >
                {ICONS[b.icon]}
              </svg>
            </span>
            <div>
              <h3 className="text-[17px] leading-tight font-semibold tracking-[-0.01em] sm:mt-4 md:mt-5 md:text-xl">{b.title}</h3>
              <p className="mt-1 text-[14px] leading-snug text-muted md:mt-1.5 md:text-[15px]">{b.text}</p>
            </div>
          </motion.li>
        ))}
      </ul>

      <motion.div
        initial={reduce ? false : 'hidden'}
        whileInView="shown"
        viewport={{ once: true, margin: '-15% 0px' }}
        variants={{ hidden: { opacity: 0, y: 16 }, shown: { opacity: 1, y: 0, transition: { duration: 0.5 } } }}
        className="mt-3 grid gap-6 rounded-[24px] border border-hair bg-card p-5 md:mt-4 md:p-7 xl:grid-cols-[.55fr_1.45fr] xl:items-center xl:gap-10"
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
