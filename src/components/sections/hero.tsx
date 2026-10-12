import type { Dict } from '@/content';
import { bookingHref } from '@/content/site';
import Inbox from './inbox';

export default function Hero({ t }: { t: Dict['hero'] }) {
  return (
    <section className="wrap grid min-h-svh items-center gap-12 pt-24 pb-16 md:grid-cols-[1.05fr_.95fr] md:gap-16 md:pt-16 md:pb-0">
      <div>
        <p className="mb-6 text-sm text-muted md:mb-7">{t.kicker}</p>
        <h1 className="text-[clamp(40px,5.4vw,82px)] leading-none font-semibold tracking-[-0.035em] text-balance">
          {t.before} <em className="font-normal text-bot">{t.highlight}</em> {t.after}
        </h1>
        <p className="mt-6 mb-9 max-w-[520px] text-lg text-body md:mt-7 md:mb-10 md:text-xl">{t.lede}</p>
        <div className="flex flex-wrap items-baseline gap-x-7 gap-y-4">
          <a
            href="#contact"
            className="group inline-flex items-center gap-3 bg-ink px-5.5 py-4 text-[17px] font-medium text-paper transition-colors duration-300 hover:bg-bot"
          >
            {t.cta}
            <span aria-hidden className="transition-transform duration-300 group-hover:translate-x-1">
              →
            </span>
          </a>
          <span className="text-base text-muted">
            {t.or}{' '}
            <a href={bookingHref} className="text-ink underline underline-offset-4 hover:text-bot">
              {t.book}
            </a>
          </span>
        </div>
      </div>
      <Inbox t={t} />
    </section>
  );
}
