'use client';

import { useEffect, useRef, useState } from 'react';
import { AnimatePresence, motion, useReducedMotion } from 'motion/react';
import { bookingHref } from '@/content/site';
import { cn } from '@/lib/utils';

const NAV_HEIGHT = 64;

const ChatIcon = () => (
  <svg viewBox="0 0 24 24" className="size-[22px]" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden>
    <path d="M4 5.5A1.5 1.5 0 0 1 5.5 4h13A1.5 1.5 0 0 1 20 5.5v9a1.5 1.5 0 0 1-1.5 1.5H10l-4.5 4v-4h0A1.5 1.5 0 0 1 4 14.5v-9Z" strokeLinejoin="round" />
  </svg>
);

const CalendarIcon = () => (
  <svg viewBox="0 0 24 24" className="size-5" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden>
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
 * The two hero buttons. Once they scroll out of view they fly to the bottom
 * right corner and shrink to icons, so writing to me is always one tap away.
 * They step aside while the contact section is on screen.
 */
export default function CtaDock({ cta, book }: { cta: string; book: string }) {
  const anchor = useRef<HTMLDivElement>(null);
  const [docked, setDocked] = useState(false);
  const [atContact, setAtContact] = useState(false);
  const reduce = useReducedMotion();

  useEffect(() => {
    const el = anchor.current;
    const contact = document.getElementById('contact');
    if (!el) return;
    const dock = new IntersectionObserver(([e]) => setDocked(!e.isIntersecting && e.boundingClientRect.top < NAV_HEIGHT), {
      rootMargin: `-${NAV_HEIGHT}px 0px 0px 0px`,
    });
    const hide = new IntersectionObserver(([e]) => setAtContact(e.isIntersecting), { threshold: 0.2 });
    dock.observe(el);
    if (contact) hide.observe(contact);
    return () => {
      dock.disconnect();
      hide.disconnect();
    };
  }, []);

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

      <motion.div
        layout
        transition={transition}
        animate={{ opacity: docked && atContact ? 0 : 1, scale: docked && atContact ? 0.8 : 1 }}
        className={cn(
          'z-40 flex',
          docked
            ? 'fixed right-4 bottom-4 flex-row-reverse items-center gap-2.5 md:right-6 md:bottom-6'
            : 'absolute inset-0 flex-col gap-3 sm:flex-row sm:justify-center',
          docked && atContact && 'pointer-events-none',
        )}
      >
        {buttons.map((b) => (
          <motion.a
            key={b.href}
            href={b.href}
            layout
            transition={transition}
            aria-label={docked ? b.label : undefined}
            animate={{ borderRadius: docked ? 999 : 0 }}
            className={cn(
              base,
              b.style,
              'transition-colors duration-300',
              docked ? (b.arrow ? 'size-14 shadow-[0_10px_30px_-8px_#1f3bff80]' : 'size-12 shadow-[0_8px_24px_-10px_#00000055]') : 'px-5.5 py-4',
            )}
          >
            <AnimatePresence mode="popLayout" initial={false}>
              {docked ? (
                <motion.span key="icon" initial={{ opacity: 0, scale: 0.5 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0 }}>
                  {b.icon}
                </motion.span>
              ) : (
                <motion.span
                  key="label"
                  layout="position"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="flex items-center gap-3 whitespace-nowrap"
                >
                  {b.label}
                  {b.arrow && (
                    <span aria-hidden className="transition-transform duration-300 group-hover:translate-x-1">
                      →
                    </span>
                  )}
                </motion.span>
              )}
            </AnimatePresence>
            {docked && (
              <span className="pointer-events-none absolute right-0 bottom-[calc(100%+10px)] hidden bg-ink px-3 py-1.5 text-[14px] whitespace-nowrap text-paper opacity-0 transition-opacity group-hover:opacity-100 md:block">
                {b.label}
              </span>
            )}
          </motion.a>
        ))}
      </motion.div>
    </div>
  );
}
