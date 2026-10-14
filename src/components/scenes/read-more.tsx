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

/** A one-line teaser that opens into the full story. */
export default function ReadMore({ short, body, extra, readMore, readLess, className }: Props) {
  const [open, setOpen] = useState(false);
  return (
    <div className={cn('max-w-[470px]', className)}>
      <p className="text-body">{open ? body : short}</p>
      <AnimatePresence initial={false}>
        {open && extra && (
          <motion.div
            key="extra"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="overflow-hidden"
          >
            {extra}
          </motion.div>
        )}
      </AnimatePresence>
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        aria-expanded={open}
        className="mt-3 font-mono text-[13px] text-ink underline-offset-4 transition-colors hover:text-bot hover:underline"
      >
        {open ? `↑ ${readLess}` : `↓ ${readMore}`}
      </button>
    </div>
  );
}
