export const site = {
  name: 'Oskar Gram Nielsen',
  url: 'https://www.oskargramnielsen.info',
  email: 'ogn.cph@gmail.com',
  linkedin: 'https://www.linkedin.com/in/oskargramnielsen/', // TODO: confirm profile URL
  cv: '/pdfs/CV.pdf',
  // Cal.com event slug, e.g. "oskar/30min". Empty until the Cal.com account is set up.
  calLink: '',
  // Web3Forms access key (public by design). Empty until signed up with site.email.
  web3formsKey: '',
} as const;

export type Lang = 'en' | 'da';

export const langPath: Record<Lang, string> = { en: '/', da: '/da/' };
