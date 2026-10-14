'use client';

import { useRef } from 'react';
import { motion, useTransform } from 'motion/react';
import type { Dict } from '@/content';
import { site } from '@/content/site';
import { useViewProgress } from '@/lib/motion';

/** A line that starts hidden and is revealed as it scrolls into view. */
function Item({ i, text }: { i: number; text: string }) {
  const ref = useRef<HTMLLIElement>(null);
  const p = useViewProgress(ref, ['start 0.92', 'start 0.55']);
  const scaleX = useTransform(p, [0, 1], [1, 0]);
  return (
    <li ref={ref} className="grid grid-cols-[32px_1fr] border-t border-hair py-5 text-lg leading-snug md:text-xl">
      <span className="pt-1 font-mono text-[13px] text-muted">{String(i + 1).padStart(2, '0')}</span>
      <span className="relative">
        {text}
        <motion.span aria-hidden className="absolute -inset-y-0.5 right-0 left-0 origin-right bg-paper" style={{ scaleX }} />
      </span>
    </li>
  );
}

export default function Job({ t }: { t: Dict['job'] }) {
  return (
    <section id="work" className="wrap scroll-mt-20 pt-24 pb-8 md:pt-32">
      <div className="grid gap-12 lg:grid-cols-[1.2fr_.8fr] lg:gap-20">
        <div>
          <p className="font-mono text-[13px] text-muted">{t.label}</p>
          <h2 className="mt-3 text-[clamp(32px,4.2vw,62px)] leading-[1.02] font-semibold tracking-[-0.03em]">{t.title}</h2>
          <p className="mt-4 max-w-[620px] text-lg text-body md:text-xl">{t.body}</p>

          <ol className="mt-10">
            {t.items.map((item, i) => (
              <Item key={i} i={i} text={item} />
            ))}
          </ol>
          <p className="border-t border-hair pt-5 text-lg font-medium text-bot">{t.privacy}</p>
        </div>

        <dl className="self-end text-[15px]">
          {t.facts.map((f) => (
            <div key={f.k} className="grid grid-cols-[110px_1fr] border-b border-hair py-3.5">
              <dt className="text-muted">{f.k}</dt>
              <dd>{f.v}</dd>
            </div>
          ))}
          <div className="grid grid-cols-[110px_1fr] border-b border-hair py-3.5">
            <dt className="text-muted">{t.cvLabel}</dt>
            <dd>
              <a href={site.cv} download className="underline underline-offset-4 hover:text-bot">
                {t.cv}
              </a>
            </dd>
          </div>
        </dl>
      </div>
    </section>
  );
}
