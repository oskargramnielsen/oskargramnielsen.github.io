import type { Lang } from './site';

type L = Record<Lang, string>;

export type Stat = { value: string; label: L };

export type Showreel = {
  /** Path under /public or a remote URL. Omit to show a placeholder. */
  video?: string;
  poster?: string;
  stats: Stat[];
};

// PLACEHOLDER CONTENT — replace with real demo video and case numbers.
export const showreel: Showreel = {
  stats: [
    { value: '−92%', label: { en: 'Handling time · Case placeholder', da: 'Behandlingstid · Pladsholder' } },
    { value: '31 h', label: { en: 'Saved per week · Case placeholder', da: 'Sparet pr. uge · Pladsholder' } },
    { value: '3 wk', label: { en: 'From call to live · Case placeholder', da: 'Fra møde til drift · Pladsholder' } },
  ],
};
