import type { Metadata } from "next";
import { SpeedInsights } from "@vercel/speed-insights/next"
import { Analytics } from "@vercel/analytics/next"
import { IBM_Plex_Mono } from "next/font/google";
import LayoutWrapper from "@/components/layout-wrapper";
import "./globals.css";

const ibmPlexMono = IBM_Plex_Mono({
  weight: ['300', '400', '500', '700'],
  subsets: ['latin'],
  variable: '--font-ibm-plex-mono',
});

export const metadata: Metadata = {
  title: "Adham Shams",
  description: "Personal website of Adham Shams",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={ibmPlexMono.variable}>
      <head>
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
      </head>
      <body>
        <LayoutWrapper>
          {children}
        </LayoutWrapper>
        <SpeedInsights />
        <Analytics />
      </body>
    </html>
  );
}
