'use client';

import Image from 'next/image';
import { motion } from 'framer-motion';
import { FloatingProjectsScene } from './floating-projects-scene';
import { Magnetic } from '@/components/interactive/magnetic';

const projects = [
  {
    title: 'Andelskortet',
    description:
      'Map-driven platform for surfacing cooperative housing opportunities across Copenhagen. Built with Python data pipelines, REST APIs, and a lightweight web client.',
    imageUrl: '/images/andel2.png',
    tags: ['Python', 'REST API', 'Civic Data'],
    accentColor: '#60a5fa',
  },
  {
    title: 'Solar Decathlon China',
    description:
      'Sustainable housing concept where I optimised solar geometry and indoor climate performance through simulation-led decision making.',
    imageUrl: '/images/solar.png',
    tags: ['Simulation', 'Climate Tech', 'Architecture'],
    accentColor: '#f97316',
  },
  {
    title: 'Cloud-Based LCA & BIM Solution',
    description:
      "Master's thesis with Ramboll creating a cloud-native bridge between Revit and LCAbyg APIs for automated sustainability insights.",
    imageUrl: '/images/master2.png',
    tags: ['Revit API', 'C#', 'Cloud Automation'],
    accentColor: '#34d399',
  },
  {
    title: 'Rainwater Simulation Tool',
    description:
      'Bachelor thesis developed with Bjarke Ingels Group simulating urban rainwater behaviour using particle systems and generative tooling.',
    imageUrl: '/images/bachelor2.png',
    tags: ['Blender', 'Data Visualisation', 'Sustainability'],
    accentColor: '#a855f7',
  },
];

const approach = [
  'Integrate analytics early with living BIM and data pipelines.',
  'Prototype experiences rapidly, then harden for production.',
  'Design for resilience: offline fallbacks, telemetry, observability.',
];

export default function ProjectSection() {
  return (
    <section id="projects" className="relative py-24 md:py-32">
      <div className="container mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <div className="max-w-2xl">
          <span className="text-xs uppercase tracking-[0.28em] text-muted-foreground">Selected Work</span>
          <h2 className="mt-4 text-balance text-4xl font-semibold tracking-tight text-foreground md:text-5xl">
            Bento grid of impact-first projects
          </h2>
          <p className="mt-4 text-base text-muted-foreground">
            Each project blends computational design with robust engineering - delivering software that elevates architectural and infrastructure decisions.
          </p>
        </div>

        <div className="mt-14 grid gap-8 xl:grid-cols-[1.08fr_0.92fr] xl:items-start">
          <div className="grid auto-rows-[minmax(220px,1fr)] gap-6 sm:grid-cols-2">
            {projects.map((project, index) => (
              <Magnetic
                key={project.title}
                strength={0.12}
                className={
                  index === 0
                    ? 'sm:col-span-2 lg:row-span-2'
                    : index === 1
                    ? 'sm:col-span-1'
                    : index === 2
                    ? 'sm:col-span-1'
                    : 'sm:col-span-2'
                }
              >
                <motion.article
                  whileHover={{ y: -6, scale: 1.01 }}
                  transition={{ type: 'spring', stiffness: 340, damping: 26 }}
                  className="group relative flex h-full flex-col overflow-hidden rounded-[2rem] border border-border/60 bg-background/70 shadow-[0_26px_60px_-40px_rgba(15,23,42,0.8)] backdrop-blur-2xl"
                  data-cursor="project"
                >
                  <div className="relative h-48 w-full overflow-hidden">
                    <Image
                      src={project.imageUrl}
                      alt={project.title}
                      fill
                      className="object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                      sizes="(min-width: 1024px) 50vw, 100vw"
                      priority={index === 0}
                    />
                    <div className="absolute inset-0 bg-gradient-to-b from-black/20 via-transparent to-black/40 opacity-60 transition-opacity duration-300 group-hover:opacity-80" />
                  </div>
                  <div className="flex flex-1 flex-col gap-4 px-6 pb-6 pt-5">
                    <div className="flex items-center justify-between text-[11px] uppercase tracking-[0.28em] text-muted-foreground/70">
                      <span>{project.title}</span>
                      <span>{String(index + 1).padStart(2, '0')}</span>
                    </div>
                    <p className="text-sm text-foreground/90">{project.description}</p>
                    <div className="mt-auto flex flex-wrap gap-2">
                      {project.tags.map((tag) => (
                        <span
                          key={tag}
                          className="rounded-full border border-border/50 bg-background/60 px-3 py-1 text-[11px] uppercase tracking-[0.24em] text-muted-foreground/80"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>
                  <div
                    className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-300 ease-out group-hover:opacity-100"
                    style={{ background: `radial-gradient(circle at 20% 20%, ${project.accentColor}33, transparent 60%)` }}
                  />
                </motion.article>
              </Magnetic>
            ))}
          </div>

          <div className="space-y-6">
            <motion.div
              initial={{ opacity: 0, y: 28 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.4 }}
              transition={{ duration: 0.6, ease: 'easeOut' }}
              className="rounded-[2.25rem] border border-border/60 bg-background/70 p-6 shadow-[0_32px_70px_-40px_rgba(15,23,42,0.7)] backdrop-blur-2xl"
            >
              <div className="flex items-center justify-between text-xs uppercase tracking-[0.28em] text-muted-foreground">
                <span>Project visualiser</span>
                <span>R3F canvas</span>
              </div>
              <div className="mt-6">
                <FloatingProjectsScene items={projects.slice(0, 3).map(({ imageUrl, accentColor }) => ({ imageUrl, accentColor }))} />
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 28 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.3 }}
              transition={{ duration: 0.6, delay: 0.1, ease: 'easeOut' }}
              className="rounded-[2.25rem] border border-border/50 bg-gradient-to-br from-background/80 via-background/90 to-background/60 p-8 shadow-[0_22px_60px_-35px_rgba(15,23,42,0.65)]"
            >
              <h3 className="text-sm uppercase tracking-[0.32em] text-muted-foreground/70">Delivery Pattern</h3>
              <p className="mt-4 text-base text-foreground/80">
                From concept to deployment, I orchestrate design exploration, automation and cloud-native tooling as one workflow.
              </p>
              <ul className="mt-6 space-y-3 text-sm text-muted-foreground">
                {approach.map((item) => (
                  <li key={item} className="flex items-center gap-3">
                    <span className="h-1.5 w-1.5 rounded-full bg-primary/80 shadow-[0_0_12px_rgba(59,130,246,0.6)]" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
}
