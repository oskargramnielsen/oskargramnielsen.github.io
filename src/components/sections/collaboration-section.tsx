'use client'

import Image from 'next/image';
import { motion } from 'framer-motion';
import React from 'react';
import Autoplay from 'embla-carousel-autoplay';


const collaborationLogos = [
  { name: "Company A", imageUrl: "https://placehold.co/150x80.png?text=Logo+A", aiHint: "logo company" },
  { name: "Company B", imageUrl: "https://placehold.co/150x80.png?text=Logo+B", aiHint: "logo brand" },
  { name: "Organization C", imageUrl: "https://placehold.co/150x80.png?text=Logo+C", aiHint: "logo tech" },
  { name: "Startup D", imageUrl: "https://placehold.co/150x80.png?text=Logo+D", aiHint: "logo abstract" },
  { name: "Studio E", imageUrl: "https://placehold.co/150x80.png?text=Logo+E", aiHint: "logo creative" },
  { name: "Company F", imageUrl: "https://placehold.co/150x80.png?text=Logo+F", aiHint: "logo business" },
  { name: "Company G", imageUrl: "https://placehold.co/150x80.png?text=Logo+G", aiHint: "logo modern" },
  { name: "Company H", imageUrl: "https://placehold.co/150x80.png?text=Logo+H", aiHint: "logo minimal" },
];

export default function CollaborationSection() {

    const autoplayPlugin = React.useRef(
      Autoplay({ delay: 2000, stopOnInteraction: false, stopOnMouseEnter: true, playOnInit: true })
    ).current;
  
  return (
    <motion.section
      id="collaborations"
      className="py-20 md:py-32 bg-transparent"
      initial={{ opacity: 0, y: 50 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
      viewport={{ once: true, amount: 0.05 }}
    >
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-left mb-12 max-w-3xl">
          <h2 className="text-3xl md:text-4xl font-medium text-primary mb-3 tracking-tight">Collaboration & Experience</h2>
          <p className="text-lg text-muted-foreground">A brief overview of my collaborats.</p>
        </div>
        <div className="overflow-hidden relative">
          <div className="flex whitespace-nowrap animate-scroll">
            {/* First set of logos */}
            {collaborationLogos.map((logo, index) => (
              <div key={`first-${index}`} className="flex-shrink-0 mx-8 flex items-center justify-center h-16">
                <Image
                  src={logo.imageUrl}
                  alt={logo.name}
                  width={120}
                  height={60}
                  className="object-contain opacity-70 hover:opacity-100 transition-opacity duration-300 max-h-12 w-auto"
                  data-ai-hint={logo.aiHint}
                />
              </div>
            ))}
            {/* Duplicate set for seamless loop */}
            {collaborationLogos.map((logo, index) => (
              <div key={`second-${index}`} className="flex-shrink-0 mx-8 flex items-center justify-center h-16">
                <Image
                  src={logo.imageUrl}
                  alt={logo.name}
                  width={120}
                  height={60}
                  className="object-contain opacity-70 hover:opacity-100 transition-opacity duration-300 max-h-12 w-auto"
                  data-ai-hint={logo.aiHint}
                />
              </div>
            ))}
          </div>
        </div>

      </div>

      {/* Add animation styles */}
      <style jsx>{`
        @keyframes scroll {
          0% {
            transform: translateX(0);
          }
          100% {
            transform: translateX(-50%);
          }
        }
        .animate-scroll {
          animation: scroll 20s linear infinite;
        }
      `}</style>
    </motion.section>
  );
}
