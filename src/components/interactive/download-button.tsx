'use client';

import { DownloadCloud } from 'lucide-react';
import { motion, type MotionStyle } from 'framer-motion';
import { useMemo, useState, type CSSProperties } from 'react';
import { Magnetic } from './magnetic';

export function DownloadConsciousnessButton() {
  const [pointer, setPointer] = useState({ x: 0, y: 0 });

  type PointerStyle = CSSProperties & MotionStyle & {
    '--pointer-x': string;
    '--pointer-y': string;
  };

  const pointerStyle = useMemo<PointerStyle>(
    () => ({
      '--pointer-x': `${pointer.x}px`,
      '--pointer-y': `${pointer.y}px`,
    }),
    [pointer]
  );

  return (
    <Magnetic strength={0.18} className="w-full sm:w-auto">
      <motion.a
        href="/pdfs/CV.pdf"
        download
        initial={false}
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.97 }}
        transition={{ type: 'spring', stiffness: 320, damping: 24 }}
        className="group relative inline-flex h-14 w-full items-center justify-between overflow-hidden rounded-full border border-primary/60 bg-gradient-to-r from-primary/90 via-primary to-primary/80 px-6 text-sm font-semibold uppercase tracking-[0.18em] text-primary-foreground shadow-[0_16px_40px_-20px_rgba(37,99,235,0.7)] sm:w-auto"
        style={pointerStyle}
        data-cursor="accent"
        onPointerMove={(event) => {
          const rect = event.currentTarget.getBoundingClientRect();
          setPointer({
            x: event.clientX - rect.left,
            y: event.clientY - rect.top,
          });
        }}
      >
        <span className="relative z-10 flex items-center gap-3">
          <DownloadCloud className="h-5 w-5 transition-transform duration-500 group-hover:rotate-[18deg]" />
          <span className="hidden text-xs uppercase tracking-[0.2em] text-primary-foreground/80 sm:block">
            Download CV
          </span>
          <span className="block text-xs uppercase tracking-[0.2em] sm:hidden">Download</span>
        </span>
        <motion.span
          aria-hidden
          initial={{ y: 10, opacity: 0 }}
          whileHover={{ y: 0, opacity: 1 }}
          transition={{ type: 'spring', stiffness: 300, damping: 26 }}
          className="relative z-10 text-[11px] uppercase tracking-[0.24em] text-primary-foreground/60"
        >
          Download consciousness
        </motion.span>
        <span className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-300 ease-out group-hover:opacity-100" style={{ background: 'radial-gradient(140px at var(--pointer-x) var(--pointer-y), rgba(255,255,255,0.28), transparent 60%)' }} />
        <span className="pointer-events-none absolute inset-0 opacity-0 mix-blend-screen blur-2xl transition-opacity duration-500 group-hover:opacity-80" style={{ background: 'radial-gradient(220px at var(--pointer-x) var(--pointer-y), rgba(59,130,246,0.3), transparent 65%)' }} />
      </motion.a>
    </Magnetic>
  );
}
