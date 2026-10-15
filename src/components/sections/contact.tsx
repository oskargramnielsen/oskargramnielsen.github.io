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
  const [q, setQ] = useState(0);
  const [time, setTime] = useState('');
  const [details, setDetails] = useState('');
  const [email, setEmail] = useState('');
  const [state, setState] = useState<State>('idle');

  const pick = (set: (v: string) => void, v: string) => {
    set(v);
    track('contact_step', { step: 3, time: v });
    setTimeout(() => setQ((n) => n + 1), 220);
  };

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    const firstLine = details.trim().split('\n')[0];
    const subject = `New task from website: ${firstLine.length > 60 ? firstLine.slice(0, 57) + '…' : firstLine}`;
    const message = `${details.trim()}\n\nTime spent: ${time}\nCame from: ${sessionStorage.getItem(sourceKey) || 'unknown'}`;
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
      Object.entries({ access_key: site.web3formsKey, subject, email, message, from_name: email }).forEach(([k, v]) => body.append(k, v));
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
  const questions = [t.q1, t.q2, t.q3];

  return (
    <section id="contact" className="wrap scroll-mt-20 pt-16 pb-20 md:pt-24 md:pb-28">
      <h2 className="text-[clamp(32px,4.2vw,62px)] leading-[1.02] font-semibold tracking-[-0.03em]">{t.title}</h2>
      <p className="mt-4 text-lg text-body md:text-xl">{t.intro}</p>

      <div className="relative mt-10 max-w-[900px] overflow-hidden rounded-[28px] border border-hair bg-card shadow-[0_40px_80px_-50px_#0000004d] md:mt-12">
        {/* Progress */}
        <div className="flex items-center justify-between px-6 pt-5 text-[13px] text-muted md:px-8 md:pt-7">
          <span>
            {t.step} {Math.min(q + 1, 3)} {t.of} 3
          </span>
          <div className="flex gap-1.5">
            {questions.map((_, i) => (
              <span
                key={i}
                className={cn(
                  'h-1.5 rounded-full transition-all duration-300',
                  i === q ? 'w-6 bg-bot' : i < q ? 'w-1.5 bg-bot' : 'w-1.5 bg-hair',
                )}
              />
            ))}
          </div>
        </div>

        <form onSubmit={submit} className="min-h-[300px] px-6 pt-3 pb-7 md:px-8 md:pb-8">
          <AnimatePresence mode="wait" initial={false}>
            <motion.div
              key={q}
              initial={{ opacity: 0, x: 24 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -24 }}
              transition={{ duration: 0.25 }}
            >
              <p className="mb-6 text-[22px] leading-tight font-semibold tracking-[-0.02em] md:text-[28px]">{questions[q]}</p>

              {q === 0 && (
                <div className="flex flex-col items-start gap-6 sm:flex-row sm:items-end">
                  {/* The visitor's own sticky note, like the ones in the hero, with a few ideas to tap. */}
                  <div className="relative flex aspect-square w-full max-w-[320px] shrink-0 -rotate-2 flex-col bg-[#fbe98f] px-5 pt-14 pb-4 shadow-[0_1px_1px_#0000000d,0_24px_34px_-20px_#0000004d] sm:max-w-[340px] sm:pt-16">
                    <span aria-hidden className="absolute inset-x-0 top-0 h-[17%] bg-black/[0.04]" />
                    <textarea
                      value={details}
                      onChange={(e) => setDetails(e.target.value)}
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
                  <button
                    type="button"
                    disabled={!details.trim()}
                    onClick={() => {
                      setQ(1);
                      track('contact_step', { step: 2 });
                    }}
                    className="rounded-full bg-ink px-7 py-3 text-base font-medium text-paper transition-colors duration-300 hover:bg-bot disabled:opacity-30 disabled:hover:bg-ink"
                  >
                    {t.next} →
                  </button>
                </div>
              )}

              {q === 1 && (
                <div className="flex flex-wrap gap-2">
                  {t.times.map((o) => (
                    <Chip key={o} selected={time === o} onClick={() => pick(setTime, o)}>
                      {o}
                    </Chip>
                  ))}
                </div>
              )}

              {q === 2 && (
                <div>
                  <div className="flex items-center rounded-full border border-hair bg-paper p-1.5 transition-colors focus-within:border-ink">
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                      placeholder={t.email}
                      aria-label={t.email}
                      className="min-w-0 flex-1 bg-transparent px-4 py-2.5 text-base outline-none md:text-[17px]"
                    />
                    <button
                      type="submit"
                      disabled={state === 'sending'}
                      className="shrink-0 rounded-full bg-ink px-5 py-2.5 text-base font-medium text-paper transition-colors duration-300 hover:bg-bot disabled:opacity-60 md:px-6"
                    >
                      {state === 'sending' ? t.sending : `${t.send} →`}
                    </button>
                  </div>
                </div>
              )}

              {q > 0 && (
                <button
                  type="button"
                  onClick={() => setQ((n) => n - 1)}
                  className="mt-7 text-[13px] text-muted transition-colors hover:text-ink"
                >
                  ← {t.back}
                </button>
              )}
            </motion.div>
          </AnimatePresence>
        </form>

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
              <span className="truncate">
                {details.trim()} · {time}
              </span>
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
        <span>
          {t.talk}{' '}
          <a href={bookingHref} className="text-ink underline underline-offset-4 hover:text-bot">
            {t.book}
          </a>
        </span>
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
