'use client';

import { useRef } from 'react';
import { motion, useTransform } from 'motion/react';
import type { Dict } from '@/content';
import { seg, useViewProgress } from '@/lib/motion';
import { cn } from '@/lib/utils';

function Step({ i, n, text, p }: { i: number; n: number; text: string; p: ReturnType<typeof useViewProgress> }) {
  const on = useTransform(p, (v) => seg(v, i / n, (i + 0.6) / n));
  const opacity = useTransform(on, [0, 1], [0.25, 1]);
  return (
    <motion.li style={{ opacity }} className="relative md:pt-7">
      <span className={cn('absolute -top-[7px] left-0 hidden size-3.5 rounded-full border-2 border-bot bg-paper md:block')} />
      <span className="font-mono text-sm text-bot">{String(i + 1).padStart(2, '0')}</span>
      <p className="mt-2 max-w-[340px] text-xl leading-snug tracking-[-0.01em] md:text-2xl">{text}</p>
    </motion.li>
  );
}

export default function Offer({ t }: { t: Dict['process'] }) {
  const ref = useRef<HTMLOListElement>(null);
  const p = useViewProgress(ref, ['start 0.85', 'end 0.55']);

  return (
    <section id="how" className="wrap scroll-mt-20 pt-24 pb-8 md:pt-36">
      <h2 className="text-[clamp(32px,4.2vw,62px)] leading-[1.02] font-semibold tracking-[-0.03em]">{t.title}</h2>

      <ol ref={ref} className="relative mt-12 grid gap-10 md:grid-cols-3 md:gap-8">
        {/* The line fills as you scroll through the steps. */}
        <span aria-hidden className="absolute top-0 right-0 left-0 hidden h-0.5 bg-hair md:block" />
        <motion.span aria-hidden className="absolute top-0 right-0 left-0 hidden h-0.5 origin-left bg-bot md:block" style={{ scaleX: p }} />
        {t.steps.map((s, i) => (
          <Step key={s} i={i} n={t.steps.length} text={s} p={p} />
        ))}
      </ol>

      <ul className="mt-16 grid gap-px border border-hair bg-hair md:grid-cols-3">
        {t.promises.map((pr) => (
          <li key={pr.title} className="bg-card p-5 md:p-6">
            <p className="flex items-center gap-2 font-medium">
              <span className="text-bot">✓</span>
              {pr.title}
            </p>
            <p className="mt-2 text-[15px] leading-relaxed text-muted">{pr.body}</p>
          </li>
        ))}
      </ul>
    </section>
  );
}
