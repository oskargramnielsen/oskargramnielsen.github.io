'use client';

import { AnimatePresence, motion } from 'framer-motion';
import { useEffect, useMemo, useState } from 'react';

const BOOT_LINES = [
  'BOOTSTRAP // Consciousness kernel v3.9.2',
  'Linking neuro-synaptic automation modules...',
  'Loading architectural design datasets...',
  'Calibrating creative heuristics...',
  'Quantum handshake acknowledged.',
  'ALL SYSTEMS READY - Deploying Oskar Gram Nielsen.',
];

const STORAGE_KEY = 'ogn-terminal-boot-dismissed';

export function TerminalBoot() {
  const [isVisible, setIsVisible] = useState(false);
  const [typedLines, setTypedLines] = useState<string[]>([]);

  const shouldPrefetch = useMemo(() => {
    if (typeof window === 'undefined') return true;
    return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  }, []);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    if (localStorage.getItem(STORAGE_KEY)) {
      setIsVisible(false);
      return;
    }

    if (shouldPrefetch) {
      setIsVisible(false);
      return;
    }

    setIsVisible(true);
    let frame: NodeJS.Timeout;
    let lineIndex = 0;
    let charIndex = 0;
    const buffer = Array<string>(BOOT_LINES.length).fill('');

    const type = () => {
      const line = BOOT_LINES[lineIndex];
      if (!line) {
        localStorage.setItem(STORAGE_KEY, '1');
        setTimeout(() => setIsVisible(false), 600);
        return;
      }

      buffer[lineIndex] = line.slice(0, charIndex + 1);
      setTypedLines([...buffer]);

      if (charIndex < line.length - 1) {
        charIndex += 1;
        frame = setTimeout(type, 22 + Math.random() * 28);
      } else {
        lineIndex += 1;
        charIndex = 0;
        frame = setTimeout(type, 260);
      }
    };

    frame = setTimeout(type, 200);

    return () => clearTimeout(frame);
  }, [shouldPrefetch]);

  if (!isVisible) {
    return null;
  }

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.4, ease: 'easeOut' }}
          className="fixed inset-0 z-[999] flex items-center justify-center bg-background/90 backdrop-blur-xl"
        >
          <motion.div
            initial={{ scale: 0.96, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.96, opacity: 0 }}
            transition={{ duration: 0.35, ease: 'easeOut' }}
            className="w-[min(90vw,640px)] rounded-2xl border border-border/60 bg-black/65 p-8 text-left font-mono text-sm text-primary-foreground shadow-[0_24px_60px_-24px_rgba(8,8,20,0.8)]"
          >
            <div className="mb-4 flex items-center justify-between text-xs uppercase tracking-[0.2em] text-primary/70">
              <span>SYSTEM // BIOS</span>
              <button
                type="button"
                className="rounded-full border border-primary/40 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.18em] text-primary/80 transition-colors hover:bg-primary/10"
                onClick={() => {
                  localStorage.setItem(STORAGE_KEY, '1');
                  setIsVisible(false);
                }}
              >
                Skip
              </button>
            </div>

            <div className="relative overflow-hidden rounded-xl border border-primary/10 bg-black/40 p-6">
              <div className="absolute inset-0 -z-10 bg-[radial-gradient(circle_at_top,hsl(var(--primary)/0.25),transparent_60%)]" />
              <div className="space-y-2">
                {typedLines.map((line, index) => (
                  <p
                    key={index}
                    className="font-mono text-[13px] leading-relaxed text-white/90"
                  >
                    <span className="text-primary/60">$</span> {line}
                    {index === typedLines.findIndex((item) => item !== '') && (
                      <motion.span
                        initial={{ opacity: 0 }}
                        animate={{ opacity: [0, 1, 0] }}
                        transition={{ duration: 0.8, repeat: Infinity, ease: 'easeInOut' }}
                        className="ml-1 inline-block h-4 w-[10px] translate-y-[1px] bg-primary/80"
                      />
                    )}
                  </p>
                ))}
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
