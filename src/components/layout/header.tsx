'use client';

import Link from 'next/link';
import { Menu, Sparkle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { ThemeToggle } from './theme-toggle';
import { useState } from 'react';
import { motion } from 'framer-motion';
import { Magnetic } from '@/components/interactive/magnetic';

const navItems = [
  { href: '#about', label: 'About' },
  { href: '#projects', label: 'Projects' },
  { href: '#experience', label: 'Experience' },
  { href: '#contact', label: 'Contact' },
];

export default function Header() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  return (
    <motion.header
      initial={{ y: -40, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.7, ease: 'easeOut' }}
      className="sticky top-0 z-50 w-full"
    >
      <div className="mx-4 mt-4 rounded-full border border-border/50 bg-background/70 shadow-[0_12px_40px_-26px_rgba(15,23,42,0.7)] backdrop-blur-xl supports-[backdrop-filter]:bg-background/50">
        <div className="container mx-auto flex h-16 max-w-6xl items-center justify-between px-4 sm:px-6">
          <Link href="/" className="group flex items-center gap-3" data-cursor="focus">
            <div className="relative flex h-9 w-9 items-center justify-center rounded-full border border-border/60 bg-background/70 shadow-[0_12px_24px_-18px_rgba(59,130,246,0.6)]">
              <Sparkle className="h-4 w-4 text-primary transition-transform duration-300 group-hover:rotate-12" />
            </div>
            <span className="text-sm font-semibold uppercase tracking-[0.38em] text-foreground transition-colors group-hover:text-primary">
              OGN Studio
            </span>
          </Link>

          <nav className="hidden items-center gap-2 md:flex">
            {navItems.map((item) => (
              <Magnetic key={item.label} strength={0.08}>
                <Link
                  href={item.href}
                  className="rounded-full border border-transparent px-4 py-2 text-xs uppercase tracking-[0.28em] text-muted-foreground transition-all duration-300 hover:border-primary/60 hover:text-primary"
                  data-cursor="focus"
                >
                  {item.label}
                </Link>
              </Magnetic>
            ))}
          </nav>

          <div className="hidden items-center gap-2 md:flex">
            <ThemeToggle />
            <Magnetic strength={0.14}>
              <Button
                asChild
                size="sm"
                variant="ghost"
                className="rounded-full border border-border/60 bg-background/70 px-5 py-2 text-[11px] font-semibold uppercase tracking-[0.28em] text-muted-foreground hover:border-primary/60 hover:text-primary"
                data-cursor="focus"
              >
                <Link href="#contact">Let's talk</Link>
              </Button>
            </Magnetic>
          </div>

          <div className="flex items-center gap-2 md:hidden">
            <ThemeToggle />
            <Sheet open={isMobileMenuOpen} onOpenChange={setIsMobileMenuOpen}>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon" className="rounded-full border border-border/60 bg-background/70" data-cursor="focus">
                  <Menu className="h-5 w-5" />
                  <span className="sr-only">Toggle Menu</span>
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="w-[300px] border-l border-border/50 bg-background/80 backdrop-blur-2xl">
                <div className="flex flex-col gap-8 pt-12">
                  <div className="text-sm font-semibold uppercase tracking-[0.4em] text-muted-foreground">
                    OGN Studio
                  </div>
                  <nav className="flex flex-col gap-4">
                    {navItems.map((item) => (
                      <Link
                        key={item.label}
                        href={item.href}
                        className="text-xs uppercase tracking-[0.28em] text-muted-foreground transition-colors hover:text-primary"
                        onClick={() => setIsMobileMenuOpen(false)}
                      >
                        {item.label}
                      </Link>
                    ))}
                  </nav>
                  <Button asChild className="rounded-full border border-primary/60 bg-primary/90 text-[11px] font-semibold uppercase tracking-[0.24em] text-primary-foreground">
                    <Link href="#contact" onClick={() => setIsMobileMenuOpen(false)}>
                      Let's talk
                    </Link>
                  </Button>
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>
    </motion.header>
  );
}
