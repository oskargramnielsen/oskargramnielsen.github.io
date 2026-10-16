'use client';

// Five alternative designs for the "Get your hours back" section, to pick from. Not linked from the site.
import { useEffect, useRef, useState } from 'react';
import { animate, motion, useInView, useReducedMotion } from 'motion/react';
import { en } from '@/content/en';
import { ICONS } from '@/components/sections/benefits';
import { cn } from '@/lib/utils';

const t = en.benefits;
const ease = [0.2, 0.8, 0.2, 1] as const;

// Example week, the same 16 hours the hero notes hint at.
const CHORES = [
  ['Copy orders into e-conomic', 5],
  ['Answer the same emails', 3],
  ['Type in invoices', 3],
  ['Monday report', 2],
  ['Merge the spreadsheets', 2],
  ['Chase unpaid invoices', 1],
] as const;
const HOURS = CHORES.reduce((a, [, h]) => a + h, 0);

// What each benefit replaces, for the before/after option.
const BEFORE: Record<string, string> = {
  time: '5 hours a week copying orders',
  check: 'A typo in the price list, again',
  money: 'Paying for the same task every week',
  heart: 'Evenings spent in spreadsheets',
  shield: 'No idea where the data goes',
  moon: 'Nothing happens until Monday',
};

function Icon({ name, className }: { name: string; className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      className={className}
      fill="none"
      stroke="currentColor"
      strokeWidth="1.7"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden
    >
      {ICONS[name]}
    </svg>
  );
}

function Heading({ letter, name, idea }: { letter: string; name: string; idea: string }) {
  return (
    <div className="mb-8 flex flex-wrap items-baseline gap-x-4 gap-y-1 border-t-2 border-ink pt-4 md:mb-10">
      <span className="font-mono text-[13px] text-bot">Option {letter}</span>
      <span className="text-[15px] font-semibold">{name}</span>
      <span className="text-[14px] text-muted">{idea}</span>
    </div>
  );
}

function Title() {
  return (
    <>
      <p className="font-mono text-[13px] text-muted">{t.label}</p>
      <h2 className="mt-3 text-[clamp(32px,4.2vw,62px)] leading-[1.02] font-semibold tracking-[-0.03em]">{t.title}</h2>
    </>
  );
}

function Count({ to, className }: { to: number; className?: string }) {
  const ref = useRef<HTMLSpanElement>(null);
  const seen = useInView(ref, { once: true, margin: '-20% 0px' });
  const [n, setN] = useState(0);
  useEffect(() => {
    if (!seen) return;
    const c = animate(0, to, { duration: 1.6, ease, onUpdate: (v) => setN(Math.round(v)) });
    return () => c.stop();
  }, [seen, to]);
  return (
    <span ref={ref} className={className}>
      {n}
    </span>
  );
}

const inView = (reduce: boolean | null) => ({
  initial: reduce ? false : ('hidden' as const),
  whileInView: 'shown',
  viewport: { once: true, margin: '-15% 0px' },
});

/** A: a till receipt prints the hours you get back, the benefits stamped next to it. */
function Receipt() {
  const reduce = useReducedMotion();
  return (
    <div className="grid items-start gap-10 md:grid-cols-[minmax(0,400px)_1fr] md:gap-14">
      <motion.div
        {...inView(reduce)}
        variants={{
          hidden: { clipPath: 'inset(0 0 100% 0)' },
          shown: { clipPath: 'inset(0 0 0% 0)', transition: { duration: 1.6, ease: 'linear' } },
        }}
        className="relative mx-auto w-full max-w-[400px] -rotate-1 bg-card px-6 pt-7 pb-10 font-mono text-[13px] shadow-[0_30px_60px_-34px_#00000066] [mask:conic-gradient(from_-45deg_at_bottom,#0000,#000_1deg_89deg,#0000_90deg)_50%/16px_100%]"
      >
        <p className="text-center text-[15px] font-semibold tracking-[0.2em]">YOUR WEEK</p>
        <p className="mt-1 text-center text-[11px] text-muted">After automation · receipt no. 0042</p>
        <div className="my-4 border-t border-dashed border-ink/40" />
        {CHORES.map(([c, h]) => (
          <p key={c} className="flex gap-2 py-1">
            <span className="shrink-0">{c}</span>
            <span className="flex-1 translate-y-[-4px] border-b border-dotted border-ink/30" />
            <span className="shrink-0 text-bot">+{h} h</span>
          </p>
        ))}
        <div className="my-4 border-t border-dashed border-ink/40" />
        <p className="flex justify-between text-[18px] font-semibold">
          <span>TIME BACK</span>
          <span className="text-bot">{HOURS} h / week</span>
        </p>
        <p className="mt-1 flex justify-between text-muted">
          <span>Paid with</span>
          <span>one build</span>
        </p>
        <p className="mt-6 text-center text-[11px] tracking-[0.3em] text-muted">THANK YOU · COME AGAIN NEVER</p>
        <div
          aria-hidden
          className="mx-auto mt-3 h-8 w-48 bg-[repeating-linear-gradient(90deg,#16171c_0_2px,transparent_2px_4px,#16171c_4px_5px,transparent_5px_8px)]"
        />
      </motion.div>

      <ul className="grid gap-x-8 gap-y-6 sm:grid-cols-2">
        {t.items.map((b, i) => (
          <motion.li
            key={b.title}
            {...inView(reduce)}
            variants={{
              hidden: { opacity: 0, scale: 1.4, rotate: -6 },
              shown: {
                opacity: 1,
                scale: 1,
                rotate: 0,
                transition: { delay: 0.4 + i * 0.15, type: 'spring', stiffness: 400, damping: 20 },
              },
            }}
          >
            <span className="inline-block -rotate-2 rounded-[6px] border-2 border-bot px-2 py-0.5 font-mono text-[13px] font-semibold tracking-[0.08em] text-bot uppercase">
              {b.title}
            </span>
            <p className="mt-2 text-[15px] leading-snug text-body">{b.text}</p>
          </motion.li>
        ))}
      </ul>
    </div>
  );
}

