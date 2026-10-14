'use client';

import { useEffect, useRef, useState } from 'react';
import { useLenis } from 'lenis/react';
import { cn } from '@/lib/utils';

/** Section ids in page order; the first one is the hero at the top of the page. */
const IDS = ['top', 'work', 'projects', 'how', 'examples', 'contact'];

/**
 * A short list of the page's sections under the header. It shows where you
 * are and lets you jump. It stays out of the way until you leave the hero.
 */
export default function Guide({ labels, label }: { labels: readonly string[]; label: string }) {
  const [active, setActive] = useState(0);
  const [progress, setProgress] = useState(0);
  const list = useRef<HTMLOListElement>(null);
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

  // On narrow screens the list scrolls sideways; keep the current section in view.
  useEffect(() => {
    const ol = list.current;
    const li = ol?.children[active] as HTMLElement | undefined;
    if (!ol || !li || ol.scrollWidth <= ol.clientWidth) return;
    ol.scrollTo({ left: li.offsetLeft - (ol.clientWidth - li.offsetWidth) / 2, behavior: 'smooth' });
  }, [active]);

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
      className={cn(
        'grid transition-[grid-template-rows,opacity] duration-300',
        shown ? 'grid-rows-[1fr] opacity-100' : 'grid-rows-[0fr] opacity-0',
      )}
      inert={!shown}
    >
      <div className="overflow-hidden">
        <ol
          ref={list}
          className="wrap flex gap-5 overflow-x-auto pb-2 font-mono text-[12px] whitespace-nowrap [scrollbar-width:none] md:gap-7"
        >
          {IDS.map((id, i) => (
            <li key={id}>
              <a
                href={id === 'top' ? '#' : `#${id}`}
                onClick={(e) => go(e, id)}
                aria-current={i === active ? 'location' : undefined}
                className={cn(
                  'relative block py-1 transition-colors hover:text-bot',
                  i === active ? 'text-ink' : i < active ? 'text-muted' : 'text-faint',
                )}
              >
                <span className={cn('mr-1.5', i === active ? 'text-bot' : undefined)}>{String(i + 1).padStart(2, '0')}</span>
                {labels[i]}
                <span className="absolute inset-x-0 bottom-0 h-[1.5px] bg-hair" hidden={i !== active} />
                <span
                  className="absolute bottom-0 left-0 h-[1.5px] w-full origin-left bg-bot"
                  hidden={i !== active}
                  style={{ transform: `scaleX(${progress})` }}
                />
              </a>
            </li>
          ))}
        </ol>
      </div>
    </nav>
  );
}
