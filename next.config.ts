import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // A local production build (NEXT_DIST_DIR=.next-prod) can run next to `next dev`
  // without the two fighting over one .next folder. Vercel uses the default.
  distDir: process.env.NEXT_DIST_DIR ?? ".next",
  cacheComponents: true,
  partialPrefetching: true,
  reactStrictMode: true,
  poweredByHeader: false,
  images: {
    formats: ["image/avif", "image/webp"],
  },
  turbopack: {
    rules: {
      "*.css": {
        loaders: ["@tailwindcss/turbopack"],
        as: "*.css",
      },
    },
  },
};

export default nextConfig;
