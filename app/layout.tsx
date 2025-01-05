import type { Metadata } from "next";
import { SpeedInsights } from "@vercel/speed-insights/next"
import { DM_Mono } from "next/font/google";
import "./globals.css";

const dmMono = DM_Mono({
  variable: "--font-dm-mono",
  subsets: ["latin"],
  weight: "300"
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
    <html lang="en">
      <body className={`${dmMono.variable}`}>
        {children}
        <SpeedInsights />
      </body>
    </html>
  );
}
