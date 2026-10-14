'use client';

import { useRef, useState, useSyncExternalStore } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import type { Dict } from '@/content';
import { bookingHref, site, type Lang } from '@/content/site';
import { cn } from '@/lib/utils';

type State = 'idle' | 'sending' | 'sent' | 'mail' | 'error';

// Minimal typing for the browser's speech recognition (Chrome, Edge, Safari).
type Recognition = {
  lang: string;
  continuous: boolean;
  interimResults: boolean;
  start: () => void;
  stop: () => void;
  onresult: ((e: { results: ArrayLike<ArrayLike<{ transcript: string }> & { isFinal: boolean }> }) => void) | null;
  onend: (() => void) | null;
};
type RecognitionCtor = new () => Recognition;

function getRecognition(): RecognitionCtor | undefined {
  if (typeof window === 'undefined') return undefined;
  const w = window as unknown as { SpeechRecognition?: RecognitionCtor; webkitSpeechRecognition?: RecognitionCtor };
  return w.SpeechRecognition ?? w.webkitSpeechRecognition;
}

const noop = () => () => {};

/** Dictation via the browser's built-in speech recognition. Note: Chrome sends the audio to Google for transcription. */
function useDictation(lang: Lang, onText: (text: string) => void) {
  const supported = useSyncExternalStore(
    noop,
    () => !!getRecognition(),
    () => false,
  );
  const [listening, setListening] = useState(false);
  const rec = useRef<Recognition | null>(null);
  const base = useRef('');

  const toggle = (current: string) => {
    if (listening) {
      rec.current?.stop();
      return;
    }
    const Ctor = getRecognition();
    if (!Ctor) return;
    const r = new Ctor();
    r.lang = lang === 'da' ? 'da-DK' : 'en-US';
    r.continuous = true;
    r.interimResults = true;
    base.current = current ? current.trimEnd() + ' ' : '';
    r.onresult = (e) => {
      let text = '';
      for (let i = 0; i < e.results.length; i++) text += e.results[i][0].transcript;
      onText(base.current + text);
    };
    r.onend = () => setListening(false);
    rec.current = r;
    r.start();
    setListening(true);
  };

  return { supported, listening, toggle };
}

function Chip({ selected, onClick, children }: { selected: boolean; onClick: () => void; children: React.ReactNode }) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={selected}
      className={cn(
        'border px-4 py-2.5 text-left text-base transition-colors duration-200 md:text-[17px]',
        selected ? 'border-bot bg-bot text-card' : 'border-ink bg-card hover:border-bot hover:text-bot',
      )}
    >
      {children}
    </button>
  );
}

