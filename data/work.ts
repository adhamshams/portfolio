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

// TODO: replace these placeholders with real experience. Newest first.
export const work: WorkEntry[] = [
  {
    id: 'brew-buzz',
    company: 'Brew Buzz Specialty Coffee',
    role: 'Product Designer & Developer',
    period: '2024 – Present',
    summary:
      'Designed and shipped the ordering, loyalty and gift-card app on iOS and Android, plus the brand website.',
    bullets: ['React Native + Firebase mobile app', 'Next.js landing page', 'Over 100K EGP revenue, 500+ monthly users'],
  },
  {
    id: 'todo-1',
    company: 'Company name',
    role: 'Role title',
    period: 'YYYY – YYYY',
    summary: 'One or two sentences about what you did and what it achieved.',
    todo: true,
  },
  {
    id: 'todo-2',
    company: 'University / earlier role',
    role: 'Role title',
    period: 'YYYY – YYYY',
    summary: 'One or two sentences about what you did and what it achieved.',
    todo: true,
  },
];
