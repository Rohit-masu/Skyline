import type { Metadata } from "next";
import { Fraunces, Manrope } from "next/font/google";
import "./globals.css";

// Two families max (brief). next/font self-hosts them at build time.
const fraunces = Fraunces({ variable: "--font-fraunces", subsets: ["latin"], display: "swap" });
const manrope = Manrope({ variable: "--font-manrope", subsets: ["latin"], display: "swap" });

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000"),
  title: { default: "Skyline — Luxury residences above the city", template: "%s · Skyline" },
  description: "Skyline is a 28-storey residential tower with sky gardens, an infinity pool and homes from 1 to 4 BHK.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en" className={`${fraunces.variable} ${manrope.variable} antialiased`}>
      <body>{children}</body>
    </html>
  );
}
