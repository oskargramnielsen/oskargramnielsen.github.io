'use client';

import { useRef } from 'react';
import { motion, useTransform } from 'motion/react';
import type { Dict } from '@/content';
import { seg, useViewProgress } from '@/lib/motion';

/** The manual task gets struck through and the automated version slides in, following the scroll. */
function Row({ before, after }: { before: string; after: string }) {
  const ref = useRef<HTMLLIElement>(null);
  const p = useViewProgress(ref, ['start 0.9', 'start 0.5']);
  // An inline background works across wrapped lines, unlike an absolute line.
  const strike = useTransform(p, (v) => `${seg(v, 0, 0.5) * 100}% 2px`);
  const fade = useTransform(p, (v) => 1 - seg(v, 0.2, 0.6) * 0.55);
  const show = useTransform(p, (v) => seg(v, 0.35, 1));
  const x = useTransform(show, [0, 1], [-16, 0]);

  return (
    <li ref={ref} className="grid gap-2 border-t border-hair py-5 md:grid-cols-2 md:gap-10 md:py-6">
      <motion.p style={{ opacity: fade }} className="self-start text-lg leading-snug md:text-xl">
        <motion.span
          className="bg-[linear-gradient(var(--color-bot),var(--color-bot))] bg-no-repeat [background-position:0_58%] [box-decoration-break:clone]"
          style={{ backgroundSize: strike }}
        >
          {before}
        </motion.span>
      </motion.p>
      <motion.p style={{ opacity: show, x }} className="text-base leading-snug text-bot md:text-lg">
        → {after}
      </motion.p>
    </li>
  );
}

export default function Examples({ t, cta }: { t: Dict['examples']; cta: string }) {
  return (
    <section id="examples" className="wrap scroll-mt-20 pt-24 pb-8 md:pt-36">
      <h2 className="text-[clamp(32px,4.2vw,62px)] leading-[1.02] font-semibold tracking-[-0.03em]">{t.title}</h2>
      <p className="mt-4 max-w-[600px] text-lg text-body md:text-xl">{t.intro}</p>
      <ul className="mt-10 md:mt-12">
        {t.items.map((item) => (
          <Row key={item.before} {...item} />
        ))}
      </ul>
      <div className="flex flex-col gap-5 border-t border-hair pt-6 sm:flex-row sm:items-center sm:justify-between">
        <p className="text-lg font-medium md:text-xl">{t.outro}</p>
        <a
          href="#contact"
          className="group inline-flex shrink-0 items-center justify-center gap-3 border-[1.5px] border-ink bg-ink px-5.5 py-4 text-[17px] font-medium text-paper transition-colors duration-300 hover:border-bot hover:bg-bot"
        >
          {cta}
          <span aria-hidden className="transition-transform duration-300 group-hover:translate-x-1">
            →
          </span>
        </a>
      </div>
    </section>
  );
}
