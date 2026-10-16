'use client';

import { useEffect, useRef } from 'react';
import { motion, useInView, useReducedMotion, useSpring } from 'motion/react';
import type { Dict } from '@/content';
import { site } from '@/content/site';

const ease = [0.2, 0.8, 0.2, 1] as const;
const pop = (d: number) => ({
  hidden: { opacity: 0, y: 8, scale: 0.94 },
  shown: { opacity: 1, y: 0, scale: 1, transition: { duration: 0.45, delay: d, ease } },
});

/** A big project schedule filling in, with today's line and a delay caught early. */
function Gantt({ t }: { t: Dict['job']['gantt'] }) {
  // [x, width] on a 360 wide canvas. The facade bar is the one running late.
  const bars = [
    [86, 70],
    [130, 64],
    [170, 96],
    [236, 70],
    [250, 80],
    [322, 26],
  ] as const;
  return (
    <svg viewBox="0 0 360 192" className="h-full w-full" aria-hidden>
      {[86, 152, 218, 284, 350].map((x) => (
        <line key={x} x1={x} x2={x} y1="8" y2="156" className="stroke-hair" strokeWidth="1" />
      ))}
      {bars.map(([x, w], i) => (
        <g key={i}>
          <text x="0" y={24 + i * 25} className="fill-muted text-[10.5px]">
            {t.rows[i]}
          </text>
          <motion.rect
            x={x}
            y={15 + i * 25}
            height="12"
            rx="6"
            className="fill-ink/80"
            variants={{ hidden: { width: 0 }, shown: { width: w, transition: { duration: 0.7, delay: 0.1 + i * 0.12, ease } } }}
          />
        </g>
      ))}
      {/* The facade is late: its bar grows past plan and turns red. */}
      <motion.rect
        x="236"
        y="90"
        height="12"
        rx="6"
        fill="#e5484d"
        variants={{ hidden: { width: 0, opacity: 0 }, shown: { width: 92, opacity: 1, transition: { duration: 0.6, delay: 1.1, ease } } }}
      />
      <motion.g variants={{ hidden: { opacity: 0 }, shown: { opacity: 1, transition: { delay: 0.8 } } }}>
        <line x1="220" x2="220" y1="4" y2="156" className="stroke-bot" strokeWidth="1.4" strokeDasharray="3 3" />
        <rect x="200" y="0" width="40" height="13" rx="6.5" className="fill-bot" />
        <text x="220" y="9.5" textAnchor="middle" className="fill-card text-[8.5px] font-medium">
          {t.today}
        </text>
      </motion.g>
      <motion.g variants={pop(1.6)} style={{ transformOrigin: '250px 176px' }}>
        <rect x="148" y="164" width="204" height="24" rx="12" className="fill-bot" />
        <circle cx="163" cy="176" r="3.5" className="fill-card" />
        <text x="174" y="180" className="fill-card text-[10.5px] font-medium">
          {t.alert}
        </text>
      </motion.g>
    </svg>
  );
}

/** A question to the company chatbot, answered with its source. */
function Chat({ t }: { t: Dict['job']['chat'] }) {
  return (
    <div className="flex h-full flex-col justify-center gap-2 text-[13px] leading-snug md:text-[14px]">
      <motion.p variants={pop(0)} className="mb-1 flex items-center gap-2 text-[12px] text-muted">
        <span className="grid size-6 place-items-center rounded-full bg-bot text-[10px] font-semibold text-card">AI</span>
        <span>
          <b className="font-medium text-ink">{t.name}</b> · {t.status}
        </span>
      </motion.p>
      <motion.p variants={pop(0.2)} className="max-w-[82%] self-end rounded-[16px] rounded-br-[5px] bg-ink px-3.5 py-2 text-paper">
        {t.q}
      </motion.p>
      <motion.div variants={pop(0.8)} className="max-w-[86%] self-start rounded-[16px] rounded-bl-[5px] bg-bot-soft px-3.5 py-2 text-bot">
        {t.a}
        <span className="mt-1.5 flex w-fit items-center gap-1.5 rounded-full bg-card px-2.5 py-1 text-[11.5px] text-ink">
          <svg
            viewBox="0 0 24 24"
            className="size-3.5"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.8"
            strokeLinejoin="round"
            aria-hidden
          >
            <path d="M6 3h8l4 4v14H6z" />
            <path d="M14 3v4h4" />
          </svg>
          {t.source}
        </span>
      </motion.div>
    </div>
  );
}

