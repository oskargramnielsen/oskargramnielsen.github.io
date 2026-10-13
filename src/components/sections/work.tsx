'use client';

import { useEffect, useState } from 'react';
import { useLenis } from 'lenis/react';
import type { Dict } from '@/content';
import Andelskortet from '../scenes/andelskortet';
import Bank from '../scenes/bank';
import Cars from '../scenes/cars';
import Housing from '../scenes/housing';
import Scene from '../scenes/scene';
import { Artsrig, Hvilkendag } from '../scenes/small';
import Sneakers from '../scenes/sneakers';

/** Projects behind "show more". */
const HIDDEN = ['bank', 'sneakers', 'artsrig', 'hvilkendag'];

/** Ask the projects section to scroll to a project, opening "show more" if needed. */
export function revealProject(id: string) {
  window.dispatchEvent(new CustomEvent('reveal-project', { detail: id }));
}

export default function Work({ t }: { t: Dict['work'] }) {
  const [open, setOpen] = useState(false);
  const lenis = useLenis();
  const shared = { forBusiness: t.forBusiness };

  useEffect(() => {
    const onReveal = (e: Event) => {
      const id = (e as CustomEvent<string>).detail;
      if (HIDDEN.includes(id)) setOpen(true);
      // Wait for the opened content to render before scrolling to it.
      requestAnimationFrame(() =>
        requestAnimationFrame(() => {
          const el = document.getElementById(id);
          if (!el) return;
          if (lenis) lenis.scrollTo(el, { offset: -60 });
          else el.scrollIntoView({ behavior: 'smooth' });
        }),
      );
    };
    window.addEventListener('reveal-project', onReveal);
    return () => window.removeEventListener('reveal-project', onReveal);
  }, [lenis]);

  return (
    <div id="projects" className="scroll-mt-14">
      <div className="wrap pt-20 pb-2 md:pt-32 lg:pb-6">
        <p className="font-mono text-[13px] text-muted">{t.label}</p>
        <h2 className="mt-3 text-[clamp(32px,4.2vw,62px)] leading-[1.02] font-semibold tracking-[-0.03em]">{t.title}</h2>
        <p className="mt-4 max-w-[600px] text-lg text-body md:text-xl">{t.intro}</p>
      </div>

      <Scene id="andelskortet" {...shared} {...t.andelskortet} tall="long">
        {(p) => <Andelskortet p={p} t={t.andelskortet} />}
      </Scene>
      <Scene id="housing" {...shared} {...t.housing}>
        {(p) => <Housing p={p} t={t.housing} />}
      </Scene>
      <Scene id="cars" {...shared} {...t.cars}>
        {(p) => <Cars p={p} t={t.cars} />}
      </Scene>

      {open && (
        <>
          <Scene id="bank" {...shared} {...t.bank}>
            {(p) => <Bank p={p} t={t.bank} />}
          </Scene>
          <Scene id="sneakers" {...shared} {...t.sneakers}>
            {(p) => <Sneakers p={p} t={t.sneakers} />}
          </Scene>
          <div className="wrap grid gap-14 py-12 md:grid-cols-2 md:gap-10 lg:py-20">
            <Artsrig t={t.artsrig} />
            <Hvilkendag t={t.hvilkendag} />
          </div>
        </>
      )}

      <div className="wrap pt-4 lg:pt-0">
        <button
          type="button"
          onClick={() => setOpen((o) => !o)}
          aria-expanded={open}
          className="w-full border-y border-hair py-5 text-left font-mono text-sm text-ink transition-colors hover:text-bot"
        >
          {open ? `↑ ${t.less}` : `↓ ${t.more}`}
          <span className="float-right hidden text-muted sm:inline">bank · sneaker-scraper · artsrig · hvilkendag</span>
        </button>
      </div>
    </div>
  );
}
