'use client';

import { useEffect, useState } from 'react';
import { AnimatePresence, motion, useReducedMotion } from 'motion/react';
import type { Dict } from '@/content';
import { cn } from '@/lib/utils';
import { revealProject } from './work';

/**
 * A calm status board of the agents described further down. One running
 * agent updates its status at a time; each row links to its story.
 */
export default function AgentBoard({ t }: { t: Dict['hero'] }) {
  const reduce = useReducedMotion();
  const live = t.agents.map((a, i) => (a.live ? i : -1)).filter((i) => i >= 0);
  const [state, setState] = useState(() => ({ active: -1, status: t.agents.map(() => 0) }));

  useEffect(() => {
    if (reduce) return;
    let n = 0;
    const timer = setInterval(() => {
      const a = live[n++ % live.length];
      setState((s) => ({
        active: a,
        status: s.status.map((v, i) => (i === a ? (v + 1) % t.agents[i].status.length : v)),
      }));
    }, 3200);
    return () => clearInterval(timer);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [reduce, t.agents]);

  const active = state.active;
  const statusOf = (i: number) => t.agents[i].status[state.status[i]];

  return (
    <div>
      <div className="border border-hair bg-card shadow-[0_1px_0_#0000000a,0_30px_60px_-40px_#00000040]">
        <div className="flex justify-between border-b border-hair px-4 py-3 font-mono text-xs text-muted md:px-5">
          <span className="text-ink">{t.board}</span>
          <span>
            {live.length} {t.running} · {t.agents.length - live.length} {t.retired}
          </span>
        </div>
        <ul>
          {t.agents.map((a, i) => (
            <li key={a.name}>
              <a
                href={`#${a.id}`}
                onClick={(e) => {
                  e.preventDefault();
                  revealProject(a.id);
                }}
                className="group grid grid-cols-[1fr_auto] gap-x-3 gap-y-0.5 border-b border-hair px-4 py-3 last:border-b-0 hover:bg-bot-soft/50 md:px-5 md:py-3.5"
              >
                <span className="font-mono text-[13px] text-bot">{a.name}</span>
                <span className="flex items-center gap-1.5 font-mono text-[11px] text-muted">
                  <span
                    className={cn(
                      'size-[7px] rounded-full',
                      a.live ? 'bg-bot' : 'border border-faint',
                      a.live && i === active && !reduce && 'animate-pulse',
                    )}
                  />
                  {a.live ? t.running : t.retired}
                </span>
                <span className="col-span-2 text-sm text-ink">{a.job}</span>
                <span className="col-span-2 h-[18px] overflow-hidden font-mono text-xs">
                  <AnimatePresence mode="wait" initial={false}>
                    <motion.span
                      key={statusOf(i)}
                      className={cn('block truncate', a.live ? 'text-bot' : 'text-faint')}
                      initial={{ y: 14, opacity: 0 }}
                      animate={{ y: 0, opacity: 1 }}
                      exit={{ y: -14, opacity: 0 }}
                      transition={{ duration: 0.35 }}
                    >
                      → {statusOf(i)}
                    </motion.span>
                  </AnimatePresence>
                </span>
              </a>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
