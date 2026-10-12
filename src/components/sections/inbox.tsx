'use client';

import { useEffect, useRef, useState } from 'react';
import { useReducedMotion } from 'motion/react';
import type { Dict } from '@/content';
import { cn } from '@/lib/utils';

type Mail = Dict['hero']['mails'][number] & { id: number };

const MAX_ROWS = 7;
const UNREAD_ROWS = 3;

export default function Inbox({ t }: { t: Dict['hero'] }) {
  const reduce = useReducedMotion();
  const [rows, setRows] = useState<Mail[]>(() => t.mails.slice(0, 3).reverse().map((m, i) => ({ ...m, id: i })));
  const [count, setCount] = useState(3);
  const counter = useRef(3);

  useEffect(() => {
    if (reduce) return;
    const timer = setInterval(() => {
      const id = counter.current++;
      setRows((r) => [{ ...t.mails[id % t.mails.length], id }, ...r].slice(0, MAX_ROWS));
      setCount(id + 1);
    }, 2600);
    return () => clearInterval(timer);
  }, [reduce, t.mails]);

  return (
    <div>
      <div className="border border-hair bg-card shadow-[0_1px_0_#0000000a,0_30px_60px_-40px_#00000040]">
        <div className="flex justify-between border-b border-hair px-4 py-3 font-mono text-xs text-muted md:px-5">
          <span>{t.inbox}</span>
          <span>
            {Math.min(count, 99)} {t.unread}
          </span>
        </div>
        <ul className="h-[264px] overflow-hidden md:h-[372px]" aria-live="off">
          {rows.map((m, i) => {
            const unread = i < UNREAD_ROWS;
            return (
              <li
                key={m.id}
                className={cn(
                  'grid grid-cols-[8px_1fr_auto] items-center gap-x-3 border-b border-hair bg-card px-4 py-3 text-sm md:grid-cols-[8px_128px_1fr_auto] md:px-5 md:py-[15px]',
                  !reduce && i === 0 && 'animate-drop',
                )}
              >
                <span className={cn('size-[7px] rounded-full', unread ? 'bg-bot' : 'bg-transparent')} />
                <span className="font-mono text-xs text-bot">{m.from}</span>
                <span
                  className={cn(
                    'col-start-2 row-start-2 truncate md:col-start-3 md:row-start-1',
                    unread ? 'text-ink' : 'text-muted',
                  )}
                >
                  {m.subject}
                </span>
                <span className="col-start-3 row-start-1 font-mono text-xs text-faint md:col-start-4">{m.time}</span>
              </li>
            );
          })}
        </ul>
      </div>
      <p className="mt-3.5 flex items-center gap-2 font-mono text-xs text-muted">
        <span className="size-[7px] shrink-0 rounded-full bg-bot" />
        {t.legend}
      </p>
    </div>
  );
}