export default function Contact({ t, lang }: { t: Dict['contact']; lang: Lang }) {
  const [q, setQ] = useState(0);
  const [time, setTime] = useState('');
  const [details, setDetails] = useState('');
  const [email, setEmail] = useState('');
  const [state, setState] = useState<State>('idle');
  const dictation = useDictation(lang, setDetails);

  const pick = (set: (v: string) => void, v: string) => {
    set(v);
    setTimeout(() => setQ((n) => n + 1), 220);
  };

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    const firstLine = details.trim().split('\n')[0];
    const subject = `New task from website: ${firstLine.length > 60 ? firstLine.slice(0, 57) + '…' : firstLine}`;
    const message = `${details.trim()}\n\nTime spent: ${time}`;
    if (!site.web3formsKey) {
      window.location.href = `mailto:${site.email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(`${message}\n\n${email}`)}`;
      setState('mail');
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
    } catch {
      setState('error');
    }
  }

  const done = state === 'sent' || state === 'mail';
  const questions = [t.q1, t.q2, t.q3];

  return (
    <section id="contact" className="wrap scroll-mt-20 pt-24 pb-28 md:pt-36 md:pb-36">
      <h2 className="text-[clamp(32px,4.2vw,62px)] leading-[1.02] font-semibold tracking-[-0.03em]">{t.title}</h2>
      <p className="mt-4 text-lg text-body md:text-xl">{t.intro}</p>

      <div className="relative mt-10 max-w-[900px] border border-ink bg-card md:mt-12">
        {/* Progress */}
        <div className="flex items-center justify-between border-b border-hair px-5 py-3 font-mono text-xs text-muted md:px-6">
          <span>
            {t.step} {Math.min(q + 1, 3)} {t.of} 3
          </span>
          <div className="flex gap-1.5">
            {questions.map((_, i) => (
              <span key={i} className={cn('h-1 w-8 transition-colors duration-300', i <= q ? 'bg-bot' : 'bg-hair')} />
            ))}
          </div>
        </div>

        <form onSubmit={submit} className="min-h-[340px] p-5 md:p-6">
          <AnimatePresence mode="wait" initial={false}>
            <motion.div
              key={q}
              initial={{ opacity: 0, x: 24 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -24 }}
              transition={{ duration: 0.25 }}
            >
              <p className="mb-5 text-xl font-medium tracking-[-0.01em] md:text-2xl">{questions[q]}</p>

              {q === 0 && (
                <div className="flex flex-col items-start gap-6 sm:flex-row sm:items-end">
                  {/* The visitor's own sticky note, like the ones in the hero. */}
                  <div className="relative aspect-square w-full max-w-[300px] shrink-0 -rotate-2 bg-[#fbe98f] px-5 pt-[21%] pb-4 shadow-[0_1px_1px_#0000000d,0_24px_34px_-20px_#0000004d]">
                    <span aria-hidden className="absolute inset-x-0 top-0 h-[18%] bg-black/[0.04]" />
                    <textarea
                      value={details}
                      onChange={(e) => setDetails(e.target.value)}
                      placeholder={t.placeholder}
                      aria-label={t.q1}
                      className="relative size-full resize-none bg-transparent font-[family-name:var(--font-hand)] text-[26px] leading-[1.1] font-semibold text-[#2a2616] outline-none placeholder:text-[#2a261666] md:text-[28px]"
                    />
                  </div>
                  <div className="flex w-full flex-col gap-3 sm:w-auto">
                    {dictation.supported && (
                      <button
                        type="button"
                        onClick={() => dictation.toggle(details)}
                        aria-pressed={dictation.listening}
                        className={cn(
                          'flex items-center gap-2.5 text-left text-[15px] transition-colors',
                          dictation.listening ? 'text-bot' : 'hover:text-bot',
                        )}
                      >
                        <span
                          className={cn(
                            'grid size-8 place-items-center rounded-full',
                            dictation.listening ? 'animate-pulse bg-bot text-card' : 'bg-ink text-card',
                          )}
                        >
                          <svg viewBox="0 0 24 24" className="size-3.5" fill="currentColor" aria-hidden>
                            <path d="M12 15a3 3 0 0 0 3-3V6a3 3 0 1 0-6 0v6a3 3 0 0 0 3 3Zm5-3a5 5 0 0 1-10 0H5a7 7 0 0 0 6 6.92V21h2v-2.08A7 7 0 0 0 19 12h-2Z" />
                          </svg>
                        </span>
                        {dictation.listening ? t.listening : t.voice}
                      </button>
                    )}
                    <button
                      type="button"
                      disabled={!details.trim()}
                      onClick={() => {
                        if (dictation.listening) dictation.toggle(details);
                        setQ(1);
                      }}
                      className="bg-ink px-7 py-3.5 text-[17px] font-medium text-paper transition-colors duration-300 hover:bg-bot disabled:opacity-40 disabled:hover:bg-ink"
                    >
                      {t.next} →
                    </button>
                  </div>
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
                  <div className="flex flex-col border border-ink sm:flex-row">
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                      placeholder={t.email}
                      aria-label={t.email}
                      className="min-w-0 flex-1 bg-transparent px-4 py-3.5 text-[17px] outline-none"
                    />
                    <button
                      type="submit"
                      disabled={state === 'sending'}
                      className="bg-ink px-7 py-3.5 text-[17px] font-medium text-paper transition-colors duration-300 hover:bg-bot disabled:opacity-60"
                    >
                      {state === 'sending' ? t.sending : `${t.send} →`}
                    </button>
                  </div>
                </div>
              )}

              {q > 0 && (
                <button type="button" onClick={() => setQ((n) => n - 1)} className="mt-6 font-mono text-xs text-muted hover:text-bot">
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
                'grid grid-cols-[8px_auto_1fr_auto] items-center gap-3 border border-hair px-4 py-3 text-sm',
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
