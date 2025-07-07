import type { Metadata } from "next";
import { SpeedInsights } from "@vercel/speed-insights/next"
import { Analytics } from "@vercel/analytics/next"
import Overlay from "@/components/overlay";
import "./globals.css";

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
    <html lang="en">
      <head>
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
      </head>
      <body>
        {children}
        <SpeedInsights />
        <Overlay />
        <Analytics />
      </body>
    </html>
  );
}
