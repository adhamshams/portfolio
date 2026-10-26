export type TextLine = { type: 'title' | 'paragraph'; content: string };

export const sunTexts: TextLine[] = [
  {
    type: 'title',
    content: 'Adham Shams',
  },
  {
    type: 'paragraph',
    content:
      'In Arabic, “Shams” means sun, the first structure I learned to read. It became my earliest lens, seeing beyond the surface to the patterns underneath.',
  },
  {
    type: 'paragraph',
    content:
      'My practice began there, in the hidden architectures of light, music, DNA, books, and cinema. Each a system of rhythms waiting to be reshaped into something new.',
  },
  {
    type: 'paragraph',
    content: 'This is my approach: look deeper, break things open, rebuild them with intent.',
  },
];

/** How the 2024 desktop was made; shown on its panel on every screen size. */
export const xpMadeNote =
  'Every line of it was coded by hand, with love, before any coding agents. My design process is so much different now, and this desktop is a snapshot of where it started.';

export const xpTexts: TextLine[] = [
  {
    type: 'title',
    content: 'The Machine',
  },
  {
    type: 'paragraph',
    content:
      "This Windows XP-themed portfolio interface is a return to the system on my family's first computer, where I first sensed what screens could do.",
  },
  {
    type: 'paragraph',
    content:
      'The old desktop represents the spark, the place where I learned that ideas could be built, broken, and rebuilt.',
  },
  {
    type: 'paragraph',
    content:
      'It taught me that design lives in behavior as much as form, and that code can be a creative material.',
  },
  {
    type: 'paragraph',
    content: xpMadeNote,
  },
];
