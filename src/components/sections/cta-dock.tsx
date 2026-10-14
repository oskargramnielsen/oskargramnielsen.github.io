'use client';

import { useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { motion, useReducedMotion } from 'motion/react';
import { bookingHref } from '@/content/site';
import { cn } from '@/lib/utils';

const NAV_HEIGHT = 64;

const ChatIcon = () => (
  <svg viewBox="0 0 24 24" className="size-[15px]" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden>
    <path
      d="M4 5.5A1.5 1.5 0 0 1 5.5 4h13A1.5 1.5 0 0 1 20 5.5v9a1.5 1.5 0 0 1-1.5 1.5H10l-4.5 4v-4h0A1.5 1.5 0 0 1 4 14.5v-9Z"
      strokeLinejoin="round"
    />
  </svg>
);

const CalendarIcon = () => (
  <svg viewBox="0 0 24 24" className="size-[14px]" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden>
    <rect x="4" y="5" width="16" height="15" rx="1.5" />
    <path d="M4 10h16M9 3v4M15 3v4" strokeLinecap="round" />
  </svg>
);

const base = 'group relative inline-flex items-center justify-center gap-3 border-[1.5px] text-[17px] font-medium';
const styles = {
  primary: 'border-ink bg-ink text-paper hover:border-bot hover:bg-bot',
  secondary: 'border-ink bg-paper text-ink hover:border-bot hover:text-bot',
};

/**
 * The two hero buttons. When they scroll up to the header they stay there and
 * shrink to icons in its right corner, so writing to me is always one tap away.
 * They take the place of the header's "Write to me" link.
 */
export default function CtaDock({ cta, book }: { cta: string; book: string }) {
  const anchor = useRef<HTMLDivElement>(null);
  const [docked, setDocked] = useState(false);
  const reduce = useReducedMotion();

  useEffect(() => {
    const el = anchor.current;
    if (!el) return;
    const dock = new IntersectionObserver(([e]) => setDocked(!e.isIntersecting && e.boundingClientRect.top < NAV_HEIGHT), {
      rootMargin: `-${NAV_HEIGHT}px 0px 0px 0px`,
    });
    dock.observe(el);
    return () => dock.disconnect();
  }, []);

  // Lets the header hide its own "Write to me" link while the icons sit there.
  useEffect(() => {
    document.documentElement.toggleAttribute('data-docked', docked);
  }, [docked]);

  const transition = reduce ? { duration: 0 } : { type: 'spring' as const, stiffness: 260, damping: 30 };
  const buttons = [
    { href: '#contact', label: cta, icon: <ChatIcon />, style: styles.primary, arrow: true },
    { href: bookingHref, label: book, icon: <CalendarIcon />, style: styles.secondary, arrow: false },
  ];

  return (
    <div ref={anchor} className="relative">
      {/* Keeps the buttons' space in the hero while they are docked. */}
      <div aria-hidden className="invisible flex flex-col gap-3 sm:flex-row sm:justify-center">
        {buttons.map((b) => (
          <span key={b.href} className={cn(base, 'px-5.5 py-4')}>
            {b.label} {b.arrow && '→'}
          </span>
        ))}
      </div>

      {!docked && (
        <div className="absolute inset-0 z-40 flex flex-col gap-3 sm:flex-row sm:justify-center">
          {buttons.map((b, i) => (
            <motion.a
              key={b.href}
              href={b.href}
              layoutId={`cta-${i}`}
              transition={transition}
              style={{ borderRadius: 0 }}
              className={cn(base, b.style, 'px-5.5 py-4 transition-colors duration-300')}
            >
              <motion.span
                layout="position"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="flex items-center gap-3 whitespace-nowrap"
              >
                {b.label}
                {b.arrow && (
                  <span aria-hidden className="transition-transform duration-300 group-hover:translate-x-1">
                    →
                  </span>
                )}
              </motion.span>
            </motion.a>
          ))}
        </div>
      )}

      {/* Docked in the header. A portal, so the hero's stacking does not trap them under the header. */}
      {docked &&
        createPortal(
          <div className="wrap pointer-events-none fixed inset-x-0 top-0 z-[55] flex h-14 items-center justify-end gap-2.5 md:h-16">
            {buttons.map((b, i) => (
              <motion.a
                key={b.href}
                href={b.href}
                layoutId={`cta-${i}`}
                transition={transition}
                aria-label={b.label}
                style={{ borderRadius: 999 }}
                className={cn(base, b.style, 'pointer-events-auto size-[34px] transition-colors duration-300')}
              >
                <motion.span
                  initial={{ opacity: 0, scale: 0.5 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: reduce ? 0 : 0.12 }}
                >
                  {b.icon}
                </motion.span>
                <span className="pointer-events-none absolute top-[calc(100%+10px)] right-0 hidden bg-ink px-3 py-1.5 text-[14px] whitespace-nowrap text-paper opacity-0 transition-opacity group-hover:opacity-100 md:block">
                  {b.label}
                </span>
              </motion.a>
            ))}
          </div>,
          document.body,
        )}
    </div>
  );
}
