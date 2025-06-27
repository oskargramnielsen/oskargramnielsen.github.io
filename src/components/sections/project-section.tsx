'use client'

import Image from 'next/image';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { motion } from 'framer-motion';
import { Carousel, CarouselContent, CarouselItem, CarouselPrevious, CarouselNext } from '@/components/ui/carousel';
import React from 'react';
import Autoplay from 'embla-carousel-autoplay';

const projects = [
  {
    title: "Andelskortet",
    description:
      "A web-based platform for exploring cooperative housing opportunities in Copenhagen, built using Python, HTML/CSS and REST API",
imageUrl: "/images/andel2.png",
    aiHint: "map housing visualization",
  },
  {
    title: "Solar Decathlon China",
    description:
      "Sustainable housing design project. I optimized roof design to enhance photovoltaic performance and indoor climate systems in an international competition.",
    imageUrl: "/images/solar.png",
    aiHint: "solar architecture renewable",
  },
  {
    title: "Cloud-Based LCA & BIM Solution",
    description:
      "Master’s thesis project integrating life cycle assessment into BIM workflows using Revit and LCAbyg APIs. Developed with Rambøll.",
    imageUrl: "/images/master2.png",
    aiHint: "data model sustainability",
  },
  {
    title: "Rainwater Simulation Tool",
    description:
      "Bachelor thesis project simulating urban rainwater flow using particle systems in Blender. Developed with Bjarke Ingels Group (BIG).",
    imageUrl: "/images/bachelor2.png",
    aiHint: "urban water simulation",
  },
];


export default function ProjectSection() {
      const autoplayPlugin = React.useRef(
        Autoplay({ delay: 2000, stopOnInteraction: false, stopOnMouseEnter: true, playOnInit: true })
      ).current;

  return (
    <motion.section 
      id="skills" 
      className="py-20 md:py-32 bg-transparent" // Kept transparent as per minimalist request
      initial={{ opacity: 0, y: 50 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
      viewport={{ once: true, amount: 0.1 }}
    >
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-left mb-12 max-w-3xl">
          <h2 className="text-3xl md:text-4xl font-medium text-primary mb-3 tracking-tight">Featured Projects</h2>
          <p className="text-lg text-muted-foreground">A brief overview of my projects.</p>
        </div>
      
        <Card className="shadow-none border-0 bg-transparent text-left max-w-4xl mx-auto rounded-none">

            {/* Project Carousel */}
            <div className="text-left mb-20 max-w-5xl mx-auto px-2 sm:px-4">
   
              <Carousel 
                opts={{
                  align: "start",
                  loop: true,
                  slidesToScroll: 1,
                }}
                plugins={[autoplayPlugin]}
                data-ai-hint="carousel projects"
                className="w-full"
              >
                <CarouselContent>
                  {projects.map((project, index) => (
                    <CarouselItem key={index} className="md:basis-1/2 lg:basis-1/2">
                      <div className="p-2 h-full">
                        <Card className="rounded-none shadow-none border border-border/70 hover:border-foreground/70 transition-colors group h-full flex flex-col bg-card">
                          <CardContent className="p-0 aspect-[3/2] relative overflow-hidden">
                            <Image
                              src={project.imageUrl}
                              alt={project.title}
                              fill
                              className="object-cover transition-transform duration-300 ease-in-out group-hover:scale-105"
                              data-ai-hint={project.aiHint}
                            />
                          </CardContent>
                          <div className="p-4 flex-grow flex flex-col">
                            <CardTitle className="text-xl font-medium text-primary mb-2">{project.title}</CardTitle>
                            <CardDescription className="text-sm text-muted-foreground flex-grow">{project.description}</CardDescription>
                          </div>
                        </Card>
                      </div>
                    </CarouselItem>
                  ))}
                </CarouselContent>
                <CarouselPrevious />
                <CarouselNext />
              </Carousel>
            </div>

                  </Card>


      </div>
      
    </motion.section>
    
  );
}
