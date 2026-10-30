import type { Metadata } from "next";
import { Fraunces, Manrope } from "next/font/google";
import "./globals.css";

const fraunces = Fraunces({ variable: "--font-fraunces", subsets: ["latin"], display: "swap" });
const manrope = Manrope({ variable: "--font-manrope", subsets: ["latin"], display: "swap" });

// Canonical and Open Graph URLs need an absolute origin. NEXT_PUBLIC_SITE_URL wins if set;
// otherwise Vercel's own production domain (set automatically on every Vercel build); localhost in dev.
const siteUrl =
  process.env.NEXT_PUBLIC_SITE_URL ??
  (process.env.VERCEL_PROJECT_PRODUCTION_URL ? `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}` : "http://localhost:3000");

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: { default: "Skyline — Luxury residences above the city", template: "%s · Skyline" },
  description: "Skyline is a 28-storey residential tower with sky gardens, an infinity pool and homes from 1 to 4 BHK.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${fraunces.variable} ${manrope.variable} antialiased`}>
      <body>{children}</body>
    </html>
  );
}