/**
 * Who's behind it: a name badge on a lanyard. It drops in from above, bounces and swings until it
 * settles, and can be grabbed and swung like a real one. The avatar waves when touched.
 */
function Badge({ t }: { t: Dict['job'] }) {
  const reduce = useReducedMotion();
  const angle = useSpring(0, { stiffness: 120, damping: 5, mass: 0.8 });
  const ref = useRef<HTMLDivElement>(null);
  const seen = useInView(ref, { once: true, amount: 0.2 });
  useEffect(() => {
    if (reduce || !seen) return;
    // A kick to the side as it lands, so it swings itself to rest.
    const id = setTimeout(() => angle.set(11), 380);
    const id2 = setTimeout(() => angle.set(0), 520);
    return () => [id, id2].forEach(clearTimeout);
  }, [seen, reduce, angle]);
  return (
    <div ref={ref} className="relative mx-auto w-full max-w-[280px] md:max-w-[330px] lg:mx-0">
      <motion.div
        initial={reduce ? false : { y: -260, opacity: 0 }}
        animate={seen ? { y: 0, opacity: 1 } : undefined}
        transition={{ y: { type: 'spring', stiffness: 260, damping: 13, mass: 1.1 }, opacity: { duration: 0.2 } }}
      >
        <motion.div
          style={{ rotate: angle, transformOrigin: '50% -90px' }}
          onPan={(_, info) => !reduce && angle.set(Math.max(-35, Math.min(35, info.offset.x * 0.12)))}
          onPanEnd={() => angle.set(0)}
          className="relative cursor-grab touch-pan-y select-none active:cursor-grabbing"
        >
          {/* The lanyard, running up out of sight. */}
          <span
            aria-hidden
            className="absolute bottom-full left-1/2 h-[80px] w-[16px] -translate-x-1/2 bg-bot [mask:linear-gradient(to_top,#000_45%,#0000)] md:w-[18px] lg:h-[100px]"
          />
          {/* The clip. */}
          <span
            aria-hidden
            className="absolute -top-3 left-1/2 z-10 h-6 w-10 -translate-x-1/2 rounded-[8px] border-2 border-[#b9bcc6] bg-[#e4e6ec]"
          />
          <div className="relative rounded-[22px] border border-hair bg-card p-4 shadow-[0_30px_60px_-30px_#00000066] md:rounded-[24px] md:p-6">
            <span aria-hidden className="mx-auto mb-4 block h-2 w-12 rounded-full bg-hair md:mb-5" />
            <div className="flex items-center gap-3 md:gap-4">
              <motion.span
                initial="rest"
                whileHover="wave"
                whileTap="wave"
                className="relative grid size-12 shrink-0 cursor-pointer place-items-center rounded-full bg-bot text-[18px] font-semibold tracking-[-0.02em] text-card md:size-16 md:text-[22px]"
              >
                OG
                <motion.span
                  aria-hidden
                  variants={{
                    rest: { scale: 0, opacity: 0, rotate: 0 },
                    wave: { scale: 1, opacity: 1, rotate: [0, 22, -8, 22, -8, 0], transition: { duration: 0.9 } },
                  }}
                  style={{ originX: 0.7, originY: 0.9 }}
                  className="absolute -top-4 -right-4 text-[24px]"
                >
                  👋
                </motion.span>
                {/* Online, with a soft ping. */}
                <span className="absolute right-0 bottom-0 size-3.5 rounded-full border-[3px] border-card bg-[#2fbf71] md:bottom-0.5 md:size-4">
                  <span className="absolute -inset-[3px] animate-ping rounded-full bg-[#2fbf71] opacity-40 motion-reduce:hidden" />
                </span>
              </motion.span>
              <div>
                <p className="text-[17px] leading-tight font-semibold tracking-[-0.02em] md:text-[19px]">{site.name}</p>
                <p className="mt-0.5 text-[13px] text-muted md:text-[14px]">{t.facts[0].v}</p>
              </div>
            </div>
            <dl className="mt-4 space-y-2.5 border-t border-hair pt-3 text-[13px] md:mt-5 md:space-y-3 md:pt-4 md:text-[14px]">
              <div>
                <dt className="text-[12px] text-faint">{t.facts[1].k}</dt>
                <dd>{t.facts[1].v}</dd>
              </div>
              <div>
                <dt className="text-[12px] text-faint">{t.facts[2].k}</dt>
                <dd className="mt-1.5 flex flex-wrap gap-1.5">
                  {t.facts[2].v.split(', ').map((skill, i) => (
                    <motion.span
                      key={skill}
                      initial={reduce ? false : { opacity: 0, y: 6, scale: 0.8 }}
                      animate={seen ? { opacity: 1, y: 0, scale: 1 } : undefined}
                      transition={{ delay: 0.7 + i * 0.07, type: 'spring', stiffness: 500, damping: 18 }}
                      whileHover={{ y: -2 }}
                      className="rounded-full bg-shade px-2.5 py-1 text-[12px] md:text-[13px]"
                    >
                      {skill}
                    </motion.span>
                  ))}
                </dd>
              </div>
            </dl>
            <a
              href={site.cv}
              download="Oskar Gram Nielsen - CV.pdf"
              onPointerDownCapture={(e) => e.stopPropagation()}
              className="group press mt-4 flex items-center justify-between rounded-full bg-ink py-2 pr-2 pl-4 text-[14px] font-medium text-paper duration-300 hover:bg-bot md:mt-5 md:py-2.5 md:pr-2.5 md:pl-5 md:text-[15px]"
            >
              {t.cvLabel} · {t.cv}
              <span
                className="grid size-7 place-items-center rounded-full bg-paper/15 transition-transform duration-300 group-hover:translate-y-0.5 md:size-8"
                aria-hidden
              >
                ↓
              </span>
            </a>
          </div>
        </motion.div>
      </motion.div>
    </div>
  );
}