const NOTE_COLORS = ['#fbe98f', '#ffd3c4', '#cfe4ff', '#d8f0d2', '#fbe98f', '#e8dcff'];
const NOTE_TILT = [-3, 2, -1.5, 3, -2.5, 1.5];

/** B: the benefits on sticky notes, slapped onto the wall like the ones in the hero. */
function Notes() {
  const reduce = useReducedMotion();
  return (
    <ul className="grid grid-cols-2 gap-4 sm:gap-6 lg:grid-cols-3 lg:gap-8">
      {t.items.map((b, i) => (
        <motion.li
          key={b.title}
          {...inView(reduce)}
          variants={{
            hidden: { opacity: 0, scale: 1.25, y: -20, rotate: NOTE_TILT[i] * 3 },
            shown: {
              opacity: 1,
              scale: 1,
              y: 0,
              rotate: NOTE_TILT[i],
              transition: { delay: i * 0.12, type: 'spring', stiffness: 260, damping: 16 },
            },
          }}
          whileHover={{ rotate: 0, scale: 1.03 }}
          className="relative min-h-[190px] p-4 pt-9 shadow-[0_1px_1px_#0000000d,0_24px_34px_-20px_#0000004d] sm:min-h-[240px] sm:p-7 sm:pt-12"
          style={{ background: NOTE_COLORS[i] }}
        >
          <span aria-hidden className="absolute top-0 left-1/2 h-6 w-20 -translate-x-1/2 -translate-y-1/2 rotate-[-4deg] bg-white/60" />
          <Icon name={b.icon} className="absolute top-4 right-4 size-6 text-[#2a2616]/50 sm:size-7" />
          <p className="font-[family-name:var(--font-hand)] text-[26px] leading-[1] font-semibold text-[#2a2616] sm:text-[44px]">
            {b.title}
          </p>
          <p className="mt-2 text-[13px] leading-snug text-[#2a2616]/75 sm:mt-4 sm:text-[17px]">{b.text}</p>
        </motion.li>
      ))}
    </ul>
  );
}

/** C: an editorial list. Big outlined numbers, a blue line drawing under each row. */
function Editorial() {
  const reduce = useReducedMotion();
  return (
    <div>
      <p className="mb-6 text-[clamp(64px,12vw,180px)] leading-[0.85] font-semibold tracking-[-0.06em] text-bot">
        +<Count to={HOURS} />h
        <span className="ml-3 align-top text-[clamp(14px,1.4vw,18px)] font-medium tracking-normal text-muted">
          a week, in a typical small office
        </span>
      </p>
      <ol>
        {t.items.map((b, i) => (
          <motion.li
            key={b.title}
            {...inView(reduce)}
            variants={{ hidden: { opacity: 0 }, shown: { opacity: 1, transition: { delay: i * 0.08 } } }}
            className="relative grid grid-cols-[56px_1fr] items-baseline gap-x-4 gap-y-1 py-5 md:grid-cols-[110px_1fr_1.2fr] md:gap-x-8 md:py-7"
          >
            <span className="text-[44px] leading-none font-semibold text-transparent [-webkit-text-stroke:1.5px_#16171c] md:text-[72px]">
              {String(i + 1).padStart(2, '0')}
            </span>
            <h3 className="text-[24px] leading-tight font-semibold tracking-[-0.02em] md:text-[36px]">{b.title}</h3>
            <p className="col-start-2 text-[15px] text-body md:col-start-3 md:text-[17px]">{b.text}</p>
            <span className="absolute inset-x-0 bottom-0 h-px bg-hair" />
            <motion.span
              className="absolute bottom-0 left-0 h-[2px] w-full origin-left bg-bot"
              variants={{ hidden: { scaleX: 0 }, shown: { scaleX: 1, transition: { delay: 0.2 + i * 0.08, duration: 0.9, ease } } }}
            />
          </motion.li>
        ))}
      </ol>
    </div>
  );
}

