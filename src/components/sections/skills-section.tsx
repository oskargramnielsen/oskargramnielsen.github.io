
'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { motion } from 'framer-motion';

interface Skill {
  name: string;
  description?: string; 
  category: 'Programming' | 'Data' | 'Design';
}
// const skillsData: Skill[] = [
//   { name: 'Automation & Scripting', category: 'Technical', description: 'C#, Revit API, Grasshopper, Python' },
//   { name: 'Full-Stack Development', category: 'Technical', description: 'React, TypeScript, PostgreSQL, REST API' },
//   { name: 'Data Pipelines', category: 'Technical', description: 'Web Scraping, Excel, Power Automate' },
//   { name: 'Computational Design', category: 'Creative Process', description: 'Rhino, Dynamo, Parametric Modeling' },
//   { name: 'Cloud Integration', category: 'Technical', description: 'Power Platform, LCAbyg API, Serverless Tools' },
//   { name: 'Digital Sustainability', category: 'Methodologies', description: 'LCA Tools, BIM-based analysis' },
//   { name: 'Problem Solving', category: 'Creative Process', description: 'Analytical thinking, Workflow optimization' },
//   { name: 'Version Control', category: 'Technical', description: 'Git, GitHub, CI/CD' },
//   { name: 'Collaboration & Communication', category: 'Methodologies', description: 'Interdisciplinary teamwork, Documentation' },
// ];

const skillsData: Skill[] = [
  {
    name: 'Desktop Application',
    category: 'Programming',
    description: 'C#, Python, Node Based Programming',
  },
  {
    name: 'Full-Stack Development',
    category: 'Programming',
    description: 'React, TypeScript, PostgreSQL',
  },
  {
    name: 'Cloud Platform Automation',
    category: 'Data',
    description: 'Power Platform, Power Automate',
  },
  {
    name: 'Version Control',
    category: 'Programming',
    description: 'Git, GitHub, CI/CD',
  },
  {
    name: 'Data Pipelines & Automation',
    category: 'Data',
    description: 'Web Scraping, Excel, Power Automate',
  },
  {
    name: 'Digital Sustainability',
    category: 'Data',
    description: 'LCA Tools, BIM-based analysis, Environmental Data',
  },
  {
    name: 'Computational Design',
    category: 'Design',
    description: 'Grasshpper, Dynamo, Parametric Modeling',
  },
  {
    name: '3D Modelling',
    category: 'Design',
    description: 'Rhino, Revit',
  },
  {
    name: 'Simulations & Analysis',
    category: 'Design',
    description: 'Grasshopper, Blender, ENVI-met',
  },
];




const skillCategories: Skill['category'][] = ['Programming', 'Data', 'Design'];

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
