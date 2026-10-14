import type { Dict } from '@/content';
import CtaDock from './cta-dock';
import NoteStage from './note-stage';

export default function Hero({ t }: { t: Dict['hero'] }) {
  return (
    <NoteStage notes={t.notes}>
      <p data-avoid="text" className="mb-5 text-sm text-muted md:mb-6">
        {t.kicker}
      </p>
      <h1 data-avoid="text" className="text-[clamp(36px,6vw,84px)] leading-none font-semibold tracking-[-0.035em] text-balance">
        {t.before} <em className="font-normal text-bot">{t.highlight}</em> {t.after}
      </h1>
      <div data-avoid="box" className="mt-8 md:mt-10">
        <CtaDock cta={t.cta} book={t.book} />
      </div>
    </NoteStage>
  );
}