/** D: one switch. Flip it and every grey "before" becomes a blue "after". */
function Switch() {
  const ref = useRef<HTMLDivElement>(null);
  const seen = useInView(ref, { once: true, margin: '-30% 0px' });
  const [on, setOn] = useState(false);
  useEffect(() => {
    if (!seen) return;
    const id = setTimeout(() => setOn(true), 900);
    return () => clearTimeout(id);
  }, [seen]);
  return (
    <div ref={ref}>
      <button
        type="button"
        onClick={() => setOn((v) => !v)}
        aria-pressed={on}
        className="mb-8 flex items-center gap-4 text-[17px] font-medium md:text-xl"
      >
        <span className={cn('transition-colors', on ? 'text-faint' : 'text-ink')}>Today</span>
        <span className={cn('relative h-9 w-16 rounded-full transition-colors duration-500', on ? 'bg-bot' : 'bg-hair')}>
          <motion.span
            className="absolute top-1 left-1 size-7 rounded-full bg-card shadow"
            animate={{ x: on ? 28 : 0 }}
            transition={{ type: 'spring', stiffness: 500, damping: 30 }}
          />
        </span>
        <span className={cn('transition-colors', on ? 'text-bot' : 'text-faint')}>With automation</span>
      </button>
      <ul className="grid gap-px overflow-hidden rounded-[24px] border border-hair bg-hair sm:grid-cols-2 lg:grid-cols-3">
        {t.items.map((b, i) => (
          <li key={b.title} className="relative min-h-[150px] overflow-hidden bg-card p-5 md:min-h-[170px] md:p-6">
            <motion.div
              animate={{ opacity: on ? 0 : 1, y: on ? -16 : 0 }}
              transition={{ delay: on ? i * 0.08 : 0, duration: 0.35 }}
              className="absolute inset-5 md:inset-6"
            >
              <p className="text-[13px] text-faint">Today</p>
              <p className="mt-2 text-[20px] leading-tight text-muted line-through decoration-[#e5484d]/70 md:text-[22px]">
                {BEFORE[b.icon]}
              </p>
            </motion.div>
            <motion.div
              initial={false}
              animate={{ opacity: on ? 1 : 0, y: on ? 0 : 16 }}
              transition={{ delay: on ? 0.15 + i * 0.08 : 0, duration: 0.4 }}
              className="relative"
            >
              <span className="grid size-10 place-items-center rounded-full bg-bot text-card">
                <Icon name={b.icon} className="size-5" />
              </span>
              <h3 className="mt-3 text-[19px] leading-tight font-semibold tracking-[-0.01em] md:text-xl">{b.title}</h3>
              <p className="mt-1 text-[14px] leading-snug text-muted md:text-[15px]">{b.text}</p>
            </motion.div>
          </li>
        ))}
      </ul>
    </div>
  );
}

