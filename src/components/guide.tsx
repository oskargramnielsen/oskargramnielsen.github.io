'use client';

import { useEffect, useState } from 'react';
import { useLenis } from 'lenis/react';
import { cn } from '@/lib/utils';

/** Section ids in page order; the first one is the hero at the top of the page. */
const IDS = ['top', 'work', 'projects', 'how', 'contact'];

/**
 * A small vertical list of the page's sections at the edge of the screen. It
 * shows where you are and lets you jump. Hidden while the hero is on screen.
 */
export default function Guide({ labels, label }: { labels: readonly string[]; label: string }) {
  const [active, setActive] = useState(0);
  const [progress, setProgress] = useState(0);
  const lenis = useLenis();

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
    };
  }, []);

  const go = (e: React.MouseEvent, id: string) => {
    e.preventDefault();
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
      aria-label={label}
      inert={!shown}
      className={cn(
        'group/guide fixed top-1/2 right-1 z-40 -translate-y-1/2 transition-opacity duration-500 lg:right-auto lg:left-5',
        shown ? 'opacity-100' : 'pointer-events-none opacity-0',
      )}
    >
      <ol className="flex flex-col gap-0.5">
        {IDS.map((id, i) => (
          <li key={id}>
            <a
              href={id === 'top' ? '#' : `#${id}`}
              onClick={(e) => go(e, id)}
              aria-current={i === active ? 'location' : undefined}
              className="flex items-center gap-2.5 py-1.5 text-[12.5px] leading-none tracking-[-0.005em] max-lg:flex-row-reverse"
            >
              <span aria-hidden className="relative h-[1.5px] w-3 overflow-hidden rounded-full bg-ink/15 lg:w-5">
                <span
                  className={cn(
                    'absolute inset-0 origin-left rounded-full transition-colors',
                    i === active ? 'bg-bot' : i < active ? 'bg-ink/40' : '',
                  )}
                  style={{ transform: `scaleX(${i === active ? 0.25 + 0.75 * progress : i < active ? 1 : 0})` }}
                />
              </span>
              <span
                className={cn(
                  'whitespace-nowrap transition-[opacity,color] duration-300',
                  i === active ? 'text-ink' : 'text-muted hover:text-ink',
                  // Labels only where there is room beside the page; otherwise they show on hover.
                  'opacity-0 group-hover/guide:opacity-100 max-lg:hidden min-[1600px]:opacity-100',
                )}
              >
                {labels[i]}
              </span>
            </a>
          </li>
        ))}
      </ol>
    </nav>
  );
}
