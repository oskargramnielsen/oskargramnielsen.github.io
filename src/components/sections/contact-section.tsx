'use client'

import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Mail, Linkedin, Github, Phone, ArrowRight } from 'lucide-react';
import { motion } from 'framer-motion';
import { Carousel, CarouselContent, CarouselItem, CarouselPrevious, CarouselNext } from '@/components/ui/carousel';
import Autoplay from 'embla-carousel-autoplay';
import React from 'react';
import pb from '../../assets/images/Profilbillede_sh_square.jpg';

interface ContactLinkProps {
  href: string;
  Icon: React.ElementType;
  label: string;
  ariaLabel: string;
}

const ContactLink: React.FC<ContactLinkProps> = ({ href, Icon, label, ariaLabel }) => (
  <Button asChild variant="outline" className="w-full justify-start text-left group border-primary text-primary hover:bg-primary hover:text-primary-foreground rounded-none transition-transform duration-200 ease-out hover:scale-105">
    <a href={href} target="_blank" rel="noopener noreferrer" aria-label={ariaLabel} className="flex items-center justify-between">
      <div className="flex items-center">
        <Icon className="mr-3 h-5 w-5" />
        {label}
      </div>
      <ArrowRight className="h-5 w-5 opacity-0 group-hover:opacity-100 transition-opacity" />
    </a>
  </Button>
);

const userEmail = "oskargram1996@gmail.com"; 
const userLinkedIn = "https://www.linkedin.com/in/oskar-gram-nielsen-462bb3141/"; 
const userGitHub = "https://github.com/oskargramnielsen"; 
const userPhone = "+45 24 23 25 17"; 

export default function ContactSection() {
  const autoplayPlugin = React.useRef(
    Autoplay({ delay: 2000, stopOnInteraction: false, stopOnMouseEnter: true, playOnInit: true })
  ).current;

  return (
    <motion.section 
      id="contact" 
      className="py-20 md:py-32 bg-transparent" // Kept transparent as per minimalist request
      initial={{ opacity: 0, y: 50 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
      viewport={{ once: true, amount: 0.05 }}
    >

      
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <Card className="shadow-none border-0 bg-transparent text-left max-w-4xl mx-auto rounded-none">


          <CardHeader className="p-0 mb-12 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <CardTitle className="text-3xl md:text-4xl px-0 font-medium text-primary ">
              Get In Touch
            </CardTitle>
            <CardDescription className="text-lg text-muted-foreground mt-2">
              Let's connect. I'm open to collaborations, conversations, or new opportunities. Explore my work and reach out.
            </CardDescription>
          </CardHeader>
         
          <CardContent className="p-0 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 md:grid-cols-2 gap-6">

            <ContactLink
              href={`mailto:${userEmail}`}
              Icon={Mail}
              label="oskargram1996@gmail.com"
              ariaLabel="Send me an email"
            />
              <ContactLink
              href={`tel:${userPhone}`}
              Icon={Phone}
              label="+45 24 23 25 17"
              ariaLabel="Call me"
            />
            <ContactLink
              href={userLinkedIn}
              Icon={Linkedin}
              label="LinkedIn Profile"
              ariaLabel="Visit my LinkedIn"
            />
            <ContactLink
              href={userGitHub}
              Icon={Github}
              label="GitHub Profile"
              ariaLabel="Visit my GitHub"
            />

          </CardContent>

        </Card>
        
      </div>
    </motion.section>
  );
}
