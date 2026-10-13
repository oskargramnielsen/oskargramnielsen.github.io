import type { Dict } from '@/content';
import AgentBoard from './agent-board';
import CtaDock from './cta-dock';

export default function Hero({ t }: { t: Dict['hero'] }) {
  return (
    <section className="wrap grid min-h-svh items-center gap-12 pt-24 pb-16 lg:grid-cols-[1.05fr_.95fr] lg:gap-16 lg:pt-16 lg:pb-0">
      <div>
        <p className="mb-6 text-sm text-muted md:mb-7">{t.kicker}</p>
        <h1 className="text-[clamp(40px,5.4vw,82px)] leading-none font-semibold tracking-[-0.035em] text-balance">
          {t.before} <em className="font-normal text-bot">{t.highlight}</em> {t.after}
        </h1>
        <p className="mt-6 mb-9 max-w-[520px] text-lg text-body md:mt-7 md:mb-10 md:text-xl">{t.lede}</p>
        <CtaDock cta={t.cta} book={t.book} />
      </div>
      <AgentBoard t={t} />
    </section>
  );
}
