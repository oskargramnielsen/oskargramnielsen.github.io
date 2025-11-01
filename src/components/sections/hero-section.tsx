
'use client';

import { TerminalBoot } from '@/components/interactive/terminal-boot';
import { DownloadConsciousnessButton } from '@/components/interactive/download-button';
import { TechField } from '@/components/interactive/tech-field';
import { Magnetic } from '@/components/interactive/magnetic';
import { CodeBackdrop } from '@/components/interactive/code-backdrop';
import { Button } from '@/components/ui/button';
import { motion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';

const highlights = [
  {
    title: 'Automation engineer',
    description: 'C#, Python, Power Platform & systems that remove friction.',
  },
  {
    title: 'Full-stack builder',
    description: 'React, TypeScript, REST APIs, and cloud pipelines that scale.',
  },
  {
    title: 'Computational designer',
    description: 'Parametric modelling for resilient architecture & infrastructure.',
  },
];

const skills = [
  'Desktop Application',
  'Full-Stack Development',
  'Cloud Platform Automation',
  'Version Control',
  'Data Pipelines & Automation',
  'Digital Sustainability',
  'Computational Design',
  '3D Modelling',
  'Simulations & Analysis',
  'C#',
  'Python',
  'TypeScript',
  'React',
  'PostgreSQL',
];

export default function HeroSection() {
  return (
    <section id="about" className="relative py-24 md:py-32">
      <TerminalBoot />
      <div className="container mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 60 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.8, ease: [0.25, 0.1, 0.25, 1] }}
          className="grid gap-12 lg:grid-cols-[1.05fr_0.95fr] lg:items-center"
        >
          <div>
            <div className="inline-flex items-center gap-2 rounded-full border border-border/60 bg-background/80 px-4 py-2 text-xs uppercase tracking-[0.28em] text-muted-foreground">
              <span className="h-2 w-2 rounded-full bg-emerald-400 shadow-[0_0_12px_rgba(16,185,129,0.8)]" />
              Currently engineering automated futures
            </div>
            <h1 className="fluid-heading mt-8 text-balance text-foreground">
              Hyper-modern software for built-world intelligence
            </h1>
            <p className="fluid-type mt-6 max-w-xl text-muted-foreground">
              I am an architectural engineer specialized in software development, automation, and data-driven design. With experience across public and private sectors, I build digital tools that streamline complex workflows in architecture, engineering, and infrastructure. My work spans custom C# plugins, full-stack web applications, and cloud-native systems weaving Revit, REST APIs, and modern data pipelines together. I thrive where design meets technology - curious, collaborative, and focused on scalable impact.
            </p>

            <div className="mt-10 flex flex-col gap-4 sm:flex-row sm:items-center">
              <DownloadConsciousnessButton />
              <Magnetic strength={0.18} className="w-full sm:w-auto">
                <Button
                  asChild
                  size="lg"
                  variant="ghost"
                  className="group relative h-14 rounded-full border border-border/70 bg-background/40 px-8 text-sm font-semibold uppercase tracking-[0.18em] text-foreground/80 transition-all duration-300 hover:border-primary/60 hover:text-primary"
                  data-cursor="focus"
                >
                  <a href="#contact" className="flex items-center gap-3">
                    Start a collaboration
                    <ArrowRight className="h-5 w-5 transition-transform duration-300 group-hover:translate-x-1" />
                  </a>
                </Button>
              </Magnetic>
            </div>

            <div className="mt-12 grid gap-4 sm:grid-cols-3">
              {highlights.map((item, index) => (
                <Magnetic key={item.title} strength={0.12} className="h-full">
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, amount: 0.4 }}
                    transition={{ delay: index * 0.1, duration: 0.5, ease: 'easeOut' }}
                    className="h-full rounded-3xl border border-border/60 bg-background/50 p-6 shadow-[0_18px_40px_-32px_rgba(15,23,42,0.45)] backdrop-blur-xl"
                    data-cursor="magnetic"
                  >
                    <p className="text-xs uppercase tracking-[0.28em] text-muted-foreground/70">{item.title}</p>
                    <p className="mt-3 text-sm text-foreground/80">{item.description}</p>
                  </motion.div>
                </Magnetic>
              ))}
            </div>
          </div>

          <div className="relative">
            <motion.div
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.3 }}
              transition={{ duration: 0.75, delay: 0.1, ease: 'easeOut' }}
              className="relative overflow-hidden rounded-[2.75rem] border border-border/60 bg-background/70 p-6 shadow-[0_32px_80px_-40px_rgba(15,23,42,0.65)] backdrop-blur-2xl"
            >
              <CodeBackdrop />
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.4 }}
                transition={{ duration: 0.6, delay: 0.2, ease: 'easeOut' }}
                className="relative z-10 rounded-[2rem] border border-border/40 bg-background/70 p-6 shadow-[0_24px_70px_-40px_rgba(15,23,42,0.55)]"
              >
                <div className="flex items-center justify-between text-xs uppercase tracking-[0.24em] text-muted-foreground/70">
                  <span>Tech Stack</span>
                  <span>Interactive graph</span>
                </div>
                <div className="mt-6">
                  <TechField skills={skills} />
                </div>
              </motion.div>
            </motion.div>
            <div className="pointer-events-none absolute -right-28 top-1/2 h-40 w-40 -translate-y-1/2 rounded-full bg-primary/40 blur-3xl" />
            <div className="pointer-events-none absolute -left-16 bottom-4 h-32 w-32 rounded-full bg-accent/40 blur-3xl" />
          </div>
        </motion.div>
      </div>
    </section>
  );
}
