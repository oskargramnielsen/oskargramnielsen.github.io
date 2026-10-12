'use client';

import { useEffect, useState } from 'react';
import { useReducedMotion } from 'motion/react';
import type { Dict } from '@/content';
import { bookingHref, site } from '@/content/site';
import { cn } from '@/lib/utils';

type State = 'idle' | 'sending' | 'sent' | 'mail' | 'error';

/** Types and deletes example tasks as a placeholder until the visitor writes. */
function useTypedPlaceholder(examples: string[], paused: boolean) {
  const reduce = useReducedMotion();
  const [text, setText] = useState(examples[0]);
  useEffect(() => {
    if (reduce || paused) return;
    let i = 0;
    let n = 0;
    let deleting = false;
    let timer: ReturnType<typeof setTimeout>;
    const tick = () => {
      const s = examples[i];
      if (!deleting) {
        n++;
        if (n >= s.length) deleting = true;
      } else {
        n = Math.max(0, n - 2);
        if (n === 0) {
          deleting = false;
          i = (i + 1) % examples.length;
        }
      }
      setText(examples[i].slice(0, n));
      timer = setTimeout(tick, deleting ? (n >= s.length - 1 ? 1800 : 18) : 42);
    };
    timer = setTimeout(tick, 400);
    return () => clearTimeout(timer);
  }, [examples, paused, reduce]);
  return text;
}

export default function Contact({ t }: { t: Dict['contact'] }) {
  const [task, setTask] = useState('');
  const [email, setEmail] = useState('');
  const [state, setState] = useState<State>('idle');
  const placeholder = useTypedPlaceholder(t.examples, task.length > 0);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    const subject = `Task from website: ${task.slice(0, 60)}`;
    if (!site.web3formsKey) {
      window.location.href = `mailto:${site.email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(`${task}\n\n${email}`)}`;
      setState('mail');
      return;
    }
    setState('sending');
    try {
      const res = await fetch('https://api.web3forms.com/submit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
        body: JSON.stringify({ access_key: site.web3formsKey, subject, email, message: task, from_name: email }),
      });
      const json = await res.json();
      setState(json.success ? 'sent' : 'error');
    } catch {
      setState('error');
    }
  }

  const done = state === 'sent' || state === 'mail';

  return (
    <section id="contact" className="wrap scroll-mt-20 pt-24 pb-28 md:pt-32 md:pb-36">
      <h2 className="text-[clamp(32px,4.2vw,62px)] leading-[1.02] font-semibold tracking-[-0.03em]">{t.title}</h2>

      <form onSubmit={submit} className="relative mt-10 max-w-[900px] border border-ink bg-card md:mt-12">
        <div className="relative">
          <textarea
            value={task}
            onChange={(e) => setTask(e.target.value)}
            required
            rows={4}
            aria-label={t.taskLabel}
            className="block min-h-[150px] w-full resize-none bg-transparent px-5 pt-5 pb-2 text-xl leading-snug tracking-[-0.01em] outline-none md:px-6 md:pt-6 md:text-2xl"
          />
          {!task && (
            <p aria-hidden className="pointer-events-none absolute inset-x-5 top-5 text-xl leading-snug tracking-[-0.01em] text-[#b5b5b0] md:inset-x-6 md:top-6 md:text-2xl">
              {placeholder}
            </p>
          )}
        </div>
        <div className="flex flex-col border-t border-hair sm:flex-row">
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            placeholder={t.email}
            aria-label={t.email}
            className="min-w-0 flex-1 bg-transparent px-5 py-4 text-[17px] outline-none md:px-6"
          />
          <button
            type="submit"
            disabled={state === 'sending'}
            className="bg-ink px-7 py-4 text-[17px] font-medium text-paper transition-colors duration-300 hover:bg-bot disabled:opacity-60"
          >
            {state === 'sending' ? t.sending : `${t.send} →`}
          </button>
        </div>

        {/* After sending, the message lands in the inbox like the agents' messages above. */}
        <div className={cn('absolute inset-0 grid place-items-center bg-card p-5 transition-opacity duration-500', done ? 'opacity-100' : 'pointer-events-none opacity-0')}>
          <div className="w-full max-w-[560px]">
            <div className={cn('grid grid-cols-[8px_auto_1fr_auto] items-center gap-3 border border-hair px-4 py-3 text-sm', done && 'animate-drop')}>
              <span className="size-[7px] rounded-full bg-ink" />
              <span className="font-mono text-xs">{t.you}</span>
              <span className="truncate">{task}</span>
              <span className="font-mono text-xs text-faint">{t.now}</span>
            </div>
            <p className="mt-4 text-lg">{state === 'mail' ? t.mailOpened : t.sent}</p>
          </div>
        </div>
      </form>

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
