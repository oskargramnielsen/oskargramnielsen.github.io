'use client';

import { Magnetic } from '@/components/interactive/magnetic';
import { Button } from '@/components/ui/button';
import { Github, Linkedin, Mail, Phone, Send } from 'lucide-react';
import { motion } from 'framer-motion';

const userEmail = 'oskargram1996@gmail.com';
const userLinkedIn = 'https://www.linkedin.com/in/oskar-gram-nielsen-462bb3141/';
const userGitHub = 'https://github.com/oskargramnielsen';
const userPhone = '+45 24 23 25 17';

const contactItems = [
  {
    label: 'Drop an email',
    value: userEmail,
    href: `mailto:${userEmail}`,
    icon: Mail,
  },
  {
    label: 'Call directly',
    value: userPhone,
    href: `tel:${userPhone}`,
    icon: Phone,
  },
  {
    label: 'LinkedIn',
    value: 'Connect professionally',
    href: userLinkedIn,
    icon: Linkedin,
  },
  {
    label: 'GitHub',
    value: 'Explore code',
    href: userGitHub,
    icon: Github,
  },
];

export default function ContactSection() {
  return (
    <section id="contact" className="relative py-24 md:py-32">
      <div className="container mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.6, ease: 'easeOut' }}
          className="overflow-hidden rounded-[2.75rem] border border-border/60 bg-background/70 p-10 shadow-[0_32px_80px_-40px_rgba(15,23,42,0.7)] backdrop-blur-2xl"
        >
          <div className="grid gap-10 md:grid-cols-[0.55fr_0.45fr] md:items-center">
            <div>
              <span className="text-xs uppercase tracking-[0.28em] text-muted-foreground">Collaborate</span>
              <h2 className="mt-4 text-balance text-4xl font-semibold tracking-tight text-foreground">
                Let's orchestrate your next intelligent workflow
              </h2>
              <p className="mt-4 text-sm text-muted-foreground leading-relaxed">
                Ready for partnerships spanning automation, digital product development, or parametric design. I respond quickly and shape a clear next step within 48 hours.
              </p>

              <Magnetic strength={0.15} className="mt-8 inline-block">
                <Button
                  asChild
                  size="lg"
                  className="group relative inline-flex items-center gap-3 rounded-full border border-primary/60 bg-primary/90 px-6 py-3 text-xs font-semibold uppercase tracking-[0.22em] text-primary-foreground shadow-[0_16px_40px_-20px_rgba(37,99,235,0.7)]"
                  data-cursor="accent"
                >
                  <a href={`mailto:${userEmail}?subject=Project%20collaboration`}>
                    Initiate project download
                    <Send className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
                  </a>
                </Button>
              </Magnetic>

              <div className="mt-6 text-xs uppercase tracking-[0.28em] text-muted-foreground/70">
                Currently open for collaborations
              </div>
            </div>

            <div className="grid gap-4">
              {contactItems.map(({ label, value, href, icon: Icon }) => (
                <Magnetic key={label} strength={0.12}>
                  <motion.a
                    href={href}
                    target="_blank"
                    rel="noopener noreferrer"
                    whileHover={{ y: -4 }}
                    transition={{ type: 'spring', stiffness: 320, damping: 26 }}
                    className="group flex w-full items-center justify-between rounded-3xl border border-border/60 bg-background/70 px-6 py-5 text-left shadow-[0_22px_50px_-40px_rgba(15,23,42,0.6)] backdrop-blur-2xl"
                    data-cursor="focus"
                  >
                    <div>
                      <p className="text-xs uppercase tracking-[0.28em] text-muted-foreground/70">{label}</p>
                      <p className="mt-2 text-sm text-foreground/90">{value}</p>
                    </div>
                    <Icon className="h-5 w-5 text-muted-foreground/60 transition-all duration-300 group-hover:text-primary" />
                  </motion.a>
                </Magnetic>
              ))}
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
