import { site } from '@/content/site';
import type { Dict } from '@/content';

export default function Footer({ t }: { t: Dict['footer'] }) {
  return (
    <footer className="border-t border-hair">
      <div className="wrap flex flex-col justify-between gap-2 py-6 pb-10 text-[13px] text-muted sm:flex-row">
        <span>
          {site.name} · {t.place}
        </span>
        <span>{t.privacy}</span>
      </div>
    </footer>
  );
}
