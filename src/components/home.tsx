import { dictionaries } from '@/content';
import type { Lang } from '@/content/site';
import Footer from './footer';
import Nav from './nav';
import Hero from './sections/hero';

export default function Home({ lang }: { lang: Lang }) {
  const t = dictionaries[lang];

  return (
    <>
      <Nav lang={lang} t={t.nav} />
      <main>
        <Hero t={t.hero} />

        {/* Work scenes, job, offer and contact are built in the next steps. */}
        <section id="work" className="wrap pt-32 pb-10 md:pt-40">
          <h2 className="max-w-[900px] text-[clamp(32px,4.2vw,62px)] leading-[1.02] font-semibold tracking-[-0.03em]">
            {t.work.title}
          </h2>
          <p className="mt-6 max-w-[600px] text-lg text-body md:text-xl">{t.work.intro}</p>
        </section>
        <section id="how" />
        <section id="contact" className="wrap pt-32 pb-24 md:pt-40">
          <h2 className="text-[clamp(32px,4.2vw,62px)] leading-[1.02] font-semibold tracking-[-0.03em]">
            {t.contact.title}
          </h2>
        </section>
      </main>
      <Footer t={t.footer} />
    </>
  );
}
