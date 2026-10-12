'use client';

import { useRef } from 'react';
import { motion, useMotionValue, useReducedMotion, useScroll, type MotionValue } from 'motion/react';
import { useAutoProgress, useMediaQuery } from '@/lib/motion';

type Props = {
  id: string;
  tag: string;
  title: string;
  body: string;
  forBusiness: string;
  lesson: string;
  caption: string;
  replay: string;
  /** Seconds the scene takes to play on small screens. */
  duration?: number;
  /** Section height on large screens; more height = slower scrub. */
  tall?: 'normal' | 'long';
  children: (p: MotionValue<number>) => React.ReactNode;
};

/**
 * A pinned story scene. On large screens the canvas is scrubbed by scroll
 * position; on small screens it plays once when it comes into view and can
 * be replayed. Under reduced motion it shows the final frame.
 */
export default function Scene({ id, tag, title, body, forBusiness, lesson, caption, replay, duration = 7, tall = 'normal', children }: Props) {
  const section = useRef<HTMLElement>(null);
  const canvas = useRef<HTMLDivElement>(null);
  const reduce = useReducedMotion();
  const desktop = useMediaQuery('(min-width: 1024px)');
  const { scrollYProgress } = useScroll({ target: section, offset: ['start start', 'end end'] });
  const auto = useAutoProgress(canvas, duration, !desktop);
  const done = useMotionValue(1);
  const p = reduce ? done : desktop ? scrollYProgress : auto.p;

  return (
    <section
      id={id}
      ref={section}
      className={
        'relative scroll-mt-14 py-14 lg:py-0 motion-reduce:lg:h-auto motion-reduce:lg:py-24 ' +
        (tall === 'long' ? 'lg:h-[320vh]' : 'lg:h-[260vh]')
      }
    >
      <div className="wrap grid items-center gap-8 lg:sticky lg:top-0 lg:h-svh lg:grid-cols-[.85fr_1.15fr] lg:gap-16 motion-reduce:lg:static motion-reduce:lg:h-auto">
        <div>
          <p className="flex gap-3.5 font-mono text-[13px] text-muted">{tag}</p>
          <h3 className="mt-3 mb-4 text-[clamp(28px,3vw,44px)] leading-[1.05] font-semibold tracking-[-0.03em] text-balance">
            {title}
          </h3>
          <p className="max-w-[470px] text-body">{body}</p>
          <p className="mt-6 max-w-[470px] border-t border-hair pt-4 text-base text-muted">
            <b className="font-medium text-ink">{forBusiness}</b> {lesson}
          </p>
          <div className="mt-7 hidden h-0.5 max-w-[470px] bg-hair lg:block motion-reduce:hidden">
            <motion.div className="h-full origin-left bg-bot" style={{ scaleX: scrollYProgress }} />
          </div>
        </div>

        <div>
          <div
            ref={canvas}
            className="relative overflow-hidden border border-hair bg-card lg:flex lg:h-[min(600px,74svh)] lg:flex-col"
          >
            <p className="px-4 pt-3 font-mono text-[11px] text-faint">{caption}</p>
            <div className="lg:flex lg:flex-1 lg:flex-col lg:justify-center">{children(p)}</div>
          </div>
          {!desktop && !reduce && (
            <button
              type="button"
              onClick={auto.replay}
              className={
                'mt-3 font-mono text-xs text-muted transition-opacity hover:text-bot ' + (auto.done ? 'opacity-100' : 'opacity-0')
              }
            >
              ↻ {replay}
            </button>
          )}
        </div>
      </div>
    </section>
  );
}
