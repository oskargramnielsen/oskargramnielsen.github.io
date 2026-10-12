import type { Dict } from '@/content';
import { bookingHref } from '@/content/site';
import AgentBoard from './agent-board';

const button =
  'group inline-flex items-center justify-center gap-3 border-[1.5px] border-ink px-5.5 py-4 text-[17px] font-medium transition-colors duration-300';

export default function Hero({ t }: { t: Dict['hero'] }) {
  return (
    <section className="wrap grid min-h-svh items-center gap-12 pt-24 pb-16 lg:grid-cols-[1.05fr_.95fr] lg:gap-16 lg:pt-16 lg:pb-0">
      <div>
        <p className="mb-6 text-sm text-muted md:mb-7">{t.kicker}</p>
        <h1 className="text-[clamp(40px,5.4vw,82px)] leading-none font-semibold tracking-[-0.035em] text-balance">
          {t.before} <em className="font-normal text-bot">{t.highlight}</em> {t.after}
        </h1>
        <p className="mt-6 mb-9 max-w-[520px] text-lg text-body md:mt-7 md:mb-10 md:text-xl">{t.lede}</p>
        <div className="flex flex-col gap-3 sm:flex-row">
          <a href="#contact" className={`${button} bg-ink text-paper hover:border-bot hover:bg-bot`}>
            {t.cta}
            <span aria-hidden className="transition-transform duration-300 group-hover:translate-x-1">
              →
            </span>
          </a>
          <a href={bookingHref} className={`${button} text-ink hover:border-bot hover:text-bot`}>
            {t.book}
          </a>
        </div>
      </div>
      <AgentBoard t={t} />
    </section>
  );
}
