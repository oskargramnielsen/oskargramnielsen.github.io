'use client';

import { motion } from 'framer-motion';

const CODE_LINES = `// automation orchestrator
const oskar = {
  focus: ['automation', 'data', 'architecture'],
  stack: ['TypeScript', 'C#', 'Python', 'Power Platform'],
  mindset: 'systems design meets creative engineering',
};

function streamline(workflow) {
  return workflow
    .map(step => step.observe())
    .map(step => step.deconstruct())
    .map(step => step.augmentWith({
      compute: 'cloud-native',
      empathy: true,
      resilience: 'edge-to-cloud pipelines',
    }));
}

export async function deployImpact(project) {
  await oskar.focus.forEach(calibrate);
  const architecture = await integrate(project, oskar.stack);
  return architecture.with({ sustainability: 'default' });
}
`;

export function CodeBackdrop() {
  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden rounded-[2.5rem] opacity-70">
      <motion.pre
        aria-hidden
        className="absolute inset-x-0 top-1/2 mx-auto max-w-2xl -translate-y-1/2 whitespace-pre-wrap break-words bg-gradient-to-b from-transparent via-white/6 to-transparent p-8 text-[13px] leading-relaxed text-foreground/50 dark:via-white/4 dark:text-white/30"
        initial={{ translateY: '50%' }}
        animate={{ translateY: ['-10%', '10%', '-10%'] }}
        transition={{ duration: 24, repeat: Infinity, ease: 'easeInOut' }}
      >
        {CODE_LINES}
      </motion.pre>
    </div>
  );
}
