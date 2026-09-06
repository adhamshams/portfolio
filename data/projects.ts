export interface Project {
  id: string;
  title: string;
  role: string;
  summary: string;
  stack: string[];
  links: { label: string; href: string }[];
}

export const projects: Project[] = [
  {
    id: 'brew-buzz',
    title: 'Brew Buzz Specialty Coffee',
    role: 'UI/UX design, mobile dev, web dev',
    summary:
      'A specialty coffee shop in Cairo translated into pixels. A React Native + Firebase app with ordering, a loyalty program, wallet, promo codes and digital gift cards, which drove over 100K EGP in revenue serving 500+ users monthly. The Next.js landing page, custom domain and branded SMS sender ID round it out into a full brand ecosystem.',
    stack: ['React Native', 'Firebase', 'Next.js'],
    links: [
      { label: 'iOS App', href: 'https://apps.apple.com/eg/app/brew-buzz/id6738006550' },
      {
        label: 'Android App',
        href: 'https://play.google.com/store/apps/details?id=com.adhamshams.brewbuzzcoffee',
      },
      { label: 'brewbuzzcoffee.com', href: 'https://brewbuzzcoffee.com' },
    ],
  },
];
