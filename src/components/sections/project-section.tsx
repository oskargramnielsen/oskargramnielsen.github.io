'use client'

import Image from 'next/image';
import { Card, CardContent } from '@/components/ui/card';
import { motion } from 'framer-motion';
import { ArrowUpRight } from 'lucide-react';
import React from 'react';

const featuredProject = {
  title: "Andelskortet",
  description:
    "A live platform that maps cooperative housing in Copenhagen. Scrapers collect and clean the listings automatically, and the whole thing — data, backend and web app — is built and run by me.",
  imageUrl: "/images/andel2.png",
  aiHint: "map housing visualization",
  tags: ["TypeScript", "React", "Automation", "REST API"],
  link: "https://andelskortet.dk",
  linkLabel: "andelskortet.dk",
};

const projects = [
  {
    title: "Cloud-Based LCA & BIM Solution",
    description:
      "Master's thesis with Rambøll: connecting two APIs so sustainability data flows automatically between systems.",
    imageUrl: "/images/master2.png",
    aiHint: "data model sustainability",
    tags: ["C#", "REST API"],
  },
  {
    title: "Rainwater Simulation Tool",
    description:
      "Bachelor thesis with Bjarke Ingels Group, simulating urban rainwater flow with particle systems.",
    imageUrl: "/images/bachelor2.png",
    aiHint: "urban water simulation",
    tags: ["Blender", "Simulation"],
  },
  {
    title: "Solar Decathlon China",
    description:
      "Optimised a solar roof design in an international student competition. Awarded DTU's Blue Dot Diploma.",
    imageUrl: "/images/solar.png",
    aiHint: "solar architecture renewable",
    tags: ["Computational Design"],
  },
];

function Tags({ tags }: { tags: string[] }) {
  return (
    <ul className="flex flex-wrap gap-x-3 gap-y-1">
      {tags.map((tag) => (
        <li key={tag} className="text-xs uppercase tracking-widest text-muted-foreground">
          {tag}
        </li>
      ))}
    </ul>
  );
}

export default function ProjectSection() {
  return (
    <motion.section
      id="projects"
      className="py-20 md:py-32 bg-transparent"
      initial={{ opacity: 0, y: 50 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
      viewport={{ once: true, amount: 0.1 }}
    >
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-left mb-12 max-w-3xl">
          <h2 className="text-3xl md:text-4xl font-medium text-primary mb-3 tracking-tight">Featured Projects</h2>
          <p className="text-lg text-muted-foreground">A few things I have built.</p>
        </div>

        {/* Featured project — full width, image and text side by side */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: "easeOut" }}
          viewport={{ once: true, amount: 0.2 }}
        >
          <Card className="rounded-none shadow-none border-y border-border/70 bg-transparent group">
            <CardContent className="p-0 grid grid-cols-1 md:grid-cols-5">
              <div className="md:col-span-3 relative aspect-[16/9] overflow-hidden border-b md:border-b-0 md:border-r border-border/70">
                <Image
                  src={featuredProject.imageUrl}
                  alt={featuredProject.title}
                  fill
                  className="object-cover transition-transform duration-500 ease-out group-hover:scale-105"
                  data-ai-hint={featuredProject.aiHint}
                />
              </div>
              <div className="md:col-span-2 p-6 md:p-10 flex flex-col justify-center gap-4">
                <span className="text-xs uppercase tracking-widest text-muted-foreground">Featured</span>
                <h3 className="text-2xl md:text-3xl font-medium text-primary tracking-tight">
                  {featuredProject.title}
                </h3>
                <p className="text-muted-foreground leading-relaxed">
                  {featuredProject.description}
                </p>
                <Tags tags={featuredProject.tags} />
                <a
                  href={featuredProject.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center text-sm text-primary hover:underline underline-offset-4 w-fit"
                >
                  {featuredProject.linkLabel}
                  <ArrowUpRight className="ml-1 h-4 w-4" />
                </a>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Remaining projects — static grid */}
        <div className="grid grid-cols-1 md:grid-cols-3">
          {projects.map((project, index) => (
            <motion.div
              key={project.title}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1, ease: "easeOut" }}
              viewport={{ once: true, amount: 0.1 }}
            >
              <Card className="rounded-none shadow-none border-0 md:border-r md:last:border-r-0 border-b border-border/70 bg-transparent h-full flex flex-col group">
                <CardContent className="p-0 relative aspect-[16/10] overflow-hidden">
                  <Image
                    src={project.imageUrl}
                    alt={project.title}
                    fill
                    className="object-cover opacity-90 transition-all duration-500 ease-out group-hover:opacity-100 group-hover:scale-105"
                    data-ai-hint={project.aiHint}
                  />
                </CardContent>
                <div className="p-6 flex flex-col gap-3 flex-grow">
                  <h3 className="text-lg font-medium text-primary">{project.title}</h3>
                  <p className="text-sm text-muted-foreground flex-grow">{project.description}</p>
                  <Tags tags={project.tags} />
                </div>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>
    </motion.section>
  );
}
