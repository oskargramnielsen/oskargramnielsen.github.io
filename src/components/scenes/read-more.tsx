'use client';

import { useState } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import { cn } from '@/lib/utils';

type Props = {
  /** One line shown by default. */
  short: string;
  /** The full text, shown instead of the short one when opened. */
  body: string;
  /** Shown under the full text when opened. */
  extra?: React.ReactNode;
  readMore: string;
  readLess: string;
  className?: string;
};

const fade = {
  initial: { opacity: 0, height: 0, filter: 'blur(4px)' },
  animate: { opacity: 1, height: 'auto', filter: 'blur(0px)' },
  exit: { opacity: 0, height: 0, filter: 'blur(4px)' },
  transition: { duration: 0.35, ease: [0.2, 0.8, 0.2, 1] as const },
};

/** A one-line teaser that opens into the full story. */
export default function ReadMore({ short, body, extra, readMore, readLess, className }: Props) {
  const [open, setOpen] = useState(false);
  return (
    <div className={cn('max-w-[470px]', className)}>
      <AnimatePresence initial={false} mode="wait">
        <motion.div key={open ? 'body' : 'short'} {...fade} className="overflow-hidden">
          <p className="text-body">{open ? body : short}</p>
          {open && extra}
        </motion.div>
      </AnimatePresence>
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        aria-expanded={open}
        className="group mt-4 inline-flex items-center gap-2 rounded-full bg-bot-soft py-1.5 pr-3.5 pl-1.5 text-[14px] font-medium text-bot transition-colors duration-300 hover:bg-bot hover:text-card"
      >
        <span className="grid size-6 place-items-center rounded-full bg-bot text-card transition-[background-color,rotate] duration-300 group-hover:bg-card group-hover:text-bot group-aria-expanded:rotate-45">
          <svg
            viewBox="0 0 12 12"
            className="size-2.5"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.8"
            strokeLinecap="round"
            aria-hidden
          >
            <path d="M6 1.5v9M1.5 6h9" />
          </svg>
        </span>
        {open ? readLess : readMore}
      </button>
    </div>
  );
}
