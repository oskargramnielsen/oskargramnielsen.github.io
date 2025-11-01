'use client';

import { motion, useMotionValue, useSpring } from 'framer-motion';
import { useEffect, useMemo, useState } from 'react';

type CursorMode = 'default' | 'accent' | 'focus' | 'project' | 'magnetic';

const cursorStyles: Record<CursorMode, { size: number; color: string; border: string; mixBlendMode?: 'normal' | 'screen' | 'difference' }> = {
  default: { size: 16, color: 'rgba(148, 163, 184, 0.45)', border: '1px solid rgba(15, 23, 42, 0.35)' },
  focus: { size: 36, color: 'rgba(96, 165, 250, 0.18)', border: '1px solid rgba(59, 130, 246, 0.4)' },
  accent: { size: 48, color: 'rgba(59, 130, 246, 0.16)', border: '1px solid rgba(255, 255, 255, 0.6)', mixBlendMode: 'screen' },
  project: { size: 54, color: 'rgba(168, 85, 247, 0.18)', border: '1px solid rgba(59, 7, 100, 0.42)' },
  magnetic: { size: 42, color: 'rgba(34, 211, 238, 0.18)', border: '1px solid rgba(13, 148, 136, 0.5)' },
};

export function CustomCursor() {
  const [isEnabled, setIsEnabled] = useState(false);
  const [mode, setMode] = useState<CursorMode>('default');
  const [isPointerDown, setIsPointerDown] = useState(false);

  const x = useMotionValue(-100);
  const y = useMotionValue(-100);

  const springX = useSpring(x, { stiffness: 400, damping: 36, mass: 0.3 });
  const springY = useSpring(y, { stiffness: 400, damping: 36, mass: 0.3 });

  const cursorStyle = useMemo(() => cursorStyles[mode] ?? cursorStyles.default, [mode]);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    const pointerFine = window.matchMedia('(pointer: fine)').matches;
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    if (pointerFine && !prefersReducedMotion) {
      setIsEnabled(true);
    }

    const handleMove = (event: PointerEvent) => {
      x.set(event.clientX);
      y.set(event.clientY);
      const target = event.target as HTMLElement | null;
      const datasetMode = target?.closest<HTMLElement>('[data-cursor]')?.dataset.cursor as CursorMode | undefined;
      setMode(datasetMode ?? 'default');
    };

    const handleDown = () => setIsPointerDown(true);
    const handleUp = () => setIsPointerDown(false);
    const handleLeave = () => {
      x.set(-100);
      y.set(-100);
    };

    window.addEventListener('pointermove', handleMove, { passive: true });
    window.addEventListener('pointerdown', handleDown, { passive: true });
    window.addEventListener('pointerup', handleUp, { passive: true });
    window.addEventListener('pointerleave', handleLeave, { passive: true });

    return () => {
      window.removeEventListener('pointermove', handleMove);
      window.removeEventListener('pointerdown', handleDown);
      window.removeEventListener('pointerup', handleUp);
      window.removeEventListener('pointerleave', handleLeave);
    };
  }, [x, y]);

  if (!isEnabled) {
    return null;
  }

  const size = isPointerDown ? cursorStyle.size * 0.8 : cursorStyle.size;

  return (
    <motion.div
      className="pointer-events-none fixed left-0 top-0 z-[999] hidden select-none md:block"
      style={{
        x: springX,
        y: springY,
        translateX: '-50%',
        translateY: '-50%',
        width: size,
        height: size,
        backgroundColor: cursorStyle.color,
        border: cursorStyle.border,
        mixBlendMode: cursorStyle.mixBlendMode ?? 'normal',
        borderRadius: '50%',
        transition: 'width 0.2s ease, height 0.2s ease',
        backdropFilter: 'blur(12px)',
      }}
    />
  );
}