export default function Job({ t }: { t: Dict['job'] }) {
  const reduce = useReducedMotion();
  const reveal = (i: number) => ({
    initial: reduce ? false : ('hidden' as const),
    whileInView: 'shown',
    viewport: { once: true, margin: '-15% 0px' },
    variants: { hidden: { opacity: 0, y: 16 }, shown: { opacity: 1, y: 0, transition: { duration: 0.5, delay: i * 0.1 } } },
  });

  return (
    <section id="work" className="wrap scroll-mt-20 overflow-clip pt-16 md:pt-24">
      <div className="grid gap-x-12 gap-y-16 lg:grid-cols-[1fr_330px]">
        <div>
          <p className="font-mono text-[13px] text-muted">{t.label}</p>
          <h2 className="mt-3 text-[clamp(30px,4.2vw,62px)] leading-[1.02] font-semibold tracking-[-0.03em]">{t.title}</h2>
          <p className="mt-4 max-w-[640px] text-[17px] text-body md:text-xl">{t.body}</p>
        </div>
        <div className="pt-[70px] lg:-mt-16 lg:-mb-6 lg:pt-[60px]">
          <Badge t={t} />
        </div>
      </div>

      <ol className="mt-8 grid gap-3 md:mt-10 lg:grid-cols-2 lg:gap-4">
        {t.items.map((item, i) => (
          <motion.li key={item.title} {...reveal(i)} className="flex flex-col overflow-hidden rounded-[24px] border border-hair bg-card">
            <div className="h-[220px] bg-shade px-5 py-5 md:h-[280px] md:px-8 md:py-6">
              {i === 0 ? <Gantt t={t.gantt} /> : <Chat t={t.chat} />}
            </div>
            <div className="flex flex-1 flex-col p-5 md:p-7">
              <h3 className="text-[22px] leading-tight font-semibold tracking-[-0.02em] md:text-[28px]">{item.title}</h3>
              <p className="mt-2 text-[15px] leading-snug text-body md:text-base">{item.text}</p>
              <p className="mt-auto pt-4 text-[15px] text-muted md:text-base">
                <b className="font-medium text-ink">{t.forYou}</b> {item.forYou}
              </p>
            </div>
          </motion.li>
        ))}
      </ol>
    </section>
  );
}
