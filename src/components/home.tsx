import { dictionaries } from '@/content';
import type { Lang } from '@/content/site';
import Footer from './footer';
import Nav from './nav';
import Contact from './sections/contact';
import Hero from './sections/hero';
import Job from './sections/job';
import Offer from './sections/offer';
import SmallProjects from './sections/small-projects';
import Work from './sections/work';

export default function Home({ lang }: { lang: Lang }) {
  const t = dictionaries[lang];

  return (
    <>
      <Nav lang={lang} t={t.nav} />
      <main>
        <Hero t={t.hero} />
        <Work t={t.work} />
        <SmallProjects t={t.work.small} replay={t.work.replay} />
        <Job t={t.job} />
        <Offer t={t.offer} />
        <Contact t={t.contact} />
      </main>
      <Footer t={t.footer} />
    </>
  );
}
