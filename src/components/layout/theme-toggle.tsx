'use client';

import { Button } from '@/components/ui/button';
import { motion } from 'framer-motion';
import { Moon, Sun } from 'lucide-react';
import { useTheme } from 'next-themes';
import { useEffect, useState } from 'react';

export function ThemeToggle() {
  const { theme, setTheme, systemTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const currentTheme = theme === 'system' ? systemTheme : theme;

  const handleToggle = () => {
    if (!mounted) return;
    const next = currentTheme === 'dark' ? 'light' : 'dark';
    setTheme(next ?? 'light');
  };

  return (
    <Button
      type="button"
      size="icon"
      variant="ghost"
      aria-label="Toggle theme"
      onClick={handleToggle}
      className="relative h-11 w-11 rounded-full border border-border/50 bg-background/70 hover:border-primary/60"
      data-cursor="focus"
    >
      <motion.div
        key={mounted ? currentTheme : 'initial'}
        initial={{ rotate: -30, opacity: 0, scale: 0.8 }}
        animate={{ rotate: 0, opacity: 1, scale: 1 }}
        transition={{ type: 'spring', stiffness: 260, damping: 18 }}
        className="absolute inset-0 grid place-items-center"
      >
        {mounted && currentTheme === 'dark' ? (
          <Sun className="h-4 w-4" />
        ) : (
          <Moon className="h-4 w-4" />
        )}
      </motion.div>
    </Button>
  );
}
