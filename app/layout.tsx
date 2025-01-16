import type { Metadata } from "next";
import { SpeedInsights } from "@vercel/speed-insights/next"
import { DM_Mono, Barriecito, Delius_Swash_Caps, Eagle_Lake, Gloria_Hallelujah, Jost, Barrio } from "next/font/google";
import "./globals.css";

const dmMono = DM_Mono({
  variable: "--font-dm-mono",
  subsets: ["latin"],
  weight: "300"
});

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

const barrio = Barrio({
  variable: "--font-barrio",
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
      <body className={`${dmMono.variable} ${barriecito.variable} ${deliusSwashCaps.variable} ${eagleLake.variable} ${gloriaHallelujah.variable} ${jost.variable} ${barrio.variable}`}>
        {children}
        <SpeedInsights />
      </body>
    </html>
  );
}
