import type { Metadata } from 'next';
import { dictionaries } from '@/content';
import { langPath, site, type Lang } from '@/content/site';

export function buildMetadata(lang: Lang): Metadata {
  const { meta } = dictionaries[lang];
  return {
    metadataBase: new URL(site.url),
    title: meta.title,
    description: meta.description,
    alternates: {
      canonical: langPath[lang],
      languages: { en: langPath.en, da: langPath.da, 'x-default': langPath.en },
    },
    openGraph: {
      type: 'website',
      url: langPath[lang],
      siteName: site.name,
      title: meta.title,
      description: meta.description,
      locale: lang === 'da' ? 'da_DK' : 'en_US',
    },
    icons: {
      icon: [
        { url: '/favicon.ico' },
        { url: '/favicon-32x32.png', sizes: '32x32', type: 'image/png' },
      ],
      apple: '/apple-touch-icon.png',
    },
  };
}
