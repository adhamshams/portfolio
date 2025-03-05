import type { Metadata } from "next";
import { SpeedInsights } from "@vercel/speed-insights/next"
import { Barriecito, Delius_Swash_Caps, Eagle_Lake, Gloria_Hallelujah, Jost, IBM_Plex_Mono } from "next/font/google";
import "./globals.css";

const barriecito = Barriecito({
  variable: "--font-barriecito",
  subsets: ["latin"],
  weight: "400"
});

const deliusSwashCaps = Delius_Swash_Caps({
  variable: "--font-delius-swash-caps",
  subsets: ["latin"],
  weight: "400"
});

const eagleLake = Eagle_Lake({
  variable: "--font-eagle-lake",
  subsets: ["latin"],
  weight: "400"
});

const gloriaHallelujah = Gloria_Hallelujah({
  variable: "--font-gloria-hallelujah",
  subsets: ["latin"],
  weight: "400"
});

const jost = Jost({
  variable: "--font-jost",
  subsets: ["latin"],
  weight: "400"
});

const ibmPlexMono = IBM_Plex_Mono({
  variable: "--font-ibm-plex-mono",
  subsets: ["latin"],
  weight: "400"
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
      <head>
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
      </head>
      <body className={`${barriecito.variable} ${deliusSwashCaps.variable} ${eagleLake.variable} ${gloriaHallelujah.variable} ${jost.variable} ${ibmPlexMono.variable}`}>
        {children}
        <SpeedInsights />
      </body>
    </html>
  );
}
