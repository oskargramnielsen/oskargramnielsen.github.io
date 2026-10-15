export const site = {
  name: 'Oskar Gram Nielsen',
  url: 'https://www.oskargramnielsen.info',
  email: 'ogn.cph@gmail.com',
  linkedin: 'https://www.linkedin.com/in/oskar-gram-nielsen-462bb3141/',
  cv: '/pdfs/CV.pdf',
  // Cal.com event slug.
  calLink: 'oskar-nielsen-uukqoh/20min',
  // Web3Forms access key. Public by design: it only lets the form send mail to site.email.
  web3formsKey: '4b17ca73-ec43-461f-b533-8fb63b1d2dd2',
  // Google Analytics 4 measurement ID (G-…). Public by design. Empty: no Google Analytics and no cookie banner.
  gaId: 'G-FYVHW5N03S',
} as const;

export const bookingHref: string = site.calLink ? `https://cal.com/${site.calLink}?overlayCalendar=true` : '#contact';

export type Lang = 'en' | 'da';

export const langPath: Record<Lang, string> = { en: '/', da: '/da/' };
