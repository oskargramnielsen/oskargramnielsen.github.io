
'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { motion } from 'framer-motion';

interface Skill {
  name: string;
  description?: string; 
  category: 'Technical' | 'Creative Process' | 'Methodologies';
}

const skillsData: Skill[] = [
  { name: 'Full-Stack Development', category: 'Technical', description: 'React, Next.js, Node.js, Python' },
  { name: 'Cloud Architecture', category: 'Technical', description: 'AWS, GCP, Serverless' },
  { name: 'Database Design', category: 'Technical', description: 'SQL, NoSQL, ORMs' },
  { name: 'UI/UX Principles', category: 'Creative Process', description: 'User-centric design, Prototyping' },
  { name: 'Generative AI Integration', category: 'Technical', description: 'Prompt Engineering, LLM APIs' },
  { name: 'Agile Development', category: 'Methodologies', description: 'Scrum, Kanban' },
  { name: 'Problem Solving', category: 'Creative Process', description: 'Analytical thinking, Root cause analysis' },
  { name: 'Version Control', category: 'Technical', description: 'Git, GitHub, CI/CD' },
  { name: 'Leadership & Mentorship', category: 'Methodologies', description: 'Team building, Knowledge sharing' },
];

const skillCategories: Skill['category'][] = ['Technical', 'Creative Process', 'Methodologies'];

export default function SkillsSection() {
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
          <h2 className="text-3xl md:text-4xl font-medium text-primary mb-3 tracking-tight">My Expertise</h2>
          <p className="text-lg text-muted-foreground">A brief overview of my capabilities.</p>
        </div>
      
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-0 md:gap-0"> {/* Removed gap for tighter layout */}
          {skillCategories.map((category, index) => (
            <motion.div
              key={category}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1, ease: "easeOut" }}
              viewport={{ once: true, amount: 0.2 }}
            >
              <Card className="shadow-none border-0 md:border-b md:border-r md:last:border-r-0 border-border/50 rounded-none bg-transparent md:bg-transparent">
                <CardHeader className="p-4 md:p-6">
                  <CardTitle className="text-xl font-semibold text-primary">
                    {category}
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-4 md:p-6 pt-0">
                  <ul className="space-y-3">
                    {skillsData.filter(skill => skill.category === category).map((skill) => (
                      <li key={skill.name}>
                        <h4 className="text-md font-medium text-foreground">{skill.name}</h4>
                        {skill.description && (
                          <p className="text-sm text-muted-foreground">{skill.description}</p>
                        )}
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>
    </motion.section>
  );
}