/** E: a clock face. Each benefit takes a slice of the week and fills in, the hours count up in the middle. */
function Clock() {
  const ref = useRef<HTMLDivElement>(null);
  const seen = useInView(ref, { once: true, margin: '-25% 0px' });
  const [lit, setLit] = useState(0);
  useEffect(() => {
    if (!seen) return;
    const ids = t.items.map((_, i) => setTimeout(() => setLit(i + 1), 400 + i * 450));
    return () => ids.forEach(clearTimeout);
  }, [seen]);
  const R = 120;
  const slice = (i: number) => {
    const a0 = (i / 6) * Math.PI * 2 - Math.PI / 2 + 0.03;
    const a1 = ((i + 1) / 6) * Math.PI * 2 - Math.PI / 2 - 0.03;
    const p = (a: number, r: number) => `${150 + r * Math.cos(a)},${150 + r * Math.sin(a)}`;
    return `M${p(a0, 70)} L${p(a0, R)} A${R},${R} 0 0 1 ${p(a1, R)} L${p(a1, 70)} A70,70 0 0 0 ${p(a0, 70)} Z`;
  };
  return (
    <div ref={ref} className="grid items-center gap-10 md:grid-cols-[minmax(0,420px)_1fr] md:gap-14">
      <div className="relative mx-auto aspect-square w-full max-w-[420px]">
        <svg viewBox="0 0 300 300" className="size-full" aria-hidden>
          {Array.from({ length: 60 }, (_, k) => {
            const a = (k / 60) * Math.PI * 2;
            const r0 = k % 5 ? 136 : 130;
            return (
              <line
                key={k}
                x1={150 + r0 * Math.cos(a)}
                y1={150 + r0 * Math.sin(a)}
                x2={150 + 142 * Math.cos(a)}
                y2={150 + 142 * Math.sin(a)}
                stroke="#16171c"
                strokeOpacity={k % 5 ? 0.2 : 0.6}
                strokeWidth={k % 5 ? 1 : 2}
              />
            );
          })}
          {t.items.map((b, i) => (
            <path
              key={b.title}
              d={slice(i)}
              className="transition-[fill] duration-500"
              fill={lit > i ? '#1f3bff' : '#ebe8e1'}
              opacity={lit > i ? 1 - i * 0.08 : 1}
            />
          ))}
        </svg>
        <div className="absolute inset-0 grid place-items-center text-center">
          <div>
            <p className="text-[52px] leading-none font-semibold tracking-[-0.05em] md:text-[64px]">
              +{Math.round((HOURS * lit) / 6)}
              <span className="text-[24px]">h</span>
            </p>
            <p className="text-[13px] text-muted">every week</p>
          </div>
        </div>
      </div>
      <ol className="space-y-1">
        {t.items.map((b, i) => (
          <li
            key={b.title}
            className={cn('flex gap-4 rounded-[16px] p-3 transition-all duration-500 md:p-4', lit > i ? 'opacity-100' : 'opacity-30')}
          >
            <span
              className={cn(
                'grid size-10 shrink-0 place-items-center rounded-full transition-colors duration-500',
                lit > i ? 'bg-bot text-card' : 'bg-shade text-muted',
              )}
            >
              <Icon name={b.icon} className="size-5" />
            </span>
            <div>
              <h3 className="text-[17px] leading-tight font-semibold md:text-[19px]">{b.title}</h3>
              <p className="mt-0.5 text-[14px] leading-snug text-muted md:text-[15px]">{b.text}</p>
            </div>
          </li>
        ))}
      </ol>
    </div>
  );
}

const OPTIONS = [
  { id: 'a', name: 'The receipt', idea: 'A till receipt prints the hours you get back; the benefits are stamped next to it.', C: Receipt },
  { id: 'b', name: 'Sticky notes', idea: 'The benefits as handwritten notes, like the hero. Each one slaps onto the wall.', C: Notes },
  { id: 'c', name: 'Big type', idea: 'No boxes at all. A huge hour counter and a numbered list that draws itself.', C: Editorial },
  { id: 'd', name: 'The switch', idea: 'Flip from "Today" to "With automation" and every problem turns into a benefit.', C: Switch },
  { id: 'e', name: 'The clock', idea: 'A clock face fills in slice by slice while the hours count up.', C: Clock },
];

export default function BenefitOptions() {
  return (
    <main className="pb-32">
      <header className="wrap pt-16 md:pt-24">
        <p className="font-mono text-[13px] text-bot">Design options · not public</p>
        <h1 className="mt-3 text-[clamp(28px,3.4vw,48px)] leading-[1.05] font-semibold tracking-[-0.03em]">
          “Get your hours back”: five options
        </h1>
        <p className="mt-3 max-w-[640px] text-lg text-body">
          The site currently shows the original cards. Pick a letter, and it replaces them. Scroll slowly: each one animates in.
        </p>
        <nav className="mt-6 flex flex-wrap gap-2">
          {OPTIONS.map((o) => (
            <a key={o.id} href={`#option-${o.id}`} className="rounded-full border border-hair px-4 py-2 text-[14px] hover:border-ink">
              {o.id.toUpperCase()} · {o.name}
            </a>
          ))}
        </nav>
      </header>
      {OPTIONS.map(({ id, name, idea, C }) => (
        <section key={id} id={`option-${id}`} className="wrap scroll-mt-6 pt-24 md:pt-36">
          <Heading letter={id.toUpperCase()} name={name} idea={idea} />
          <Title />
          <div className="mt-8 md:mt-12">
            <C />
          </div>
        </section>
      ))}
    </main>
  );
}
