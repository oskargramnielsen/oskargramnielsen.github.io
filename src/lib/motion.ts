'use client';

import { useEffect, useRef, useState } from 'react';
import {
  animate,
  useInView,
  useMotionValue,
  useMotionValueEvent,
  useReducedMotion,
  useTransform,
  type MotionValue,
} from 'motion/react';

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
 * Progress that plays 0→1 over `duration` seconds the first time `ref` is in
 * view. Returns the value and a replay function. Under reduced motion it
 * stays at 1.
 */
export function useAutoProgress(ref: React.RefObject<Element | null>, duration: number, enabled = true) {
  const reduce = useReducedMotion();
  const p = useMotionValue(reduce ? 1 : 0);
  const inView = useInView(ref, { amount: 0.45 });
  const played = useRef(false);
  const [done, setDone] = useState(false);

  const play = () => {
    setDone(false);
    p.set(0);
    animate(p, 1, { duration, ease: 'linear', onComplete: () => setDone(true) });
  };

  useEffect(() => {
    if (reduce) {
      p.set(1);
      return;
    }
    if (enabled && inView && !played.current) {
      played.current = true;
      play();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [inView, enabled, reduce]);

  return { p, replay: play, done: done || !!reduce };
}
