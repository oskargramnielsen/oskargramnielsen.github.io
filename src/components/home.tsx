import { dictionaries } from '@/content';
import type { Lang } from '@/content/site';
import Footer from './footer';
import Nav from './nav';
import SectionLabel from './ui/section-label';
import Button from './ui/button';

export default function Home({ lang }: { lang: Lang }) {
  const t = dictionaries[lang];

  return (
    <>
      <Nav lang={lang} t={t.nav} />
      <main>
        {/* Hero — built in step 2 */}
        <section className="gutter flex min-h-svh flex-col justify-end pt-24 pb-[4vw]">
          <p className="mb-[2vw] font-mono text-[13px] text-muted">{t.hero.eyebrow}</p>
          <h1 className="text-[clamp(56px,10.4vw,176px)] leading-[0.86] font-semibold tracking-[-0.062em]">
            {t.hero.before} <span className="text-accent">{t.hero.tasks[0].task}</span> {t.hero.after}
          </h1>
          <div className="mt-[3vw] flex flex-wrap items-end justify-between gap-10">
            <p className="max-w-[440px] text-lg leading-normal text-body">{t.hero.lead}</p>
            <Button href="#contact">{t.hero.cta}</Button>
          </div>
        </section>

        {/* Process, Background, Proof — built in step 3 */}
        {[
          { id: 'process', label: t.process.label, title: t.process.title.join(' ') },
          { id: 'about', label: t.about.label, title: t.about.title },
          { id: 'proof', label: t.proof.label, title: t.proof.title },
        ].map((s, i) => (
          <section key={s.id} id={s.id} className="gutter py-[12vw]">
            <SectionLabel index={i + 1} label={s.label} />
            <h2 className="text-[clamp(44px,7vw,120px)] leading-[0.9] font-semibold tracking-[-0.055em]">{s.title}</h2>
          </section>
        ))}

        {/* Contact — built in step 4 */}
        <section id="contact" className="gutter bg-tint pt-[10vw] pb-[6vw]">
          <SectionLabel index={4} label={t.contact.label} />
          <h2 className="text-[clamp(44px,7vw,120px)] leading-[0.9] font-semibold tracking-[-0.055em]">{t.contact.title}</h2>
        </section>
      </main>
      <Footer t={t.footer} />
    </>
  );
}
