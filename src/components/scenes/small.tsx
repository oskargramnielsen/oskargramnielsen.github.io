'use client';

import { useRef } from 'react';
import { motion, useTransform } from 'motion/react';
import type { Dict } from '@/content';
import { seg, useStep, useViewProgress } from '@/lib/motion';
import { cn } from '@/lib/utils';
import { Appear } from './bits';

type W = Dict['work'];

function Card({ id, name, href, body, children }: { id: string; name: string; href: string; body: string; children: React.ReactNode }) {
  return (
    <article id={id} className="flex scroll-mt-20 flex-col border-t border-ink pt-6">
      <a href={href} target="_blank" rel="noopener noreferrer" className="group inline-flex w-fit items-baseline gap-2">
        <h3 className="text-2xl font-semibold tracking-[-0.02em] transition-colors group-hover:text-bot">{name}</h3>
        <span className="font-mono text-xs text-muted group-hover:text-bot">{href.replace('https://', '')} ↗</span>
      </a>
      <p className="mt-2 mb-6 max-w-[520px] text-base text-body">{body}</p>
      {children}
    </article>
  );
}

export function Artsrig({ t }: { t: W['artsrig'] }) {
  const ref = useRef<HTMLDivElement>(null);
  const p = useViewProgress(ref);
  const typed = useTransform(p, (v) => t.address.slice(0, Math.round(t.address.length * seg(v, 0, 0.3))));
  const step = useStep(p, [0.36, 0.45, 0.53, 0.6, 0.67, 0.74, 0.86]);

  return (
    <Card id="artsrig" name={t.name} href="https://artsrig.dk" body={t.body}>
      <div ref={ref} className="mt-auto border border-hair bg-card p-4 md:p-5">
        <div className="flex items-center border border-hair px-3 py-2.5 font-mono text-[13px]">
          <span className="mr-2 text-faint">⌕</span>
          <motion.span>{typed}</motion.span>
          <span className="ml-0.5 inline-block h-[14px] w-[6px] animate-caret bg-ink" />
        </div>
        <Appear on={step >= 1} className="mt-3 flex justify-between border-b border-hair pb-2 font-mono text-[12px]">
          <span className="text-muted">{t.soil}</span>
          <span className="text-bot">{t.soilValue}</span>
        </Appear>
        <Appear on={step >= 2} className="mt-3 font-mono text-[11px] text-muted">
          {t.missing}
        </Appear>
        <div className="mt-2 flex min-h-[64px] flex-wrap content-start gap-1.5">
          {t.species.map((s, i) => (
            <span
              key={s}
              className={cn(
                'bg-bot-soft px-2 py-0.5 text-[12px] text-bot transition-[opacity,scale] duration-300',
                step >= i + 2 ? 'scale-100 opacity-100' : 'scale-90 opacity-0',
              )}
            >
              {s}
            </span>
          ))}
        </div>
        <Appear on={step >= 7} className="mt-3 flex items-center gap-3 border border-bot px-3 py-2.5">
          <span className="grid size-8 place-items-center bg-bot text-sm text-card" aria-hidden>
            ✿
          </span>
          <span className="font-mono text-[13px] text-bot">{t.mix}</span>
        </Appear>
      </div>
    </Card>
  );
}

// Who is available which day. Thursday (index 3) works for everyone.
const YES = [
  [1, 0, 1, 1, 0],
  [0, 1, 0, 1, 1],
  [1, 1, 0, 1, 0],
  [0, 0, 1, 1, 1],
  [1, 0, 0, 1, 1],
];

export function Hvilkendag({ t }: { t: W['hvilkendag'] }) {
  const ref = useRef<HTMLDivElement>(null);
  const p = useViewProgress(ref);
  const filled = useStep(p, YES.map((_, i) => 0.08 + i * 0.13));
  const step = useStep(p, [0.78, 0.88]);

  return (
    <Card id="hvilkendag" name={t.name} href="https://hvilkendag.dk" body={t.body}>
      <div ref={ref} className="mt-auto border border-hair bg-card p-4 md:p-5">
        <table className="w-full table-fixed font-mono text-[12px]">
          <thead>
            <tr>
              <th className="w-[30%]" />
              {t.days.map((d, j) => (
                <th key={d} className={cn('pb-2 font-normal transition-colors', step >= 1 && j === 3 ? 'text-bot' : 'text-muted')}>
                  {d}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {t.people.map((name, i) => (
              <tr key={name} className="border-t border-hair">
                <td className="py-1.5 text-muted">{name}</td>
                {YES[i].map((y, j) => (
                  <td key={j} className={cn('py-1.5 text-center transition-colors duration-300', step >= 1 && j === 3 && 'bg-bot-soft')}>
                    <span
                      className={cn(
                        'transition-opacity duration-300',
                        filled > i ? 'opacity-100' : 'opacity-0',
                        y ? (j === 3 && step >= 1 ? 'text-bot' : 'text-ink') : 'text-faint',
                      )}
                    >
                      {y ? '✓' : '·'}
                    </span>
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
        <Appear on={step >= 2} className="mt-3 font-mono text-[13px] text-bot">
          → {t.result}
        </Appear>
      </div>
    </Card>
  );
}
