'use client';

import { useRef } from 'react';
import { motion, useMotionValue, useReducedMotion, useScroll, type MotionValue } from 'motion/react';
import { useMediaQuery } from '@/lib/motion';
import { cn } from '@/lib/utils';
import ReadMore from './read-more';

type Props = {
  id: string;
  tag: string;
  title: string;
  body: string;
  short: string;
  forBusiness: string;
  readMore: string;
  readLess: string;
  lesson: string;
  /** Shown on framed canvases, like the map. Chat scenes bring their own frame. */
  caption?: string;
  /** Section height on large screens; more height = slower scrub. */
  tall?: 'normal' | 'long';
  /** Drawn across the whole pinned screen, behind the text and the canvas. Large screens only. */
  backdrop?: (p: MotionValue<number>) => React.ReactNode;
  children: (p: MotionValue<number>) => React.ReactNode;
};

/**
 * A story scene whose animation follows the scroll position. On large
 * screens the scene is pinned while it plays; on small screens it plays as
 * the canvas scrolls through the viewport. Reduced motion shows the final frame.
 */
export default function Scene({
  id,
  tag,
  title,
  body,
  short,
  forBusiness,
  readMore,
  readLess,
  lesson,
  caption,
  tall = 'normal',
  backdrop,
  children,
}: Props) {
  const section = useRef<HTMLElement>(null);
  const canvas = useRef<HTMLDivElement>(null);
  const reduce = useReducedMotion();
  const desktop = useMediaQuery('(min-width: 1024px)');
  const pinned = useScroll({ target: section, offset: ['start start', 'end end'] }).scrollYProgress;
  const flowing = useScroll({ target: canvas, offset: ['start 0.8', 'end 0.75'] }).scrollYProgress;
  const done = useMotionValue(1);
  const p = reduce ? done : desktop ? pinned : flowing;

  return (
    <section
      id={id}
      ref={section}
      className={
        'relative scroll-mt-14 overflow-x-clip py-8 lg:py-0 motion-reduce:lg:h-auto motion-reduce:lg:py-24 ' +
        (tall === 'long' ? 'lg:h-[200vh]' : 'lg:h-[170vh]')
      }
    >
      <div className="wrap relative grid items-center gap-8 lg:sticky lg:top-0 lg:h-svh lg:grid-cols-[.85fr_1.15fr] lg:gap-16 motion-reduce:lg:static motion-reduce:lg:h-auto">
        {backdrop && (
          <div aria-hidden className="pointer-events-none absolute inset-y-0 left-1/2 hidden w-screen -translate-x-1/2 lg:block">
            {backdrop(p)}
          </div>
        )}
        <div className="relative">
          <p className="font-mono text-[13px] text-muted">{tag}</p>
          <h3 className="mt-3 mb-4 text-[clamp(28px,3vw,44px)] leading-[1.05] font-semibold tracking-[-0.03em] text-balance">{title}</h3>
          <ReadMore
            short={short}
            body={body}
            readMore={readMore}
            readLess={readLess}
            extra={
              <p className="mt-5 border-t border-hair pt-4 text-base text-muted">
                <b className="font-medium text-ink">{forBusiness}</b> {lesson}
              </p>
            }
          />
          <div className="mt-7 hidden h-0.5 max-w-[470px] bg-hair lg:block motion-reduce:hidden">
            <motion.div className="h-full origin-left bg-bot" style={{ scaleX: pinned }} />
          </div>
        </div>

        <div
          ref={canvas}
          className={cn(
            'relative z-[1] lg:flex lg:h-[min(640px,80svh)] lg:flex-col',
            caption && 'overflow-hidden border border-hair bg-card',
          )}
        >
          {caption && <p className="px-4 pt-3 font-mono text-[11px] text-faint">{caption}</p>}
          <div className="lg:flex lg:flex-1 lg:flex-col lg:justify-center">{children(p)}</div>
        </div>
      </div>
    </section>
  );
}
