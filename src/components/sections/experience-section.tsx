'use client';

import { Magnetic } from '@/components/interactive/magnetic';
import { motion, useScroll, useTransform } from 'framer-motion';
import { useRef } from 'react';

const timeline = [
  {
    period: '2024',
    title: 'Cloud-Based LCA & BIM Automation',
    organisation: 'Ramboll',
    summary:
      'Designed a cloud-native platform aligning Revit models with LCAbyg APIs, automating sustainability insights directly inside design workflows.',
    stack: ['Revit API', 'C#', 'Power Platform', 'Life Cycle Assessment'],
  },
  {
    period: '2023',
    title: 'Andelskortet - Cooperative Housing Intelligence',
    organisation: 'Personal project',
    summary:
      'Built a data product revealing affordable cooperative housing stock via Python scrapers, REST microservices, and a responsive web interface.',
    stack: ['Python', 'REST API', 'Next.js', 'Civic Data'],
  },
  {
    period: '2022',
    title: 'Solar Decathlon - Performance Simulation',
    organisation: 'Team Solar Decathlon China',
    summary:
      'Optimised photovoltaic yield and indoor climate systems through iterative simulation pipelines guiding architectural decisions.',
    stack: ['Parametric Design', 'Simulation', 'Grasshopper', 'Data Visualisation'],
  },
  {
    period: '2020',
    title: 'Rainwater Simulation Tool',
    organisation: 'Bjarke Ingels Group',
    summary:
      'Modelled particle-based urban rainwater behaviour to inform resilient cityscapes, coupling Blender scripting with environmental analytics.',
    stack: ['Blender', 'Automation', 'Environmental Analytics', '3D Modelling'],
  },
];

export default function ExperienceSection() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ['start 0.8', 'end 0.2'],
  });
  const verticalScale = useTransform(scrollYProgress, [0, 1], ['0%', '100%']);

  return (
    <section id="experience" className="relative py-24 md:py-32">
      <div className="container mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
        <div className="max-w-2xl">
          <span className="text-xs uppercase tracking-[0.28em] text-muted-foreground">Experience Timeline</span>
          <h2 className="mt-4 text-balance text-4xl font-semibold tracking-tight text-foreground md:text-5xl">
            Scroll through the systems I have engineered
          </h2>
          <p className="mt-4 text-base text-muted-foreground">
            A journey through automation, simulation, and digital craftsmanship - each milestone merging architectural intent with modern software practices.
          </p>
        </div>

        <div ref={sectionRef} className="relative mt-16 grid gap-10 md:grid-cols-[0.25fr_0.75fr]">
          <div className="relative hidden md:block">
            <div className="absolute left-[calc(50%-1px)] top-0 h-full w-[2px] rounded bg-border/60" />
            <motion.div
              style={{ height: verticalScale }}
              className="absolute left-[calc(50%-1px)] top-0 w-[2px] origin-top rounded bg-gradient-to-b from-primary/80 via-accent/70 to-primary/40"
            />
          </div>

          <div className="space-y-12">
            {timeline.map((item, index) => (
              <Magnetic key={item.title} strength={0.1}>
                <motion.article
                  initial={{ opacity: 0, y: 40 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, amount: 0.6 }}
                  transition={{ duration: 0.6, delay: index * 0.08, ease: 'easeOut' }}
                  className="relative overflow-hidden rounded-[2rem] border border-border/60 bg-background/70 p-8 shadow-[0_24px_60px_-35px_rgba(15,23,42,0.65)] backdrop-blur-2xl"
                >
                  <div className="flex flex-col gap-3 text-xs uppercase tracking-[0.28em] text-muted-foreground/70 md:flex-row md:items-center md:justify-between">
                    <span>{item.period}</span>
                    <span>{item.organisation}</span>
                  </div>
                  <h3 className="mt-5 text-xl font-semibold text-foreground">
                    {item.title}
                  </h3>
                  <p className="mt-4 text-sm text-muted-foreground leading-relaxed">
                    {item.summary}
                  </p>
                  <div className="mt-6 flex flex-wrap gap-2">
                    {item.stack.map((skill) => (
                      <span
                        key={skill}
                        className="rounded-full border border-border/50 bg-background/70 px-3 py-1 text-[11px] uppercase tracking-[0.24em] text-muted-foreground/80"
                      >
                        {skill}
                      </span>
                    ))}
                  </div>
                  <div className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-300 ease-out hover:opacity-100" />
                </motion.article>
              </Magnetic>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
