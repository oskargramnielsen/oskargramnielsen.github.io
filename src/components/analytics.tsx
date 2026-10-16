'use client';

import { useEffect, useSyncExternalStore } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import { Analytics as VercelAnalytics } from '@vercel/analytics/next';
import { dictionaries } from '@/content';
import { langPath, site, type Lang } from '@/content/site';
import { sourceKey, track } from '@/lib/track';

const KEY = 'ogn-consent';
const SECTIONS = ['benefits', 'work', 'projects', 'how', 'contact'];

type Consent = 'yes' | 'no' | null | 'pending';

function subscribe(cb: () => void) {
  window.addEventListener('storage', cb);
  window.addEventListener(KEY, cb);
  return () => {
    window.removeEventListener('storage', cb);
    window.removeEventListener(KEY, cb);
  };
}
const read = () => localStorage.getItem(KEY) as Consent;

function setConsent(v: 'yes' | 'no' | null) {
  if (v) localStorage.setItem(KEY, v);
  else localStorage.removeItem(KEY);
  window.dispatchEvent(new Event(KEY));
}

/** Loads Google Analytics, once. */
function loadGa(id: string) {
  if (window.gtag) return;
  window.dataLayer = window.dataLayer || [];
  window.gtag = function gtag() {
    // gtag.js expects the arguments object itself.
    // eslint-disable-next-line prefer-rest-params
    window.dataLayer!.push(arguments);
  };
  window.gtag('js', new Date());
  // Analytics only: no ads signals, matching what the banner promises.
  window.gtag('config', id, { allow_google_signals: false, allow_ad_personalization_signals: false });
  const s = document.createElement('script');
  s.async = true;
  s.src = `https://www.googletagmanager.com/gtag/js?id=${id}`;
  document.head.appendChild(s);
}

/** What a click was on, as an event name and its parameters. */
function describe(el: Element): [string, Record<string, string>] | null {
  const where = el.closest('[id]')?.id || 'header';
  if (el instanceof HTMLAnchorElement) {
    const href = el.getAttribute('href') || '';
    if (href === site.cv) return ['cv_download', { where }];
    if (href.includes('cal.com')) return ['book_call', { where }];
    if (href.startsWith('mailto:')) return ['email_click', { where }];
    if (href.includes('linkedin.com')) return ['linkedin_click', { where }];
    if (href.startsWith('#')) return ['jump', { to: href.slice(1) || 'top', where }];
    if (Object.values(langPath).includes(href)) return ['language', { to: href === langPath.da ? 'da' : 'en' }];
    if (el.host && el.host !== location.host) return ['outbound', { to: el.host, where }];
    return null;
  }
  // A read-more button about to open.
  if (el.getAttribute('aria-expanded') === 'false') return ['read_more', { where }];
  return null;
}

export default function Analytics({ lang }: { lang: Lang }) {
  const consent = useSyncExternalStore<Consent>(subscribe, read, () => 'pending');
  const t = dictionaries[lang].consent;

  useEffect(() => {
    if (site.gaId && consent === 'yes') loadGa(site.gaId);
  }, [consent]);

  // Remember where this visit came from, so the contact form can say it.
  useEffect(() => {
    if (sessionStorage.getItem(sourceKey)) return;
    const q = new URLSearchParams(location.search);
    const utm = [q.get('utm_source'), q.get('utm_campaign')].filter(Boolean).join(' / ');
    const ref = document.referrer && new URL(document.referrer).host !== location.host ? new URL(document.referrer).host : '';
    sessionStorage.setItem(sourceKey, utm || ref || 'direct');
  }, []);

  // Clicks on links and buttons that matter.
  useEffect(() => {
    const onClick = (e: MouseEvent) => {
      const el = (e.target as Element).closest('a, button');
      const hit = el && describe(el);
      if (hit) track(...hit);
    };
    document.addEventListener('click', onClick, { capture: true });
    return () => document.removeEventListener('click', onClick, { capture: true });
  }, []);

  // How far down people get: each section once.
  useEffect(() => {
    const seen = new Set<string>();
    const io = new IntersectionObserver(
      (entries) =>
        entries.forEach((e) => {
          if (!e.isIntersecting || seen.has(e.target.id)) return;
          seen.add(e.target.id);
          track('section_view', { section: e.target.id });
        }),
      { rootMargin: '0px 0px -50% 0px' },
    );
    SECTIONS.forEach((id) => {
      const el = document.getElementById(id);
      if (el) io.observe(el);
    });
    return () => io.disconnect();
  }, []);

  return (
    <>
      <VercelAnalytics />
      <AnimatePresence>
        {site.gaId && consent === null && (
          <motion.div
            role="dialog"
            aria-label={t.label}
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 16 }}
            transition={{ duration: 0.35, ease: [0.2, 0.8, 0.2, 1] }}
            className="fixed inset-x-3 bottom-3 z-[70] mx-auto flex w-fit max-w-[calc(100%-24px)] items-center gap-3 rounded-full border border-hair bg-card py-1.5 pr-1.5 pl-4 shadow-[0_20px_50px_-20px_#00000055] sm:bottom-5"
          >
            <p className="text-[13px] leading-tight text-body">{t.text}</p>
            <div className="flex shrink-0 gap-1">
              <button
                type="button"
                onClick={() => setConsent('yes')}
                className="rounded-full bg-ink px-3 py-1.5 text-[13px] font-medium text-card press hover:bg-bot"
              >
                {t.yes}
              </button>
              <button
                type="button"
                onClick={() => setConsent('no')}
                className="rounded-full px-2.5 py-1.5 text-[13px] font-medium text-muted transition-colors hover:text-ink"
              >
                {t.no}
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

/** Footer link that asks again. Turning analytics off reloads the page so Google's script is gone. */
export function ConsentSettings({ label }: { label: string }) {
  if (!site.gaId) return null;
  return (
    <button
      type="button"
      onClick={() => {
        const wasOn = read() === 'yes';
        setConsent(null);
        if (wasOn) {
          document.cookie.split(';').forEach((c) => {
            const name = c.split('=')[0].trim();
            if (name.startsWith('_ga')) document.cookie = `${name}=; Max-Age=0; path=/; domain=.${location.hostname.replace(/^www\./, '')}`;
          });
          location.reload();
        }
      }}
      className="underline underline-offset-4 hover:text-bot"
    >
      {label}
    </button>
  );
}
