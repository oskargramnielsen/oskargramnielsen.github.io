'use client';

import { motion } from 'motion/react';
import type { Dict } from '@/content';
import { site } from '@/content/site';

/** Splits "{{x}}" markers into permanent redaction bars. */
function Redacted({ text, label }: { text: string; label: string }) {
  return text.split('{{x}}').map((part, i, all) => (
    <span key={i}>
      {part}
      {i < all.length - 1 && (
        <span title={label} aria-label={label} className="mx-0.5 inline-block h-[0.9em] w-[7.5em] translate-y-[0.12em] bg-ink" />
      )}
    </span>
  ));
}

export default function Job({ t }: { t: Dict['job'] }) {
  return (
    <section id="me" className="wrap scroll-mt-20 py-24 md:py-32">
      <div className="grid gap-12 lg:grid-cols-[1.2fr_.8fr] lg:gap-20">
        <div>
          <p className="font-mono text-[13px] text-muted">{t.label}</p>
          <h2 className="mt-3 text-[clamp(28px,3.4vw,48px)] leading-[1.05] font-semibold tracking-[-0.03em] text-balance">{t.title}</h2>
          <p className="mt-5 max-w-[620px] text-body">{t.body}</p>

          <ol className="mt-10">
            {t.items.map((item, i) => (
              <li key={i} className="grid grid-cols-[32px_1fr] border-t border-hair py-5 text-lg leading-snug md:text-xl">
                <span className="pt-1 font-mono text-[13px] text-muted">{String(i + 1).padStart(2, '0')}</span>
                {/* The whole line starts blacked out and is "declassified" as it scrolls in. */}
                <span className="relative">
                  <Redacted text={item} label={t.redacted} />
                  <motion.span
                    aria-hidden
                    className="absolute inset-y-0.5 left-0 right-0 origin-right bg-ink motion-reduce:hidden"
                    initial={{ scaleX: 1 }}
                    whileInView={{ scaleX: 0 }}
                    viewport={{ once: true, amount: 0.9 }}
                    transition={{ duration: 0.9, delay: 0.25 + i * 0.25, ease: [0.7, 0, 0.2, 1] }}
                  />
                </span>
              </li>
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
