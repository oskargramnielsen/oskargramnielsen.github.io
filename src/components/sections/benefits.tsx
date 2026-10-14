'use client';

import { motion, useReducedMotion } from 'motion/react';
import type { Dict } from '@/content';

const draw = {
  hidden: { pathLength: 0, opacity: 0 },
  shown: { pathLength: 1, opacity: 1, transition: { duration: 0.9, ease: 'easeOut' as const } },
};

/** Small line icons that draw themselves when the card scrolls in. */
const ICONS: Record<string, React.ReactNode> = {
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
    </section>
  );
}
