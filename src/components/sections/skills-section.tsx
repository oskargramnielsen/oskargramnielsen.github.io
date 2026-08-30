
'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { motion } from 'framer-motion';

interface Skill {
  name: string;
  description?: string; 
  category: 'AI & Automation' | 'Development' | 'Design & Analysis';
}

const skillsData: Skill[] = [
  {
    name: 'AI & LLM Tooling',
    category: 'AI & Automation',
    description: 'LLMs, AI agents, prompt-driven workflows',
  },
  {
    name: 'Process Automation',
    category: 'AI & Automation',
    description: 'Power Platform, Power Automate, low-code apps',
  },
  {
    name: 'Data Pipelines & Integration',
    category: 'AI & Automation',
    description: 'REST APIs, web scraping, Excel, system integrations',
  },
  {
    name: 'Full-Stack Development',
    category: 'Development',
    description: 'React, TypeScript, PostgreSQL',
  },
  {
    name: 'Scripting & Applications',
    category: 'Development',
    description: 'C#, Python, node-based programming',
  },
  {
    name: 'Version Control',
    category: 'Development',
    description: 'Git, GitHub, CI/CD',
  },
  {
    name: 'Computational Design',
    category: 'Design & Analysis',
    description: 'Grasshopper, Dynamo, parametric modelling',
  },
  {
    name: 'Simulation & Analysis',
    category: 'Design & Analysis',
    description: 'Grasshopper, Blender, ENVI-met',
  },
  {
    name: 'Digital Sustainability',
    category: 'Design & Analysis',
    description: 'LCA tools, BIM-based analysis, environmental data',
  },
];

const skillCategories: Skill['category'][] = ['AI & Automation', 'Development', 'Design & Analysis'];

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
          <p className="text-lg text-muted-foreground">What I work with.</p>
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
