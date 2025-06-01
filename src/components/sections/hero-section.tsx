
'use client'

import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { DownloadCloud, ArrowRight } from 'lucide-react';
import { motion } from 'framer-motion';

export default function HeroSection() {
  return (
    <motion.section 
      id="about" 
      className="py-20 md:py-32"
      initial={{ opacity: 0, y: 50 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
      viewport={{ once: true, amount: 0.2 }}
    >
      <Card className="border-0 rounded-none shadow-none bg-transparent">
        <CardContent className="p-0">
          <div className="text-left max-w-3xl"> {/* Adjusted from mx-auto to allow for art profile alignment */}
            <motion.h1 
              className="text-4xl md:text-6xl font-medium text-primary mb-6 tracking-tight"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              Hello, I'm Oskar
            </motion.h1>
            <motion.p 
              className="text-xl text-muted-foreground mb-4"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
            >
              Automation Engineer | Innovator | Problem Solver
            </motion.p>
            <motion.p 
              className="text-foreground/80 leading-relaxed mb-10 text-lg"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.4 }}
            >
          I am a passionate and results-driven engineer with experience in designing, developing, and deploying software solutions. My expertise lies in automation of workflows and data analytics with focus of optimizing the workflow through digital solutions. I thrive in collaborative environments and am dedicated to leveraging technology to solve complex challenges and deliver impactful products. I am always eager to learn and adapt to new technologies and methodologies to drive innovation and efficiency.            </motion.p>
            <motion.div 
              className="flex flex-col sm:flex-row gap-4"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.5 }}
            >
              <Button asChild size="lg" variant="outline" className="border-primary text-primary hover:bg-primary hover:text-primary-foreground rounded-none transition-transform duration-200 ease-out hover:scale-105">
                <a href="/placeholder-cv.pdf" download>
                  <DownloadCloud className="mr-2 h-5 w-5" />
                  Download CV
                </a>
              </Button>
              <Button asChild size="lg" variant="ghost" className="text-primary hover:bg-secondary hover:text-primary rounded-none transition-transform duration-200 ease-out hover:scale-105">
                <a href="#contact">
                  Contact Me
                  <ArrowRight className="ml-2 h-5 w-5" />
                </a>
              </Button>
            </motion.div>
          </div>
        </CardContent>
      </Card>
    </motion.section>
  );
}
