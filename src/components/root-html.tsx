import { Caveat, Schibsted_Grotesk } from 'next/font/google';
import type { Lang } from '@/content/site';
import Analytics from './analytics';
import SmoothScroll from './smooth-scroll';
import '@/app/globals.css';

const schibsted = Schibsted_Grotesk({
  subsets: ['latin', 'latin-ext'],
  weight: ['400', '500', '600'],
  style: ['normal', 'italic'],
  variable: '--font-schibsted',
  display: 'swap',
});

// Handwriting on the hero sticky notes.
const caveat = Caveat({ subsets: ['latin', 'latin-ext'], weight: ['600'], variable: '--font-hand', display: 'swap' });

export default function RootHtml({ lang, children }: { lang: Lang; children: React.ReactNode }) {
  return (
    <html lang={lang} className={`${schibsted.variable} ${caveat.variable}`}>
      <body>
        <SmoothScroll>{children}</SmoothScroll>
        <Analytics lang={lang} />
      </body>
    </html>
  );
}
