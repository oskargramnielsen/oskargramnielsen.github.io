'use client';

import { useState } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import type { Dict } from '@/content';
import { bookingHref, site, type Lang } from '@/content/site';
import { sourceKey, track } from '@/lib/track';
import { cn } from '@/lib/utils';

type State = 'idle' | 'sending' | 'sent' | 'mail' | 'error';

function Chip({ selected, onClick, children }: { selected: boolean; onClick: () => void; children: React.ReactNode }) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={selected}
      className={cn(
        'rounded-full border px-4.5 py-2.5 text-left text-[15px] transition-colors duration-200 md:text-base',
        selected ? 'border-bot bg-bot text-card' : 'border-hair bg-paper hover:border-ink',
      )}
    >
      {children}
    </button>
  );
}

export default function Contact({ t }: { t: Dict['contact']; lang: Lang }) {
  const [time, setTime] = useState('');
  const [details, setDetails] = useState('');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [state, setState] = useState<State>('idle');
  const [started, setStarted] = useState(false);

  const start = () => {
    if (started) return;
    setStarted(true);
    track('contact_step', { step: 2 });
  };

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    const firstLine = details.trim().split('\n')[0];
    const subject = `New task from website: ${firstLine.length > 60 ? firstLine.slice(0, 57) + '…' : firstLine}`;
    const message = [
      details.trim(),
      '',
      `Time spent: ${time || '-'}`,
      `Name: ${name.trim() || '-'}`,
      `Phone: ${phone.trim() || '-'}`,
      `Came from: ${sessionStorage.getItem(sourceKey) || 'unknown'}`,
    ].join('\n');
    if (!site.web3formsKey) {
      window.location.href = `mailto:${site.email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(`${message}\n\n${email}`)}`;
      setState('mail');
      track('contact_submit', { result: 'mail', time });
      return;
    }
    setState('sending');
    try {
      // Plain form data, so the browser sends it without a CORS preflight.
      const body = new FormData();
      Object.entries({ access_key: site.web3formsKey, subject, email, message, from_name: name.trim() || email }).forEach(([k, v]) =>
        body.append(k, v),
      );
      const res = await fetch('https://api.web3forms.com/submit', { method: 'POST', body });
      const json = await res.json();
      setState(json.success ? 'sent' : 'error');
      track('contact_submit', { result: json.success ? 'sent' : 'error', time });
    } catch {
      setState('error');
      track('contact_submit', { result: 'error', time });
    }
  }

  const done = state === 'sent' || state === 'mail';
  const field =
    'w-full rounded-[14px] border border-hair bg-paper px-4 py-3 text-base outline-none transition-colors placeholder:text-faint focus:border-ink';

  return (
    <section id="contact" className="wrap scroll-mt-20 pt-16 pb-20 md:pt-24 md:pb-28">
      <h2 className="text-[clamp(30px,4.2vw,62px)] leading-[1.02] font-semibold tracking-[-0.03em]">{t.title}</h2>
      <p className="mt-4 text-[17px] text-body md:text-xl">{t.intro}</p>

      <div className="relative mt-10 max-w-[1040px] overflow-hidden rounded-[28px] border border-hair bg-card shadow-[0_40px_80px_-50px_#0000004d] md:mt-12">
        <form onSubmit={submit} className="px-6 pt-6 pb-7 md:px-8 md:pt-8 md:pb-8">
          <p className="mb-6 text-[22px] leading-tight font-semibold tracking-[-0.02em] md:text-[28px]">{t.q1}</p>

          <div className="flex flex-col gap-8 md:flex-row md:items-start md:gap-10">
            {/* The visitor's own sticky note, like the ones in the hero, with a few ideas to tap. */}
            <div className="relative flex aspect-square w-full max-w-[320px] shrink-0 -rotate-2 flex-col bg-[#fbe98f] px-5 pt-14 pb-4 shadow-[0_1px_1px_#0000000d,0_24px_34px_-20px_#0000004d] sm:max-w-[340px] sm:pt-16">
              <span aria-hidden className="absolute inset-x-0 top-0 h-[17%] bg-black/[0.04]" />
              <textarea
                value={details}
                onChange={(e) => {
                  setDetails(e.target.value);
                  start();
                }}
                required
                placeholder={t.placeholder}
                aria-label={t.q1}
                className="relative min-h-0 w-full flex-1 resize-none bg-transparent font-[family-name:var(--font-hand)] text-[26px] leading-[1.1] font-semibold text-[#2a2616] outline-none placeholder:text-[#2a261666] md:text-[28px]"
              />
              <AnimatePresence initial={false}>
                {!details.trim() && (
                  <motion.div
                    key="ideas"
                    initial={{ opacity: 0, y: 6 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 6 }}
                    className="relative flex flex-wrap gap-1.5"
                  >
                    {t.suggestions.map((s) => (
                      <button
                        key={s}
                        type="button"
                        onClick={() => {
                          setDetails(s);
                          start();
                          track('contact_suggestion', { text: s });
                        }}
                        className="rounded-full bg-[#2a2616]/[0.07] px-2.5 py-1 text-left text-[13px] leading-tight text-[#2a2616] transition-colors hover:bg-[#2a2616]/[0.14]"
                      >
                        + {s}
                      </button>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* How long it takes, and how to reach the visitor. */}
            <div className="flex min-w-0 flex-1 flex-col gap-5">
              <fieldset>
                <legend className="mb-2.5 text-[15px] font-medium">{t.q2}</legend>
                <div className="flex flex-wrap gap-1.5">
                  {t.times.map((o) => (
                    <Chip
                      key={o}
                      selected={time === o}
                      onClick={() => {
                        setTime(o);
                        track('contact_step', { step: 3, time: o });
                      }}
                    >
                      {o}
                    </Chip>
                  ))}
                </div>
              </fieldset>
              <div>
                <p className="mb-2.5 text-[15px] font-medium">{t.q3}</p>
                <div className="grid gap-2 sm:grid-cols-2">
                  <input
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    onFocus={start}
                    autoComplete="name"
                    placeholder={t.name}
                    aria-label={t.name}
                    className={field}
                  />
                  <input
                    type="tel"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    onFocus={start}
                    autoComplete="tel"
                    placeholder={t.phone}
                    aria-label={t.phone}
                    className={field}
                  />
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    onFocus={start}
                    required
                    autoComplete="email"
                    placeholder={t.email}
                    aria-label={t.email}
                    className={cn(field, 'sm:col-span-2')}
                  />
                </div>
              </div>
              <button
                type="submit"
                disabled={state === 'sending' || !details.trim()}
                className="self-start rounded-full bg-ink px-7 py-3.5 text-base font-medium text-paper transition-colors duration-300 hover:bg-bot disabled:opacity-30 disabled:hover:bg-ink"
              >
                {state === 'sending' ? t.sending : `${t.send} →`}
              </button>
            </div>
          </div>
        </form>

        {/* For people who would rather talk than write. */}
        <div className="border-t border-hair bg-shade px-6 py-6 md:px-8 md:py-7">
          <div className="flex flex-col gap-5 md:flex-row md:items-center md:gap-8">
            <div className="min-w-0 flex-1">
              <p className="text-[20px] leading-tight font-semibold tracking-[-0.02em] md:text-[22px]">{t.bookTitle}</p>
              <p className="mt-1.5 max-w-[460px] text-[15px] leading-snug text-muted">{t.bookText}</p>
              <div aria-hidden className="mt-4 flex flex-wrap gap-1.5">
                {t.slots.map((s, i) => (
                  <span
                    key={s}
                    className={cn(
                      'rounded-full px-3 py-1.5 text-[13px]',
                      i === 0 ? 'bg-bot text-card' : 'border border-hair bg-card text-muted',
                    )}
                  >
                    {s}
                  </span>
                ))}
              </div>
            </div>
            <a
              href={bookingHref}
              className="flex shrink-0 items-center justify-center gap-2.5 rounded-full bg-bot px-8 py-4.5 text-[18px] font-medium text-card shadow-[0_14px_30px_-14px_#1f3bffaa] transition-colors duration-300 hover:bg-ink"
            >
              <svg
                viewBox="0 0 24 24"
                className="size-5"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.8"
                strokeLinecap="round"
                aria-hidden
              >
                <rect x="4" y="5.5" width="16" height="14" rx="2.5" />
                <path d="M4 10h16M8.5 3.5v4M15.5 3.5v4" />
              </svg>
              {t.book}
            </a>
          </div>
        </div>

        {/* After sending, the request lands like one of the agents' messages. */}
        <div
          className={cn(
            'absolute inset-0 grid place-items-center bg-card p-5 transition-opacity duration-500',
            done ? 'opacity-100' : 'pointer-events-none opacity-0',
          )}
        >
          <div className="w-full max-w-[560px]">
            <div
              className={cn(
                'grid grid-cols-[8px_auto_1fr_auto] items-center gap-3 rounded-full border border-hair px-4 py-3 text-sm',
                done && 'animate-drop',
              )}
            >
              <span className="size-[7px] rounded-full bg-ink" />
              <span className="font-mono text-xs">{t.you}</span>
              <span className="truncate">{[details.trim(), time].filter(Boolean).join(' · ')}</span>
              <span className="font-mono text-xs text-faint">{t.now}</span>
            </div>
            <p className="mt-4 text-lg">{state === 'mail' ? t.mailOpened : t.sent}</p>
          </div>
        </div>
      </div>

      {state === 'error' && (
        <p className="mt-4 text-base">
          {t.error}{' '}
          <a href={`mailto:${site.email}`} className="underline underline-offset-4">
            {site.email}
          </a>
        </p>
      )}

      <div className="mt-6 flex flex-wrap items-center gap-x-8 gap-y-3 text-base text-muted">
        <a href={`mailto:${site.email}`} className="text-ink hover:text-bot">
          {site.email}
        </a>
        <a href={site.linkedin} target="_blank" rel="noopener noreferrer" className="text-ink hover:text-bot">
          LinkedIn ↗
        </a>
      </div>
    </section>
  );
}
