import { langPath, site, type Lang } from '@/content/site';
import type { Dict } from '@/content';
import { cn } from '@/lib/utils';
import Guide from './guide';

export default function Nav({ lang, t }: { lang: Lang; t: Dict['nav'] }) {
  return (
    <header className="fixed inset-x-0 top-0 z-50 bg-paper/90 backdrop-blur-md">
      <nav className="wrap flex h-14 items-center justify-between text-[15px] md:h-16">
        <a href={langPath[lang]} className="font-medium">
          {site.name}
        </a>
        <div className="nav-right flex items-center gap-5 md:gap-7">
          <a href="#work" className="hidden hover:text-bot md:inline">
            {t.work}
          </a>
          <a href="#how" className="hidden hover:text-bot md:inline">
            {t.how}
          </a>
          <div role="group" aria-label={t.langLabel} className="font-mono text-[13px] text-muted">
            {(['en', 'da'] as const).map((l, i) => (
              <span key={l}>
                {i > 0 && <span aria-hidden> · </span>}
                <a
                  href={langPath[l]}
                  hrefLang={l}
                  aria-current={l === lang ? 'true' : undefined}
                  className={cn('uppercase', l === lang ? 'text-ink' : 'hover:text-bot')}
                >
                  {l}
                </a>
              </span>
            ))}
          </div>
          <a href="#contact" className="nav-write border-b-[1.5px] border-ink pb-px hover:border-bot hover:text-bot">
            {t.write}
          </a>
        </div>
      </nav>
      <Guide labels={t.guide} label={t.guideLabel} />
    </header>
  );
}
