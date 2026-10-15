import { track as vercelTrack } from '@vercel/analytics';

declare global {
  interface Window {
    dataLayer?: unknown[];
    gtag?: (...args: unknown[]) => void;
  }
}

export type TrackParams = Record<string, string | number | boolean>;

/** Sends one event to Vercel Analytics (always, cookieless) and Google Analytics (only once the visitor said yes). */
export function track(name: string, params: TrackParams = {}) {
  window.gtag?.('event', name, params);
  vercelTrack(name, params);
}

/** Where the visitor came from: the first utm_source/utm_campaign, referrer or "direct" of this visit. */
export const sourceKey = 'ogn-source';
