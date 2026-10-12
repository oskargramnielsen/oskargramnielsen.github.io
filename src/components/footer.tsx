import { site } from '@/content/site';
import type { Dict } from '@/content';

export default function Footer({ t }: { t: Dict['footer'] }) {
  const year = new Date().getFullYear();
  return (
    <footer className="gutter bg-tint pb-[3vw]">
      <div className="flex flex-wrap justify-between gap-4 border-t border-tint-strong pt-5 text-sm text-body">
        <span>
          © {year} {site.name}. {t.rights}
        </span>
        <div className="flex gap-6">
          <a href={`mailto:${site.email}`} className="hover:text-accent">
            {site.email}
          </a>
          <a href={site.linkedin} target="_blank" rel="noopener noreferrer" className="hover:text-accent">
            LinkedIn ↗
          </a>
          <a href={site.cv} download className="hover:text-accent">
            {t.cv}
          </a>
        </div>
      </div>
      <div
        aria-hidden
        className="mt-[6vw] flex justify-between text-[clamp(50px,12vw,200px)] leading-[0.8] font-semibold tracking-[-0.07em] text-tint-strong select-none"
      >
        <span>Oskar</span>
        <span>©{String(year).slice(2)}</span>
      </div>
    </footer>
  );
}
