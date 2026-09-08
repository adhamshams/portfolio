export interface Project {
  id: string;
  title: string;
  role: string;
  summary: string;
  stack: string[];
  /** Internal route of the long-form write-up, surfaced as the card's primary action. */
  caseStudy?: string;
  links: { label: string; href: string }[];
}

export const projects: Project[] = [
  {
    id: 'brew-buzz',
    title: 'Brew Buzz Specialty Coffee',
    role: 'UI/UX design, mobile dev, web dev, internal tooling',
    summary:
      'A specialty coffee shop in Cairo translated into pixels. A cross-platform React Native ordering and delivery app with loyalty rewards, wallet, promo codes and gift cards, wired to Paymob, Foodics and SMSMISR for secure payments, POS synchronization and branded OTP flows, driving 150K+ EGP in revenue and 500+ monthly users. Alongside it: a fleet app for drivers, an SEO-friendly React marketing site on a custom domain, and Command Center, an internal admin dashboard in React, TypeScript and Firebase with thermal receipt printing, Foodics sync, real-time order tracking, promo codes, loyalty challenges, push and SMS broadcasts and map-based delivery zones, all gated by role-based access.',
    stack: ['React Native', 'React.js', 'TypeScript', 'Firebase', 'Paymob', 'Foodics'],
    caseStudy: '/brewbuzz',
    links: [
      { label: 'iOS App', href: 'https://apps.apple.com/eg/app/brew-buzz/id6738006550' },
      {
        label: 'Android App',
        href: 'https://play.google.com/store/apps/details?id=com.adhamshams.brewbuzzcoffee',
      },
      {
        label: 'Fleet App (iOS)',
        href: 'https://apps.apple.com/eg/app/brew-buzz-fleet/id6755193395',
      },
      { label: 'brewbuzzcoffee.com', href: 'https://brewbuzzcoffee.com' },
      { label: 'Command Center', href: 'https://command.brewbuzzcoffee.com' },
    ],
  },
  {
    id: 'lightship',
    title: 'Lightship',
    role: 'Design & front-end development',
    summary:
      "Lightship's quadlingual marketing site — English, right-to-left Arabic, German and Italian — built in Next.js 16, React 19 and TypeScript on a custom design system and i18n layer, with GSAP scroll-driven animation and multi-step request forms running on serverless API routes.",
    stack: ['Next.js', 'React.js', 'TypeScript', 'GSAP'],
    links: [{ label: 'lightship-eg.com', href: 'https://lightship-eg.com' }],
  },
];
