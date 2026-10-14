'use client';

import { AnimatePresence, motion } from 'motion/react';
import { cn } from '@/lib/utils';

/** Fades and lifts children in when `on` becomes true. Keeps layout space. */
export function Appear({ on, className, children }: { on: boolean; className?: string; children: React.ReactNode }) {
  return (
    <div
      className={cn(
        'transition-[opacity,translate] duration-500 ease-out-expo',
        on ? 'translate-y-0 opacity-100' : 'translate-y-2.5 opacity-0',
        className,
      )}
    >
      {children}
    </div>
  );
}

/** Header of a chat thread: avatar, name and a status line. */
export function ThreadHead({ name, status, initials, bot }: { name: string; status: string; initials: string; bot?: boolean }) {
  return (
    <div className="flex items-center gap-3 border-b border-hair px-4 py-3">
      <span
        className={cn(
          'grid size-9 shrink-0 place-items-center rounded-full font-mono text-[12px]',
          bot ? 'bg-bot text-card' : 'bg-shade text-ink',
        )}
      >
        {initials}
      </span>
      <div className="min-w-0 leading-tight">
        <p className="truncate text-[15px] font-medium">{name}</p>
        <p className="truncate text-[12px] text-muted">{status}</p>
      </div>
    </div>
  );
}

/**
 * Message list that grows from the bottom like a messenger app: new messages
 * push the older ones up and out of view.
 */
export function Thread({ className, children }: { className?: string; children: React.ReactNode }) {
  return (
    <div className={cn('flex flex-col justify-end gap-1.5 overflow-hidden px-3 py-3 [mask-image:linear-gradient(transparent,black_28px)] md:px-4', className)}>
      <AnimatePresence initial={false}>{children}</AnimatePresence>
    </div>
  );
}

type Side = 'left' | 'right';

const pop = {
  initial: { opacity: 0, y: 14, scale: 0.92 },
  animate: { opacity: 1, y: 0, scale: 1 },
  exit: { opacity: 0, scale: 0.92 },
  transition: { type: 'spring', stiffness: 520, damping: 34 },
} as const;

/**
 * A chat bubble. Blue bubbles are written by a program, grey/black ones by a
 * person. Render it conditionally inside <Thread> so it pops in and out.
 */
export function Bubble({
  side,
  bot,
  meta,
  className,
  children,
}: {
  side: Side;
  bot?: boolean;
  meta?: React.ReactNode;
  className?: string;
  children: React.ReactNode;
}) {
  const right = side === 'right';
  return (
    <motion.div
      layout="position"
      {...pop}
      style={{ originX: right ? 1 : 0, originY: 1 }}
      className={cn('flex max-w-[86%] flex-col', right ? 'items-end self-end' : 'items-start self-start')}
    >
      <div
        className={cn(
          'rounded-[18px] px-3.5 py-2 text-[14px] leading-snug md:text-[15px]',
          right ? 'rounded-br-[5px]' : 'rounded-bl-[5px]',
          bot ? (right ? 'bg-bot text-card' : 'bg-bot-soft text-bot') : right ? 'bg-ink text-paper' : 'bg-shade text-ink',
          className,
        )}
      >
        {children}
      </div>
      {meta && <span className="mt-1 px-1 font-mono text-[10.5px] text-faint">{meta}</span>}
    </motion.div>
  );
}

/** The "someone is typing" bubble. */
export function Typing({ side, bot }: { side: Side; bot?: boolean }) {
  const right = side === 'right';
  return (
    <motion.div
      layout="position"
      {...pop}
      style={{ originX: right ? 1 : 0, originY: 1 }}
      className={cn(
        'flex gap-1 rounded-[18px] px-3.5 py-3',
        right ? 'self-end rounded-br-[5px]' : 'self-start rounded-bl-[5px]',
        bot ? (right ? 'bg-bot' : 'bg-bot-soft') : 'bg-shade',
      )}
      aria-hidden
    >
      {[0, 1, 2].map((i) => (
        <span
          key={i}
          className={cn('size-1.5 animate-typing rounded-full', bot ? (right ? 'bg-card' : 'bg-bot') : 'bg-muted')}
          style={{ animationDelay: `${i * 0.15}s` }}
        />
      ))}
    </motion.div>
  );
}

/** A small centred line in a thread, like a date or "Listing posted". */
export function Divider({ children }: { children: React.ReactNode }) {
  return (
    <motion.p layout="position" {...pop} className="self-center py-1 font-mono text-[10.5px] text-faint">
      {children}
    </motion.p>
  );
}

/** A phone-style notification banner. */
export function Banner({ app, time, title, children, bot }: { app: string; time: string; title: string; bot?: boolean; children: React.ReactNode }) {
  return (
    <div className="rounded-[14px] border border-hair bg-card/95 p-3 text-[13px] leading-snug shadow-[0_12px_30px_-12px_#00000033] backdrop-blur">
      <div className="mb-1 flex items-center gap-2 font-mono text-[10.5px] text-muted">
        <span className={cn('grid size-4 place-items-center rounded-[4px] text-[9px] text-card', bot ? 'bg-bot' : 'bg-ink')}>
          {app.slice(0, 1).toUpperCase()}
        </span>
        {app}
        <span className="ml-auto">{time}</span>
      </div>
      <p className="font-medium">{title}</p>
      <p className="text-body">{children}</p>
    </div>
  );
}
