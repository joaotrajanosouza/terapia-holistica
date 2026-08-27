import { defineConfig } from "astro/config";
import sitemap from "@astrojs/sitemap";
import mdx from "@astrojs/mdx";
import react from "@astrojs/react";
import tailwindcss from "@tailwindcss/vite";
import vercel from "@astrojs/vercel";

// Troque pelo domínio final antes de publicar — é usado no sitemap,
// nas tags canônicas e no JSON-LD.
const SITE_URL = "https://terapiaholistica.com.br";

export default defineConfig({
  site: SITE_URL,
  output: "static",
  integrations: [
    mdx(),
    react(),
    sitemap({
      changefreq: "weekly",
      priority: 0.7,
      lastmod: new Date(),
    }),
  ],
  vite: {
    plugins: [tailwindcss()],
    server: {
      host: true,
      allowedHosts: process.env.REPLIT_DEV_DOMAIN
        ? [process.env.REPLIT_DEV_DOMAIN]
        : [],
    },
  },
  image: {
    // Otimização automática de imagens (WebP/AVIF) via astro:assets
    domains: [],
  },
  prefetch: {
    prefetchAll: true,
  },
  adapter: vercel(),
});
