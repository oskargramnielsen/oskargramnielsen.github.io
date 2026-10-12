'use client';

import { motion } from 'motion/react';
import type { Dict } from '@/content';

export default function Offer({ t }: { t: Dict['offer'] }) {
  return (
    <section id="how" className="wrap scroll-mt-20 py-24 md:py-32">
      <h2 className="text-[clamp(32px,4.2vw,62px)] leading-[1.02] font-semibold tracking-[-0.03em]">{t.title}</h2>
      <ol className="mt-12 md:mt-14">
        {t.steps.map((s, i) => (
          <motion.li
            key={s.when}
            className="grid gap-2 border-t border-hair py-6 md:grid-cols-[160px_1fr] md:gap-10 md:py-8"
            initial={{ opacity: 0, y: 18 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.6 }}
            transition={{ duration: 0.8, delay: i * 0.08, ease: [0.2, 0.8, 0.2, 1] }}
          >
            <span className="font-mono text-sm text-muted">{s.when}</span>
            <p className="max-w-[760px] text-xl leading-snug tracking-[-0.01em] md:text-2xl">
              {s.text}
              {s.em && <em className="not-italic text-bot">{s.em}</em>}
              {s.tail}
            </p>
          </motion.li>
        ))}
      </ol>
    </section>
  );
}
