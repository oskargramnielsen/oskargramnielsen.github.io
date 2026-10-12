export const en = {
  meta: {
    title: 'Oskar Gram Nielsen — AI implementation & automation',
    description:
      'I find the manual, time-consuming work in your company and replace it with AI tools your team actually uses. Start with a free 30-minute bottleneck review.',
  },
  nav: {
    process: 'Process',
    about: 'About',
    work: 'Work',
    book: 'Book a call',
    langLabel: 'Language',
  },
  hero: {
    eyebrow: 'AI implementation & automation — Copenhagen',
    before: 'Stop',
    after: 'by hand.',
    tasks: [
      { task: 'copying invoices', now: '6 h/week', then: '15 min' },
      { task: 'chasing approvals', now: '4 h/week', then: '0 min' },
      { task: 'building reports', now: '8 h/week', then: '10 min' },
      { task: 'sorting emails', now: '5 h/week', then: '30 min' },
      { task: 'checking BIM models', now: '10 h/week', then: '1 h' },
    ],
    nowLabel: 'Typical time spent',
    thenLabel: 'After automation',
    lead: "I'm Oskar — an engineer who finds the manual work in your company and replaces it with AI tools that actually get used. Start with a free 30-minute bottleneck review.",
    cta: 'Book free consultation',
  },
  marquee: ['Invoices', 'Reports', 'Data entry', 'Email triage', 'BIM checks', 'Approvals', 'Spreadsheets'],
  process: {
    label: 'Process',
    title: ['Four steps.', 'No guesswork.'],
    steps: [
      { title: 'Free consultation', body: 'Thirty minutes. You describe a normal week. I listen for where the hours go.', time: 'Day 1 — free' },
      { title: 'Find the bottlenecks', body: 'A ranked map of manual tasks — hours saved vs. effort to automate — with a fixed price.', time: 'Week 1' },
      { title: 'Build the toolset', body: 'Custom AI agents, scripts and integrations, built on the systems you already use.', time: 'Weeks 2–4' },
      { title: 'Implement, together', body: 'A fixed window where I work with your team until the tools are part of the routine.', time: 'Weeks 4–8' },
    ],
  },
  about: {
    label: 'Background',
    title: 'Engineer first.',
  },
  proof: {
    label: 'Proof',
    title: 'See it run.',
    play: 'Play',
  },
  contact: {
    label: 'Contact',
    title: 'Tell me what slows you down.',
    email: 'Your email',
    task: 'What task eats your week?',
    send: 'Send',
    sending: 'Sending…',
    sent: 'Thanks — I’ll reply within one working day.',
    error: 'Something went wrong. Email me directly instead.',
    or: 'Or pick a time directly',
    booking: 'Book a 30-min call',
  },
  footer: {
    cv: 'Download CV',
    rights: 'All rights reserved.',
  },
};

export type Dict = typeof en;
