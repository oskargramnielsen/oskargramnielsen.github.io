import { dictionaries } from '@/content';
import type { Lang } from '@/content/site';
import Footer from './footer';
import Nav from './nav';
import Contact from './sections/contact';
import Hero from './sections/hero';
import Job from './sections/job';
import Offer from './sections/offer';
import Work from './sections/work';

export default function Home({ lang }: { lang: Lang }) {
  const t = dictionaries[lang];

  return (
    <>
      <Nav lang={lang} t={t.nav} />
      <main>
        <Hero t={t.hero} />
        <Job t={t.job} />
        <Work t={t.work} />
        <Offer t={t.process} />
        <Contact t={t.contact} lang={lang} />
      </main>
      <Footer t={t.footer} />
    </>
  );
}
