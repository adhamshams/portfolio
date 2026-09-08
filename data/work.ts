export interface WorkEntry {
  id: string;
  company: string;
  role: string;
  period: string;
  summary: string;
  bullets?: string[];
  /** Placeholder entry; rendered with a visible TODO tag until replaced. */
  todo?: boolean;
}

// Newest first.
export const work: WorkEntry[] = [
  {
    id: 'nestle',
    company: 'Nestlé',
    role: 'E-Commerce Specialist',
    period: 'May 2026 – Present',
    summary: 'Recently joined the e-commerce team — more on this soon.',
  },
  {
    id: 'botit',
    company: 'Botit',
    role: 'Full Stack Developer',
    period: 'Jul 2025 – Apr 2026',
    summary:
      'On the Tooling team, building the internal systems the campaign and language teams run on day to day.',
    bullets: [
      'Contributed to the Tooling team at Botit, developing internal systems with React, Express.js, and MongoDB to support promotional campaign management, including the Promotion Engine Dashboard for real-time performance monitoring and automated workflows.',
      'Built a Language Panel using React and Node.js, integrated with Ollama and the OpenAI API, enabling the internal language team to manage multilingual content, streamline translation workflows, and generate AI-assisted copy.',
    ],
  },
];
