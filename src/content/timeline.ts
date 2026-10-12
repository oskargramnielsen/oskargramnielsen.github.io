import type { Lang } from './site';

type L = Record<Lang, string>;

export type Milestone = {
  year: string;
  title: L;
  body: L;
  /** Path under /public, e.g. '/images/master.png'. Omit to show a placeholder. */
  image?: string;
};

// PLACEHOLDER CONTENT — replace bodies once the real timeline context is provided.
export const timeline: Milestone[] = [
  {
    year: '2018',
    title: { en: 'BSc · DTU', da: 'BSc · DTU' },
    body: { en: 'Architectural Engineering — placeholder.', da: 'Bygningsdesign — pladsholder.' },
    image: '/images/bachelor.png',
  },
  {
    year: '2022',
    title: { en: 'MSc · DTU', da: 'MSc · DTU' },
    body: { en: 'Cloud-based LCA & BIM — placeholder.', da: 'Cloud-baseret LCA & BIM — pladsholder.' },
    image: '/images/master.png',
  },
  {
    year: '2022',
    title: { en: 'Founded Andelskortet', da: 'Grundlagde Andelskortet' },
    body: { en: 'Placeholder one-liner.', da: 'Pladsholder.' },
    image: '/images/andelskortet.png',
  },
  {
    year: '2023',
    title: { en: 'Founded Veritrace', da: 'Grundlagde Veritrace' },
    body: { en: 'Placeholder one-liner.', da: 'Pladsholder.' },
  },
  {
    year: '2024',
    title: { en: 'Automation Engineer · CN3', da: 'Automation Engineer · CN3' },
    body: { en: 'Placeholder one-liner.', da: 'Pladsholder.' },
  },
  {
    year: '2026',
    title: { en: 'Your company', da: 'Jeres virksomhed' },
    body: { en: "Let's find your bottlenecks.", da: 'Lad os finde jeres flaskehalse.' },
  },
];
