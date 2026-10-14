'use client';

import { useEffect, useRef, useState } from 'react';
import { useLenis } from 'lenis/react';
import { cn } from '@/lib/utils';

/** Section ids in page order; the first one is the hero at the top of the page. */
const IDS = ['top', 'benefits', 'work', 'projects', 'how', 'contact'];

/**
 * A small vertical list of the page's sections at the edge of the screen. It
 * shows where you are and lets you jump. Hidden while the hero is on screen.
 */
export default function Guide({ labels, label }: { labels: readonly string[]; label: string }) {
  const [active, setActive] = useState(0);
  const [progress, setProgress] = useState(0);
  const lenis = useLenis();
  // Flash: the title of a section you just entered shows for a moment.
  const [flash, setFlash] = useState(false);
  const last = useRef(0);
  const timer = useRef<ReturnType<typeof setTimeout>>(undefined);

  useEffect(() => {
    let raf = 0;
    const update = () => {
      raf = 0;
      const line = innerHeight * 0.4;
      let i = 0;
      for (let k = 1; k < IDS.length; k++) {
        const el = document.getElementById(IDS[k]);
        if (el && el.getBoundingClientRect().top <= line) i = k;
      }
      const el = i > 0 ? document.getElementById(IDS[i]) : null;
      const next = document.getElementById(IDS[i + 1] ?? '');
      let p = 1;
      if (el) {
        const top = el.getBoundingClientRect().top;
        const end = next ? next.getBoundingClientRect().top : document.documentElement.scrollHeight - scrollY - innerHeight + line;
        p = Math.min(1, Math.max(0, (line - top) / Math.max(1, end - top)));
      }
      setActive(i);
      setProgress(p);
      if (i !== last.current) {
        last.current = i;
        setFlash(i > 0);
        clearTimeout(timer.current);
        timer.current = setTimeout(() => setFlash(false), 1800);
      }
    };
    const onScroll = () => {
      if (!raf) raf = requestAnimationFrame(update);
    };
    update();
    addEventListener('scroll', onScroll, { passive: true });
    addEventListener('resize', onScroll);
    return () => {
      removeEventListener('scroll', onScroll);
      removeEventListener('resize', onScroll);
      cancelAnimationFrame(raf);
      clearTimeout(timer.current);
    };
  }, []);

  // Open: the rail grows and shows every title (hover, or a first tap on touch screens).
  const [open, setOpen] = useState(false);
  const touch = useRef(false);
  const nav = useRef<HTMLElement>(null);

  useEffect(() => {
    if (!open) return;
    const close = (e: PointerEvent) => {
      if (!nav.current?.contains(e.target as Node)) setOpen(false);
    };
    addEventListener('pointerdown', close);
    return () => removeEventListener('pointerdown', close);
  }, [open]);

  const go = (e: React.MouseEvent, id: string) => {
    e.preventDefault();
    // On touch, the first tap opens the rail so the targets are big enough to hit.
    if (touch.current && !open) {
      setOpen(true);
      return;
    }
    setOpen(false);
    const el = id === 'top' ? 0 : document.getElementById(id);
    if (el === null) return;
    const header = document.querySelector('header')?.offsetHeight ?? 0;
    if (lenis) lenis.scrollTo(el, { offset: id === 'top' ? 0 : -header + 8 });
    else if (el === 0) scrollTo({ top: 0, behavior: 'smooth' });
    else scrollTo({ top: el.getBoundingClientRect().top + scrollY - header + 8, behavior: 'smooth' });
  };

  const shown = active > 0;

  return (
    <nav
      ref={nav}
      aria-label={label}
      inert={!shown}
      onPointerDown={(e) => (touch.current = e.pointerType !== 'mouse')}
      onPointerEnter={(e) => e.pointerType === 'mouse' && setOpen(true)}
      onPointerLeave={(e) => e.pointerType === 'mouse' && setOpen(false)}
      className={cn(
        'fixed top-1/2 right-1.5 z-40 -translate-y-1/2 rounded-2xl transition-[opacity,background-color,box-shadow,padding] duration-300 lg:right-auto lg:left-3',
        shown ? 'opacity-100' : 'pointer-events-none opacity-0',
        open ? 'bg-paper/95 px-2 py-2 shadow-[0_12px_40px_-12px_#0000003a] backdrop-blur' : 'px-1 py-1',
      )}
    >
      <ol className="flex flex-col">
        {IDS.map((id, i) => {
          const current = i === active;
          const showLabel = open || (current && flash);
          return (
            <li key={id}>
              <a
                href={id === 'top' ? '#' : `#${id}`}
                onClick={(e) => go(e, id)}
                aria-current={current ? 'location' : undefined}
                className={cn(
                  'flex items-center gap-3 rounded-lg transition-[padding] duration-300 max-lg:flex-row-reverse',
                  open ? 'px-2 py-2' : 'py-[7px]',
                )}
              >
                <span
                  aria-hidden
                  className={cn(
                    'relative h-[2.5px] overflow-hidden rounded-full transition-[width,background-color] duration-300',
                    current ? 'w-5 bg-bot/20' : 'w-2.5',
                    open && !current && 'w-3.5',
                    !current && (i < active ? 'bg-ink/55' : 'bg-ink/25'),
                  )}
                >
                  {current && (
                    <span
                      className="absolute inset-0 origin-left rounded-full bg-bot"
                      style={{ transform: `scaleX(${0.3 + 0.7 * progress})` }}
                    />
                  )}
                </span>
                <span
                  className={cn(
                    'pointer-events-none whitespace-nowrap transition-[opacity,translate,font-size] duration-300 ease-out-expo',
                    open ? 'text-[15px]' : 'text-[13px]',
                    current ? 'font-medium text-ink' : 'text-muted',
                    showLabel ? 'translate-x-0 opacity-100' : '-translate-x-1.5 opacity-0 max-lg:translate-x-1.5',
                    // While not open, a flashed title sits on a small pill so it reads over the page.
                    !open && current && 'rounded-full bg-paper/95 px-2 py-0.5 shadow-[0_4px_14px_-6px_#00000033]',
                  )}
                >
                  {labels[i]}
                </span>
              </a>
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
