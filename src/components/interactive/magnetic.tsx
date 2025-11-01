'use client';

import { motion, useMotionValue, useSpring, type MotionProps } from 'framer-motion';
import { type ComponentPropsWithoutRef, type ReactNode, useRef } from 'react';

type MotionDivProps = ComponentPropsWithoutRef<typeof motion.div>;

interface MagneticProps extends Omit<MotionDivProps, 'style' | 'children'>, MotionProps {
  children: ReactNode;
  strength?: number;
}

export function Magnetic({
  children,
  strength = 0.25,
  className,
  ...rest
}: MagneticProps) {
  const ref = useRef<HTMLDivElement>(null);
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const springX = useSpring(x, { stiffness: 300, damping: 30, mass: 0.5 });
  const springY = useSpring(y, { stiffness: 300, damping: 30, mass: 0.5 });

  return (
    <motion.div
      ref={ref}
      className={className}
      style={{ x: springX, y: springY }}
      onPointerMove={(event) => {
        if (!ref.current) return;
        const rect = ref.current.getBoundingClientRect();
        const offsetX = event.clientX - (rect.left + rect.width / 2);
        const offsetY = event.clientY - (rect.top + rect.height / 2);
        x.set(offsetX * strength);
        y.set(offsetY * strength);
      }}
      onPointerLeave={() => {
        x.set(0);
        y.set(0);
      }}
      {...rest}
    >
      {children}
    </motion.div>
  );
}
