'use client';

import { useEffect, useState } from 'react';
import {
  useMotionValue,
  useMotionValueEvent,
  useReducedMotion,
  useScroll,
  useTransform,
  type MotionValue,
} from 'motion/react';

type Offset = NonNullable<Parameters<typeof useScroll>[0]>['offset'];

/** 0→1 between a and b, clamped. */
export function seg(v: number, a: number, b: number) {
  return Math.min(1, Math.max(0, (v - a) / (b - a)));
}

/** Motion value that maps progress p from [a, b] to [0, 1]. */
export function useSeg(p: MotionValue<number>, a: number, b: number) {
  return useTransform(p, (v) => seg(v, a, b));
}

/**
 * Number of thresholds that progress has passed. Only re-renders when the
 * count changes, so components can toggle discrete states cheaply.
 */
export function useStep(p: MotionValue<number>, thresholds: readonly number[]) {
  const count = (v: number) => thresholds.filter((t) => v >= t).length;
  const [step, setStep] = useState(() => count(p.get()));
  useMotionValueEvent(p, 'change', (v) => {
    const n = count(v);
    setStep((s) => (s === n ? s : n));
  });
  return step;
}

export function useMediaQuery(query: string) {
  const [match, setMatch] = useState(false);
  useEffect(() => {
    const mq = window.matchMedia(query);
    const update = () => setMatch(mq.matches);
    update();
    mq.addEventListener('change', update);
    return () => mq.removeEventListener('change', update);
  }, [query]);
  return match;
}

/**
 * Scroll-linked progress for an element as it moves through the viewport.
 * Default: starts when its top reaches 85% of the viewport and finishes when
 * its bottom reaches 65%. Under reduced motion it is fixed at 1.
 */
export function useViewProgress(ref: React.RefObject<HTMLElement | null>, offset: Offset = ['start 0.85', 'end 0.65']) {
  const reduce = useReducedMotion();
  const { scrollYProgress } = useScroll({ target: ref, offset });
  const one = useMotionValue(1);
  return reduce ? one : scrollYProgress;
}
