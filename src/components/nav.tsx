import { langPath, site, type Lang } from '@/content/site';
import type { Dict } from '@/content';
import { cn } from '@/lib/utils';

export default function Nav({ lang, t }: { lang: Lang; t: Dict['nav'] }) {
  const links = [
    { href: '#process', label: t.process },
    { href: '#about', label: t.about },
    { href: '#proof', label: t.work },
  ];

  return (
    <header className="fixed inset-x-0 top-0 z-50 text-paper mix-blend-difference">
      <nav className="gutter flex h-[70px] items-center justify-between text-sm font-medium">
        <a href={langPath[lang]} className="tracking-tight">
          {site.name}
        </a>
        <div className="flex items-center gap-5 md:gap-7">
          <ul className="hidden items-center gap-7 md:flex">
            {links.map((l) => (
              <li key={l.href}>
                <a href={l.href} className="transition-opacity hover:opacity-60">
                  {l.label}
                </a>
              </li>
            ))}
          </ul>
          <div role="group" aria-label={t.langLabel} className="flex items-center gap-1">
            {(['en', 'da'] as const).map((l, i) => (
              <span key={l} className="flex items-center gap-1">
                {i > 0 && <span aria-hidden>/</span>}
                <a
                  href={langPath[l]}
                  hrefLang={l}
                  aria-current={l === lang ? 'true' : undefined}
                  className={cn('uppercase transition-opacity', l === lang ? 'opacity-100' : 'opacity-45 hover:opacity-80')}
                >
                  {l}
                </a>
              </span>
            ))}
          </div>
          <a href="#contact" className="transition-opacity hover:opacity-60">
            {t.book} ↗
          </a>
        </div>
      </nav>
    </header>
  );
}
